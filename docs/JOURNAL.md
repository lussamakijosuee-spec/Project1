# JOURNAL DE BORD — *L'Empire aux Trois Têtes*

> Une entrée datée par session. Ce qui a été fait, ce qui a été décidé, ce qui reste en
> attente. Les entrées les plus récentes en haut.
>
> Format : **date** · ce qui change · ce qui attend une réponse de JOKO.

---

## 2026-09-15 — Le jeu se lance, et se joue

### Ce qui a été fait

`data/` n'avait que quatre fichiers ; il en manquait onze et toutes les cartes. **Le jeu démarre
maintenant, et on y joue.**

| Écrit | |
|---|---|
| `Skills.json` **25** | 1 Attaquer · 2 Se garder *(le moteur les code en dur)* · le sang de Vesper · l'ombre et l'âme de Ludwig · la Parole d'Aël · la Maîtrise de Korrah · 3 techniques d'ennemi |
| `Items.json` **12** | **sept nourritures**, lues par `ETT_Faim` : chair de monstre `<origine: M>`, charogne `<mauvais>`, bouteille de racines, verre de sang, sang de branche… |
| `Weapons.json` **10** · `Armors.json` **10** | dont **Le Masque**, **L'Amulette** *(elle ouvre le type Ombre — c'est le canon, et ça marche)*, **Les Poings** au slot Âme, **L'Arc** |
| `Enemies.json` **8** · `Troops.json` **7** | tous `<origine: M>` : ils lâchent la viande que mange le peuple |
| `CommonEvents.json` **3** | l'**Annone**, la **Mue**, le repos |
| `Tilesets.json` **3** · **3 cartes** | Quartier des chasseurs *(départ)* · Terrain de chasse · Souterrain au sang pourri |
| `Animations.json` | **vide** — tous les `animationId` à 0, à poser dans l'éditeur |

**Aucun asset extérieur** : tout est remappé sur le RTP déjà présent dans `img/` et `audio/`.

### Comment ça a été vérifié — en y jouant

`bancs/navigateur/jouer.js` **ouvre le jeu dans Chromium et appuie sur les touches** : titre,
nouvelle partie, l'intro, marcher, les murs, la faim, le menu, un combat mené jusqu'à la victoire,
les trois cartes, sauvegarder/recharger, et la Mue. **17 contrôles, 0 échec, aucune erreur
JavaScript, aucune ressource manquante.**

### Quatre bugs que seul le fait de jouer a trouvés

Le jeu se lançait **sans une seule erreur** dans les quatre cas.

1. **`flags[0]`.** La tuile `0` veut dire « pas de tuile », et MV la lit sur **toutes** les couches
   vides. À `15`, le héros démarrait sur une case infranchissable. Corrigé à `0`, plus **aucun**
   mur ne bloquait. La bonne valeur est **16** — le bit « sans effet sur le passage », qui fait
   sauter la case vide. Vérifié contre un vrai tileset du projet, pas déduit.
2. **L'autorun sans seconde page.** L'introduction se relançait à chaque frame : le joueur ne
   pouvait plus **jamais** bouger. Il faut une page 2 conditionnée à l'interrupteur local.
3. **Personne ne touchait.** *« Manqué ! »* à chaque coup, des deux côtés, indéfiniment. En MV,
   `hit` vaut **0** sans le trait xparam 0 : je n'en avais donné ni aux classes ni aux ennemis.
   Le combat tournait, les tours passaient, et rien n'arrivait jamais.
4. **Le héros était invisible.** Les acteurs n'avaient ni sprite ni portrait.

Un cinquième, attrapé par le banc : deux compétences d'âme employaient l'élément **2**, réservé et
**vide** dans ta table. Le mana spirituel est au **31**.

### Le banc qui les retient

`bancs/3_base_complete.js` — **15 contrôles, 14 contre-épreuves**. Les six pièges ci-dessus y sont
chacun un contrôle nommé, plus les références croisées et la présence **réelle sur le disque** de
chaque image, musique et son cité. Les trois bancs passent.

### Ce que c'est, et ce que ce n'est pas

**C'est une tranche jouable**, pas un jeu fini : trois cartes, une boucle complète — parler,
manger, marcher, chasser, se battre, mourir de faim. `CLAUDE.md` §4 dit que **le level design
t'appartient** : les cartes sont volontairement nues, une pièce et des murs, faites pour être
remplacées et non pour rester.

