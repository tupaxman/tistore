/**
 * Toolbar GUI widget.
 * @module tistore/toolbar
 */

import React from "react";
import Icon from "react-fa";

export default React.createClass({
  getInitialState() {
    return {threads: 16};
  },
  styles: {
    main: {
      display: "flex",
      margin: 3,
    },
    button: {
      width: 48,
      fontSize: "30px",
      cursor: "pointer",
      marginRight: 3,
    },
    url: {
      flex: 1,
      fontSize: "25px",
      height: 40,
      marginRight: 3,
      padding: 3,
    },
    threads: {
      width: 50,
      fontSize: "30px",
      textAlign: "right",
      cursor: "default",
    },
  },
  handleThreadsFocus() {
    // Allow to change value only via spinners.
    this.refs.threads.blur();
  },
  render() {
    return (
      <div style={this.styles.main}>
        <button
          style={this.styles.button}
          title="Select output directory"
        >
          <Icon name="folder-open-o" />
        </button>
        <input
          type="text"
          style={this.styles.url}
          placeholder="Tistory blog/page"
        />
        <button
          style={this.styles.button}
          title="Crawl links"
          disabled
        >
          <Icon name="plus" />
        </button>
        <button
          style={this.styles.button}
          title="Start/pause downloading"
          disabled={!this.props.files.length}
        >
          <Icon name="play-circle-o" />
        </button>
        <button
          style={this.styles.button}
          title="Abort current task"
          disabled
        >
          <Icon name="stop-circle-o" />
        </button>
        <input
          ref="threads"
          type="number"
          style={this.styles.threads}
          title="Number of threads"
          onFocus={this.handleThreadsFocus}
          min="1"
          defaultValue={this.state.threads}
          max="99"
        />
      </div>
    );
  },
});
