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
//https://oneclickdapp.com/child-cello/

var zlib = require('zlib');
var AWS = require('aws-sdk');




const PORT = process.env.PORT || 1234;
const API_KEY = process.env.INFURA_KEY;
//const ACCESS_KEY = process.env.OSS_ACCESS_KEY;
//console.log(ACCESS_KEY);

var s3  = new AWS.S3({
          accessKeyId: process.env.OSS_ACCESS_KEY,
          secretAccessKey: process.env.OSS_SECRET_KEY,
          endpoint: process.env.OSS_ENDPOINT
});



const currentNetwork = "mainnet";
const testing = true;

let queue = new Queue();
let queueRef={};

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

app.get("/project/:projectId", async (request, response) =>{
  if (!Number.isInteger(Number(request.params.projectId))){
    console.log("not integer");
    response.send('invalid request');
  } else {
  const nextProjectId = await contract2.methods.nextProjectId().call();
  const exists = request.params.projectId<nextProjectId;
  if (exists){
    const projectDetails = await getDetails(request.params.projectId);
	  let script = await getScript(request.params.projectId,projectDetails.projectScriptInfo.scriptCount);
    let beautifulScript = beautify(script, { indent_size: 5, space_in_empty_paren: true });
    response.render('projectInfo', {
		     name:projectDetails.projectDescription.projectName,
		     artist: projectDetails.projectDescription.artistName,
         description: projectDetails.projectDescription.description,
         website: projectDetails.projectDescription.artistWebsite,
         license: projectDetails.projectDescription.license,
	       scriptJSON: JSON.stringify(projectDetails.projectScriptInfo.scriptJSON),
         scriptType: projectDetails.projectScriptInfo.scriptJSON.type,
         scriptVersion: projectDetails.projectScriptInfo.scriptJSON.version,
         scriptRatio: projectDetails.projectScriptInfo.scriptJSON.aspectRatio,
         instructions: projectDetails.projectScriptInfo.scriptJSON.instructions,
		     script: beautifulScript,
		     hashesGen: projectDetails.projectScriptInfo.hashesPerToken,
		     isDynamic: projectDetails.projectDescription.dynamic,
         artistAddress: projectDetails.projectTokenInfo.artistAddress,
         additionalPayee: projectDetails.projectTokenInfo.additionalPayee,
         additionalPayeePercentage: projectDetails.projectTokenInfo.additionalPayeePercentage,
         price: web3.utils.fromWei(projectDetails.projectTokenInfo.pricePerTokenInWei, 'ether'),
         currency: projectDetails.projectTokenInfo.currency?projectDetails.projectTokenInfo.currency:"ETH",
         currencyAddress: projectDetails.projectTokenInfo.currencyAddress && projectDetails.projectTokenInfo.currencyAddress!=="0x0000000000000000000000000000000000000000"?projectDetails.projectTokenInfo.currencyAddress:"N/A",
	       invocations: projectDetails.projectTokenInfo.invocations,
         tokensOfProject: projectDetails.projectTokenInfo.tokens,
		     maxInvocations: projectDetails.projectTokenInfo.maxInvocations,
         active: projectDetails.projectTokenInfo.active,
         paused: projectDetails.projectScriptInfo.paused
	  })
  } else {
    response.send('project does not exist');
  }
 }
});

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

