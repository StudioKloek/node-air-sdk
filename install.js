/**
 * Erik Yuzwa - 01/30/2019
 *
 * This module was originally forked from the node-air-sdk project. This module is run by node in the "postinstall"
 * script phase. We're basically detecting our current platform (windows or mac), then making a request to
 * Adobe's servers to pull down the appropriate latest AIR SDK Compiler archive.
 *
 * Once finished, it's extracting the contents into a subfolder and making sure it's the tooling used by any project
 * consuming this entire package.
 */
'use strict';
const fs = require('fs-extra');
const path = require('path');
const airSdk = require('./lib/air');
const request = require('request');
const playerGlobal = require('playerglobal-latest');
const chalk = require('chalk');
const progress = require('request-progress');
const dmg = require('dmg');

const packageMetadata = require('./package.json');
const name = 'AIRSDK_Compiler';
const libFolder = 'lib/AIR_SDK';
const downloadUrl = packageMetadata.airSdk[process.platform];
const fileExtention = path.extname(downloadUrl);
const tmpLocation = path.join(__dirname, 'lib', name + fileExtention);
const frameworksDir = path.join(__dirname, libFolder);
// const extract = require('extract-zip');

function installAIRSDK() {
    // display the version number within the archive
    airSdk.extractVersion();

    // generate a mapping to the tooling binaries in the /bin folder of the AIR SDK
    airSdk.update();

    // install all the available versions of the playerglobal framework
    console.log('Installing all playerglobal frameworks...');
    playerGlobal.install(frameworksDir, function(err) {
      if (err) {
        console.error(chalk.magenta('Failed to install the latest "playerglobal.swc" library collection!', err));
      } else {
        console.log(chalk.green('Successfully installed the latest "playerglobal.swc" library collection.'));
      }

      process.exit(err ? 1 : 0);
    });
}

fs.stat(libFolder, function(err, stats) {
  if (!err) {
      // TODO - allow for a --force override?
      console.log(chalk.magenta('AIR SDK was already downloaded'));

      process.exit(0);
  }

  console.log(chalk.yellow('Working on platform - ' + process.platform));
  console.log(chalk.yellow(downloadUrl));

  console.log(chalk.green('Downloading latest Adobe AIR SDK, please wait...'));

  progress(request(downloadUrl, function (error, response, body) {

    if (error || response.statusCode !== 200) {
      console.error(chalk.magenta('Could not download AIR SDK!'));
      process.exit(1);
      return;
    }

    console.log(chalk.yellow('AIR SDK download complete!'));
    console.log(chalk.yellow('Preparing to extract AIR SDK archive, please wait......'));

    if (fileExtention === '.dmg') {
      // to open & mount the dmg
      dmg.mount(tmpLocation, function(err, path) {
        if (err) {
          console.error(chalk.magenta('Failed to open DMG file...'));
          process.exit(1);          
        }

        // show all files in dmg
        fs.copySync(path, frameworksDir);

        // later you can and should unmount
        dmg.unmount(path, function(err) {
          installAIRSDK();
        });
      });      
    } else {
      extract(tmpLocation, {dir: frameworksDir}, function (err) {
        // extraction is complete. make sure to handle the err
        if (err) {
          console.error(chalk.magenta('Failed to extract the AIR SDK archive'));
          process.exit(1);
        }

        installAIRSDK();    
      });
    }
  }))
  .on('progress', function (state) {
    process.stdout.write(chalk.cyan('Downloading: ' + (Math.floor(state.percent * 1000))/10 + '%\n'));
  })
  .pipe(fs.createWriteStream(tmpLocation));

  process.on('uncaughtException', function(err) {
    console.error(chalk.magenta('FATAL! Uncaught exception: ' + err));
    process.exit(1);
  });
});
