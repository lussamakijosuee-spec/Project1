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
| **Saisir le canon du mana** (le fond du jeu) | **[`SYSTEME_DE_MANA.md`](SYSTEME_DE_MANA.md)** · **[`CANON_LA_GENESE.md`](CANON_LA_GENESE.md)** | les règles du mana, et d'où il vient (les trois sources, le Premier) |

## Le statut du lore (2026-10-14)

JOKO : *« non plus de lore complètement en gros mon jeu sera plus un jeu pour pote entre potes si
possible mais pas un truc compliqué ou sombre complètement juste une explication du mana comme le
premier on garde mais les don et couverture on enlève »*.

| | Documents |
|---|---|
| **Gardé — l'explication du mana** | [`CANON_LA_GENESE.md`](CANON_LA_GENESE.md) (les trois sources, le Premier, les trois **Codex** et leurs **chapitres** — réponse « oui » de JOKO le 2026-10-14) · [`SYSTEME_DE_MANA.md`](SYSTEME_DE_MANA.md) (sources, éléments, affinités) |
| **Retiré** | les **Dons Spirituels** ([`DONS_SPIRITUELS.md`](DONS_SPIRITUELS.md), chapitres 6 et 17 du système de mana) · la **couverture** (le donjon de couverture) — barrés, pas effacés |
| **Archive, plus une contrainte** | [`lore.md`](lore.md) · [`EMPIRE_DU_CORPS.md`](EMPIRE_DU_CORPS.md) · [`CANON_LE_CORPS_ARTIFICIEL.md`](CANON_LE_CORPS_ARTIFICIEL.md) · [`personnages.md`](personnages.md) · [`scenario.md`](scenario.md) · [`perso-iris-et-joah.md`](perso-iris-et-joah.md) · le reste du [`GAME_DESIGN.md`](GAME_DESIGN.md) · les codex HTML |
| **Pas encore tranché** | [`CANON_LA_PAROLE.md`](CANON_LA_PAROLE.md) (la magie, mais aussi les cristaux et les hôtels) |

Le ton : **un jeu entre potes, ni compliqué, ni sombre.** Gardé hors lore, comme mécanique de
combat : **seiryu**, l'Avatar de Korrah — son Hiver passe par lui (`SeiryuLeFamilier.js`).

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
| [`PLUGIN_CorruptionAme.md`](PLUGIN_CorruptionAme.md) | `CorruptionAme` — la jauge de Corruption (la Bête), gains/paliers/états |
| [`PLUGIN_RoyaumeImperial.md`](PLUGIN_RoyaumeImperial.md) | `RoyaumeImperial` — le Domaine de ludwing, invocations libres, arsenal |
| [`PLUGIN_FusionMana.md`](PLUGIN_FusionMana.md) | `FusionMana` — les 3 Fusions, gains/prix/escalade |
| [`PLUGIN_DestinsParalleles.md`](PLUGIN_DestinsParalleles.md) | `DestinsParalleles` — les vies parallèles, dérive/chute/recrutement |
| [`DONS_SPIRITUELS.md`](DONS_SPIRITUELS.md) | 🛑 **archive** — le Don Spirituel, retiré du jeu (2026-09-24) puis du lore (2026-10-14) |

## Le reste du dossier `docs/`
| Fichier | Contenu |
|---|---|
| [`lore.md`](lore.md) | le lore du monde |
| [`EMPIRE_DU_CORPS.md`](EMPIRE_DU_CORPS.md) | **canon de l'Empire du Corps** — l'Arbre de sang, la faim, les quatre stades, l'Ancre, les chasseurs, Éthon, Kevératus. Fait foi sur `lore.md` et le codex |
| [`personnages.md`](personnages.md) | les personnages — ⚠️ en retard sur le canon, voir son bandeau |
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
- Héros : **1** Vesper · **2** Korrah · **3** ludwing · **4** Aël. Var mentale = 10 + ID (11-14). Stock d'âmes = **var 15**.
- Dons Spirituels : **retirés** (2026-10-14). Les armes 501-516 et les reliques 68-71 restent dans la base, en équipement ordinaire.
- 3 jauges : 🟣 Corruption (la Bête) · 🔴 Errance (l'Errant) · 🔵 Santé mentale (le Dément).
- Interrupteurs réservés : 41 Fusion · 42 HUD · 95-98 chutes · 99 le Fond.
- Compteurs : 826 skills · 426 ennemis · 516 troupes · 1000 états · 460 animations.
