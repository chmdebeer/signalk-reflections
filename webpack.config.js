const webpack = require("webpack");
const resolve = require("path").resolve;

module.exports = {
  entry: "./public/js/entry.js",
  output: {
    path: resolve(__dirname, "public/js"),
    filename: "signalk.js"
  },
  externals: ["mdns", "validator-js", "ws"]
};