### Deux choses à savoir

- **La Mue tue la partie.** Faim au maximum → stade 4 → l'événement commun 2 mène au **game
  over**. C'est l'Article IV traduit à la lettre. L'Annone est gratuite et illimitée, donc c'est
  évitable — mais si tu le trouves trop sec, c'est une ligne à changer.
- **Aucune animation de combat.** Les coups sont muets à l'écran. C'est le plus visible des
  manques, et ça se répare dans l'éditeur.

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

## 2026-09-15 — L'ancien jeu est remis en place, sans nos plugins

**Demande de JOKO :** *« remets le jeu comme il était, mais les plugins faits par nous… juste
les MOG et YEP fonctionnent, avec leur plein potentiel, et tout le reste — data, maps,
événements, vraiment tout — sauf les plugins que j'ai ou que tu as faits. »*

C'est un demi-tour sur les deux sessions précédentes, et il est assumé : la base neuve n'est pas
jetée, elle est **mise de côté**.

### Ce qui est revenu à sa place

| | |
|---|---|
| `data/` | **82 fichiers** : 1 258 compétences, 2 000 ennemis, 1 000 états, 2 000 troupes, 1 000 animations, **65 cartes**, `CommonEvents`, `BASE MAP`, `FULL MAP` |
| `js/plugins/` | **89 plugins tiers** — 38 YEP, 28 MOG, 23 autres bibliothèques |
| `docs/` | le lore entier *(16)* + la doc technique *(14)* + `docs/rapports/` *(8)* |
| `bancs/` · `menus/` · `tools/` · `save/` · `databackup/` | 11 · 76 · 3 · 9 · 648 |

### Ce qui reste dehors, et c'est la seule exception

**135 plugins écrits par JOKO ou par Claude** — 110 `systemes_du_jeu/`, 29 `systemes_lore/` — et
`ETT_Faim.js`. Ils sont dans `_ancien_projet/02_plugins/`, classés, avec leur mode d'emploi de
réinstallation. Le socle neuf *(base de 17 fichiers, plugin de la faim, quatre bancs)* est dans
`_socle_neuf/`. **0 fichier supprimé** — vérifié : chaque blob de `HEAD` est encore dans l'arbre.

### Le point délicat : `js/plugins.js`

L'ancien manifeste comptait **194 entrées**. Le recopier tel quel aurait désigné 135 fichiers
absents. Il a donc été **reconstruit** : les 42 entrées tierces, **dans leur ordre d'origine et
avec tous leurs paramètres**, repris un par un de `plugins.js.ancien`. 41 sont actives
*(`MadeWithMv` était déjà décochée)*.

> **Une entrée qui désigne un fichier absent ne lève aucune erreur : MV se tait.** C'est
> exactement le genre de panne qu'aucune lecture de fichier n'attrape. D'où le contrôle qui
> compare, dans le moteur en marche, les entrées actives de `$plugins` à `PluginManager._scripts`.

### La vérification — `bancs/navigateur/jouer.js`, **18 contrôles, 0 échec**

Le jeu ouvert dans Chromium et joué à la touche : l'écran-titre *(« Le Codex des Trois
Sources »)*, les 41 plugins effectivement chargés, `Yanfly` et 22 `MOG_*` déclarés, une
nouvelle partie, **Vesper · ludwing · Aël · Korrah** au niveau 89, la marche, le menu, l'écran
des compétences *(94 sur le porteur)*, l'équipement *(7 emplacements)*, et **un combat mené
jusqu'à son terme** contre la troupe 1. **Aucune erreur JavaScript, aucune ressource manquante.**

C'était le vrai risque : le combat repose entièrement sur `YEP_BattleEngineCore`, les trois
`ActSeqPack`, le CTB et `AnimatedSVEnemies`, **sans un seul plugin du projet pour les épauler**.
Il tient.

### Les bancs restaurés : 4 mesurent, 7 ne démarrent pas

`4_un_seul_don.js` **76 contrôles passés**, `audit/6_bestiaire.js` et `audit/7_nouveau_lot.js`
tout passe, `navigateur/jouer.js` 18 contrôles. Les sept autres chargent le fichier d'un plugin
du projet et s'arrêtent sur un `ENOENT` : ils **ne mesurent rien**, ils ne sont pas en échec. Le
tableau et la commande pour les réveiller sont en tête de `bancs/LISEZ-MOI.md`.

