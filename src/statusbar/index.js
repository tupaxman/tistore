/**
 * Statusbar GUI widget.
 * @module tistore/statusbar
 */

import React from "react";
import Icon from "react-fa";

export default React.createClass({
  styles: {
    main: {
      margin: 3,
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
  },
  handleOutDirClick(e) {
    e.preventDefault();
    // `openItem` doesn't work with directory on Linux.
    global.nw.Shell.openExternal("file://" + this.props.outDir);
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
  getPreaddNode() {
    return <span>Add/crawl some links.</span>;
  },
  getPrerunNode() {
    const len = this.props.files.length;
    const s = len > 1 ? "s" : "";
    return (
      <span>
        {len} link{s} loaded, ready to start.
        <span style={this.styles.label}> Saving to:</span>
        <a href style={this.styles.outDir} onClick={this.handleOutDirClick}>
          <Icon name="folder-o" />
          <span> {this.props.outDir}</span>
        </a>
      </span>
    );
  },
  getStatusNode() {
    const hasLinks = !!this.props.files.length;
    if (this.props.aerror) {
      return this.getAriaErrorNode();
    } else if (this.props.aspawning) {
      return this.getAriaSpawningNode();
    } else if (hasLinks) {
      return this.getPrerunNode();
    } else {
      return this.getPreaddNode();
    }
  },
  render() {
    return <div style={this.styles.main}>{this.getStatusNode()}</div>;
  },
});
