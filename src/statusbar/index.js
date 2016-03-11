/**
 * Statusbar GUI widget.
 * @module tistore/statusbar
 */

import React from "react";

export default React.createClass({
  styles: {
    main: {
      margin: 3,
    },
  },
  getText() {
    const len = this.props.files.length;
    switch (len) {
    case 0:
      return "Add some links.";
    case 1:
      return `${len} link loaded. Ready to start.`;
    default:
      return `${len} links loaded. Ready to start.`;
    }
  },
  render() {
    return <div style={this.styles.main}>{this.getText()}</div>;
  },
});
