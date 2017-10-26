# tistore

tistore is a simple GUI application for grabbing photos from Tistory blogs. It can grab entire blog, separate post or use a list of URLs and download them in parallel using blazingly fast [aria2](https://github.com/tatsuhiro-t/aria2) backend. Original filenames (including Hangul) are preserved.

<p align="center">
  <a href="https://raw.githubusercontent.com/Kagami/tistore/assets/tistore.png"><img src="https://raw.githubusercontent.com/Kagami/tistore/assets/tistore.png"></a>
</p>

## Install

For the first time you will need to download `.7z` archive corresponding to your platform. If you want to update to newer version of tistore, you may however get only appropriate `.nw` file and replace `app.nw` in unpacked directory of full build. (`.nw` files contain the actual application, but you need NW.js environment in order to run them.)

### Linux

You will need aria2 and common desktop deps such as X11, gtk, gconf installed. Download [latest release](https://github.com/Kagami/tistore/releases), unpack it and run `./tistore`.

### Windows

Everything is included to the build, just download [latest release](https://github.com/Kagami/tistore/releases), unpack and run `tistore.bat`.

## License

tistore's own code is licensed under [CC0](licenses/LICENSE.TISTORE) but releases also include:

* Libraries from dependencies section of [package.json](package.json)
* [NW.js binaries](https://github.com/nwjs/nw.js)
* [OpenSans font](licenses/LICENSE.OPENSANS)
* [Font Awesome icons](licenses/LICENSE.FONTAWESOME)
* [aria2 binaries](licenses/LICENSE.ARIA2) (only in Windows build)
