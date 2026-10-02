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
| `1_dons_spirituels.js` | ⏸ **en sommeil** — Endurance, jauges, casse : le système des Dons est retiré |
| `2_evolution_paliers.js` | ⏸ **en sommeil** — la montée des paliers d'un Don |
| `3_avatar_spirituel.js` | ⏸ **en sommeil** — l'Avatar joué à travers Korrah |
| `4_un_seul_don.js` | **la règle d'or** : un seul Don par personne, 76 contrôles |
| `5_verrou_et_ordres.js` | ⏸ **en sommeil** — le verrou du Don |
| `6_avatar_niveaux.js` | ⏸ **en sommeil** — les seuils sont passés dans la classe 5 |
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
| `outils/trier_les_sons.py` | **les sons** : chaque MP3 (que MV ne lit pas) devient un `.ogg` et un `.m4a`, rangé dans le bon dossier (un jingle court → `me`, une ambiance d'une minute → `bgs`) ; le MP3 d'origine part dans `audio/_originaux_mp3/` ; les musiques sont classées par le nom et l'écoute mesurée dans `docs/MUSIQUES.md`. Il faut `pip install imageio-ffmpeg numpy` |
| `outils/poser_les_recettes.js` | **les recettes** : 769 événements communs prêts à l'emploi (1001–1805, un séparateur par thème) — portes, coffres, lampes qui s'allument la nuit, météo, PNJ, boutiques, auberges, énigmes, pièges, récolte, combats, quêtes, cinématiques, mini-jeux, discrétion, village… écrits dans `outils/recettes/r*.js` avec un vocabulaire (`recettes/dsl.js`) qui produit de vraies commandes MV. Refuse d'écrire si un son, une animation, un objet, une troupe, un état, une commande de plugin manque, si un script ne compile pas ou si un bloc n'est pas refermé. Nomme les interrupteurs et variables ✎ 901+ |
| `navigateur/les_recettes.js` | **les recettes tournent** : chacune exécutée 3 fois dans le vrai moteur, choix au hasard ; ce qui tourne encore est rejoué en temps réel — 0 erreur, 767 vont au bout, 2 attendent le joueur à dessein |
| `outils/poser_la_vitrine.js` | **la vitrine** : carte 70 « ✎ ATELIER · Recettes à copier », les 769 recettes posées en vrais événements de carte, à copier-coller — commandes dans l'événement, image, déclencheur, page 2 (coffre ouvert, torche allumée…), portes en « Transférer le joueur » direct. Un thème par bande, un panneau par bande |
| `navigateur/la_vitrine.js` | **la vitrine tourne** : 25 s de promenade en temps réel (aucun transfert, combat ni game over tout seul), toutes les images se chargent, chaque page de chaque événement exécutée 3 fois avec son numéro d'événement — 850 pages, 0 erreur |
| `outils/poser_les_habitants.js` | **les habitants** : le bar (46) et l'auberge (44) au niveau de l'aubergiste de JOKO — 26 habitués du bar, l'aubergiste (textes de JOKO gardés, annonce en toute saison, chambre pendant la quête), les négociants du vendredi, le tableau d'affichage. Chaque fiche (`outils/habitants/*.js`) devient de vraies commandes MV : 1re rencontre, retour après 7 jours, bonjour selon le moment, remarque de saison, blessure, menu en boucle, sujet perso qui s'ouvre avec les visites. Horaires dans la Note (`<Horaire: 18-4>`), mémoire par `js/plugins/Habitants.js`. Garde les boutiques, quêtes et commentaires d'origine (instantané `outils/habitants/originaux.json`) |
| `navigateur/les_habitants.js` | **les habitants vivent** : qui est là à 8 h, 14 h, 20 h, 2 h ; Silas absent à 10 h et présent à 20 h sans quitter la carte ; mémoire des visites et des jours d'absence ; 592 conversations (4 saisons × 4 moments × chaque page) jusqu'à « Au revoir », 0 erreur |
| `outils/reparer_les_horaires.js` | **les horaires de JOKO** : ses pages testaient 101-115, MOG allume 200-214 → remappées ; pages « Crépuscule ET Nuit » coupées en OU ; page sans condition remise en tête ; animation relancée à chaque image → attente |
| `outils/poser_les_portes.js` | **les portes des villes** : destination de JOKO gardée, ouverture animée, heures selon ce qu'il y a derrière (boutique 8-20, bar 10-4, auberge toujours, maison 6-22, manoir 7-21), écriteau et « frapper » quand c'est fermé ; maisons sans destination fermées à clé |
| `outils/rapport_habitants.js` | régénère `docs/HABITANTS.md` : tous les habitants, leur voix, leurs heures, ce qu'ils proposent |
| `navigateur/une_journee_en_ville.js` | **une journée en ville** : horaires réparés, portes (ouvertes, fermées, frapper), intérieurs sans météo, Silas qui entre et sort à pied, Gaston qui va au bar le soir, 1 104 conversations sur 10 cartes — 0 erreur |
| `navigateur/ca_rame_en_ville.js` | **est-ce que ça rame en ville ?** images par seconde et temps de calcul par image sur chaque carte habitée et la vitrine, à 19 h — échec sous 55 img/s ou au-delà de 12 ms par image, ou si le jeu s'arrête |
| `outils/poser_l_atelier.js` | **l'atelier** : le carnet en vrais événements, sur deux cartes que rien ne relie au monde — 068 « ✎ ATELIER · Situations » (un panneau par situation, avec les vraies commandes d'événement) et 069 « ✎ ATELIER · Tous les plugins » (un panneau par plugin actif, toutes ses commandes). Refuse d'écrire une commande qu'aucun plugin actif n'écoute à cette orthographe. Il pose aussi le même carnet en **événements communs** : 701–780 les situations (un séparateur « ▬▬ ✎ thème ▬▬ » par thème), 801–931 un par plugin, déclencheur « Aucun ». Les cartes portent `<Atelier>`, les événements communs commencent par « ✎ » : `outils/atelier.js` les fait ignorer par les bancs et le carnet |
| `outils/carnet_des_plugins.js` | **le carnet des plugins** : pour chacun des plugins actifs, ses commandes (lues dans son code), ses balises, ses scripts, ses interrupteurs, ses réglages et son aide ; en tête, les situations écrites à la main (`outils/carnet_situations.js`), chaque ligne vérifiée contre le code du plugin qu'elle cite. `--ecrire` produit `docs/CARNET_DES_PLUGINS.html` — à relancer quand on allume ou éteint un plugin |
| `navigateur/les_boss.js` | **les boss, joués** : la rupture de la charge (et l'IA qui renonce à frapper), les insécables, les 27 mécaniques de `MecaniquesDeBossSuite` mise en garde → frappe, 14 d'entre elles mesurées ; Mahoraga, les météores de Radahn, l'Esprit de Dono, l'âme de Lou — 41 contrôles, deux captures |
| `navigateur/les_livres.js` | **le Bestiaire et l'Encyclopédie, ouverts depuis le menu et parcourus** — 12 contrôles |
| `21_le_retrait_des_dons.js` | **le retrait des Dons tient** : greffons éteints mais présents, 16 pièces gardées, l'Avatar survivant — 26 contrôles |
| `navigateur/seiryu_cinquieme.js` | **seiryu, cinquième combattant** : ses PV, son tour, ses décisions, ses trois postures, sa protection — 24 contrôles |
| `navigateur/le_corps_de_lavatar.js` | ⏸ **remplacé** par `seiryu_cinquieme.js` |
| `navigateur/ecran_des_dons.js` | ⏸ **en sommeil** — l'écran des Dons est parti avec son système |
| `navigateur/les_commandes_qui_repondent.js` | **les commandes que les cartes appelaient dans le vide**, le marchand, les trois reliques — 43 contrôles |
| `navigateur/le_royaume_imperial.js` | **Royaume Impérial** dans un vrai combat : 2 min, une âme par retour, tous les PM, la fatigue — 25 contrôles |
| `navigateur/les_quetes.js` | **les quêtes, jouées** : la Caverne ouvre la première, la ville l'accomplit, le garde donne un contrat, cinq bandits tombent, il paie ; Tobin, Colin et Sarielle revivent ; la sauvegarde reconstruit le journal — avec contre-épreuves. Les quêtes sont posées par `outils/poser_les_quetes.js` |
| `22_animations_coherentes.js` | **chaque attaque se voit, et dans sa couleur** : aucune arme muette, aucune compétence de feu qui joue de l'eau, les vraies teintes (rotation = voulue − départ), et huit états qui faisaient le contraire de leur nom — 30 contrôles. Règle dans `outils/coherence_animations.js`, correction par `outils/animer_les_competences.js`, teintes mesurées par `outils/mesurer_teintes.js` |
| `navigateur/lavatar_obeit.js` | **l'Avatar obéit, et il apprend** : de vrais tours joués, qui frappe qui, les trois paliers du Lien — 21 contrôles |
| `navigateur/lorbe_en_raccord.js` | **l'Orbe montre ce que le héros a vraiment** : ses branches = son menu de combat — 13 contrôles |
| `navigateur/vesper_et_ael.js` | **Vesper (le Pacte, comme Arlecchino ; les trois Styles) et Aël (Lecture, Miracle, Contrat, Portes)**, chaque règle avec sa contre-épreuve — 42 contrôles |
| `navigateur/lequipe_a_chaque_niveau.js` | **l'équipe complète, en combat, à 13 niveaux** : ~420 combats joués dans le moteur, vraies troupes, vraie IA, phases de boss — écrit `mesures_equipe.json` *(une mesure, pas un contrôle)* |
| `navigateur/analyser_equipe.js` | **lit ces mesures** : tours pour gagner, victoires, dégâts reçus par tour, qui joue en premier — et le multiplicateur qui amènerait chaque rang sur sa cible |

## `navigateur/lequipe_a_chaque_niveau.js` — le banc qui jouait mal et faisait dire n'importe quoi

Il ne lit aucune formule : il **joue**. Et quatre fois, c'est sa façon de jouer qui mentait, pas le jeu.

| Ce que le banc faisait | Ce qu'il en concluait | Ce qui était vrai |
|---|---|---|
| Aël ne lançait que ses Portes | « Aël fait 0 à 200 dégâts par action » | elle a un vrai kit de Paroles : **3 800 à 10 000** |
| les pages de troupe n'étaient pas jouées | « Le Compteur est imbattable en 40 tours » | sans ses phases, il n'avait pas de PHASE II : **battu en 17 tours** |
| il lançait le coup le plus fort, point | « au niveau 1, l'équipe perd contre un rang D » | les héros **se tuaient eux-mêmes** : recul, Renvoi, Reflet, Parole brisée |
| il visait un Miroir avec de la magie | idem | le 🪞 Reflet est affiché : un joueur frappe ailleurs |

Il joue donc maintenant comme un joueur **raisonnable, pas parfait** : pas de magie sur une cible
en Reflet, pas une Parole que l'aide du menu dit risquée (tenue < 50 %), pas un coup qui laisse le
lanceur sous 30 % de ses PV, pas une cible dont « le Renvoi est prêt ».

```bash
TROUPES=16 node bancs/navigateur/lequipe_a_chaque_niveau.js        # la mesure (≈ 2 min)
node bancs/navigateur/analyser_equipe.js                           # la lecture
MULT="D:3.5,1.4;A:1.8,1" node bancs/navigateur/lequipe_a_chaque_niveau.js   # essayer un réglage
DIAG=552,80 node bancs/navigateur/lequipe_a_chaque_niveau.js       # un combat, coup par coup
SONDE=4,45,579 node bancs/navigateur/lequipe_a_chaque_niveau.js    # le kit d'un héros, trié
```

> Les boss restent **bruyants** : avec la même configuration, le niveau 60 a donné 2 victoires sur 8,
> puis 5 sur 8. Un chiffre de boss se lit sur plusieurs passages, jamais sur un seul.

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

## `navigateur/les_livres.js` — le plantage qu'on a livré pour n'avoir ouvert qu'un écran

`EnemyBook` et `ItemBook` ont été branchés le même jour. Le Bestiaire a été ouvert dans le
moteur et vérifié. L'Encyclopédie, non — elle plantait à l'ouverture :

```
TypeError: Cannot read property 'name' of null
at Window_ItemBookIndex.refresh (ItemBook.js:274)
```

**Et la cause est invisible dans `data/`.** Les quatre fichiers sont pleins : 2 000 objets,
560 armes, 290 armures, **zéro trou**. Mais `YEP_ItemCore` rallonge ces tableaux **au
démarrage** avec un réservoir d'emplacements **nuls** pour ses objets indépendants — mesuré
dans le moteur : les armes passent de 560 à **3 008 dont 2 440 nuls**, les armures de 290 à
**3 008 dont 2 710**. Les trois boucles de `refresh()` lisaient `.name` sans vérifier l'entrée.

> Un écran ne se vérifie pas en lisant les données : il se vérifie en l'**ouvrant**. Et quand
> deux écrans se ressemblent, on ouvre **les deux** — c'est exactement l'erreur qui a coûté ce
> plantage.

Contre-épreuve faite : la garde retirée, le banc rend 4 échecs et cite l'erreur mot pour mot.

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


## Le message qui tuait un village

Le 2026-09-24, JOKO a retiré le système des Dons Spirituels et gardé l'Avatar de
Korrah. Allumer `AvatarSpirituel.js` a fait tomber `une_journee_au_village.js` :
**0 PNJ pris en charge** au Village de Pêche, là où il y en avait douze.

Aucune erreur JavaScript. Aucun plantage. Le village était simplement mort.

La cause tient en une ligne de repli :

```js
if (w) { w.push('addText', txt); }              // le journal de combat
else if ($gameMessage && !$gameMessage.isBusy()) $gameMessage.add(txt);   // ← ici
```

Hors combat, il n'y a pas de journal — alors le greffon écrivait dans
`$gameMessage`. Sur la carte, une boîte de dialogue ouverte par du code n'est
pilotée par **aucun interpréteur** : personne ne la referme. `isBusy()` reste
vrai pour toujours. Et `VieDuVillage` teste précisément `$gameMessage.isBusy()`
avant de recenser ses PNJ.

Un message de combat, posé sur la carte, avait gelé tout ce qui attendait un
message libre.

**Ce que ça apprend.** Un greffon qu'on rallume n'est pas un greffon qu'on a
vérifié : celui-ci dormait depuis assez longtemps pour que son repli n'ait
jamais servi. Et surtout — *une panne sans erreur ne se voit qu'en jouant*. Le
seul contrôle qui l'a attrapée est celui qui compte les PNJ vivants sur une
vraie carte.

**Comment on l'a trouvée.** Pas en lisant le code : en bissectant. Quatre
bascules du registre, une à la fois, jusqu'à ce que le compte de PNJ remonte à
douze. Puis en mesurant `$gameMessage.isBusy()` sur la carte au lieu de le
supposer. Le texte en attente disait le reste :

```
textes en attente : 1  ["\\C[23]✦ Korrah rouvre les yeux — l'Armure Volante est là."]
```


## `occasion: 3` — la compétence que personne ne peut jouer

seiryu est devenu un vrai combattant le 2026-09-24. Au premier essai, il a
choisi **« Attaque »** — le coup de base — alors qu'il connaissait treize
techniques et qu'il avait 970 PM.

Le banc ne s'est pas contenté de constater : il a demandé à MV, ligne par ligne,
pourquoi chacune lui était refusée.

```
#1253 Déferlante d'Unisson   apprise=true  canUse=false  occasion=3  coût=true
```

`occasion: 3` veut dire **jamais jouable** — ni au menu, ni au combat. C'était
juste tant que l'Avatar était forcé à travers Korrah : le greffon appelait
`Game_Action` directement et court-circuitait `canUse()`. Le jour où il a fallu
que le personnage **choisisse lui-même**, MV a repris ses droits et lui a tout
refusé.

Trois d'entre elles avaient en plus `stypeId: 0`, le type que rien n'ouvre —
apprises et invisibles, le piège du §7.

**Ce que ça apprend.** Une donnée n'est pas juste ou fausse dans l'absolu : elle
est juste *pour un mécanisme donné*. Changer le mécanisme peut retourner sa
validité sans que rien ne bouge dans le fichier. Et surtout : quand un
personnage fait quelque chose d'inattendu, on ne relit pas le code — on demande
au moteur ce qu'il a refusé, et pourquoi.

---

## La chasse aux bugs (2026-10-02)

| Banc | Ce qu'il vérifie |
|---|---|
| `23_chasse_aux_bugs.js` | toutes les données, sans lancer le jeu : fichiers introuvables (y compris dans les commandes de plugin, les paramètres « fichier », les indicateurs MOG et les noms écrits en dur dans le code des plugins), scripts et formules qui ne compilent pas, références vers rien, commandes de plugin que personne ne lit, transferts sur une case d'où l'on ne peut plus bouger |
| `navigateur/la_chasse_aux_bugs.js` | le vrai moteur : chaque carte chargée et jouée 3 s, chaque page d'événement et chaque événement commun exécuté (premier et dernier choix), chaque troupe combattue en automatique. `cartes`, `pages`, `combats`, `--cartes-de / --cartes-a`, `--de / --a` |

Ce qu'ils ont trouvé et qui est corrigé : la neige `Snow_01A` (événement commun 229), le jingle `Recovery` du Feu d'Âme (EvenementsUtiles), le contre de Mahoraga qui faisait planter le combat suivant, le son vide préchargé par Irina (troupe 24), deux recettes d'atelier.
