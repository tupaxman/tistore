## Required binaries

You need several binaries in order to build tistore. Run:

```bash
wget https://dl.nwjs.io/v0.26.0/nwjs-v0.26.0-linux-x64.tar.gz
tar xvf nwjs-v0.26.0-linux-x64.tar.gz
wget https://dl.nwjs.io/v0.26.0/nwjs-v0.26.0-win-ia32.zip
unzip nwjs-v0.26.0-win-ia32.zip
wget https://github.com/aria2/aria2/releases/download/release-1.33.0/aria2-1.33.0-win-32bit-build1.zip
unzip aria2-1.33.0-win-32bit-build1.zip && cp aria2-1.33.0-win-32bit-build1/aria2c.exe . && chmod -x aria2c.exe
```
