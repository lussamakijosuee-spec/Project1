@echo off
setlocal
title Publier le jeu en ligne
chcp 65001 >nul
cd /d "%~dp0"
rem Met le jeu en ligne (https://lussamakijosuee-spec.github.io/Project1-jeu/) avec les fichiers de ce PC.
rem Si RPG Maker est ouvert, enregistre d'abord. Le detail : tools\publier_en_ligne.js
set "NODE=node"
where node >nul 2>nul || set "NODE=C:\Program Files\nodejs\node.exe"
if not exist "%NODE%" where node >nul 2>nul || (
  echo Node.js est introuvable. Installe-le depuis https://nodejs.org puis relance PUBLIER_EN_LIGNE.bat.
  pause
  exit /b 1
)
where git >nul 2>nul || (
  echo git est introuvable. Installe Git for Windows depuis https://git-scm.com puis relance PUBLIER_EN_LIGNE.bat.
  pause
  exit /b 1
)
"%NODE%" "tools\publier_en_ligne.js"
pause
