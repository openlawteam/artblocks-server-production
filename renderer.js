/*
Copyright 2020 Art Blocks LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
*/
const express = require("express");
const Web3 = require("web3");
const favicon = require("serve-favicon");
const puppeteer = require("puppeteer");
const cors = require("cors");
const path = require("path");
const CombinedStream = require("combined-stream");
const sharp = require("sharp");
const AWS = require("aws-sdk");
const fs = require("fs");
const util = require("util");
const { getTokenAndProject } = require("./lib/queries");

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile);

const { abi } = require("./artifacts/GenArt721.json");
const abi2 = require("./artifacts/GenArt721Core.json").abi;

const renderVideo = require("./lib/renderVideo");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 1234;
const API_KEY = process.env.INFURA_KEY || "e8eb764fee7a447889f1ee79d2f25934";

const s3 = new AWS.S3({
  accessKeyId: process.env.OSS_ACCESS_KEY,
  secretAccessKey: process.env.OSS_SECRET_KEY,
  endpoint: process.env.OSS_ENDPOINT,
});

const currentNetwork = process.env.NETWORK || "mainnet";

const testing = false;
const mediaUrl =
  currentNetwork === "mainnet"
    ? "mainnet.oss.nodechef.com"
    : "rinkeby.oss.nodechef.com";

const queue = new Queue();
let queueRef = {};
let lastSentToRender = [];
let intervalCount = 0;

const web3 = new Web3(`https://${currentNetwork}.infura.io/v3/${API_KEY}`);
const address =
  currentNetwork === "mainnet"
    ? require("./artifacts/GenArt721.json").contractAddressMainnet
    : require("./artifacts/GenArt721.json").contractAddressRinkeby;

const contract = new web3.eth.Contract(abi, address);
const address2 =
  currentNetwork === "mainnet"
    ? require("./artifacts/GenArt721Core.json").contractAddressMainnet
    : require("./artifacts/GenArt721Core.json").contractAddressRinkeby;

const contract2 = new web3.eth.Contract(abi2, address2);

app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "./")));
app.use(express.static("src"));

app.use(cors());
app.use(favicon(path.join(__dirname, "/favicon.ico")));

app.get("/", async (request, response) => {
  response.render("home");
});

