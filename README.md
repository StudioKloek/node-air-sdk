# @erikyuzwa/node-air-sdk
AIR SDK wrapper for npm toolchain (updated)

This is based mostly from the [node-air-sdk](https://www.npmjs.com/package/node-air-sdk) package.

This has some updated internal tooling, and is also referencing the AIRSDK_Compiler for both MacOS and Win
platforms.

A NPM wrapper for the Adobe AIR SDK. The idea it to provide simple access to AIR_SDK binaries using node. 
The package has been set up to fetch the Adobe AIR SDK and run `amxmlc`, `mxmlc`, `fdb`, `compc`, `optimizer`, `swcdepends`,
etc for MacOS and Windows.

## Latest AIR SDK Compiler

```
32.0.0.89
```

# Building and Installing

- `npm install @erikyuzwa/node-air-sdk`
- `npm install -g @erikyuzwa/node-air-sdk # to install globally`

