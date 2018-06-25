/**
 * Simple Tistory crawler, provides Promise API.
 * @module tistore/tistory
 */

import assert from "assert";
import request from "request";
import throat from "throat";
import {CHROME_UA} from "../util";

// NOTE(Kagami): Tistory actually has JSON API (see
// <http://www.tistory.com/guide/api/index>), but it requires
// authorization and it would be too risky to hardcode some predefined
// one. Also invite is required to register at Tistory.

export default {
  _LINK_RE: /https?:\/\/t\d+\.daumcdn\.net\/cfile\/tistory\/\w+/g,
  _PAGE_RE: /^https?:\/\/[^/]+\/\d+([?#]|$)/i,
  _BLOG_RE: /^https?:\/\/[^/]+(\/(?!\d)|[?#]|$)/i,
  _getLastPageNum(data) {
    let re = /<a\s+href="\/(\d+)"[\s>]/ig;
    let nums = [];
    let match;
    while ((match = re.exec(data)) != null) {
      nums.push(+match[1]);
    }
    assert.notEqual(nums.length, 0, "Failed to get number of pages");
    const last = Math.max(...nums);
    assert(last > 0, "Failed to get number of pages");
    return last;
  },
  _getLinks(data) {
    // Don't mind returning duplicates since they will be filtered out
    // by `tistore/index.fileSet`.
    return (data.match(this._LINK_RE) || []).map(link => link + "?original");
  },
  _fetch(url) {
    return new Promise((resolve, reject) => {
      const opts = {url, headers: {"User-Agent": CHROME_UA}};
      request.get(opts, (err, res, body) => {
        if (err) {
          reject(err);
        } else if (res.statusCode >= 400) {
          reject(new Error(`Got ${res.statusCode} code`));
        } else {
          resolve(body);
        }
      });
    });
  },
  prepareURL(url) {
    // Forgive user some mistakes but in code we need proper URLs.
    url = url.trim();
    if (!url.startsWith("http://")) url = "http://" + url;
    return url;
  },
  isPage(url) {
    url = this.prepareURL(url);
    return this._PAGE_RE.test(url);
  },
  isBlog(url) {
    url = this.prepareURL(url);
    return this._BLOG_RE.test(url);
  },
  crawlPage(url) {
    url = this.prepareURL(url);
    return this._fetch(url).then(this._getLinks.bind(this));
  },
  crawlBlog(url, opts) {
    url = this.prepareURL(url);

    // Allow user to enter URLs like "a.tistory.com/category/photo" but
    // actual pages are always at blog root, e.g. "a.tistory.com/123".
    const pathIdx = url.indexOf("/", 7);
    if (pathIdx !== -1) url = url.slice(0, pathIdx);

    return this._fetch(url)
      .then(this._getLastPageNum.bind(this))
      .then(last => {
        let currentPage = 0;
        function sendUpdate(links) {
          links = links || [];
          opts.onUpdate({links, currentPage, totalPages: last});
        }

        sendUpdate();
        const pages = Array(last).fill().map((_, i) => `${url}/${i + 1}`);
        return Promise.all(pages.map(throat(opts.threads, page => {
          return this.crawlPage(page).then(links => {
            currentPage++;
            sendUpdate(links);
          }, () => {
            currentPage++;
            sendUpdate();
          });
        })))
          // Links are passed via live updates; this just makes interface
          // similar to crawlPage.
          .then(() => []);
      });
  },
};
