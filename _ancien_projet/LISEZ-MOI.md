# _ancien_projet — ce qui reste à l'écart : **les plugins écrits par JOKO ou par Claude**

> **Le 2026-09-15, tout le reste est reparti à sa place.** La base, les 65 cartes, les
> événements, le lore, la documentation, les bancs, les menus, les outils, les sauvegardes et
> la sauvegarde de base : plus rien de tout ça n'est ici, tout est revenu à la racine.
>
> Ne reste dans cette archive qu'**une seule chose**, et c'est la seule que JOKO ait demandé de
> laisser dehors :
>
> > *« remets le jeu comme il était… **sauf les plugins que j'ai ou que tu as faits**. Juste les
> > MOG et les YEP fonctionnent. »*
>
> **Rien n'a été supprimé.** L'historique git est intact : git a enregistré des **renommages**.
> `git log --follow js/plugins/YEP_CoreEngine.js` remonte toute l'histoire du fichier.

---

## Ce qui reste ici — 199 fichiers

| Sous-dossier | Ce que c'est | Fichiers |
|---|---|---|
| `02_plugins/systemes_du_jeu/` | **les plugins du projet** (auteurs : JOKO, JOKO/Claude, Claude) — Dons, Avatar, Corruption, Errance, Paroles, Voies, Chasse aux primes, Chutes, LivingNPC… | 110 |
| `02_plugins/systemes_lore/` | les `Lore_*.js` — 29 micro-systèmes de lore (affinités, signatures, santé mentale, factions, méta-horreur Jada…) | 29 |
| `02_plugins/abandonnes/` | l'ancien `js/plugins/_abandonnes/` — **désactivés par JOKO lui-même** le 2026-07-17, puis retirés du gestionnaire. Gardés exprès. *(Y compris 11 `MOG_*` cosmétiques : c'est une décision de JOKO, pas la règle des plugins du projet.)* | 58 |
| `02_plugins/boite_a_outils/` | le `LISEZ-MOI.md` de l'ancienne réserve. Les plugins qu'il décrit sont **remontés** dans `js/plugins/` : ce sont des bibliothèques tierces. | 1 |
| `02_plugins/plugins.js.ancien` | **l'ancien `js/plugins.js`** : l'ordre de chargement des 194 entrées **et tous leurs réglages**. Le fichier le plus précieux du lot — les paramètres de chaque plugin y sont, pas dans le `.js`. | 1 |

> ℹ️ **Quatre intrus dans `systemes_du_jeu/`**, qui traînaient dans l'ancien `js/plugins/` sans
> être des plugins : `plugins.js` *(un doublon égaré — le vrai est `plugins.js.ancien`)* ·
> `rpg_sprites.js` *(une copie d'un fichier du moteur)* · `quete_iris_events.json` et
> `scene_donovano_events.json` *(des événements exportés, dont les jumeaux sont dans `docs/`)*.

---

## Remettre un plugin en service

Deux gestes, **et le second est celui qu'on oublie** :

```bash
# 1 · le fichier
mv _ancien_projet/02_plugins/systemes_du_jeu/DonsSpirituels.js js/plugins/

# 2 · l'inscrire dans le gestionnaire — sinon MV ne le charge JAMAIS
#     Reprends son entrée telle quelle dans plugins.js.ancien (réglages compris),
#     et colle-la dans js/plugins.js à la bonne place.
grep -n '"name":"DonsSpirituels"' _ancien_projet/02_plugins/plugins.js.ancien
```

> ⚠️ **L'ordre de chargement compte.** Il est documenté dans `docs/ORDRE_PLUGINS.md` —
> **producteurs de jauges d'abord**. `plugins.js.ancien` donne l'ordre exact d'origine, section
> par section.

## Tout remettre d'un coup

```bash
mv _ancien_projet/02_plugins/systemes_du_jeu/*.js js/plugins/
mv _ancien_projet/02_plugins/systemes_lore/*.js js/plugins/
cp _ancien_projet/02_plugins/plugins.js.ancien js/plugins.js
```

> Après ça, **relance le banc navigateur** : `node bancs/navigateur/jouer.js`. C'est le seul qui
> voie une entrée pointant vers un fichier absent — MV, lui, se tait.

---

## Où sont reparties les autres pièces

| Anciennement | Aujourd'hui | Fichiers |
|---|---|---|
| `01_base_de_donnees/` | **`data/`** — base, 65 cartes, `CommonEvents`, `Animations`, `BASE MAP`, `FULL MAP` | 82 |
| `02_plugins/tiers_yanfly/` · `tiers_moghunter/` · `tiers_divers/` | **`js/plugins/`** — les 89 plugins tiers *(dont 42 chargés par `js/plugins.js`)* | 89 |
| `03_lore_canon/` | **`docs/`** — `lore.md`, `EMPIRE_DU_CORPS.md`, les codex, `notes/`, `_archive/` | 16 |
| `04_documentation_technique/` | **`docs/`** — `GUIDE_DEVELOPPEUR.md`, `ORDRE_PLUGINS.md`, `FICHES_PLUGINS.md`… | 14 |
| `05_rapports_et_audits/` | **`docs/rapports/`** | 8 |
| `06_bancs_dessai/` | **`bancs/`** *(six d'entre eux ne peuvent plus tourner — voir `bancs/LISEZ-MOI.md`)* | 11 |
| `07_images_de_menu/` | **`menus/`** | 76 |
| `08_outils/` | **`tools/`** | 3 |
| `09_databackup/` | **`databackup/`** *(le `.gitignore` a été corrigé pour ne plus l'ignorer)* | 648 |
| `10_sauvegardes/` | **`save/`** — les sauvegardes de playtest, reprenables | 9 |
| `11_divers/` | **racine** *(`JADE_TE_REGARDE.txt`)* et **`docs/`** *(les deux `*_events.json`)* | 3 |

## Et le socle neuf ?

La base de 17 fichiers écrite les 14 et 15 septembre, le plugin de la faim `ETT_Faim.js` et ses
quatre bancs sont dans **`_socle_neuf/`**, avec leur propre mode d'emploi. Rien n'a été jeté non
plus de ce côté-là.

---

*Archive constituée le 2026-09-14 (1 158 fichiers), vidée à 199 le 2026-09-15. 0 supprimé.*
