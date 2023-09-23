const path = require("path");

module.exports = {
  mode: "production",
  output: {
    libraryTarget: "commonjs",
    path: path.resolve(__dirname, "build"),
  },
  target: "node",
};
