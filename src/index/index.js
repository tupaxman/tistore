/**
 * Entry point of the application.
 * @module tistore/index
 */

import fs from "fs";
import os from "os";
import React from "react";
import ReactDOM from "react-dom";
import "./package.json.ejs";
import "./index.html.ejs";
import "./icon.png";
import "./opensans-regular.woff2";
import "./opensans-bold.woff2";
import Aria2c from "../aria2c";
import Toolbar from "../toolbar";
import Filelist from "../filelist";
import Statusbar from "../statusbar";

const Index = React.createClass({
  getInitialState() {
    return {
      aspawning: true,
      outdir: os.tmpdir(),
      files: [],
    };
  },
  componentWillMount() {
    const list = process.env.TISTORE_DEBUG_LIST;
    if (list) {
      this.handleListLoad(list);
    }
  },
  componentDidMount() {
    let mainWindow = window.nw.Window.get();
    mainWindow.on("close", () => {
      if (confirm("Are you sure you want to exit?")) {
        mainWindow.close(true);
      }
    });
    mainWindow.menu = this.getMenu();
    this.spawnAria();
  },
  getMenu() {
    let linksMenu = new window.nw.Menu();
    linksMenu.append(new window.nw.MenuItem({
      label: "Add from file",
    }));
    linksMenu.append(new window.nw.MenuItem({
      label: "Export to file",
    }));
    linksMenu.append(new window.nw.MenuItem({
      label: "Clear list",
      click: this.handleLinksClear,
    }));
    let linksItem = new window.nw.MenuItem({label: "Links"});
    // FIXME(Kagami): This doesn't work on Linux. See
    // <https://github.com/nwjs/nw.js/issues/2312>.
    linksItem.enabled = false;
    linksItem.submenu = linksMenu;

    let helpMenu = new window.nw.Menu();
    helpMenu.append(new window.nw.MenuItem({
      label: "About",
    }));
    helpMenu.append(new window.nw.MenuItem({
      label: "Official site",
    }));
    let helpItem = new window.nw.MenuItem({label: "Help"});
    helpItem.submenu = helpMenu;

    let menu = new window.nw.Menu({type: "menubar"});
    menu.append(linksItem);
    menu.append(helpItem);
    return menu;
  },
  spawnAria() {
    const ariap = Aria2c.spawn();
    process.addListener("exit", () => {
      // Always stop spawned process on exit.
      // TODO(Kagami): Unfortunately nw doesn't fire this event on
      // "Reload app" thus leaving aria2 process untouched.
      try {
        ariap.kill();
      } catch(e) {
        /* skip */
      }
    });
    ariap.then(aria2c => {
      this.setState({aspawning: false});
      this.aria2c = aria2c;
    }, err => {
      this.setState({aspawning: false, aerror: err});
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
      border: "solid #a9a9a9",
      borderWidth: "1px 0",
    },
    statusbar: {
    },
  },
  handleListLoad(fname) {
    // FIXME: Process errors.
    const data = fs.readFileSync(fname, {encoding: "utf-8"});
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
  handleLinksClear() {
    this.setState({files: []});
  },
  render() {
    return (
      <div style={this.styles.main}>
        <div style={this.styles.toolbar}>
          <Toolbar
            files={this.state.files}
            aspawning={this.state.aspawning}
            aerror={this.state.aerror}
          />
        </div>
        <div style={this.styles.filelist}>
          <Filelist files={this.state.files} />
        </div>
        <div style={this.styles.statusbar}>
          <Statusbar
            files={this.state.files}
            outdir={this.state.outdir}
            aspawning={this.state.aspawning}
            aerror={this.state.aerror}
          />
        </div>
      </div>
    );
  },
});

ReactDOM.render(<Index/>, document.getElementById("tistore-index"));
