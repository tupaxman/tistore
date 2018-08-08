/**
 * aria2c daemon wrapper, provides Promise API.
 * @module tistore/aria2c
 */

import crypto from "crypto";
import {spawn} from "child_process";
import {CHROME_UA, getRunPath} from "../util";
import Aria2c from "./rpc";
if (WIN_BUILD) {
  require("../../bin/aria2c.exe");
}

export default {
  // FIXME(Kagami): What to do if port is in use?
  _RPC_PORT: 11208,
  // Current aria2 limit.
  _MAX_CONNECTION_PER_SERVER: 16,
  _genRPCSecret() {
    // 128 bit of entropy.
    return crypto.randomBytes(16).toString("hex");
  },
  _run(args, secret) {
    const port = this._RPC_PORT;
    secret = process.env.TISTORE_DEBUG_ARIA || secret;
    if (process.env.TISTORE_DEBUG_ARIA) {
      return Promise.resolve(new Aria2c({port, secret}));
    }
    const runpath = getRunPath("aria2c");
    let proc;
    let exited = false;
    let stdout = "";
    let ariap = new Promise((resolve, reject) => {
      try {
        proc = spawn(runpath, args, {stdio: ["ignore", "pipe", "ignore"]});
      } catch(err) {
        exited = true;
        throw new Error(`Failed to run aria2c: ${err.message}`);
      }
      proc.stdout.on("data", data => {
        stdout += data;
        // TODO(Kagami): What if message will be changed? Also note that
        // we can't disable console logging at start (in order to parse
        // this message), it's neither possible to disable via RPC
        // later.
        if (stdout.includes("listening on TCP port")) {
          proc.stdout.destroy();
          resolve(new Aria2c({proc, port, secret}));
        }
      });
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
    // TODO(Kagami): Is it enough to emit SIGTERM?
    ariap.kill = () => {
      if (!exited) proc.kill();
    };
    return ariap;
  },
  spawn() {
    const secret = this._genRPCSecret();
    return this._run([
      "--enable-rpc",
      "--rpc-listen-port", this._RPC_PORT,
      "--rpc-secret", secret,
      // Maximize per-server limit.
      "--max-connection-per-server", this._MAX_CONNECTION_PER_SERVER,
      // Don't split files for simplicity.
      "--split", "1",
      // Just in case.
      "--user-agent", CHROME_UA,
      "--content-disposition-default-utf8",
    ], secret);
  },
};
