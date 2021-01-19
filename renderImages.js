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

const express = require('express');
const Web3 = require('web3');
const app = express();
const fs = require('fs');
var favicon = require('serve-favicon')
const puppeteer = require('puppeteer');
const cors = require('cors');
const path = require('path');
var beautify = require('js-beautify').js;
var CombinedStream = require('combined-stream');
const stream = require('stream');
const sharp = require('sharp');

require('dotenv').config()

var zlib = require('zlib');
var AWS = require('aws-sdk');




const PORT = process.env.PORT || 2345;
const API_KEY = process.env.INFURA_KEY;


var s3  = new AWS.S3({
          accessKeyId: process.env.OSS_ACCESS_KEY,
          secretAccessKey: process.env.OSS_SECRET_KEY,
          endpoint: process.env.OSS_ENDPOINT
});



const currentNetwork = "rinkeby";
const testing = false;

let queue = new Queue();

let queueRef={};
let lastSentToRender=[];
let intervalCount=0;

var web3 = new Web3(`https://${currentNetwork}.infura.io/v3/${API_KEY}`);
const {abi} = require('./artifacts/GenArt721.json');
const address = currentNetwork==="mainnet"?require('./artifacts/GenArt721.json').contractAddressMainnet:require('./artifacts/GenArt721.json').contractAddressRinkeby;
const contract = new web3.eth.Contract(abi, address);
const abi2 = require('./artifacts/GenArt721Core.json').abi;
const address2 = currentNetwork==="mainnet"?require('./artifacts/GenArt721Core.json').contractAddressMainnet:require('./artifacts/GenArt721Core.json').contractAddressRinkeby;
const contract2 = new web3.eth.Contract(abi2, address2);

console.log(address, address2);

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static(__dirname+'./'));
app.use(express.static('src'));


app.use(cors());
app.use(favicon(__dirname+'/favicon.ico'));
let pathToHtml = path.join(__dirname, 'index.html');


app.get('/generator/:tokenId', async (request, response) => {
  if (!Number.isInteger(Number(request.params.tokenId))){
    console.log("not integer");
    response.send('invalid request');
  } else {
    const projectId = await getProjectId(request.params.tokenId);
    const tokensOfProject = projectId<3?await contract.methods.projectShowAllTokens(projectId).call():await contract2.methods.projectShowAllTokens(projectId).call();
    const exists = tokensOfProject.includes(request.params.tokenId);


    if (exists){
	    let tokenDetails = await getToken(request.params.tokenId);
	    let projectDetails = await getDetails(tokenDetails.projectId);
	    let script = await getScript(tokenDetails.projectId,projectDetails.projectScriptInfo.scriptCount);
	    let data = buildData(tokenDetails.hashes, request.params.tokenId);

      if (projectDetails.projectScriptInfo.scriptJSON.type==='p5js'){
        response.render('generator_p5js', { script: script, data: data})
      } else if (projectDetails.projectScriptInfo.scriptJSON.type==='processing'){
        response.render('generator_processing', { script: script, data: data})
      } else if (projectDetails.projectScriptInfo.scriptJSON.type==='a-frame'){
        response.render('generator_aframe', { script: script, data: data})
      } else if (projectDetails.projectScriptInfo.scriptJSON.type==='megavox'){
        response.render('generator_megavox', { script: script, data: data})
      } else if (projectDetails.projectScriptInfo.scriptJSON.type==='vox'){
        response.render('generator_vox', { script: script, data: data})
      } else if (projectDetails.projectScriptInfo.scriptJSON.type==='js'){
        response.render('generator_js', { script: script, data: data})
      } else if (projectDetails.projectScriptInfo.scriptJSON.type==='svg'){
        response.render('generator_svg', { script: script, data: data})
      } else if (projectDetails.projectScriptInfo.scriptJSON.type==='custom'){
        response.render('generator_js', { script: script, data: data})
      } else {
       response.render('generator_threejs', { script: script, data: data})
     }
   } else {
       response.send('token does not exist');
     }
  }
});