app.get("/image/:tokenId/:refresh?", async (request, response) => {
  const blockNumber = await web3.eth.getBlockNumber();
  console.log(blockNumber);
  const file = path.resolve(__dirname, "./src/rendering.png");
  if (!Number.isInteger(Number(request.params.tokenId))) {
    console.log("not integer");
    response.send("invalid request");
  } else {
    const existsData = await checkTokenExists(
      request.params.tokenId,
      currentNetwork
    );
    const projectId = await getProjectId(request.params.tokenId);
    console.log(`exists? ${existsData.exists}`);
    console.log(`token request ${request.params.tokenId}`);
    const Key = `${request.params.tokenId}.png`;

    if (existsData.exists) {
      let scriptJSON = null;
      let hash = null;
      if (existsData.source === "graph") {
        const tokenProjectData = existsData.data;
        const { token } = tokenProjectData;
        const { project } = token;
        hash = token.hash;

        scriptJSON = JSON.parse(project.scriptJSON);
        console.log("graph");
      } else {
        console.log("infura");
        const tokenDetails = await getToken(request.params.tokenId);

        hash = Array.isArray(tokenDetails.hashes)
          ? tokenDetails.hashes[0]
          : tokenDetails.hashes;
        const scriptInfo =
          projectId < 3
            ? await contract.methods.projectScriptInfo(projectId).call()
            : await contract2.methods.projectScriptInfo(projectId).call();
        scriptJSON = scriptInfo[0] && JSON.parse(scriptInfo[0]);
      }

      let ratio = 1;
      try {
        ratio = eval(scriptJSON.aspectRatio ? scriptJSON.aspectRatio : 1);
      } catch (evalErr) {
        console.log("evalErr, defaulting to ratio of 1", evalErr);
      }

      console.log(
        "I'm the renderer and the hash from Infura for tokenId: " +
          request.params.tokenId +
          " is: " +
          hash
      );

      if (request.params.refresh) {
        /////To add to queue
        /*
        let count = 0;
        if (!queueRef[request.params.tokenId]) {
          console.log("adding to queue");
          queueRef[request.params.tokenId] = true;
          queue.enqueue([request.params.tokenId, ratio, blockNumber]);
        }
        */

        serveScriptResultRefresh(request.params.tokenId, ratio).then(
          (result) => {
            console.log(`serving: ${request.params.tokenId}`);
            response.set("Content-Type", "image/png");
            response.send(result);
          }
        );
      } else {
        const params = {
          Bucket: currentNetwork,
          Key,
        };
        s3.getObject(params, (err) => {
          if (err) {
            console.log("first get err", err);
            let count = 0;
            if (!queueRef[request.params.tokenId]) {
              console.log("adding to queue");
              queueRef[request.params.tokenId] = true;
              queue.enqueue([request.params.tokenId, ratio, blockNumber]);
            }
            const checkForImage = setInterval(() => {
              s3.getObject(params, (checkImageErr) => {
                if (!checkImageErr) {
                  clearInterval(checkForImage);
                  // Files larger then 5mb must be retreived in chunks
                  s3.headObject(params)
                    .promise()
                    .then((res) => {
                      console.log(`stream size: ${res.ContentLength}`);
                      if (res.ContentLength < 5000000) {
                        const data = s3
                          .getObject({
                            Bucket: currentNetwork,
                            Key,
                          })
                          .createReadStream();
                        data.on("error", (singleError) => {
                          console.error(singleError);
                        });

                        console.log("Returning single stream");

                        response.writeHead(200, {
                          "Content-Type": "image/png",
                        });
                        data.pipe(response);
                      } else {
                        const numStreams = Math.ceil(
                          res.ContentLength / 5000000
                        );
                        const dataArray = [];
                        let range;
                        for (let s = 0; s < numStreams; s += 1) {
                          if (s === 0) {
                            range = "bytes=0-5000000";
                          } else if (s === numStreams - 1) {
                            range = `bytes=${s * 5000000 + 1}-${
                              res.ContentLength
                            }`;
                          } else {
                            range = `bytes=${s * 5000000 + 1}-${
                              s * 5000000 + 5000000
                            }`;
                          }
                          const KeyMultiple = `${request.params.tokenId}.png`;
                          const data = s3
                            .getObject({
                              Bucket: currentNetwork,
                              Key: KeyMultiple,
                              Range: range,
                            })
                            .createReadStream();
                          console.log(`Pushing stream ${s} to stream array.`);
                          dataArray.push(data);
                        }
                        const combinedStream = CombinedStream.create();
                        for (let t = 0; t < numStreams; t += 1) {
                          combinedStream.append(dataArray[t]);
                        }
                        console.log("Returning combined streams");
                        response.writeHead(200, {
                          "Content-Type": "image/png",
                        });
                        combinedStream.pipe(response);
                      }
                    })
                    .catch((errHead) => {
                      console.log("s3HeadObject err:", errHead);
                      response.send(errHead);
                    });
                }
              });
              console.log(`interval: ${queue.getLength()}`);
              count += 1;
              console.log(count);
              if (count > 20) {
                response.sendFile(file);
                clearInterval(checkForImage);
              }
            }, 5000);
          } else {
            // Files larger then 5mb must be retreived in chunks
            s3.headObject(params)
              .promise()
              .then((res) => {
                console.log(`stream size:${res.ContentLength}`);
                if (res.ContentLength < 5000000) {
                  const data = s3
                    .getObject({
                      Bucket: currentNetwork,
                      Key,
                    })
                    .createReadStream();
                  data.on("error", (singleError) => {
                    console.error(singleError);
                  });

                  console.log("Returning single stream");

                  response.writeHead(200, { "Content-Type": "image/png" });
                  data.pipe(response);
                } else {
                  const numStreams = Math.ceil(res.ContentLength / 5000000);
                  const dataArray = [];
                  let range;
                  for (let s = 0; s < numStreams; s += 1) {
                    if (s === 0) {
                      range = "bytes=0-5000000";
                    } else if (s === numStreams - 1) {
                      range = `bytes=${s * 5000000 + 1}-${res.ContentLength}`;
                    } else {
                      range = `bytes=${s * 5000000 + 1}-${
                        s * 5000000 + 5000000
                      }`;
                    }
                    const data = s3
                      .getObject({
                        Bucket: currentNetwork,
                        Key,
                        Range: range,
                      })
                      .createReadStream();
                    console.log(`Pushing stream ${s} to stream array.`);
                    dataArray.push(data);
                  }
                  const combinedStream = CombinedStream.create();
                  for (let t = 0; t < numStreams; t += 1) {
                    combinedStream.append(dataArray[t]);
                  }
                  console.log("Returning combined streams");
                  response.writeHead(200, { "Content-Type": "image/png" });
                  combinedStream.pipe(response);
                }
              })
              .catch((errHead) => {
                console.log("s3HeadObject err:", errHead);
                response.send(errHead);
              });
          }
        });
      }
    } else {
      response.send("token does not exist");
    }
  }
});

