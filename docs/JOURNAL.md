# JOURNAL DE BORD — *L'Empire aux Trois Têtes*

> Une entrée datée par session. Ce qui a été fait, ce qui a été décidé, ce qui reste en
> attente. Les entrées les plus récentes en haut.
>
> Format : **date** · ce qui change · ce qui attend une réponse de JOKO.

---

## 2026-09-14 — Remise à zéro et fondations

### Ce qui a été fait

**Le dépôt.** Le dépôt git existait déjà, avec **85 commits** d'historique. Il n'a **pas** été
réinitialisé : réinitialiser aurait détruit l'historique, et rien ne se supprime ici. La remise à
zéro s'est faite par **déplacement**, et l'historique git de chaque fichier déplacé est intact
(git les enregistre comme des renommages, pas comme des suppressions + créations).

**L'archive.** Tout ce qui existait avant a été **retiré de la racine et rangé** dans
`_ancien_projet/`, classé par nature — **1 158 fichiers**, rien de supprimé :

| Dossier | Contenu | Fichiers |
|---|---|---|
| `01_base_de_donnees/` | l'ancienne base entière (Actors, Skills, States, Troops, 70 cartes…) | 82 |
| `02_plugins/` | 288 plugins, séparés par origine : systèmes du jeu · systèmes de lore · Yanfly · Moghunter · tiers divers · abandonnés · boîte à outils — **plus l'ancien `plugins.js`** (l'ordre de chargement des 194 entrées) | 288 |
| `03_lore_canon/` | le lore : `lore.md`, `EMPIRE_DU_CORPS.md`, `SYSTEME_DE_MANA.md`, `DONS_SPIRITUELS.md`, les deux codex, le Bréviaire, `personnages.md`, `scenario.md`, `bestiaire.md`, Iris & Joah, les notes | 16 |
| `04_documentation_technique/` | le guide développeur, les fiches de plugins, les recettes, l'ordre de chargement | 14 |
| `05_rapports_et_audits/` | les rapports d'équilibrage, les audits, `A_TRIER.md` | 8 |
| `06_bancs_dessai/` | les 11 bancs Node | 11 |
| `07_images_de_menu/` · `08_outils/` · `09_databackup/` · `10_sauvegardes/` · `11_divers/` | le reste | 739 |

`_ancien_projet/LISEZ-MOI.md` donne, pour chaque dossier, **la commande exacte qui le remet en
place**.

**Ce qui reste à la racine, volontairement :**

- le **squelette MV** : `js/rpg_*.js`, `js/libs/`, `js/main.js`, `index.html`,
  `Game.rpgproject`, `package.json` ;
- les **assets** : `img/`, `audio/`, `fonts/`, `icon/`. Ce sont des matériaux, pas du contenu —
  et `CLAUDE.md` §4 interdit d'y toucher. *(Si tu veux qu'ils partent aussi à l'archive, c'est
  une ligne de commande, dis-le.)*
- `CLAUDE.md`, qui est le contrat de travail et non du contenu de jeu.

**Le reste.**

- `.gitignore` refait pour MV : `save/` ignoré (son contenu, pas le dossier), temporaires,
  exports, crasses d'OS. **`data/` et `js/` sont explicitement protégés** — l'ancien `.gitignore`
  ignorait par erreur `data/Actors.json` et `data/CommonEvents.json`, ce qui les aurait fait
  disparaître à un clone propre. C'est corrigé.
- `js/plugins.js` remis à zéro : `var $plugins = [];`. L'ancien, avec ses 194 entrées et tous
  leurs réglages, est conservé sous `_ancien_projet/02_plugins/plugins.js.ancien`.
- `docs/` reconstruit à quatre fichiers : `CONVENTIONS.md`, `REGISTRE_VARIABLES.md`,
  `JOURNAL.md`, `GAME_DESIGN.md`.
- Commit **`projet vierge`**.

**Le lore.** Lus **intégralement** : `lore.md`, `EMPIRE_DU_CORPS.md`, `SYSTEME_DE_MANA.md`,
`DONS_SPIRITUELS.md`, `personnages.md`, `scenario.md`, `bestiaire.md`, `perso-iris-et-joah.md`,
`notes/`, et le **codex v10** (texte extrait du HTML, 825 lignes). Parcourus **par structure** :
le codex v5 — dont toutes les sections se retrouvent dans le v10 — et le `breviaire-cendres.html`,
qui est un recueil de prières et de chants : aucune mécanique à en tirer. `_archive/` (Battle
World) est ignoré, il se déclare obsolète lui-même.

Distillé dans `GAME_DESIGN.md` : les quatre marqués, les éléments et leurs codes, les états, les
jauges, les consommables, et **26 systèmes à coder avec leur graphe de dépendances**.

### Ce qui n'a PAS été fait — et pourquoi

- **Aucun plugin écrit.** Demandé.
- **Rien écrit dans `data/`.** Demandé. **Conséquence à connaître :** `data/` est maintenant
  **vide**. RPG Maker MV **ne peut pas ouvrir un projet sans `data/`** — il faut soit y remettre
  une base (`_ancien_projet/01_base_de_donnees/`), soit créer un projet MV neuf et en copier les
  `.json` vierges. Rien n'est cassé : c'est un `mv` dans un sens ou dans l'autre.
- **`docs/REGISTRE_VARIABLES.md` est vide**, comme demandé — seules les plages sont réservées.
- **Le titre n'a pas été changé** dans `package.json` / `index.html` : ce sont des noms qui
  apparaissent à l'écran, donc une décision de JOKO (`CLAUDE.md` §2).

### En attente de JOKO

**9 questions** en fin de `GAME_DESIGN.md`, section **À TRANCHER**. Les trois qui bloquent le
plus de travail :

1. **§1 — quelle attribution Don + Trait fait foi ?** `DONS_SPIRITUELS.md` et le codex v10
   donnent aux quatre héros des Dons **et** des Traits entièrement différents. Tant que ce n'est
   pas tranché, on ne peut coder ni `ETT_Don`, ni `ETT_Trait`, ni `ETT_Avatar`.
2. **§4 — le cycle des branches (×1,5 / ×0,5) et la roue des éléments sont-ils retirés ?**
   `SYSTEME_DE_MANA.md` les décrit ; `lore.md` et le codex v10 disent qu'ils ont été supprimés.
   Ça décide de tout le combat.
3. **§8 — le Culte, les cristaux, les « manifestations ».** Trois plages de variables réservées
   à des systèmes dont **aucune mécanique n'est écrite** dans le lore. Je n'invente pas : je
   demande.

---

*Prochaine entrée : à la prochaine session.*
