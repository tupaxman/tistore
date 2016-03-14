/**
 * aria2c JSON-RPC client, provides Promise API.
 * @module tistory/aria2c/rpc
 */

import EventEmitter from "events";

export default class extends EventEmitter {
  constructor({proc, port, secret}) {
    super();
    this._proc = proc;
    this._url = `ws://localhost:${port}/jsonrpc`;
    this._token = `token:${secret}`;
    this._init();
  }
  _init() {
    this._ws = null;
    this._id = 0;
    this._callbacks = Object.create(null);
  }
  get _METHOD_TO_EVENT() {
    return {
      "aria2.onDownloadStart": "start",
      "aria2.onDownloadPause": "pause",
      "aria2.onDownloadStop": "stop",
      "aria2.onDownloadComplete": "complete",
      "aria2.onDownloadError": "error",
      "aria2.onBtDownloadComplete": "btcomplete",
    };
  }
  connect() {
    return new Promise((resolve/*, reject*/) => {
      if (this._ws) throw new Error("Already connected");
      let ws = this._ws = new WebSocket(this._url);
      ws.onopen = () => {
        resolve();
      };
      ws.onmessage = e => {
        const msg = JSON.parse(e.data);
        console.log("MSG<-", msg);
        const id = msg.id;
        if (id == null) {
          const ev = this._METHOD_TO_EVENT[msg.method];
          const gid = msg.params[0].gid;
          const event = ev + "." + gid;
          this.emit(event);
        } else {
          const cb = this._callbacks[id];
          if (!cb) return;
          if (msg.error) {
            let err = new Error(msg.error.message);
            err.code = msg.error.code;
            cb[1](err);
          } else {
            cb[0](msg.result);
          }
          delete this._callbacks[id];
        }
      };
      ws.onclose = () => {
        this._init();
        // NOTE(Kagami): We don't reject here because "close" event may
        // happen anytime in future so user of this class will need two
        // error handlers for the exact same event.
        // NOTE(Kagami): We don't try to reconnect because disconnect
        // with WebSocket server at localhost most probably means that
        // aria2 daemon died.
        this.emit("close");
      };
    });
  }
  call(method, params) {
    params = params || [];
    params.unshift(this._token);
    const id = this._id++;
    const msg = {
      jsonrpc: "2.0",
      method: `aria2.${method}`,
      id, params,
    };
    console.log("MSG->", msg);
    return new Promise((resolve, reject) => {
      this._callbacks[id] = [resolve, reject];
      this._ws.send(JSON.stringify(msg));
    });
  }
  /** Helper aliases. */
  setOption(name, value) {
    let opt = {};
    opt[name] = value;
    return this.call("changeGlobalOption", [opt]);
  }
  add(url) {
    return this.call("addUri", [[url]]);
  }
  forceRemove(gid) {
    return this.call("forceRemove", [gid]);
  }
}