app.get('/token/:tokenId', async(request,response)=>{
  if (!Number.isInteger(Number(request.params.tokenId))){
    console.log("not integer");
    response.send('invalid request');
  } else {
    const projectId = await getProjectId(request.params.tokenId);
    const tokensOfProject = projectId<3?await contract.methods.projectShowAllTokens(projectId).call():await contract2.methods.projectShowAllTokens(projectId).call();
    //console.log(tokensOfProject);
    const exists = tokensOfProject.includes(request.params.tokenId);
    console.log("exists? "+exists);
    console.log('token request '+request.params.tokenId);

    if (exists){
      let tokenDetails = await getToken(request.params.tokenId);
	     let projectDetails = await getDetails(tokenDetails.projectId);
       let tokenHashes = await getTokenHashes(request.params.tokenId);
       let royalties = await getTokenRoyaltyInfo(request.params.tokenId);


       response.json(
         {
           "platform":"Art Blocks",
           "name":projectDetails.projectDescription.projectName + " #"+(request.params.tokenId-tokenDetails.projectId*1000000),
           "description":projectDetails.projectDescription.description,
           "external_url": projectDetails.projectURIInfo.projectBaseURI.slice(0,-6)+"generator/"+request.params.tokenId,
           "artist":projectDetails.projectDescription.artistName,
           "royaltyInfo":{
             "artistAddress":royalties.artistAddress,
             "additionalPayee":royalties.additionalPayee,
             "additionalPayeePercentage":royalties.additionalPayeePercentage,
             "royaltyFeeByID":royalties.royaltyFeeByID
           },
           "traits":[
             {"trait_type":"Project",
             "value":projectDetails.projectDescription.projectName+ " by "+projectDetails.projectDescription.artistName}
           ],

           "website":projectDetails.projectDescription.artistWebsite,
           "is dynamic":projectDetails.projectDescription.dynamic,
           "script type":projectDetails.projectScriptInfo.scriptJSON.type,
           "aspect ratio (w/h)":projectDetails.projectScriptInfo.scriptJSON.aspectRatio,
           "uses hash":(projectDetails.projectScriptInfo.hashesPerToken==true || projectDetails.projectScriptInfo.hashesPerToken==1)? true: false,
           "tokenID":request.params.tokenId,
           "token hash":tokenHashes,
           "license":projectDetails.projectDescription.license,
           "image":projectDetails.projectURIInfo.projectBaseURI.slice(0,-6)+"image/"+request.params.tokenId
         });
    } else {
      response.send('token does not exist');
    }
  }
});

