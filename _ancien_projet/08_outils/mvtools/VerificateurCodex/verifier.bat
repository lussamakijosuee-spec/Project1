@echo off
chcp 65001 >nul
cd /d "%~dp0..\..\.."
echo ══════ LE DOCTEUR DU CODEX ══════
node tools\verifier.js
echo.
pause
