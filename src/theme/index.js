/**
 * Theme-related variables and components.
 * @module tistore/theme
 */

import React from "react";
import createReactClass from "create-react-class";

export const ToolButton = createReactClass({
  styles: {
    main: {
      width: 48,
      fontSize: "30px",
      cursor: "pointer",
      marginRight: 3,
    },
  },
  handleKey(e) {
    e.preventDefault();
  },
  render() {
    return (
      <button
        ref="button"
        style={this.styles.main}
        onKeyDown={this.handleKey}
        {...this.props}
      >
        {this.props.children}
      </button>
    );
  },
});
