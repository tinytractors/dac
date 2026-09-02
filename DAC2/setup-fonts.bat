# setup-fonts.bat - Download and setup required fonts for Detailed Auto Care website
# This batch script downloads Montserrat and Orbitron fonts from Google Fonts
# Requires PowerShell or wget/curl to be available

@echo off
setlocal enabledelayedexpansion

set FONTS_DIR=assets\fonts

if not exist "%FONTS_DIR%" mkdir "%FONTS_DIR%"

echo.
echo Downloading fonts...
echo.

REM Orbitron 700
echo Downloading Orbitron 700...
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('https://fonts.gstatic.com/s/orbitron/v14/yMJ9Y3Z_-0WjfZrRaxw6wUdzNhfC6I9u.woff2', '%FONTS_DIR%\orbitron-700.woff2')"

REM Montserrat 400
echo Downloading Montserrat 400...
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg69CK48gIUAEKwdytS1xg.woff2', '%FONTS_DIR%\montserrat-400.woff2')"

REM Montserrat 600
echo Downloading Montserrat 600...
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg69CK48gIUHheuylZ-OvlZQIg.woff2', '%FONTS_DIR%\montserrat-600.woff2')"

echo.
echo Fonts downloaded successfully!
echo Location: %FONTS_DIR%\
dir /b "%FONTS_DIR%"
echo.
echo Fonts are ready. The HTML will load them from /assets/fonts/