### Deux choses à trancher, JOKO

1. **Les 9 plugins tiers qui ne sont ni MOG ni YEP** ont été gardés : `Community_Basic`
   *(la résolution d'écran)*, `Aries001L_ShakeEffects`, `Aries002_SystemCustomiser`,
   `Irina_AntiAudioDelay`, `Olivia_AntiPlayerStress`, `Olivia_MapDisplayNameCore`,
   `Olivia_MetaControls`, `TSR_EquipSlots` *(les 7 emplacements d'équipement)*, `MadeWithMv`
   *(décochée)*. Ta phrase disait deux choses : *« juste les MOG et YEP »*, et *« sauf les
   plugins que j'ai ou que tu as faits »*. J'ai suivi la seconde, qui est la règle : aucun de
   ces neuf n'est de nous. **Si tu voulais strictement MOG + YEP, dis-le : c'est une ligne.**
2. **Le titre à l'écran est désormais coupé en deux.** Pendant la restauration, tu as poussé le
   commit `71b7399` : il renomme le titre de la fenêtre en **« L'Empire aux Trois Têtes »** dans
   `index.html`. Ton changement est **gardé**. Mais la base restaurée, elle, porte toujours
   `gameTitle` = **« Le Codex des Trois Sources »** dans `data/System.json` — c'est ce qui
   s'affiche sur l'**écran-titre**.

   | Où | Ce qui s'affiche |
   |---|---|
   | la barre de la fenêtre | **L'Empire aux Trois Têtes** *(ton commit)* |
   | l'écran-titre du jeu | **Le Codex des Trois Sources** *(la base restaurée)* |
   | `package.json` | Le Codex des Trois Sources |

   Je ne tranche pas : `CLAUDE.md` §2 dit qu'un renommage visible à l'écran est ta décision.
   **Dis le titre, je l'aligne partout en une passe.**

### Ton commit `71b7399` — ce qu'il devient

Tu as ouvert l'éditeur MV sur le **socle neuf** et sauvegardé : `index.html`, `System.json`
*(versionId)*, `Classes.json` *(traits des trois premières classes)* et `MapInfos.json`. Comme
`data/` a été rendu à l'ancienne base, tes retouches ont été **reportées dans
`_socle_neuf/base_de_donnees/`**, là où elles s'appliquent. Seul `index.html` vaut pour les deux
et reste tel que tu l'as écrit. **Rien de ce commit n'est perdu.**

> ⚠️ Et si l'éditeur MV est **encore ouvert** sur le projet : ferme-le avant de recharger, sinon
> il réécrira `data/` avec la base qu'il a en mémoire — le socle neuf — et effacera la
> restauration.

---

## 2026-09-15 (soir) — Les MOG au travail : le temps, la nuit, le chrono

Deux pannes silencieuses du commit `0ca3015` réparées, puis la première passe MOG.

### Les deux réparations

| | |
|---|---|
| **`img/parallaxes/`** | les 44 images avaient glissé dans `img/weather/parallaxes/`. MV code `img/parallaxes/` en dur (`rpg_managers.js:828`) : **9 cartes** n'avaient plus de fond. Remis. 0 carte en défaut. |
| **`YEP_X_ActSeqPack1`** | son entrée avait sauté du gestionnaire. `se` ×15, `eval` ×5, `bgm` ×1 tombaient dans le vide sur **11 compétences**. Les dégâts passaient — `action effect` est dans le Core — mais les 5 `eval` portaient de la **mécanique** : « Dragon de la Nuit Sanglante » ne faisait plus rien du tout. Remis ligne 6 avec ses réglages d'origine. |

### Ce que JOKO a tranché

> *« touche seulement ce que j'ai, et pas les visuels de personnage — plutôt les choses de jeu
> comme le temps, l'animation, le visuel »* · menus MOG **non** · TimeSystem **oui, sur une
> plage libre** · HUD **VisualTimer seul**.

### Branché

**`MOG_TimeSystem` + `MOG_TimeSystem_Hud` + `MOG_VisualTimer`.** Les réglages viennent de la
démo ; trois choses ont changé :

1. **les ID** — la démo prend les interrupteurs 21-51 et les variables 10-12. Sur cette base,
   `ZK Âme 1-7` et `ZK Résultat` occupent 44-51, « maitrise de soi » sert **21 fois**,
   « concentration » **9 fois**. Recopier la démo aurait fait basculer les interrupteurs de JOKO
   toutes les quelques secondes, **sans un message**. Déplacé sur **interrupteurs 200-230** et
   **variables 200-202**, mesurés vides sur les 67 cartes et les 1 000 événements communs avant
   d'écrire, et nommés `TS · …` dans l'éditeur ;
2. **les termes** — Dimanche…Samedi, Printemps/Été/Automne/Hiver, Janvier…Décembre. Ils
   s'affichent à l'écran, et le jeu est en français ;
3. **la fenêtre d'horloge de `MOG_TimeSystem`** éteinte : le HUD la dessine déjà, les deux se
   superposaient.

Mesuré dans le jeu : le temps avance seul *(12h17 → 12h31 en six secondes)*, les interrupteurs
de phase, de jour de semaine, de saison et de mois basculent, **la nuit assombrit l'écran**
*(teinte −128 à 22h)*, le chrono s'affiche et décompte.

### La panne que j'ai créée, et qui n'apparaissait nulle part

Nommer la variable 200 d'un tableau long de **101** crée **99 trous**. `JSON.stringify` les
écrit `null`, et `Olivia_MetaControls` appelle `.match()` sur chaque nom au démarrage d'une
partie. Résultat : **l'écran-titre s'affichait, et « Nouvelle Partie » ne répondait plus**.
Aucune erreur à l'écran, aucune ressource manquante. Seul le banc navigateur l'a vue. Trous
comblés, et la règle est inscrite dans `docs/REGISTRE_VARIABLES.md`.

Le banc a aussi corrigé **sa propre** façon de mesurer : il lisait `$gameVariables.value(200)`,
une case choisie d'avance. Il demande maintenant au plugin *quelles* cases il emploie
(`$gameSystem._hour_variableId`) et lit celles-là. Il est passé de 18 à **26 contrôles, 0 échec**.

### Écarté, et pourquoi

| | |
|---|---|
| **`MOG_TitleSplashScreen`** | le fichier et les images sont là — mais `Splash_0.png` est le **logo « Rpg Maker MV »**. Ça collerait la marque du moteur avant ton titre. |
| **`MOG_TitlePictureCom`** | pareil : `Command_0.png` dit **« New Game »** en anglais, et `Title.png` est le logo **« Master Demo MV — Atelier Rgss »**. Il faudrait 4 images de commande en français et un logo à toi. |
| **les 5 écrans de menu MOG** | ta décision. `TSR_EquipSlots` et `YEP_SkillCore` gardent la main. |
| **`MOG_MapNameHud`** | ferait doublon avec `Olivia_MapDisplayNameCore`, déjà chargé. |
| **`MOG_CharDustTrail · Terrain ID 2 = 999`** | valeur morte, mais la corriger ne donnerait rien : **un seul tuile** de tous les tilesets porte un terrain tag. Laissé tel quel. |

### Un défaut visible, qui est une image et pas un réglage

L'horloge affiche **« Year », « Month », « Day » en anglais**. Ces mots sont **peints dans
`img/system/TimeHud_A.png`**, le cadran lui-même — le plugin ne dessine que les chiffres. Les
changer veut dire redessiner l'image : c'est du dessin, donc ta main.

### Toujours en attente

Les 9 images de `img/system` écrasées par la démo, les 4 événements communs de saison,
`Map001`, `Map004`, et `startMapId = 67`.

---

## 2026-09-15 (nuit) — Les 26 YEP restants, branchés et francisés

> *« Les YEP la même, mais plein potentiel de tous si possible, vraiment complètement,
> améliore le jeu au max. »*

**10 YEP chargés → 36.** 26 ajoutés en quatre vagues, chacune vérifiée dans le navigateur avant
la suivante. **70 plugins actifs · 2 420 réglages.**

### Le piège d'entrée : Yanfly n'a pas de valeur de repli

MOG écrit `Number(Moghunter.parameters['X'] || 633)`. Yanfly écrit
`String(Yanfly.Parameters['X'])` — **sans repli**. Une entrée de `plugins.js` avec
`"parameters":{}` ne donne donc pas les valeurs par défaut au plugin : elle lui donne la chaîne
**« undefined »**, et il s'exécute avec, sans se plaindre.

D'où `bancs/outils/reglages_yep.js`, qui relit les couples `@param` / `@default` de l'en-tête et
reconstruit ce que l'éditeur MV aurait écrit. **Validé dans les deux sens** sur les 10 YEP déjà
en place : il retrouve exactement leurs **320 paramètres**, sans en inventer ni en oublier un
seul, et isole les **4 que JOKO avait réglés à la main** *(ils sont conservés tels quels)*.

### Ce qui est branché

| Vague | Plugins |
|---|---|
| ① noyau et affichage | `X_CoreUpdatesOpt` · `MessageCore` · `ElementCore` · `BuffsStatesCore` · `X_SkillCooldowns` |
| ② objets et combat | `ItemCore` · `X_ItemUpgradeSlots` · `EquipCore` · `VictoryAftermath` · `BaseTroopEvents` · `LevelUpGrowthEffects` |
| ③ carte et déplacement | `MoveRouteCore` · `X_ExtMovePack1` · `RegionRestrictions` · `RegionEvents` · `EventChasePlayer` · `SaveEventLocations` · `PictureSpritesheets` · `ScriptCallPluginCmd` |
| ④ menus et options | `MainMenuManager` · `QuestJournal` · `SaveCore` · `KeyboardConfig` · `AnimateTilesOption` · `FpsSynchOption` · `PatchNotes` |

La zone YEP de `js/plugins.js` est reconstruite **dans l'ordre officiel de Yanfly** à chaque
vague — noyau, puis modules, puis extensions `X_` après leur parent. Tout le reste *(Aries,
Olivia, TSR, Community_Basic, les 26 MOG, le temps)* n'a pas bougé d'une ligne.

### Les quatre pannes, toutes muettes

1. **Le combat ne se terminait plus.** Mon extracteur collait un saut de ligne aux valeurs :
   MV demandait `audio/bgm/Ship3\n.ogg`, 404, et la fin de combat attendait un son qui
   n'arrivait jamais. *(La ligne vide qui suit un `@default` le termine, elle ne le prolonge pas.)*
2. **Six commandes de menu en double.** `YEP_MainMenuManager` livre ses créneaux 50, 55, 90, 95
   et 100 **déjà remplis** en exemple. Le second créneau `formation` rappelle
   `addOriginalCommands` — d'où le Music Book deux fois. Les 92 créneaux d'exemple vidés, nos 8
   gardés.
3. **La fenêtre du temps recouvrait le menu.** Avec 11 commandes, la liste descendait jusqu'à
   `y=360` ; la fenêtre du temps est posée à `y=324`. `Command Rows = 8` ramène la liste à 288 :
   le temps se glisse entre elle et la bourse, pile.
4. **Mon détecteur de dépendances accusait à tort.** Il ramassait tout `YEP_*.js` cité dans
   l'en-tête — `YEP_MoveRouteCore` *mentionne* `YEP_SelfSwVar` sans en dépendre. Il ne lit plus
   que la parenthèse `(Requires …)` du `@plugindesc`.

Et **un contrôle qui accusait un innocent** : « aucun libellé en anglais » listait `Options` et
`Formation`, qui sont les **termes français de JOKO** dans `System.json`. Il vise maintenant
nommément les libellés livrés par les plugins.

### Le français

**45 libellés traduits** sur 8 plugins — l'écran de fin de combat *(« NIVEAU SUPÉRIEUR ! »,
« Butin », « EXP gagnée »)*, la sauvegarde *(« Charger cette sauvegarde ? »)*, la configuration
du clavier, l'équipement *(« Retirer », « Terminer »)*, et le menu *(« Quêtes », « Notes de
version », « Musiques »)*. Chaque remplacement **vérifie la valeur d'origine avant d'écrire** :
si elle n'est pas celle attendue, le script s'arrête plutôt que d'écraser un réglage de JOKO.

