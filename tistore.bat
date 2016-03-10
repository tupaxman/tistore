@echo off
if not exist TistoreData\NUL (
	mkdir TistoreData
	echo {"plugins":{"resource_cache_update":"2000000000.0"}}> "TistoreData\Local State"
)
start nw.exe app.nw
