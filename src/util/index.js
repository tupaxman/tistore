/**
 * Helper routines and widgets.
 * @module tistore/util
 */

import which from "which";

// Grab some actual UAs at:
// - <https://techblog.willshouse.com/2012/01/03/most-common-user-agents/>
export const CHROME_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
                         "AppleWebKit/537.36 (KHTML, like Gecko) " +
                         "Chrome/66.0.3359.181 Safari/537.36";

// Taken from wybm.
export function showSize(size) {
  if (size < 1024) {
    return size + " B";
  } else if (size < 1024 * 1024) {
    size /= 1024;
    return size.toFixed(2) + " KiB";
  } else {
    size /= 1024 * 1024;
    return size.toFixed(2) + " MiB";
  }
}

export function showSpeed(speed) {
  return showSize(speed) + "/s";
}

// Taken from wybm.
export function getRunPath(cmd) {
  try {
    if (WIN_BUILD) {
      var paths = which.sync(cmd, {all: true});
      // Windows has CWD in PATH at top so we need this little kludge.
      if (paths.length > 1) {
        return paths[1];
      } else {
        return paths[0];
      }
    } else {
      return which.sync(cmd);
    }
  } catch(e) {
    return null;
  }
}