app.get("/video/:tokenId/:refresh?", async (request, response) => {
  // const file = path.resolve(__dirname, "./src/rendering.png");
  if (!Number.isInteger(Number(request.params.tokenId))) {
    console.log("not integer");
    response.send("invalid request");
  } else {
    const projectId = await getProjectId(request.params.tokenId);
    const tokensOfProject =
      projectId < 3
        ? await contract.methods.projectTokenInfo(projectId).call()
        : await contract2.methods.projectTokenInfo(projectId).call();
    const exists =
      request.params.tokenId <
      Number(projectId) * 1000000 + Number(tokensOfProject[2]);
    const scriptInfo =
      projectId < 3
        ? await contract.methods.projectScriptInfo(projectId).call()
        : await contract2.methods.projectScriptInfo(projectId).call();
    const scriptJSON = scriptInfo[0] && JSON.parse(scriptInfo[0]);
    // eslint-disable-next-line
    const ratio = eval(scriptJSON.aspectRatio ? scriptJSON.aspectRatio : 1);

    // const delay = eval(scriptJSON.delay);
    console.log(`exists? ${exists}`);
    console.log(`token request ${request.params.tokenId}`);
    const videoTokenKey = `${request.params.tokenId}.mp4`;
    if (request.params.refresh) {
      // TODO: add refresh logic
      await serveScriptVideo(request.params.tokenId, ratio, true);
      response.redirect(`https://${mediaUrl}/${request.params.tokenId}.mp4`);
      // serveScriptResultRefresh(request.params.tokenId, ratio).then((result) => {
      //   console.log(`serving: ${request.params.tokenId}`);
      //   response.set("Content-Type", "image/png");
      //   response.send(result);
      // });
    } else {
      const checkVideoExistsParams = {
        Bucket: currentNetwork,
        Key: videoTokenKey,
      };
      try {
        await s3.getObject(checkVideoExistsParams).promise();

        response.redirect(`https://${mediaUrl}/${request.params.tokenId}.mp4`);
      } catch (err) {
        if (!queueRef[request.params.tokenId]) {
          console.log("Video does not yet exist, adding to queue");
          queueRef[request.params.tokenId] = true;
          queue.enqueue([`${request.params.tokenId}-video`, ratio]);
        }

        // max timeout 2 min
        const maxTimeout = 120000;
        const checkForVideoLoopStarted = Date.now();
        const checkForVideo = setInterval(async () => {
          try {
            await s3.getObject(checkVideoExistsParams).promise();
            clearInterval(checkForVideo);

            response.redirect(
              `https://${mediaUrl}/${request.params.tokenId}.mp4`
            );
          } catch (errCheckLoop) {
            console.log(
              `awaiting video render , interval: ${queue.getLength()}`
            );

            if (Date.now - checkForVideoLoopStarted >= maxTimeout) {
              response.sendDate();
              clearInterval(checkForVideo);
            }
          }
        }, 5000);
      }
    }
  }
});

setInterval(async () => {
  const qBlockNumber = await web3.eth.getBlockNumber();
  console.log("Running Render Interval");
  console.log(`queue length: ${queue.getLength()}`);
  console.log(`queue obj:  ${JSON.stringify(queueRef)}`);
  console.log(`lastSent: ${lastSentToRender} \n`);
  console.log(`current Block Number: ${qBlockNumber}`);

  if (queue.getLength() > 0) {
    const nextToken = queue.peek();
    console.log(nextToken);
    if (
      (nextToken[0] !== lastSentToRender[0] || intervalCount > 10) &&
      qBlockNumber - nextToken[2] >= 3
    ) {
      console.log(`render triggered for token: ${nextToken[0]}`);
      console.log("reset intervalCount");
      lastSentToRender = nextToken;
      intervalCount = 0;
      if (nextToken[0].indexOf("-video") > -1) {
        const tokenIdNextToken = nextToken[0].split("-video")[0];
        serveScriptVideo(tokenIdNextToken, nextToken[1]);
      } else {
        serveScriptResult(nextToken[0], nextToken[1]);
      }
    } else {
      console.log("not enough blocks have passed");
      intervalCount += 1;
    }
  } else {
    queueRef = {};
    lastSentToRender = [];
  }
}, 5000);

