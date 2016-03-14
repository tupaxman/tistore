/**
 * Status bar GUI widget.
 * @module tistore/status-bar
 */

import React from "react";
import Icon from "react-fa";
import {showSpeed} from "../util";

export default React.createClass({
  styles: {
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
    outDir: {
      textDecoration: "none",
    },
    spawning: {
      color: "blue",
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
  },
  handleOutDirClick(e) {
    e.preventDefault();
    // `openItem` doesn't work with directory on Linux.
    global.nw.Shell.openExternal("file://" + this.props.outDir);
  },
  getOutDirNode() {
    return (
      <a href style={this.styles.outDir} onClick={this.handleOutDirClick}>
        <Icon name="folder-o" />
        <span> {this.props.outDir}</span>
      </a>
    );
  },
  getAriaSpawningNode() {
    return (
      <span style={this.styles.spawning}>
        <Icon pulse name="spinner" />
        <span> Spawning aria2c daemon…</span>
      </span>
    );
  },
  getAriaErrorNode() {
    return (
      <span style={this.styles.error}>
        <Icon name="warning" />
        <span> {this.props.aerror.message}</span>
      </span>
    );
  },
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
  },
  getPauseNode() {
    return <span>Download paused.</span>;
  },
  getCompletedNode() {
    return (
      <span>
        <span style={this.styles.label}>Download complete into:</span>
        {this.getOutDirNode()}
      </span>
    );
  },
  getPreRunNode() {
    const len = this.props.files.length;
    const s = len > 1 ? "s" : "";
    return (
      <span>
        {len} link{s} loaded, ready to start.
        <span style={this.styles.label}> Saving to:</span>
        {this.getOutDirNode()}
      </span>
    );
  },
  getPreAddNode() {
    return <span>Add/crawl some links.</span>;
  },
  getStatusNode() {
    if (this.props.aerror) {
      return this.getAriaErrorNode();
    } else if (this.props.aspawning) {
      return this.getAriaSpawningNode();
    } else if (this.props.pause) {
      return this.getPauseNode();
    } else if (this.props.downloading) {
      return this.getDownloadingNode();
    } else if (this.props.completed) {
      return this.getCompletedNode();
    } else if (this.props.files.length) {
      return this.getPreRunNode();
    } else {
      return this.getPreAddNode();
    }
  },
  render() {
    return <div style={this.styles.main}>{this.getStatusNode()}</div>;
  },
});
