const tempdir = require("tempdir");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const renderVideo = async (page, time) => {
  console.log("starting the render video process");
  const hrstart = process.hrtime();
  const workdir = await tempdir();
  const framerate = 24;

  const numberOfScreenshots = time * framerate;

  for (let i = 1; i <= numberOfScreenshots; i += 1) {
    const filename = `${workdir}/T${new Date().getTime()}.png`;
    await page.screenshot({ path: filename });
    console.log(`capturing ${filename} ${i}/${numberOfScreenshots}`);
    await sleep(1000 / framerate);
  }
  await sleep(1000);
  console.log("screenshots done");
  // await Promise.all(screenshotPromises);
  const videoFilename = `${workdir}/out.mp4`;
  // console.log("screenshots done");
  const ffmpegCmd = [
    "ffmpeg",
    "-f image2",
    `-framerate ${framerate}`,
    `-pattern_type glob -i '${workdir}/*.png'`,
    "-vcodec libx264 -pix_fmt yuv420p",
    videoFilename,
  ].join(" ");
  console.log(ffmpegCmd);
  try {
    const { stdout, stderr } = await exec(ffmpegCmd);
    console.log("stdout:", stdout);
    console.log("stderr:", stderr);
  } catch (e) {
    console.error(e); // should contain code (exit code) and signal (that caused the termination).
  }
  console.log(videoFilename);
  const hrend = process.hrtime(hrstart);
  console.info("Execution time (hr): %ds %dms", hrend[0], hrend[1] / 1000000);

  return videoFilename;
};
module.exports = renderVideo;