### Un défaut trouvé au passage

`MOG_GoldHud · Initial Visible` valait **`"true "`** — avec une espace. Le plugin teste
`String(x) === "true"`, qui est **faux** : la bourse démarrait cachée. Cinq autres réglages MOG
traînaient la même espace. Nettoyés.

### Écarté, et pourquoi

**`YEP_X_BattleSysATB` et `YEP_X_BattleSysSTB`** : ce sont des **alternatives** au CTB, pas des
compléments. `BattleSysATB` réécrit 13 méthodes que `BattleSysCTB` réécrit aussi ; les deux
ensemble, c'est le dernier chargé qui gagne. Le CTB est réglé, il tourne — on ne le remplace pas
sans que JOKO le demande. Ce sont les **deux seuls** YEP non chargés.

`YEP_EquipCore`, lui, **est** chargé : il écrase bien `Game_Actor.equipSlots`, mais sans notetag
il retombe sur `$dataSystem.equipTypes` — donc exactement les **7 emplacements** de JOKO. Il
charge avant `TSR_EquipSlots`, qui garde donc la main sur l'affichage. Vérifié à l'écran.

### Le banc

De 26 à **30 contrôles, 0 échec** : la liste des commandes du menu, le non-recouvrement des
fenêtres, les libellés français, et l'écran de fin de combat de Yanfly.