async function renderAndUploadVideo(tokenId, tokenKey, ratio) {
  let url;
  const width = Math.floor(ratio <= 1 ? 400 * ratio : 400);
  const height = Math.floor(ratio <= 1 ? 400 : 400 / ratio);
  try {
    if (testing) {
      url = `http://localhost:1234/generator/${tokenId}`;
    } else {
      url =
        currentNetwork === "rinkeby"
          ? `https://rinkebyapi.artblocks.io/generator/${tokenId}`
          : `https://api.artblocks.io/generator/${tokenId}`;
    }

    const video = await renderVideo(url, 10, width, height);
    const videoFileContent = await readFile(video);
    const uploadVideoParams = {
      Bucket: currentNetwork,
      Key: tokenKey,
      Body: videoFileContent,
      ContentType: "video/mp4",
    };

    try {
      const uploadRes = await s3.upload(uploadVideoParams).promise();
      console.log(`Video file uploaded successfully: ${uploadRes.Location}`);
      return true;
    } catch (uploadErr) {
      console.log(`${tokenId}| this is the s3 upload error: ${uploadErr}`);
      return uploadErr;
    }
  } catch (puppeteerErr) {
    console.log(`${tokenId}| this is the puppeteer error: ${puppeteerErr}`);
    return puppeteerErr;
  }
}

async function serveScriptVideo(tokenId, ratio, refresh) {
  console.log(`Running Puppeteer: ${tokenId}`);
  const tokenKey = `${tokenId}.mp4`;
  const checkVideoExistsParams = { Bucket: currentNetwork, Key: tokenKey };
  if (refresh) {
    await renderAndUploadVideo(tokenId, tokenKey, ratio);
    return true;
  }

  try {
    await s3.getObject(checkVideoExistsParams).promise();
    console.log(`I'm the renderer. Token ${tokenId} already exists.`);
    queue.dequeue();
    return true;
  } catch (err) {
    await renderAndUploadVideo(tokenId, tokenKey, ratio);
    queue.dequeue();
    return true;
  }
}

async function uploadToS3(params, maxRetries) {
  const upload = async () => {
    try {
      console.log(`Attempting to upload file`, params.Key, params.Bucket);
      const uploadRes = await s3.upload(params).promise();
      console.log(`file uploaded: ${uploadRes.Location}`);
      return;
    } catch (uploadErr) {
      console.log(`s3 upload error: ${uploadErr}`);
      throw uploadErr;
    }
  };

  for (let i = 0; i < maxRetries; i += 1) {
    console.log("Attempt #", i + 1);
    try {
      await upload();

      const { Bucket, Key } = params;
      const getRes = await s3
        .getObject({
          Bucket,
          Key,
        })
        .promise();
      return getRes;
    } catch (err) {
      console.log("err", err);
      const timeoutAmount = 500 * (i + 1);
      console.log(`Waiting ${timeoutAmount} ms...`);
      await timeout(timeoutAmount);
      console.log("Retrying...");
    }
  }
  throw new Error(`Failed retrying ${maxRetries} times`);

  // await upload();

  // while (retries <= maxRetries) {
  //   const { Bucket, Key } = params;
  //   try {
  //     const getRes = await s3
  //       .getObject({
  //         Bucket,
  //         Key,
  //       })
  //       .promise();
  //     console.log(getRes);
  //     break;
  //   } catch (err) {
  //     console.log(err);
  //     retries += 1;
  //     upload
  //   }

  //   break;
  // }
}

