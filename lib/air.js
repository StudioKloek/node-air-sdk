/**
 * Erik Yuzwa - 01/30/2019
 * This module was originally forked from the node-air-sdk project. During the installation, if the current
 * detected platform is Windows, then apply a mapping to each of the .bat files within the AIR_SDK/bin folder
 * back to our root ./bin.
 *
 * Presumably to ensure the latest version of each executable is mapped...
 *
 */
'use strict';
var fs = require('fs');
var path = require('path');
var AIR_HOME = path.join(__dirname, 'AIR_SDK');
var BIN_DIR = path.join(AIR_HOME, 'bin');
var parser = require('xml2json');
var executable = require('executable');

var airSdk = {
  AIR_HOME: AIR_HOME,
  binDir: BIN_DIR,
  bin: {},
  update: function() {
    var binaries, batExecFiles, execFiles;
    airSdk.bin = {};
    if (fs.existsSync(airSdk.binDir)) {
      binaries = fs.readdirSync(airSdk.binDir);
      
      execFiles = binaries.filter(function(filename) {
        if (path.extname(filename) === '.bat') {
          return false;
        }
        
        const fullFilePath = path.join(airSdk.binDir, filename);
        return executable.sync(fullFilePath);
      });
      
      if (process.platform === 'win32') {
        execFiles.forEach(function(filename) {
          airSdk.bin[filename] = path.join(airSdk.binDir, filename + '.bat');
        });
      } else {
        execFiles.forEach(function(filename) {
          airSdk.bin[filename] = path.join(airSdk.binDir, filename);
        });
      }
    }
  },
  // Adobe includes a description xml file with the version and build value
  extractVersion: function () {
    var descriptionpath = path.join(AIR_HOME, './air-sdk-description.xml');

    fs.readFile(descriptionpath, function( err, data) {

      if (err) {
        console.log('could not find air-sdk-description file');
        return;
      }

      // parse the XML description file
      var json = JSON.parse(parser.toJson(data, { reversible: true }));
      var ver = json['air-sdk-description']['version'];
      var build = json['air-sdk-description']['build'];

      console.log('working with AIR SDK Compiler - v' + ver.$t + '.' + build.$t);
    });
  }
};

module.exports = airSdk;
