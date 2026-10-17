@echo off
setlocal
title Studio
cd /d "%~dp0"
set "NODE=node"
where node >nul 2>nul || set "NODE=C:\Program Files\nodejs\node.exe"
if not exist "%NODE%" where node >nul 2>nul || (
  echo Node.js est introuvable. Installe-le depuis https://nodejs.org puis relance STUDIO.bat.
  pause
  exit /b 1
)
start "" "http://localhost:8765/"
"%NODE%" "studio\serveur.js"
pause