async function serveScriptResult(tokenId, ratio){
  console.log("Running Puppeteer: "+tokenId);
  queue.dequeue();
  var params = { Bucket: currentNetwork, Key: tokenId+".png" };
    s3.getObject(params, async function(err, data) {
        if (!err) {
          console.log(`I'm the renderer. Token ${tokenId} already exists.`);
          return true;
        } else {
          let url;
          const width = Math.floor(ratio<=1?1200*ratio:1200);
          const height = Math.floor(ratio<=1?1200:1200/ratio);
          try {
            const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
            const page = await browser.newPage();
            await page.setViewport({
              width: width,
              height: height,
              deviceScaleFactor: 2,
            });
            if (testing){
              await page.goto('http://localhost:8080/generator/'+tokenId);
            } else {
              url = currentNetwork==="rinkeby"?'https://rinkebyapi.artblocks.io/generator/'+tokenId:'https://api.artblocks.io/generator/'+tokenId;
              await page.goto(url);
            }
            await timeout(500);
            const image = await page.screenshot();
            await browser.close();

            const imageResizer = Buffer.from(image);
            const resizedImage = sharp(imageResizer).resize(Math.round(width/3),Math.round(height/3)).png();
          const params1 = {
                Bucket: currentNetwork,
                Key: tokenId+".png",
                ContentType: "image/png",
                Body: image
            };
            const params2 = {
                Bucket: currentNetwork==="rinkeby"?"rinkthumb":"mainthumb",
                Key: tokenId+".png",
                ContentType: "image/png",
                Body: resizedImage
            }
            s3.upload(params1, function(err, data) {
                if (err) {
                    throw err;
                }
                console.log(`Full sized file uploaded successfully. ${data.Location}`);
            });
            s3.upload(params2, function(err, data) {
                if (err) {
                    throw err;
                }
                console.log(`Thumnail uploaded successfully. ${data.Location}`);

            });
            return image;
          } catch (error) {
            console.log(tokenId+ '| this is the error: '+error);

          }
        }
      });

}

async function serveScriptResultRefresh(tokenId, ratio){
          console.log("Running Puppeteer: "+tokenId);

          let url;
          const width = Math.floor(ratio<=1?800*ratio:800);
          const height = Math.floor(ratio<=1?800:800/ratio);
          try {

            const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
            const page = await browser.newPage();
            await page.setViewport({
              width: width,
              height: height,
              deviceScaleFactor: 2,
            });
            if (testing){
              await page.goto('http://localhost:8080/generator/'+tokenId);
            } else {
              url = currentNetwork==="rinkeby"?'https://rinkebyapi.artblocks.io/generator/'+tokenId:'https://api.artblocks.io/generator/'+tokenId;
              await page.goto(url);
            }
            await timeout(500);
            const image = await page.screenshot();
            await browser.close();

            const imageResizer = Buffer.from(image);
            const resizedImage = sharp(imageResizer).resize(Math.round(width/3),Math.round(height/3)).png();

            const params1 = {
                Bucket: currentNetwork,
                Key: tokenId+".png",
                ContentType: "image/png",
                Body: image
            };

            const params2 = {
                Bucket: currentNetwork==="rinkeby"?"rinkthumb":"mainthumb",
                Key: tokenId+".png",
                ContentType: "image/png",
                Body: resizedImage
            }

            // Uploading files to the bucket
            s3.upload(params1, function(err, data) {
                if (err) {
                    throw err;
                }
                console.log(`Full sized refreshed file uploaded successfully. ${data.Location}`);
            });
            s3.upload(params2, function(err, data) {
                if (err) {
                    throw err;
                }
                console.log(`Refreshed thumnail uploaded successfully. ${data.Location}`);
            });
            return image;
          } catch (error) {
            console.log(tokenId+ '| this is the error: '+error);
          }
}

app.get("/deletethumb/:tokenId", async (request,response)=>{

  s3.deleteObject({
    Bucket: currentNetwork==="rinkeby"?"rinkthumb":"mainthumb",
    Key: request.params.tokenId+".png"
  },function (err,data){
    console.log(err);
    response.end("Image deleted");
  })

})

app.get("/deleteimage/:tokenId", async (request,response)=>{

  s3.deleteObject({
    Bucket: currentNetwork,
    Key: request.params.tokenId+".png"
  },function (err,data){
    console.log(err);
    response.end("Image deleted");
  })

})

