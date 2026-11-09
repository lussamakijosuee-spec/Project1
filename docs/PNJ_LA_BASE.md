# Les PNJ — la base avant la refonte

*Analyse du 2026-11-09, demandée par JOKO avant la refonte de tous les PNJ :*
*« analyse les comportements humains […] comment on pourrait être dans cette société-là, les choses qu'on
pourrait raconter […] pour qu'on ait déjà une base pour faire un PNJ prêt à pile », « plonge dans le lore,
dans Internet aussi, pour t'inspirer […] Persona, Stardew Valley […] pas copier », « l'effet du lore doit
être en rapport avec le présent : il y a certaines choses que les enfants de 9 ans ne peuvent pas savoir ».*

Rien du jeu n'est modifié par ce document. Il sert à écrire chaque PNJ de la refonte, et à vérifier
chacun avant de le poser.

---

## Sommaire

1. [En une page](#1-en-une-page)
2. [Ce que font les jeux où l'on s'attache aux gens](#2-ce-que-font-les-jeux-où-lon-sattache-aux-gens)
3. [Les règles d'écriture qu'on en tire](#3-les-règles-décriture-quon-en-tire)
4. [Le village aujourd'hui : la situation exacte](#4-le-village-aujourdhui--la-situation-exacte)
5. [Qui sait quoi : la chronologie vue par âge et par lieu](#5-qui-sait-quoi--la-chronologie-vue-par-âge-et-par-lieu)
6. [Le gabarit d'un PNJ prêt à l'emploi](#6-le-gabarit-dun-pnj-prêt-à-lemploi)
7. [Exemple complet : Fernand](#7-exemple-complet--fernand)
8. [Ce qu'il faudrait au moteur (proposé)](#8-ce-quil-faudrait-au-moteur-proposé)
9. [Ce qui contredit aujourd'hui, à corriger pendant la refonte](#9-ce-qui-contredit-aujourdhui-à-corriger-pendant-la-refonte)
10. [Questions pour JOKO](#10-questions-pour-joko)
11. [Sources](#11-sources)

---

## 1. En une page

**Pourquoi les PNJ sonnent « bot » aujourd'hui** (relu sur leurs fiches, `bancs/outils/habitants/`) :

- **tout le monde a la même voix** : phrases courtes, chute drôle à la fin (« Pour quel hiver ? Le leur. »,
  « Souvent, c'est le miel. »). Fernand, 78 ans et sourd, a le même rythme qu'Élise, 9 ans ;
- **« Discuter » tire une phrase au hasard** : elles reviennent vite, et rien ne relie une visite à la suivante ;
- **leur histoire est écrite dans la fiche, pas vécue à l'écran** : le secret, la peur et le rêve existent
  dans les données, le joueur ne les découvre presque jamais ;
- **ils expliquent le monde au lieu d'y vivre** : « L'imprégnation, ils appellent ça… », la Chancellerie, les
  points de retour. On dirait un guide, pas des voisins ;
- **ils savent tous la même chose**, quel que soit leur âge ou d'où ils viennent.

**Ce que les meilleurs jeux font** (Persona, Stardew Valley, Trails, Hades, Disco Elysium, Undertale…) : les gens
ont **une vie sans toi** (une routine, des soucis), **se révèlent par des scènes** et pas par un interrogatoire,
**changent quand le monde change**, **se souviennent** de ce que tu as fait ou dit, **ne se répètent pas**, et
mélangent **le drôle et le sincère**. Ce que les joueurs reprochent : la répétition, l'exposé du lore, les PNJ
qui ne sont qu'une fonction (marchand, donneur de quête), l'amitié qu'on achète avec des cadeaux, et les
personnages qui deviennent des outils.

**Ce que la Bible donne pour notre village** : c'est **« le village du donjon des eaux »**, d'où part la
première expédition d'Edwin, de Vesper, de Ludwig et d'Aël, *« encadrée par la garde royale »*. Sa faille
s'ouvre sur **l'Étang-Miroir, dans les Larmiers**, la région de **la Tristesse** (page Notion « Nature et
régions »). Pour les PNJ, c'est une chance : le chagrin qui déborde de la faille donne une raison, tirée du
lore, à ce qu'ils s'ouvrent plus facilement sur leurs regrets et leurs souvenirs. C'est sentimental sans être
sombre.

**La méthode proposée** :
- un **gabarit** de PNJ (partie 6) ;
- une **table de « qui sait quoi »** selon l'âge, le lieu et le métier (partie 5) ;
- quinze **règles d'écriture** qui se vérifient (partie 3) ;
- un **exemple complet** (partie 7).

La refonte se fait ensuite carte par carte, chaque PNJ vérifié avec la liste avant d'être posé.

---

## 2. Ce que font les jeux où l'on s'attache aux gens

| Jeu | Ce qui est mis en avant | Ce que les joueurs aiment | Ce qu'on lui reproche |
|---|---|---|---|
| **Persona 3-4-5** (Social Links / Confidants) | Un lien par personnage, qui monte par **rangs** ; chaque rang est **une scène** ; les gens ont **leurs horaires et leurs lieux** et ne sont pas toujours là. | Une histoire personnelle qui avance jusqu'à un vrai changement du personnage, que le joueur accompagne. | P5 donne un **bonus de jeu** à chaque rang : un analyste écrit qu'il *« réduit les personnages à des outils »*. Dans P3, un lien négligé se **renverse** : plus vrai, mais frustrant. |
| **Stardew Valley** | **Routines** quotidiennes et saisonnières ; lignes selon la saison, la météo, le niveau d'amitié et les événements ; des **scènes de cœur** à paliers. | Le village vit sans toi. Les villageois non romançables (parents, commerçants, enfants) rendent la ville habitée. | Les **cadeaux** valent plus que parler, sont *« transactionnels et prévisibles »*, et les PNJ ne refusent jamais. Certaines scènes parlent du personnage et jamais **du lien** avec le joueur. |
| **Trails / Kiseki** (Falcom) | **Chaque PNJ a quelque chose de neuf à dire après chaque étape de l'histoire**, et suit sa propre petite histoire en parallèle. | *« Every NPC has their own history and ambitions »* (presse). Le président de Falcom dit que c'est leur marque de fabrique. | Avec des centaines de PNJ, **faire le tour devient une corvée**. |
| **Hades** | Des milliers de lignes, **déclenchées par des conditions précises** : ce qui vient de t'arriver, qui t'a tué, ce que tu as trouvé. | On ne réentend presque jamais la même réplique, et chacune réagit à ta partie à toi. | Rien de notable ; c'est un énorme volume d'écriture. |
| **Disco Elysium** | Les personnages **se révèlent par les situations**, pas en vidant leur arbre de dialogue (*« Not by clicking on him and cleaning out his tree »*) ; des milliers de **petits interrupteurs** qui font des ricochets plus tard. | Même un prêteur sur gages a une histoire et des avis sans rapport avec l'intrigue ; la règle de l'équipe : *« est-ce que ça sonne vrai ? »*. | — |
| **Undertale** | Chaque PNJ, même mineur, a un petit **arc émotionnel** ; le monde **réagit** à ce que tu as fait. | **Drôle, puis soudain sincère** : on rit d'un personnage, puis on tient à lui. | Certaines blagues s'usent. |
| **Animal Crossing** | Les habitants **parlent les uns des autres**, te posent des questions et **répètent ta réponse** aux autres. | Les ragots et les petites lettres des anciens épisodes. | New Horizons est jugé plus pauvre : conversations sans profondeur, relations peu développées. |
| **Fire Emblem** (soutiens) | Des **conversations à deux**, à paliers (C, B, A), qui révèlent les personnages par **contraste** (l'innocent face au dur). | Mieux connaître les personnages hors de l'intrigue. | Certains soutiens tombent dans le cliché. |
| **Red Dead Redemption 2** | Saluer ou provoquer chaque passant ; les gens **se souviennent** de ton honneur et de ce que tu as fait pour eux. | Un vétéran à qui Arthur a parlé lui fait plus tard un éloge ému. | — |
| **Kingdom Come** | Des milliers de PNJ qui suivent **leur routine**, que le joueur soit là ou non. | L'impression d'entrer dans un village qui fonctionne (presse), des dialogues tantôt sobres, tantôt drôles. | Des villageois qui font des allers-retours absurdes, ou qui **attendent le joueur en file**. |
| **Skyrim** (contre-exemple) | Des répliques partagées par tous les gardes. | — | *« J'ai pris une flèche dans le genou »* : la même ligne chez des dizaines de gardes est devenue une blague, et des mods ont été faits pour l'enlever. |

**Ce qui revient partout :**

1. **Ils ont une vie sans toi.** Routines, métiers, soucis à eux. *(Stardew, Kingdom Come, Trails)*
2. **Ils se révèlent par des scènes, à leur rythme.** Ils ne déballent pas leur passé à la première rencontre ; la
   confiance s'ouvre par paliers, et chaque palier est un moment, pas une ligne. *(Persona, Disco Elysium, Fire Emblem)*
3. **Ils changent quand le monde change.** Une étape de l'histoire, et tout le monde a quelque chose de neuf à
   dire. *(Trails)*
4. **Ils réagissent à toi.** Ce que tu viens de faire, ce que tu as répondu la dernière fois : de petits
   interrupteurs qui font des ricochets. *(Hades, Disco Elysium, RDR2)*
5. **Ils parlent les uns des autres**, et se trompent. *(Animal Crossing ; c'est aussi la vie de village réelle,
   voir partie 4)*
6. **Drôle et sincère dans la même personne.** *(Undertale)*
7. **Ce que les joueurs détestent** :
   - la même réplique deux fois *(Skyrim)* ;
   - le PNJ réduit à sa fonction *(Disco Elysium)* ;
   - l'amitié achetée *(Stardew)* ;
   - le personnage-outil *(Persona 5)* ;
   - trop de choses à aller vérifier *(Trails)* ;
   - les explications que tout le monde dans ce monde connaît déjà *(l'exposé de lore)*.

---

## 3. Les règles d'écriture qu'on en tire

Chaque règle se **vérifie** sur une fiche avant de la poser (la liste de contrôle est en partie 6).

1. **Une voix par personne.** Lis ses lignes sans son nom : on doit savoir qui parle. On varie la longueur des
   phrases, les mots, le tic, la façon d'appeler le joueur, et les fautes. Un vieux paysan dit « je l'avais pas
   vu venir », une élève de Rubis dit « techniquement ».
2. **Pas de chute à chaque phrase.** Le trait d'esprit est un tic de certains personnages, pas la façon de parler
   de tout le village. Certains traînent, se reprennent, ne finissent pas leur phrase, posent une question.
3. **Du concret.** Un prénom, un objet, un jour, un endroit du village. « Ma femme faisait du pain aux glands »
   plutôt que « on avait faim ».
4. **Le sous-texte.** Personne ne dit « je suis triste ». On parle du linge, du temps, de la soupe ; le reste
   s'entend dessous.
5. **Personne n'explique ce que tout le monde sait.** Au village, on ne définit pas l'imprégnation : on dit qu'on
   dort mal « depuis la grotte ». Une explication n'est permise qu'à quelqu'un dont c'est le métier, et seulement
   à quelqu'un qui ne sait pas (Edwin est *« incapable d'une explication courte »* : chez lui, c'est un trait de
   caractère).
6. **Il ne sait que ce que sa vie lui a appris.** Son âge, l'endroit où il a vécu et son métier décident de ce
   qu'il sait, de ce qu'il ignore et de ce qu'il croit à tort (partie 5). Un enfant de 9 ans n'a jamais connu la
   famine ; un vieux de 78 ans se souvient du temps où la grotte n'était qu'une grotte.
7. **Il a une vie sans toi.** Il parle d'abord de ce qu'il fait, de ce qui l'occupe, de ce qu'il rate. Le joueur
   n'est pas le centre de sa journée.
8. **Il ne raconte pas sa vie au premier venu.** À la première rencontre, de la politesse, de la méfiance ou de
   la curiosité. Un secret se laisse deviner avant de se dire (« c'est une vieille histoire… »), il ne se cache
   pas complètement.
9. **Il te pose des questions et se souvient de tes réponses**, puis en reparle plus tard, ou le répète aux autres.
10. **Il change avec le village et avec toi.** Chaque étape (la faille déclarée, la garde qui arrive, la première
    expédition qui part, qui revient…) lui donne quelque chose de neuf à dire.
11. **Le drôle et le sincère dans la même personne.** On peut rire de Fernand et être ému par lui dans la même
    conversation.
12. **Une faiblesse, même chez les forts**, et une force chez les faibles.
13. **Sentimental, jamais sombre** (on est hors du Chapitre 1). Des regrets, de la tendresse, des deuils anciens
    et apaisés, de la nostalgie, des espoirs. Pas de violence crue, pas d'exécution, pas de mort récente
    racontée en détail. Les lignes « dures » d'avant (`DUR` dans `_communs.js`) n'ont plus leur place.
14. **Les gens parlent les uns des autres, et se trompent.** Les ragots font tenir un village et font sa
    réputation (partie 4). Mireille se trompe une fois sur deux, et c'est voulu.
15. **Personne n'est réduit à sa fonction.** Même un marchand a un avis sans rapport avec ce qu'il vend, et un
    garde pense à autre chose qu'à sa porte.

---

## 4. Le village aujourd'hui : la situation exacte

### Ce que disent la Bible et tes pages Notion

| Fait | Source |
|---|---|
| C'est **« le village du donjon des eaux »** : *« le point de départ de la première expédition d'Edwin Bramble et d'Aël, encadrée par la garde royale, avec Vesper et Ludwig »*. | Bible, « Autour de Haute-Taville » ; chronologie, « Aujourd'hui » |
| Il est **près de Haute-Taville**, la capitale *« bâtie sur des falaises au-dessus d'un lac »* (JOKO : *« pas très loin de la capitale »*). Autour d'elle, *« les nombreuses failles de niveaux 1 et 2 »*. | Bible ; JOKO, 2026-11-09 |
| Sa faille est dans la **grotte** (la Caverne de Pierre, carte 28), et c'est un **donjon du Chapitre 1** : niveau 1. | JOKO, 2026-10-30 et 2026-11-09 ; Bible : *« Le niveau indique le Chapitre »* |
| Derrière : **l'Étang-Miroir, dans les Larmiers**, *« des marais à perte de vue sous une pluie presque quotidienne […] mélancolique, lente »*. L'émotion dominante de la région est **la Tristesse** (*« la pluie tombe, l'eau monte, le froid s'installe »*). | Notion : « Nature et régions », « Le Chapitre 1 dans le jeu » |
| Elle est **neuve et inexplorée** : personne au village ne sait ce qu'il y a derrière. | JOKO, 2026-11-09 |
| **Gardes et aventuriers vont venir** (pas encore posés). La garde royale *« encadre les élèves de l'Académie Rubis dans leurs premières failles »* ; *« tous partent pour leur première faille sauvage autour de la sixième [année], encadrés par la garde royale »*. | JOKO ; Bible (garde royale, Académie) |
| L'imprégnation : *« Ceux qui vivent près d'une faille connaissent l'imprégnation : des nuits agitées, des humeurs qui ne sont pas les leurs »* ; près d'une faille de niveau 1, *« les émotions s'emballent »*. | Bible, « Les gens ordinaires », « L'imprégnation » |
| Les gens ordinaires *« n'ont ni don, ni manifestation, ni licence. Ils vivent de la terre, de l'artisanat ou du commerce, et regardent les aventuriers avec un mélange d'admiration et de crainte »*. | Bible |

**Lecture proposée (à confirmer)** : puisque la faille donne sur la région de la Tristesse, l'imprégnation qui
déborde sur le village serait surtout du **chagrin** : des larmes qui viennent sans raison, des morts auxquels
on repense plus fort, des rêves d'eau et de pluie, une mélancolie qui prend certains jours et pas d'autres. La
Bible ne le dit pas mot pour mot : elle dit que *« la source du Chapitre qui se trouve derrière déborde »*, et ta
page Notion dit que les Larmiers sont la Tristesse. C'est une explication tirée du lore à ce que les gens soient
plus sentimentaux depuis la grotte.

### Ce que fait une faille neuve à un village

**La procédure** (Bible, « Le déroulement d'une expédition ») :
1. le **signalement** : quelqu'un repère la faille et la déclare à la Chancellerie ;
2. l'**évaluation** : un évaluateur fixe un niveau et un rang de menace provisoires ;
3. le **permis**, délivré à une guilde, à la garde royale ou à une équipe agréée ;
4. l'**équipe** ;
5. l'**entrée**, en posant des points de retour ;
6. le **rapport**.

Chaque étape amène au village des gens nouveaux :

| Qui arrive | Ce qu'il fait au village | Source |
|---|---|---|
| **L'évaluateur de la Chancellerie** (*« la plupart de ses agents ne sont pas de grands combattants »*) | Mesure, pose des questions, remplit des papiers, prend une chambre à l'auberge. | Bible, Chancellerie |
| **La garde royale** | Un poste près de la grotte, des consignes d'évacuation, les *« deux règles que chaque garde apprend par cœur »*, et les élèves à encadrer. *« Ce qu'elle veut : que personne ne meure faute d'escorte. »* | Bible, garde royale, la Chute |
| **Les élèves de sixième année de Rubis** (Edwin, Vesper, Ludwig, Aël, leurs camarades) | Leur première faille sauvage. Les gens *« aiment bien les élèves et détestent leurs accidents »*. | Bible, Académie, Basse-Brume |
| **Les guildes** : la Veilleuse (le mentorat, *« que chacun de ses membres rentre vivant »*), le Voile-Soleil (*« les contrats les mieux payés, et les plus risqués moralement »*), les Crocs (*« plus de territoire, plus vite »*, ils *« testent les barrages »*) | Elles recrutent, se disputent la concession, envoient des éclaireurs *« qui courent déclarer une faille »*. | Bible, les trois guildes |
| **Les francs-lames de la Bourse** | Des indépendants venus avec un contrat du tableau, et une place dans un chariot. | Bible, Bourse des Lames Franches |
| **La Confrérie des Reliquaires** (un Essayeur) | Elle vient voir ce qu'on rapportera. | Bible, Confrérie |
| **Les curieux, les colporteurs, les malins** | Ils vendent des cordes trop chères, des « porte-bonheur de faille » et des rumeurs. | Proposé |

**Ce que vivent les gens du village** : c'est la « ruée » des villes minières, où l'arrivée soudaine d'étrangers
apporte à la fois la richesse et le désordre. L'histoire des ruées vers l'or le montre bien :
- les prix montent : cordes, chambres, pain ;
- l'auberge et le bar débordent ;
- certains s'enrichissent en vendant aux nouveaux venus ;
- d'autres se sentent dépossédés de leur village ;
- le bruit, les inconnus et la peur arrivent.

Chacun le vit selon son métier et son âge :

| Qui | Ce que la faille change pour lui | Ce qu'il pourrait dire |
|---|---|---|
| **L'aubergiste, le bar, l'épicerie** | Plus de clients qu'il n'en a jamais eu ; de la fatigue ; des étrangers qui ne disent pas merci. | « Trois chambres pour neuf. J'ai mis des paillasses dans la remise. Ils paient bien. Ils ronflent mieux. » |
| **La forge, l'armurerie** | Des réparations jour et nuit, des commandes qu'on n'a pas les moyens de faire, des francs-lames qui marchandent. | « Une recrue m'a demandé une épée "comme celle du Héros". Je lui ai fait une épée comme celle d'une recrue. » |
| **Les paysans** | Des champs piétinés sur le chemin de la grotte ; des bêtes nerveuses ; la crainte qu'on leur prenne la terre près de la faille. | « Ils passent par mon champ de navets. Tous. Le chemin, c'est à gauche. » |
| **Les pêcheurs** | La rivière est loin de la grotte, mais on y rêve d'eau plus qu'avant. | « Depuis la grotte, je rêve d'un étang où le ciel est par terre. Je pêche dedans. Rien ne mord. » |
| **Les parents** | La peur que les enfants y aillent ; la peur d'une Chute ; l'argent qui arrive quand même. | « Si tu vois Élise sur le chemin du marécage, tu la ramènes. Par l'oreille. » |
| **Les enfants** | L'événement le plus extraordinaire de leur vie ; ils jouent « à la faille », imitent les élèves, collectionnent les rumeurs. | « Derrière la grotte, il y a un lac qui pleure. C'est Théo qui l'a dit. Théo sait tout. » |
| **Les vieux** | « Avant, la grotte, c'était une grotte » ; méfiance envers les nouveaux venus ; la mémoire des malheurs anciens. | « J'ai vu passer la famine, la révolution, la guerre. Maintenant, un trou. On verra bien. » |
| **Les gardes du village** | Plus de travail, des ordres venus d'en haut, la garde royale qui les regarde de haut, ou l'inverse. | « La garde royale m'a appris les deux règles. Je les connaissais. Je les ai répétées quand même. Ça leur fait plaisir. » |
| **Les jeunes de 16 à 20 ans** | La tentation de l'Admission ; les recruteurs des guildes ; l'envie de partir, et la peur de partir. | « La Veilleuse prend les débutants. La Veilleuse forme. Ma mère dit que la Veilleuse enterre aussi. » |

**Ce qu'on raconte** : des rumeurs, vraies ou fausses, à donner aux bons personnages. Une rumeur reste dans la
bouche de quelqu'un : ce n'est jamais un fait du monde.
- « Derrière, c'est un marais où il pleut tout le temps. » *(vrai, mais personne au village ne peut le savoir avant
  la première expédition : c'est une rumeur de guetteur ou d'élève)*
- « Là-bas, les morts reviennent. » *(vrai pour le Chapitre 1 : la Bible le dit, et* « certains endeuillés rêvent
  d'y porter le corps de ceux qu'ils ont perdus »*. Sujet délicat, à traiter avec douceur, et pas pour tout le monde.)*
- « Le Héros va venir fermer la faille. » *(faux, mais Donovano fait rêver)*
- « La Chancellerie va murer la grotte. » *(pas comme ça : une faille se ferme en détruisant son Nœud)*
- « On va tous être riches avec les braises. » *(les braises d'âme sont bien ce qu'on rapporte du Chapitre 1 ; le
  village ne sait pas ce qu'elles sont vraiment, et la Bible veut que presque personne ne le sache)*
- « Les démons d'Ardélia vont sortir par là. » *(la peur de la Guerre de la Marche, qui est loin d'ici)*
- « L'aiguille du mesureur d'imprégnation a sauté. » *(un relevé élevé est* « un avertissement, pas la preuve d'une
  Chute »*)*

**Les ragots font tenir un village.** Les historiens des villages anciens le décrivent : le bavardage y fait la
réputation de chacun et fait respecter les usages. Celui qui ne suit pas les usages se retrouve tenu à l'écart des
réseaux de voisinage. Pour nous :
- **chaque nouvel arrivant est jugé** ;
- **ce que fait le joueur se sait** ;
- **chacun a une réputation** (la commère, le menteur, la fille du forgeron) **qu'il subit ou qu'il cultive**.

---

## 5. Qui sait quoi : la chronologie vue par âge et par lieu

### Les événements de la Bible, comptés depuis aujourd'hui

| Il y a… | Ce qui s'est passé | Qui s'en souvient au village |
|---|---|---|
| ~2 siècles | Anésidora ouvre le Livre ; *Jour du Serment Brisé* (on compte les années depuis). | Tout le monde, comme on connaît l'histoire et la religion : « ailleurs, on se contente d'y penser ». |
| ~1 siècle et plus | Les guildes, la Confrérie, la Chancellerie des Failles. | Ce que tout le monde sait de son pays. |
| ~40 ans | Ardélia unifie le Chapitre 1. | **Personne** : ça se passe dans le Livre. On en sait seulement ce que la guerre a montré. |
| ~30 ans | **Début de la Guerre de la Marche** (*« les armées d'Ardélia forcent les failles »*) ; Martial Murhaut y commence ses décennies de front ; Mathias Ferhaut y devient une légende. | Les 45 ans et plus. Des vétérans des légions (Béran, « trois doigts ») ; des frères partis. |
| « une génération » | Une faille de niveau 3 sous les bas quartiers de Haute-Taville, *« classée sous surveillance »*. | Ceux qui ont vécu à la capitale. Au village, un vague souvenir. |
| ~25 ans | La Faille Captive sous l'Académie (*« la Couronne la tolère »*). | Des rumeurs. Les élèves de Rubis, eux, la connaissent de l'intérieur. |
| avant ~22 ans | **Le règne du roi Thibaut** : *« les impôts, la corruption et la famine »*. | Les 35 ans et plus s'en souviennent ; les 50 ans et plus l'ont vécu adultes, en nourrissant leurs enfants. |
| ~21 ans | **La révolution** : Lothaire trahit son oncle et se couronne ; *« il a baissé les impôts, reconstruit les routes […] Aurevel prospère, et le craint »*. | Les 30 ans et plus. Les plus jeunes ont toujours connu Lothaire. |
| ~20 ans | Naissance du prince Raphaël. | « Le prince a l'âge de ma fille. » |
| ~12 ans | **La Grande Chute** rase l'ancienne capitale d'Ostrevent ; *« les réfugiés se dispersent dans les six autres royaumes »*. | Les 20 ans et plus se souviennent des réfugiés qui arrivaient. Les moins de 15 ans ont toujours vu « les gens d'Ostrevent ». |
| « ces dernières années » | **Le Quartier Noyé** ; Donovano détruit seul la faille de niveau 3 et devient **le Héros**. | Tout le monde. Pour les enfants, c'est une légende vivante. |
| 6 ans | La promotion d'Edwin entre à l'Académie Rubis. | Annick, sa mère. Le village se souvient du départ du « petit ». |
| aujourd'hui | La faille de la grotte ; la première expédition d'Edwin. | Tout le monde, et chacun à sa façon. |

### Par âge : ce qu'ils ont vécu, ce qu'ils savent, ce qu'ils croient à tort

| Âge | Exemples au village | A vécu | Sait | Ne sait pas, ou croit à tort | Comment il parle de la faille |
|---|---|---|---|---|---|
| **7-10 ans** | Tomas (7), Sora (8), Élise (9) | Rien d'avant le Héros. Il avait 3 à 6 ans au Quartier Noyé. | Le Héros, la garde, « Corps, Âme, Esprit », ce qu'il entend à table. | Les mots de travers (« la Chancelière », « une faille de rang trois-quatre »). Croit tout ce que dit un plus grand. Ne sait pas ce qu'est la faim. | Émerveillé ou terrifié ; veut voir ; joue à y aller. |
| **11-17 ans** | Théo (11), Timothée (15), Lise et Prune (16), Ysaline, Edwin, Emma (17) | Né sous Lothaire. Avait 0 à 5 ans à la Grande Chute. | **Au village** : l'Admission, *« à partir de dix-huit ans »*, les guildes de nom. **Les élèves de Rubis** : l'académie de l'intérieur (la Faille Captive, la Descente, les Cercles), et Edwin sait *tout* par les livres. | **Au village** : les rangs et le métier, idéalisés. **Les élèves** : ils n'ont presque jamais vu de faille sauvage (*« Edwin Bramble n'avait jamais franchi de faille avant sa première expédition »*). | Rêve, impatience, vantardise ; la peur cachée chez les élèves. |
| **18-29 ans** | Odile, Jonas (18), Pia, Ninon, Bastien (19), Oswin (20), Colette (22), Casimir, jeck (24), Rose (25), Colin, Léonie (26), Bérénice (27), Mathis (27), Pervenche (28), Nell (29) | Enfant à la révolution : la famine n'est qu'un vague souvenir chez les plus âgés (« ma mère cachait le pain »). La Grande Chute à 6-17 ans : les réfugiés qui arrivent, un camarade d'Ostrevent. | L'Admission, c'est leur génération ; les guildes, la Bourse, les prix. | Que la paix a toujours été là. | L'occasion, ou le danger qui menace leurs proches. |
| **30-45 ans** | Rolf, Solange (33), Hilde (34), Kaze (36), Brunehaut (38), Roul, Selma (39), les Vannier (40), Margot (41), Merle (42), Silas, Firmin (44), Jacquot, Konrad, Mado (45) | **Adolescent pendant la famine**, jeune adulte à la révolution (le jour où la nouvelle est arrivée). Un frère ou un cousin parti à la Marche. Vingt ou trente ans à la Grande Chute. | Ce qu'il en coûte de manquer ; ce que Lothaire a changé (« on râle contre les prix : c'est qu'on mange »). | Peut idéaliser la révolution, ou garder une rancune. | Peur pour ses enfants ; l'argent qui arrive. |
| **46-65 ans** | Annick, Hélène (46), Bertrand (47), Gustave l'Essayeur, Baptiste (48), Gaudry, Mathurin, Tian, Madeleine (50), Gaspard (55), Ulric (57), Béran (58), Berthe (59), Mireille, Anselme (63), Orin (64) | **Parent pendant la famine** : il a nourri des enfants avec rien. Il avait 16 à 35 ans au début de la Guerre de la Marche : certains y ont servi. A peut-être pris part à la révolution, ou l'a subie. | Les vieux usages, les malheurs, qui a fait quoi au village il y a trente ans. | Peut confondre, mêler les dates, enjoliver. | Prudence, souvenirs de guerre ; ou l'aubaine. |
| **66 ans et plus** | Pépin (66), Anatole (67), Maude (68), Hector, Aldebert (70), Barthélemy (71), Odon (74), Régis (76), Fernand (78) | **Toute une vie sous Thibaut.** Se souvient d'avant la guerre, d'avant les cristaux à chaque coin de rue, du temps où la grotte n'était qu'une grotte. | La mémoire longue du village : les familles, les champs, les crues, les querelles. | Se méfie de tout ce qui est neuf ; « de mon temps ». Mais il en a vu d'autres. | « Encore une. » Philosophe, ou inquiet pour les petits. |

### Par lieu de vie : ce que ça change

- **Né au village** (la plupart) : il connaît la terre, la grotte d'avant la faille, les vieilles querelles. Pour
  lui, Haute-Taville, c'est « la ville » : on y va pour l'Admission, l'Hospice ou la Veillée du Retour en
  Basse-Brume.
- **Venu de Haute-Taville** (les élèves, Léonie la messagère, Ninon de la Bourse, Gustave l'Essayeur, Pervenche
  peut-être) : il connaît les quartiers des guildes, la Basse-Brume, le Quartier Noyé. Il trouve le village lent,
  ou reposant.
- **Réfugié d'Ostrevent** (aucun aujourd'hui, à proposer) : il avait tout il y a douze ans ; il connaît une Chute
  de l'intérieur, et sa peur est la plus réelle du village. La Bible le place *« dans les marges »* : au village,
  c'est quelqu'un qu'on a accueilli, ou à peine accepté.
- **De la frontière de Varkhal** : les voies d'art, la rivalité, l'honneur ; un accent.
- **Ancien de la Marche** (Béran) : il connaît les Chutes et les « démons » ; il sait que ceux d'en face ne sont pas
  ce qu'on dit, ou ne veut pas le savoir.
- **D'Ilmarée** (Tian, *« venu de loin »*, peut-être) : il sait d'où viennent les cristaux, et que presque tout passe
  par les ports.

### Par métier : le savoir qui va avec

| Métier | Ce qu'il sait mieux que les autres |
|---|---|
| Garde | Les *deux règles* de la Chute, les consignes d'évacuation, qui entre et qui sort. |
| Marchand, épicier | Ce qui se vend avant une expédition (*« balises de retour […] pansements, antidotes et fioles de récupération »*), le prix des cristaux. |
| Mage de quartier (Mirabelle), réparateur (Aldebert) | Les lanternes à cristal (*« une maison modeste n'a souvent qu'une lanterne à cristal »*), les sceaux de la Confrérie, les faux sceaux. |
| Messagère, charretier, coursière | Les routes royales, les relais, les nouvelles des autres villes. |
| Écrivain public (Jehan) | Les lettres de tout le monde ; les parchemins jumeaux, *« rares, chers »*. |
| Cartographe (Lucien) | Qu'aucune carte de l'autre côté n'existe : une zone vierge, son rêve et sa peur. |
| Guérisseur (Wendel) | Ce que les soins ne font pas (*« Soigner n'est pas réparer »*), ce que l'Église fait pour ceux qui reviennent. |
| Élève de Rubis | La doctrine (*« protéger ceux que l'âme n'a pas servis »*), les Cercles, la Faille Captive. |

### Ce que **personne** au village ne sait

Les secrets de la Bible ne sortent pas d'une bouche de villageois :
- le Linceul et qui tient le Marché d'Ombre ;
- le Vœu de Cendre ; Mélusine ;
- comment les armées d'Ardélia forcent les failles (*« le secret le mieux gardé du Chapitre »*) ;
- ce que pensent ceux d'en face (*« les Sans-Retour »*) ;
- ce que sont vraiment les braises pour les habitants du Chapitre 1 ;
- **le nom de ce qu'il y a derrière la faille** : les Larmiers, l'Étang-Miroir. La première expédition le découvre.

---

## 6. Le gabarit d'un PNJ prêt à l'emploi

Chaque PNJ de la refonte remplit cette fiche **avant** d'écrire une seule réplique. La colonne de droite dit où
la fiche va dans le moteur des habitants (`bancs/outils/habitants/moteur.js`, `oc/`).

| Champ | Ce qu'on y met | Dans le moteur |
|---|---|---|
| **Qui** | Nom, âge, métier, famille, où il vit, où on le trouve selon l'heure. | `oc` (âge, allure), `tags` (`<Logis>`, `<Agenda>`, `<Va>`) |
| **D'où, quand** | Où il est né, où il a vécu ; **les événements de la Bible qu'il a traversés et l'âge qu'il avait** (partie 5). | `oc` (nouveau champ « vécu ») |
| **Ce qu'il sait, ignore, croit à tort** | Trois lignes, tirées de « D'où, quand » et de son métier. | `oc` (nouveau champ « savoir ») — sert à l'écriture et à la relecture |
| **Ce qu'il veut, maintenant** | Un désir concret, à sa mesure (marier sa fille, finir son toit, être pris par une guilde). Et ce qui l'en empêche. | `oc.reve` |
| **Son regret ou sa blessure** | Doux, ancien, à lui. | `oc.secret`, `oc.peur` |
| **Sa joie secrète** | Une petite chose qui le rend heureux et qu'il ne dit pas. | `oc.aime` |
| **La faille et lui** | Peur, espoir, argent, indifférence ; **comment la Tristesse le prend** (ses jours sans, ce qui lui revient). | `nouvelles`, et nouveau : « jours de tristesse » |
| **Sa voix** | Longueur des phrases ; mots à lui ; tic ; comment il appelle le joueur ; ce qu'il ne dit jamais ; comment il ment. | `voix` (aujourd'hui une seule ligne) |
| **Ses gens** | Trois liens au plus, avec ce qu'il dit d'eux (et où il se trompe). Ils se répondent. | `oc.liens`, `avis`, `aCote` |
| **Son arc en quatre temps** | 1. La rencontre (politesse, méfiance, curiosité). 2. L'habitude (sa vie, ses soucis, de l'humour). 3. La confiance (ce qu'il ne dit pas d'habitude). 4. L'aveu ou le changement, **auquel le joueur prend part**. | `premiere`, `perso.paliers`, `amitie`, `scenes` |
| **Sa question au joueur** | Une question qu'il pose une fois, et **dont il se souvient** ensuite. | nouveau (partie 8, M2) |
| **Le village qui change** | Une ou deux lignes neuves à chaque étape (faille déclarée, garde arrivée, expédition partie, revenue…). | nouveau (partie 8, M3) |
| **Le temps, le lieu, l'heure** | Saison, météo, au travail, au bar, chez lui, la nuit. | `saisons`, `lieux`, `bonjour`, `meteo` |
| **Les cadeaux** | Ce qu'il aime ou déteste, **et pourquoi** (ça raconte quelque chose de lui). | `cadeaux` |
| **Les limites** | Ce qui est à JOKO (son texte, ses en-têtes, `voulu.js`) : on n'y touche pas. | `voulu.js`, la règle d'identité |

**La liste de contrôle**, à cocher pour chaque PNJ avant de le poser :

- [ ] Sans son nom, on sait que c'est lui qui parle.
- [ ] Moins d'une réplique sur trois finit par un trait d'esprit.
- [ ] Il ne dit rien que son âge, son lieu et son métier ne lui permettent de savoir.
- [ ] Il n'explique rien que tout le monde au village sait déjà.
- [ ] À la première rencontre, il ne raconte pas sa vie.
- [ ] Son histoire tient à au moins un fait cité de la Bible ou de tes pages Notion.
- [ ] Il a quelque chose à dire à chaque étape du village, et aucune réplique ne revient deux fois de suite.
- [ ] Il pose une question au joueur, et s'en souvient.
- [ ] On rit au moins une fois, et on est touché au moins une fois.
- [ ] Rien de sombre : pas de violence crue, pas de mort récente racontée.
- [ ] Ce qu'il dit des autres, ils le disent de lui (les liens se répondent).

---

## 7. Exemple complet : Fernand

**Qui.** Fernand, 78 ans, vieux paysan, veuf. Il prédit le temps avec ses genoux et un doigt mouillé. On le trouve
dans son champ le matin, sur la place à midi, et chez lui le soir (`<Logis: 36,6>`).

**D'où, quand.** Né au village, jamais vécu ailleurs.
- **Sous le roi Thibaut** (il avait la cinquantaine) : la famine, *« les impôts, la corruption et la famine »*. Le
  grain partait en taxes avant d'être mûr.
- **À la révolution**, il avait 56 ans environ ; depuis, le grain est revenu.
- **Au début de la Guerre de la Marche**, il en avait 48 ; un neveu y est parti (à décider).
- **Berthe**, sa femme, est morte il y a six hivers.

**Ce qu'il sait.** Le ciel, la terre, chaque famille du village depuis trois générations, le prix du pain d'avant.
**Ce qu'il ignore.** Tout des failles, sauf qu'on en a peur ; il dit « la Chancellerie » comme on dit « le
percepteur ». **Ce qu'il croit à tort.** Que la grotte « se refermera toute seule à la première gelée ».

**Ce qu'il veut.** Que Tomas, son élève, écrive un almanach de ses prédictions avant qu'il ne parte. **Ce qui
l'en empêche.** Depuis la grotte, il a peur de ne plus savoir lire le ciel.

**Son regret.** Avoir dit trop souvent à Berthe « pas aujourd'hui, demain ». **Sa joie secrète.** Mado qui lui crie
dessus chaque matin pour savoir le temps : il fait le sourd exprès.

**La faille et lui.** Certains matins, depuis la grotte, une tristesse qui n'est pas à lui ; il la prend pour la
vieillesse.

**Sa voix.**
- Lente, des phrases qui digressent et reviennent.
- Il répond souvent à la question d'avant.
- « Hein ? » ; il appelle le joueur « mon petit », puis par son nom.
- Il laisse tomber le « ne » : « je l'avais pas vu venir ».
- Il ne dit jamais « je t'aime bien » ; il dit « prends un manteau ».

**Ses gens.** Mado (elle crie, il adore ça) ; Tomas (« le seul qui écoute ») ; le vieux du bar (« deux vieux qui
parlent pas du passé »).

**Son arc en quatre temps :**

1. **La rencontre.** « Hein ? Bonjour, oui. Fernand. Je dis le temps qu'il fera. Gratuitement. C'est pour ça
   qu'on m'écoute pas. »
2. **L'habitude** (amitié 1-2). « Hein ? Le temps ? … Ah non, tu me demandais comment je vais. Pareil que le ciel,
   mon petit : ça dépend de l'heure. Le genou gauche tirait ce matin, donc pluie sur la forêt ce soir. Le droit dit
   plus rien depuis l'hiver. Je crois qu'il boude. »
3. **La confiance** (amitié 3-6).
   - « Tu sais pourquoi je regarde le ciel ? À cause de Berthe. Elle voulait savoir quand étendre le linge, et moi
     je voulais qu'elle me regarde. Alors j'ai appris les nuages. Quarante ans à lui dire "pas aujourd'hui, demain".
     Elle étendait quand même, et quand ça tombait, elle rentrait les draps en riant. » *(Il regarde ses mains.)*
     « Elle est partie il y a six hivers. Doucement, un matin de beau temps. Celui-là, je l'avais pas vu venir. »
   - « Du temps du roi Thibaut, le grain partait en taxes avant d'être mûr. L'année des glands, Berthe a fait du
     pain avec ce qu'elle ramassait dans le bois. Amer comme une dispute. On l'a mangé en se regardant, et on a ri.
     … Mes petits-enfants savent pas ce que c'est, le pain aux glands. C'est bien. Faut pas qu'ils sachent. »
4. **L'aveu** (amitié 10) : une scène, chez lui, le soir.
   - « Depuis la grotte, certains matins, j'ai un chagrin qui est pas à moi, et les nuages, je les lis plus. Les
     jeunes appellent ça l'imprégnation. Moi, j'ai peur que ce soit juste que je m'en vais. » *(Il lève un doigt au
     vent, longtemps.)* « … Vent d'ouest. Pluie demain soir. Tu vois ? Je l'ai encore. »
   - **Sa question** : « Tu l'as encore, Fernand. » ou « Et si c'était la grotte ? »
   - **Il s'en souvient** :
     - si tu as répondu la première : « Ah, c'est toi qui m'as dit que je l'avais encore. Il a plu, hier soir. » ;
     - sinon : « La grotte, hein. Alors c'est pas moi qui m'en vais. C'est elle qui vient. Ça me plaît mieux. »

**Le village qui change :**
- **faille déclarée** : « Un monsieur de la Chancellerie a mesuré mon champ. Il a dit "niveau un". Mon champ a
  jamais eu de niveau. »
- **la garde arrive** : « Des soldats en bleu sur le chemin. Ils disent bonjour. Les soldats d'avant, ils
  disaient pas bonjour. »
- **la première expédition part** : « Les petits de la ville sont entrés ce matin. Il va pleuvoir, là-dedans. Je
  le sens d'ici. »
- **elle revient** : « Ils sont revenus mouillés. Je l'avais dit. Personne m'écoute, mais je l'avais dit. »

*(Que derrière la faille il pleuve, la page Notion le dit des Larmiers. Fernand ne le sait pas : il le devine
avec ses genoux, et il a raison. C'est le genre de clin d'œil que le joueur comprend après coup.)*

**Les cadeaux.**
- **Adoré** : le pain au lait, parce qu'il le trempe comme Berthe le faisait.
- **Détesté** : les fioles de mage, parce que « le ciel se commande pas ».

---

## 8. Ce qu'il faudrait au moteur (proposé)

Des mécaniques que JOKO n'a pas écrites : je les **propose**, il décide.

| | Quoi | Pourquoi (partie 2) | Coût |
|---|---|---|---|
| **M1** | **Une conversation qui avance** : « Discuter » donne la suite de la dernière fois (une file par PNJ), puis seulement des répliques au hasard. | Fini la répétition ; une histoire se suit. *(Trails, Skyrim)* | Petit : un compteur par PNJ. |
| **M2** | **Il se souvient de ta réponse** : une question posée une fois, la réponse gardée, et des répliques qui en dépendent (chez lui, et chez ceux à qui il le raconte). | La réactivité qui fait vivre. *(Disco Elysium, Animal Crossing, Hades)* | Petit : un mot gardé par PNJ. |
| **M3** | **Les étapes du village** : une variable « où en est le village » (faille déclarée, garde arrivée, expédition partie, revenue…), que **JOKO** fait avancer depuis ses événements. Chaque PNJ a une ligne par étape. | Tout le monde a du neuf quand l'histoire avance. *(Trails)* | Moyen : écrire les lignes. |
| **M4** | **Les jours de tristesse** : certains jours, l'imprégnation prend un PNJ (un tirage par jour, plus fort près de la grotte). Ce jour-là, il dit autre chose : plus bas, plus vrai. | Le lore des Larmiers, vécu ; des moments sincères qui arrivent sans prévenir. | Petit. |
| **M5** | **Les ragots** : ce que tu fais pour quelqu'un, un autre en parle le lendemain (vrai ou déformé). | La vie de village, la réputation. | Moyen. |
| **M6** | **« Il a du neuf »** : un petit signe discret sur qui a quelque chose de nouveau à dire. | Éviter la corvée de faire le tour de tout le monde. *(Trails)* | Petit (le « ! » des quêtes existe déjà). |
| **M7** | **Les cadeaux moins transactionnels** : parler compte autant qu'offrir, un PNJ peut refuser un cadeau sans en être fâché, et un cadeau raconte quelque chose. | La critique de Stardew. | Petit, mais ça touche un système réglé (`cadeauAdore`…). |

---

## 9. Ce qui contredit aujourd'hui, à corriger pendant la refonte

| Ce qui est écrit aujourd'hui | Ce que disent la Bible ou JOKO | Proposition |
|---|---|---|
| La règle d'écriture des lots dit que Haute-Taville est « loin » (`bancs/outils/habitants/`, en-tête). | JOKO : *« pas très loin de la capitale »*. | Une distance réglable. Défaut proposé : une demi-journée de chariot, à toi de dire. |
| Prune, 16 ans, « recalée de l'Admission ». | *« On peut demander une licence […] à partir de dix-huit ans. »* | Elle s'est présentée en mentant sur son âge, et on l'a renvoyée (drôle et touchant) ; ou elle a 18 ans. À toi. |
| Le « lord » qui double la taxe sur le sel, prend le grain, les bœufs (34 répliques, écrites avant la Bible). | *« Depuis, il a baissé les impôts […] Aurevel prospère »* ; *« très politique et très patrouillée »*. | Les plaintes deviennent celles d'un pays riche et administré : la paperasse de la Chancellerie, les patrouilles, les prix qui montent avec la faille, les nobles du manoir qui commandent trop. À toi. |
| Les lignes « dures » (`DUR` : le voleur pendu, le cousin mort à la carrière). | *« pas un truc compliqué ou sombre »* (2026-10-14). | Retirées des fiches à la refonte (gardées dans le fichier, rien ne se supprime). |
| Les habitants parlent de la faille comme d'une faille sans niveau. | JOKO : un donjon du **Chapitre 1** ; la Bible : *« niveau 1 vers le Chapitre 1 »*. | Le niveau peut se dire. Le **rang de menace**, *« provisoire »*, reste à JOKO. |
| Rien ne dit, au village, que la faille est neuve et inexplorée. | JOKO : *« une zone pas encore découverte, donc inexplorée »*. | Le cœur de la refonte : personne ne sait, tout le monde imagine. |

---

## 10. Questions pour JOKO

> **Ses réponses, le 2026-11-09** : *« 1. Oui 2 oui , 3 tout ou le meilleur, 4 oui la village puis le marché puis la pêche »* — la demi-journée de chariot, un seul village, les mécaniques M1-M7 (le fil, la question, les étapes, la tristesse, les ragots, la bulle, la conversation qui compte), les 9 de la Ville développés aussi, et l'ordre Ville → Marché → Pêche. Non tranchés, réglés sur la Bible (elle fait foi) : le « lord » aligné sur l'Aurevel de Lothaire ; au début du jeu, la faille est déclarée et la garde pas encore là (étape 0). Un réfugié d'Ostrevent : Mathurin, le crieur. La refonte de la Ville : `bancs/outils/habitants/refonte/ville.js`.

1. **La distance** jusqu'à Haute-Taville : une demi-journée de chariot, ça te va ?
2. **La Ville Forestière, le Marché et le Village de Pêche** : est-ce que ce sont trois quartiers du même village
   (« le village du donjon des eaux »), ou trois endroits voisins ?
3. **L'imprégnation, c'est la Tristesse des Larmiers** qui déborde sur le village (partie 4) : je peux l'écrire comme ça ?
4. **Où on en est quand le jeu commence** : la faille vient d'être découverte, l'évaluateur est venu, la garde est
   déjà là, ou pas encore ? Ça décide des étapes de M3.
5. **Un réfugié d'Ostrevent** au village (aujourd'hui, il n'y en a aucun) : on en fait un, avec un PNJ existant ?
6. **Les mécaniques M1 à M7** : lesquelles tu veux ?
7. **Pour la refonte** :
   - le « lord » : je le garde ou je l'aligne sur la Bible ?
   - les 9 de la Ville que tu as voulus tels quels : je les développe aussi ?
   - par quelle carte je commence ?

---

## 11. Sources

**Le lore** : `docs/Les-Trois-Sources-la-Bible.docx` (chronologie, Aurevel, Haute-Taville, « Autour de Haute-Taville »,
« Les gens ordinaires », « L'imprégnation », « Le déroulement d'une expédition », la Chancellerie, la garde royale,
les guildes, la Bourse, la Confrérie, les Égarés) ; pages Notion « Nature et régions » (les Larmiers, la Tristesse)
et « Le Chapitre 1 dans le jeu » (acte 1 : *« La première expédition arrive à l'Étang-Miroir »*).

**Les jeux et l'écriture des PNJ** :
- [Same but different — comparing the Social Link system in Persona 3, 4 & 5](https://www.gamedeveloper.com/design/same-but-different---comparing-the-social-link-system-in-persona-3-4-5) (Game Developer)
- [S-Links to Confidants: an evolution of character interaction](https://www.gamedeveloper.com/design/s-links-to-confidants-an-evolution-of-character-interaction-) (Game Developer)
- [Social Links — the value of friendship in video games](https://www.thesixthaxis.com/2020/09/19/persona-social-links-friendship-in-video-games/) (TheSixthAxis)
- [NPCs with lives beyond you](https://alamrafiul.com/blogs/npcs-lives-beyond-you/) et [slow reveal characters over years](https://alamrafiul.com/blogs/slow-reveal-characters-over-years/) (analyses de Stardew Valley)
- [Stardew Valley forums — non-romanceable NPCs](https://forums.stardewvalley.net/threads/spoilers-thought-on-the-non-romancable-npcs.57022/post-256570) et [1.7 socializing wishlist](https://forums.stardewvalley.net/threads/1-7-socializing-wishlist.50404/latest)
- [Stardrop Saloon — critiques du système de cadeaux](https://stardropsaloon.criticalvideogamestudies.com/?p=325)
- [Nihon Falcom's president on the secret sauce of its JRPGs](https://www.pcgamer.com/nihon-falcoms-president-talks-about-the-secret-sauce-of-its-beloved-jrpgs) (PC Gamer)
- [Hades — how to tell a story in a roguelike](https://www.godisageek.com/2020/12/goty-2020-best-new-idea-hades-how-to-tell-a-story-in-a-roguelike/) ; [How Hades creates a responsive underworld](https://medium.com/@Nat.Rowley/how-hades-creates-a-responsive-underworld-915715a7c2a)
- [Understanding the meaningless, micro-reactive and marvellous writing of Disco Elysium](https://gamedeveloper.com/business/understanding-the-meaningless-micro-reactive-and-marvellous-writing-of-i-disco-elysium-i-) (Game Developer, conférence GDC 2021) ; [Why Kim Kitsuragi is Disco Elysium's breakout star](https://pcgamer.com/why-kim-kitsuragi-is-disco-elysiums-breakout-star) (PC Gamer)
- [Undertale narrative design case study](https://birdor-blog.pages.dev/undertale-narrative-design-success-case-study/) ; [The mechanics of Undertale dialogues](https://thesolarprincess.github.io/blog/en/undertaledialogue.html) ; [Undertale — GDC Game Narrative Review](https://media.gdcvault.com/gdc2016/GameNarrativeReview/Rosario_Game%20Narrative%20Review.pdf)
- [Animal Crossing — Villager](https://animalcrossing.fandom.com/wiki/Villager) ; [Nookipedia — Conversation](https://nookipedia.com/wiki/Conversation) ; [What makes a great Animal Crossing conversation](https://belltreeforums.com/threads/what-makes-a-great-animal-crossing-conversation.449010)
- [Fire Emblem Engage : 650 conversations de soutien](https://www.siliconera.com/fire-emblem-engage-has-about-650-support-conversations-1300-bond-ones/)
- [Red Dead Redemption 2 NPCs lead interesting lives](https://pcgamer.com/red-dead-redemption-2-npcs-lead-interesting-lives) (PC Gamer) ; [RDR2 post-epilogue](https://www.redbull.com/gb-en/red-dead-redemption-2-post-epilogue) (Red Bull)
- [Kingdom Come Deliverance 2 — dynamic NPC routines](https://wccftech.com/kingdom-come-deliverance-2-dev-talks-about-dynamic-npc-routines-and-emergent-storytelling-for-side-quests/) ; [Kingdom Come review](https://pcgamer.com/kingdom-come-deliverance-review) (PC Gamer)
- [Arrow to the Knee: dynamic dialog variation](https://medium.com/spirit-ai/arrow-to-the-knee-dynamic-dialog-variation-in-immersive-games-634b54e5609e) ; [Talk to the NPC until they start repeating](https://lr.us.psf.lt/r/truegaming/comments/1d62dzb/talk_to_the_npc_until_they_start_repeating_the)
- [Worldbuilding with NPC dialogue: a beginner's guide](https://www.gamedeveloper.com/design/worldbuilding-with-npc-dialogue-a-beginner-s-guide) ; [8 key principles of writing effective game dialogue](https://www.gamedeveloper.com/game-platforms/8-key-principles-of-writing-effective-game-dialogue) ; [Dialogue craft for interactive fiction](https://pvliesdonk.github.io/if-craft-corpus/corpus-docs/prose-and-language/dialogue_craft)

**La vie d'un village, les ruées** :
- [Boomtown](https://www.wikipedia.org/wiki/Boomtown) ; [The California Gold Rush](https://courses.lumenlearning.com/wm-ushistory1/chapter/the-gold-rush/) (Lumen Learning)
- [Rumour and reputation in the early modern English family](https://hull-repository.worktribe.com/output/451950/rumour-and-reputation-in-the-early-modern-english-family) (A. Capern) ; [Hofman, *Obligation of conscience* (Courtrai, XVIIIᵉ s.)](https://lirias.kuleuven.be/bitstream/123456789/462271/1//ElwinHofman-ObligationOfConscience-AuthorPostPrint.pdf) ; [Gluckman, *Gossip and Scandal* (1963)](https://www.oook.info/Conviv/Gluckman1963.pdf) ; [medievalists.net — reputation in a medieval village](https://www.medievalists.net/2020/07/sex-medieval-village/)
