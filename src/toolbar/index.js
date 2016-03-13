/**
 * Toolbar GUI widget.
 * @module tistore/toolbar
 */

import React from "react";
import Icon from "react-fa";

export default React.createClass({
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
      fontSize: "22px",
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
  isSetDirDisabled() {
    return this.props.aspawning || !!this.props.aerror;
  },
  isUrlDisabled() {
    return this.props.aspawning || !!this.props.aerror;
  },
  isCrawlDisabled() {
    return this.props.aspawning || !!this.props.aerror || true;
  },
  isStartDisabled() {
    return (
      this.props.aspawning || !!this.props.aerror ||
      !this.props.files.length
    );
  },
  isStopDisabled() {
    return this.props.aspawning || !!this.props.aerror || true;
  },
  isThreadsDisabled() {
    return this.props.aspawning || !!this.props.aerror;
  },
  handleThreadsFocus() {
    // Allow to change value only via spinners.
    this.refs.threads.blur();
  },
  handleThreadsChange(e) {
    this.props.onThreadsChange(e.target.value);
  },
  render() {
    return (
      <div style={this.styles.main}>
        <button
          style={this.styles.button}
          title="Set output directory"
          disabled={this.isSetDirDisabled()}
          onClick={this.props.onSetDir}
        >
          <Icon name="folder-o" />
        </button>
        <input
          type="text"
          style={this.styles.url}
          placeholder="Tistory blog/page URL"
          disabled={this.isUrlDisabled()}
        />
        <button
          style={this.styles.button}
          title="Crawl links"
          disabled={this.isCrawlDisabled()}
        >
          <Icon name="plus" />
        </button>
        <button
          style={this.styles.button}
          title="Start/pause downloading"
          disabled={this.isStartDisabled()}
        >
          <Icon name="play-circle-o" />
        </button>
        <button
          style={this.styles.button}
          title="Abort current task"
          disabled={this.isStopDisabled()}
        >
          <Icon name="stop-circle-o" />
        </button>
        <input
          ref="threads"
          type="number"
          style={this.styles.threads}
          title="Number of threads"
          disabled={this.isThreadsDisabled()}
          onFocus={this.handleThreadsFocus}
          onChange={this.handleThreadsChange}
          value={this.props.threads}
          min="1"
          max="99"
        />
      </div>
    );
  },
});
