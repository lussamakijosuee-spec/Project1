# Règles de travail sur ce projet

Projet RPG Maker MV, en français. L'univers, les personnages, les compétences et l'équilibrage
appartiennent à **JOKO**. Claude est là pour exécuter et vérifier, pas pour concevoir.

**Ce jeu est personnel.** JOKO, le 2026-09-25 : *« mon jeu n'est pas pour le grand public […] il est
totalement personnel et pour mes potes, je ne cherche pas à faire ça à une commerciale — retiens ça. »*
Les références aux mangas et animés sont donc bienvenues comme inspiration de gameplay ; on ne
calibre pas pour un public, on calibre pour que ce soit fun entre amis.

**Un jeu entre potes, ni compliqué ni sombre.** JOKO, le 2026-10-14 : *« non plus de lore
complètement en gros mon jeu sera plus un jeu pour pote entre potes si possible mais pas un truc
compliqué ou sombre complètement juste une explication du mana comme le premier on garde mais les
don et couverture on enlève »*. Le lore se réduit à **l'explication du mana** (`docs/CANON_LA_GENESE.md`
— les trois sources, le Premier — et `docs/SYSTEME_DE_MANA.md`). Les **Dons Spirituels** et la
**couverture** sont retirés. Le reste des documents de lore est une archive, plus une contrainte
(`docs/INDEX.md`, « Le statut du lore »).

