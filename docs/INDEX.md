# 📚 INDEX DE LA DOCUMENTATION — par où commencer

> Toute la doc du projet, reliée. Trois questions, trois portes d'entrée.

## Tu veux…

| …faire quoi ? | Va lire | En un mot |
|---|---|---|
| **Poser vite** n'importe quel plugin (commande / notetag / pose-éclair) | **[`FICHES_PLUGINS.md`](FICHES_PLUGINS.md)** | une mini-fiche par plugin (167 plugins) |
| **Fabriquer** un PNJ, un ennemi, un skill, une quête, un donjon… | **[`RECETTES.md`](RECETTES.md)** | le livre de recettes copier-coller (tous les types + recettes avancées) |
| **Retrouver** une commande, un notetag, une formule exacte | **[`FICHE_COMMANDES_COMPLETE.md`](FICHE_COMMANDES_COMPLETE.md)** | le catalogue exhaustif (279 plugins balayés) |
| **Comprendre** un système en profondeur (chiffres, prix, paliers) | **[`GUIDE_DEVELOPPEUR.md`](GUIDE_DEVELOPPEUR.md)** | le manuel des Trois Sources (tous les bonus/malus) |
| **Ranger / activer** les plugins dans le bon ordre | **[`ORDRE_PLUGINS.md`](ORDRE_PLUGINS.md)** | ⚠️ l'ordre de chargement (à respecter) |
| **Saisir le canon du mana** (le fond du jeu) | **[`../SYSTEME_DE_MANA.md`](../SYSTEME_DE_MANA.md)** | les règles du mana, à la source |

## Les trois docs « techniques » et comment elles s'emboîtent

```
        COMPRENDRE                CATALOGUER               FABRIQUER
   GUIDE_DEVELOPPEUR.md  →  FICHE_COMMANDES_COMPLETE.md  →  RECETTES.md
   (pourquoi & combien)     (quoi taper, où)                (assemblages prêts)
```
- Le **GUIDE** explique *ce que fait* chaque système et *ce qu'il coûte* (la Loi du Prix, les paliers, les formules).
- La **FICHE** liste *tout ce que tu peux taper* : les commandes de **tous** les plugins, tous les notetags par cible, les formules de dégâts.
- Les **RECETTES** montrent *comment assembler* : chaque type de contenu en bloc copier-coller, du PNJ simple au donjon multi-phases.

## Fiches par plugin (un plugin, à fond)
| Fichier | Plugin |
|---|---|
| [`PLUGIN_LivingNPC.md`](PLUGIN_LivingNPC.md) | `LivingNPC` — PNJ vivants : dialogues, barks, rumeurs, casting de 52 PNJ |
| [`RECETTES_LivingNPC.md`](RECETTES_LivingNPC.md) | `LivingNPC` — les 52 PNJ en blocs prêts à copier-coller |

## Le reste du dossier `docs/`
| Fichier | Contenu |
|---|---|
| [`lore.md`](lore.md) | le lore du monde |
| [`personnages.md`](personnages.md) | les personnages |
| [`scenario.md`](scenario.md) | le scénario |
| [`bestiaire.md`](bestiaire.md) | le bestiaire |
| [`PLUGINS_LORE.md`](PLUGINS_LORE.md) | le rôle « lore » de chaque plugin |
| [`TUTO_DOCTEUR.md`](TUTO_DOCTEUR.md) | tuto ciblé |
| [`codex-trois-sources.html`](codex-trois-sources.html) | le codex en page web |
| `_archive/` | anciennes versions (Battle World) — obsolète |

## En jeu (pas dans les fichiers)
- **`CODEX`** → le livre du lore & des règles, lisible en combat (7 pages).
- **`GRIMOIRE`** → le hub qui regroupe tous les écrans (Triangle, Rangs, Marque, Destins…).
- **`GUIDEVP`** → le guide clair des Voies & Paroles.
- **`ATELIER`** → le menu de test (playtest uniquement) pour tout régler en deux clics.

## Rappels ultra-rapides
- Héros : **1** Aël · **2** Korrah · **3** ludwing · **4** Vesper. Var mentale = 10 + ID (11-14). Stock d'âmes = **var 15**.
- 3 jauges : 🟣 Corruption (la Bête) · 🔴 Errance (l'Errant) · 🔵 Santé mentale (le Dément).
- Interrupteurs réservés : 41 Fusion · 42 HUD · 95-98 chutes · 99 le Fond.
- Compteurs : 826 skills · 426 ennemis · 516 troupes · 1000 états · 460 animations.
