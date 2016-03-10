/**
 * Filelist GUI widget.
 * @module tistore/filelist
 */

import React from "react";
import File from "./file";

export default React.createClass({
  getInitialState() {
    return {};
  },
  styles: {
    main: {
      width: "100%",
      borderSpacing: 0,
    },
  },
  render() {
    const fileNodes = this.props.files.map((file, i) =>
      <File key={file.url} index={i} {...file} />
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
