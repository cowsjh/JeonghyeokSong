@echo off
cd /d "%~dp0"
title Website Editor
echo.
echo   Website Editor  -  http://localhost:4000
echo   The browser will open automatically.
echo   Close this window to stop the editor.
echo.

rem --- 이전 서버 정리: 포트 4000을 점유 중인 프로세스 종료 ---
echo   Resetting server (freeing port 4000)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4000 " ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
echo.

node editor.js
echo.
echo   [Editor stopped]
pause
