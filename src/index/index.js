/**
 * Entry point of the application.
 * @module tistore/index
 */

import fs from "fs";
import React from "react";
import ReactDOM from "react-dom";
import "./package.json.tmpl";
import "./index.html.tmpl";
import "./icon.png";
import "./opensans-regular.woff2";
import "./opensans-bold.woff2";
import Toolbar from "../toolbar";
import Filelist from "../filelist";
import Statusbar from "../statusbar";

const Index = React.createClass({
  getInitialState() {
    return {files: []};
  },
  componentWillMount() {
    const list = process.env.TISTORE_DEBUG_LIST;
    if (list) {
      this.handleListLoad(list);
    }
  },
  componentDidMount() {
    // FIXME: Run aria2c daemon.
    const mainWindow = window.nw.Window.get();
    mainWindow.on("close", () => {
      if (confirm("Are you sure you want to exit?")) {
        // FIXME: Stop aria2c.
        mainWindow.close(true);
      }
    });
    // See <https://github.com/nwjs/nw.js/issues/1162>.
    // By default nw.js will try to open urls by itself but it's not
    // that user probably wants.
    mainWindow.on("new-win-policy", (frame, url, policy) => {
      policy.ignore();
      global.nw.Shell.openExternal(url);
    });
  },
  styles: {
    main: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
    toolbar: {
    },
    filelist: {
      flex: 1,
      overflowY: "scroll",
      border: "solid #999",
      borderWidth: "1px 0",
    },
    statusbar: {
    },
  },
  handleListLoad(list) {
    // FIXME: Process errors.
    const data = fs.readFileSync(list, {encoding: "utf-8"});
    let files = [];
    data.trim().split(/\r?\n/).forEach(line => {
      line = line.trim();
      // Should be enough for now. Leaving to aria2 all remaining
      // validation.
      if (line.startsWith("http://") || line.startsWith("https://")) {
        files.push({url: line});
      }
    });
    this.setState({files});
  },
  render() {
    return (
      <div style={this.styles.main}>
        <div style={this.styles.toolbar}>
          <Toolbar/>
        </div>
        <div style={this.styles.filelist}>
          <Filelist files={this.state.files} />
        </div>
        <div style={this.styles.statusbar}>
          <Statusbar/>
        </div>
      </div>
    );
  },
});

ReactDOM.render(<Index/>, document.getElementById("tistore-index"));
