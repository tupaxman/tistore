/**
 * List of files widget.
 * @module tistore/file-list
 */

import React from "react";
import File from "./file";

export default React.createClass({
  styles: {
    main: {
      width: "100%",
      borderSpacing: 0,
      WebkitUserSelect: "none",
      cursor: "default",
      fontSize: "14px",
      tableLayout: "fixed",
    },
  },
  render() {
    const fileNodes = this.props.files.map(file =>
      <File key={file.url} file={file} />
    );
    return (
      <table style={this.styles.main}>
      <tbody>
        {fileNodes}
      </tbody>
      </table>
    );
  },
});
