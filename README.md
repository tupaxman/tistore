# tistore

tistore is a simple GUI application for grabbing photos from Tistory blogs. It can grab entire blog, separate post or use a list of URLs and download them in parallel using blazingly fast [aria2](https://github.com/tatsuhiro-t/aria2) backend. Original filenames (including Hangul) are preserved.

![](https://raw.githubusercontent.com/Kagami/tistore/assets/tistore.png)

## Install

For the first time you will need to download `.7z` archive corresponding to your platform. If you want to update to newer version of tistore, you may however get only appropriate `.nw` file and replace `app.nw` in unpacked directory of full build. (`.nw` files contain the actual application, but you need NW.js environment in order to run them.)

### Linux

You will need aria2 and common desktop deps such as X11, gtk, gconf installed. Download [latest release](https://github.com/Kagami/tistore/releases), unpack it and run `./tistore`.

### Windows

Everything is included to the build, just download [latest release](https://github.com/Kagami/tistore/releases), unpack and run `tistore.bat`.

### Mac

*TODO*

## Manual build

*TODO*

## License

tistore own code, documentation and icon are licensed under CC0, but the resulting build also includes the following libraries and assets:

* Libraries in `dependencies` section of [package.json](package.json) (BSD-like)
* [NW.js binaries](https://github.com/nwjs/nw.js), see also `credits.html` in release archives
* [OpenSans font](https://www.google.com/fonts/specimen/Open+Sans), see `LICENSE.OPENSANS`
* [Font Awesome icons](https://github.com/FortAwesome/Font-Awesome), see `LICENSE.FONTAWESOME`
* [aria2 binaries](https://github.com/tatsuhiro-t/aria2) (only in Windows build, see `LICENSE.ARIA2`)

---

tistore - Tistory photo grabber

Written in 2016 by Kagami Hiiragi <kagami@genshiken.org>

To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.

You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
