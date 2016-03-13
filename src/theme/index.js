/**
 * Theme-related variables and components.
 * @module tistore/theme
 */

import React from "react";

export const ToolButton = React.createClass({
  styles: {
    main: {
      width: 48,
      fontSize: "30px",
      cursor: "pointer",
      marginRight: 3,
    },
  },
  handleFocus() {
    this.refs.button.blur();
  },
  render() {
    return (
      <button
        ref="button"
        style={this.styles.main}
        onFocus={this.handleFocus}
        {...this.props}
      >
        {this.props.children}
      </button>
    );
  },
});
