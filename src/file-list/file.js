/**
 * View/action logic for the single file inside list.
 * @module tistore/file-list/file
 */

import React from "react";
import Icon from "react-fa";

export default React.createClass({
  shouldComponentUpdate(nextProps/*, nextState*/) {
    return this.props.file !== nextProps.file;
  },
  getLinkText() {
    const url = this.props.file.url;
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
