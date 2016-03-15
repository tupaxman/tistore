/**
 * Helper routines and widgets.
 * @module tistore/util
 */

import fs from "fs";
import path from "path";
import which from "which";

// Grab some actual UAs at:
// - <https://github.com/gorhill/uMatrix/wiki/Latest-user-agent-strings>
// - <https://techblog.willshouse.com/2012/01/03/most-common-user-agents/>
export const CHROME_UA = "Mozilla/5.0 (Windows NT 6.1; WOW64) " +
                         "AppleWebKit/537.36 (KHTML, like Gecko) " +
                         "Chrome/48.0.2564.116 Safari/537.36";

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

/**
 * Rename source path to target, preserving existent file at target path
 * in a race-free way. Automatically add numeric suffix to the name in
 * that case (just like wget/aria2 clobbering, but keeping original
 * extension).
 *
 * **NOTE:** Both paths must belong to the same filesytem.
 *
 * @returns {String} Final target path.
 * @throws {Exception} Unrelated IO error or too many tries.
 */
export function safeRenameSync(path1, path2) {
  // Race-free rename. See <https://stackoverflow.com/a/3222465>.
  function tryRename(p1, p2) {
    try {
      fs.linkSync(p1, p2);
    } catch(e) {
      if (e.code === "EEXIST") {
        return false;
      } else {
        throw e;
      }
    }
    fs.unlinkSync(p1);
    return true;
  }

  if (path1 === path2) return path2;
  if (tryRename(path1, path2)) return path2;

  const fdir = path.dirname(path2);
  const fext = path.extname(path2);
  const fname = path.basename(path2, fext);
  for (let i = 1; i < 10000; i++) {
    const fnameTry = fname + "-" + i + fext;
    const pathTry = path.join(fdir, fnameTry);
    if (tryRename(path1, pathTry)) return pathTry;
  }

  throw new Error("Safe rename failed: too many tries");
}