---

## 2026-09-15 (tard) — Les quatre points en attente, corrigés ou rendus à JOKO

« **corrige** » — `CLAUDE.md` §2 dit qu'un mot bref ne donne pas mandat pour un chantier. Je m'en
suis donc tenu aux **quatre points signalés la veille**, et j'ai mesuré chacun avant d'y toucher.

### Deux ne sont pas des défauts : c'est du level design

| | |
|---|---|
| **`Map001`** | **3 tuiles** changées, couche 0. |
| **`Map004`** | un arbre déplacé : l'événement 5 retiré, l'événement 11 posé en (5,7), l'événement 7 retouché. |

C'est JOKO qui a fait ça, et `CLAUDE.md` §4 est clair : **les cartes et les événements lui
appartiennent**. Rien touché.

### Les images : mesurées avant de trancher

Sur les 9 fichiers de `img/system` écrasés par la démo, **cinq des versions « d'avant » étaient
des gabarits vides de 96 octets** — la même signature que les images du chrono. La démo n'a donc
rien détruit sur celles-là : elle a rempli du vide.

| Rendu à JOKO *(vrai dessin)* | Gardé de la démo *(remplissait un gabarit vide)* |
|---|---|
| `Compass_A` 140×140 · 10 Ko | `CursorBorderB` — 96 o avant |
| `Compass_B` 28×84 · **58 pixels visibles**, c'est l'aiguille du cadran | `Gold_A` — 96 o avant |
| `Damage` 240×160 · 12,9 Ko | `Gold_B` — 96 o avant |
| `Destination_Shadow` 36×16 | `ScrollBarA` — 96 o avant |
| `DustTrail` 28×28 · 1,4 Ko | |

