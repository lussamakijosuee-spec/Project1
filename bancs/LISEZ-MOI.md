# 🧪 Les bancs d'essai

Dix scripts qui vérifient le système **sans lancer le jeu**. Ils lisent les vrais fichiers de
`data/` et rejouent le vrai code de `js/plugins/` sur un moteur RPG Maker MV simulé.
Plus un onzième, `navigateur/jouer.js`, qui **ouvre le jeu pour de vrai**.

---

> ## ⚠️ Sept bancs ne démarrent pas — et pourquoi ce n'est pas un échec
>
> La restauration du 2026-09-15 ne gardait que les plugins **tiers**. JOKO a ensuite rajouté
> lui-même ses **13 plugins du mana**, puis on a dû remonter les **7 socles** dont ils
> dépendaient — `LoreCanon`, `JadeEntitePlunging`, `Lore_SanteMentale`, `Errance`,
> `CorruptionAme`, `Surpassement`, `RangsPuissance` — sans quoi tout le système « chaque Voie
> a un prix » tournait à vide *(voir `navigateur/ponts_du_mana.js`)*.
>
> Il reste **quatre** plugins du projet dans `_ancien_projet/02_plugins/`, et sept bancs les
> chargent pour les rejouer. Sans le fichier, ils s'arrêtent sur un `ENOENT` : ils ne mesurent
> rien, ils ne sont pas en échec.
>
> | Banc | Ce qui lui manque |
> |---|---|
> | `1_dons_spirituels.js` · `3_avatar_spirituel.js` · `6_avatar_niveaux.js` | `DonsSpirituels.js` |
> | `2_evolution_paliers.js` · `5_verrou_et_ordres.js` | `ObjetSpirituel.js` |
> | `audit/8_tableau_de_chasse.js` | `ChasseAuxPrimes.js` |
> | `audit/9_equilibre.js` | `SoulsDifficulty.js` |
>
> **Aucun plugin chargé ne dépend de ces quatre-là** — on l'a vérifié : rien ne lit
> `window.Dons`, `window.Primes` ni `window.Scene_Difficulty`. Les remonter n'est donc pas une
> réparation mais un **choix de jeu**, et le choix appartient à JOKO *(§2)*.
>
> **Rien n'est cassé et rien n'est perdu.** Le jour où l'un d'eux revient dans `js/plugins/`,
> son banc se remet à mesurer tout seul, sans modification :
>
> ```bash
> mv _ancien_projet/02_plugins/systemes_du_jeu/DonsSpirituels.js js/plugins/
> node bancs/1_dons_spirituels.js
> ```
>
> *(Le remonter dans `js/plugins/` suffit au banc. Pour que **le jeu** le charge aussi, il faut
> en plus l'inscrire dans `js/plugins.js` — son entrée d'origine, réglages compris, est dans
> `_ancien_projet/02_plugins/plugins.js.ancien`.)*

---

## Comment on les lance

Il faut **Node.js** installé. Depuis la racine du projet :

```bash
node bancs/4_un_seul_don.js          # un seul banc
```

Ou tous d'un coup :

```bash
for f in bancs/*.js bancs/audit/*.js; do node "$f"; done
```

Chaque banc sort `✅ TOUT PASSE` ou la liste de ce qui cloche, et renvoie le code 1 en cas d'échec.

## Ce que chacun contrôle

| Banc | Ce qu'il vérifie |
|---|---|
| `1_dons_spirituels.js` | Endurance, jauges de Sang et d'Ombre, casse, ÷2, bonus de l'Avatar, repos |
| `2_evolution_paliers.js` | la montée Éclat → Forme → Résonance → Vérité — **et que l'acier, lui, ne monte pas** |
| `3_avatar_spirituel.js` | l'Avatar : son tour, son ciblage, son interception, ses trois postures |
| `4_un_seul_don.js` | **la règle d'or** : un seul Don par personne, 76 contrôles |
| `5_verrou_et_ordres.js` | le Don ne se retire pas / ne se prête pas · les trois ordres en combat |
| `6_avatar_niveaux.js` | les 3 niveaux de l'Avatar (25/50/85), le contrôle croissant, l'inséparabilité |
| `audit/6_bestiaire.js` | les 400+ ennemis et les 41 boss |
| `audit/7_nouveau_lot.js` | les compétences, les apprentissages, le butin |
| `audit/8_tableau_de_chasse.js` | le Tableau de Chasse et les primes |
| `audit/9_equilibre.js` | **l'équilibre mesuré** : TTK / TTD à chaque palier, contre le vrai bestiaire |
| `7_trois_sources.js` | **les trois sources** : le repli des éléments 5 et 6, et le prix de chaque source — 16 contrôles |
| `9_doctrines.js` | **la dangerosité et les doctrines de combat** des 547 ennemis — 24 contrôles |
| `10_troupes.js` | **les phases deux et les renforts** des 270 troupes de famille — 18 contrôles |
| `11_degats_et_voies.js` | **la forme des formules** et **les neuf Voies** — 17 contrôles |
| `navigateur/jouer.js` | **le jeu, ouvert dans Chromium et joué à la touche** — 43 contrôles |
| `navigateur/chevauchements.js` | **les textes qui se dessinent l'un sur l'autre** — il détourne `drawText` et compare les rectangles |
| `navigateur/ponts_du_mana.js` | **le mana sans l'ancien lore** : les Chutes parties, les Voies qui tiennent — 9 contrôles |
| `navigateur/etats_en_combat.js` | **les états posés sur un vrai combattant** : les notetags qui ne faisaient rien — 12 contrôles |
| `navigateur/doctrines_en_combat.js` | **un boss qui décide pour de vrai**, tour par tour, dans le moteur — 7 contrôles |

