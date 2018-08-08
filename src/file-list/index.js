/**
 * List of files widget.
 * @module tistore/file-list
 */

import React from "react";
import FileItem from "./file-item";

export default class FileList extends React.PureComponent {
  styles = {
    main: {
      width: "100%",
      borderSpacing: 0,
      WebkitUserSelect: "none",
      cursor: "default",
      fontSize: "14px",
      tableLayout: "fixed",
      whiteSpace: "nowrap",
      wordBreak: "break-all",
    },
  }
  render() {
    return (
      <table style={this.styles.main}>
        <tbody>
          {this.props.files.map(file =>
            <FileItem key={file.url} {...file} />
          )}
        </tbody>
      </table>
    );
  }
}
