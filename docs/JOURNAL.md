# JOURNAL DE BORD — *L'Empire aux Trois Têtes*

> Une entrée datée par session. Ce qui a été fait, ce qui a été décidé, ce qui reste en
> attente. Les entrées les plus récentes en haut.
>
> Format : **date** · ce qui change · ce qui attend une réponse de JOKO.

---

## 2026-09-14 (2) — Première écriture dans `data/`

### Ce qui a été fait

`data/` était **vide** : ces quatre fichiers ont été **créés**, pas modifiés. Leur structure
reprend celle d'un `System.json` / `States.json` / `Classes.json` / `Actors.json` MV **1.6.1**
valide ; leur contenu est neuf.

| Fichier | Contenu |
|---|---|
| `System.json` | la table d'**éléments** dictée par JOKO, index par index, **trous compris** — ils servent à composer les sorts par addition. Plus les slots d'équipement, les types de compétence, d'arme et d'armure. Titre : *L'Empire aux Trois Têtes*. |
| `States.json` | **14 états** — les 12 demandés (ID 3 à 14), précédés de **Mort (1)** et **Garde (2)**, imposés par le moteur. |
| `Classes.json` | **4 classes** à courbes différenciées sur 99 niveaux. |
| `Actors.json` | **4 acteurs**, avec les notetags `<manifestation>` et `<jaugePropre>` **recopiés mot pour mot**. |

**Le banc.** `bancs/1_base_de_donnees.js` — **23 contrôles**, tous verts, et **23
contre-épreuves** : chaque contrôle est rejoué sur une base sabotée exprès et doit y **échouer**.
Un contrôle qui passerait sur une base cassée serait dénoncé par le banc lui-même.

**Point de retour :** tag git `avant-data` → `2550ed6`.

### Décisions de JOKO

| Question | Décision |
|---|---|
| **classes des héros** | une classe chacun : **Vesper** Chasseur de monstres · **Korrah** Chasseur d'insectes · **Ludwig** Écrivain · **Aël** Mage stellaire. *(Écarté : la lecture d'`EMPIRE_DU_CORPS.md`, qui fait de Vesper et Ludwig deux chasseurs de monstres jumeaux — ça reste écrit dans l'archive.)* |

### Ce que j'ai dû choisir, faute de consigne — à corriger d'un mot

- **Les chiffres qualitatifs.** « Léger bonus de force » → ATQ ×1.05 · « bonus d'agilité » →
  AGI ×1.15 · « gros bonus offensif, gros malus défensif » → ATQ/ATQm ×1.40, DÉF/DÉFm ×0.60 ·
  vœux → ×1.20 / ×1.50 / ×2.00. Tous listés dans `REGISTRE_VARIABLES.md`.
- **Les tables que le fichier n'avait pas.** `System.json` n'existait pas : slots
  d'équipement, types de compétence, d'arme et d'armure ont dû être posés. Ils suivent
  `GAME_DESIGN.md` avec la même numérotation à trous. Le type **11 · Ombre** existe parce que
  l'état « Amulette explosée » doit sceller **quelque chose** — sceller un type vide ne produit
  aucune erreur en jeu, juste un sceau sur du vide.
- **Les icônes** sont des repères provisoires, à choisir à l'œil dans l'éditeur.
- **`partyMembers` = [1]** seulement, parce que la question « équipe de quatre ou un seul
  marqué » (§9) est toujours ouverte.

### Deux effets que MV ne sait pas exprimer

