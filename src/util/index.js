/**
 * Helper routines and widgets.
 * @module tistore/util
 */

import which from "which";
export {default as ShowHide} from "./show-hide";

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
