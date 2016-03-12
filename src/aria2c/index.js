/**
 * aria2c wrapper. Provides platform-independent Promise API.
 * @module tistory/aria2c
 */

import crypto from "crypto";
import {spawn} from "child_process";
import {getRunPath} from "../util";
if (WIN_BUILD) {
  require("../../bin/aria2c.exe");
}

class Aria2c {
  constructor(proc) {
    this._proc = proc;
  }
}

export default {
  _run(args) {
    if (process.env.TISTORE_DEBUG_ARIA) {
      return Promise.resolve(new Aria2c(null));
    }
    const runpath = getRunPath("aria2c");
    let proc;
    let exited = false;
    let stdout = "";
    let stderr = "";
    let ariap = new Promise((resolve, reject) => {
      try {
        proc = spawn(runpath, args, {stdio: ["ignore", "pipe", "pipe"]});
      } catch(err) {
        exited = true;
        throw new Error(`Failed to run aria2c: ${err.message}`);
      }
      function stderrHandler(data) {
        stderr += data;
      }
      function stdoutHandler(data) {
        stdout += data;
        // TODO(Kagami): What if message will be changed?
        if (stdout.includes("listening on TCP port")) {
          proc.stdout.removeListener("data", stdoutHandler);
          proc.stderr.removeListener("data", stderrHandler);
          resolve(new Aria2c(proc));
        }
      }
      proc.stdout.on("data", stdoutHandler);
      proc.stderr.on("data", stderrHandler);
      proc.on("error", err => {
        reject(new Error(`Failed to run aria2c: ${err.message}`));
      });
      proc.on("close", code => {
        exited = true;
        if (code || code == null) {
          // TODO(Kagami): aria2 error messages are normally too long to
          // display them in status as is. We may put them to some log
          // though.
          return reject(new Error(`aria2c exited with code ${code}`));
        }
      });
    });
    // We need to provide method to kill spawned process in any case
    // because our detection of "normal run" may fail or whatever.
    ariap.kill = function() {
      // XXX(Kagami): aria2 theoretically may ignore SIGTERM and
      // continue to run. This shouldn't happen in practice though.
      if (!exited) proc.kill();
    };
    return ariap;
  },
  _getRPCSecret() {
    // 128 bit of entropy.
    return crypto.randomBytes(16).toString("hex");
  },
  getRPCPort() {
    // FIXME(Kagami): What to do if port is in use?
    return 11208;
  },
  spawn() {
    // TODO(Kagami): Disable console logging to avoid unnecessary
    // events? We still need to somehow determine whether aria2 is
    // launched and currently we do this by parsing NOTICE log msgs.
    return this._run([
      "--enable-rpc",
      "--rpc-secret", this._getRPCSecret(),
      "--rpc-listen-port", this.getRPCPort(),
    ]);
  },
};
