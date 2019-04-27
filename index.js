const path = require("path");
const env = process.env.NODE_ENV;
const buildDir = path.resolve(
  process.cwd(),
  env === "production" ? "dist" : "build"
);

const manifestFilePath = path.resolve(buildDir, "manifest.json");

const startFilePath = path.resolve(
  buildDir,
  require(manifestFilePath)["server.js"]
);

require(startFilePath);
