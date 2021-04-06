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

const cors = require("cors");
const path = require("path");
const beautify = require("js-beautify").js;

const imgRequest = require("request");
const CombinedStream = require("combined-stream");
require("dotenv").config();

const AWS = require("aws-sdk");
const plugins = require("./plugins.js");
const {
  getTokenAndProject,
  getProject,
  getPlatform,
} = require("./lib/queries");

const app = express();

const PORT = process.env.PORT || 8080;
const API_KEY = process.env.INFURA_KEY || "e8eb764fee7a447889f1ee79d2f25934";

const s3 = new AWS.S3({
  accessKeyId: process.env.OSS_ACCESS_KEY,
  secretAccessKey: process.env.OSS_SECRET_KEY,
  endpoint: process.env.OSS_ENDPOINT,
});

const currentNetwork = "mainnet";
const curatedProjects =
  currentNetwork === "mainnet"
    ? [0, 1, 2, 3, 4, 7, 8, 9, 10, 11, 12, 13, 17, 21, 23, 27, 28, 29, 35, 39,40,41]
    : [];
const playgroundProjects =
  currentNetwork === "mainnet"
    ? [6, 14, 15, 16, 18, 19, 20, 22, 24, 25, 26, 30, 37,42]
    : [];
const testing = false;

const web3 = new Web3(`https://${currentNetwork}.infura.io/v3/${API_KEY}`);
const { abi } = require("./artifacts/GenArt721.json");
const address =
  currentNetwork === "mainnet"
    ? require("./artifacts/GenArt721.json").contractAddressMainnet
    : require("./artifacts/GenArt721.json").contractAddressRinkeby;

const contract = new web3.eth.Contract(abi, address);
const abi2 = require("./artifacts/GenArt721Core.json").abi;
const address2 =
  currentNetwork === "mainnet"
    ? require("./artifacts/GenArt721Core.json").contractAddressMainnet
    : require("./artifacts/GenArt721Core.json").contractAddressRinkeby;

const contract2 = new web3.eth.Contract(abi2, address2);

console.log(address, address2);

app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "./")));
app.use(express.static("src"));

app.use(cors());
app.use(favicon(path.join(__dirname, "/favicon.ico")));

app.get("/project/:projectId", async (request, response) => {
  if (!Number.isInteger(Number(request.params.projectId))) {
    console.log("not integer");
    response.send("invalid request");
  } else {
    const { platform } = await getPlatform();
    const { nextProjectId } = platform;

    const exists = Number(request.params.projectId) < Number(nextProjectId);
    if (exists) {
      const { project } = await getProject(request.params.projectId);
      project.scriptJSON = JSON.parse(project.scriptJSON);
      const { script } = project;
      const beautifulScript = beautify(script, {
        indent_size: 5,
        space_in_empty_paren: true,
      });
      response.render("projectInfo", {
        name: project.name,
        artist: project.artistName,
        description: project.description,
        website: project.website,
        license: project.license,
        scriptJSON: JSON.stringify(project.scriptJSON),
        scriptType: project.scriptJSON ? project.scriptJSON.type : "",
        scriptVersion: project.scriptJSON ? project.scriptJSON.version : "",
        scriptRatio: project.scriptJSON ? project.scriptJSON.aspectRatio : "",
        instructions: project.scriptJSON ? project.scriptJSON.instructions : "",
        script: beautifulScript,
        /// IS THIS RIGHT?
        hashesGen: project.useHashString,
        isDynamic: project.dynamic,
        artistAddress: project.artistAddress,
        additionalPayee:
          project.additionalPayee ||
          "0x0000000000000000000000000000000000000000",
        additionalPayeePercentage: project.additionalPayeePercentage || "0",
        price: web3.utils.fromWei(project.pricePerTokenInWei, "ether"),
        currency: project.currencySymbol ? project.currencySymbol : "ETH",
        currencyAddress:
          project.currencyAddress &&
          project.currencyAddress !==
            "0x0000000000000000000000000000000000000000"
            ? project.currencyAddress
            : "N/A",
        invocations: project.invocations,
        tokensOfProject: project.tokens.map((token) => {
          return token.id;
        }),
        maxInvocations: project.maxInvocations,
        active: !project.paused,
        paused: Boolean(project.paused),
      });
    } else {
      response.send("project does not exist");
    }
  }
});

app.get("/", async (request, response) => {
  response.render("home");
});

app.get("/platform", async (request, response) => {
  const platformInfo = await getPlatformInfo();
  const { platform } = await getPlatform();

  const projects = [];
  for (let i = 0; i < platformInfo.nextProjectId; i += 1) {
    projects.push(i);
  }

  response.render("platformInfo", {
    name: "Art Blocks",
    symbol: "BLOCKS",
    address: [address, address2],
    totalSupply: platformInfo.totalSupply,
    projects,
    nextProjectId: platform.nextProjectId,
  });
});