Le **retour de dégâts** du Masque brisé (MV n'a aucun trait de recul) et le **multiplicateur de
dégâts** des vœux (MV n'a que des taux d'ATQ / ATQm). Le trait posé n'en est que l'approximation
visible ; la règle exacte est dans le notetag, pour le plugin qui viendra.

### En attente de JOKO

- 🔴 **§12, nouveau et bloquant pour le combat** — la décision « le cycle des branches
  ×1,5 / ×0,5 est vivant » oppose **trois** branches : Négatif → Spirituel → Positif. La table
  dictée n'en porte que **deux** (30 Mana positif, 31 Mana spirituel) : **le mana négatif n'a
  pas de code**. Trois issues possibles, aucune choisie.
- **§8** — « manifestation » est réglé (c'est le Don, `type=objet|arme|avatar`). Le **Culte** et
  les **cristaux** restent sans aucune mécanique écrite.
- La classe **Chasseur de monstres** n'a plus qu'un porteur (Vesper) alors que le canon en
  donnait deux. Et **le stade 4, la Mue**, n'a pas été demandé : il n'existe pas.
- `GAME_DESIGN.md` §2.1 est **périmé** et porte maintenant un bandeau : c'est `data/System.json`
  qui fait foi sur les éléments.

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

### Décisions de JOKO — prises le jour même

Quatre questions posées, quatre réponses. Elles sont inscrites dans `GAME_DESIGN.md`, et les
lectures écartées y restent conservées, jamais supprimées.

| Question | Décision |
|---|---|
| **data/** | **une base MV vierge.** JOKO crée un projet MV neuf de son côté et en copie les `.json` vides. Je n'écris rien dans `data/`. L'ancienne base reste dans `_ancien_projet/01_base_de_donnees/`. |
| **§1 · Don + Trait** | **`DONS_SPIRITUELS.md` v3.0 fait foi.** Vesper le Masque *(objet)* / **sang** · Korrah l'Armure Volante *(avatar)* / **change** + **hiver** · ludwing l'Amulette *(objet)* / **ames** · Aël l'Arc *(arme)* / **miracle**. La lecture du codex v10 est écartée, **conservée** en §1.3-1.4 (lignes **B**) — elle reste la seule trace des quatre ultimes. |
| **§4 · cycle & roue** | **les deux sont VIVANTS.** Cycle des trois branches ×1,5 / ×0,5 et roue des huit éléments. Détail chiffré et réglage MV en §2.4. ⚠️ `lore.md` et le codex v10 écrivent le contraire : **sur ce point ils sont caducs**, et ils restent intacts dans l'archive. |
| **§5 · lucidité** | **échelle 1 → 10, une variable par héros, et elle MONTE quand on va bien.** 10 = Maîtrise, 1 = Effondrement, cinq phases. Les échelles 0-100 et 0-4 sont écartées comme unité de mesure. |

### En attente de JOKO

**6 questions restent ouvertes, et les réponses en ont ouvert 2 nouvelles** — le tableau de
suivi est en tête de la section **À TRANCHER** de `GAME_DESIGN.md`.

Les trois qui bloquent le plus de travail :

1. **§8 — le Culte, les cristaux, les « manifestations ».** Trois plages de variables réservées
   à des systèmes dont **aucune mécanique n'est écrite** dans le lore. Je n'invente pas : je
   demande.
2. **§3 — qui est acteur 1, et qui porte quel art ?** Trois versions dans les sources, et
   `EMPIRE_DU_CORPS.md` fait de Vesper et Ludwig des **jumeaux chasseurs**, ce qui sort Vesper
   de l'Esprit et ludwing de l'Âme. JOKO avait déjà posé la question lui-même dans ce fichier.
3. **§9 — équipe de quatre, ou un marqué et trois Destins parallèles ?** Ça décide de la
   création de partie, de `Actors.json`, et du poids du système `ETT_Destins`.

Deux petites, nées des réponses : **§10** (où tombent les 5 seuils du Lac sur l'échelle 1-10) et
**§11** (la table « lucidité requise » des Paroles, à convertir en 1-10 — 4+ / 6+ / 8+ est la
conversion évidente, mais c'est un choix d'équilibrage, pas une division).

Et une petite derrière le §1 : 🟩 le Trait **`change`** de Korrah est **nommé sans aucune
mécanique écrite**, nulle part.

---

*Prochaine entrée : à la prochaine session.*
