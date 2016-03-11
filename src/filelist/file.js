/**
 * Component that provides view/action logic for the single file loaded
 * inside program.
 * @module tistore/filelist/file
 */

import React from "react";

export default React.createClass({
  getInitialState() {
    return {};
  },
  styles: {
    link: {
      fontSize: "14px",
      cursor: "pointer",
    },
  },
  getMainStyle() {
    return {
      background: (this.props.index & 1) ? "#eee" : "#fff",
    };
  },
  getLinkText() {
    const url = this.props.url;
    if (url.startsWith("http://")) {
      return url.slice(7);
    } else if (url.startsWith("https://")) {
      return url.slice(8);
    } else {
      // Just in case.
      return url;
    }
  },
  handleLinkClick() {
    global.nw.Shell.openExternal(this.props.url);
  },
  render() {
    return (
      <tr style={this.getMainStyle()}>
        <td>
          <span onClick={this.handleLinkClick} style={this.styles.link}>
            {this.getLinkText()}
          </span>
        </td>
      </tr>
    );
  },
});