app.get("/token/:tokenId", async (request, response) => {
  if (!Number.isInteger(Number(request.params.tokenId))) {
    console.log("not integer");
    response.send("invalid request");
  } else {
    const tokenAndProjectData = await getTokenAndProject(
      request.params.tokenId
    );

    const exists = tokenAndProjectData.token;
    console.log(`exists? ${exists}`);
    console.log(`token request ${request.params.tokenId}`);

    if (exists) {
      const { hash, project } = tokenAndProjectData.token;
      const projectId = Number(project.id);

      let traitsArray;
      let features = [];
      if (currentNetwork !== "rinkeby") {
        features = plugins.features(
          projectId,
          hash,
          Number(request.params.tokenId)
        );
      }
      if (currentNetwork === "mainnet") {
        // const featuresObj = features[0].map((x) => {
        //   const obj = {};
        //   obj.trait_type = "feature";
        //   obj.value = x;
        //   return obj;
        // });
        traitsArray = features[1].map((x) => {
          const traitObj = {};
          traitObj.trait_type = project.name;
          traitObj.value = x;
          return traitObj;
        });

        const firstObj = {};
        const isPlural = project.name.slice(-1) === "s" ? "" : "s";
        firstObj.trait_type = project.name;
        firstObj.value = `All ${project.name}${isPlural}`;

        if (traitsArray.length > 0) {
          traitsArray.splice(0, 0, firstObj);
        } else {
          traitsArray = [firstObj];
        }
      }

      let tokenType = curatedProjects.includes(projectId)
        ? "Curated"
        : "Factory";
      if (playgroundProjects.includes(projectId)) {
        tokenType = "Playground";
      }
      const tokenName = `${project.name} #${
        request.params.tokenId - projectId * 1000000
      }`;
      const platform = `Art Blocks ${tokenType}`;
      let series;
      if (projectId < 8) {
        series = "1";
      } else if (projectId >= 8 && projectId < 36) {
        series = "2";
      } else {
        series = "3";
      }

      const tokenSeries = curatedProjects.includes(projectId) ? series : "N/A";

      const tokenDescription = `${project.description} ${
        features.length > 0
          ? `Additional project feature(s) => ${features[0].join(", ")}`
          : ""
      }`;
      const tokenExternalUrl = `${
        currentNetwork === "mainnet"
          ? "https://www.artblocks.io/"
          : "https://rinkeby.artblocks.io/"
      }token/${request.params.tokenId}`;
      const tokenCollectionName = `${project.name} by ${project.artistName}`;
      const fallbackTraits = [
        {
          trait_type: project.name,
          value: "all",
        },
      ];
      const tokenTraits =
        traitsArray && traitsArray.length > 0 ? traitsArray : fallbackTraits;
      const usesHash = project.useHashString;
      const tokenImage =
        project.baseUri &&
        `${project.baseUri.slice(0, -6)}image/${request.params.tokenId}`;

      project.scriptJSON = JSON.parse(project.scriptJSON);

      response.json({
        platform,
        name: tokenName,
        curation_status: tokenType.toLowerCase(),
        series: tokenSeries,
        description: tokenDescription,
        external_url: tokenExternalUrl,
        artist: project.artistName,
        royaltyInfo: {
          artistAddress: project.artistAddress,
          additionalPayee:
            project.additionalPayee ||
            "0x0000000000000000000000000000000000000000",
          additionalPayeePercentage: project.additionalPayeePercentage || "0",
          royaltyFeeByID: project.royaltyPercentage || "0",
        },
        /*
           "traits":[
             {"trait_type":"Project",
             "value":projectDetails.projectDescription.projectName+ " by "+projectDetails.projectDescription.artistName}
           ],
           */
        collection_name: tokenCollectionName,
        traits: tokenTraits,
        payout_address: "0x8E9398907d036e904ffF116132ff2Be459592277",
        features: features[0] /* featuresObj, */,
        website: project.website,
        "is dynamic": project.dynamic,
        "script type": project.scriptJSON ? project.scriptJSON.type : "",
        "aspect ratio (w/h)": project.scriptJSON
          ? project.scriptJSON.aspectRatio
          : "",
        "uses hash": usesHash,
        tokenID: request.params.tokenId,
        "token hash": hash,
        license: project.license,
        image: tokenImage || "",
      });
    } else {
      response.send("token does not exist");
    }
  }
});

