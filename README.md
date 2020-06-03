# AIR SDK wrapper for npm toolchain

This is based mostly from the [node-air-sdk](https://www.npmjs.com/package/node-air-sdk) package and @erikyuzwa/node-air-sdk.

This has some updated internal tooling, and is also referencing the AIRSDK_Compiler for both MacOS and Win platforms.

A NPM wrapper for the Adobe AIR SDK. The idea it to provide simple access to AIR_SDK binaries using node. 
The package has been set up to fetch the Adobe AIR SDK and run `amxmlc`, `mxmlc`, `fdb`, `compc`, `optimizer`, `swcdepends`,
etc for MacOS and Windows.
