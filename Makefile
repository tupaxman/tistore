NAME = tistore
VERSION = $$npm_package_version
DIST_DIR = dist
APP = package.nw
7Z_OPTS = -t7z -m0=lzma2 -mx=9
LIN64_RELEASE = $(NAME)-v$(VERSION)-linux-x64
LIN64_NW_DIR = ../bin/nwjs-v0.38.1-linux-x64
LIN64_7Z = $(LIN64_RELEASE).7z
WIN32_RELEASE = $(NAME)-v$(VERSION)-win-x86
WIN32_NW_DIR = ../bin/nwjs-v0.38.1-win-ia32
WIN32_7Z = $(WIN32_RELEASE).7z

all:

lin64:
	cd "$(DIST_DIR)" \
		&& rm -rf "$(LIN64_RELEASE)" "$(LIN64_7Z)" \
		&& mkdir -p "$(LIN64_RELEASE)" \
		&& cp -a app "$(LIN64_RELEASE)/$(APP)" \
		&& cp -a "$(LIN64_NW_DIR)"/* "$(LIN64_RELEASE)" \
		&& mv "$(LIN64_RELEASE)/nw" "$(LIN64_RELEASE)/$(NAME)" \
		&& 7z a $(7Z_OPTS) "$(LIN64_7Z)" "$(LIN64_RELEASE)"

win32:
	cd "$(DIST_DIR)" \
		&& rm -rf "$(WIN32_RELEASE)" "$(WIN32_7Z)" \
		&& mkdir -p "$(WIN32_RELEASE)" \
		&& cp -a app "$(WIN32_RELEASE)/$(APP)" \
		&& cp -a "$(WIN32_NW_DIR)"/* "$(WIN32_RELEASE)" \
		&& mv "$(WIN32_RELEASE)/nw.exe" "$(WIN32_RELEASE)/$(NAME).exe" \
		&& 7z a $(7Z_OPTS) "$(WIN32_7Z)" "$(WIN32_RELEASE)"