app.get("/generator/:tokenId/:svg?", async (request, response) => {
  if (!Number.isInteger(Number(request.params.tokenId))) {
    console.log("not integer");
    response.send("invalid request");
  } else {
    const tokenAndProjectData = await getTokenAndProject(
      request.params.tokenId
    );

    const exists = tokenAndProjectData.token;
    console.log(`exists? ${Boolean(exists)}`);
    console.log(`token request ${request.params.tokenId}`);

    if (exists) {
      const { hash, project } = tokenAndProjectData.token;
      project.scriptJSON = JSON.parse(project.scriptJSON);

      console.log("Generator running for token "+request.params.tokenId + " using hash: "+hash);

      const { script } = project;
      const data = buildData(hash, request.params.tokenId);
      if (project.scriptJSON){
      if (project.scriptJSON.type === "p5js") {
        response.render(
          request.params.svg === "svg" && Number(project.id) === 0
            ? "generator_p5js_svg"
            : request.params.svg === "svg" && Number(project.id) === 33
            ? "generator_p5js_svg_emp"
            : "generator_p5js",
          { script, data }
        );
      } else if (project.scriptJSON.type === "processing") {
        response.render("generator_processing", { script, data });
      } else if (project.scriptJSON.type === "a-frame") {
        response.render("generator_aframe", { script, data });
      } else if (project.scriptJSON.type === "megavox") {
        response.render("generator_megavox", { script, data });
      } else if (project.scriptJSON.type === "vox") {
        response.render("generator_vox", { script, data });
      } else if (project.scriptJSON.type === "js") {
        response.render(
          request.params.svg === "obj" && Number(project.id) === 9
            ? "generator_js_obj"
            : "generator_js",
          { script, data }
        );
      } else if (project.scriptJSON.type === "svg") {
        response.render("generator_svg", { script, data });
      } else if (project.scriptJSON.type === "custom") {
        response.send(`<script>${data}</script>${script}`);
      } else if (project.scriptJSON.type === "regl") {
        response.render("generator_regl", { script, data });
      } else {
        response.render("generator_threejs", { script, data });
      }
    }
        else {
        response.send("token script not defined");
      }
    } else {
      response.send("token does not exist");
    }
  }
});

// app.get("/vox/:tokenId", async (request, response) => {
//   if (!Number.isInteger(Number(request.params.tokenId))) {
//     console.log("not integer");
//     response.send("invalid request");
//   } else {
//     const projectId = await getProjectId(request.params.tokenId);
//     const tokensOfProject =
//       projectId < 3
//         ? await contract.methods.projectShowAllTokens(projectId).call()
//         : await contract2.methods.projectShowAllTokens(projectId).call();
//     const exists = tokensOfProject.includes(request.params.tokenId);
//     console.log(`exists? ${exists}`);
//     console.log(`token request ${request.params.tokenId}`);

//     if (exists) {
//       const tokenDetails = await getToken(request.params.tokenId);
//       const projectDetails = await getDetails(tokenDetails.projectId);
//       if (
//         projectDetails.projectScriptInfo.scriptJSON.type === "vox" ||
//         projectDetails.projectScriptInfo.scriptJSON.type === "megavox"
//       ) {
//         const script = await getScript(
//           tokenDetails.projectId,
//           projectDetails.projectScriptInfo.scriptCount
//         );
//         const data = buildData(tokenDetails.hashes, request.params.tokenId);
//         const scriptAndData = `${data}${script}`;
//         const evalScript = eval(scriptAndData);
//         // const array = voxx.export();
//         response.send(toBuffer(array));
//       } else {
//         response.send("token not a vox file");
//       }
//     } else {
//       response.send("token does not exist");
//     }
//   }
// });

