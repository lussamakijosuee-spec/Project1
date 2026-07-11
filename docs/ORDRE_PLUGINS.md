# ORDRE DES PLUGINS — la référence À JOUR (js/plugins.js n'est pas dans git !)
> Coche dans CET ordre. ⚠️ = réglage à vérifier. Les 3 anciens plugins de
> chutes (ChuteDement, ChutesBeteErrant, ChutesProfondeur) N'EXISTENT PLUS :
> les décocher/supprimer, Codex_Chutes les remplace.

## 1. Moteur (en premier)
Community_Basic · YEP_CoreEngine → tous les YEP_* (BattleEngineCore avant les
YEP_X_*) · TSR_* · Galv/Irina/Aries/MOG · KELYEP_DragonBones

## 2. Producteurs de jauges (ORDRE OBLIGATOIRE)
JadeEntitePlunging → CorruptionAme → Errance

## 3. Systèmes canon
ManaAffinity · MaitriseVoies · ParolesSysteme · FrappeAme · Surpassement ·
RangsPuissance · TriangleAffinites · MarqueVivante · FusionElements ·
PortesProgression · DestinsParalleles · InvocationAmes · AmeSouls · ForgeAmes ·
SanctuaireAmes · LiensSocial

## 4. Lore & boss
Lore_* (tous) · DonoBoss → DonoKamui · Jade* · JosuMirror · MirrorTaunts ·
KevSignature · Neyssa_Concentration · ThylaneFormes ⚠️ **états 205 et 206** ·
LOU_HakariJackpot · ComboLiens · UltiCinematics

## 5. Chutes & horreur (cet ordre)
ChutesCinematiques → ChutesDefinitives → autres Chutes* existants ·
**Codex_Chutes** (⚠️ remplace les 3 anciens · interrupteurs 95-98 nommés) ·
Cinematiques · ElementsVivants

## 6. Grands systèmes récents (cet ordre)
FusionMana → FusionsEtendues · RoyaumeImperial · UltimesSources · TraitsAme ·
CanonPlus (⚠️ interrupteur Reprises = 99) · **PorteurDAmes** (après
InvocationAmes) · ViesParalleles (après DestinsParalleles) →
**PNJVivantsPlus** · AmbianceCanon · DebutMarques · CodexSources

## 7. Interface (en dernier)
PremiersPas · AtelierTest · ClarteUI · GrimoireHub (tout dernier)

## Interrupteurs réservés (nommés dans l'éditeur)
41 Porte de Fusion · 42 HUD Triangle · 95 Déchiré · 96 Errant · 97 Bête ·
98 Dément · 99 porte des 20 Reprises (événements communs 205-209 branchés)

## Rappel rangement
.json → data/ (rien à cocher) · plugin .js → js/plugins/ + cocher ·
tools/verifier.js → terminal (node tools/verifier.js) · docs/ → à lire
