@echo off
cd /d "%~dp0"
title Website Editor
echo.
echo   Website Editor  -  http://localhost:4000
echo   The browser will open automatically.
echo   Close this window to stop the editor.
echo.
node editor.js
echo.
echo   [Editor stopped]
pause
