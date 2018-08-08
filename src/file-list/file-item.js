/**
 * View/action logic for the single file inside list.
 * @module tistore/file-list/file-item
 */

import React from "react";
import Icon from "react-fa";
import {showSize} from "../util";

export default class FileItem extends React.PureComponent {
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
  }
  getLinkText() {
    const url = this.props.url;
    const hostIdx = url.indexOf("//") + 2;
    // Remove nonimportant junk.
    return url.slice(hostIdx);
  }
  handleNameClick = (e) => {
    e.preventDefault();
    global.nw.Shell.openItem(this.props.path);
  }
  getNameNode() {
    if (this.props.status === "error") {
      return this.props.errorMsg;
    } else if (this.props.path) {
      return <a href="" onClick={this.handleNameClick}>{this.props.name}</a>;
    } else {
      return "-";
    }
  }
  getSizeText() {
    return this.props.size != null ? showSize(this.props.size) : "";
  }
  render() {
    const cls = `tistore_file-row tistore_file-${this.props.status}`;
    const icon = this.getIconName();
    return (
      <tr className={cls}>
        <td className="tistore_file-icon"><Icon name={icon} /></td>
        <td className="tistore_file-link">{this.getLinkText()}</td>
        <td className="tistore_file-name">{this.getNameNode()}</td>
        <td className="tistore_file-size">{this.getSizeText()}</td>
      </tr>
    );
  }
}