/*
async function renderThumbnail(tokenId, ratio){
  const width = Math.floor(ratio<=1?1200*ratio:1200);
  const height = Math.floor(ratio<=1?1200:1200/ratio);
  var params = { Bucket: currentNetwork, Key: tokenId+".png"};
  const fileSize= s3.headObject(params).promise()
  .then((res) => {
    if (res.ContentLength<5000000){
      const data = s3.getObject({ Bucket: currentNetwork, Key: tokenId+".png"}).promise()
      .then(result=>{
        const imageResizer = Buffer.from(result.Body);
        const resizedImage = sharp(imageResizer).resize(Math.round(width/3),Math.round(height/3)).png();
        const params2 = {
            Bucket: currentNetwork==="rinkeby"?"rinkthumb":"mainthumb",
            Key: tokenId+".png",
            Body: resizedImage
        }

        s3.upload(params2, function(err, data) {
            if (err) {
                throw err;
            }
            console.log(`Thumbnail uploaded successfully. ${data.Location}`);

        });
        return true;
      })

    } else {
      const fileSize= s3.headObject(params).promise()
      .then((res) => {
        console.log("stream size:"+res.ContentLength);
        if (res.ContentLength<5000000){
          const data = s3.getObject({ Bucket: currentNetwork, Key: request.params.tokenId+".png"}).createReadStream();
          data.on('error', function(err) {
            console.error(err);
          });

          console.log("Returning single stream");

          response.writeHead(200,{'Content-Type': 'image/png'});
          data.pipe(response);
        } else {
          let numStreams = Math.ceil(res.ContentLength/5000000);
          let dataArray = [];
          let range;
          for (let s = 0; s<numStreams;s++){
            if (s===0){
              range = "bytes=0-5000000";
            } else if (s===numStreams-1){
              range = `bytes=${(s*5000000)+1}-${res.ContentLength}`;
            } else {
              range = `bytes=${(s*5000000)+1}-${(s*5000000)+5000000}`
            }
            let data = s3.getObject({ Bucket: currentNetwork, Key: request.params.tokenId+".png", Range: range }).createReadStream();
            console.log(`Pushing stream ${s} to stream array.`);
            dataArray.push(data);
          }
          var combinedStream = CombinedStream.create();
          for (let t = 0; t<numStreams;t++){
            combinedStream.append(dataArray[t]);
          }
          console.log("Returning combined streams");
          response.writeHead(200,{'Content-Type': 'image/png'});
          combinedStream.pipe(response);

      const data1 = s3.getObject({ Bucket: currentNetwork, Key: tokenId+".png", Range: 'bytes=0-4000000' }).createReadStream();
      const data2 = s3.getObject({ Bucket: currentNetwork, Key: tokenId+".png", Range: 'bytes=4000001-'+res.ContentLength }).createReadStream();
      data1.on('error', function(err) {
        // NoSuchKey: The specified key does not exist
        console.log("error on stream part 1");
        console.error(err);
      });
      data2.on('error', function(err) {
        // NoSuchKey: The specified key does not exist
        console.log("error on stream part 2");
        console.error(err);
      });
      var combinedStream = CombinedStream.create();
      combinedStream.append(data1);
      combinedStream.append(data2);
      console.log("Returning combined stream");
      //combinedStream.pipe(response);
    }
  });

}
*/

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

async function getToken(tokenId){
  const projectId = await getProjectId(tokenId);
  const hashes = await getTokenHashes(tokenId);
  return {tokenId, projectId, hashes};
}

async function getDetails(projectId){
  const projectDescription = await getProjectDescription(projectId);
  const projectScriptInfo = await getScriptInfo(projectId);
  const projectTokenInfo = await getTokenDetails(projectId);
  const projectURIInfo = await getURIInfo(projectId);
  return {projectDescription, projectScriptInfo, projectTokenInfo, projectURIInfo};
}

async function getScript(projectId, scriptCount){
	let scripts = [];
	for (let i=0;i<scriptCount;i++){
    if (projectId<3){
      let newScript = await contract.methods.projectScriptByIndex(projectId,i).call();
      scripts.push(newScript);
    } else {
      let newScript = await contract2.methods.projectScriptByIndex(projectId,i).call();
      scripts.push(newScript);
    }
	}
	return scripts.join(' ');
}


async function getScriptInfo(projectId){
  if (projectId<3){
    const result = await contract.methods.projectScriptInfo(projectId).call();
    return {scriptJSON:result[0] && JSON.parse(result[0]), scriptCount:result[1], hashesPerToken:result[2], ipfsHash:result[3], locked:result[4], paused:result[5]};
  } else {
    const result = await contract2.methods.projectScriptInfo(projectId).call();
    return {scriptJSON:result[0] && JSON.parse(result[0]), scriptCount:result[1], hashesPerToken:result[2], ipfsHash:result[3], locked:result[4], paused:result[5]};
  }
}

