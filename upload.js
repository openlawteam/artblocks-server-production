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
const {Buffer} = require('buffer');

var zlib = require('zlib');
var AWS = require('aws-sdk');

var s3  = new AWS.S3({
          accessKeyId: "OCTR0VJR1MTE0CCBCC60",
          secretAccessKey: "Q0tRGX8v7xAc67YZnkMCiHUS5oErmZBwHleGBOqi",
          endpoint: "https://oss.nodechef.com"
});
//https://oneclickdapp.com/child-cello/

console.log(s3);



const uploadFile = (tokenId) => {
    // Read content from the file
    const fileName = path.resolve(__dirname, "./images/1.png");
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: "mainnet",
        Key: '1.png', // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};

uploadFile();

const imageUpload = (path,buffer) => {
  const file = path.resolve(__dirname, "./images/1.png");
  const data = {
    Key:file,
    Body: buffer,
    ContentEncoding: 'base64',
    ContentType: 'image/png',
    ACL: 'public-read'
  };
  return new Promise((resolve,reject)=>{
    s3.putObject(data, (err)=> {
      if (err) {
        reject(err);
      } else {
        resolve(s3URrl+path);
      }
    });
  });
};


const PORT = process.env.PORT || 8080;
const API_KEY = process.env.INFURA_KEY;

const currentNetwork = "mainnet";

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

app.get("/", async (request, response) =>{
  response.render('home');
})

app.get("/platform", async (request, response) =>{
  const platformInfo = await getPlatformInfo();
  let projects=[];
  for (let i=0;i<platformInfo.nextProjectId;i++){
    projects.push(i);
  }

  response.render('platformInfo', {
		name:platformInfo.name,
		symbol:platformInfo.symbol,
    address:[address, address2],
		totalSupply: platformInfo.totalSupply,
		projects: projects,
		nextProjectId:platformInfo.nextProjectId
	})
})



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

app.listen(PORT, () => console.log(`Art Blocks listening at http://localhost:${PORT}`))
