import path from "path";
import webpack from "webpack";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import pkg from "./package.json";

function inmodules(...parts) {
  return new RegExp("^" + path.join(__dirname, "node_modules", ...parts) + "$");
}

function insrc(...parts) {
  return new RegExp("^" + path.join(__dirname, "src", ...parts) + "$");
}

function q(loader, query) {
  return loader + "?" + JSON.stringify(query);
}

const DIST_DIR = path.join("dist", "app");
const DEBUG = process.env.NODE_ENV !== "production";
const WIN_BUILD = process.env.PLATFORM === "win32";
const TISTORE_VERSION = `${pkg.name} v${pkg.version} “${pkg.codename}”`;
const NAMEQ = {name: "[name]"};
const FULLNAMEQ = {name: "[name].[ext]"};
const MANIFEST_OPTS = WIN_BUILD
  /* eslint-disable quotes */
  ? ',"chromium-args": "--user-data-dir=TistoreData"'
  /* eslint-enable quotes */
  : "";
const INDEX_LOADERS = [
  q("file", NAMEQ),
  q("string-replace", {search: "${TITLE}", replace: TISTORE_VERSION}),
];
const PACKAGE_LOADERS = [
  q("file", NAMEQ),
  q("string-replace", {search: "${CUSTOM_OPTS}", replace: MANIFEST_OPTS}),
];
const SkipLoader = require.resolve("./skip-loader");
const ExtractLoader = ExtractTextPlugin.extract("css");
const COMMON_PLUGINS = [
  new webpack.DefinePlugin({WIN_BUILD}),
  new ExtractTextPlugin("index.css"),
];
const PLUGINS = DEBUG ? COMMON_PLUGINS : COMMON_PLUGINS.concat([
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    output: {comments: false},
    compress: {warnings: false},
  }),
]);


export default {
  target: "node",
  entry: "./src/index/index",
  output: {
    path: path.join(__dirname, DIST_DIR),
    filename: "index.js",
  },
  module: {
    // See <https://github.com/webpack/webpack/issues/138>.
    noParse: inmodules(".*json-schema", "lib", "validate\\.js"),
    loaders: [
      // See <https://github.com/webpack/webpack/issues/184>.
      {test: inmodules(".+\\.json"), loader: "json"},
      {test: insrc(".+\\.js"), loader: "babel"},
      {test: insrc(".+\\.png"), loader: "file", query: FULLNAMEQ},
      {test: insrc("..", "bin", ".+\\.exe"), loader: "file", query: FULLNAMEQ},
      {test: insrc("index", "index\\.html\\.tmpl"), loaders: INDEX_LOADERS},
      {test: insrc("index", "package\\.json\\.tmpl"), loaders: PACKAGE_LOADERS},
      // Fonts, font-awesome.
      {test: /\.woff2(\?v=[\d.]+)?$/, loader: "file", query: FULLNAMEQ},
      {test: /\.(ttf|eot|svg|woff)(\?v=[\d.]+)?$/, loader: SkipLoader},
      {test: inmodules("font-awesome", ".+\\.css"), loader: ExtractLoader},
    ],
  },
  plugins: PLUGINS,
};
