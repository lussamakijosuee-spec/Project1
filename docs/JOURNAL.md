# JOURNAL DE BORD — *L'Empire aux Trois Têtes*

> Une entrée datée par session. Ce qui a été fait, ce qui a été décidé, ce qui reste en
> attente. Les entrées les plus récentes en haut.
>
> Format : **date** · ce qui change · ce qui attend une réponse de JOKO.

---

## 2026-09-14 (5) — Le système de faim

### Ce qui a été fait

**`js/plugins/ETT_Faim.js`** — le premier plugin du projet. Inscrit dans `js/plugins.js`, actif,
**32 paramètres**, aucun chiffre en dur.

**Le modèle tient en deux nombres, et c'est là qu'est tout le système.**

| | |
|---|---|
| **la faim** | ce qu'on ressent maintenant. Monte avec le temps, descend quand on mange. |
| **le socle** | le **plancher** de la faim. Aucun repas ne descend en dessous, **et il ne redescend jamais**. |

C'est la traduction directe de 🟩 *« une faim de mana constante, une faim qui **ne peut pas être
comblée** (…) et elle **grandit de plus en plus** si tu te nourris mal »*. Une jauge unique
n'aurait rendu que la première moitié de la phrase.

**Ce qui fait monter la faim** — la marche *(tous les 40 pas)*, **deux fois plus vite la nuit**,
la fin d'un combat, et toute compétence notée `<faim: n>` *(« plus on puise profond, plus on
réveille la faim »)*.

**Ce qui fait monter le socle** — les **trois causes écrites dans le canon**, et elles seules :
se nourrir **mal** *(`<mauvais>`)* · se nourrir **trop** *(le surplus au-delà de ce qui
manquait)* · **boire à la branche** *(la terreur des Libéralistes)*.

**La pureté décide de ce qui tient.** 🟩 *« Le sang des racines comble la faim pendant quelques
heures »* : à la racine, **30 % seulement** du repas est durable, le reste **revient au fil des
pas**. Au tronc 75 %, à la branche 100 % — mais la branche coûte du socle.

**L'Annone** ramène à 35, jamais sous le socle. 🟩 *« Calibrée pour maintenir un porteur au Calme
sans effort. »* Le seuil du Frémissement est à 40 : la marge est de cinq points, volontairement.

**Le banc.** `bancs/2_faim.js` — il **charge le vrai fichier du plugin** dans un moteur MV
reconstruit *(`PluginManager`, `DataManager`, `Game_Action`, `Game_Interpreter`…)*, avec
`extractMetadata` reproduit **à l'identique, espace après le `:` compris**, et un
`Game_Actor.refresh()` qui rappelle le plugin — de quoi faire déborder la pile si la garde
anti-récursion lâchait. **25 contrôles · 18 contre-épreuves · 7 invariants déclarés.**

### Une règle de banc ajoutée

Le banc listait 13 contrôles sans contre-épreuve et **passait quand même**. C'est exactement ce
que `CLAUDE.md` §6 interdit. Désormais : **un contrôle est saboté, ou déclaré invariant avec sa
raison — jamais ni l'un ni l'autre.** Un contrôle orphelin fait **échouer** le banc. Cinq
sabotages de **donnée** ont été ajoutés au passage *(retirer un notetag, enlever l'espace après
le `:`)*, en plus des sabotages de réglage.

### Ce que j'ai dû choisir, faute de consigne

Tous les chiffres : 40 pas pour +1, ×2 la nuit, seuils 40 et 70, socle +2/+1/+3, les quatre
puretés, l'Annone à 35. Le lore ne chiffre **rien** de tout ça. Ce sont des `@param` : un mot
suffit à les changer, sans toucher au code.

### Ce qui manque, et qui n'est pas de mon ressort

- **Le stade 4, la Mue, n'a pas d'état en base** — tu ne l'avais pas demandé. Le plugin lève
  l'**interrupteur 21** et s'arrête là.
- **La faim ne monte pas sur l'élément « mana sombre »** : cet élément **n'a pas de code** dans
  `System.json` *(2 à 7 réservés vides)*. On passe par `<faim: n>` en attendant. C'est la
  question **§12**.
- **L'Article I** *(« nul ne boit au-dessus de son rang »)* vient du document de travail non
  validé : il est **à Non par défaut**.
- **Aucun objet créé** — tu avais dit de ne pas en créer. Le plugin lit `<nourrit:>`,
  `<purete:>`, `<mauvais>`, `<boost:>` : les aliments marcheront le jour où tu les poseras.

---

## 2026-09-14 (4) — Le Corps Artificiel

### Ce qui a été fait

Un traité politique complet de l'Empire — onze livres : la doctrine, le souverain, le Conseil des
Masques, les partis, le droit, l'économie du sang, la Démocratie Stellaire, les crises, les
secrets, les inspirations, les chantiers.

- **`docs/CANON_LE_CORPS_ARTIFICIEL.md`** — le texte, **intégral et sans retouche**.
- **`docs/GAME_DESIGN.md` §7** — l'extrait implémentable : les Six Articles, l'Article IV et
  l'homme tuable, l'Annone et les neuf cercles, le Registre N/M, les Gueules, le mana positif
  contre le porteur de Graine, le Conseil des Masques.
- **`docs/GAME_DESIGN.md` §6.8** — quatre systèmes : **`ETT_Code`**, **`ETT_Annone`**,
  **`ETT_Registre`**, **`ETT_Gueules`**.

**Rien écrit dans `data/`.** Le banc passe toujours (23/23).

### ⚠️ Ce document n'a pas le même statut que le précédent

