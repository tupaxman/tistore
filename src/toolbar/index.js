/**
 * Toolbar GUI widget.
 * @module tistore/toolbar
 */

import React from "react";
import createReactClass from "create-react-class";
import Icon from "react-fa";
import {ToolButton} from "../theme";
import Tistory from "../tistory";

export default createReactClass({
  styles: {
    main: {
      display: "flex",
      margin: 3,
    },
    url: {
      flex: 1,
      fontSize: "22px",
      marginRight: 3,
      padding: 4,
      height: 50,
      boxSizing: "border-box",
      border: "1px solid #a9a9a9",
    },
    threads: {
      width: 50,
      fontSize: "30px",
      textAlign: "right",
      cursor: "default",
    },
  },
  baseDisabled() {
    // All error states, normally everything should be disabled by this.
    return (
      this.props.spawning ||
      !!this.props.aerror ||
      this.props.disconnected
    );
  },
  commonDisabled() {
    // All setting buttons.
    return this.baseDisabled() || this.props.downloading || this.props.crawling;
  },
  isSetDirDisabled() {
    return this.commonDisabled();
  },
  isURLInvalid() {
    return !Tistory.isBlog(this.props.url) && !Tistory.isPage(this.props.url);
  },
  isURLDisabled() {
    return this.commonDisabled();
  },
  getURLClassName() {
    return (this.props.url && this.isURLInvalid())
      ? "tistore_url-invalid"
      : "tistore_url";
  },
  focusURL() {
    // We can't focus disabled input so we need to run this manually
    // after we spawned aria2.
    this.refs.url.focus();
  },
  isCrawlDisabled() {
    return this.commonDisabled() || this.isURLInvalid();
  },
  isStartPauseDisabled() {
    return (
      this.baseDisabled() ||
      this.props.completed ||
      this.props.crawling ||
      !this.props.files.length
    );
  },
  isStopDisabled() {
    return this.baseDisabled() || !this.props.downloading;
  },
  isThreadsDisabled() {
    // Allow to update concurrency level on-the-fly when downloading.
    return this.baseDisabled() || this.props.crawling;
  },
  handleURLKey(e) {
    if (e.which === 13 && !this.isCrawlDisabled()) {
      this.props.onCrawlClick();
    }
  },
  handleURLChange(e) {
    this.props.onURLChange(e.target.value);
  },
  handleThreadsFocus() {
    // Allow to change value only via spinners.
    this.refs.threads.blur();
  },
  handleThreadsChange(e) {
    this.props.onThreadsChange(+e.target.value);
  },
  render() {
    // Don't allow to pause crawling yet.
    const startPauseIcon = (this.props.downloading && !this.props.pause)
      ? "pause-circle-o"
      : "play-circle-o";
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
          ref="url"
          type="text"
          style={this.styles.url}
          className={this.getURLClassName()}
          placeholder="Tistory blog/page URL"
          disabled={this.isURLDisabled()}
          onKeyPress={this.handleURLKey}
          onChange={this.handleURLChange}
          value={this.props.url}
        />
        <ToolButton
          title="Crawl links"
          disabled={this.isCrawlDisabled()}
          onClick={this.props.onCrawlClick}
        >
          <Icon name="plus" />
        </ToolButton>
        <ToolButton
          title="Start/pause downloading"
          disabled={this.isStartPauseDisabled()}
          onClick={this.props.onStartPauseClick}
        >
          <Icon name={startPauseIcon} />
        </ToolButton>
        <ToolButton
          title="Abort current task"
          disabled={this.isStopDisabled()}
          onClick={this.props.onStopClick}
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
          onChange={this.handleThreadsChange}
          value={this.props.threads}
          min="1"
          max="16"
        />
      </div>
    );
  },
});