async function getProjectDescription(projectId){
  if (projectId<3){
    const result = await contract.methods.projectDetails(projectId).call();
    return {projectName:result[0], artistName:result[1], description: result[2], artistWebsite:result[3], license:result[4], dynamic:result[5]};
  } else {
    const result = await contract2.methods.projectDetails(projectId).call();
    return {projectName:result[0], artistName:result[1], description: result[2], artistWebsite:result[3], license:result[4], dynamic:result[5]};
  }
}

async function getURIInfo(projectId){
  if (projectId<3){
    const result = await contract.methods.projectURIInfo(projectId).call();
    return {projectBaseURI:result[0], projectBaseIpfsURI:result[1], useIpfs: result[2]};
  } else {
    const result = await contract2.methods.projectURIInfo(projectId).call();
    return {projectBaseURI:result[0], projectBaseIpfsURI:result[1], useIpfs: result[2]};
  }
}

async function getTokenDetails(projectId){
  if (projectId<3){
    const tokens = await contract.methods.projectShowAllTokens(projectId).call();
    const result = await contract.methods.projectTokenInfo(projectId).call();
    return {artistAddress:result[0], pricePerTokenInWei:result[1], invocations:result[2], maxInvocations:result[3], active:result[4], additionalPayee:result[5], additionalPayeePercentage:result[6],tokens:tokens};
  } else {
    const tokens = await contract2.methods.projectShowAllTokens(projectId).call();
    const result = await contract2.methods.projectTokenInfo(projectId).call();
    return {artistAddress:result[0], pricePerTokenInWei:result[1], invocations:result[2], maxInvocations:result[3], active:result[4], additionalPayee:result[5], additionalPayeePercentage:result[6],currency:result[7],currencyAddress:result[8], tokens:tokens};
  }
}

async function getTokenRoyaltyInfo(tokenId){

  if (tokenId<3000000){
    const result = await contract.methods.getRoyaltyData(tokenId).call();
    return {artistAddress:result[0], additionalPayee:result[1], additionalPayeePercentage:result[2], royaltyFeeByID:result[3]};
  } else {
    const result = await contract2.methods.getRoyaltyData(tokenId).call();
    return {artistAddress:result[0], additionalPayee:result[1], additionalPayeePercentage:result[2], royaltyFeeByID:result[3]};
  }
}

async function getTokenHashes(tokenId){
  if (tokenId<3000000){
    const result = await contract.methods.showTokenHashes(tokenId).call();
    return result;
  } else {
    const result = await contract2.methods.tokenIdToHash(tokenId).call();
    return result;
  }

}

async function getPlatformInfo(){
  const totalSupply = await contract.methods.totalSupply().call() + await contract2.methods.totalSupply().call();
	const nextProjectId = await contract2.methods.nextProjectId().call();
	const name = await contract.methods.name().call();
	const symbol = await contract.methods.symbol().call();
  return {totalSupply, nextProjectId, name, symbol};
}

async function getProjectId(tokenId){
  console.log("projectId is: "+Math.floor(tokenId/1000000));
  return Math.floor(tokenId/1000000);
}

function buildData(hashes, tokenId, type){
  //to expose token hashes use let hashes = tokenData.hashes[0] (example if only one hash is minted)
  if (tokenId<3000000){
    let data = {};
  	data.hashes = hashes;
  	data.tokenId = tokenId;
  	return `let tokenData = ${JSON.stringify(data)}`;
  } else {
    let data = {};
    data.hash = hashes;
    data.tokenId = tokenId;
    return `let tokenData = ${JSON.stringify(data)}`;
  }

}
  function toBuffer(ab) {
    var buf = Buffer.alloc(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
      buf[i] = view[i];
    }
    return buf;
  }

  function encode(data){
    let buf = Buffer.from(data);
    let base64 = buf.toString('base64');
    return base64
    }

    async function getImage(tokenId){
        const data =  s3.getObject(
          {
              Bucket: currentNetwork,
              Key: tokenId+".png"
            }

        ).promise();
        return data;
      }