app.get("/image/:tokenId/:refresh?", async (request, response) => {
  // Is request and integer and does token exist?

  if (!Number.isInteger(Number(request.params.tokenId))) {
    console.log("not integer");
    response.send("invalid request");
  } else {
    const tokenAndProjectData = await getTokenAndProject(
      request.params.tokenId
    );

    const exists = tokenAndProjectData.token;
    console.log(`exists? ${Boolean(exists)}`);
    console.log(`token request ${request.params.tokenId}`);

    if (exists) {
      const tokenKey = `${request.params.tokenId}.png`;

      const params = {
        Bucket: currentNetwork,
        Key: tokenKey,
      };
      s3.getObject(params, (err) => {
        if (err || request.params.refresh) {
          let url;
          console.log("didn't find it or hard refresh");
          if (!testing) {
            if (currentNetwork === "mainnet") {
              const regularUrl = `http://render-engine-mainnet-2-11808.nodechef.com/image/${request.params.tokenId}`;
              const refreshUrl = `${regularUrl}/refresh`;
              url = request.params.refresh ? refreshUrl : regularUrl;
              /*
                    if (isEven(Number(request.params.tokenId))){
                      url = request.params.refresh?"http://render-engine-mainnet-1-11808.nodechef.com/image/"+request.params.tokenId+"/refresh":"http://render-engine-mainnet-1-11808.nodechef.com/image/"+request.params.tokenId;
                    }
                    else {
                      url = request.params.refresh?"http://render-engine-mainnet-2-11808.nodechef.com/image/"+request.params.tokenId+"/refresh":"http://render-engine-mainnet-2-11808.nodechef.com/image/"+request.params.tokenId;
                    }
                    */
            } else {
              const regularUrl = `http://render-engine-rinkeby-1-11808.nodechef.com/image/${request.params.tokenId}`;
              const refreshUrl = `${regularUrl}/refresh`;
              url = request.params.refresh ? refreshUrl : regularUrl;
            }
          } else {
            const regularUrl = `http://localhost:1234/image/${request.params.tokenId}`;
            const refreshUrl = `${regularUrl}/refresh`;
            url = request.params.refresh ? refreshUrl : regularUrl;
          }

          imgRequest
            .get(url)
            .on("response", () => {
              response.writeHead(200, { "Content-Type": "image/png" });
            })
            .on("error", (imgRequestError) => {
              console.log("img req error", imgRequestError);
            })
            .pipe(response);
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
                    Key: tokenKey,
                  })
                  .createReadStream();
                data.on("error", (dataErr) => {
                  console.error(dataErr);
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
                    range = `bytes=${s * 5000000 + 1}-${s * 5000000 + 5000000}`;
                  }
                  const data = s3
                    .getObject({
                      Bucket: currentNetwork,
                      Key: tokenKey,
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
            });
        }
      });
    } else {
      response.send("token does not exist");
    }
  }
});

app.get("/thumb/:tokenId/:refresh?", async (request, response) => {
  const file = path.resolve(__dirname, "./src/rendering.png");

  if (!Number.isInteger(Number(request.params.tokenId))) {
    console.log("not integer");
    response.send("invalid request");
  } else {
    const tokenKey = `${request.params.tokenId}.png`;
    const params = {
      Bucket: currentNetwork === "rinkeby" ? "rinkthumb" : "mainthumb",
      Key: tokenKey,
    };
    s3.getObject(params, (err) => {
      if (err || request.params.refresh) {
        let url;
        console.log("didn't find it");
        if (!testing) {
          const rinkebyUrl = `https://rinkebyapi.artblocks.io/image/${request.params.tokenId}/refresh/`;
          const prodUrl = `https://api.artblocks.io/image/${request.params.tokenId}/refresh/`;
          url = currentNetwork === "rinkeby" ? rinkebyUrl : prodUrl;
        } else {
          url = `http://localhost:1234/image/${request.params.tokenId}/refresh`;
        }
        imgRequest.get(url);
        response.sendFile(file);
      } else {
        const data = s3
          .getObject({
            Bucket: currentNetwork === "rinkeby" ? "rinkthumb" : "mainthumb",
            Key: tokenKey,
          })
          .createReadStream();
        data.on("error", () => {
          console.error(err);
        });
        console.log(`Returning thumb: ${request.params.tokenId}`);
        response.writeHead(200, { "Content-Type": "image/png" });
        data.pipe(response);
      }
    });
  }
});

// async function getToken(tokenId) {
//   const projectId = await getProjectId(tokenId);
//   const hashes = await getTokenHashes(tokenId);
//   return { tokenId, projectId, hashes };
// }

async function getPlatformInfo() {
  const totalSupply =
    (await contract.methods.totalSupply().call()) +
    (await contract2.methods.totalSupply().call());
  const nextProjectId = await contract2.methods.nextProjectId().call();
  const name = await contract.methods.name().call();
  const symbol = await contract.methods.symbol().call();
  return { totalSupply, nextProjectId, name, symbol };
}

function buildData(hashes, tokenId) {
  // to expose token hashes use let hashes = tokenData.hashes[0] (example if only one hash is minted)
  if (tokenId < 3000000) {
    const data = {};
    data.hashes = [hashes];
    data.tokenId = tokenId;
    return `let tokenData = ${JSON.stringify(data)}`;
  }
  const data = {};
  data.hash = hashes;
  data.tokenId = tokenId;
  return `let tokenData = ${JSON.stringify(data)}`;
}

// function isEven(value) {
//   if (value % 2 == 0) return true;
//   else return false;
// }

app.listen(PORT, () =>
  console.log(`Art Blocks listening at http://localhost:${PORT}`)
);
