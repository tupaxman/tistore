/**
 * View/action logic for the single file inside list.
 * @module tistore/file-list/file
 */

import React from "react";
import Icon from "react-fa";

export default React.createClass({
  shouldComponentUpdate(nextProps/*, nextState*/) {
    return (
      this.props.status !== nextProps.status
    );
  },
  getLinkText() {
    const url = this.props.url;
    const hostIdx = url.indexOf("//") + 2;
    return url.slice(hostIdx);
  },
  getIconName() {
    const status = this.props.status;
    switch (status) {
    case "start":
      return "hourglass-o";
    case "pause":
      return "pause";
    case "complete":
      return "check";
    case "error":
      return "warning";
    default:
      return "play";
    }
  },
  render() {
    return (
      <tr className="tistore_file-row">
        <td className="tistore_file-icon">
          <Icon name={this.getIconName()} />
        </td>
        <td className="tistore_file-link">
          {this.getLinkText()}
        </td>
        <td className="tistore_file-name">-</td>
        <td className="tistore_file-size"></td>
      </tr>
    );
  },
});