Dans les deux sens, **l'autre version est conservée** : `*_demo.png` d'un côté, `*_vide.png` de
l'autre. Rien n'est supprimé.

### La carte de départ

`startMapId` était passé à **67 « Time System »**, la carte de démo. Remis sur **1 « Plaine de
Départ »**, en (6,8), comme avant le commit `0ca3015`. `editMapId` avec.

### Les quatre événements de saison : pire que morts

Précision sur mon propre rapport de la veille : les événements communs 60-63 étaient **vides**
avant — la démo n'a rien écrasé, elle a apporté quatre événements de météo saisonnière. Mais
tels qu'installés :

- ils guettaient les interrupteurs **116-119**, ceux du système de temps de la démo. Le nôtre
  lève **215-218** → ils ne partaient jamais ;
- et leur **verrou maître** tombait sur l'**interrupteur 4**, qui dans cette base s'appelle
  **« combat boss1 »**. Le jour où ils auraient fonctionné, **les feuilles d'automne seraient
  tombées pendant un combat de boss.**

Repointés sur 215-218, verrou déplacé sur le **231 `TS · Météo des saisons`** *(case vide,
vérifiée avant écriture)*. L'interrupteur 4 est intact.

> 🔴 **Le 231 est baissé.** Lève-le quand tu veux la météo des saisons : les feuilles au
> printemps, les nuages en été, les feuilles rousses à l'automne, la neige en hiver.

### Le banc, corrigé lui aussi

Mon premier contrôle de la météo passait sur `weatherMode(0) !== 0` — et il valait `-1`, donc il
**passait sans rien prouver**. Il lève maintenant le verrou et lit le résultat : `-1 → 1`, avec
la contre-épreuve qui vérifie qu'avant la levée, rien ne partait. **30 → 34 contrôles, 0 échec.**

### Un défaut visible de plus, qui est encore une image

La bourse affiche maintenant son vrai cadre — et il porte le mot **« Gold »**, peint dans
`img/system/Gold_A.png`. Comme pour « Year / Month / Day » sur le cadran de l'horloge : c'est du
dessin, donc ta main. Ton ancien `Gold_A` était vide, je ne peux pas le rendre.

