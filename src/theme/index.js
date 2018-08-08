/**
 * Theme-related variables and components.
 * @module tistore/theme
 */

import React from "react";

export class ToolButton extends React.PureComponent {
  styles = {
    main: {
      width: 48,
      fontSize: "30px",
      cursor: "pointer",
      marginRight: 3,
    },
  }
  handleKey = (e) => {
    e.preventDefault();
  }
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
  }
}
