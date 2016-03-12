/**
 * Component that provides view/action logic for the single file loaded
 * inside program.
 * @module tistore/filelist/file
 */

import React from "react";
import Icon from "react-fa";

export default React.createClass({
  getLinkText() {
    const url = this.props.url;
    const hostIdx = url.indexOf("//") + 2;
    return url.slice(hostIdx);
  },
  render() {
    return (
      <tr className="tistore-col">
        <td className="tistore-row1 tistore-row1-ready">
          <Icon name="play" />
        </td>
        <td className="tistore-row2">{this.getLinkText()}</td>
        <td className="tistore-row3">-</td>
        <td className="tistore-row4"></td>
      </tr>
    );
  },
});
