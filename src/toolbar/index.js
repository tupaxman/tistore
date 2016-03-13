/**
 * Toolbar GUI widget.
 * @module tistore/toolbar
 */

import React from "react";
import Icon from "react-fa";
import {ToolButton} from "../theme";

export default React.createClass({
  styles: {
    main: {
      display: "flex",
      margin: 3,
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
    // NOTE(Kagami): Non-focused input doesn't trigger "change" events.
    // Hopefully "click" works good enough.
    this.props.onThreadsChange(+e.target.value);
  },
  render() {
    return (
      <div style={this.styles.main}>
        <ToolButton
          title="Set output directory"
          disabled={this.isSetDirDisabled()}
          onClick={this.props.onSetDir}
        >
          <Icon name="folder-o" />
        </ToolButton>
        <input
          type="text"
          style={this.styles.url}
          placeholder="Tistory blog/page URL"
          disabled={this.isUrlDisabled()}
        />
        <ToolButton
          title="Crawl links"
          disabled={this.isCrawlDisabled()}
        >
          <Icon name="plus" />
        </ToolButton>
        <ToolButton
          title="Start/pause downloading"
          disabled={this.isStartDisabled()}
          onClick={this.props.onStartPauseClick}
        >
          <Icon name="play-circle-o" />
        </ToolButton>
        <ToolButton
          title="Abort current task"
          disabled={this.isStopDisabled()}
        >
          <Icon name="stop-circle-o" />
        </ToolButton>
        <input
          ref="threads"
          type="number"
          style={this.styles.threads}
          title="Number of threads"
          disabled={this.isThreadsDisabled()}
          onFocus={this.handleThreadsFocus}
          onClick={this.handleThreadsChange}
          value={this.props.threads}
          min="1"
          max="99"
        />
      </div>
    );
  },
});
