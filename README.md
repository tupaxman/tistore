# tistore

tistore is a simple GUI application for grabbing photos from Tistory blogs. It can grab entire blog, separate post or use a list of URLs and download them in parallel using blazingly fast [aria2](https://github.com/tatsuhiro-t/aria2) backend. Original filenames (including Hangul) are preserved.

<p align="center">
  <a href="https://raw.githubusercontent.com/Kagami/tistore/assets/tistore.png"><img src="https://raw.githubusercontent.com/Kagami/tistore/assets/tistore.png"></a>
</p>

## Install

### Windows

Download [latest release](https://github.com/Kagami/tistore/releases), unpack and run `tistore.exe`.

### Linux

You will need aria2 installed. Download [latest release](https://github.com/Kagami/tistore/releases), unpack and run `./tistore`.

## License

tistore's own code is licensed under [CC0](licenses/LICENSE.TISTORE) but releases also include:

* Libraries from dependencies section of [package.json](package.json)
* [NW.js binaries](https://github.com/nwjs/nw.js)
* [OpenSans font](licenses/LICENSE.OPENSANS)
* [Font Awesome icons](licenses/LICENSE.FONTAWESOME)
* [aria2 binaries](licenses/LICENSE.ARIA2) (only in Windows build)
