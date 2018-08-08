/**
 * Status bar GUI widget.
 * @module tistore/status-bar
 */

import React from "react";
import Icon from "react-fa";
import {showSpeed} from "../util";

export default class StatusBar extends React.PureComponent {
  styles = {
    main: {
      margin: "3px 5px",
      cursor: "default",
      WebkitUserSelect: "none",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    label: {
      paddingRight: 8,
    },
    spawning: {
      color: "orange",
    },
    error: {
      color: "red",
    },
    right: {
      float: "right",
    },
    download: {
      color: "green",
    },
    speed: {
      width: 100,
      textAlign: "right",
      display: "inline-block",
      color: "#333",
      fontStyle: "italic",
    },
  }
  handleOutDirClick = (e) => {
    e.preventDefault();
    // `openItem` doesn't work with directory on Linux.
    global.nw.Shell.openExternal("file://" + this.props.outDir);
  }
  _getOutDirNode() {
    return (
      <a href="" onClick={this.handleOutDirClick}>
        <Icon name="folder-o" />
        <span> {this.props.outDir}</span>
      </a>
    );
  }
  getAriaErrorNode() {
    return (
      <span style={this.styles.error}>
        <Icon name="warning" />
        <span> {this.props.aerror.message}</span>
      </span>
    );
  }
  getDisconnectedNode() {
    return (
      <span style={this.styles.error}>
        <Icon name="warning" />
        <span> Lost connection to aria2c daemon. Restart program.</span>
      </span>
    );
  }
  getSpawningNode() {
    return (
      <span style={this.styles.spawning}>
        <Icon pulse name="spinner" />
        <span> Spawning aria2c daemon…</span>
      </span>
    );
  }
  getDownloadingNode() {
    const all = this.props.files.length;
    return (
      <span>
        <span>Downloading: {this.props.progress}/{all}</span>
        <span style={this.styles.right}>
          <span style={this.styles.download}><Icon name="download" /></span>
          <span style={this.styles.speed}> {showSpeed(this.props.speed)}</span>
        </span>
      </span>
    );
  }
  getPauseNode() {
    return <span>Download paused.</span>;
  }
  getCompletedNode() {
    return (
      <span>
        <span style={this.styles.label}>Download complete into:</span>
        {this._getOutDirNode()}
      </span>
    );
  }
  getCrawlingNode() {
    return (
      <span>
        <span>Crawling: {this.props.currentEntry}/{this.props.totalEntries}
        </span>
      </span>
    );
  }
  getPreRunNode() {
    const len = this.props.files.length;
    const s = len > 1 ? "s" : "";
    return (
      <span>
        <span>{len} link{s} loaded.</span>
        <span style={this.styles.label}> Saving to:</span>
        {this._getOutDirNode()}
      </span>
    );
  }
  getPreAddNode() {
    return (
      <span>
        <span>Add/crawl some links.</span>
        <span style={this.styles.label}> Saving to:</span>
        {this._getOutDirNode()}
      </span>
    );
  }
  getStatusNode() {
    if (this.props.aerror) {
      return this.getAriaErrorNode();
    } else if (this.props.disconnected) {
      return this.getDisconnectedNode();
    } else if (this.props.spawning) {
      return this.getSpawningNode();
    } else if (this.props.pause) {
      return this.getPauseNode();
    } else if (this.props.downloading) {
      return this.getDownloadingNode();
    } else if (this.props.completed) {
      return this.getCompletedNode();
    } else if (this.props.crawling) {
      return this.getCrawlingNode();
    } else if (this.props.files.length) {
      return this.getPreRunNode();
    } else {
      return this.getPreAddNode();
    }
  }
  render() {
    return <div style={this.styles.main}>{this.getStatusNode()}</div>;
  }
}
