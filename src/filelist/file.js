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
      textDecoration: "none",
      fontSize: "12px",
    },
  },
  getMainStyle() {
    return {
      background: (this.props.index & 1) ? "#eee" : "#fff",
    };
  },
  render() {
    return (
      <tr style={this.getMainStyle()}>
        <td>
          <a href={this.props.url} target="_blank" style={this.styles.link}>
            {this.props.url}
          </a>
        </td>
      </tr>
    );
  },
});