`CANON_LA_PAROLE.md` était une dictée. Celui-ci **se déclare lui-même proposition** par endroits
— *« Attribution proposée à partir de tes noms — tout est permutable »* —, commente ses propres
choix de conception, énumère ses sources d'inspiration en Livre X, et se termine sur **sept
chantiers ouverts** en Livre XI.

Il est donc enregistré comme **document de travail**, et c'est écrit en tête du fichier. La règle
du projet est de pouvoir citer JOKO ; ici, une partie du texte ne le cite pas, elle lui propose.

### Ce que la vérification a trouvé

Six collisions avec le canon déjà en place, vérifiées fichier par fichier. Les trois sérieuses :

| | Le canon en place | Le Corps Artificiel |
|---|---|---|
| **Sève** | la **Liseuse des Sangs**, championne de l'Empire Uni de l'**Est**, rang S | la **capitale** de l'Empire du Corps |
| **la capitale** | **Kragenvar** *(Iris est « la Fournaise de Kragenvar »)* | la Sève |
| **l'Ordre d'Or** | l'un des **Quatre Royaumes**, celui de **Donovano** | la **police intérieure** de l'Empire |

Plus trois termes neufs, absents partout ailleurs : **« porteur de Graine »**, **« Culte des
Neiges »**, **« l'Empire de la Main »**.

### Deux choses qui touchent le jeu, pas le décor

1. **L'Article VI met deux des quatre marqués hors la loi.** Il interdit les livres d'âme, le
   Rappel, tout rassemblement autour d'un objet froid, et toute recherche sur le mana spirituel —
   peine de mort. Or **ludwing absorbe les âmes** et **Korrah manie le froid**. Porter l'Amulette
   dans l'Empire est un délit capital. C'est une contrainte permanente sur le groupe jouable.
2. **Le mana positif affame un porteur de Graine.** Les cristaux stellaires en sont chargés.
   L'élément **30** ne fait donc pas que des dégâts à un buveur de sang : **il le pousse vers la
   Mue**. Et Aël, Mage stellaire, porte l'élément qui affame ses propres compagnons.

### En attente de JOKO

- **§17** — les six collisions. Les trois premières déplacent des pièces de la carte politique,
  pas des noms.
- **§18** — ce document est-il canon arrêté ou proposition ? Et ses sept chantiers : qui est V. ·
  la Serrata · le dixième masque · ce qu'Éthon a répondu à l'Éteignoir · le nom de Béhémoth · le
  chiffre du différentiel · les onze détenus des Puits.

Le suivi passe à **5 tranchées, 11 ouvertes**.

---

## 2026-09-14 (3) — Le canon de la Parole

### Ce qui a été fait

JOKO a dicté **le système de la Parole de bout en bout** : le cristal, les quatre formes de sort,
la règle des fusions, le prix du mage, le paradoxe du lac, les runes et les hôtels.

- **`docs/CANON_LA_PAROLE.md`** — la dictée, transcrite **verbatim**. C'est elle qu'on cite.
- **`docs/GAME_DESIGN.md`** — l'extrait implémentable : §2.5 *la composition d'un sort* (les
  quatre formes, chiffrées) · §4.3 *le paradoxe du lac* et *le prix du mage* · §5.5 *le cristal*
  comme ressource · §6.7 trois systèmes neufs — **`ETT_Cristal`**, **`ETT_Runes`**,
  **`ETT_Hotels`**.

**Rien n'a été écrit dans `data/`** : ce canon ouvre deux trous qu'il faut trancher avant de
toucher aux éléments. Le banc passe toujours (23/23).

### Ce que la mesure a trouvé

La règle des fusions a été **rejouée contre `data/System.json`**, pas crue sur parole :

| | |
|---|---|
| sommes atteignables | **15**, de 16 (Feu+Feu) à 30 (Ombre+Ombre) |
| collision fusions ⇄ concaténations | **aucune** ✅ — les concaténations vont de 808 à 1515, le canon a raison |
| 🔴 **Ombre + Ombre = 30** | et **30 porte « Mana positif »** |
| 🔴 **8 sommes sur 15 sans élément** | 16 · 18 · 21 · 24 · 25 · 26 · 27 · 28 — dont *Feu+Vent*, *Vent+Terre*, *Glace+Ombre* |

### Une conséquence d'interface à ne pas rater

🟩 *« Pas de vertige, pas de palier, pas de signal. »* Le seuil fatal de la lucidité **ne doit pas
être annoncé** — pas de jauge qui clignote, pas de message. C'est l'inverse exact de l'alerte
avant la casse des Dons (§4.5), qui, elle, prévient. Ici, **prévenir casserait la mécanique**.

### En attente de JOKO

Quatre questions neuves, **§13 à §16** de `GAME_DESIGN.md`. Les deux rouges :

1. **§13 — Ombre + Ombre = 30**, et les huit sommes qui ne mènent à rien.
2. **§15 — Aël est « Mage stellaire » et porte `<manifestation: type=arme, nom=L'Arc>`.** Ce
   canon dit qu'un mage **n'a pas de manifestation**, le cristal ayant fermé son canal spirituel.
   Les deux ne tiennent pas ensemble. Même question pour **Ludwig**, classe Écrivain, qui porte
   l'Amulette et dont le Trait est l'absorption des âmes.

Et deux plus légères : **§14** (les concaténations sont-elles de vrais éléments MV, ou un calcul
de plugin — 1 516 entrées contre une poignée) et **§16** (le facteur d'amplification, et
*Démocratie Stellaire* comme quatrième nom de la faction).

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