async function renderImage(tokenId, tokenKey, ratio) {
  let url;
  console.log(`I'm the renderer. We are rendering ${tokenId}`);
  const width = Math.floor(ratio <= 1 ? 800 * ratio : 800);
  const height = Math.floor(ratio <= 1 ? 800 : 800 / ratio);
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    console.log(`Renderer: puppeteer launched.`);
    const page = await browser.newPage();
    console.log(`Renderer: opening new page.`);
    await page.setViewport({
      width,
      height,
      deviceScaleFactor: 2,
    });
    if (testing) {
      await page.goto(`http://localhost:8080/generator/${tokenId}`);
    } else {
      url =
        currentNetwork === "rinkeby"
          ? `https://rinkebyapi.artblocks.io/generator/${tokenId}`
          : `https://api.artblocks.io/generator/${tokenId}`;
      await page.goto(url);
    }

    let pId = Math.floor(tokenId / 1000000);
    if (currentNetwork === "rinkeby") {
      await timeout(pId === 36 ? 20000 : 500);
    } else {
      await timeout(pId === 39 ? 20000 : pId === 52 ? 4000 : 500);
    }
    console.log(`Renderer: navigated to url`);

    const image = await page.screenshot();
    console.log(`Renderer: captured screenshot`);
    await browser.close();
    const imageResizer = Buffer.from(image);

    const resizedImage = await sharp(imageResizer)
      .resize(Math.round(width), Math.round(height))
      .png()
      .toBuffer();

    const params1 = {
      Bucket: currentNetwork,
      Key: tokenKey,
      ContentType: "image/png",
      Body: image,
    };
    const params2 = {
      Bucket: currentNetwork === "rinkeby" ? "rinkthumb" : "mainthumb",
      Key: tokenKey,
      ContentType: "image/png",
      Body: resizedImage,
    };
    await uploadToS3(params1, 10);
    await uploadToS3(params2, 10);

    return true;
  } catch (puppeteerErr) {
    return puppeteerErr;
  }
}

// TODO: lets use async/await with our s3 calls
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/using-async-await.html
async function serveScriptResult(tokenId, ratio, refresh) {
  console.log(`Running Puppeteer: ${tokenId}, refresh: ${refresh}`);
  const tokenKey = `${tokenId}.png`;
  const checkImageExistsParams = { Bucket: currentNetwork, Key: tokenKey };
  if (refresh) {
    console.log("Refreshed Render Image Running....");
    await renderImage(tokenId, tokenKey, ratio);
    return true;
  }
  try {
    console.log("checking to see if token exists", checkImageExistsParams);
    await s3.getObject(checkImageExistsParams).promise();
    console.log(`I'm the renderer. Token ${tokenId} already exists.`);
    queue.dequeue();
    return true;
  } catch (err) {
    console.log(err);
    await renderImage(tokenId, tokenKey, ratio);
    queue.dequeue();
    return true;
  }
}

// TODO: this and the above function can be simplified into one,
// just need to add another argument that can be used as a flag to refresh if needed
async function serveScriptResultRefresh(tokenId, ratio) {
  console.log(`Running Puppeteer: ${tokenId}`);

  let url;
  const width = Math.floor(ratio <= 1 ? 600 * ratio : 600);
  const height = Math.floor(ratio <= 1 ? 600 : 600 / ratio);
  const tokenKey = `${tokenId}.png`;

  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setViewport({
      width,
      height,
      deviceScaleFactor: 2,
    });

    if (testing) {
      await page.goto(`http://localhost:1234/generator/${tokenId}`);
    } else {
      url =
        currentNetwork === "rinkeby"
          ? `https://rinkebyapi.artblocks.io/generator/${tokenId}`
          : `https://api.artblocks.io/generator/${tokenId}`;
      await page.goto(url);
    }

    let pId = Math.floor(tokenId / 1000000);
    if (currentNetwork === "rinkeby") {
      await timeout(pId === 36 ? 20000 : 500);
    } else {
      await timeout(pId === 39 ? 20000 : pId === 52 ? 4000 : 500);
    }
    const image = await page.screenshot();

    await browser.close();

    const imageResizer = Buffer.from(image);
    const resizedImage = sharp(imageResizer)
      .resize(Math.round(width), Math.round(height))
      .png();

    const params1 = {
      Bucket: currentNetwork,
      Key: tokenKey,
      ContentType: "image/png",
      Body: image,
    };

    const params2 = {
      Bucket: currentNetwork === "rinkeby" ? "rinkthumb" : "mainthumb",
      Key: tokenKey,
      ContentType: "image/png",
      Body: resizedImage,
    };

    // Uploading files to the bucket
    s3.upload(params1, (err, data) => {
      if (err) {
        throw err;
      }
      console.log(
        `Full sized refreshed file uploaded successfully. ${data.Location}`
      );
    });
    s3.upload(params2, (err, data) => {
      if (err) {
        throw err;
      }
      console.log(`Refreshed thumnail uploaded successfully. ${data.Location}`);
    });
    return image;
  } catch (error) {
    console.log(`${tokenId}| this is the error: ${error}`);
    return error;
  }
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getToken(tokenId) {
  const projectId = await getProjectId(tokenId);
  const hashes = await getTokenHashes(tokenId);
  return { tokenId, projectId, hashes };
}

