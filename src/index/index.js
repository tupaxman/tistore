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
    let menu = new window.nw.Menu({type: "menubar"});

    let linksItem = new window.nw.MenuItem({label: "Links"});
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
    linksItem.submenu = linksMenu;
    menu.append(linksItem);

    let helpItem = new window.nw.MenuItem({label: "Help"});
    let helpMenu = new window.nw.Menu();
    helpMenu.append(new window.nw.MenuItem({
      label: "About",
    }));
    helpMenu.append(new window.nw.MenuItem({
      label: "Official site",
    }));
    helpItem.submenu = helpMenu;
    menu.append(helpItem);

    mainWindow.menu = menu;
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
  handleLinksClear() {
    this.setState({files: []});
  },
  render() {
    return (
      <div style={this.styles.main}>
        <div style={this.styles.toolbar}>
          <Toolbar files={this.state.files} />
        </div>
        <div style={this.styles.filelist}>
          <Filelist files={this.state.files} />
        </div>
        <div style={this.styles.statusbar}>
          <Statusbar files={this.state.files} />
        </div>
      </div>
    );
  },
});

ReactDOM.render(<Index/>, document.getElementById("tistore-index"));