---

## 2026-09-15 (fin) — L'écran des compétences

> *« il faut juste le visuel des compétences si tu peux avec YEP ou MOG ? un meilleur visuel »*

### La route MOG est fermée, et voici pourquoi

`MOG_SceneSkill` refait entièrement l'écran, avec de vraies images de fond. Et **elles sont déjà
là** : `menus/skill/` contient `Layout`, `ListLayout`, `TypeLayout` et les jauges — **identiques
octet pour octet** à celles de la démo. Elles étaient simplement rangées dans `menus/` au lieu de
`img/menus/`, c'est pourquoi aucun plugin ne les lisait.

Mais l'essai a sorti **une chaîne de trois dépendances**, chacune trouvée en lançant le jeu :

| Ce que le jeu a dit | Ce qui manquait |
|---|---|
| `ReferenceError: PartyWindowData is not defined` | `MOG_SceneItem` |
| `TypeError: this.updateScrollRoll is not a function` | `MOG_MenuCursor` *(ou `MOG_SceneMenu`)* |
| `TypeError: ImageManager.loadMenusFaces2 is not a function` | **`MOG_SceneMenu`** |

Autrement dit, l'écran de compétences de MOG est **inséparable du menu principal de MOG** — le
paquet que tu avais refusé, et qui écraserait `YEP_MainMenuManager`, la fenêtre du temps, et les
commandes Quêtes / Notes de version / Musiques. **J'ai fait marche arrière.**

> Les trois fichiers restent dans `js/plugins/`, **non inscrits**, et `img/menus/` est en place.
> Le jour où tu veux le paquet MOG, il manque juste `MOG_SceneMenu` et quatre lignes dans le
> gestionnaire. Je l'ai aussi mesuré : la liste de MOG n'affiche **que le TP ou le MP**, jamais
> les deux, et ignore le coût en PV de Yanfly — **114 compétences sur 1 258** y montreraient un
> coût incomplet.

### Ce qui est fait, par les réglages

| | |
|---|---|
| **`YEP_SkillCore · Window Columns` 2 → 1** | **170 noms dépassent 18 caractères**, le plus long en fait 31 *(« Communion des Quatre (Escouade) »)*. Sur deux colonnes, le coût venait buter dans le nom : *« Technique d'I**30MP**ersion »*. Une colonne pleine largeur les sépare. |
| **`Cost Padding` 4 → 12** | de l'air entre le nom et le coût. |
| **`Aries002 · Windowskin Background Opacity` 192 → 240** | les fenêtres laissaient passer la carte. |

### Le piège du jour : deux plugins pour un seul réglage

J'ai d'abord monté `YEP_CoreEngine · Window Opacity` à 240. **Aucun effet.**
`Aries002_SystemCustomiser` charge **après** Yanfly et réécrit `standardBackOpacity` avec son
propre paramètre — c'est le sien qui décide. Le réglage Yanfly était mort-né, et rien ne le
disait.

Le banc lit donc maintenant l'opacité **que la fenêtre porte vraiment**, pas celle qu'on croit
avoir réglée : si un plugin ajouté plus tard l'écrase, le contrôle tombe. **34 → 36 contrôles.**

### Ce qui reste, et qui est ta décision

La fenêtre laisse encore voir la carte : ça vient du **`windowTone` de `System.json`**, réglé à
`[0,0,0,0]` — neutre. Un ton plus sombre irait mieux à un jeu noir, mais ça change **toutes** les
fenêtres du jeu : `CLAUDE.md` §2, c'est toi qui décides.

---

## 2026-09-16 — Le mana, les Trois Sources, et les images vides

> *« essaye de voir pour le système de mana et élément des plugins en stock, puis les trois
> sources, et certains menus tous regrouper pour plus simple à lire… et d'ailleurs regarde pour
> les images système aussi »*

### Le mana et les éléments : rien à ajouter, tout est déjà là

J'ai comparé `SYSTEME_DE_MANA.md` §11 avec `data/System.json`. **Ils concordent :**

