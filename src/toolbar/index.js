/**
 * Toolbar GUI widget.
 * @module tistore/toolbar
 */

import React from "react";
import Icon from "react-fa";

export default React.createClass({
  getInitialState() {
    return {};
  },
  styles: {
  },
  render() {
    return (
      <div>
        <Icon spin name="spinner" />
      </div>
    );
  },
});