app.get('/generator/:tokenId', async (request, response) => {
  if (!Number.isInteger(Number(request.params.tokenId))){
    console.log("not integer");
    response.send('invalid request');
  } else {
    const projectId = await getProjectId(request.params.tokenId);
    const tokensOfProject = projectId<3?await contract.methods.projectShowAllTokens(projectId).call():await contract2.methods.projectShowAllTokens(projectId).call();
    const exists = tokensOfProject.includes(request.params.tokenId);
    console.log("exists? "+exists);
    console.log('generator request for token: '+request.params.tokenId);

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

app.get("/vox/:tokenId", async (request, response)=>{
  if (!Number.isInteger(Number(request.params.tokenId))){
    console.log("not integer");
    response.send('invalid request');
  } else {
    const projectId = await getProjectId(request.params.tokenId);
    const tokensOfProject = projectId<3?await contract.methods.projectShowAllTokens(projectId).call():await contract2.methods.projectShowAllTokens(projectId).call();
    const exists = tokensOfProject.includes(request.params.tokenId);
    console.log("exists? "+exists);
    console.log('vox request for token: '+request.params.tokenId);

    if (exists){
      let tokenDetails = await getToken(request.params.tokenId);
	    let projectDetails = await getDetails(tokenDetails.projectId);
      if (projectDetails.projectScriptInfo.scriptJSON.type==='vox' || projectDetails.projectScriptInfo.scriptJSON.type==='megavox'){
	       let script = await getScript(tokenDetails.projectId,projectDetails.projectScriptInfo.scriptCount);
         let data = buildData(tokenDetails.hashes, request.params.tokenId);
         let scriptAndData = `${data}${script}`;
         var evalScript = eval(scriptAndData);
         let array = voxx.export();
         response.send(toBuffer(array));
       } else {
         response.send('token not a vox file');
       }
     } else {
        response.send('token does not exist');
    }
  }
})

app.get("/image/:tokenId/:refresh?", async (request, response) => {
  const file = path.resolve(__dirname, "./src/rendering.png");
  if (!Number.isInteger(Number(request.params.tokenId))){
    console.log("not integer");
    response.send('invalid request');
  } else {
    //const file = path.resolve(__dirname, "./images/"+request.params.tokenId+".png");
    //if (fs.existsSync(file) && !request.params.refresh) {
      //console.log('serving local');
      //response.sendFile(file);
    //} else {
      const projectId = await getProjectId(request.params.tokenId);
      const tokensOfProject = projectId<3?await contract.methods.projectShowAllTokens(projectId).call():await contract2.methods.projectShowAllTokens(projectId).call();
      const exists = tokensOfProject.includes(request.params.tokenId);
      const scriptInfo = projectId<3?await contract.methods.projectScriptInfo(projectId).call():await contract2.methods.projectScriptInfo(projectId).call();
      const scriptJSON = scriptInfo[0] && JSON.parse(scriptInfo[0]);
      const ratio = eval(scriptJSON.aspectRatio?scriptJSON.aspectRatio:1);
      //const delay = eval(scriptJSON.delay);
      console.log("exists? "+exists);
      console.log('image request '+request.params.tokenId);


      if (exists){
        console.log(queueRef);

        var params = { Bucket: currentNetwork, Key: request.params.tokenId+".png" };
          s3.getObject(params, function(err, data) {
              if (err || request.params.refresh) {
                if (queueRef[request.params.tokenId]){
                  //response.send("Your image is still rendering, please come back later!");
                  //response.set('Content-Type','image/png');
                  response.sendFile(file);
                  //response.sendFile(file);
                } else {
                  console.log("new image request");
                  queue.enqueue([request.params.tokenId,ratio]);
                  queueRef[request.params.tokenId]=true;
                  let queueSize = Object.keys(queueRef).length;
                  console.log("queueSize: "+queueSize);
                  if (queueSize<5){
                    console.log("Running Puppeteer for token: "+request.params.tokenId);
                    serveScriptResult(request.params.tokenId,ratio).then(result=>{
                      console.log("Image rendered: "+request.params.tokenId);
                      console.log(queueRef);
                      response.set('Content-Type', 'image/png');
                      response.send(result);
                    });
                  } else {
                    //response.set('Content-Type','image/png');
                    response.sendFile(file);
                  //response.send("Your image has been added to the rendering queue, please come back later.");
                }
              }
                //console.log(queue.getLength());
                //console.log(queue.peek());
              } else {
                const fileSize= s3.headObject(params).promise()
                .then((res) => {
                  if (res.ContentLength<3000000){
                    const data = s3.getObject({ Bucket: currentNetwork, Key: request.params.tokenId+".png"}).createReadStream();
                    data.on('error', function(err) {
                      console.error(err);
                    });
                    console.log("Returning single stream");
                    data.pipe(response);
                  } else {
                    //const remaining = res.ContentLength-3000000;
                    const data1 = s3.getObject({ Bucket: currentNetwork, Key: request.params.tokenId+".png", Range: 'bytes=0-3000000' }).createReadStream();
                    const data2 = s3.getObject({ Bucket: currentNetwork, Key: request.params.tokenId+".png", Range: 'bytes=3000001-'+res.ContentLength }).createReadStream();
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
                    combinedStream.pipe(response);
                  }
                });
            }
          })
        } else {
          response.send('token does not exist');
        }
      }
    });


setInterval(()=>{
  console.log(Object.keys(queueRef));
  for (let i in queueRef){
    console.log(i);
    delete queueRef[i];
  }
},30000);
/*
setInterval(()=>{
  console.log("currently:" );
  console.log(currentlyProcessing);
  if (queue.getLength()>0){
    let tokenToProcess = queue.peek();
    tokenToProcess[0]===currentlyProcessing[0]?console.log("yes"):console.log("no");
    console.log("new one: ");
    console.log(tokenToProcess);
    if (tokenToProcess[0] != currentlyProcessing[0]){
      serveScriptResult(tokenToProcess[0], tokenToProcess[1]).then(result=>{
        console.log("Running Puppeteer");
        //response.set('Content-Type', 'image/png');
        //response.send(result);
      });
    }
  }
},10000);
*/

async function serveScriptResult(tokenId, ratio){
  let url;
  //currentlyProcessing = [tokenId,ratio];
  const width = Math.floor(ratio<=1?1200*ratio:1200);
  const height = Math.floor(ratio<=1?1200:1200/ratio);
  //const path = './images/'+tokenId+'.png';
  try {

    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.setViewport({
      width: width,
      height: height,
      deviceScaleFactor: 2,
    });
    //await page.goto('http://localhost:1234/generator/'+tokenId);
    if (testing){
      await page.goto('http://localhost:1234/generator/'+tokenId);
    } else {
      url = currentNetwork==="rinkeby"?'https://rinkebyapi.artblocks.io/generator/'+tokenId:'https://api.artblocks.io/generator/'+tokenId;
      await page.goto(url);
    }
    //let url = currentNetwork==="rinkeby"?'https://rinkebyapi.artblocks.io/generator/'+tokenId:'https://api.artblocks.io/generator/'+tokenId;
    //let url = "https://artblocks-server-temp-12964.nodechef.com/generator/"+tokenId;
    //console.log(url);
    //await page.goto('https://api.artblocks.io/generator/'+tokenId);

    await timeout(500);
    const image = await page.screenshot();
    await browser.close();

    const imageResizer = Buffer.from(image);
    const resizedImage = sharp(imageResizer).resize(Math.round(width/3),Math.round(height/3)).png();
    //console.log(resizedImage);
    //fs.writeFile("./images/"+ tokenId+ ".png", image, function(err) {});
    const params1 = {
        Bucket: currentNetwork,
        Key: tokenId+".png", // File name you want to save as in S3
        Body: image
    };

    const params2 = {
        Bucket: currentNetwork==="rinkeby"?"rinkthumb":"mainthumb",
        Key: tokenId+".png",
        Body: resizedImage
    }

    // Uploading files to the bucket
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

    console.log("deleting token:"+tokenId);
    delete queueRef[tokenId];
    //queue.dequeue();
    return image;
  } catch (error) {
    console.log(tokenId+ '| this is the error: '+error);

  }
}

async function renderThumbnail(tokenId, ratio){
  const width = Math.floor(ratio<=1?1200*ratio:1200);
  const height = Math.floor(ratio<=1?1200:1200/ratio);
  var params = { Bucket: currentNetwork, Key: tokenId+".png"};
  const fileSize= s3.headObject(params).promise()
  .then((res) => {
    if (res.ContentLength<3000000){

      const data = s3.getObject({ Bucket: currentNetwork, Key: tokenId+".png"}).promise()
      .then(result=>{
        //console.log(result);
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
      //data.on('error', function(err) {
        //console.error(err);
      //});

      //console.log("Returning single stream");
      //console.log(data);
      //data.pipe(response);
      //const imageResizer = Buffer.from(data.Body);
      //const resizedImage = sharp(imageResizer).resize(Math.round(width/3),Math.round(height/3)).png();
/*
      const params2 = {
          Bucket: currentNetwork==="rinkeby"?"rinkthumb":"mainthumb",
          Key: tokenId+".png",
          Body: data
      }

      s3.upload(params2, function(err, data) {
          if (err) {
              throw err;
          }
          console.log(`Thumnail uploaded successfully. ${data.Location}`);

      });
      */

      //resizedImage.pipe(response);
    } else {
      //const remaining = res.ContentLength-3000000;
      const data1 = s3.getObject({ Bucket: currentNetwork, Key: tokenId+".png", Range: 'bytes=0-3000000' }).createReadStream();
      const data2 = s3.getObject({ Bucket: currentNetwork, Key: tokenId+".png", Range: 'bytes=3000001-'+res.ContentLength }).createReadStream();
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
/*
    const imageResizer = Buffer.from(image);
    const resizedImage = sharp(imageResizer).resize(Math.round(width/3),Math.round(height/3)).png();
    //console.log(resizedImage);
    //fs.writeFile("./images/"+ tokenId+ ".png", image, function(err) {});
    const params1 = {
        Bucket: currentNetwork,
        Key: tokenId+".png", // File name you want to save as in S3
        Body: image
    };

    const params2 = {
        Bucket: currentNetwork==="rinkeby"?"rinkthumb":"mainthumb",
        Key: tokenId+".png",
        Body: resizedImage
    }

    // Uploading files to the bucket
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

    console.log("deleting token:"+tokenId);
    delete queueRef[tokenId];
    //queue.dequeue();
    return image;
  } catch (error) {
    console.log(tokenId+ '| this is the error: '+error);

  }
  */
}


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

  /*
  app.get("/uploadImages/:projectId",async (request, response)=>{
    //request.setTimeout(0)
    const projectId=request.params.projectId;
    console.log(projectId);
    const scriptInfo = projectId<3?await contract.methods.projectScriptInfo(projectId).call():await contract2.methods.projectScriptInfo(projectId).call();
    const scriptJSON = scriptInfo[0] && JSON.parse(scriptInfo[0]);
    const ratio = eval(scriptJSON.aspectRatio?scriptJSON.aspectRatio:1);
    const tokensOfProject = projectId<3?await contract.methods.projectShowAllTokens(projectId).call():await contract2.methods.projectShowAllTokens(projectId).call();
    //console.log(tokensOfProject);
    for (let i=0;i<tokensOfProject.length;i++){
      //const file = path.resolve(__dirname, "./images/"+tokensOfProject[i]+".png");
      //if (fs.existsSync(file)) {
        //console.log('serving local');
        //response.send('serving');
      //} else {

        await uploadFile(tokensOfProject[i]);
  }});
  */

/*
  app.get("/renderimages/:projectId",async (request, response)=>{
    request.setTimeout(0)
    const projectId=request.params.projectId;
    console.log(projectId);
    const scriptInfo = projectId<3?await contract.methods.projectScriptInfo(projectId).call():await contract2.methods.projectScriptInfo(projectId).call();
    const scriptJSON = scriptInfo[0] && JSON.parse(scriptInfo[0]);
    const ratio = eval(scriptJSON.aspectRatio?scriptJSON.aspectRatio:1);
    const tokensOfProject = projectId<3?await contract.methods.projectShowAllTokens(projectId).call():await contract2.methods.projectShowAllTokens(projectId).call();
    console.log(tokensOfProject);
    for (let i=0;i<tokensOfProject.length;i++){


        await serveScriptResult(tokensOfProject[i], ratio).then(result=>{
        console.log("Running Puppeteer");
        //response.set('Content-Type', 'image/png');
        //response.send(result);
      //await serveScriptResult(tokensOfProject[i],ratio);
      //setTimeout(x=>{},1000)
    })

  }});
*/
/*
  app.get("/renderthumbs/:projectId",async (request, response)=>{
    request.setTimeout(0)
    const projectId=request.params.projectId;
    //console.log(projectId);
    const scriptInfo = projectId<3?await contract.methods.projectScriptInfo(projectId).call():await contract2.methods.projectScriptInfo(projectId).call();
    const scriptJSON = scriptInfo[0] && JSON.parse(scriptInfo[0]);
    const ratio = eval(scriptJSON.aspectRatio?scriptJSON.aspectRatio:1);
    const tokensOfProject = projectId<3?await contract.methods.projectShowAllTokens(projectId).call():await contract2.methods.projectShowAllTokens(projectId).call();
    //console.log(tokensOfProject);
    for (let i=0;i<tokensOfProject.length;i++){


        await renderThumbnail(tokensOfProject[i], ratio).then(result=>{
        console.log("Thumbnail Rendered: "+tokensOfProject[i]);

        //response.set('Content-Type', 'image/png');
        //response.send(result);
      //await serveScriptResult(tokensOfProject[i],ratio);
      //setTimeout(x=>{},1000)
    })

  }});
*/
  function Queue(){var a=[],b=0;this.getLength=function(){return a.length-b};this.isEmpty=function(){return 0==a.length};this.enqueue=function(b){a.push(b)};this.dequeue=function(){if(0!=a.length){var c=a[b];2*++b>=a.length&&(a=a.slice(b),b=0);return c}};this.peek=function(){return 0<a.length?a[b]:void 0}};


app.listen(PORT, () => console.log(`Art Blocks listening at http://localhost:${PORT}`))