| ID | Base | Canon |
|---|---|---|
| 1 | Physique | Physique ✅ |
| 2 · 3 · 4 | mana spirituelle · positive · négative | les trois **branches** ✅ |
| 5 · 6 | Mana Sombre · Mana Originel | les **sources** Corps et Esprit ✅ |
| **7** | **`AME`** | **`Mana Parfait`** ❓ |
| 8 – 15 | FEU … OMBRE | les 8 éléments ✅ |
| 16 | mana semi parfait | *(le canon en fait un **type de compétence**, pas un élément)* ❓ |

Et le système **tourne déjà** :

- **691 compétences** portent un élément — 60 en mana spirituelle, 55 en positive, 48 en
  négative, 49 en Mana Sombre, 95 en Mana Originel ;
- les ennemis portent **2 130 traits de taux d'élément**, dont 397 sur la spirituelle et 502 sur
  la positive. **C'est le cycle du canon, déjà réglé à la main.**

> **Il n'y a donc rien à brancher.** Aucun plugin tiers en stock n'apporterait quoi que ce soit :
> le cycle vit dans les traits, là où MV l'attend. Ce qui manque, c'est de le **voir** — et les
> plugins qui l'affichaient *(`ManaVisuals`, `ManaVisualEX`, `TriangleAffinites`,
> `Lore_RoueElements`, `Lore_FlashElement`, `CodexSources`)* sont **les nôtres**, écartés par ta
> règle. Aucun tiers ne les remplace.

**Deux questions, que je ne tranche pas** *(`CLAUDE.md` §1)* : l'élément **7** s'appelle `AME`
en base et `Mana Parfait` au canon ; et l'élément **16 `mana semi parfait`** n'existe pas dans
la table du canon, qui en fait le **type de compétence 7**. Les deux sont **employés** (36 et 11
compétences), donc rien n'est cassé — mais le canon et la base ne disent pas la même chose.

### Les Trois Sources sont maintenant **dans le jeu**

`YEP_PatchNotes` — que j'avais chargé hier pour des notes de version — sait ouvrir **un fichier
HTML** depuis l'écran-titre *et* depuis le menu. Il est désormais pointé sur
**`docs/codex-trois-sources.html`**, et la commande s'appelle **« Codex des Trois Sources »**.

Le choix de la version cite `lore.md` ligne 3 : *« Canon unique : `docs/codex-trois-sources.html`
(v5) »*. La v10 est plus complète *(37 sections contre 26)* — **un seul paramètre à changer** si
tu la préfères.

> Le codex s'ouvre dans une **fenêtre à part**, avec sa vraie mise en forme : bien mieux qu'une
> fenêtre de texte MV. Seules les polices Google ne se chargent pas hors ligne ; le reste tient.

Le banc demande maintenant au plugin **l'URL qu'il construirait** et va la chercher : si le
chemin se casse un jour, le contrôle tombe au lieu de laisser un bouton mort.

### Le menu, regroupé

**Les 11 commandes tiennent maintenant d'un seul coup** *(`Command Rows` 8 → 12)*, groupées :
les cinq de jeu, puis les trois de lecture — **Quêtes · Codex des Trois Sources · Musiques** —
puis les trois de système. La fenêtre du temps du menu est éteinte : elle occupait la place, et
le HUD de la carte donne déjà l'heure, le jour et la saison.

Le banc ne se contente plus de vérifier que la fenêtre « tient à l'écran » — elle tenait déjà en
n'en montrant que huit sur onze. Il compte les **rangées réellement offertes**.

### Les images système : 25 fichiers entièrement transparents

| Rempli depuis la démo | Ce que ça rallume |
|---|---|
| `ScrollBarB` 64×64 vide → **20×6** | le curseur des barres de défilement de `MOG_Scrollbar` |
| `Treasure` 64×64 vide → **286×81** | le cadre des trouvailles de `MOG_TreasureHud` |

Ces deux plugins tournaient depuis le début **en dessinant du vide**.

Écarté : **`CreditsB`** — la version de la démo est sa propre page de crédits, *« Memories of
Mana VII »*, Moghunter, captures d'un autre jeu. La tienne est transparente, donc **la commande
« Crédits » ne fait défiler rien du tout** : il te faut ta propre image de 816×1058.

Le reste des transparentes est **cohérent** : `img/titles1/Layer5-10` et `img/titles2/MCircle3`
sont vides, et les réglages de `MOG_TitleLayers` et `MOG_TitleMagicCircles` les déclarent déjà
invisibles. Rien à corriger.

Et **« Credits » → « Crédits »** sur l'écran-titre.

---

*Prochaine entrée : à la prochaine session.*
