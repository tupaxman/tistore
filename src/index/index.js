/**
 * Entry point of the application.
 * @module tistore/index
 */

import React from "react";
import ReactDOM from "react-dom";
// import * as dialog from "../dialog";
import "./package.json.tmpl";
import "./index.html.tmpl";
import "./icon.png";
import "./opensans-regular.woff2";
import "./opensans-bold.woff2";

const Index = React.createClass({
  render() {
    return null;
  },
});

// FIXME: Stop aria2c.
// const mainWindow = window.nw.Window.get();
// mainWindow.on("close", () => {
//   dialog
//     .confirm({title: "Are you sure you want to exit?", focusOK: true})
//     .then(() => { mainWindow.close(true); });
// });

ReactDOM.render(<Index/>, document.getElementById("tistore-index"));