async function getTokenHashes(tokenId) {
  if (tokenId < 3000000) {
    const result = await contract.methods.showTokenHashes(tokenId).call();
    return result;
  }
  const result = await contract2.methods.tokenIdToHash(tokenId).call();
  return result;
}

async function getProjectId(tokenId) {
  // console.log(`projectId is: ${Math.floor(tokenId / 1000000)}`);
  return Math.floor(tokenId / 1000000);
}

async function checkTokenExists(tokenId, network) {
  if (network === "mainnet") {
    const tokenAndProjectData = await getTokenAndProject(tokenId);

    const existsGraph = tokenAndProjectData.token;

    if (existsGraph) {
      return { exists: true, source: "graph", data: tokenAndProjectData };
    }

    let providerHash = await getTokenHashes(tokenId);
    // extract if is array
    providerHash = Array.isArray(providerHash) ? providerHash[0] : providerHash;

    const existsInfura =
      providerHash !==
        "0x0000000000000000000000000000000000000000000000000000000000000000" &&
      providerHash;

    if (existsInfura) {
      return { exists: true, source: "provider", data: { hash: providerHash } };
    }
  } else {
    let providerHash = await getTokenHashes(tokenId);
    // extract if is array
    providerHash = Array.isArray(providerHash) ? providerHash[0] : providerHash;

    const existsInfura =
      providerHash !==
        "0x0000000000000000000000000000000000000000000000000000000000000000" &&
      providerHash;

    if (existsInfura) {
      return { exists: true, source: "provider", data: { hash: providerHash } };
    }
  }

  return { exists: false, source: "both", data: null };
}
/* eslint-disable */
// prettier-ignore
function Queue(){var a=[],b=0;this.getLength=function(){return a.length-b};this.isEmpty=function(){return 0==a.length};this.enqueue=function(b){a.push(b)};this.dequeue=function(){if(0!=a.length){var c=a[b];2*++b>=a.length&&(a=a.slice(b),b=0);return c}};this.peek=function(){return 0<a.length?a[b]:void 0}}
/* eslint-enable */

app.get("/renderimagerange/:projectId/:startId/:endId?", async (request) => {
  const refresh = Boolean(request.query.refresh) || false;
  request.setTimeout(0);
  const projectId = request.params.projectId;
  console.log(projectId);
  const scriptInfo =
    projectId < 3
      ? await contract.methods.projectScriptInfo(projectId).call()
      : await contract2.methods.projectScriptInfo(projectId).call();
  const scriptJSON = scriptInfo[0] && JSON.parse(scriptInfo[0]);
  const ratio = eval(scriptJSON.aspectRatio ? scriptJSON.aspectRatio : 1);
  const tokensOfProject =
    projectId < 3
      ? await contract.methods.projectTokenInfo(projectId).call()
      : await contract2.methods.projectTokenInfo(projectId).call();
  const maxTokenId = Number(projectId) * 1000000 + Number(tokensOfProject[2]);
  console.log("hoo", maxTokenId);
  if (request.params.endId) {
    for (
      let i = Number(request.params.startId);
      i < Number(request.params.endId);
      i += 1
    ) {
      const tokenId = Number(projectId) * 1000000 + i;
      console.log(tokenId);
      await serveScriptResult(tokenId, ratio, refresh);
      console.log("RenderImageRange: Run completed for ", tokenId, "\n\n");
    }
  } else {
    for (
      let i = Number(request.params.startId);
      i < Number(tokensOfProject[2]);
      i += 1
    ) {
      const tokenId = Number(projectId) * 1000000 + i;
      console.log("ay", tokenId);
      await serveScriptResult(tokenId, ratio, refresh);
      console.log("RenderImageRange: Run completed for ", tokenId, "\n\n");
    }
  }

  console.log("local range image render complete");
});

app.listen(PORT, () =>
  console.log(`Art Blocks listening at http://localhost:${PORT}\n`)
);