## `9_doctrines.js` — pourquoi il ne relit pas le script qui a écrit les doctrines

`YEP_BattleAICore` était chargé et ne faisait **rien** : aucun des 547 ennemis ne portait de bloc
`<AI Priority>`. Ils en portent un maintenant. Mais **tout ce qui rate là-dedans rate en silence** —
Yanfly abandonne la ligne et l'ennemi retombe sur l'IA ordinaire de MV, sans une erreur :

| Ce qu'on écrit | Ce que Yanfly en fait |
|---|---|
| une condition qu'il ne sait pas lire | `passAIConditions` finit par `return false` — la ligne ne part **jamais** |
| `ALWAYS:Attaque` *(sans l'espace)* | aucun des 4 motifs ne mord — ligne ignorée |
| un nom de compétence inconnu | `initialCheck` rend `false` — ligne ignorée |
| une compétence trop chère | `meetsSkillConditions` rend `false` — ligne ignorée |
| **un nom porté par DEUX compétences** | `Yanfly.SkillIdRef` garde **la dernière** |

Le dernier est le plus vicieux : il ne tue pas la ligne, il la **détourne**. Cinq ennemis écrivaient
« Éclat Noir » en possédant l'id 11 *(×14 ATK)* — Yanfly leur rendait l'id 1124 *(×29 ATK)*. La
compétence partait, **au double des dégâts prévus**, sans une ligne de journal. Quatorze lignes
étaient dans ce cas. Elles sont désormais épinglées par identifiant (`Skill 11`), que Yanfly lit
avant le nom.

D'où la règle appliquée ici : le banc ne rejoue pas la logique qui a **écrit** les doctrines, il
rejoue **les expressions régulières de `YEP_BattleAICore.js` lui-même**, relues dans le fichier du
plugin. On mesure ce que le moteur fera, pas ce qu'on croit lui avoir dit.

> **Seize noms de compétence sont portés par deux compétences** *(« Requiem », « Bris Total »,
> « Il Abat le Bras »…)*. Épingler les doctrines par identifiant met l'IA à l'abri, mais le joueur,
> lui, voit toujours deux lignes identiques dans ses menus. **Les renommer est une décision de
> JOKO** *(§2 : on ne renomme pas ce qui s'affiche à l'écran)*.

## `8_visages_ennemis.js` — le banc qui s'est trompé, et ce qu'il a coûté

Il contrôlait qu'un `battlerName` désigne **un sprite** : couche alpha, pas plus de 900×900. Tout
passait. Sauf que la bande visible du combat ne fait que **444 px de haut** — en dessous, c'est
l'interface. Un sprite de 780 px posé à `y=300` a **478 px au-dessus de l'écran**, et le joueur n'en
voit que les pieds qui pendent.

**298 placements sur 1 057 étaient dans ce cas**, sur 223 troupes, et le banc disait que tout allait
bien. Il mesurait le **motif** — « ça ressemble à un sprite » — au lieu du **symptôme** — « on le
voit en entier ». C'est très exactement l'erreur que §6 décrit.

Il mesure maintenant ce que le joueur voit : à la place la plus haute où une troupe pose l'ennemi,
le sprite **mis à l'échelle par son `<Scale Sprite: n%>`** doit tenir dans les 816×444 visibles.
201 ennemis portent désormais cette échelle ; les 346 autres tenaient déjà et n'ont rien reçu.

> `Sprite_Enemy` s'ancre aux **pieds** (ancre 0.5, 1) : `y` est le bas du sprite, jamais son haut.
> C'est ce qui rend l'erreur invisible à la lecture des données.

## `navigateur/jouer.js` — celui qui ouvre vraiment le jeu

Les dix autres **lisent des fichiers**. Celui-là lance le jeu, appuie sur les touches et
regarde : l'écran-titre, les plugins tiers effectivement chargés, la base entière relue par
le moteur, une nouvelle partie, la marche au clavier, le menu, l'écran des compétences, celui
de l'équipement, **un combat mené jusqu'à son terme**, **l'horloge qui tourne et la nuit qui
tombe**, **le chrono** — puis il compte les erreurs JavaScript et les ressources manquantes.

C'est le seul qui puisse dire si `js/plugins.js`, reconstruit à la main le 2026-09-15, tient
debout : une entrée qui désignerait un fichier absent ne lève **aucune erreur visible**, MV se
tait.

**Six pannes qu'il a attrapées et que rien d'autre n'aurait vues :**

| Ce qu'on voyait | Ce que c'était |
|---|---|
| la météo des saisons **ne partait jamais** — et serait partie **en plein combat de boss** | les 4 événements communs venus de la démo guettaient ses interrupteurs à elle *(116-119)*, et leur verrou maître tombait sur l'**interrupteur 4**, qui ici s'appelle **« combat boss1 »** |
| l'écran-titre s'affichait, et **« Nouvelle Partie » ne répondait plus** | 99 trous `null` dans `$dataSystem.variables`, créés en nommant la variable 200 d'un tableau long de 101. `Olivia_MetaControls` appelle `.match()` sur chaque nom au démarrage d'une partie |
| **le combat ne se terminait plus** | un saut de ligne collé à une valeur de réglage : MV demandait `audio/bgm/Ship3\n.ogg`. Un 404 muet, et la fin de combat reste en attente d'un son qui n'arrive jamais |
| **six commandes de menu en double** | `YEP_MainMenuManager` livre ses créneaux 50, 55, 90, 95 et 100 déjà remplis en exemple. Le second créneau `formation` rappelle `addOriginalCommands` — d'où le Music Book deux fois |
| la fenêtre du temps **recouvrait le menu** | deux fenêtres qui se superposent ne lèvent rien : elles se dessinent l'une sur l'autre |
| l'horloge s'affichait, mais mesurée sur la mauvaise case | le contrôle lisait `$gameVariables.value(200)` **choisi d'avance**. Il demande maintenant au plugin **quelles cases il emploie** (`$gameSystem._hour_variableId`) et lit celles-là |

> Le dernier est la règle n°2 appliquée au réglage d'un plugin : **on ne vérifie pas ce qu'on
> croit avoir écrit, on vérifie ce que le moteur emploie vraiment.**

**Et un contrôle qui accusait un innocent.** Le contrôle « aucun libellé en anglais » listait
`Options` et `Formation` comme suspects — ce sont les **termes français de JOKO**, écrits dans
`System.json`. Il vise désormais nommément les libellés que les plugins posent par défaut
*(`Quest`, `Patch Notes`, `Music Book`…)*. Règle n°3 : un contrôle doit **innocenter les faux**
autant qu'attraper le vrai.

Il n'est **pas automatique** — il lui faut Playwright et un serveur :

```bash
npx http-server -p 8899 -c-1 .        # dans un autre terminal, à la racine
node bancs/navigateur/jouer.js
```

Les captures atterrissent dans `bancs/navigateur/captures/` (non versionné).

## Pourquoi ils existent

Deux bugs sont passés à travers des tests écrits trop à la légère :

1. **Un passage de rééquilibrage écrit en Python** ignorait silencieusement toutes les formules
   contenant `b.def` — `def` est un mot-clé Python. Toutes les compétences **physiques** avaient
   été sautées. Les bancs sont en JavaScript depuis.

2. **`ChasseAuxPrimes` plantait à l'ouverture** parce que le test était écrit contre un
   `Window_Selectable` nu, sans les surcharges de `MOG_Scrollbar`, `MOG_CursorBorder` et
   `YEP_X_BattleSysCTB` qui appellent `select()` pendant l'initialisation.

D'où la règle : **un banc simule le moteur assez fidèlement pour attraper le bug, ou il ne sert à
rien.** `5_verrou_et_ordres.js` rejoue par exemple `changeEquip`, `clearEquipments` et
`optimizeEquipments` exactement comme MV les enchaîne.

## Si un banc échoue après une modification volontaire

C'est normal — ils encodent des attentes précises (nombre d'ennemis, nombre de compétences…).
Ouvre le fichier, la ligne du contrôle porte son libellé en clair. Corrige l'attente si le
changement est voulu ; corrige les données si ce n'en est pas un.
