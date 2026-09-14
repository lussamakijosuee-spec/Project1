# L'ANCIEN PROJET — tout ce qui était là avant, rangé

> **Rien n'a été supprimé.** Tout ce qui se trouvait à la racine avant la remise à zéro du
> **2026-09-14** a été **déplacé ici**, classé par nature, et **rien d'autre**.
>
> Chaque dossier ci-dessous se réinstalle avec **une seule commande**, donnée en face.
> Les commandes se lancent **depuis la racine du projet**.
>
> L'historique git est intact : git a enregistré des **renommages**, pas des suppressions.
> `git log --follow _ancien_projet/01_base_de_donnees/Skills.json` remonte toute l'histoire du
> fichier.

---

## Le sommaire

| Dossier | Ce qu'il contient | Fichiers |
|---|---|---|
| [`01_base_de_donnees/`](#01_base_de_donnees) | l'ancienne base de données MV **entière** | 82 |
| [`02_plugins/`](#02_plugins) | les 288 plugins, classés par origine, + l'ancien `plugins.js` | 288 |
| [`03_lore_canon/`](#03_lore_canon) | **le lore** — c'est la matière du jeu, pas du déchet | 16 |
| [`04_documentation_technique/`](#04_documentation_technique) | guide développeur, fiches de plugins, recettes, ordre de chargement | 14 |
| [`05_rapports_et_audits/`](#05_rapports_et_audits) | rapports d'équilibrage, audits, inventaire de tri | 8 |
| [`06_bancs_dessai/`](#06_bancs_dessai) | les bancs d'essai Node | 11 |
| [`07_images_de_menu/`](#07_images_de_menu) | les images de menu personnalisées | 76 |
| [`08_outils/`](#08_outils) | les outils MV et le vérificateur | 3 |
| [`09_databackup/`](#09_databackup) | une sauvegarde complète de l'ancienne base | 648 |
| [`10_sauvegardes/`](#10_sauvegardes) | les sauvegardes de playtest | 9 |
| [`11_divers/`](#11_divers) | le reste | 3 |

---

## 01_base_de_donnees

L'ancienne base MV complète : `Actors` · `Classes` · `Skills` (826) · `States` (1000) ·
`Enemies` (426) · `Troops` (516) · `Items` · `Weapons` · `Armors` · `Animations` (460) ·
`CommonEvents` · `Tilesets` · `System` · `MapInfos` · **70 cartes** + `BASE MAP` et `FULL MAP`.

> ⚠️ **C'est ce dossier qui rend le projet ouvrable dans l'éditeur.** `data/` est actuellement
> **vide** : RPG Maker MV refusera d'ouvrir le projet tant qu'il n'y aura pas de `.json` dedans.
> Deux options : remettre celle-ci, ou copier les `.json` vierges d'un projet MV neuf.

```bash
# Tout remettre
mv _ancien_projet/01_base_de_donnees/*.json data/

# Ou une seule pièce (exemple : les états)
mv _ancien_projet/01_base_de_donnees/States.json data/
```

---

## 02_plugins

288 plugins, **classés par origine** pour qu'on puisse réinstaller par lot.

| Sous-dossier | Ce que c'est | Fichiers |
|---|---|---|
| `systemes_du_jeu/` | **les plugins du projet** (auteurs : JOKO, JOKO/Claude, Claude) — Dons, Avatar, Corruption, Errance, Paroles, Voies, Chasse aux primes, Chutes, LivingNPC… | 110 |
| `systemes_lore/` | les `Lore_*.js` — 29 micro-systèmes de lore (affinités, signatures, santé mentale, factions, méta-horreur Jada…) | 29 |
| `tiers_yanfly/` | les `YEP_*` — moteur de combat, CoreEngine, BuffsStatesCore, ActSeqPack… | 38 |
| `tiers_moghunter/` | les `MOG_*` — HUD, écran-titre, effets de personnage, scrollbar… | 28 |
| `tiers_divers/` | Aries · CT_Bolt · Olivia · Irina · GALV · TSR · triacontane · Community_Basic · MadeWithMv · les plugins d'exemple de MV (AltMenuScreen, ItemBook, EnemyBook, WeaponSkill…) | 23 |
| `abandonnes/` | l'ancien `js/plugins/_abandonnes/` — plugins retirés au fil des sessions (fusionnés ailleurs, ou morts). **Gardés exprès.** | 58 |
| `boite_a_outils/` | l'ancien `js/plugins/_boite_a_outils/` | 1 |
| `plugins.js.ancien` | **l'ancien `js/plugins.js`** : l'ordre de chargement des 194 entrées **et tous leurs réglages**. C'est le fichier le plus précieux du lot — les paramètres de chaque plugin y sont, pas dans le `.js`. | 1 |

```bash
# Réinstaller un plugin
mv _ancien_projet/02_plugins/systemes_du_jeu/DonsSpirituels.js js/plugins/

# Réinstaller tout Yanfly
mv _ancien_projet/02_plugins/tiers_yanfly/*.js js/plugins/

# Tout remettre d'un coup, ordre de chargement et réglages compris
mv _ancien_projet/02_plugins/*/*.js js/plugins/
cp _ancien_projet/02_plugins/plugins.js.ancien js/plugins.js
```

> ⚠️ Un plugin remis dans `js/plugins/` **ne se charge pas tout seul** : il doit être inscrit
> dans `js/plugins.js` (via l'éditeur MV, ou en reprenant son entrée dans `plugins.js.ancien`).
> L'ordre de chargement est documenté dans
> `04_documentation_technique/ORDRE_PLUGINS.md` — **producteurs de jauges d'abord**.

---

## 03_lore_canon

**Le lore.** C'est la source, pas de l'archive morte : `docs/GAME_DESIGN.md` en est l'extrait
implémentable, et il cite ces fichiers à chaque ligne.

| Fichier | Ce qu'il fait |
|---|---|
| `lore.md` | la bible du monde (canon v5) |
| `EMPIRE_DU_CORPS.md` | **canon dicté par JOKO** sur l'Empire aux trois têtes : l'Arbre de sang, la faim, les quatre stades, l'Ancre, les chasseurs, Éthon, Kevératus. **Fait foi** sur `lore.md` et le codex |
| `SYSTEME_DE_MANA.md` | le canon du mana : sources, branches, éléments, affinités |
| `SYSTEME_DE_MANA_racine.md` | l'exemplaire qui traînait à la racine — c'est une **version plus ancienne** : elle dit encore « **le FAMILIER** » là où celle de `docs/` dit « l'**Avatar Spirituel** », et il lui manque le paragraphe « **on n'en a qu'un** ». Gardée telle quelle. |
| `DONS_SPIRITUELS.md` | le dossier complet du Don Spirituel et des Traits (v3.0) |
| `codex-trois-sources.html` | le codex **v5** — celui que `lore.md` déclare « canon unique » |
| `codex-trois-sources-v10.html` | le codex **v10**, nettement plus complet |
| `breviaire-cendres.html` | le Bréviaire des Cendres — prières et chants |
| `personnages.md` | le casting *(porte lui-même un avertissement : en retard sur le canon)* |
| `scenario.md` · `bestiaire.md` | le fil rouge, les familles d'ennemis |
| `perso-iris-et-joah.md` | Iris & Joah + la quête « Un rendez-vous pour Iris » |
| `notes/` | notes brutes |
| `_archive/` | Battle World — **marqué obsolète de longue date** |

```bash
# Remettre tout le lore sous la main
mv _ancien_projet/03_lore_canon/*.md _ancien_projet/03_lore_canon/*.html docs/
```

---

## 04_documentation_technique

`INDEX.md` · `GUIDE_DEVELOPPEUR.md` *(tous les IDs et tous les chiffres de l'ancienne
implémentation)* · `FICHES_PLUGINS.md` · `FICHE_COMMANDES_COMPLETE.md` · `ORDRE_PLUGINS.md` ·
`RECETTES.md` · `RECETTES_LivingNPC.md` · `PLUGINS_LORE.md` · `TUTO_DOCTEUR.md` · les cinq
`PLUGIN_*.md`.

> C'est d'ici que viennent tous les chiffres marqués 🟨 dans `docs/GAME_DESIGN.md` — ceux qui
> viennent de l'ancienne implémentation et non du lore.

```bash
mv _ancien_projet/04_documentation_technique/*.md docs/
```

---

## 05_rapports_et_audits

`RAPPORT_COMBAT.md` · `RAPPORT_EQUILIBRAGE.md` · `RAPPORT_PARTIE_REELLE.md` · `AUDIT_LORE.md` ·
`AUDIT_PLUGINS.md` · `A_TRIER.md` *(les 527 éléments dormants, 33 décisions — **3 réglées**)* ·
`NOUVEAU_CONTENU.md` · `PROPOSITION_REPARTITION.md`.

```bash
mv _ancien_projet/05_rapports_et_audits/*.md docs/
```

---

## 06_bancs_dessai

Les bancs Node : Dons Spirituels · évolution des paliers · Avatar Spirituel · **la règle d'un
seul Don** (76 contrôles) · verrou et ordres · niveaux d'Avatar, + le dossier `audit/`
(bestiaire, nouveau lot, tableau de chasse, équilibre).

> Ils testent **l'ancienne base**. Remis tels quels sur une base vide, ils échoueront — c'est
> normal, ils n'ont plus rien à mesurer.

```bash
mv _ancien_projet/06_bancs_dessai bancs
```

---

## 07_images_de_menu

L'ancien `menus/` : les images d'interface personnalisées (acteur, équipement, visages,
fichiers, objets, principal, compétences, statut) + `Particles.png`.

```bash
mv _ancien_projet/07_images_de_menu menus
```

---

## 08_outils

L'ancien `tools/` : `verifier.js` et l'outil MV `VerificateurCodex`.

```bash
mv _ancien_projet/08_outils tools
```

---

## 09_databackup

Une sauvegarde complète de l'ancienne base, faite avant la remise à zéro d'une session
précédente. **648 fichiers** — c'est le plus gros dossier de l'archive.

> ⚠️ Le nouveau `.gitignore` ignore `/databackup/` **à la racine**. Ici, dans `_ancien_projet/`,
> le dossier reste versionné.

```bash
mv _ancien_projet/09_databackup databackup
```

---

## 10_sauvegardes

L'ancien contenu de `save/` : les sauvegardes de playtest. Elles ne décrivent pas le jeu, elles
décrivent une partie — et elles réfèrent à une base qui n'est plus en place.

```bash
mv _ancien_projet/10_sauvegardes/* save/
```

---

## 11_divers

`JADE_TE_REGARDE.txt` · `quete_iris_events.json` · `scene_donovano_events.json`.

---

## Ce qui n'est PAS ici — et qui est resté à la racine

| Resté en place | Pourquoi |
|---|---|
| `js/rpg_*.js` · `js/libs/` · `js/main.js` | le **moteur MV 1.6.1** lui-même. Ce n'est pas du contenu de projet. |
| `index.html` · `package.json` · `Game.rpgproject` | le squelette du projet MV. *(Les deux premiers portent encore le titre « Le Codex des Trois Sources » : à renommer, c'est du texte à l'écran, donc une décision de JOKO.)* |
| `img/` · `audio/` · `fonts/` · `icon/` | les **assets**. Ce sont des matériaux réutilisables, et `CLAUDE.md` §4 interdit d'y toucher. Si tu veux qu'ils rejoignent l'archive, c'est un `mv`. |
| `CLAUDE.md` | le contrat de travail du projet, pas du contenu de jeu. |

---

*Archive constituée le 2026-09-14. 1 158 fichiers rangés, 0 supprimé.*
