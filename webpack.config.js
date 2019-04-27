const webpack = require("webpack");
const ManifestPlugin = require("webpack-manifest-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const path = require("path");
const PnpWebpackPlugin = require("pnp-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const { getIfUtils, removeEmpty } = require("webpack-config-utils");
const nodeExternals = require("webpack-node-externals");
const CopyPlugin = require("copy-webpack-plugin");

const env = process.env.NODE_ENV || "development";

const { ifProduction } = getIfUtils(env);

const PATHS = {
  src: path.resolve(process.cwd(), "src"),
  dist: path.resolve(process.cwd(), "dist"),
  build: path.resolve(process.cwd(), "build")
};

module.exports = {
  entry: {
    server: "./src/index.ts"
  },
  output: {
    path: ifProduction(PATHS.dist, PATHS.build),
    chunkFilename: ifProduction("[id].[contenthash].js", "[name].js"),
    filename: ifProduction("[id].[contenthash].js", "[name].js"),
    devtoolModuleFilenameTemplate: "[absolute-resource-path]"
  },
  target: "async-node",
  devtool: ifProduction(false, "eval"),
  mode: ifProduction("production", "development"),
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        use: [
          // require.resolve("thread-loader"),
          {
            loader: require.resolve("babel-loader"),
            options: {
              cacheDirectory: true
            }
          }
        ]
      }
      /* {
        test: /\.js$/,
        use: require.resolve("source-map-loader"),
        enforce: "pre"
      } */
    ]
  },
  resolve: {
    extensions: [".ts", ".js"],
    plugins: [PnpWebpackPlugin]
  },
  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)]
  },
  plugins: removeEmpty([
    new CleanWebpackPlugin(),
    new ManifestPlugin(),
    ifProduction(new MinifyPlugin()),
    new CopyPlugin([
      {
        from: path.resolve(process.cwd(), "index.js"),
        to: path.resolve(ifProduction(PATHS.dist, PATHS.build), "index.js")
      }
    ])
  ])
};