app.get("/uploadplaceholders/:projectId/:totalImages", async (request, response)=> {
  const file = path.resolve(__dirname, "./src/rendering.png");
  for (let i=0; i<request.params.totalImages; i++) {
    let imgNumber = Number(request.params.projectId)*1000000+i ;

    const params = {
        Bucket: currentNetwork==="rinkeby"?"rinkthumb":"mainthumb",
        Key: imgNumber +".png",
        ContentType: "image/png",
        Body: fs.readFileSync(file)
    }
    console.log(params);

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`Placeholder thumb uploaded. ${data.Location}`);
    });
  }


});

  app.get("/renderimages/:projectId/:refresh?",async (request, response)=>{
    request.setTimeout(0)
    const projectId=request.params.projectId;
    console.log(projectId);
    const scriptInfo = projectId<3?await contract.methods.projectScriptInfo(projectId).call():await contract2.methods.projectScriptInfo(projectId).call();
    const scriptJSON = scriptInfo[0] && JSON.parse(scriptInfo[0]);
    const ratio = eval(scriptJSON.aspectRatio?scriptJSON.aspectRatio:1);
    const tokensOfProject = projectId<3?await contract.methods.projectShowAllTokens(projectId).call():await contract2.methods.projectShowAllTokens(projectId).call();
    //console.log(tokensOfProject);
    for (let i=0;i<tokensOfProject.length;i++){
      if (request.params.refresh){
        await serveScriptResultRefresh(tokensOfProject[i], ratio).then(result=>{
        console.log("Puppeteer has run.");

    })

      } else {
        await serveScriptResult(tokensOfProject[i], ratio).then(result=>{
        console.log("Puppeteer has run.");
    })

      }
  }
response.send("Rendering script for Project: "+request.params.projectId);
});

app.get("/renderimagerange/:projectId/:startId/:endId?",async (request, response)=>{
  request.setTimeout(0)
  const projectId=request.params.projectId;
  console.log(projectId);
  const scriptInfo = projectId<3?await contract.methods.projectScriptInfo(projectId).call():await contract2.methods.projectScriptInfo(projectId).call();
  const scriptJSON = scriptInfo[0] && JSON.parse(scriptInfo[0]);
  const ratio = eval(scriptJSON.aspectRatio?scriptJSON.aspectRatio:1);
  const tokensOfProject = projectId<3?await contract.methods.projectShowAllTokens(projectId).call():await contract2.methods.projectShowAllTokens(projectId).call();
  //console.log(tokensOfProject);
  if (request.params.endId){
    for (let i=request.params.startId;i<request.params.endId;i++){

        await serveScriptResult(tokensOfProject[i], ratio).then(result=>{
        console.log("Puppeteer has run.");
    })
  }
} else {
  for (let i=request.params.startId;i<tokensOfProject.length;i++){

      await serveScriptResult(tokensOfProject[i], ratio).then(result=>{
      console.log("Puppeteer has run.");
  })
}
}


response.send("Rendering script for Project: "+request.params.projectId);
});

app.get("/renderimagerangerefresh/:projectId/:startId/:endId?",async (request, response)=>{
  request.setTimeout(0)
  const projectId=request.params.projectId;
  console.log(projectId);
  const scriptInfo = projectId<3?await contract.methods.projectScriptInfo(projectId).call():await contract2.methods.projectScriptInfo(projectId).call();
  const scriptJSON = scriptInfo[0] && JSON.parse(scriptInfo[0]);
  const ratio = eval(scriptJSON.aspectRatio?scriptJSON.aspectRatio:1);
  const tokensOfProject = projectId<3?await contract.methods.projectShowAllTokens(projectId).call():await contract2.methods.projectShowAllTokens(projectId).call();
  //console.log(tokensOfProject);
  if (request.params.endId){
    for (let i=request.params.startId;i<request.params.endId;i++){

        await serveScriptResultRefresh(tokensOfProject[i], ratio).then(result=>{
        console.log("Puppeteer has run.");
    })
  }
} else {
  for (let i=request.params.startId;i<tokensOfProject.length;i++){

      await serveScriptResultRefresh(tokensOfProject[i], ratio).then(result=>{
      console.log("Puppeteer has run.");
  })
}
}


response.send("Rendering script for Project: "+request.params.projectId);
});


  function Queue(){var a=[],b=0;this.getLength=function(){return a.length-b};this.isEmpty=function(){return 0==a.length};this.enqueue=function(b){a.push(b)};this.dequeue=function(){if(0!=a.length){var c=a[b];2*++b>=a.length&&(a=a.slice(b),b=0);return c}};this.peek=function(){return 0<a.length?a[b]:void 0}};


app.listen(PORT, () => console.log(`Art Blocks listening at http://localhost:${PORT}`))
