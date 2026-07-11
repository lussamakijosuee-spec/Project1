# ORDRE DES PLUGINS — la référence (js/plugins.js n'est pas dans git !)
> Sur chaque machine, le gestionnaire de plugins doit suivre CET ordre. Réglages non-défaut indiqués.

## 1. Moteur (en premier, ordre libre entre eux)
Community_Basic · YEP_CoreEngine → tous les YEP_* (BattleEngineCore avant les YEP_X_*) · TSR_* · Galv/Irina/Aries/MOG · KELYEP_DragonBones

## 2. Producteurs de jauges (OBLIGATOIREMENT dans cet ordre)
JadeEntitePlunging → CorruptionAme → Errance

## 3. Systèmes canon
ManaAffinity · MaitriseVoies · ParolesSysteme · FrappeAme · Surpassement · RangsPuissance · TriangleAffinites · MarqueVivante · FusionElements · PortesProgression · DestinsParalleles · InvocationAmes · AmeSouls · ForgeAmes · SanctuaireAmes · LiensSocial

## 4. Lore & boss
Lore_* (tous) · DonoBoss → DonoKamui · Jade* · JosuMirror · MirrorTaunts · KevSignature · Neyssa_Concentration · ThylaneFormes ⚠️ **paramètres États = 205 et 206** (plus 196/197 !) · LOU_HakariJackpot · ComboLiens · UltiCinematics

## 5. Chutes & horreur
ChutesCinematiques → ChutesDefinitives → autres Chutes* · Cinematiques · ElementsVivants

## 6. Les grands systèmes récents (cet ordre)
FusionMana → FusionsEtendues · RoyaumeImperial · UltimesSources · TraitsAme · CanonPlus · CodexSources

## 7. Interface (en dernier)
PremiersPas · AtelierTest · ClarteUI · GrimoireHub (tout dernier)

## Réglages à vérifier
- ThylaneFormes : SereinState **205**, SemiState **206**
- TriangleAffinites : hudSwitch si tu veux le HUD carte
- Tout le reste : défauts corrects.
