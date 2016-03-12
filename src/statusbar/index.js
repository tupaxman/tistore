/**
 * Statusbar GUI widget.
 * @module tistore/statusbar
 */

import React from "react";
import Icon from "react-fa";

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
    outdir: {
      textDecoration: "none",
    },
  },
  handleOutdirClick(e) {
    e.preventDefault();
    // `openItem` doesn't work with directory on Linux.
    global.nw.Shell.openExternal("file://" + this.props.outdir);
  },
  getTextNode() {
    const len = this.props.files.length;
    if (len) {
      const s = len > 1 ? "s" : "";
      return (
        <span>
          {len} link{s} loaded, ready to start.
          <span style={this.styles.label}> Saving to:</span>
          <a href style={this.styles.outdir} onClick={this.handleOutdirClick}>
            <Icon name="folder-o" />
            <span> {this.props.outdir}</span>
          </a>
        </span>
      );
    } else {
      return <span>Add some links.</span>;
    }
  },
  render() {
    return <div style={this.styles.main}>{this.getTextNode()}</div>;
  },
});
