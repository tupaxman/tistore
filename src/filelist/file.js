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
    if (url.startsWith("http://")) {
      return url.slice(7);
    } else if (url.startsWith("https://")) {
      return url.slice(8);
    } else {
      // Just in case.
      return url;
    }
  },
  render() {
    return (
      <tr className="tistore-col">
        <td className="tistore-row1"><Icon name="check" /></td>
        <td className="tistore-row2">{this.getLinkText()}</td>
        <td className="tistore-row3">testteaaaaaaaaaaaaaaaaaaasttest.jpg</td>
        <td className="tistore-row4">300 KiB</td>
      </tr>
    );
  },
});
