@echo off
setlocal EnableExtensions
title Installation des pieces de generateur (RPG Maker MV)
echo ============================================================
echo   PIECES DE GENERATEUR  -  yeux, cheveux, marques, tenues
echo   2524 pieces (Whtdragon + hiddenone, ReStaff 2018)
echo ============================================================
echo.
set "SRC=%~dp0Generator_a_installer"
if not exist "%SRC%\Face" (
  echo ERREUR : le dossier Generator_a_installer est introuvable a cote de ce script.
  echo Ce script doit rester a la racine du projet, la ou GitHub Desktop l a mis.
  pause
  exit /b 1
)
set "GEN="
for %%P in (
  "C:\Program Files (x86)\Steam\steamapps\common\RPG Maker MV\Generator"
  "C:\Program Files\Steam\steamapps\common\RPG Maker MV\Generator"
  "D:\Steam\steamapps\common\RPG Maker MV\Generator"
  "D:\SteamLibrary\steamapps\common\RPG Maker MV\Generator"
  "E:\Steam\steamapps\common\RPG Maker MV\Generator"
  "E:\SteamLibrary\steamapps\common\RPG Maker MV\Generator"
  "C:\Program Files (x86)\KADOKAWA\RPG Maker MV\Generator"
  "C:\Program Files\KADOKAWA\RPG Maker MV\Generator"
) do if not defined GEN if exist "%%~P\Face" set "GEN=%%~P"
if defined GEN (
  echo RPG Maker MV trouve ici :
  echo    %GEN%
  echo.
  choice /C ON /M "C est le bon ? [O]ui / [N]on, je donne le chemin"
  if errorlevel 2 set "GEN="
)
if not defined GEN (
  echo.
  echo Ouvre Steam, clic droit sur RPG Maker MV, Gerer, Parcourir les fichiers locaux,
  echo puis copie ici le chemin du dossier Generator ^(tu peux aussi faire glisser
  echo le dossier Generator sur cette fenetre^) :
  set /p GEN=Chemin : 
)
set "GEN=%GEN:"=%"
if not exist "%GEN%\Face" (
  echo ERREUR : "%GEN%" ne ressemble pas au Generator de MV ^(pas de sous-dossier Face^).
  pause
  exit /b 1
)
set "D=%date:/=-%"
set "D=%D: =_%"
set "H=%time::=-%"
set "H=%H:,=-%"
set "H=%H:.=-%"
set "H=%H: =0%"
set "SAUVE=%GEN%_sauvegarde_%D%_%H%"
echo.
echo 1/2  Sauvegarde de ton Generator vers :
echo      %SAUVE%
robocopy "%GEN%" "%SAUVE%" /E /NFL /NDL /NJH /NJS >nul
if errorlevel 8 (
  echo ERREUR pendant la sauvegarde. Rien n a ete copie.
  echo Relance ce script en tant qu administrateur ^(clic droit sur le .bat^).
  pause
  exit /b 1
)
echo 2/2  Copie des 2524 pieces ^(aucun fichier existant n est ecrase^)...
robocopy "%SRC%" "%GEN%" /E /XC /XN /XO /NFL /NDL /NJH /NJS >nul
if errorlevel 8 (
  echo ERREUR pendant la copie. Ton Generator d origine est intact, sa sauvegarde aussi.
  echo Relance ce script en tant qu administrateur ^(clic droit sur le .bat^).
  pause
  exit /b 1
)
echo.
echo ============================================================
echo   TERMINE.
echo   Ouvre RPG Maker MV, menu Outils, Generateur de personnages :
echo   les nouveaux yeux, cheveux, marques et tenues y sont.
echo   Pour revenir en arriere : remplace le dossier Generator
echo   par le dossier _sauvegarde cree a cote.
echo ============================================================
pause
