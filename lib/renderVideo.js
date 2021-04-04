const tempdir = require("tempdir");
const util = require("util");
const timecut = require("timecut");

const exec = util.promisify(require("child_process").exec);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const renderVideo = async (url, time, width, height) => {
  // console.log("starting the render video process");
  const hrstart = process.hrtime();
  const workdir = await tempdir();
  const framerate = 30;
  const videoFilename = `${workdir}/out.mp4`;
  console.log("running timecut");
  const timeCutConfig = {
    url,
    fps: framerate,
    duration: time,
    viewport: {
      width,
      height,
    },
    pipeMode: true,
    output: videoFilename,
  };
  console.log("timecut config", timeCutConfig);

  await timecut(timeCutConfig);
  const hrend = process.hrtime(hrstart);
  console.info("Execution time (hr): %ds %dms", hrend[0], hrend[1] / 1000000);
  return videoFilename;
};
module.exports = renderVideo;
