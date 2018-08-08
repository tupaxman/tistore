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
  return loader + "-loader?" + JSON.stringify(query);
}

const DIST_DIR = path.join("dist", "app");
const DEBUG = process.env.NODE_ENV !== "production";
const WIN_BUILD = process.env.PLATFORM === "win32";
const TISTORE_VERSION = `${pkg.name} v${pkg.version} “${pkg.codename}”`;
const NAMEQ = {name: "[name]"};
const FULLNAMEQ = {name: "[name].[ext]"};
const MANIFEST_OPTS = DEBUG
  ? ',"chromium-args": "--enable-logging=stderr"'
  : WIN_BUILD ? ',"chromium-args": "--user-data-dir=TistoreData"' : "";
const INDEX_LOADERS = [
  q("file", NAMEQ),
  q("ejs-html", {title: TISTORE_VERSION}),
];
const PACKAGE_LOADERS = [
  q("file", NAMEQ),
  q("ejs-html", {opts: MANIFEST_OPTS}),
];
const ExtractLoader = ExtractTextPlugin.extract("css-loader");
const COMMON_PLUGINS = [
  new webpack.DefinePlugin({WIN_BUILD}),
  new ExtractTextPlugin("index.css"),
];
const PLUGINS = DEBUG ? COMMON_PLUGINS : COMMON_PLUGINS.concat([
  new webpack.optimize.UglifyJsPlugin({
    output: {comments: false},
    compress: {warnings: false},
  }),
]);


export default {
  target: "node",
  stats: {
    children: false,
    entrypoints: false,
    modules: false,
  },
  entry: "./src/index/index",
  output: {
    path: path.join(__dirname, DIST_DIR),
    filename: "index.js",
  },
  // XXX(Kagami): Not actually needed and has ES6 deps which is not
  // supported by current minify configuration.
  externals: [{hawk: "undefined"}],
  module: {
    // See <https://github.com/webpack/webpack/issues/138>.
    noParse: inmodules(".*json-schema", "lib", "validate\\.js"),
    loaders: [
      {test: /\.json$/, loader: "json-loader"},
      {test: /\.(png|exe)$/, loader: "file-loader", query: FULLNAMEQ},
      {test: insrc(".+\\.js"), loader: "babel-loader"},
      {test: insrc("index", "index\\.html\\.ejs"), loaders: INDEX_LOADERS},
      {test: insrc("index", "package\\.json\\.ejs"), loaders: PACKAGE_LOADERS},
      // Fonts, font-awesome.
      {test: /\.woff2(\?v=[\d.]+)?$/, loader: "file-loader", query: FULLNAMEQ},
      {test: /\.(ttf|eot|svg|woff)(\?v=[\d.]+)?$/, loader: "skip-loader"},
      {test: inmodules("font-awesome", ".+\\.css"), loader: ExtractLoader},
    ],
  },
  plugins: PLUGINS,
};
