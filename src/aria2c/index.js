/**
 * aria2c wrapper. Provides platform-independent Promise API.
 * @module tistory/aria2c
 */

import {spawn} from "child_process";
import {getRunPath} from "../util";
if (WIN_BUILD) {
  require("../../bin/aria2c.exe");
}

export default {
  _run(args) {
    const runpath = getRunPath("aria2c");
    let stderr = "";
    return new Promise((resolve, reject) => {
      let p;
      try {
        p = spawn(runpath, args, {stdio: ["ignore", "ignore", "pipe"]});
      } catch(err) {
        throw new Error(`Failed to run ffmpeg: ${err.message}`);
      }
      p.stderr.on("data", data => {
        stderr += data;
      });
      p.on("error", err => {
        reject(new Error(`Failed to run aria2c: ${err.message}`));
      });
      p.on("close", (code/*, signal*/) => {
        if (code || code == null) {
          return reject(new Error(
            `aria2c exited with code ${code} (${stderr})`
          ));
        }
        resolve();
      });
    });
  },
};