**Depuis le 2026-10-24, le monde, c'est la Bible de JOKO** : `docs/Les-Trois-Sources-la-Bible.docx`
(« Version de référence », *« en cas de contradiction, c'est lui qui fait foi »*). Il a choisi *« Ton socle, mes
systèmes dedans »* : son monde reste, et ce qui est dans le jeu y est entré. Son monde, c'est un seul Livre,
Anésidora, les failles, les trois Chapitres, l'Académie Rubis et sept royaumes. Ce qui est entré, c'est le
triangle de sa Genèse (celui du jeu), les trois arts au combat et les pages des héros. Les dons et les
manifestations y reviennent comme lore. Ses règles de jeu ne s'appliquent pas toutes seules (§2) : le prix
de l'excès, les jauges des manifestations, « tuer ne fait pas monter de niveau » — je les propose, JOKO décide
(il a dit non pour l'instant) ; **une seule affinité** est entrée le 2026-10-24 (« Les affinités », plus bas).
Le lore se cite toujours (§1), désormais dans la Bible.

**Quand JOKO dit « fais », il veut que je fasse — pas que je devine.** *« je suis un peu trop vague
dans mes propos […] je veux que tu fasses, pas que tu devines. »* Ce qu'il écrit noir sur blanc
s'exécute ; ce qu'il ne précise pas (un chiffre, une durée) devient un **paramètre réglable**, avec
un défaut raisonnable annoncé — pas une question qui bloque. Et s'il demande d'être honnête sur
la puissance : *« soit honnête si c'est trop fort, nerf »* — je mesure, je le dis, je règle.

---

## 1. Le lore ne s'interprète pas. Il se cite.

Deux fois dans ce projet, j'ai inventé du lore en croyant le compléter :

- la « **Manifestation** » — une arme spirituelle donnée en plus de leur Objet ou de leur Avatar à
  trois héros sur quatre. La règle est : **un seul Don par personne**. Je l'avais lue, et j'ai
  quand même construit le contraire ;
- « **famille / familier** » compris comme une créature de compagnie, alors que le texte disait
  explicitement *« système de stand dans JoJo ou Rika dans JJK »*. C'est un **Avatar Spirituel**.

**La règle qui en découle :**

> Si une mécanique n'est **pas écrite noir sur blanc** par JOKO, elle ne s'implémente pas sans
> demander. Une lacune dans le lore n'est pas une invitation à la combler.

Avant d'écrire une ligne qui touche à l'univers, je dois pouvoir **citer la phrase de JOKO** qui la
justifie. Si je ne peux pas la citer, je pose la question — même si ça coupe l'élan, même si la
réponse me paraît évidente.

Depuis le 2026-10-14, l'univers lui-même est réduit : je n'**ajoute** pas de lore, et rien de
sombre ni de compliqué. Les trois Codex et leurs chapitres sont gardés ; ce qui reste à trancher
(la Parole et ses cristaux) est listé dans `docs/INDEX.md`. Les habitants ne parlent plus de Dons
(fiches `bancs/outils/habitants/`, réécrites le 2026-10-14).

Et quand une phrase est ambiguë (« il a 3 niveaux » : trois paliers ou trois états ?), **je ne
tranche pas tout seul**. Je demande, ou j'expose les deux lectures.

---

## 2. On ne touche que ce qui est demandé

Un mot bref (« corrige », « ajoute ») **ne donne pas mandat pour un chantier**. Sur un simple
« corrige », j'ai un jour injecté **244 compétences** dans les quatre classes montées à la main par
JOKO, déplacé des niveaux d'apprentissage et réécrit des coûts en mana. Il a fallu tout annuler.

**Avant toute modification en masse, je propose et j'attends.** Est une modification en masse :

- toucher à **plus de 10 entrées** de `data/*.json` en une fois ;
- modifier les **apprentissages**, les **niveaux**, les **coûts** ou les **formules** de compétences
  que JOKO a réglés lui-même ;
- ouvrir, fermer ou réattribuer un **type de compétence**, une **classe**, un **trait de classe** ;
- renommer quoi que ce soit qui apparaît **à l'écran**.

Le fait qu'un défaut soit réel et mesuré ne suffit pas : **je le signale, JOKO décide.**

---

## 3. On ne supprime rien

Consigne permanente de JOKO : *« corriger de tout, juste sup rien mais rajoute améliore »*.

Rien ne se supprime — ni une compétence, ni un équipement, ni un ennemi, ni une entrée
d'apprentissage, **même en double, même sans effet**. Ce qui est mauvais se **corrige** ou se
**contourne** ; ce qui est en trop se **laisse**.

Une pièce qui n'a plus sa place dans un système est **renommée et redécrite**, jamais retirée.

---

## 4. Ce qu'on ne touche jamais sans instruction explicite

| | |
|---|---|
| **Classe 5 « familié »** | seiryu, le personnage-Stand de JOKO. Sa classe (statistiques, apprentissages) ne se touche pas. Son comportement est dans `SeiryuLeFamilier.js` : depuis le 2026-10-14, tombé sous un coup il disparaît 2 tours, et **sans lui Korrah perd l'Hiver** (types 6 et 21) — `bancs/navigateur/seiryu_et_lhiver.js`. |
| **Les ennemis** | JOKO a dit de les laisser hors des passes d'équilibrage joueur. |
| **Les sprites, les images et les sons** | je n'ajoute **jamais** d'asset externe de moi-même. Le 2026-10-04, JOKO a installé lui-même ~5 600 ressources d'internet (préfixe `Z_Net_`, dans `img/` et `audio/`) : elles sont à lui, et leurs licences sont dans `ressources_internet/INSTALLES.md` et `INSTALLES_SONS.md` — les CC-BY demandent l'auteur dans les crédits. |
| **Les formules « à caractère »** | pourcentage de PV max, aléatoire, dépendant d'une variable : c'est l'identité d'une compétence, pas son équilibre. |
| **Les cartes et les événements** | on n'y pose rien. Le level design appartient à JOKO. |

---

## 5. Le jeu d'abord, les rapports ensuite

Ce projet a plus de documentation que nécessaire. Un rapport ne remplace pas une correction, et
**personne ne joue à un fichier Markdown**.

- Un rapport se justifie quand il **restitue une mesure** que JOKO ne peut pas faire à la main.
- Sinon, la réponse tient dans le message de chat.
- Le message de commit dit ce qui change ; il n'a pas besoin d'un document jumeau.

---

## 6. Vérifier pour de vrai

Les bancs d'essai sont dans **`bancs/`** (voir `bancs/LISEZ-MOI.md`). Ils se lancent avec Node
depuis la racine : `node bancs/4_un_seul_don.js`.

Trois bugs sont passés à travers des tests écrits trop vite :

1. une passe de rééquilibrage **écrite en Python** ignorait en silence toute formule contenant
   `b.def` — `def` est un mot-clé Python. **Toutes** les compétences physiques avaient été sautées.
   → Les bancs sont en **JavaScript**, comme le moteur ;
2. `ChasseAuxPrimes` plantait à l'ouverture parce que le test tournait contre un
   `Window_Selectable` nu, sans les surcharges de `MOG_Scrollbar`, `MOG_CursorBorder` et
   `YEP_X_BattleSysCTB` qui appellent `select()` pendant l'initialisation ;
3. un contrôle cherchait la chaîne `b.mhp` dans le **texte** des formules et accusait à tort deux
   compétences qui s'en servent comme condition d'achèvement. → On mesure le **symptôme**, pas le
   motif, et on vérifie **dans les deux sens** : le contrôle doit attraper le vrai coupable *et*
   innocenter les faux.

> Un banc simule le moteur assez fidèlement pour attraper le bug, ou il ne sert à rien.

**Après toute modification de `data/`, les bancs doivent passer** avant de committer.

---

## 7. Repères techniques

**Équipement** (`etypeId`) — 1 Arme · 2 Bouclier · 3 Tête · 4 Corps · **5 Accessoire** ·
6 talisement · **7 Ame**

**Les Dons Spirituels sont retirés** — du jeu le 2026-09-24 (`DonsSpirituels`, `ObjetSpirituel`,
`TraitsAme` éteints, fichiers gardés), du lore le 2026-10-14. Les 16 pièces restent dans la base,
redécrites en équipement ordinaire. Gardé : **seiryu**, l'Avatar de Korrah (acteur 6, classe 5),
cinquième combattant.

| Héros | Sa branche | Ce qui la porte |
|---|---|---|
| Vesper | trois Styles, trois kits — **Lame** (arts d'armes selon l'arme tenue, État de Flow), **Sang** (le Pacte façon Arlecchino, Berserker), **Garde** (adaptation, Arme de Sang) — et sa **Colère** (la Vanne de ludwing) | `LePacteDeSang.js`, `LesStylesDeVesper.js` |
| Korrah | hiver *(type 6)* + avatar *(type 21)* — **seulement tant que seiryu est là** ; deux corps : l'Hiver **confie son froid à seiryu**, et **Change** prend la place d'un allié | `SeiryuLeFamilier.js`, `LeFroidConfie.js` |
| ludwing | l'âme et l'ombre — Royaume Impérial ; le stratège : les âmes sont sa **monnaie** (Registre) | `PorteurDAmes.js`, `RoyaumeImperial.js`, `LeRegistre.js` |
| Aël | le **livre** : chaque petite Parole écrit une page ; livre plein, son ultime est **lue** (tout de suite, sans son prix) ; le **Miracle** n'arrive que par l'histoire (interrupteur 27) | `LaBibliothequeDAel.js`, `CielDAel.js` |

**Les interactions** (`LesInteractions.js`, 2026-10-14) : une compétence lancée sur un allié le fait
réagir. JOKO a choisi *« A2, B1, 2, 3, 4 ET C1 »* : des compétences prévues pour ça, toutes les
réactions, et **c'est lui qui remplit le tableau** dans le gestionnaire de plugins. Je n'y écris pas
de répliques ni de réactions sans lui — ce sont ses personnages.

**Les voix de la Bible** (2026-10-30 ; JOKO : *« pnj si en gros inspire toi des oc et créé en avec le lore fournir de la bible dans le jeu mais reste logique »*, et ses PNJ parlent *« pas plugin mais événements »*) : 14 habitants par l'outil des habitants, lot `bancs/outils/habitants/les_voix_de_la_bible.js` — les 11 muets (les sept « cliant » au chapeau rose, Actor3 n° 5, sont les **sœurs Brémont** : Odile, Sidonie, Prune au magasin d'armures, Agathe, Rosalie, Capucine au magasin d'objets, Bérénice à l'auberge ; Léonie la messagère et Ysaline de l'Académie Rubis à l'auberge ; Anselme et Bastien, gardes de la Forêt) et 3 nouveaux venus (Mathurin le crieur, Ville 29 év. 53 ; Fanchon, recruteuse de la Veilleuse, Marché 30 év. 26 ; Gustave, Essayeur de la Confrérie, Village de Pêche 33 év. 43). Ce qu'ils disent vient de la Bible (l'Admission, la Chancellerie, les guildes, la Confrérie, les cristaux, Rubis, le Héros) ; pas de prix (le jeu compte en G) ; depuis le 2026-10-30, on sait où l'on est (« La situation », plus bas). L'outil : `--seulement <lot>` ne pose que ce lot (les autres pages, que JOKO a pu retoucher, ne sont pas réécrites) ; une fiche `muet: true` remplit une page vide ; une carte retirée se saute ; depuis le 2026-11-01 (« FGFG », où JOKO a repris des numéros pour d'autres PNJ), un événement qui n'est plus la même personne (le nom de sa ligne « ◆ FICHE » / « ◆ HABITANT », ou de l'événement pour une page vide) n'est pas réécrit, et une scène « 🏘 » qui nomme un absent n'est pas posée (une ligne d'un « si » qui le nomme tombe seule). Banc : `une_journee_en_ville` (984 conversations, la Forêt comprise).

**La situation** (2026-10-30 ; JOKO : *« Sa se passe dans le royaume de Aurevel dans les campagnes avec une faille a côté, (c'est la zone grotte modifier que j'ai fait) utilise le lore pour la situation »*). La faille est dans la **Caverne de Pierre** (28, où le jeu commence) : de la grotte, le Marécage (49), la Forêt (31), puis la Ville Forestière (29), le Marché (30), le Village de Pêche (33), le plus loin. Ce qu'en disent les habitants vient de la Bible, rien de plus : Aurevel (*« terres agricoles fertiles »*, *« très patrouillée »*, *« il exploite tout ce qu'il peut, encadré par la loi »*, Lothaire après la famine de Thibaut, la capitale Haute-Taville, loin), la faille (*« elle peut s'ouvrir dans […] une grotte »*, *« ce qui se trouve derrière n'a rien à voir avec la taille de l'entrée »*), le permis de la Chancellerie, les points de retour, les deux règles de la Chute *« que chaque garde apprend par cœur »*, ce qu'on en rapporte, l'imprégnation de *« ceux qui vivent près d'une faille »*, les Égarés, la garde royale qui forme les élèves. **Ni le niveau, ni le rang de la faille, ni d'où vient le héros** : à JOKO. Les lignes sont dans `bancs/outils/habitants/situation/aurevel_et_la_faille.js` : elles **s'ajoutent** aux fiches (« Quoi de neuf ? »), 60 habitants ; Solange et Annick ne disent plus qu'il n'y a pas de faille (la faille est à l'autre bout de la région, *« ça dépend du vent »*). Scènes « 🏘 » : la porte nord compte ceux de la grotte, Mathurin crie l'avis de la Chancellerie, les gardes de la route et le vent, Edwin et le mana qui n'est pas d'ici. Banc : `les_personnages` ⑬ (la situation dans les pages, personne ne la nie, une phrase qui la nie, plantée exprès, est attrapée).

**La vie du village, comme Stardew Valley** (2026-10-30 ; JOKO : *« H1,h2,h3,h4,h5,h6,h7 fait tout en vrai […] avant tout ça lis déjà les personnages […] et les commentaires »*, puis *« il quitte pas la carte. Il marche »*, *« aller dans la porte, sortir dehors, aller vers leur maison quand c'est l'heure »*, *« les gardes aller au bar à une certaine heure. Et après sortir dehors quand c'est soir pour aller surveiller. Ou certains gardes qui vont juste surveiller dans toute la vie »*, *« ultra immersive comme dans Stardew Valley »*, *« je préfère largement que ce soit un événement que ce soit un plugin […] je parle des interactions »*, *« des événements extrêmement longs, c'est pas vraiment grave »*). **Ses commentaires font foi** : Hilde (29:28) tient l'épicerie le matin et Kaze (29:40, son mari) l'après-midi — l'épicerie (43:3) a deux pages, Hilde, et Kaze dès 13 h (variable 200, l'heure ; sa page 2 était vide, sous son commentaire « kaze ») ; Élise et Tomas sont leurs enfants ; « maison de hilde » est l'épicerie, « maison de Mado » la Maison 1, « maison du vétéran », « fernand maison », « gaston » (33:11), « caserne de soldat » (la Maison de Village du Marché, cartes 39-40). Colette, jeck, Emma Fieldensong (33:18, l'ancienne Maëlle), Edwin Bramble (33:22, l'ancien Yvon, fils d'Annick) et Sora sont réécrits d'après ses personnalités ; le poisson d'Yvon passe chez Annick. **L'outil des habitants garde ce que JOKO écrit** : l'en-tête d'une page posée (« ◆ HABITANT · … » et ses notes) reste ligne pour ligne, ses commentaires ajoutés aussi ; `--ecarts` montre ce qui a été retouché à la main, `--fiches 29:28,43:3` ne pose que ces fiches. **Le déplacement est un plugin** (on ne traverse pas une carte en événements) : `AlleesEtVenues.js` (nouveau) — `<Va: 18-21 46>`, `<Va: 5-13 33 7,38 bas peche>`, `<Va: 6-18 49 1/3 2j>`, `<Logis: 29 15,14>` (sa maison, même ailleurs : hors de son `<Horaire:>`), `<Logis: 45 3,10>` (une chambre de l'auberge) ; une porte sans intérieur est une maison ; deux séjours qui se suivent s'enchaînent (le bar puis la caserne) ; sur chaque carte traversée, une **copie** marche de l'entrée à la sortie (elle n'est jamais sauvegardée, elle parle avec les répliques et la mémoire de l'original) ; `<Est: 29:28>` sur une page : c'est déjà lui, pas de copie. `VieDuVillage` v2.0 : tout habitant « ◆ HABITANT » vit (pas les « ✎ », ni un déplacement « Personnalisé » de JOKO) ; dedans (41-46), le marchand bouge derrière son comptoir et revient quand on approche, les clients vont au comptoir et prennent l'air (`lieux`) ; il se tourne vers toi, s'écarte quand tu le pousses, « ! » sur qui a une quête, on court sous la pluie ; `<Ronde: x,y ; …>` ; le dimanche est enfin le jour de repos (v1 comparait `day_week()` à 0, jamais vrai). Les gardes : portes de jour (Brunehaut, Rolf) → bar 18-21 → caserne ; de nuit (Oswin, Konrad) → caserne → bar 13-17 → porte ; Merle et Casimir patrouillent la ville puis boivent ; Mathis, Béran, Anselme et Bastien veillent toujours. **Les interactions sont des événements** : `bancs/outils/poser_les_scenes.js` (lots `bancs/outils/scenes/`) pose un événement « 🏘 La vie — … » par carte (processus parallèle, 74 scènes), en commandes ordinaires (déplacement, bulle, message GALV `<c:…>`, son) ; `VIE arreter/reprendre/tourner/bulle/dire` et `VieDuVillage.ensemble(…)` aident ; un « 🏘 » sans sa ligne « ◆ SCÈNES » est à JOKO et ne se réécrit plus. `Habitants` v1.3 : une quête finie, un boss battu se racontent une fois par habitant (`phrasesQuete`, `phrasesBoss`) ; l'**affinité** monte d'un par jour où l'on se parle et ouvre les confidences (moteur : `perso` sur l'affinité) ; « jours depuis » comptait les jours du mois ; l'**Admission** (7 premiers jours de chaque saison, la Bible) amène quatre recrues (Noé, Ilda, Aubin, Clémence, 29:55-58, `<Admission>`) ; la **Veillée du Retour** est un réglage (`veillee` 9/30, la Bible ne donne pas la date) : on veille sur la place jusqu'à 2 h. Sauvegarder ne garde aucune copie, et une partie chargée recense de nouveau ses PNJ (avant, VieDuVillage pilotait des copies relues de la sauvegarde : plus personne ne bougeait après un chargement). Banc : `navigateur/une_journee_entiere.js` (27 contrôles).
**La marche** (`VieDuVillage` v2.1, `Habitants` v1.3, 2026-10-30 ; JOKO : *« le plus gros problème c'est la marche il font n'importe quoi presque »*). Mesuré : à 10 h en ville, **23 % des pas étaient des allers-retours** (la « flânerie » : arrivés, ils faisaient des pas au hasard ; Mathurin, qui ne quitte pas son réverbère, 13 pas en 40 s), la marche s'arrêtait entre deux cases (un pas toutes les six images), et bloqués ils faisaient un pas au hasard. Maintenant : arrivés, ils **ne bougent plus** (tournés comme JOKO les a posés, ou vers le milieu de la place ; de temps en temps ils tournent la tête) ; sur la place, **chacun sa case** (en couronne, espacées) ; le pas suit le pas ; **bloqués, ils attendent puis contournent** (un pas de côté, puis un détour, sans revenir sur leurs cinq dernières cases) ; le joueur dans une porte : ils **se faufilent** à côté de lui ; sous les yeux du joueur, personne ne **saute** jusqu'à sa place (plus de téléportation à l'écran) ; à l'arrivée sur une carte, chacun est **déjà où sa journée le met** ; un garde posé par JOKO dans un pilier de porte en sort d'un pas quand il doit partir, et reste sur sa case sinon. Le soir seulement, sur la place, il leur arrive de changer de case (`flanerie`, quelques cases). Mesure : **0 à 2 % d'allers-retours**, Mathurin 0 pas. Aucun `moveRandom` ne reste dans VieDuVillage ni Habitants. **La vitesse** (`VieDuVillage` v2.2, `Habitants` v1.4, 2026-10-31 ; JOKO : *« D'ailleurs pourquoi il sont rapide quand il marche ? »*) : les deux plugins forçaient **4** (le pas du joueur, 16 images par case) et 5 sous la pluie, par-dessus la vitesse de l'éditeur — JOKO avait mis Béran, Pépin, Mathurin et Clémence à 2 sans effet. Maintenant, c'est **la vitesse de sa page** (3 par défaut, deux fois plus lent que le joueur : 32 images par case ; Élise 6, Tomas 5, Tobias 6), un cran de plus sous l'averse (pas les gardes ni les marchands), et un marchand derrière son comptoir à 3 au moins (à 1, deux secondes par case pour revenir à sa place). La **fréquence** de l'éditeur n'est pas lue en marchant : dans MV, c'est la pause entre deux mouvements automatiques (à 3, une seconde à chaque case — la marche saccadée d'avant). Le 2026-10-31, une sauvegarde de l'éditeur resté ouvert sur une vieille carte 29 (« GY ») avait remis 14 pages à l'ancienne, ôté les 4 nouveaux et 9 scènes : remis, ses réglages gardés (vitesses, fréquences, places, l'image de Mathurin, les notes des recrues, le départ en Forêt). Banc : `navigateur/la_marche.js` (9 contrôles, avec les contre-épreuves : un PNJ qu'on fait piétiner exprès est attrapé ; un passant mis à 2 marche à 2).
**Les personnages, comme des OC** (`Habitants` v1.4, 2026-10-30 ; JOKO : *« Développe les personnages vrai personalite mais dit se que tu va faire avant d'ailleurs personnages du lore mais nouveau inspiré du lore »*, puis, sur la proposition P1-P6 / N1-N8 : *« Comme des oc »* — lu : des personnages **inventés**, avec une vraie fiche, et le plan entier aux réglages annoncés). Les fiches sont dans `bancs/outils/habitants/oc/` (une entrée « carte:événement », « /2 » pour une page 2 ; une page `<Est: 29:28>` reçoit celle de 29:28), et l'outil les ajoute aux fiches des lots. **P1** la fiche OC (âge, allure, caractère, aime, déteste, rêve, secret, peur, manies, sa phrase, ses liens), écrite en tête de sa page (« ◆ FICHE · … », après « Généré par » : elle suit la fiche) ; **P2** ce qu'il dit selon où il est (`Habitants.ici` : travail, place, bar, repos, ailleurs — en visite —, nuit) ; **P3** ce qu'il dit des autres (dans « Discuter », une fois sur trois ; « à côté » quand l'autre est à 5 cases), et **les liens se répondent** (si A parle de B, B parle de A) ; **P4** le ton change aux paliers 3, 6, 10 (le « tu », puis `\P[1]`), et trois **scènes d'amitié** : au palier, il donne un rendez-vous (une carte, des heures où sa journée l'y met), et c'est là, quand on lui parle, que la scène se joue, une fois (des répliques, des bulles, un choix, +1) ; **P5** « Offrir… » (la commande « Sélection d'objet », pas un plugin) : adoré +2, aimé +1, autre 0, détesté rendu sans rien perdre, un cadeau par jour (`cadeauAdore`, `cadeauAime`, `cadeauNeutre`, `affiniteScene`, variable 888) ; **P6** un anniversaire (« mois/jour »), le cadeau ce jour-là compte double, et Mathurin l'annonce. Un menu de plus de six choix range les derniers dans « Autre chose… ». La mémoire suit `<Est:>` : Hilde à l'épicerie est Hilde (avant, Hilde et Kaze partageaient la mémoire de 43:3). **Le premier cercle** (P1-P6, 20) : Hilde, Kaze, Élise, Tomas, Colette, jeck, Emma, Edwin, Sora, Mado, Fernand, Béran, Margot, le vieux, Mireille, Colin, Lise, Gaudry, Annick, Roul (Gaston, repris par JOKO, n'est pas touché). **Les nouveaux** (N1-N8, lot `les_nouveaux.js`, 9 événements créés vides le 2026-10-30, une phrase de la Bible chacun, des gens ordinaires — elle trouve ses 95 personnages nommés « beaucoup trop ») : **Barthélemy** le conteur (46:52, bar 19-24, la place 14-18 ; un conte par soir, la Genèse : les trois sources, le triangle, le cercle et le livre, les quatre jours, les trois arts, la Veillée), **Petit-Louis** (29:59, petit-fils d'Hector et Maude ; son jeu de mains « Corps, Âme, Esprit » suit le triangle : le Corps bat l'Âme, l'Âme l'Esprit, l'Esprit le Corps), **Anouk** et **Timothée** (29:60, 30:28, la patrouille d'élèves de Rubis, la taxe des dégâts), **Évariste** l'alchimiste retraité (29:61, « Essence et Braise »), **Pervenche** les encres (30:29, les parchemins jumeaux), **Ninon** coursière de la Bourse (30:30, de carte en carte), **Solange** (33:45, « c'est pas moi, c'est la faille » : trois humeurs selon le jour), **Zéphyrin** le marchand de la Veillée (29:62, `<Veillee>` : là seulement cette nuit-là). **Les autres** (P1-P3, 71, `oc/les_autres_*.js`) : fiche, lieux, avis, et deux confidences pour les 16 qui n'en avaient pas ; pas touchés : l'aubergiste de JOKO, les gardes du manoir, la foule des soirs de fête. Scènes « 🏘 » ajoutées : le conte du soir, le conteur et le barde, Corps-Âme-Esprit, Anouk, Évariste, la caisse de Timothée, Pervenche et Ninon, Solange et Edwin. Le nom d'un habitant (pour « à côté ») se lit sur la ligne « ◆ FICHE · Nom », puis sur « ◆ HABITANT · Nom » : JOKO a réécrit certains en-têtes (« Hugo » pour jeck, « Yvon » pour Edwin, « Emma Fieldensong est une… », « hilde »), on ne touche pas à son texte. Un rendez-vous se place là où **sa journée** le met (mesuré : à 21 h Hilde et Annick sont rentrées, à midi Ninon livre au Village de Pêche, un soir sur trois Colette y est) ; Colin n'a sa fiche que sur sa page 2 (auto-interrupteur A), donc ses scènes attendent qu'elle s'allume. Banc : `navigateur/les_personnages.js` (19 contrôles : les fiches posées, les liens qui se répondent et un lien coupé exprès attrapé, la promesse sans rappel dans la même phrase, puis la scène, une seule fois, la même Hilde, les cadeaux, l'anniversaire, le crieur, le triangle à l'endroit et une phrase à l'envers attrapée, la Veillée, toutes les pages jusqu'au bout, et chaque rendez-vous tenable — la personne est là, visible, à l'heure dite).

**Le choix du héros** (`DebutMarques.js` v1.1, 2026-10-17) : il s'ouvre **dès la nouvelle partie**
(JOKO), les trois autres reviennent par les rencontres « Rencontre — héros N » (événements communs
201-204), et le texte de présentation est **à JOKO** (il le réécrit). Sous Playwright
(`navigator.webdriver`), il ne s'ouvre pas tout seul : les bancs partent de l'équipe complète ; un
banc qui veut le tester pose `$gameSystem._debutAFaire = true`.

**Le Studio** (`studio/`, lancé par `STUDIO.bat`, 2026-10-17) : les outils de JOKO dans le
navigateur, servis par `studio/serveur.js` (Node, sans dépendance) sur http://localhost:8765.
**Cinématiques** : une scène = un événement commun **601-699** nommé « 🎬 nom » (séparateur 600),
sa source dans `studio/scenes/<id>.json` ; aperçu dans le vrai jeu (iframe, sans rien écrire) ;
écriture refusée tant que `RPGMV.exe` tourne, copie de `CommonEvents.json` avant chaque écriture
(Documents\RPG Maker\Sauvegardes du Studio). **Ressources** : `img/` + `audio/` du jeu et
Documents\RPG Maker, « jamais cité » par le nom, copie dans le jeu sans jamais écraser. Les scènes
de `studio/scenes/` sont à JOKO : je n'en écris pas sans lui. **Planche d'expressions**
(`/planche`, 2026-10-19) : jusqu'à 8 visages 144×144 du générateur, assemblés dans le navigateur
en une planche MV 576×288 (une autre taille est refusée, jamais redimensionnée), écrite dans
`img/faces` sous le nom choisi — jamais par-dessus un fichier (un autre nom est proposé), jamais
tant que `RPGMV.exe` tourne (`STUDIO_EDITEUR` change le programme cherché, pour les bancs). Banc :
`navigateur/la_planche_dexpressions.js`.

**Le bouclier et la brisure** (`AstfglSCB.js`, 2026-10-18) : le Shield and Break d'Astfgl (façon
Octopath), **copie corrigée** pour le jeu — l'original est gardé dans Documents\RPG Maker\3 Systèmes
et plugins\Plugins du forum ; chaque correction est marquée `[JOKO]`. Un ennemi n'a de bouclier
**que** s'il a `<mSh: …>` ou si la règle par rang lui en donne un : sans ça, le plugin ne le touche
pas et son nom s'affiche comme avec Yanfly. Réglages de JOKO (2026-10-18) : *« boucliers par rang
(D 2, C 3, B 4, A 5, S 6, boss 8), l'état Brisé (perd son tour, +50 % de dégâts), l'affichage avec
icônes »* — paramètres `boucliersParRang` (boss = la règle d'EquilibreDesCombats, sans rang = aucun
bouclier) et `degatsBrise` 1.5 ; l'état **1005 « 💥 Brisé »** (immobilise, 1 tour, ne part ni aux
coups ni à l'immobilisation). **Aucune fiche d'ennemi n'est modifiée.** Crédits exigés : Astfgl
(Pierre MATEO) et Yanfly. Banc : `navigateur/le_bouclier_et_la_brise.js`.

**Les attaques combinées** (DoubleX Unison Item, 2026-10-18 : `DoubleX RMMV Unison Item Config
v103a.js`, `… Default v100g.js`, `… YEP_X_BattleSysCTB v100c.js`) : copies corrigées, originaux dans
Documents\RPG Maker\3 Systèmes et plugins\Plugins du forum, corrections `[JOKO]`. Une compétence
devient combinée avec `<unison item actors: 1, 2>` ; coûts `<unison item actor mp cost: 10, 20>` ;
statistique empruntée **une à la fois** : `<unison item atk actors: 1, 2>` (moyenne, entière),
`<unison item mat actors: 4>` (la MAG d'Aël quel que soit le lanceur), règle `<unison item atk rule:
max>` — `<unison item param actors>` mélange les huit. **Le jeu se bat en tour par tour** (`dtb`,
YEP_X_BattleSysCTB est chargé mais inactif) : le lanceur doit être **avant** son partenaire dans
l'équipe, et l'action du partenaire est prise pour le tour. En CTB (`setBattleSys CTB`), le
partenaire doit jouer juste après, ou `<async unison item>`. Le combat automatique (donc seiryu) ne
la choisit jamais ; `<Instantané>` (CombatTactique) redonne toujours la main. Le journal affiche
le **nom** de la compétence, comme pour toutes (YEP « Show Action Text » coupé). Crédits : DoubleX.
Banc : `navigateur/les_attaques_combinees.js`.

**Les six duos** (JOKO, 2026-10-18 : *« Oui, crée les 6 duos avec les réglages par défaut : menu
Combo, niveau 20, ×1,15, le premier des deux dans l'équipe lance. »*) : compétences **1303 à 1308**
(Lame de Givre, La Lame et son Ombre, Feu Attisé, Nuit d'Hiver, Ciel d'Orage, Crépuscule — noms
provisoires, à JOKO), type **25 « Combo »** ouvert sur les classes 1 à 4 (pas seiryu), apprises au
niveau 20 dans les deux classes (`<unison item actor learn: t, t>`). Puissance = somme des **coups de
référence** des deux héros (leur meilleur coup ordinaire, sans incantation ni recharge, de la même
portée) × 1,15 ; coût = ce que coûtent ces deux coups, chacun le sien. Deux éléments
(`<Multiple Elements>`, règle du jeu « Multiplier ») : −2 points de bouclier sur une double
faiblesse. Nuit d'Hiver et Crépuscule portent 2 tours de recharge (la règle de `18_recharges`).

**Les anciens duos attendent leurs héros** (`LesTroisArts` v1.4, 2026-11-02 ; JOKO : *« réglé les problèmes des note dans les
capacités ou les ennemis »*, puis sur la liste mesurée : *« Les trois »*). Fureur Spectrale, Verdict Stellaire, Aube Ardente, Trinité
d'Âmes, Communion des Quatre (413-418) portent `<Combo: 1,3>` ; ce qui les grisait sans leurs héros (`ComboLiens`, qui demande
`LiensSocial`) n'est pas dans le jeu : Vesper lançait un duo seule. Maintenant grisée tant que tous les héros listés ne sont pas au
combat et debout (hors combat : dans l'équipe), l'aide dit « ⚔ Il manque : ludwing » ; une `<Combo:>` sans numéros (les six duos de
DoubleX) n'est pas touchée. Les descriptions de 413 et 414 nomment leurs vrais héros (Vesper & ludwing, Korrah & Aël) ; trois
`<Mana:>` (36, ennemis 453 et 797) disent `negatif`. **Écartés après vérification** : les doctrines qui citent une compétence absente
de la liste d'actions (YEP les ajoute, `getPatternSkills`) ; `<Perce-Armure>` (les formules du Vide ne comptent déjà qu'une part de la
DÉF) ; `<FrappeAme>` (déjà un drain) ; `<AvatarGarde>` (l'état 208 est posé) ; `<NomOrigine>` et `<Nerf …>`, des mémos. **Laissés**,
à JOKO : les balises des héros tombés (401-425, `<DementTombe>`…) et `<TraitBoss:>`, lues par des plugins de `_ancien_projet`.
**Une capacité qui se charge le dit** (JOKO, *« Oui, affiche-le »*) : `<Charge: 14, 10, 5, Confiance>` (la variable, son maximum, le diviseur de la formule, le mot) — Yin et Yang du Mana (40) frappe ×(Confiance d'Aël ÷ 5) ; ses soins (21, 73, 104, 105) la montent, l'événement commun 14 la tient entre 1 et 10 quand l'interrupteur 1 est allumé ; l'aide dit « ✦ Confiance : 3/10 → ×0,6 ». Deuxième passe, rien de cassé : les 364 formules vues en jeu calculées par le vrai moteur (aucune ne plante), aucune capacité apprise invisible (les types manquants sont ouverts par un état ou une arme), aucune doctrine ni `<Instinct:>` / `<Voie:>` faux. Banc : `navigateur/les_duos_attendent_leurs_heros.js` (21 contrôles).

**Le froid confié** (`LeFroidConfie.js`, 2026-10-19, le rework de Korrah) : JOKO a choisi *« Piste 1,
le froid confié : Korrah joue deux corps avec seiryu, ses sorts d'Hiver chargent seiryu, et « change »
devient l'échange de place »*, puis *« Oui, écris tout comme listé »*. Chaque compétence d'Hiver confie
à seiryu **autant de froid que de PM payés** (jauge 0-100, état 243 et son compteur). Chacune de ses
actions en prend 25 : soins ×1,25 (JOKO : *« Baisse les soins chargés de seiryu à ×1,25 au lieu de
×1,5 »*), gardes +1 tour et **❄ Le froid mord** (246 : qui frappe le protégé
s'engourdit), coups de glace ×1,5 qui engourdissent — il reste un soutien, sous le plus petit Hiver de
Korrah. L'ordre **« Rends-le »** vide tout (dégâts × (1 + froid ÷ 50), Gelure dès 50). **Le Froid
Rendu** (800) coûte la jauge pleine + 100 PT, 0 PM (`<FroidConfie: 100>`). Tombé **chargé**, le froid
**revient sur elle** : Engourdissement, et dès 60 **❄ Saisie** (244) — un tour perdu, celui-ci si elle
n'a pas joué, sinon le suivant ; éteint avec elle, il se perd. **Change** (438) — son effet n'était
codé que dans `TraitsAme`, éteint — échange sa place avec l'allié (rendue en fin de combat), lui
reprend ce que **les ennemis** ont posé, et détourne sur elle les coups ennemis ciblés sur lui
pendant 3 tours (245). Tous les chiffres sont des réglages du gestionnaire. La classe 5 n'est pas
touchée. Banc : `navigateur/le_froid_confie.js`.

**Ses capacités** (`LeFroidConfie.js` v1.1, 2026-10-20) : JOKO veut des capacités de base *« beaucoup
plus intéressantes […] pas forcément bordélique »*, un héros à la fois, et a validé pour Korrah
*« seiryu suit le coup, +50 % sur l'engourdi, seiryu en profite aussi, Ralentir confie son froid,
Elle Prend Ta Place prend sa place »*. Cinq balises, sur dix fiches (noms, formules, coûts et
niveaux inchangés) : `<SeiryuSuit>` (Pas de Côté, Traverser, Trois Fois Avant Lui — quand son
action est finie, seiryu avec ≥ 25 de froid frappe la même cible de son coup chargé, sans perdre son
tour), `<SurEngourdi>` (Trait Foudroyant, Contre-Prise, Fil de Foudre — +50 % sur un ❄ engourdi,
réglage `bonusEngourdi`), `<ADeux>` (Prise de Position, Le Souffle Retenu — seiryu reçoit aussi ce
qu'elle se donne), `<ConfieFroid>` (Ralentir — confie son coût comme l'Hiver), `<APlace>` (Elle
Prend Ta Place — 🔄 À sa place `toursAPlace` = 2 tours, sans échange de rang ni d'états). La boucle :
Ralentir et les coups chargés de seiryu engourdissent, ses capacités frappent les engourdis, et
seiryu chargé suit ses coups. **Deuxième paquet** (v1.2, même jour : *« seiryu suit le coup, +50 % sur
l'engourdi, seiryu en profite aussi, et elle reprend du froid pour engourdir »*) : `<SeiryuSuit>`
Lecture du Geste, Sceller la Voix, Trois Temps ; `<SurEngourdi>` Instant Foudroyant, Vague
Équilibrée ; `<ADeux>` Contre-Sort, Prendre l'Élan, Charge Statique ; et une balise neuve,
`<ReprendFroid>` (Paume Immobile, Point Creux) — elle reprend `charge` (25) de froid à seiryu, une
fois par action, et ce que le coup touche s'engourdit à coup sûr, sans dégâts en plus. 20 fiches en
tout. Banc : `navigateur/les_capacites_de_korrah.js`.

**Le Registre** (`LeRegistre.js`, 2026-10-19, le rework de ludwing) : JOKO a choisi *« Piste 1, le
Registre : les âmes deviennent sa monnaie, il les gagne en prenant (morts, drains) et les dépense
pour tout (invocations, copies choisies, mises, Royaume), un seul Domaine où tout est gratuit »*, et
décrit le personnage *« comme Megumi ou Shikamaru […] Orochimaru […] beaucoup plus de ruse que les
autres »* — un stratège, pas le plus fort. **Gagner** (variable 15, compteur ✦ Âmes = état 247) :
+1 par mort (PorteurDAmes ; +1 de plus quand c'est lui qui tue, LouCopySystem), +2 si le mort était
**👁 Marqué** (213), +1 par drain à lui qui touche (+1 sur un Marqué) ; la technique d'un Marqué est
copiée dès la première fois. **Dépenser** : invocations (type 8 — JOKO l'a retiré de la classe 3 le 2026-10-29, voulu : elles ne sont plus dans son menu) ; la branche
**Copies** (type 26, en combat, seulement s'il a des copies) — 2 âmes, ni PM ni PT, consommée,
et **« à sa mesure »** (JOKO : *« chaque copie frappe 50 % de son Ombre — Nuit, avec l'élément et les
effets de la technique volée »* ; réglages `puissanceCopie`, `referenceCopie` 1224 — Copie d'Âme, au
hasard, reste à moitié de ses stats) ; mises : Roulette du Destin jusqu'à 5 âmes (+1 au seuil de la variable 5,
1 chance sur 30 chacune), Arme d'Ombre jusqu'à 3 (un tirage de plus de la variable 41 par âme, le
meilleur gardé) — les événements communs 1 et 22 ne sont **pas** modifiés, la mise s'ajoute à leur
tirage. **Le Domaine** = l'état 198 (Ténèbres Impériales) : copies gratuites et gardées, mises au
maximum offertes, invocations jamais grisées (InvocationAmes les grisait faute d'âmes malgré
RoyaumeImperial) ; `LouCopySystem` pointe sur 198 (il attendait l'état 39, que rien ne pose). Le
Royaume Impérial (71) reste tel que JOKO l'a écrit. Banc : `navigateur/le_registre.js`.

**Le livre** (`LaBibliothequeDAel.js` v2.0, 2026-10-19, le rework d'Aël) : JOKO a validé *« le livre
de 3 pages, la Parole lue (sans incantation, sans son prix), le Miracle derrière l'interrupteur 27,
Contrats et Portes gardés hors de la boucle, la ligne dans les 8 ultimes »*. D'après son profil
(*« en ultime, elle est la meilleure — et la plus rapide à le sortir »*) et son canon de la Parole
(*« dire court et juste bat presque toujours dire long et tremblant »* ; les Paroles écrites
*« agissent sans être récitées »*). Elle passe son test **seule** (le donjon d'entrée) : le livre ne
dépend donc pas des alliés. **Une page** par compétence de **1 à 20 PM** (le prix, pas qui paie : le
Contrat ne remplit rien ; l'Attaque, la Garde, le gratuit, les objets n'écrivent rien ; plus cher
n'écrit rien, sans effacer). **Livre plein** (3) : sa prochaine compétence de la branche « ult »
(type 3) est **lue** — elle part tout de suite (`CielDAel` lui donne une charge de 0, comme sous le
bon ciel), sans PV ni les états du prix (193 Doute Paralysant, 218 Surcharge), au plein prix en PM,
avec sa recharge. La Parole Originelle (818) garde son prix de lucidité. **Le Miracle** (son Trait,
*« développe de nouvelles techniques en temps réel »*) n'existe qu'une fois l'**interrupteur 27**
« Miracle d'Aël » allumé par l'événement de JOKO : avant, ni Lecture ni branche « miracle » (cachée,
rien de désappris) ; après, la Lecture d'avant, au prix de la Parole. Contrats et Portes : intacts.
Banc : `navigateur/le_livre_dael.js`.

**Un mana par art** (JOKO, 2026-10-20) : *« Pour les paroles, tu peux utiliser que le mana positif. Et
pour les mouvements, tu peux utiliser que le mana sombre. Et pour le spirituel […] que le mana
spirituel. C'est tout. »* — son ancien calculateur (mot de passe 3, 4 ou 2) est caduc (*« C'était
avant »*). Les trois arts du Premier (Genèse) : la Parole (Esprit, réciter), la Maîtrise (Corps,
mouvoir — à faire), le Symbole (Âme — à faire). JOKO veut des systèmes *« beaucoup plus approfondis
[…] plus maniables »* pour un jeu *« assez stratégique »*.

**La Parole** (`LaParole.js`, 2026-10-20) : JOKO a validé *« la phrase commune, les degrés, les longues
en fin de tour, mes 6 fusions par les Paroles de Fusion »*. **Est une Parole** : une compétence de
héros au mana positif — les 40 Paroles des échelles (1186-1225, 5 degrés par élément : simple,
double, amplifiée, fusion, dernier degré) et « Parole n°X » si X n'est pas 2, 4, 5, 6, 7 ; seiryu ne
récite pas (`acteursExclus`). **La phrase commune** : une Parole d'élément fondamental (8-15) le laisse
en suspens, affiché, jusqu'à la fin du tour suivant ; la **Double** le complète en frappant avec les
deux éléments (règle « Multiplier », boucliers compris), la **Fusion** le fond si la paire est l'une
des **6 de JOKO** (Vapeur, Lave, Plante, Givre, Métal, Crépuscule — plus aucune « collision » de la
somme), ×1,5 ; compléter referme la phrase. **Fusion et dernier degré sont longues** : annoncées au
début du tour, elles partent en dernier (`makeActionOrders`) ; un coup de 15 % des PV, un cumul de
30 % ou un état qui immobilise la brise (×0,5) ; le dernier degré ne se redit pas au tour suivant.
**Pas d'état posé** (`etatLongue` 0) : le 227 d'Aël fragilise. L'ancienne fusion de `FusionElements` (v1.0 : n'importe quels
deux sorts, par la somme des codes, avec 10 collisions) est remplacée ; depuis le 2026-10-29, FusionElements v2.0 fait les
**réactions** sur la cible (plus bas), et ne fond rien dans l'air ; `ParolesSysteme` garde son
ratage pour les **ennemis** seulement (`HerosSansRatage`). Aucune fiche n'est modifiée. Banc :
`navigateur/la_parole.js`. Les degrés, pour JOKO, sont des maths : *« la formule basique où tu
l'envoies juste […] où tu additionnes […] où tu multiplies. Et t'as la formule où tu amplifies. C'est
tout. »* ; fusionner, c'est *« une technique d'eau avec une technique de vent pour trouver une
nouvelle technique »* (Eau + Vent n'est pas dans ses 6 fusions : exemple ou ajout, à lui demander).

**La règle pour tous** (`MaitriseVoies` « reglePourTous », 2026-10-20) : JOKO — *« Les dons ne
t'écartent pas du système. Les dons te rajoutent une carte en plus avec le système »*, comme le Nen
de Hunter x Hunter, *« même Donovano […] respecte la règle »*. Le sang de Vesper est un mouvement
(une attaque de sang n'a pas de formule ; un sort sang + feu se dit), les âmes de ludwing sont du
spirituel (les runes de son collier), la glace de Korrah passe par la Parole (ses 14 sorts d'Hiver
en sont). Dans le jeu : la Voie par défaut d'un héros (`<VoieDefaut:>`) ne va plus qu'à ses
mouvements — ni à ses Paroles (`LaParole.estParole`), ni à ses techniques de l'âme (types 8, 9,
élément 2), ni aux objets ; une `<Voie:>` écrite reste la sienne ; les ennemis (215 fiches ont une
Voie par défaut) ne changent pas. Avant, ses Paroles portaient sa Voie : le Renvoi d'Aël, l'Éclat
Noir de Korrah (ses Paroles y perdent ~25 % en moyenne), les soins de ludwing et de Vesper. La
direction acceptée pour la suite (*« totalement d'accord »*) : le positif **prépare**, le sombre
**enchaîne**, le spirituel **marque** ; une monnaie par art (PM, PT, PV — changer les coûts reste
une modification en masse, §2) ; une seule chose à l'écran par art. Corrigée le 2026-10-22 : c'est
l'**âme** qui prépare (elle écrit), la Parole **calcule** (voir « Les trois arts »). Banc :
`navigateur/la_regle_pour_tous.js`.

**Ça doit se sentir** (JOKO, après avoir joué, 2026-10-20) : *« j'ai rien senti de différence […]
vraiment zéro diff »*. Cause mesurée : **le journal de combat est muet** — `SimpleMsgSideView`
(vue de côté) ne garde aucune ligne d'`addText` ; les messages de LaParole, LeFroidConfie, LeRegistre,
MaitriseVoies… ne s'affichent jamais. Ce qui doit se voir passe par **`CombatTactique.annoncer(b,
texte, couleur)`** (texte flottant au-dessus du combattant), une **icône d'état avec compteur**
(YEP_BuffsStatesCore `setStateCounter` ; un héros n'affiche que **2 icônes**, par priorité ; un ennemi
une à la fois, en boucle), ou l'ordre des tours. Autres constats : `Window_Phrase` (LaParole) est posée
exactement sur `Window_Pacte` (LePacteDeSang, 0,388) — déplacée le 2026-10-23 à droite de la Colère de Vesper, sur
sa ligne ; la 5ᵉ rangée de statut (seiryu) est hors champ — depuis le 2026-10-23, sa vie et son froid (ou « se
reforme · n t. ») s'écrivent à droite du livre d'Aël, sur la ligne du Pacte (`LeFroidConfie`, `Window_Seiryu`).
**Le 2026-10-23, les anciens systèmes des héros parlent enfin** : les ~55 lignes de journal de `SeiryuLeFamilier`,
`LeFroidConfie`, `LeRegistre`, `LaBibliothequeDAel`, `LePacteDeSang` et `LesStylesDeVesper` (le froid confié, ses
ordres refusés, il se dissipe, les âmes, le livre plein, la Porte, la Dette, la Rage, la Garde qui boit…) flottent
aussi au-dessus de qui le fait, en court (le journal reste, pour les bancs) ; de même l'incantation du ciel d'Aël
(`CielDAel` : « 🌀 « … » · n t. », le fil perdu, la Parole qui part) et **les répliques du tableau de `LesInteractions`**
(celles de JOKO, telles qu'écrites, découpées en lignes courtes au-dessus de qui parle — la Vanne de ludwing ne
s'était jamais affichée) ; une annonce au bord droit reste dans l'écran (`CombatTactique`). Un nouveau message de
système passe par une annonce, jamais par le seul journal. **Les boss, les ennemis et les dons aussi** (JOKO,
2026-10-23, à « je les fais flotter pareil ? » : *« OUI A TOUT »*) : ce que `MecaniquesDeBoss` (et `MecaBoss.dire`,
donc `MecaniquesDeBossSuite`), `DonoBoss`, `DonoKamui`, `MahoragaBoss`, `ParolesSysteme` (la Parole ratée des
ennemis), `RoyaumeImperial`, `JackpotHakari` et `LouCopySystem` écrivent au journal passe aussi dans le **bandeau**
de `ScenesDeBoss` (`MecaBoss.bandeauDuJournal`) : leur texte sans codes, la couleur de leur premier `\C[n]`, coupé
à sa première pause s'il est long (titre, puis la suite), 90 images. Pas de doublon : un bandeau que le plugin pose
au même instant remplace sa ligne de journal. `LouCopySystem` dit « Lou » (son ancien nom) : le bandeau dit le nom
du héros. Aucune fiche d'ennemi ni de don n'est touchée — seulement ce qui s'affiche.
**Le menu de combat cachait le rework** : `FamillesDeCapacites` replie en une ligne les compétences aux mêmes chiffres
(branche, portée, nature, élément, états) — 43 capacités à verbe, et « ᛟ Activer » (sur soi, sans dégâts), étaient
repliées sous une voisine. Depuis le 2026-10-23, l'**art** et le **verbe** (et « instantanée ») font partie de la
famille, et Activer ne se replie jamais. Le menu s'allonge d'autant (au niveau de départ : Korrah 76 → 92 lignes,
ludwing 61 → 72, Aël 69 → 93, Vesper 25 → 27) — presque tout vient des verbes, l'art seul n'en ajoute qu'une ou deux.
**La fenêtre des capacités en combat** (JOKO : *« OUI A TOUT »*) montre **9 lignes** au lieu de 4 (réglage
`lignesEnCombat` de `FamillesDeCapacites`, 4 = comme avant) : posée en bas, elle monte jusqu'au milieu de l'écran ;
tant qu'elle est ouverte, les lignes du Pacte, de la Colère, du livre, de la phrase et de seiryu s'effacent (elles
s'écrivaient dessus). La marque de famille « ×2 » ne chevauche plus le coût.
Banc : `navigateur/ce_qui_se_voit.js`.
Les **PT** n'étaient pas une monnaie : l'Attaque (tpGain 100 × TCR ~2,4) remplissait la jauge, la Relique 46
la gardait d'un combat à l'autre — réglé le 2026-10-22 (« Les trois arts », plus bas). **Les manas** (JOKO) : *« il n'y a plus âme et mana
originel et mana sombre, c'est que mana négatif, mana positif et mana spirituel »* — 5 = 4, 7 = 2.

**Le Mouvement** (`LeMouvement.js`, 2026-10-20 ; JOKO : *« D'abord, fais les mouvements, finis le
rework mouvement »*, sur la direction qu'il a validée : *« totalement d'accord »*). **Est un mouvement** :
une compétence de héros qui prend une Voie (`Voies.voieDe`, jamais une Parole ni l'âme) et qui est
physique, ou porte `<Voie:>`, ou est au mana négatif (4, 5) ; pas le type 21 (seiryu bouge). Après un
mouvement, le héros est dans la **posture** de sa Voie (états **248-256**, une icône chacun, priorité 98,
le flux en chiffre). **Le flux** : une autre Voie → +1 et ×1,15 ; même Voie, autre technique → rien ; la
même technique → ×0,85, flux 0 ; au flux 3, **le geste juste** ×1,5, flux 0. **Le geste faux** : un coup
de 15 % des PV max, un état qui immobilise, une Parole / l'âme / un objet → plus de posture ; la Garde (2)
et un ordre à seiryu (type 21) la gardent. **En premier** : dans le flux (dès 1), un mouvement part avant tout le monde (`makeActionOrders`,
après LaParole). Tout s'annonce au-dessus du héros ; MaitriseVoies annonce aussi le Reflux, le Renvoi,
l'Éclat Noir et le Point Final manqué. Depuis le 2026-10-22, « est un mouvement » = l'art de
LesTroisArts, et les mouvements se paient en PT. Banc : `navigateur/le_mouvement.js`.

**Le Spirituel** (`LeSpirituel.js`, 2026-10-20 ; JOKO : *« mana spirituel, c'est plus de soi, émotion de
soi, volonté »*, *« les runes, les marquages »*, *« finis le rework spirituel »*). **Est du spirituel** : une
compétence de héros d'élément 2 ou 7, ou de type 8 / 9. **La marque** (état **257** « ᛟ Marque de l'âme »,
icône 175, 3 tours, le nombre en chiffre) : chaque coup qui touche un ennemi en écrit une, qui garde
40 % des dégâts (sans dégâts : 2 × MAG) ; 3 au plus. Quand l'ennemi **agit**, toutes éclatent d'un coup —
par un vrai coup du marqueur (`executeDamage` : une mise à mort compte l'âme et le Marqué), sans drain, et sans
que le Renvoi ou le Reflux de l'ennemi ne la renvoient ; s'il **tombe** marqué, qui a écrit reprend 8 % de ses PV max par marque. **La volonté** :
ses techniques (dégâts et soins) × (1 + 0,5 × PV manquants + 0,25 par allié tombé), ×1,75 au plus. Les
ennemis n'écrivent pas. 23 des 37 techniques de l'âme se paient déjà en PV ; les 12 en PM ne sont pas
touchées. Banc : `navigateur/le_spirituel.js`. **Éteint le 2026-10-22** (gardé) : remplacé par L'Écrit.

**Les trois arts** (`LesTroisArts.js`, 2026-10-22). JOKO a voulu qu'on comprenne avant de faire (*« resete
tout et fait comme ça devait être de base mais avant ça tu dois comprendre »*), puis : *« Spirituelle c'est
plus comme les symboles le fait de écrire ou préparer des écrits le système de Full Metal Alchemist »*,
*« Oui pour les runes »*, *« Oui la volonté l'âme la détermination »*, et *« B pour l'écrit et oui pour le 2
et je t'autorise à tout même les capacités littéralement tout sauf les dons »*. La Genèse : les trois
arts du Premier — les mathématiques du mana (la **Parole**, l'Esprit), les voies d'art des mouvements (le
**Mouvement**, le Corps), l'écriture des âmes (l'**Écrit**, l'Âme) ; *« le corps attaqua l'âme, l'âme attaqua
l'esprit et l'esprit attaqua le corps »*. Trois rapports au temps : le corps **maintenant** (PT), l'esprit
**ce tour-ci** (PM), l'âme **plus tard** (PV). **L'art d'une compétence de héros**, dans l'ordre : `<Art: parole
| mouvement | ecrit | aucun>` sur la fiche ; aucun art pour les types 21, 22, 23 et 2, 6, 461, 480 ; une
rune → écrit ; les échelles 1186-1225 → Parole ; « Parole n°X » → n°2 / 7 écrit, n°4 / 5 mouvement, sinon
Parole ; types 8, 9, éléments 2, 7 → écrit ; `<Voie:>`, éléments 4, 5, coup physique, types du corps (5, 10-19,
24), frappe physique → mouvement ; `<Parole>`, sort magique, soin → Parole ; sinon aucun (le soutien).
LaParole, LeMouvement et MaitriseVoies demandent l'art ici : une seule règle. **Le triangle** : sur une
compétence de héros, les éléments de mana sont remplacés par celui de l'art (`getItemElements` : dégâts et
boucliers) — un mouvement de Feu frappe en Feu et en négatif ; ▲ / ▼ s'annoncent sur l'ennemi ; l'aide dit
`【PAROLE · FEU】`. **Le prix suit l'art** : 88 capacités réécrites (mouvement : ses PM en PT, même chiffre ;
écrit : PM → PV au tiers, ou seulement le PV qu'il avait déjà ; Parole : ses PT en PM ; un PV hors ultime
retiré). **Toute capacité a un art** : les 41 de soutien qui n'en avaient pas reçoivent `<Art:>` — ludwing
écrit d'abord (les cercles du Domaine 1114-1117 « À partir d'ici, c'est chez toi », Marquer la Cible, Faire
Douter, Ombre Prêtée, Lotus des Ténèbres, Âme d'Ombre — Tracer le Cercle, Territoire Scellé et le Lotus sont des mouvements depuis
le 2026-10-25, voir « L'écrit, c'est le mana spirituel »), Aël parle (Halo seul est écrit), Vesper bouge (ses
gardes ; L'Équilibre Tenu est écrit), Korrah bouge (prises, postures) et parle (ordres de l'esprit, Ralentir
qui confie ses PM) ; restent sans art Fuir, revelation, VUE et les pièces des dons (438, 818, 14, 111, 69).
**« Sauf les dons »** : les types ouverts par l'acteur ou par son don (4, 5, 6, 8-24, 26) et 71, 810,
438 ne changent pas ; ni 15, 18, 96, 148, 1173, dont un ennemi se sert. Recharges (règle de `18_recharges`) :
retirées sur 8 mouvements que leurs PT limitent, posée sur Annihilation des Ténèbres (68). **La barre de PT**
(JOKO : *« oui pour le 2 »*) : l'Attaque rend 20 PT (× TCR ~2,4 ≈ 47), les Reliques 44-46 ne les gardent plus.
**Éteints** : FusionMana, ElementsVivants, LeSpirituel ; ManaAffinity : recul 0 / 0, `elPur` 99 (7 est le
spirituel). Les 9 Voies de MaitriseVoies restent (les styles du corps ; le Masque de Vesper boit le drain du
Sang). Banc : `navigateur/les_trois_arts.js`.

**Les affinités** (`LesTroisArts.js` v1.1, 2026-10-24 ; JOKO : *« L'affinité unique oui c'est tout »*, *« non
change pas le nom »*). La Bible : *« Chaque personne naît avec une seule affinité »*, *« C'est le don ou le trait qui
ajoute une seconde affinité »*, *« un art hors de son affinité coûte plus et rend moins »*. Les affinités choisies par
JOKO (réglage `affinites`) : **Vesper** spirituel + négatif (son sang) — ses Paroles sont hors affinité ; **Korrah**
négatif + positif (l'Hiver de seiryu) — ses écrits ; **ludwing** négatif + spirituel (ses âmes) — ses Paroles ;
**Aël** positif seul — ses mouvements et ses écrits. Hors affinité, le coût est ×1,5 dans sa monnaie (PM, PT ou PV,
`coutHorsAffinite`), **jamais plus que la jauge pleine** (sinon Le Domaine Entier d'Aël, 70 PT → 105, ne partait
plus jamais), et les dégâts, les soins et les PM rendus ×0,75 (`forceHorsAffinite`). Hors de la règle : l'Attaque
(`horsRegle` 1), les **dons** — leurs types (4, 5, 6, 8-24, 26) et 71, 810, 438 : le don *est* la seconde affinité —
et les **attaques à plusieurs** (type 25, unisson : chacun paie le sien) ; seiryu et les ennemis ne l'ont pas. **Ce
qui se voit** : le coût affiché est le vrai, l'aide dit `【PAROLE · FEU · hors affinité】`, « ◇ Hors affinité » flotte
au-dessus du héros. Mesure (`lequipe_a_chaque_niveau`, 3 parties de chaque côté) : 2,95 → 3,05 tours en moyenne,
autant de victoires — un petit nerf. Pour un banc : `LesTroisArts.affinites(b)`, `LesTroisArts.horsAffinite(b, s)`,
`LesTroisArts._sansAffinites = true` coupe la règle (`le_registre` mesure la copie de ludwing contre sa Nuit sans
elle : la copie est un don). Banc : `navigateur/les_affinites.js`. **v1.3, après la fusion du 2026-10-26** (le commit de JOKO
« Appliquer les affinités aux trois arts » remplaçait ce bloc ; le jeu plantait à chaque technique de héros, `horsDe` perdue) :
*« Ta règle + mes exceptions »* — son code (sa lecture « 1: spirituel négatif, … », son coût, son effet) avec les exceptions
ci-dessus (dons, combos, 71, 810, 438, la jauge pleine, les PV et PM rendus par effet). La même fusion avait rallumé DonsSpirituels,
FusionElements et ElementsVivants ; à « tu le voulais ? », *« Jsp tu en penses quoi »* : éteints de nouveau, ses décisions
d'avant (les dons retirés, ses 6 fusions par LaParole, les trois arts) — un interrupteur chacun. JOKO les a éteints lui aussi le
même jour (« Désactive les anciens systèmes ») ; FusionElements revient le 2026-10-29 en v2.0, les réactions élémentaires.

**Le rework des capacités** (2026-10-25 ; JOKO : *« rework complètement tout les capacités, spéciales et ulti des
personnages pour les rendre plus intéressant et équilibré surtout leur don et utilise le lore aussi »*, puis *« Oui tout »*
sur la proposition mesurée : un paquet commun, puis un héros à la fois). **Le paquet commun** (`data/Skills.json`, 27 fiches ;
noms, coûts et niveaux inchangés) : **A** — chaque ultime frappe au moins ×1,3 la meilleure capacité de sa portée, à chaque
niveau, affinité comprise (Déflagration Spirituelle, Tranche-Néant, Instant Absolu ×7,6 → ×39, Point Zéro, Éclat de
Conviction, Syllabe de la Fin, Plein Midi, Dévoreur d'Âmes ; Instant Absolu et Point Zéro portent 3 tours de recharge,
la règle de `18_recharges`) ; **B** — chaque rendement (puissance par PT, PM ou % de PV, au niveau 60) entre ×0,5 et ×2
de la médiane de sa monnaie chez son héros : 16 fiches (Brise-Garde 8,7 → 6,4, Coup Furieux ; Fracas Sismique, Déchaînement
Négatif, Tranche des Trois Sources, Carnage des Neuf Voies, Fil de Foudre, Pluie de Lance du Styx, Chaîne d'Âmes, Pluie
d'Étoiles…) ; **C** — Tranche-Néant et Jugement de Soi disaient « ULTIME d'Aël » (elles sont à Vesper), Dévoreur d'Âmes,
Tout ou Rien et la Mue Souveraine, qui se disent ULTIME, passent en ultime, Dévoreur frappe en ratio (sa soustraction
tombait à 0). Hors de la règle : les formules à caractère, ce qu'un ennemi utilise (Moisson des Âmes, Fils de Mana Pur —
annoncés, gardés), les techniques d'un état (Rage, Flow, JACKPOT, ombres, Miracle), les combos, seiryu, les pièces des
dons, et le Verbe qui Défait (un ultime d'effet : ×9 en ferait le plus gros coup de zone d'Aël pour 32 PM). Mesure
(`lequipe_a_chaque_niveau`, 3 parties de chaque côté) : 3,05 → 3,16 tours, 172 victoires sur 176 des deux côtés, boss
45 → 41 sur 60 — dans le bruit. Banc : `24_ultimes_et_rendements.js` (il lit aussi ce que les traits
d'acteur donnent : les Styles de Vesper, Sang Perçant, Supernova ; les arts d'armes, type 24, restent hors de la règle).
**Vesper, le sang (V1)** — la Bible : *« son don le transforme en sang, et son sang se manie par les voies d'art »*. La
branche « sang » (type 10, celle que son don ouvre : Première Entaille, Lame Liquide, Deux Cercles, Elle Ne Recule Pas,
Rendre le Sang, Écarlate Montante, la Convergence, Sang Perçant, Supernova) se paie en % de PV, au tiers de son ancien coût
(comme les écrits), 5 % au moins (la bande de `7_trois_sources`), et reste des mouvements (flux, posture, négatif, dans son
affinité). Ses capacités de la Voie du Sang (Art du Sang, Sang pour Sang…) restent en PT. Comme ses PT se vident de ses
techniques de sang, la règle B a redescendu Ouvrir, Coup Furieux, Brise-Garde et Sang pour Sang, et remonté Fouet de Sang et
Cercle Écarlate. Mesure : 3,16 → 2,98 tours, boss 41 → 43 sur 60. Banc : `navigateur/le_sang_de_vesper.js`.
**Korrah, la tête en l'air (K1)** — la Bible : *« des attaques visées ratées, des objets qui tombent. Elle doit apprendre à se
concentrer »*. Dans `LeMouvement` (section « Korrah : la tête en l'air ») : ses attaques sur une seule cible ratent 15 % du
temps (`rateTeteEnLair` ; pas une `<Sur>`, pas un coup de zone), « 💭 La tête ailleurs… ». **Penser juste** (une Parole dans sa
posture) ou **Focalisation** (451, `seConcentrent`) la concentrent : état **258 « 🎯 Concentrée »** (icône 127, priorité 99) — sa
prochaine attaque visée ne rate pas, ne s'esquive pas, frappe ×1,25 (`bonusConcentree`), puis la concentration part ; ce qui la
concentre n'en profite pas soi-même. Mesure (6 parties) : les combats ordinaires ne bougent pas, les boss tombent de ~43 à
36,5 victoires sur 60 — un vrai nerf, avec une IA de banc qui ne se concentre jamais exprès. Banc : `navigateur/la_tete_en_lair.js`.
**ludwing, le poids des âmes (L1)** — la Bible : *« absorber d'autres âmes le rend plus puissant, mais leurs traumas viennent
avec »*. Dans `LeRegistre` : en combat, chaque âme gardée (variable 15) donne +2 % à ses dégâts (`bonusParAme`, **10 âmes
comptées au plus** — `bonusAmesMax`), « ✦ Âmes ×1,1 » quand il frappe ; au-delà de 5 (`seuilPoids`), chaque âme de plus lui coûte
3 % de DÉF (`defenseParAme`, 60 % au plus — `poidsMax`), état **259 « 😵 Le poids des âmes »** (icône 62, la perte en chiffre),
jusqu'à ce qu'il les dépense (« ✦ Plus léger »). **Mesuré, puis réglé** : les âmes ne retombent jamais d'elles-mêmes (50 au premier
niveau du banc, 409 à la fin) ; avec 25 âmes comptées (+50 %), les combats raccourcissaient de 16 % — trop fort, d'où 10 (+20 %) :
3,03 → 2,85 tours, boss 39 → 45 sur 60. Au-delà de 10, garder ne rapporte plus rien et coûte. `Registre._sansPoids = true` coupe la
règle (`le_registre` mesure la copie sans elle). Banc : `navigateur/le_poids_des_ames.js`.
**Aël, en ultime la meilleure (A1)** — la Bible : *« en ultime, elle est la meilleure, et la plus rapide à le sortir »*. Chacun de
ses ultimes frappe au moins ×1,2 le meilleur ultime des trois autres de la même portée, à chaque niveau (Éclat de Conviction,
le Ciel Ouvert, Syllabe de la Fin, Plein Midi : +3 à +9 % ; La Parole Tenue et Celle Qu'on Ne Dit Qu'une Fois y étaient déjà) —
contrôlé par `24_ultimes_et_rendements.js`. **A2** : ses 24 mouvements restent des mouvements (l'affinité les affaiblit déjà,
*« la plus faible physiquement »*). **N** : rien de plus pour les Paroles longues hors affinité (Nell Varga). **Bilan du rework**
(`lequipe_a_chaque_niveau`, 3 parties avant, 3 après) : 3,05 → 2,86 tours, 172 → 173 victoires sur 176, boss 45 → 43 sur 60 ;
la Bible dit le sang qui se paie en sang, la tête en l'air, le poids des âmes, et les ultimes.

**L'Écrit** (`LEcrit.js`, 2026-10-22 ; JOKO : *« B pour l'écrit »* — c'est toi qui l'actives). Un écrit
(l'art de LesTroisArts) se paie en PV tout de suite mais **ne part pas** : il s'écrit sur sa cible (ennemi,
allié, soi), état **257 « ᛟ Écrit »** (le nombre en chiffre, ne s'use pas). **« ᛟ Activer »** (compétence
**1309**, type 1, `<Instantané>`, apprise au niveau 1 par les classes 1-4 ; un héros d'une partie déjà
commencée la reçoit au premier combat) fait partir **tous** ses écrits d'un coup, dans l'ordre, **×1,25**
(`bonusEcrit`) ; grisée sans écrit. 3 écrits en attente au plus par héros (`ecritsMax`). Un ennemi tombé
emporte ses écrits. **Déjà écrits** (partent tout de suite) : les dons — types 8, 9, 26 (*« les runes sur son
collier »*, ludwing), une fiche `<DejaEcrit>` (Aspiration des Âmes Damnées, 70 : son collier) — les attaques à plusieurs (`<Combo>`, unisson) et la Parole lue d'Aël. **La volonté**
(de LeSpirituel) : tout ce qui est de l'âme × (1 + 0,5 × PV manquants + 0,25 par allié tombé), ×1,75 au plus.
Activer garde la posture du Mouvement. **La résonance** : des écrits qui partent ensemble, chacun +15 % par autre
(trois : ×1,3). **Ce qui se voit** (2026-10-23) : dès qu'un héros a des écrits, **« ᛟ Activer · n »** s'ajoute juste
sous l'Attaque dans ses ordres (elle reste aussi dans ses capacités) ; son aide dit ce qui attend, compté et sur qui
(« ᛟ En attente : Cloison → Vesper · Trait Spectral ×2 → Slime ») ; un écrit grisé dit pourquoi (« 3 écrits
attendent déjà »). Banc : `navigateur/l_ecrit.js`. **Depuis le 2026-10-26, ce sont des runes dans un cercle** (v2.0 : l'air et le sol,
l'accord, la transmutation entière ; « ᛟ Cercle », « ᛟ Dans le cercle », « ᛟ Le cercle se ferme ») — voir « Le chantier des compétences ».
**L'écrit, c'est le mana spirituel** (JOKO, 2026-10-25 : *« ça s'applique que aux techniques du mana spirituel. Pas ceux
qui coûtent les PV. Tout ce qui est mana spirituel, faut utiliser ces PV pour l'utiliser »*, sur une attaque de Vesper
*« clairement physique »* traitée en spirituel) : c'était **Saignée Continue** (élément Physique, coup physique), que le
paquet des verbes avait mise dans l'écrit — elle redevient un mouvement à 20 PT, avec sa description d'origine. `LesTroisArts`
(v1.2) refuse désormais l'écrit à toute technique d'élément Physique ou de l'attaque (`elementsJamaisEcrit` « -1, 1 »), même
avec `<Art: ecrit>`. Tout écrit d'un héros se paie en PV : Jugement des Défunts, Rappel des Âmes, Registre, Rappel et Dette
Ancienne passent de PM en PV (au tiers, 5 % au moins ; Dette Ancienne perd sa recharge, son prix la freine) ; Ce Qu'il A Gardé,
qu'un ennemi utilise, reste en PM ; Transfusion d'Âme Blanche prend ses PV par son effet. Dans le Domaine, une invocation
regarde aussi ses PV (`RoyaumeImperial`). Règle B tenue (Fouet de Sang, Cercle Écarlate, Chaîne d'Âmes +6 %). Mesure : 2,86 →
2,88 tours. **Puis JOKO a sorti cinq techniques de l'écrit** (même jour, à la question « lesquelles je sors de l'écrit pour en
faire des mouvements ? » : *« Fouet de Sang + Cercle, Lotus des Ténèbres, Tranche-Néant, Les 3 cercles »*) — toutes en
`<Art: mouvement>` : **Fouet de Sang** (branche sang de Vesper, toujours payé en PV), **Tranche-Néant**
(son ultime, ses 25 % de PV gardés), **Lotus des Ténèbres** (10 PT) et deux des cercles de ludwing, **Tracer le Cercle** et
**Territoire Scellé** (22 et 44 PT — leurs anciens PM, la règle des arts). Leurs verbes de l'écrit (Cercle, Referme) et les lignes
qui les annonçaient sont retirés, les descriptions de JOKO rendues. **Deux restent des écrits** (JOKO, 2026-10-26, en relisant
le tableau) : *« La Règle du Lieu spirituelle »* — 17 % de PV et son Sceau, quand il part l'ennemi perd sa prochaine action (pas
un boss) ; mesure : 2,79 → 2,76 tours, boss 47 → 47 sur 60 — puis *« Cercle Écarlate spirituelle »* — 10 % de PV, sa fiche d'avant
(« Parole n°2 » en fait un écrit) ; mesure : 2,76 → 2,72 tours, boss 47 → 45 sur 60 (dans le bruit). Au même message, *« Tranche-Néant art »* : lu d'abord « les voies d'art » (rien changé), puis précisé — voir « Tranche-Néant,
selon l'arme tenue ». **Plus aucune capacité ne porte
`<Cercle>`** (le verbe reste dans LEcrit ; `les_verbes` l'essaie sur Marquer la Cible le temps du contrôle) ; Referme reste sur
Déflagration Spirituelle, Onde Concentrée et Dévoreur d'Âmes, Sceau sur La Règle du Lieu, Faire Douter, Désorientation et Syllabe
de la Fin. Mesure (avec les sept sorties) : 2,88 → 2,79 tours, boss 44 → 47 sur 60. Banc : `25_lecrit_est_spirituel.js` (et `le_registre`, l'invocation sans ses PV).

**Tranche-Néant, selon l'arme tenue** (`LesStylesDeVesper.js` v1.1, 2026-10-26 ; JOKO, à « qu'elle devienne un art d'arme de
Vesper (style Lame, selon l'arme tenue) » : *« oui donc plusieurs variantes »*). Une variante par famille d'arts d'armes, tirée de ses
arts, et elle ne voit que celle de l'arme qu'elle tient : **à l'épée** (et au fouet, à l'éclat : `<ArtArme: epee, sinon>`, « sinon » =
une arme d'aucune famille) 445, toute la troupe, `<Premier>` (Iaï) ; **à la dague** 1310, un ennemi, la moitié de l'armure ignorée (Sous
la Garde) ; **à la hache** 1311, toute la troupe, 25 % d'Étourdi (Coup d'Épaule) ; **à la lance** 1312, toute la troupe, 30 % de l'armure
ignorés, AGI −2 tours (Percée, Balayage) ; **à distance** 1313, quatre traits au hasard (Tirs en Pluie) ; **aux poings** (et à mains
nues) 1314, un ennemi, 40 % de Vertige (Talon Retourné). Même fiche que 445 sauf la forme : nom, 25 % de PV, 3 tours de recharge,
l'Épuisement de l'Âme, ultime de la branche « ult », Style Lame ; apprises par les traits de Vesper, comme ses arts. Les forces tiennent
les règles A et A1 (une zone ne peut ni frapper moins que l'épée, ni passer le Ciel Ouvert d'Aël : ×29,7 la hache, ×27 la lance ; un
seul ennemi : ×33 la dague, ×38 les poings ; ×9 par trait à distance). La forme s'annonce (« ⚔ Tranche-Néant · à la dague »). Le
plancher du Mana Pur de `7_trois_sources` passe à 43. Mesure (6 parties de chaque côté) : 2,74 → 2,76 tours, boss 46 → 42 sur 60
— un écart de l'ordre du hasard du banc (un écart-type), dans le sens d'un petit nerf. Banc : `navigateur/tranche_neant.js`.

**La Lame de Vesper** (`LesStylesDeVesper.js` v1.2, 2026-10-26 ; JOKO, sur la proposition mesurée des Styles : *« L1 l2,
l4 »*, puis *« Montre-moi d'abord »* pour la Garde et le Sang). Mesuré avant : en Lame, 19 de ses 22 mouvements prenaient la
Voie du Sang (sa `<VoieDefaut: sang>`) — le Style « ni sang » drainait, et son flux ne montait presque jamais ; ses 18 arts
n'avaient aucun verbe. **L1** — en Lame, un mouvement sans Voie à lui prend celle de l'arme tenue (`voiesDesArmes` : épée
Miroir, dague Éclair, hache Forge, lance Vide, distance Flash, poings Onde ; sans famille, le fouet : le Sang), par un crochet de
MaitriseVoies (`Voies.voieDuGeste`) ; une Voie écrite reste la sienne ; changer de Style change de Voie, donc le flux monte.
**L2** — un verbe du corps par art, tiré de sa description, avec sa ligne : épée Ouvre / Entre / Premier (Iaï), dague Premier /
Ouvre / Sur, hache Ouvre / Entre / Lâche (Couperet), lance Sur / Ouvre / Finit (Saut du Héron), distance Premier / Reprise /
Immobile (Tir du Point Mort), poings Ouvre / Entre / Finit (Cent Poings) — 18 fiches, noms, formules, coûts inchangés. **L4** — la
contre-attaque du Flow est une riposte du contre-temps (`LeMouvement.riposteForcee`) : flux +1, la 3ᵉ ×1,5, elle ne compte pas
comme un geste de plus, et « après la riposte » tient jusqu'à sa vraie action suivante. Pas fait : L3 (ses arts en PT). Mesure, en Lame (2 parties de
chaque côté) : 2,00 → 1,95 tours, boss 31 → 30 sur 40, sa part des dégâts contre les boss la même (36 %), mais ses arts en font
plus (Iaï 6-7 → 10-13 %, Couperet 2 → 5-6 %, Communion des Quatre 47 → 33 %) ; l'équipe (3 parties contre 6) : 2,76 → 2,75 tours,
boss 42 → 44 sur 60. Bancs : `navigateur/la_lame_de_vesper.js` ; `les_signatures` joue le contre-temps en Garde, `la_regle_pour_tous` la Voie
par défaut en Sang (en Lame, c'est celle de l'arme).

**Le chantier des compétences** (2026-10-26 ; JOKO : *« beaucoup de chose de anciennes version […] surtout dans la logique et
cohérent car il y a beaucoup trop de incohérent surtout sur les noms comme parole n° : nom de l'attaque »*, *« J'ai l'impression que tu
Larp chef »*). Ses quatre choix : les Voies *« selon ce qu'ils font, numérotés par héros »*, *« Parole du Feu : Braise »*, *« Cercle, runes,
fermer le cercle »*, *« un menu par art »*. **1** — chaque compétence de héros porte son `<Art:>` (renommer ne change plus son art).
**2, les Voies** — 56 mouvements dans la Voie de leur effet (Forge le coup lourd, Onde le contre, Miroir la garde, Vide percer, Éclair ne
pas rater, Domaine la zone, Flash le pari, Sang le drain, Source se soigner en frappant ; la Voie par défaut mettait presque tout un héros
dans une seule, le flux ne montait pas) ; 141 noms « Premier art de l'Onde : Ressac », par héros et par Voie dans l'ordre d'apprentissage,
les arts d'armes de Vesper par l'arme (« Premier art de l'épée : … ») ; gardent leur nom l'Attaque, les ultimes, le Jackpot, les branches
des dons, les Combos. Les 7 mouvements qu'un ennemi utilise : copies pour les héros (1315-1321), les ennemis gardent leur fiche. Vannes
passe à la Parole. **3, les Paroles** — 125 noms : « Parole du Feu : Braise », « Parole de la Glace : Souffle Court » (l'Hiver de Korrah
en est), « Parole : Debout ! » sans élément, « Parole du Feu » la formule de base ; plus aucun « Parole n°X » chez les héros. Un nom à
« : » trompe le lecteur de doctrines des ennemis : aucune doctrine n'en cite (vérifié). **4, les runes** (`LEcrit.js` v2.0) — le stylo
d'âme trace un cercle : **dans l'air** sur la cible d'une rune à une cible (état 257 « ᛟ Cercle », il la suit, il attend « ᛟ Activer ») ;
**au sol** pour une rune qui en vise plusieurs (état 260 « ✒ Cercle au sol », icône 289, sur tout ce côté) — elle part **toute seule**
après l'action d'un ennemi (côté héros : seulement s'il a visé un héros), ou quand on ferme le cercle. Chaque écrit est une rune « Rune de
Sceau : … », de son **signe** `<Rune: frappe | prise | sceau | lien | rempart>` (sans balise : ce qu'elle fait). **L'accord** : deux runes du
même signe qui partent ensemble ×1,25 chacune (`bonusAccord` — ×1,5 était trop fort : trois runes préparées ~7,3 coups d'un coup contre
~4,9 avant ; ~6,1 à ×1,25), le Sceau accordé est sûr ; **la transmutation entière** : trois du même signe, la vie payée pour elles revient
(`transmutation` %). Échange équivalent : la rune se paie en PV, retenu quand elle s'inscrit. Restent : la résonance, la volonté, les verbes,
le piège et la chance de ludwing, les dons « déjà écrits » (les runes de l'âme de ludwing partent tout de suite). L'aide dit
`【RUNE · SCEAU】` et « ᛟ Dans le cercle : … → Slime · … au sol ». **5, un menu par art** (`LesTroisArts.js`) — en combat, capacité et
Spéciale se rangent en **Voies, Paroles, Runes** (Activer avec les Runes), puis les branches du héros, **Ultimes** (« ult »), Combo ;
**aucune fiche ne change de type** (le Flow, le kit des Styles, les Copies lisent toujours les types) ; l'Orbe des capacités montre les
mêmes branches. **6** — les descriptions disent les trois manas (« Mana Pur » → le mana de son art, « Mana Sombre » → négatif, « Lou » →
ludwing) ; Fils de Mana Pur garde son nom (à JOKO). Bancs : `navigateur/les_runes.js`, `navigateur/un_menu_par_art.js`, et `l_ecrit`,
`lorbe_en_raccord` à jour. **JOKO committe lui-même tout l'arbre de travail** (« zgz », 2026-10-26) : un fichier à moitié fait part avec ;
et **tant que `RPGMV.exe` est ouvert, aucun `data/` ne s'écrit** (l'éditeur réécrit tout à sa sauvegarde).

**Le rework des ennemis** (2026-10-26 ; JOKO : *« Ok on passe au ennemis maintenant refait un rework »*, puis *« Tous les 549 »*,
*« La cohérence »*, *« Une mécanique par ennemi »*, *« L'équilibrage »*, et sur la liste montrée : *« Oui, écris tout »*). Constat : 549
ennemis, dont **48 seulement rencontrés** (les 49 troupes posées sur ses cartes et ses événements) ; les ~400 des 18 familles (Titans,
Glitchs, Automates…) avaient été générés le 2026-09-06. **L'instinct** (`LesInstincts.js`, balise `<Instinct: …>`, états 261-265) : une
mécanique par ennemi, annoncée au-dessus de lui, tirée de la phrase de sa famille ou de la Bible (les Sentinelles « apprennent chaque
attaque », les Loups d'étoiles « chassent en meute », les Revenants reviennent, les Dévoreurs « ne cessent jamais de chasser ») — 24 :
meute (+20 % par membre tombé, « quand l'une tombe, les autres s'énervent »), essaim (+10 % par autre vivant), charge (l'élan tous les 3
tours puis ×2, brisé par un coup de 15 % ou la brisure du bouclier), vole (de l'or, fuit sous 30 %, rend tout en tombant), revient (une
fois, à 30 %), apprend (×0,7 par technique déjà reçue, ×0,4 au plus bas), rancœur (+10 % par coup, vise qui l'a frappé), mirage (+40 %
d'esquive jusqu'au premier coup — à +50 %, les bancs, qui fixent le hasard à 0,5, rataient tout), dévore (30 % des dégâts), épines (la chair
vive, 20 % au frappeur), chœur (alliés ×1,1, +5 % de PV par tour), répare (6 %), brûle, reprend (les Masques renvoient ta dernière technique),
corrige (les Scribes effacent ta dernière rune, sinon un renfort), arrache (les Écorchés prennent de l'attaque, la rendent en tombant),
reflet (50 %, sauf sur sa faiblesse), carapace (÷2 jusqu'à la brisure du bouclier), explose, embuscade, frénésie, venin, garde, marque.
Une épine, un reflet, une explosion ne font jamais tomber un héros. **506 fiches** l'ont (familles par leur phrase, ses ennemis par leur
nom, sinon leur courant : le Corps chasse, l'Esprit apprend, l'Âme revient) ; les **43 boss à mécanique** gardent la leur.
`LesInstincts._eteint = true` coupe tout. Banc : `navigateur/les_instincts.js` (27 contrôles). **La cohérence** : les 141 compétences
d'ennemis « Parole n°X » ont leur art figé (`<Art:>`, la règle de LesTroisArts) et le nom de leur art, comme celles des héros (93 « Parole
du Feu : … », 33 « Rune de Frappe : … », 15 mouvements sans préfixe) — les doctrines citent toutes par numéro (« Skill 12 »), rien ne casse ;
la balise `<Mana:>` (lue par rien, elle dit le courant) : sombre → negatif (147), âme et originel → spirituelle (103) ; **« pur » reste**
(30 : Donovano le Mana Parfait, les Glitchs, la Reine Oubliée… — la Bible : *« Le mana parfait réunit les trois courants »* ; ils échappent
au triangle, `7_trois_sources` le contrôle). **Les rangs** (*« un rang D à S pour ceux qui n'en ont pas (donc un bouclier) »*) :
les 104 ennemis sans rang en reçoivent un (D 36, C 22, B 31, A 9, S 6 — le plus proche de leurs PV et de leur force, d'après la
médiane des ennemis déjà rangés ; les boss à mécanique restent « boss »), donc un bouclier et le multiplicateur d'EquilibreDesCombats ;
12 sont rencontrés dans le jeu (le Slime et le Poulet Bizarre en D, la Wyverne du Fort de Kragenvar en B, l'Esprit Errant en A…).
**L'équilibrage** (`EquilibreDesCombats` v1.1, mesuré avec les instincts) : seul le **rang B** change — PV ×3,6 → ×5,8, force ×1,45 →
×1,6 ; l'équipe complète le tuait en 1,6 à 2 tours, il en dure 3,2 à 3,8 (94 % de victoires, 8 % de ses PV reçus par tour), 2,1 sur
les seules troupes posées dans le jeu. **D et C ne bougent pas** : l'équipe complète les tue en 1 tour, mais le jeu commence avec
**un seul héros** (DebutMarques) — seul au niveau 1, 80 à 100 % de victoires en D, en 1 à 3,5 tours ; seul au niveau 12 en C, Korrah
94 %, Vesper 75 %, ludwing 56 %, Aël 44 %. **A, S et boss ne bougent pas** : 3,3 tours en A (88 % : les Bêtes, en frénésie, gagnent
une fois sur deux — des Destins qu'on peut fuir), 4 à 10 en S, 7 à 11 pour les boss. Les héros partent encore du niveau 89 : les
niveaux de bêta que JOKO a dits (Vesper 40-50, ludwing et Korrah ~30, Aël ~15) ne sont pas posés. Banc : `lequipe_a_chaque_niveau`
avec `VRAIES=1` (les 49 troupes du jeu) et `SEUL=n` (un seul héros).

**Les réactions élémentaires** (`FusionElements.js` v2.0, 2026-10-29 ; JOKO : *« je voulais comme sur genshin des combo
élémentaires qui donnait un effet »*, puis sur la table proposée : *« Oui et modifier le plugin en vrai rework monstrueux »*). **L'aura** :
un coup qui blesse avec un élément fondamental (Feu 8 … Ombre 15 ; n'importe quel héros, n'importe quel art, une rune quand elle part)
laisse son élément sur la cible, états **266-273** « ◈ Feu »… (icônes 64-71), 2 fins de tour ; le même élément la rafraîchit, un
élément qui ne réagit pas la remplace. **La réaction** : un autre élément la fait réagir et l'efface — 💨 **Vapeur** (Feu + Eau) ×1,5,
Brûlure et Aveuglé ; 🔥 **Fonte** (Feu + Glace) ×1,5 ; 💥 **Surcharge** (Feu + Foudre) 50 % du coup sur les autres ; 🌋 **Lave** (Feu +
Terre) Brûlure ; 🧊 **Givre** (Eau + Glace) il perd sa prochaine action — pas un boss (rang S ou à mécanique, la règle du Sceau), état
274 ; ⚡ **Électrocharge** (Eau + Foudre) 25 % du coup à 2 fins de tour, état 276 ; 🌿 **Plante** (Eau + Terre) le lanceur reprend 15 % ;
❄ **Supraconduction** (Glace + Foudre) DÉF ×0,5 2 tours, état 275 ; ⚙ **Métal** (Terre + Foudre) Paralysie ; 💎 **Cristallisation**
(Terre + Glace) le prochain coup que reçoit le lanceur ÷2, état 277 ; 🌗 **Crépuscule** (Lumière + Ombre) Aveuglé, le lanceur reprend
10 % ; 🌪 **Dispersion** (Vent + Feu, Eau, Glace ou Foudre) l'élément passe à tous les autres ennemis. Ses 6 fusions gardent leur nom
et l'effet de sa table des esprits (ElementsVivants). **Ajouté, à lui de dire** : un ennemi qui portait déjà une aura réagit avec l'élément
dispersé, sur un souffle de 25 % du coup (`souffle`, 0 : il se pose seulement). Une Fusion de LaParole (`_paroleElements` ≥ 16) ne pose
ni ne réagit ; les ennemis ne posent pas d'aura (`ennemisPosent`). **Ce qui se voit** : l'icône de l'aura, la réaction au-dessus de la
cible (« 💨 VAPEUR · ×1,5 ») avec **son** animation (JOKO, 2026-10-29, « une par réaction » : avant, les 12 étaient la même image teintée — Bulles, Feu Un 2, Feu · Explosion, Braises, Glace Un 2, Tonnerre Un 2, Pétales, Éclats brisés, Paralyser, Cristal, la 125 (Darklight), Vent Un 2 ; toutes déjà dans le jeu, toutes jouées sur la cible, jamais au centre de l'écran), son son, un éclair d'écran, et au choix de la cible, l'aide
dit « ◈ Feu → 💨 Vapeur ». Tous les chiffres, animations et sons sont des réglages. `window.Fusion` (aura, reaction, prevoir, compte,
`_eteint`). Mesure (`lequipe_a_chaque_niveau`, 3 parties sans, 3 avec) : 3,01 → 3,05 tours, 171 → 171 victoires sur 176, boss 49 → 46 sur 60 — dans le bruit, car l'IA du banc ne cherche pas les paires : ~20 réactions sur ~200 combats (le banc les compte, « n réactions »). Les éléments des héros : Vesper Feu et Eau (la Vapeur à elle seule), Korrah Glace et Foudre (la Supraconduction), ludwing l'Ombre, Aël la Lumière (le Crépuscule à deux). **v2.1** (JOKO, 2026-10-30, « r oui » : R1-R4) : l'aura tient **3** fins de tour (`toursAura`) ; une aura neuve dit au-dessus de l'ennemi qui peut la faire réagir (« ◈ Feu · ludwing, Aël, Korrah », `quiReagit`) ; dans la liste des capacités, celle qui ferait réagir une aura déjà posée porte le signe de la réaction sur son icône (`marqueListe`) ; une **attaque combinée** (type 25 ou unisson) porte ses deux éléments et réagit seule s'ils réagissent ensemble (le Combo Crépuscule fait le Crépuscule, Feu Attisé répand son Feu ; sur une aura, celui des deux qui réagit joue). Mesure (3 parties de chaque côté) : ~21 → ~63 réactions par partie, 3,05 → 3,07 tours, boss 46 → 49 sur 60 — dans le bruit. Banc : `navigateur/les_reactions.js` (43 contrôles) ; `la_parole` accepte la v2.

**Les signatures** (2026-10-22 ; JOKO : *« Oui tout »* puis *« rendre les vraiment intéressant et original »*).
Une par héros, tirée de son **profil écrit** (`Actors.json`), branchée sur un art ; chaque chiffre est un
réglage. **Vesper, le contre-temps** (*« spécialiste de la CONTRE-ATTAQUE »*, LeMouvement `contreTemps`) : une
riposte qui part pendant le tour ennemi (Reflux, Renvoi — MaitriseVoies appelle `LeMouvement.riposte`) fait
monter son flux ; au 3, la riposte est un geste juste ×1,5 ; un coup de 15 % qui brise sa posture passe
avant. `<Riposte>` (Garde Haute, Garde Écarlate) arme une riposte qui rend ce qu'elle reçoit ;
`<ApresRiposte>` (Le Coup qu'On Garde, Contre-Courant, Ressac) ×1,5 si elle a riposté depuis sa dernière
action. **Korrah, penser juste** (*« frapper juste ET penser juste »*, `penserJuste`) : dans une posture, sa
Parole ne rompt rien — flux +1, ×1,15, le geste juste peut tomber sur elle ; le mouvement d'après compte
comme une autre Voie. `<Lecture>` (Lecture du Corps, Œil du Stratège, Analyse Tactique) : l'ennemi est lu, son
prochain mouvement sur lui ×1,5. **ludwing, le piège et la chance** (*« maître du rage-bait »*, *« le plus
CHANCEUX du groupe, littéralement »*, LEcrit `acteursPiege`, `acteursChance`) : ses écrits sur un ennemi partent
tout seuls quand cet ennemi le frappe (ᛟ Piège !) ; chaque écrit qui part a 1 chance sur 4 de rester écrit
(🍀). **Aël, pour elle** (*« oser dire et faire des choses pour ELLE »*, LaParole `pourElle`) : compléter une
phrase qu'elle a commencée ne la referme pas (Double puis Fusion sur le même élément), ×1,2 ; Double et
Fusion s'annoncent maintenant au-dessus de qui parle. Les dons ne sont pas touchés. Banc :
`navigateur/les_signatures.js`.

**Les verbes des trois arts** (2026-10-22 ; JOKO : *« Oui rework tout »*, *« Extrêmement développé et
extrêmement intéressant surtout jouable et dans les règles »*). Chaque capacité reworkée reçoit **un verbe de
SON art**, tiré du nom ou de la description que JOKO lui a donnés, et **une ligne de description** (noms,
formules, coûts, niveaux inchangés ; tous les chiffres sont des réglages). **Corps** (LeMouvement) :
`<Ouvre>` (posture avec 1 de flux), `<Finit>` (tout le flux dans le coup, ×1,3 par point), `<Reprise>`
(répétée : ×1,2 puis ×1,5 au lieu de s'user), `<Sur>` (ne rate pas, ne s'use pas), `<Entre>` (×1,5 sur un
ennemi qui a déjà agi ce tour), `<Grace>` (×1,5 sous 25 % de PV), `<Immobile>` (×1,5 si pas touchée depuis
sa dernière action), `<Accumule>` (+15 % par riposte de Vesper gardée), `<EclatNoir>` (MaitriseVoies :
sûr avec 2 de flux). **Parole** (LaParole) : `<Reste>` (la phrase tient un tour de plus), `<Assez>` (ferme la
phrase : son élément, ×1,5), `<MotJuste>` (l'élément fondamental qui marche le mieux, laissé en suspens),
`<Suspend: n>` (le ciel d'Aël prête son élément), `<Viens>` (sa Parole suivante à une cible les prend tous),
`<Pars>` (l'ennemi passe en dernier), `<Nomme>` (la prochaine Parole sur lui ×1,3). **Écrit** (LEcrit) :
`<Cercle>` (ses écrits sur la cible ne coûtent rien tant qu'il attend), `<Referme>` (il part, tout part),
`<Sceau: n>` (n % : l'ennemi perd sa prochaine action ; pas un boss), `<Pret>` (qui frappe l'allié referme
les pièges de ludwing), `<Symbole>` (compte double dans la résonance), `<Appat>` (Vannes : les ennemis
touchés frappent celui qui les a provoqués). **Premier paquet, 37 capacités** — Vesper : Le Point Final,
Exécution, Reprise du Marteau, Trempe, Cri de Fureur, Grande Marée, Enclume, Le Sang Répond, Brise-Garde, et
Saignée Continue devient **son écrit** (*« on attend que ça fasse effet »*, 7 % PV — redevenue un mouvement le 2026-10-25,
voir « L'écrit, c'est le mana spirituel ») ; Korrah : Le Creux Entre
Deux, Coup de Grâce Éclair, L'Immobile, Éclat Noir, Maîtrise, Angle Impossible, Vider le Geste, Focalisation ;
ludwing : Vannes, Tracer le Cercle, Territoire Scellé, La Règle du Lieu, Faire Douter, Ombre Prêtée, Le
Symbole, Âme d'Ombre ; Aël : « Reste. », Lumière Tenue, « Assez. », « Pars. », « Viens. », Le Mot Juste, ses
trois ciels, Volée Nommée, Pluie Nommée. **Deuxième paquet, 14** (verbes neufs du corps : `<Lache>` ×1,5 mais
elle encaisse ×1,5 jusqu'à sa prochaine action ; `<Premier>` part avant tout le monde ; `<NeufVoies>` +10 % par
Voie déjà prise dans le combat ; `<ToutOuRien>` pile ×2, face ×0,25, ludwing tire deux fois ; et `<Riposte>`
s'arme aussi en frappant) — Vesper : Marteau à Deux Mains (`Lache`), Ouvrir, Tout Ce Qui Coule, Faille
d'Armure, Garde Sereine ; Korrah : Prendre l'Élan, Plus Vite que le Geste, Carnage des Neuf Voies, Verdict de
l'Équilibre (`Assez`) ; ludwing : Tout ou Rien, Contre-Éclat, Contre Totale, Ce Qui Ne Devrait Pas Toucher
(`Sur`) ; Aël : La Parole Tenue (`Reste`). Une description déjà sur deux lignes n'est jamais écrasée.
**Troisième paquet, 11** (verbes neufs : `<Avec>` — Parole — frappe aussi avec l'élément en suspens et laisse
la phrase ouverte, *« une flèche, un mot : les deux partent ensemble »* ; `<Leurre>` — corps — esquive +30 %
jusqu'à sa prochaine action, *« il n'y a plus moyen de savoir lequel est lui »* ; ludwing esquive déjà 35 %) —
Vesper : Vague Basse, Prix du Sang (`Lache`), Coup Furieux, Onde de Rage ; Korrah : Éclat Bref, Rien de Visible ;
ludwing : Ombres Multiples, Sept Éclats (`Reprise`), Lame d'Envers (`Sur`), Porte Entrouverte (`Reste`) ; Aël :
Trait Clair. **Quatrième paquet, le soutien et le reste, 104** (JOKO : *« OUI CONTINUE TOUT »* ; verbes neufs :
`<Encourage>` — Parole — l'allié frappe ×1,2 à sa prochaine action ; `<Devant>` — Parole, posé par un soin,
une réanimation ou une purge de n'importe quel art — l'allié agit en premier au tour suivant ; `<Rythme>` —
corps — un allié en posture prend un point de flux, jamais jusqu'au geste juste ; `<Rempart>` — écrit — quand
il part sur un allié, le prochain coup qu'il reçoit ÷2) : les soins de la Source donnent du rythme, les murs
écrits (Cloison, Halo, Barrière Magique, Abri, L'Équilibre Tenu, Encouragement, Transfusion) sont des remparts,
les réanimations et les purges font passer devant, les Renvois et Parades d'Aël arment une riposte, ses
attaques du Miroir et du Domaine prennent les verbes du corps, et Fil de Vie (Vesper) appâte l'ennemi sur elle.
**Bilan** : 193 capacités portent un verbe (avec les 28 de Korrah liées à seiryu) ; les 35 Paroles des échelles
gardent leur degré ; 17 qu'un ennemi utilise et 11 attaques à plusieurs ne changent pas ; restent sans verbe,
exprès, les **formules de base** (Feu, Étincelle, Rayon Stellaire, Trait Spectral, Comète, Double Attaque —
*« la formule basique où tu l'envoies juste »*), les ultimes du livre et du ciel d'Aël, ses flèches du Miracle,
et les pièces d'autres systèmes (copie d'Âme, Pacte d'Âme, la Mue, Marquer la Cible, « Assez. » au hasard).
Banc : `navigateur/les_verbes.js`.

**Sur le PC de JOKO** : Node 24 et Playwright (dans `node_modules/`, ignoré) sont installés depuis
le 2026-10-17. Les bancs navigateur y tournent lentement (Chromium sans carte graphique) :
`les_outils_de_scene` y fait 7 échecs de minutage, et `seiryu_et_lhiver` son contrôle « à l'écran, il
s'efface » (opacité ~200/255 au moment de la mesure), les mêmes sur la version d'avant — pas des bugs.
Les bancs qui jugent en temps réel (`jouer`, `le_combat_tactique`…) échouent aussi si un autre banc
lourd tourne en même temps : les lancer seuls.
**Ils font chauffer son PC** (JOKO, 2026-10-23 : *« il chauffe trop, il crée des moments parfois »* — Chromium
dessine le jeu au processeur) : un banc navigateur à la fois, seulement ceux que le changement touche, bridé à
2 cœurs en priorité basse — `cmd /c start "" /b /wait /low /affinity 3 node bancs/navigateur/<banc>.js`
(Chromium hérite de la bride ; `les_verbes` y prend 17 s, comme sans) — et rien qui reste tourner après.
Bridé, `le_royaume_imperial` rate « le compteur descend sans qu'aucun tour passe » (35 à 48 images en 4 s au début du
combat : le compteur reste à 120 s), la même chose sur la version d'avant — pas un bug. `les_boss` rate deux contrôles de
Dono (« Dono et son Esprit sont dans la troupe 33 ») depuis que JOKO a mis l'Arbitre de l'Ordre d'Or (37) à sa place
dans la troupe 33 : le banc attend encore Dono — à JOKO de dire où vit le duo maintenant.

**Pièges de MV rencontrés ici :**

- `Math.max(eval(formule), 0)` — une formule négative fait **0 dégât**, jamais un soin ;
- une soustraction `a.atk * k - b.def * k` tombe à **0** contre la DÉF de fin de partie. Formule
  ratio : `Math.floor(a.atk * K * 200 / (200 + b.def))` ;
- une compétence dont le **type n'est ouvert par aucun trait** est apprise mais **invisible** dans
  tous les menus ;
- MV n'applique `numRepeats()` que dans son propre enchaînement : une action jouée à la main (celle
  de l'Avatar) doit boucler elle-même ;
- les métadonnées gardent l'espace après le `:` — `<Forme: objet>` donne `" objet"`, il faut
  `trim()` ;
- un état retiré pendant une action **ne peut pas être reposé** dans la même action
  (`_result.isStateRemoved`) : `addState` refuse en silence. MV vide le résultat avant chaque coup ;
  un code qui pose un état hors de ce chemin doit faire `clearResult()` d'abord ;
- un message d'état s'affiche **collé au nom** (`nom + message1`) : pas de `%1`, il faut écrire
  `" surchauffe !"`.
- YEP_BattleEngineCore **remet `repeats` à 1** au chargement : les coups d'une compétence à
  `<target action>` sont ses lignes `action effect`. Pour frapper deux fois, doubler la liste des
  cibles (`numRepeats`) ;
- chez YEP, les états « fin de tour » **s'usent dans `regenerateAll`** : un banc qui la neutralise
  fige aussi leurs tours ;
- `BattleManager.queueForceAction` **vide les résultats de tout le monde** : lancé pendant un coup,
  il efface l'« esquive » et les popups. Le lancer à `onAllActionsEnd`.
- `Game_Battler.forceAction` **efface les actions prévues** de celui qu'on force : une riposte ou une
  contre-attaque avant son tour lui mangeait son tour. Passer par `Interactions.forcer`, qui les rend ;
- l'**Attaque** est du type 1 : l'État de Flow (état 87, qui scelle 1, 2 et 3) la scelle — dans le
  Flow, Vesper frappe avec ses arts et ses Arts Sereins.
- un `$gameMessage.add` fait **dans le rappel d'un choix** n'apparaît jamais : MV vide le message
  juste après (`terminateMessage`). Passer par l'interpréteur (`setupChild`) ;
- **YEP_MessageCore jette les lignes au-delà de 4** dans un même message : découper en messages de
  4 lignes ;
- **MOG_TimeSystem ignore « Teinter l'écran »** (commande 223) tant que `$gameMap._timesys_tintscreen`
  est vrai — sur toute carte où l'heure colore l'écran. Couper d'abord (`_timesys_tintscreen = false`,
  `$gameSystem.tint_screen(false)`), rendre la main ensuite (`startTint($gameSystem.set_tint_phase(), n)`) ;
- un tableau créé **hors du jeu** (une autre page, une iframe parente) n'a pas `Array.prototype.clone`
  de MV : GALV_TimedMessagePopups plante sur `this._params.clone`. Passer par `W.JSON.parse` du jeu ;
- un état qui **immobilise** (restriction 4) et qui a « Retirer à l'immobilisation » (`removeByRestriction`,
  comme l'état 2 du jeu) **s'enlève à l'instant où il est posé** : la brisure ne doit avoir ni ça, ni
  « Retirer aux dégâts » ;
- une compétence créée **en mémoire** n'a pas `multipleElements` : YEP_ElementCore lit
  `<Multiple Elements>` au chargement de la base seulement ;
- `SeiryuLeFamilier` pose **`Game_Actor.prototype.canInput`**, qui rappelle le `canInput` de
  Game_BattlerBase **de son moment** : un plugin chargé après qui ne réécrit que Game_BattlerBase
  n'est jamais lu chez les héros (la réservation de DoubleX Unison ne l'était pas). Le poser aussi sur
  Game_Actor ;
- YEP_BattleEngineCore donne un **tour gratuit** (`_freeStateTurn`) à un état « fin d'action »
  posé sur le combattant **en train d'agir** : il dure un tour de plus que sur un autre. Pour un
  état qui doit faire perdre exactement un tour, prendre « fin de tour » et régler la durée selon
  que la cible a déjà joué (`BattleManager._performedBattlers`) ;
- YEP_BattleEngineCore rend les cibles **immortelles pendant toute l'action** (« immortal: targets, true »
  dans sa séquence par défaut) : un ennemi tué reste à 0 PV sans `isDead()` jusqu'à la fin du coup. Un
  code qui compte une mise à mort dans `executeDamage` doit lire « 0 PV et immortel » (PorteurDAmes et
  le Marqué de LeRegistre ne comptaient jamais l'âme d'une mise à mort — corrigé le 2026-10-22) ;
- **supprimer une carte dans l'éditeur supprime toutes ses cartes filles** : le 2026-10-29, l'ancienne Forêt Perdue
  (35) a emporté ses 11 filles (le Village Montagnard et ses 3 quêtes, la Forteresse…) — voulu, d'après JOKO ;
  une carte qu'on garde se déplace d'abord sous une autre ;
- MV transforme la sauvegarde en texte dans `saveGameWithoutRescue`, **après** `makeSaveContents` : ce qu'on retire
  du contenu pour ne pas le sauvegarder doit l'être autour de `saveGameWithoutRescue` ;
- un tableau d'objets du jeu rangé sur `$gameMap` (la liste `_viePNJ` de VieDuVillage) est sauvegardé **en copie** :
  au chargement, ce ne sont plus les événements de la carte. Le refaire à chaque carte chargée (`onMapLoaded`) ;
- `Game_Event` appelle `refresh` dès sa construction : un plugin qui lit la Note à ce moment-là (Habitants) ne sait pas
  encore ce qu'on va poser sur l'événement juste après — relancer sa lecture ;
- une heure de jeu (MOG_TimeSystem) dure **25 secondes** à 60 images par seconde : un banc qui pose l'heure pose
  aussi les minutes (`set_minute(0)`), sinon elle change pendant qu'il regarde ;
- sans carte graphique, Chromium tourne parfois ici à ~10 images par seconde : un banc attend que la chose arrive
  (`waitForFunction`), jamais un nombre fixe de secondes ;
- une bulle (« Afficher une bulle », attendre la fin) ne finit que quand **son sprite** l'a jouée : MV garde `_balloonId`
  jusque-là. Un banc qui fait tourner un interpréteur à la main, sans dessin, doit la finir lui-même
  (`_balloonId = 0; endBalloon()`), sinon la page « ne finit pas » ;
- un banc qui saisit les commandes lui-même doit passer par les fenêtres (`commandAttack`,
  `onSelectAction`, `onEnemyOk`) : tant qu'une fenêtre de commande reste active, Scene_Battle
  n'appelle plus `BattleManager.update` et le combat se fige sans erreur.

---

## 8. Git

**Ce qui est pour le jeu va directement sur `main`, sans pull request.** JOKO, le 2026-10-14 :
*« pas de pr (pour ce qui est pour le jeu.) Met sur le main directement »*. Je travaille sur la
branche que la session désigne, puis je pousse aussi sur `main` en avance rapide
(`git push origin HEAD:main`) — jamais en force : si `main` a bougé, je récupère d'abord ses
commits. Pas de pull request sans demande explicite.
