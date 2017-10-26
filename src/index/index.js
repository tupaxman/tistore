/**
 * Entry point of the application.
 * @module tistore/index
 */

import fs from "fs";
import os from "os";
import path from "path";
import React from "react";
import createReactClass from "create-react-class";
import ReactDOM from "react-dom";
import "./package.json.ejs";
import "./index.html.ejs";
import "./icon.png";
import "./opensans-regular.woff2";
import "./opensans-bold.woff2";
import "./opensans-italic.woff2";
import Aria2s from "../aria2c";
import Toolbar from "../toolbar";
import FileList from "../file-list";
import StatusBar from "../status-bar";
import FileDialog from "../file-dialog";
import Tistory from "../tistory";
import {safeRenameSync} from "../util";
import pkg from "../../package.json";

const Index = createReactClass({
  getInitialState() {
    // Very simple OrderedDict equiavalent.
    this.fileSet = (function() {
      let list = [];
      let hash = Object.create(null);
      return {
        /* View as list. */
        list: list,
        add(file) {
          if (!(file.url in hash)) {
            hash[file.url] = null;
            list.push(file);
          }
        },
        clear() {
          list.length = 0;
          hash = Object.create(null);
        },
      };
    })();
    const outDir = process.env.TISTORE_DEBUG_DIR || os.tmpdir();
    return {
      outDir,
      url: "",
      threads: 16,
      spawning: true,
      files: this.fileSet.list,
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
        // NOTE(Kagami): aria2 process will be killed by onexit handler;
        // it should be rather safe since we send SIGTERM and aria2
        // should do all needed cleanup before exit.
        mainWindow.close(true);
      }
    });
    this.setMenu();
    this.spawnAria();
  },
  // Make sure this isn't skipped because of `shouldComponentUpdate`.
  componentDidUpdate() {
    const isReady = !(
      this.state.spawning ||
      this.state.aerror ||
      this.state.disconnected ||
      this.state.downloading
    );
    const hasLinks = !!this.state.files.length;
    this.addLinksItem.enabled = isReady;
    this.exportLinksItem.enabled = isReady && hasLinks;
    this.clearLinksItem.enabled = isReady && hasLinks;
  },
  setMenu() {
    this.addLinksItem = new window.nw.MenuItem({
      label: "Add from file",
      click: this.handleLinksAdd,
    });
    this.exportLinksItem = new window.nw.MenuItem({
      label: "Export to file",
      click: this.handleLinksExport,
    });
    this.clearLinksItem = new window.nw.MenuItem({
      label: "Clear list",
      click: this.handleLinksClear,
    });
    let linksMenu = new window.nw.Menu();
    linksMenu.append(this.addLinksItem);
    linksMenu.append(this.exportLinksItem);
    linksMenu.append(this.clearLinksItem);
    let linksItem = new window.nw.MenuItem({label: "Links"});
    linksItem.submenu = linksMenu;

    let helpMenu = new window.nw.Menu();
    helpMenu.append(new window.nw.MenuItem({
      label: "About",
      click: this.handleAboutClick,
    }));
    helpMenu.append(new window.nw.MenuItem({
      label: "Official site",
      click: this.handleSiteClick,
    }));
    let helpItem = new window.nw.MenuItem({label: "Help"});
    helpItem.submenu = helpMenu;

    let menu = new window.nw.Menu({type: "menubar"});
    menu.append(linksItem);
    menu.append(helpItem);
    let mainWindow = window.nw.Window.get();
    mainWindow.menu = menu;
  },
  spawnAria() {
    const ariap = Aria2s.spawn();
    process.on("exit", () => {
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
      aria2c.on("close", this.handleAriaDisconnect);
      return aria2c.connect().then(() => {
        this.setState({spawning: false});
        this.aria2c = aria2c;
        this.setDir(this.state.outDir);
        this.handleThreadsChange(this.state.threads);
        this.refs.toolbar.focusURL();
      });
    }).catch(err => {
      this.setState({spawning: false, aerror: err});
    });
  },
  styles: {
    main: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
    fileList: {
      flex: 1,
      overflowY: "scroll",
      border: "solid #a9a9a9",
      borderWidth: "1px 0",
    },
  },
  clearCompleted() {
    if (this.state.completed) {
      this.fileSet.clear();
      this.setState({completed: false});
    }
  },
  handleLinksAdd() {
    this.clearCompleted();
    this.refs.openFile.select().then(f => this.handleListLoad(f.path));
  },
  handleListLoad(fpath) {
    // Just ignore any read errors.
    const data = fs.readFileSync(fpath, {encoding: "utf-8"});
    data.trim().split(/\r?\n/).forEach(line => {
      line = line.trim();
      // Should be enough for now. Leaving to aria2 all remaining
      // validation.
      if (line.match(/^https?:\/\//)) {
        this.fileSet.add({url: line});
      }
    });
    this.setState({files: this.fileSet.list});
  },
  handleLinksExport() {
    this.refs.saveFile.select().then(file => {
      const data = this.state.files.map(f => f.url).join(os.EOL);
      // TODO(Kagami): Handle write errors.
      fs.writeFileSync(file.path, data);
    });
  },
  handleLinksClear() {
    this.fileSet.clear();
    this.setState({completed: false});
  },
  setDir(outDir) {
    this.aria2c.setOption("dir", outDir);
    this.setState({outDir});
  },
  handleSetDir() {
    this.clearCompleted();
    this.refs.openDir.select().then(d => this.setDir(d.path));
  },
  handleAboutClick() {
    alert(pkg.about);
  },
  handleSiteClick() {
    global.nw.Shell.openExternal(pkg.homepage);
  },
  handleURLChange(url) {
    this.setState({url});
  },
  handleThreadsChange(threads) {
    this.aria2c.setOption("max-concurrent-downloads", threads);
    this.setState({threads});
  },
  handleAriaDisconnect() {
    // NOTE(Kagami): We can respawn aria2 daemon here but too much
    // effort. Just suggest user to restart program...
    this.setState({disconnected: true});
  },
  handleCrawlUpdate({links, currentPage, totalPages}) {
    links.forEach(url => this.fileSet.add({url}));
    this.setState({currentPage, totalPages});
  },
  handleCrawlClick() {
    this.clearCompleted();
    let prePages, method, opts;
    if (Tistory.isBlog(this.state.url)) {
      prePages = "?";
      method = "crawlBlog";
      opts = {threads: this.state.threads, onUpdate: this.handleCrawlUpdate};
    } else {
      prePages = 1;
      method = "crawlPage";
    }
    this.setState({crawling: true, currentPage: 0, totalPages: prePages});
    // TODO(Kagami): Allow to pause/stop crawling.
    Tistory[method](this.state.url, opts).then(links => {
      links.forEach(url => this.fileSet.add({url}));
      this.setState({crawling: false, url: ""});
      this.runDownload();
    }, () => {
      // FIXME(Kagami): Display crawling errors.
      this.setState({crawling: false, url: ""});
    });
  },
  runDownload() {
    if (this.state.downloading) return;

    let progress = 0;
    const files = this.state.files;
    const updateStats = () => {
      this.aria2c.call("getGlobalStat").then(stats => {
        const speed = +stats.downloadSpeed;
        this.setState({speed});
        const numActive = +stats.numActive;
        const numWaiting = +stats.numWaiting;
        // NOTE(Kagami): There might be a little lag between last file
        // was downloaded and this request completed, but checking for
        // actual status of aria2 rather than our internal status should
        // be more robust.
        if (numActive < 1 && numWaiting < 1) {
          this.setState({downloading: false, pause: false, completed: true});
        } else {
          // FIXME(Kagami): Clear on pause/disconnect.
          setTimeout(updateStats, 1000);
        }
      });
    };
    const flushState = () => {
      this.setState({files});
    };
    const manageFile = (file) => {
      this.aria2c.getInfo(file.gid).then(info => {
        const fpath = info.files[0].path;
        if (file.status === "error") {
          file.errorMsg = info.errorMessage;
          // Remove junk.
          // NOTE(Kagami): We remove control file first to avoid
          // potential race:
          //   - we:    remove(fpath)
          //   - aria2: downloadTo(fpath), create(fpath.aria2)
          //   - we:    remove(fpath.aria2)
          try {
            fs.unlinkSync(fpath + ".aria2");
          } catch(e) {
            /* skip */
          }
          try {
            fs.unlinkSync(fpath);
          } catch(e) {
            /* skip */
          }
        } else {
          file.size = +info.totalLength;
          let fname = path.basename(fpath);
          // Remove aria2's numeric suffix (this will be handled by our
          // safe rename).
          fname = fname.replace(/\.\d+$/, "");
          // Remove percent encoding (we need this because Tistory
          // doesn't specify encoding of Content-Disposition, see
          // <https://github.com/tatsuhiro-t/aria2/issues/425> for
          // details).
          fname = decodeURIComponent(fname);
          let fpath2 = path.join(path.dirname(fpath), fname);
          try {
            // NOTE(Kagami): There is still possibility of race
            // condition because aria2 auto-file-renaming code is _not_
            // race-free. Though probablity is low since we use slightly
            // different auto-rename suffix (a-1.jpg instead of
            // a.jpg.1) and duplicates at Tistory are not that often.
            fpath2 = safeRenameSync(fpath, fpath2);
            file.name = path.basename(fpath2);
            file.path = fpath2;
          } catch(e) {
            /* skip */
          }
        }
        flushState();
      });
    };
    const removeListeners = (file) => {
      // Allow GC to free memory.
      this.aria2c.removeAllListeners(`start.${file.gid}`);
      this.aria2c.removeAllListeners(`pause.${file.gid}`);
    };
    const bumpProgress = () => {
      this.setState({progress: ++progress});
    };

    // Start!
    this.setState({downloading: true, speed: 0, progress});
    files.forEach(file => {
      // TODO(Kagami): Handle addUri errors.
      this.aria2c.add(file.url).then(gid => {
        file.gid = gid;
        // Happen each time user clicks start/pause button.
        this.aria2c.on(`start.${gid}`, () => {
          file.status = "start";
          flushState();
        });
        this.aria2c.on(`pause.${gid}`, () => {
          file.status = "pause";
          flushState();
        });
        // These events should happen only once.
        this.aria2c.once(`complete.${gid}`, () => {
          file.status = "complete";
          removeListeners(file);
          bumpProgress();
          manageFile(file);
        });
        this.aria2c.once(`error.${gid}`, () => {
          file.status = "error";
          removeListeners(file);
          bumpProgress();
          manageFile(file);
        });
      });
    });
    updateStats();
  },
  handleStartPauseClick() {
    if (this.state.downloading) {
      const pause = !this.state.pause;
      const method = pause ? "pauseAll" : "unpauseAll";
      // TODO(Kagami): Use pausing/stopping states to be safe against
      // possible races?
      this.aria2c.call(method);
      this.setState({pause});
    } else {
      this.runDownload();
    }
  },
  handleStopClick() {
    if (confirm("Are you sure you want to abort?")) {
      if (this.state.downloading) {
        const files = this.state.files;
        files.forEach(f => this.aria2c.forceRemove(f.gid));
        this.fileSet.clear();
        this.setState({downloading: false, pause: false, files});
      }
    }
  },
  render() {
    return (
      <div style={this.styles.main}>
        <div>
          <Toolbar
            ref="toolbar"
            spawning={this.state.spawning}
            aerror={this.state.aerror}
            downloading={this.state.downloading}
            pause={this.state.pause}
            completed={this.state.completed}
            disconnected={this.state.disconnected}
            crawling={this.state.crawling}
            url={this.state.url}
            threads={this.state.threads}
            files={this.state.files}
            onSetDir={this.handleSetDir}
            onURLChange={this.handleURLChange}
            onCrawlClick={this.handleCrawlClick}
            onStartPauseClick={this.handleStartPauseClick}
            onStopClick={this.handleStopClick}
            onThreadsChange={this.handleThreadsChange}
          />
        </div>
        <div style={this.styles.fileList}>
          <FileList files={this.state.files} />
        </div>
        <div>
          <StatusBar
            spawning={this.state.spawning}
            aerror={this.state.aerror}
            downloading={this.state.downloading}
            pause={this.state.pause}
            completed={this.state.completed}
            progress={this.state.progress}
            speed={this.state.speed}
            disconnected={this.state.disconnected}
            crawling={this.state.crawling}
            currentPage={this.state.currentPage}
            totalPages={this.state.totalPages}
            files={this.state.files}
            outDir={this.state.outDir}
          />
        </div>
        <FileDialog ref="openFile" accept=".txt" />
        <FileDialog ref="saveFile" accept=".txt" saveAs="links.txt" />
        <FileDialog ref="openDir" directory />
      </div>
    );
  },
});

ReactDOM.render(<Index/>, document.getElementById("tistore_index"));
