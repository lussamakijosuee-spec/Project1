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
**Sauf le Chapitre 1** (2026-11-08) : à « c'est sombre et compliqué », JOKO a répondu que c'est voulu, on garde.
Le Chapitre 1 de sa page Notion (https://app.notion.com/p/411d7120ef1e813db6ceee8f96cc5ea6), c'est **le premier
jeu** : *« je compte faire 3 jeux »*, un par Chapitre. Son « Underground » (*« je voulais faire un Undertale »*) :
des monstres conscients, seulement là. Ce qui est tranché avec le jeu est à la fin de « Le Chapitre 1 dans le jeu ».

**Parler** (`Parler.js` v1.0, 2026-11-08 ; JOKO : *« Oui, propose Parler »*, puis *« Par carte (A) »*). Seulement sur une
carte dont la note porte `<Chapitre 1>` — **aucune n'a la balise** : les cartes sont à JOKO, c'est lui qui la pose ; aucune
fiche d'ennemi n'est touchée. Le peuple se lit dans le **nom** de l'ennemi (un mot entier : « Orc », pas « Sorcier » ; réglage
`peuples`, tiré de la ligne « Pour leur parler » de chaque peuple) ou dans `<Peuple: clé>` ; jamais un boss, ni `<SansParler>` ;
les peuples que la Bible règle par une quête (morts, Rêveurs, Rancœurs, Statues, Arbres) n'ont pas Parler. « 💬 Parler » se met
sous l'Attaque, grisée tant qu'aucun ne **baisse sa garde** (brisé, ou sous `seuilGarde` 30 %, « 🕊 Il baisse sa garde ») ; six
approches (Plaisanter, Écouter, Offrir — son or —, Avouer, Impressionner — après un coup de 15 % ce tour ou le précédent —, Le
contraire), des **compétences créées en mémoire** au chargement (rien dans Skills.json). La bonne : « 💬 Il t'écoute · 1/2 »
(D 1, C 2, B 3, A 4, S 5) ; la mauvaise : « 😠 Il refuse », +10 % à ses coups, et l'indice de son peuple. Apaisé : il s'en va
(réputation de son peuple +1, son expérience, jamais son or, un cadeau de son butin une fois sur quatre) ; sous 10 %, il
s'enfuit sans rien. Le frapper garde baissée se sait, une fois : réputation −1, éthique −1 (`Parler.reputation`,
`Parler.ethique`, dans `$gameSystem` ; `variableEthique` pour une variable). Pas encore : se rallier (le Serment), Appeler par
son nom. Banc : `navigateur/parler.js` (34 contrôles : le vrai combat saisi par les fenêtres, puis les règles et leurs
contre-épreuves).

**Le rework des ennemis du Chapitre 1 et du dehors** (2026-11-08 ; JOKO : *« Fait pour le Chapitre 1 et le monde extérieur les
ennemis un rework de tout sauf dono, kevératus et reine écarlate »*, puis *« Fait tout les ennemis même créer des troupes aussi »*,
*« Oui, noms de la Bible »*, *« Sortis de la faille »*, le troll exclu aussi, et sur le plan en 5 étapes : *« Oui plus développer et
originale »*). **Étape 1** — `LesPeuples.js` : un trait par peuple de la page Notion « Le royaume des monstres » (l'humeur et la fusion
des Gelées, la couronne et le piège des Gobelins, la colère dite des Orques, la blague des Farfadets, la rancune des Trolls, le cri et la
Veille des Pleureuses, la peur des Loups-Frisson, le doute des Murmures, le « Non ! » des Petits Refus, la jalousie des Envies, les
spores des Rêveurs, les Rancœurs, les Statues, les Arbres, les Vouivres, les morts qui refusent), un nom propre à chacun (« Nacre
(Gelée) », jamais porté deux fois, libre après le Temps du Nom), les états d'âme neufs **279-282** (Effroi, Jalousie, Superbe, Doute ;
Emporté 169, Euphorie 167, Accablement 168 du jeu) ; Parler v1.1 : **Épargner** un humain, partout (il se rend, rend ce qu'il a volé,
l'éthique monte). **v1.1 / Parler v1.2** : les **braises** (« un habitant du Chapitre 1 qui meurt pour de bon […] ne laisse que sa
braise » : objet **113**) et les **boss de la Bible** à leur façon (« comment l'arrêter sans le tuer »), par balises : `<Parler
approches / besoin / objet / texte / fin / interrupteur>`, `<Volonte: n>` (Corvina : elle revient, la Brisure fissure sa volonté,
brisée elle s'en va), `<Tenue>` (Aymeric), `<Duel>` (Brennus), `<Chants>` + `<Loyal>` (Hurle-Doux), `<CentFois>` (Vaëlle, d'un combat
à l'autre), `<Pardon>` (Ruedan), `<GardeLesBraises>` (Dame Sanglot) ; objets de quête 114 « La braise de sa mère », 115 « Le nom du
village », 116 « Un nom pour lui ». **Étape 2** — les 546 fiches (sauf Dono, son Esprit, Donovano le Second, Kevératus, la Reine et son
avatar, le troll) portent `<Monde: chapitre1 | exterieur | chapitre2 | chapitre3 | inconnu>`, et `<Peuple:>` (et `<SansParler>` pour les
héros tombés) : 102 Chapitre 1, 102 dehors, 89 Chapitre 2, 72 Chapitre 3, **181 inconnu** (aucune phrase de la Bible pour les ranger :
dieux, anges, démons, gargouilles, Minotaure, Poulet Bizarre… — à JOKO) ; rangées par des agents (une règle tirée de la Bible, un
relecteur adverse par lot), puis relues : le **bestiaire du .docx** met au dehors les bêtes ordinaires (« loups, sangliers, serpents
venimeux », « araignées géantes, chauves-souris géantes, rats des galeries », « grands loups noirs, ours géants ») — les Insectes y sont ;
une famille, un monde. **23 noms de la Bible** : Slime → Gelée, Orc → Orque, Chauve-souris → Murmure, Mimic → Envie, Wyverne → Vouivre,
Zombie → Revenant, Squelette Guerrier → Os-Têtu Guerrier, Goule Affamée → Affamé, Harpie Stridente → Pleureuse Stridente, Golem de
Pierre → Statue de Pierre, Élémentaires → Rancœurs, Spectre / Âme Errante → Errant, Dragons → Orgueils, Fées → Farfadets… ; jamais un
nom propre, un boss, un humain, un nom en minuscules de JOKO. ⚠ La Chauve-souris est un Murmure (Notion) alors que le .docx met des
« chauves-souris géantes » au dehors : à JOKO. Bancs : `navigateur/les_peuples.js` (44), `navigateur/les_boss_de_la_bible.js` (24),
`parler` (34), `les_instincts` (27). Les bancs Node `10_troupes`, `18_recharges`, `24_ultimes_et_rendements`, `7_trois_sources`,
`8_visages_ennemis`, `9_doctrines` ont les mêmes échecs avant et après (pas de ce chantier). **Étape 3** — 39 fiches neuves
(**834-872**) : les peuples qui manquaient (Gobelins Rieur / Piégeur / Neuf-Fois-Chef, Orque des Clans, Chanteur de Guerre, Troll
Rancunier, Pleureuses, Loups-Frisson, Murmure Messager, Rêveurs, Rancœur, Arbre-Mémoire, Vouivre Vantarde, Os-Têtus, Revenant Sauvage,
Affamé de Souvenirs, Braises), les humains du Chapitre 1 (Aile Noire, Soldat de la Lisière, Braisier), le dehors d'après le bestiaire
(Égaré, Araignée Géante, Serpent Venimeux, Grand Loup Noir, Ours Géant) et les **9 boss de la Bible** (864-872 : Dame Sanglot, Maître
Ruedan, Aymeric Lent-Feu, Vaëlle la Cent-Fois, La Gelée-Reine, Hurle-Doux, Brennus, Corvina, Orgueil-sans-Nom ; `<Personnage>` : ils gardent
leur nom ; pas de `<Boss>`, pour que leur peuple et Parler jouent) — images d'`img/sv_enemies` (à JOKO), compétences d'ennemis du jeu,
statistiques médianes de leur rang, `<Scale Sprite:>` pour les grandes images. Un **nom propre** ne va qu'à une créature dont la fiche porte
le nom de son peuple (« Gelée », « Gobelin Rieur ») ; une fiche rangée (`<Monde:>`) sans `<Peuple:>` n'en a plus par son nom. **Étape 4** —
39 troupes (**833-871**) : « Ch1 · Les Larmiers / La Lisière / La Forêt des Rires / Les Rougeterres / Le Val des Envies / Les Cimes Hautaines /
Le Champ de la Reine / Le Lieu-Tu · … », les 9 « Ch1 · BOSS · … », et « Aurevel · Égarés / Bois / Fond du bois / Sortis de la faille ». **Aucune
n'est posée sur une carte** : à JOKO. **Étape 5** — `lequipe_a_chaque_niveau` a un mode `LISTE=833-871` (chaque troupe au niveau de son rang :
D 6, C 20, B 36, A 52, S 70 ; `NIVEAU_LISTE=n`) : l'équipe complète gagne tout ; les troupes ordinaires en 1 à 3 tours (comme les D et C du jeu,
que JOKO garde bas : le jeu commence avec un seul héros), les Ailes Noires 3, les morts du Lieu-Tu 4 ; les boss, PV réglés : Dame Sanglot 5
tours, la Gelée-Reine 5, Aymeric 6, Vaëlle 4, Hurle-Doux 7, Brennus 8 (2 victoires sur 3), Ruedan 2 et Corvina 3 — mais le simulateur
n'appelle pas la fin d'action : la rancune de Ruedan (4 relèves) et la volonté de Corvina (3) n'y jouent pas, en jeu ils durent bien plus ;
**Orgueil-sans-Nom**, « le boss optionnel le plus dur » : 0 sur 4 au niveau 70, 2 sur 4 au niveau 89 (11 tours). Bancs :
`navigateur/les_troupes_du_chapitre1.js` (7 : les fiches, les images, chaque troupe ouverte et un tour joué, les personnages gardent leur nom,
la contre-épreuve), `les_peuples` (44), `les_boss_de_la_bible` (24), `parler` (34).

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

**Les voix de la Bible** (2026-10-30 ; JOKO : *« pnj si en gros inspire toi des oc et créé en avec le lore fournir de la bible dans le jeu mais reste logique »*, et ses PNJ parlent *« pas plugin mais événements »*) : 14 habitants par l'outil des habitants, lot `bancs/outils/habitants/les_voix_de_la_bible.js` — les 11 muets (les sept « cliant » au chapeau rose, Actor3 n° 5, sont les **sœurs Brémont** : Odile, Sidonie, Prune au magasin d'armures, Agathe, Rosalie, Capucine au magasin d'objets, Bérénice à l'auberge ; Léonie la messagère et Ysaline de l'Académie Rubis à l'auberge ; Anselme et Bastien, gardes de la Forêt) et 3 nouveaux venus (Mathurin le crieur, Ville 29 év. 53 ; Fanchon, recruteuse de la Veilleuse, Marché 30 év. 26 ; Gustave, Essayeur de la Confrérie, Village de Pêche 33 év. 43). Ce qu'ils disent vient de la Bible (l'Admission, la Chancellerie, les guildes, la Confrérie, les cristaux, Rubis, le Héros) ; pas de prix (le jeu compte en G) ; depuis le 2026-10-30, on sait où l'on est (« La situation », plus bas). L'outil : `--seulement <lot>` ne pose que ce lot (les autres pages, que JOKO a pu retoucher, ne sont pas réécrites) ; une fiche `muet: true` remplit une page vide ; une carte retirée se saute ; depuis le 2026-11-01 (« FGFG », où JOKO a repris des numéros pour d'autres PNJ), un événement qui n'est plus la même personne (le nom de sa ligne « ◆ FICHE » / « ◆ HABITANT », ou de l'événement pour une page vide) n'est pas réécrit, et une scène « 🏘 » qui nomme un absent n'est pas posée (une ligne d'un « si » qui le nomme tombe seule). **Voulu** (JOKO, 2026-11-09, sur la liste montrée : *« oui, c'est voulu […] Tout est voulu, là »*) : la carte 29 telle que « FGFG » l'a laissée (9 PNJ sans leurs conversations, les 4 nouveaux et les 4 recrues de l'Admission retirés, le crieur sans les anniversaires), EvenementsUtiles éteint (46 commandes NPC, FEU, FORGE, TEMPS, CHUTE sans réponse), l'événement commun 24 « jade parle » (sa boucle sans sortie, appelé nulle part) et les troupes 555, 831, 832 jamais lancées : on ne les remet pas, on ne les rallume pas. La liste est `bancs/outils/voulu.js` (le « 🏘 » de la ville ; les 9 PNJ en sont sortis le même jour, pour la refonte — plus bas) : les deux outils ne la réécrivent jamais, même avec `--ecrire` ; la règle d'identité est dans `bancs/outils/qui_est_la.js`, lue par l'outil et par les bancs. **Les bancs du village réadaptés** (JOKO, 2026-11-09 : *« Réadapte-le. Développe-le, améliore-le »*) : ils ne demandent qu'aux gens encore là ce que l'outil y a écrit, sautent en le disant un contrôle qui nomme un absent, et vérifient autrement ce qu'un absent portait (le jeu de Petit-Louis par sa fiche, `<Veillee>` et `<Admission>` posées en mémoire sur quelqu'un d'autre) ; `les_personnages` ⑭ relance les deux outils dans un dossier à part (`--sortie`) — ce qui est voulu ne bouge pas, et sans la liste il bougerait —, ⑮ ses pages à lui se parlent jusqu'au bout. Trouvé en le faisant : la scène « Fanchon recrute » du Marché visait le n° 26, devenu sa marque « kaze » (sans image), sa phrase pouvait flotter au-dessus d'une case vide ; `VieDuVillage` v2.3 : un événement sans image n'est jamais « là » pour une scène (`une_journee_entiere` ⑨ ; relancé, l'outil des scènes retirerait les scènes de Fanchon et de Barnabé du Marché et du Village de Pêche — pas fait, à JOKO). Banc : `une_journee_en_ville` (984 conversations, la Forêt comprise).

**La situation** (2026-10-30 ; JOKO : *« Sa se passe dans le royaume de Aurevel dans les campagnes avec une faille a côté, (c'est la zone grotte modifier que j'ai fait) utilise le lore pour la situation »*). La faille est dans la **Caverne de Pierre** (28, où le jeu commence) : de la grotte, le Marécage (49), la Forêt (31), puis la Ville Forestière (29), le Marché (30), le Village de Pêche (33), le plus loin. Ce qu'en disent les habitants vient de la Bible, rien de plus : Aurevel (*« terres agricoles fertiles »*, *« très patrouillée »*, *« il exploite tout ce qu'il peut, encadré par la loi »*, Lothaire après la famine de Thibaut, la capitale Haute-Taville, loin), la faille (*« elle peut s'ouvrir dans […] une grotte »*, *« ce qui se trouve derrière n'a rien à voir avec la taille de l'entrée »*), le permis de la Chancellerie, les points de retour, les deux règles de la Chute *« que chaque garde apprend par cœur »*, ce qu'on en rapporte, l'imprégnation de *« ceux qui vivent près d'une faille »*, les Égarés, la garde royale qui forme les élèves. **Ni le niveau, ni le rang de la faille, ni d'où vient le héros** : à JOKO. Les lignes sont dans `bancs/outils/habitants/situation/aurevel_et_la_faille.js` : elles **s'ajoutent** aux fiches (« Quoi de neuf ? »), 60 habitants ; Solange et Annick ne disent plus qu'il n'y a pas de faille (la faille est à l'autre bout de la région, *« ça dépend du vent »*). Scènes « 🏘 » : la porte nord compte ceux de la grotte, Mathurin crie l'avis de la Chancellerie, les gardes de la route et le vent, Edwin et le mana qui n'est pas d'ici. Banc : `les_personnages` ⑬ (la situation dans les pages, personne ne la nie, une phrase qui la nie, plantée exprès, est attrapée). **Précisée le 2026-11-09** (JOKO : *« on est dans un village […] pas très loin de la capitale […] un donjon du chapitre 1 qui ramène dans une zone humide avec des marécages […] il y aura forcément des gardes autour et […] d'autres aventuriers […] une zone pas encore découverte, donc inexplorée »*) : c'est **le village du donjon des eaux** de la Bible (le départ de la première expédition d'Edwin, Vesper, Ludwig et Aël, *« encadrée par la garde royale »*) ; la faille, de niveau 1, s'ouvre sur l'Étang-Miroir, dans **les Larmiers** (Notion : la région de la Tristesse) — ce que personne au village ne sait encore. Le rang de menace reste à JOKO. **La base pour écrire un PNJ** (jeux, lore, qui sait quoi selon l'âge et le lieu, gabarit, exemple, contradictions, questions) : `docs/PNJ_LA_BASE.md`. **La refonte des PNJ** (JOKO, 2026-11-09 : *« beaucoup plus humains et beaucoup plus sentimentaux […] une histoire derrière par rapport au lore »*, puis, sur l'analyse : *« Oui »* — la capitale à une demi-journée de chariot, un seul village —, *« tout ou le meilleur »* — les mécaniques —, *« oui la village puis le marché puis la pêche »* — lu : les 9 de la Ville aussi). **Faite : la Ville Forestière** (15 habitants, l'épicerie comprise), `bancs/outils/habitants/refonte/ville.js`, posée PAR-DESSUS les fiches (lot, OC, situation) : ce qui y est écrit remplace, le reste (scènes d'amitié, cadeaux, boutiques, quêtes) reste. Chacun : une histoire tirée d'un fait de la Bible à la mesure de son âge (la famine du roi Thibaut, la révolution, la Marche pour Béran, la Grande Chute pour Mathurin — réfugié d'Ostrevent —, la route royale de Lothaire pour Pépin, Rubis pour Colette), ce qu'il sait et ignore, sa voix, et ses mots à lui partout : plus aucune réplique partagée entre deux PNJ (« Relève du matin. Café froid… » chez tous les gardes, la météo commune de la ville) ; le « lord » d'avant la Bible, le frère disparu, « Il est mort » et les lignes sombres sortent de leurs pages. **`Habitants` v1.5** : le **fil** (« Discuter » donne la suite, une conversation neuve par jour, à l'amitié qu'il faut, +1 comme un cadeau aimé — `affiniteFil`), **la question** (geste `retiens` : il se souvient de ta réponse et en reparle un autre jour), **les ragots** (un autre la répète, une fois ; un cadeau adoré aussi), **les étapes du village** (variable **889**, que JOKO fait avancer : 0 la faille déclarée — le défaut —, 1 la garde royale s'installe, 2 les aventuriers arrivent, 3 la première expédition est entrée, 4 elle est revenue ; personne ne dit combien sont revenus), **les jours de tristesse** (la faille donne sur les Larmiers : un tirage par habitant et par jour, réglage `tristesse` par carte, 15 % en ville), **« il a du neuf »** (la bulle « … » au-dessus de qui, parmi ceux qu'on connaît, a une conversation neuve ou la nouvelle du jour — `signeNeuf`, `bulleNeuf`).  Le crieur reste sans les anniversaires. **La plage** (le Village de Pêche, carte 33 ; JOKO : *« maintenant à la plage […] une grosse analyse […] même pour les PNJ »*, puis, sur l'analyse `docs/LA_PLAGE.md` : *« Mer plutôt, oui , le ponton c'est juste un theaseur de dono et de lore il connaît des choses qu'il devrait pas connaît tu le vois que le soir-lui, bible, tout et développe ou détail au maximum »*). **Faite.** La **mer** (la Bible la met à l'est, chez Ilmarée, et lie Aurevel à Ilmarée par le commerce : on n'y nomme pas la côte) ; les « lac » de la plage, du bar, de l'auberge et de Ninon sont passés à la mer — sauf le rêve d'Élise (l'étang derrière la faille) et **deux phrases à JOKO** (la rumeur de Colin, la quête du couteau de Tobin : *« le lac chante »*), et l'encre « Lac du matin » de Pervenche. **Les PNJ** (`refonte/peche.js`, 10, le gabarit de la Ville) : **Erwan**, le Pêcheur de JOKO (33:31, l'image « jj », le visage « jkj » ; nom réglable), devient le père de Jonas et de Sora (leurs fiches le disaient) — sa page 2 vide avait sa condition décochée (l'interrupteur 105) et le cachait **depuis toujours** : cochée ; « Pêcher » et « Voir mes prises » gardés ; `accord` dans l'outil (une page de JOKO réécrite parce qu'il l'a dit, une fois) ; Jonas, Orin, Emma, Sora, Edwin, Régis (un caboteur à grain de la côte de l'est), Annick (« Tu as mangé ? » vient de la famine), Gustave, Solange — dates de la Bible vérifiées (la révolution il y a un peu plus de vingt ans). **`LaPlage.js` v1.0** (nouveau) : la **pêche en mer** (GALV_Fishing : poissons 4-13, objets 117-125 `<Poisson>` — sardine, maquereau, hareng, rouget, dorade, bar, sole, congre, le Patriarche à l'aube d'automne-hiver sous la pluie, `<Poisson: trophée>` ; les images vert / violet / rouge de JOKO ; « Pris : », « Longueur (cm) », « Poids (kg) » ; l'étang selon l'heure, la saison de MOG et le temps, réglage `etang`) ; **le Fil du Fond** n'est plus 3 à 6 par étang (le poisson vert de JOKO) mais une caisse une partie sur dix (`caisse`) ; **Annick achète** (`prixAnnick` 100 %) ; **le concours** que le tableau annonçait (`concours` 2/15, le mois dans la saison de MOG ; Régis pèse contre Roul et Tobin, 300 / 120 / 40) ; **ce que la mer ramène** (11 endroits « 🌊 » du sable, `<Trouvaille>`, 1 à 3 choses chaque matin, l'image `sparkles` de JOKO : coquillage 126, violet 127, verre poli 128, bois flotté 129) ; **les bouteilles** d'Élise (la Ville) et de Sora : 5 lettres par la rivière (130, 131) ; **la collection de Sora** (elle nomme tes coquillages) ; **le masqué du ponton** (év. 20, l'image « dono mmasque » de JOKO) : le jour personne, **le soir** (variable 200 ≥ 18) une chose neuve par soir, 15 en tout, la première est la sienne (*« tu la vois toi aussi ? »*) — ce qu'il ne devrait pas savoir, cité de la Bible (le niveau dit le Chapitre, la pluie derrière la grotte, le groupe A et le groupe B, la règle pour tous et *« même Donovano »*, les courtiers du Marché d'Ombre, la Communion, le Quartier Noyé, la question ouverte *« pourquoi […] sous la capitale ? »*, à chaque héros la sienne) et des secrets des fiches (le coquillage « Papa », Annick qui lit la nuit) ; il ne répond jamais d'où il vient. Variables 890-899 « ◆ Plage · … ». **Les quêtes des ✎** : les lucioles à Sora, *« Le chant de la mer »* à Orin (la rive « ✎ Rive ») ; la chaîne des échanges (la Femme du pêcheur) passe par le Village Montagnard retiré : laissée à JOKO. **Les scènes** (21 « 🏘 ») : Sora montre son coquillage à papa, Erwan regarde son fils de loin, le concours, la veille du départ (étape 2), Annick qui attend (3), le retour (4), Orin sous la pluie. **`VieDuVillage` v2.5** : `repas` (« 33: 29,30 » : à midi sur le sable, plus 7 sur 12 dans 7 × 5 cases du pré) et `<Pluie: reste>` (Orin). Outils : `bancs/outils/poser_la_plage.js` (objets, poissons, carte), `poser_les_scenes.js --cartes 33,46`. ⚠ `poser_les_quetes.js` ne tourne plus (la carte 51, retirée) — pas de ce chantier. Banc : `navigateur/la_plage.js` (15 contrôles, avec leurs contre-épreuves). Reste : le Marché. Banc : `navigateur/les_gens_du_village.js` (12 contrôles, la Ville et la plage : chacun complet, aucune réplique partagée, qui sait quoi, le fil, la question, le ragot, les étapes, la tristesse, la bulle, toutes les pages à chaque étape, et les contre-épreuves).

**La vie du village, comme Stardew Valley** (2026-10-30 ; JOKO : *« H1,h2,h3,h4,h5,h6,h7 fait tout en vrai […] avant tout ça lis déjà les personnages […] et les commentaires »*, puis *« il quitte pas la carte. Il marche »*, *« aller dans la porte, sortir dehors, aller vers leur maison quand c'est l'heure »*, *« les gardes aller au bar à une certaine heure. Et après sortir dehors quand c'est soir pour aller surveiller. Ou certains gardes qui vont juste surveiller dans toute la vie »*, *« ultra immersive comme dans Stardew Valley »*, *« je préfère largement que ce soit un événement que ce soit un plugin […] je parle des interactions »*, *« des événements extrêmement longs, c'est pas vraiment grave »*). **Ses commentaires font foi** : Hilde (29:28) tient l'épicerie le matin et Kaze (29:40, son mari) l'après-midi — l'épicerie (43:3) a deux pages, Hilde, et Kaze dès 13 h (variable 200, l'heure ; sa page 2 était vide, sous son commentaire « kaze ») ; Élise et Tomas sont leurs enfants ; « maison de hilde » est l'épicerie, « maison de Mado » la Maison 1, « maison du vétéran », « fernand maison », « gaston » (33:11), « caserne de soldat » (la Maison de Village du Marché, cartes 39-40). Colette, jeck, Emma Fieldensong (33:18, l'ancienne Maëlle), Edwin Bramble (33:22, l'ancien Yvon, fils d'Annick) et Sora sont réécrits d'après ses personnalités ; le poisson d'Yvon passe chez Annick. **L'outil des habitants garde ce que JOKO écrit** : l'en-tête d'une page posée (« ◆ HABITANT · … » et ses notes) reste ligne pour ligne, ses commentaires ajoutés aussi ; `--ecarts` montre ce qui a été retouché à la main, `--fiches 29:28,43:3` ne pose que ces fiches. **Le déplacement est un plugin** (on ne traverse pas une carte en événements) : `AlleesEtVenues.js` (nouveau) — `<Va: 18-21 46>`, `<Va: 5-13 33 7,38 bas peche>`, `<Va: 6-18 49 1/3 2j>`, `<Logis: 29 15,14>` (sa maison, même ailleurs : hors de son `<Horaire:>`), `<Logis: 45 3,10>` (une chambre de l'auberge) ; une porte sans intérieur est une maison ; deux séjours qui se suivent s'enchaînent (le bar puis la caserne) ; sur chaque carte traversée, une **copie** marche de l'entrée à la sortie (elle n'est jamais sauvegardée, elle parle avec les répliques et la mémoire de l'original) ; `<Est: 29:28>` sur une page : c'est déjà lui, pas de copie. `VieDuVillage` v2.0 : tout habitant « ◆ HABITANT » vit (pas les « ✎ », ni un déplacement « Personnalisé » de JOKO) ; dedans (41-46), le marchand bouge derrière son comptoir et revient quand on approche, les clients vont au comptoir et prennent l'air (`lieux`) ; il se tourne vers toi, s'écarte quand tu le pousses, « ! » sur qui a une quête, on court sous la pluie ; `<Ronde: x,y ; …>` ; le dimanche est enfin le jour de repos (v1 comparait `day_week()` à 0, jamais vrai). Les gardes : portes de jour (Brunehaut, Rolf) → bar 18-21 → caserne ; de nuit (Oswin, Konrad) → caserne → bar 13-17 → porte ; Merle et Casimir patrouillent la ville puis boivent ; Mathis, Béran, Anselme et Bastien veillent toujours. **Les interactions sont des événements** : `bancs/outils/poser_les_scenes.js` (lots `bancs/outils/scenes/`) pose un événement « 🏘 La vie — … » par carte (processus parallèle, 74 scènes), en commandes ordinaires (déplacement, bulle, message GALV `<c:…>`, son) ; `VIE arreter/reprendre/tourner/bulle/dire` et `VieDuVillage.ensemble(…)` aident ; un « 🏘 » sans sa ligne « ◆ SCÈNES » est à JOKO et ne se réécrit plus. `Habitants` v1.3 : une quête finie, un boss battu se racontent une fois par habitant (`phrasesQuete`, `phrasesBoss`) ; l'**affinité** monte d'un par jour où l'on se parle et ouvre les confidences (moteur : `perso` sur l'affinité) ; « jours depuis » comptait les jours du mois ; l'**Admission** (7 premiers jours de chaque saison, la Bible) amène quatre recrues (Noé, Ilda, Aubin, Clémence, 29:55-58, `<Admission>`) ; la **Veillée du Retour** est un réglage (`veillee` 9/30, la Bible ne donne pas la date) : on veille sur la place jusqu'à 2 h. Sauvegarder ne garde aucune copie, et une partie chargée recense de nouveau ses PNJ (avant, VieDuVillage pilotait des copies relues de la sauvegarde : plus personne ne bougeait après un chargement). Banc : `navigateur/une_journee_entiere.js` (29 contrôles depuis le 2026-11-09).
**La marche** (`VieDuVillage` v2.1, `Habitants` v1.3, 2026-10-30 ; JOKO : *« le plus gros problème c'est la marche il font n'importe quoi presque »*). Mesuré : à 10 h en ville, **23 % des pas étaient des allers-retours** (la « flânerie » : arrivés, ils faisaient des pas au hasard ; Mathurin, qui ne quitte pas son réverbère, 13 pas en 40 s), la marche s'arrêtait entre deux cases (un pas toutes les six images), et bloqués ils faisaient un pas au hasard. Maintenant : arrivés, ils **ne bougent plus** (tournés comme JOKO les a posés, ou vers le milieu de la place ; de temps en temps ils tournent la tête) ; sur la place, **chacun sa case** (en couronne, espacées) ; le pas suit le pas ; **bloqués, ils attendent puis contournent** (un pas de côté, puis un détour, sans revenir sur leurs cinq dernières cases) ; le joueur dans une porte : ils **se faufilent** à côté de lui ; sous les yeux du joueur, personne ne **saute** jusqu'à sa place (plus de téléportation à l'écran) ; à l'arrivée sur une carte, chacun est **déjà où sa journée le met** ; un garde posé par JOKO dans un pilier de porte en sort d'un pas quand il doit partir, et reste sur sa case sinon. Le soir seulement, sur la place, il leur arrive de changer de case (`flanerie`, quelques cases). Mesure : **0 à 2 % d'allers-retours**, Mathurin 0 pas. Aucun `moveRandom` ne reste dans VieDuVillage ni Habitants. **La vitesse** (`VieDuVillage` v2.2, `Habitants` v1.4, 2026-10-31 ; JOKO : *« D'ailleurs pourquoi il sont rapide quand il marche ? »*) : les deux plugins forçaient **4** (le pas du joueur, 16 images par case) et 5 sous la pluie, par-dessus la vitesse de l'éditeur — JOKO avait mis Béran, Pépin, Mathurin et Clémence à 2 sans effet. Maintenant, c'est **la vitesse de sa page** (3 par défaut, deux fois plus lent que le joueur : 32 images par case ; Élise 6, Tomas 5, Tobias 6), un cran de plus sous l'averse (pas les gardes ni les marchands), et un marchand derrière son comptoir à 3 au moins (à 1, deux secondes par case pour revenir à sa place). La **fréquence** de l'éditeur n'est pas lue en marchant : dans MV, c'est la pause entre deux mouvements automatiques (à 3, une seconde à chaque case — la marche saccadée d'avant). Le 2026-10-31, une sauvegarde de l'éditeur resté ouvert sur une vieille carte 29 (« GY ») avait remis 14 pages à l'ancienne, ôté les 4 nouveaux et 9 scènes : remis, ses réglages gardés (vitesses, fréquences, places, l'image de Mathurin, les notes des recrues, le départ en Forêt). Banc : `navigateur/la_marche.js` (12 contrôles, avec les contre-épreuves : un PNJ qu'on fait piétiner exprès est attrapé ; un passant mis à 2 marche à 2). **Un objet ne vit pas** (`VieDuVillage` v2.4, 2026-11-09 ; JOKO : *« Il y a un gros problème avec la fiche d'affiche que j'ai mis à l'extérieur »*) : le tableau d'affichage du bar (« ◆ HABITANT », sans image : il ne marchait pas), sorti devant la ville avec l'image d'un panneau (29:10, `!$Bulletin01b_PixelScaled`, tourné à droite : la rangée aux affiches), vivait comme un villageois — il marchait jusqu'à la place à midi, rentrait le soir, tournait la tête vers le haut (une rangée vide de son image : il disparaissait), et quand on lui parlait, MV le tournait vers le joueur : sa face vide. Une image « ! » (la convention de MV pour les objets) ne vit plus, et un objet qui parle (« ◆ HABITANT », `<NPC:>`, `<Vie:>`) garde la direction de l'éditeur quand on le lance. `la_marche` ⑦ : à midi il est à sa case, tourné comme dans l'éditeur ; contre-épreuves : un habitant qui prend l'image du tableau ne vit plus, le tableau qui prend l'image d'une personne vit.
**Les personnages, comme des OC** (`Habitants` v1.4, 2026-10-30 ; JOKO : *« Développe les personnages vrai personalite mais dit se que tu va faire avant d'ailleurs personnages du lore mais nouveau inspiré du lore »*, puis, sur la proposition P1-P6 / N1-N8 : *« Comme des oc »* — lu : des personnages **inventés**, avec une vraie fiche, et le plan entier aux réglages annoncés). Les fiches sont dans `bancs/outils/habitants/oc/` (une entrée « carte:événement », « /2 » pour une page 2 ; une page `<Est: 29:28>` reçoit celle de 29:28), et l'outil les ajoute aux fiches des lots. **P1** la fiche OC (âge, allure, caractère, aime, déteste, rêve, secret, peur, manies, sa phrase, ses liens), écrite en tête de sa page (« ◆ FICHE · … », après « Généré par » : elle suit la fiche) ; **P2** ce qu'il dit selon où il est (`Habitants.ici` : travail, place, bar, repos, ailleurs — en visite —, nuit) ; **P3** ce qu'il dit des autres (dans « Discuter », une fois sur trois ; « à côté » quand l'autre est à 5 cases), et **les liens se répondent** (si A parle de B, B parle de A) ; **P4** le ton change aux paliers 3, 6, 10 (le « tu », puis `\P[1]`), et trois **scènes d'amitié** : au palier, il donne un rendez-vous (une carte, des heures où sa journée l'y met), et c'est là, quand on lui parle, que la scène se joue, une fois (des répliques, des bulles, un choix, +1) ; **P5** « Offrir… » (la commande « Sélection d'objet », pas un plugin) : adoré +2, aimé +1, autre 0, détesté rendu sans rien perdre, un cadeau par jour (`cadeauAdore`, `cadeauAime`, `cadeauNeutre`, `affiniteScene`, variable 888) ; **P6** un anniversaire (« mois/jour »), le cadeau ce jour-là compte double, et Mathurin l'annonce. Un menu de plus de six choix range les derniers dans « Autre chose… ». La mémoire suit `<Est:>` : Hilde à l'épicerie est Hilde (avant, Hilde et Kaze partageaient la mémoire de 43:3). **Le premier cercle** (P1-P6, 20) : Hilde, Kaze, Élise, Tomas, Colette, jeck, Emma, Edwin, Sora, Mado, Fernand, Béran, Margot, le vieux, Mireille, Colin, Lise, Gaudry, Annick, Roul (Gaston, repris par JOKO, n'est pas touché). **Les nouveaux** (N1-N8, lot `les_nouveaux.js`, 9 événements créés vides le 2026-10-30, une phrase de la Bible chacun, des gens ordinaires — elle trouve ses 95 personnages nommés « beaucoup trop ») : **Barthélemy** le conteur (46:52, bar 19-24, la place 14-18 ; un conte par soir, la Genèse : les trois sources, le triangle, le cercle et le livre, les quatre jours, les trois arts, la Veillée), **Petit-Louis** (29:59, petit-fils d'Hector et Maude ; son jeu de mains « Corps, Âme, Esprit » suit le triangle : le Corps bat l'Âme, l'Âme l'Esprit, l'Esprit le Corps), **Anouk** et **Timothée** (29:60, 30:28, la patrouille d'élèves de Rubis, la taxe des dégâts), **Évariste** l'alchimiste retraité (29:61, « Essence et Braise »), **Pervenche** les encres (30:29, les parchemins jumeaux), **Ninon** coursière de la Bourse (30:30, de carte en carte), **Solange** (33:45, « c'est pas moi, c'est la faille » : trois humeurs selon le jour), **Zéphyrin** le marchand de la Veillée (29:62, `<Veillee>` : là seulement cette nuit-là). **Les autres** (P1-P3, 71, `oc/les_autres_*.js`) : fiche, lieux, avis, et deux confidences pour les 16 qui n'en avaient pas ; pas touchés : l'aubergiste de JOKO, les gardes du manoir, la foule des soirs de fête. Scènes « 🏘 » ajoutées : le conte du soir, le conteur et le barde, Corps-Âme-Esprit, Anouk, Évariste, la caisse de Timothée, Pervenche et Ninon, Solange et Edwin. Le nom d'un habitant (pour « à côté ») se lit sur la ligne « ◆ FICHE · Nom », puis sur « ◆ HABITANT · Nom » : JOKO a réécrit certains en-têtes (« Hugo » pour jeck, « Yvon » pour Edwin, « Emma Fieldensong est une… », « hilde »), on ne touche pas à son texte. Un rendez-vous se place là où **sa journée** le met (mesuré : à 21 h Hilde et Annick sont rentrées, à midi Ninon livre au Village de Pêche, un soir sur trois Colette y est) ; Colin n'a sa fiche que sur sa page 2 (auto-interrupteur A), donc ses scènes attendent qu'elle s'allume. Banc : `navigateur/les_personnages.js` (23 contrôles depuis le 2026-11-09 : les fiches posées, les liens qui se répondent et un lien coupé exprès attrapé, la promesse sans rappel dans la même phrase, puis la scène, une seule fois, la même Hilde, les cadeaux, l'anniversaire, le crieur, le triangle à l'endroit et une phrase à l'envers attrapée, la Veillée, toutes les pages jusqu'au bout, et chaque rendez-vous tenable — la personne est là, visible, à l'heure dite).

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

**Le Theatrhythm de la démo, adapté** (2026-11-02 ; JOKO : *« jeu a utiliser REGERDE ET LE GIT HUB CAR IL FAUT L`Adapter »*, puis *« Interrupteur + variable, Textes en français, Le nom au-dessus du PNJ »*). Ses PNJ du Theatrhythm (carte 1 : 2, 5, 30 ; carte 10 : 2) sont la copie de l'événement 2 de la carte 11 de la démo de MOG (`jeu a utiliser/MOG_Master_MV`). `MOG_Theatrhythm.js` et ses images restent **ceux de MOG, octet pour octet** (JOKO : *« le plugin de base était excellent »*). Adapté : le résultat dans l'**interrupteur 955** « Theatrhythm · gagné » et les points dans la **variable 900** « Theatrhythm · points » (la démo prenait 10, « PHASE 2 » du Noyé du Lac, et 5, « BONUS » que le Pari Mortel remet à 1) ; « Facile / Normal / Difficile », « Gagné ! / Perdu… » ; **MOG_EventText** (copie corrigée `[JOKO]`, l'original reste dans le dossier : une partie sauvegardée avant lui plantait sur le joueur ; et, trouvé par JOKO le 2026-11-03, un PNJ à texte **hors de l'écran** plantait le jeu — `Allegement` l'endort, son image n'est pas chargée, « Cannot read property 'height' of undefined » : le texte attend son image et dort avec lui ; les démos de MOG en portent 71, sur 15 cartes) écrit « Theatrhythm » au-dessus. Le fond est le décor de combat **de la carte** : la carte 1 n'en a pas, le fond y est noir. Banc : `navigateur/le_theatrhythm_adapte.js` (17 contrôles).

**Les partitions** (`LesPartitions.js` v1.0 + le Studio → 🎵 Rythmes, 2026-11-02 ; JOKO : *« le plugin de base était excellent, il était parfait comme il était, ce que je voulais c'est créer mes propres musiques. Savoir quelle musique va avancer, savoir à quel rythme, qui suit la musique […] pas que ce soit automatique »*, puis *« Dans le Studio »*). Après le retour en arrière, le Theatrhythm du jeu est **celui de MOG** (photo du jeu à côté de la démo : 4 couloirs, 4 cercles, mêmes boutons ; seul le fond de la carte 1 est noir, faute de décor de combat). `MOG_Theatrhythm.js` n'est toujours pas touché : `LesPartitions` ne remplace que **le moment, le couloir et le bouton** de chaque note, lus dans une partition et calés sur la position de la musique (l'horloge audio ; sans son, les images au bout de 3 s) ; la frappe, la critique, le raté, les dégâts, le score et la fin restent ceux de MOG. Commande : `theatrhythm : ennemi : vitesse : nom` (sans le 4e mot, MOG au hasard comme avant ; une partition introuvable aussi). Une partition = `data/rythmes/<nom>.json` (la musique, le tempo, le 1er temps, la vitesse, les notes `{t, c, b}`, les drapeaux « ça accélère » `{t, v}`) ; **c'est JOKO qui les écrit** — je n'en écris pas. Réglages : `finDeLaPartition` victoire (FNF : tenir jusqu'au bout) / boucle (MOG), `silenceSansNote` rien (une touche entre deux notes ne coûte rien) / rate (MOG). Un couloir de plus que l'équipe revient dessus (5 → 1). **L'éditeur** (`studio/pages/rythmes.html`) : la forme de la musique sous 4 couloirs, la grille du tempo (taper le tempo, le 1er temps ici), l'aimant (temps, 1/2, 1/3, 1/4, 1/8, ou libre — « ne suit pas la musique »), la palette des 8 boutons de MOG (ses images), clic pour poser, glisser, clic droit pour enlever, la bande « vitesse » pour les drapeaux, l'enregistrement au clavier en lecture (A, S, Z, X, flèches ; 1-4 le couloir), les tics, la lecture à 50-75 %, Ctrl+Z, un brouillon gardé, « 🎮 Essayer dans le jeu » (le vrai jeu, la partition telle qu'elle est), et la commande à copier. Il écrit dans `data/rythmes/` (RPG Maker ne lit pas ce dossier : il peut rester ouvert) ; l'ancienne version d'une partition part dans `Sauvegardes du Studio
ythmes`. Banc : `navigateur/les_partitions.js` (27 contrôles).

**Le chant** (`LeChant.js` v1.0, 2026-11-02 ; JOKO : *« un combat avec un de mes personnages qui sera troll presque […] il va avoir une attaque, qui va littéralement briser l'écran, et qui va te lancer un nouveau combat avec vos PV à vous et ses PV à lui, où là, lui va faire un rythme de chant. Et après, il va alterner entre les deux »*, puis *« Sous 70 % de ses PV »*, *« Tous les 3 tours (réglable) »*, *« Je le crée moi-même »*). Le personnage est **à JOKO** (il le crée) ; le système tient dans une balise : `<Chant: partition>` ou `<Chant: a, b, c>` (une par chant, dans l'ordre, puis ça reprend), et pour lui seul `<Chant seuil: 70>`, `<Chant tours: 3>`, `<Chant vitesse: n>`. Au début d'un tour (`BattleManager.startInput`), sous le seuil la 1re fois, puis après `tours` tours de combat normal (`$gameTroop.turnCount()`) : « ♪ Il brise l'écran ! » (`annonce`), il s'illumine, l'écran tremble, se fissure depuis lui, part en éclats (une photo de l'écran découpée en ~80 triangles, le son `Break` de la RTP, réglage `son`), puis le **Theatrhythm de MOG** s'ouvre contre lui (sa fiche, son nom), sur sa partition (LesPartitions), avec **les images mêmes du décor du combat** ; ses PV et ceux de l'équipe tels quels (MOG soigne l'équipe en entrant : neutralisé le temps du chant) ; les 4 premiers chantent (4 couloirs : seiryu, 5e, attend). La partition finie (sans partition : `dureeSansPartition` 60 s), retour au combat **au même tour, en saisie** : il a ses PV de la fin du chant, chaque héros garde la part de ses PV que l'équipe a gardée (MOG compte une moyenne) ; tombé dans le chant, il est vaincu ; l'équipe tombée, elle l'est aussi. **Le combat ne recommence pas** : à l'aller, `onBattleEnd` de l'équipe et de la troupe (appelé par `Scene_Battle.terminate` de YEP_X_CoreUpdatesOpt : buffs, états, PT effacés) est coupé ; au retour, `BattleManager.startBattle` et `playBattleBgm` (les débuts de combat de seiryu, du Pacte, du Registre, des instincts…) aussi, et le titre de boss que `ScenesDeBoss` remet à chaque `Scene_Battle.start` est retiré (à la première image : chargé après LeChant, il l'ajoute après nous — le troll de JOKO, ennemi 831, troupe 91, est un boss) ; la musique de la carte retenue par le combat (que MOG remplaçait) est rendue. Phase « chant » pendant l'aller-retour (YEP l'ignore). `LesPartitions` v1.0 a deux points d'accroche pour lui : `partitionEnBoucle`, `finDePartition`. **v1.1, ses coups** (JOKO, 2026-11-09 : *« Nerf les dégâts de la reine phase 2 en musique car c'est trop fort »* — lu : la phase 2, l'avatar ; en musique, son chant) : à chaque note ratée, MOG fait frapper l'ennemi pour son ATQ + sa MAG − la défense moyenne de l'équipe. Contre l'avatar d'Ardélia (999 / 999) : **1 636 par raté**, 26 % des PV moyens de l'équipe, 4 ratés et l'équipe tombe (le troll de JOKO : 238, 3,8 %, 27 ratés). `<Chant dégâts: n>` (réglage `degats`, 100 = le calcul de MOG) n'en garde que n % ; l'avatar (824) porte **`<Chant dégâts: 30>`** : ≈ 490, 7,8 %, 13 ratés. Le troll et la Reine sous 50 % (Battle-rapier, Cendreux, Fleur Écarlate) ne sont pas touchés. Banc : `navigateur/le_chant.js` (24 contrôles, l'Ogre de la troupe 1 reçoit la balise et `<Boss>` en mémoire, sur la carte 10 ; un raté à 1 000 tout rond, puis à 30 %).

**Kevératus Vultric, Mahoraga v3** (`MahoragaBoss.js` v3.0, 2026-11-03 ; JOKO : *« rework mahoraga déjà par rapport au lore et surtout sa mécanique je veux le rendre plus intéressant et plus simple aussi car au final noyé de concept c'est pas bon juste un boss extrêmement dur top 3 des meilleurs boss du jeu »* — « plunging » = plugin —, puis, sur la proposition : *« Kevératus Vultric »*, *« Aux trois arts »*, *« À 50 % : la Bête »*, *« Un jeu neuf »*). L'ennemi 21 (`<Mahoraga>`, troupe 21, l'EV001 de la carte 1) s'appelle **Kevératus Vultric** : son texte (`docs/EMPIRE_DU_CORPS.md`) — l'ancien chef des chasseurs, *« il s'adapte à n'importe quoi pour en réduire les effets, afin de survivre »*, *« Dans le jeu, cela se traduit par une baisse de dégâts à chaque fois qu'il est touché »*. La v2 empilait huit concepts (trois phases, l'adaptation par technique au seuil changeant, la prédiction, la Rage, le Berserk, l'immunité aux états, des contres qui sautaient, le Mana Pur) : retirés. **Une règle, la Roue** : chaque art qui le touche (Voies, Paroles, Runes — les menus du combat, `LesTroisArts.art`) tourne d'un cran, une fois par action : ×1, ×0,7, ×0,4, puis **ADAPTÉ** ×0,1, et à chaque coup de cet art il **répond** à qui l'a porté (La Réponse, 1325, par `Interactions.forcer`, sans lui coûter son tour) ; un art qu'il n'a pas vu de tout un tour perd un cran ; une estimation (l'IA, l'aide) ne la tourne pas, un objet ou un coup sans art non plus. **« À n'importe quoi »** : une gêne qu'un héros lui pose (immobiliser, sceller, affaiblir, viser moins bien), il ne la subit qu'une fois — pas la Brisure du bouclier, ni sa Charge / Surcharge, ni le Marqué de ludwing ; les auras des réactions et les cercles des runes ne sont pas des gênes (sans ça, les Pieux de Cristal d'Aël le tenaient immobile). **La Bête**, sous 50 % (la Bible : *« La Bête : l'instinct dévore la personne »*) : deux actions par tour, la Roue en deux coups (×1, ×0,5, ADAPTÉ), jamais deux frappes annoncées le même tour. **Ses coups** (fiches neuves ; les anciennes 134, 136, 137, 928-934 restent : d'autres ennemis s'en servent) : Croc du Chasseur 1322 (`<Chasse>` : le Traqué, sinon le plus blessé), La Traque 1323 (état **278 🎯 Traqué**, 3 tours : visé ×10, dégâts reçus ×1,3), La Faim 1324 (tout le groupe, *« une faim qui imprègne jusqu'aux pierres »*), Il Tire sur ses Chaînes 1326 (`<Telegraphe>`, tours 3 + 4n : ⚡ Charge, *« trente ans »*), Déchaîné 1327 (sur la Charge, tout le groupe, ×14 ; *« vingt-trois jours à enfermer »*) — noms et textes à JOKO. Son élan se brise plus dur (`rupture` ×3 : 18 % de ses PV pendant la Charge). **À l'écran** : la Roue en haut à gauche (trois secteurs qui se remplissent, l'initiale de l'art, elle tourne d'un huitième à chaque cran), sa ligne dans la barre du boss (« ☸ Voies ×0,7 · Paroles ADAPTÉ · Runes ×1 · LA BÊTE », par `MecaBoss.defs.roue`), au-dessus de lui « ☸ Paroles ×0,7 », le bandeau « ☸ ADAPTÉ · PAROLES ». Pas de répliques : il est muet (une Bête), son texte n'en donne pas. **Mesure** (l'équipe du banc, niveau 89) : avant, gagné en 35 tours (un sac de PV) ; après, 1 victoire sur 3 (17 tours, ludwing tombé), deux défaites en 11-12 tours (Réponses encaissées 8 à 16 : l'IA du banc relance les arts adaptés et ne se garde pas de Déchaîné). ⚠ Mesuré avec une copie corrigée de `lequipe_a_chaque_niveau.js` : le banc partagé **ne fait vieillir aucun état** (YEP `endTurn` attend des popups qui ne finissent jamais sans affichage ; `endAction` n'est pas appelé) — un boss brisé ou ⚡ chargé le reste tout le combat. Le bloc `<Radahn>` du fichier n'a plus de porteur (JOKO a retiré la balise) : il dort. Bancs : `navigateur/la_roue_de_keveratus.js` (23 contrôles), `16_mahoraga.js` (ses réglages et ses fiches, 10 contrôles et 5 sabotages), `navigateur/les_boss.js` (28 mécaniques / 26 boss reliés).

**Ardélia, la Souveraine Écarlate — le boss de fin** (`LAvatarDeLaFille.js` v1.0, 2026-11-06 ; JOKO : *« une phase une avec la reine écarlate du lore avec ses compétences et son combat et quand elle tombe a zéro elle parle un discours profond et philosophique sur eux puis une animation très stylé et le combat de l'avatar, elle représente la détermination mais surtout le dépassement des concepts, ex: le chant, brisé les domaines comme royaume impérial ou monde gelé elle brisé l'écran et affiche un fond en arrière de forêt perdu l'image ou même brisé des concepts du jeu […] fait bouger ou faussement crach ton jeu puis brisé l'écran même coup l'écran en deux dans son attaques de tranchant concepts pour brisé les domaines »*, puis *« Elle parle légèrement puis meurt et oui fait tout ai max c'est la boss de fin »*). La Bible : Ardélia, Revenante, *« elle revient quand elle meurt, tant que sa volonté tient »* ; l'Âme, *« un brasier gigantesque en forme d'aigle »* ; le Gardien du Chapitre 1, *« un aigle de feu […] peut-être n'est-ce que la Fille elle-même »*. Le combat : l'Arène de la carte 1 → **troupe 92**, la Reine (830) puis l'avatar (824). **Ce qui ne marchait pas** (joué) : « Combat » dans un combat ne fait rien (MV) — à 0 % elle tombait, victoire au tour 1, la troupe 831 jamais atteinte ; la page 1 de la 831, en « Moment » avec un texte vide, tournait en boucle (le combat ne commençait jamais) ; « COMBAT musique » et « TRANSITION » préparent le combat **suivant**, « setBattleSys » est ignoré en combat, « Changer le fond de combat » ne s'affiche qu'au combat suivant (et reste sur la carte) ; ses deux IA étaient celles de la Pondeuse et du Dernier des Petits (« ALWAYS ») ; 10 158 et 13 624 PV : l'équipe niveau 89 tuait chacune en un tour. **La troupe 92 maintenant** : tour 0, Immortel (elle ne tombe pas avant d'avoir parlé) ; à 0 % : Cendreux tombe (son −999, rendu mortel), son discours (3 messages à son visage F_Castle_02, puis la Bible en narration, *« Au Chapitre 1, l'âme refuse de mourir »* — **un brouillon, à JOKO**), `AVATAR chute` (le fond s'assombrit, des braises, l'aigle de feu se forme au-dessus d'elle et plonge en elle, éclair, l'image reste figée), « Transformer » en 824, « Soigner », Immortel de nouveau (« Soigner » retire tout), la musique xevel, l'interrupteur **318** « Ardélia · l'avatar », `AVATAR revele` (l'image figée vole en éclats, la bannière dit son nom et sa description) ; à 50 % (la phase 1 seulement : un « Si 318 OFF ») Battle-rapier et PHASE2 ; l'avatar à 20 % : l'éclair et l'Éclat · Or (repris de la 831) ; l'avatar à 0 % : deux phrases, `AVATAR fin` (elle brûle), elle tombe en boss (`collapseType` 1), Cendreux avec elle. **L'avatar brise les concepts**, quatre compétences neuves (noms à JOKO) : **Tranche-Concept** 1328 (`<TrancheConcept>` : une ligne de lumière coupe l'écran en deux, les moitiés s'écartent ; les domaines tranchés — réglage `domaines` : Monde Gelé 13, Domaine Déployé 16, Royaume Impérial 39, 198, 231 et `Royaume.fermer`), **Briser l'Écran** 1329 (`<BriseEcran>` : l'écran se fissure depuis elle et vole en éclats), **Le Jeu Plante** 1330 (`<FauxPlantage>` : l'image figée, la musique coupée, puis l'écran d'erreur de RPG Maker lui-même — `Graphics._errorPrinter` et le flou de `_applyCanvasFilter`, *« TypeError / Cannot read property 'concept' of undefined »* — `secondesPlantage` 3, puis elle le brise ; ni `SceneManager` ni `_errorShowed` ne sont touchés, un vrai plantage pendant ce temps reste affiché ; une fois par combat, sous 50 %), **La Main sur le Jeu** 1331 (`<MainSurLeJeu>` : l'image du jeu penche et tangue — CSS sur le canvas —, se déchire en bandes, et la vraie fenêtre tremble sur PC hors plein écran, `fenetreBouge`). Derrière l'écran brisé, la **Forêt Perdue** (`fondForet` : Meadow / Forest, les fonds de la carte 73) : elle reste tout le combat, et le chant la garde. `<BriseDomaines: 1328>` : un domaine qui s'ouvre — même le Monde Gelé posé sur elle, qui l'immobilise — est tranché à la fin de l'action qui l'a ouvert, sans lui coûter son tour (`Interactions.forcer`). Le **chant** : ses deux `<Chant:>` (copiées du troll, la dernière compte : *couplet_1, refrain, couplet_2*, partitions à écrire ; sans elles, MOG au hasard 60 s), sous 70 %. Pendant un effet, l'action attend (`isAnimationPlaying`) et la page aussi (`setWaitMode('avatar')` ; sans affichage, l'effet se termine seul). **IA au maximum** (niveau 100) : la Reine — Contre-Sort tant qu'elle n'est pas renforcée, La Règle du Lieu sur le plus faible (≤ 35 %), Le Compte Est Bon tous les 3 tours, Fleur Écarlate sous 50 % (25 %), Malédiction sur la meilleure magie, Trait Négatif, Venin Lent, Souffle Corrompu ; l'avatar — Tranche-Concept si un domaine est ouvert, Le Jeu Plante une fois sous 50 %, Briser l'Écran et La Main sur le Jeu en alternance (`LAvatar.depuis`), Âme Suprême sur le plus faible, Dôme Cosmique sous 30 %, Flammes d'Âme, Distribution des Rôles, Lame Maudite, Lame de Mana Sombre. Gardé tel que JOKO l'a mis : « Petits en nombre » (`<MecaNombre: 120>`, jusqu'à +120 % quand ses PV baissent ; la barre du boss le dit), les troupes 555, 831 (sa page 1 passe seulement en « Combat »), 832, les ennemis 832, 833, l'événement commun 65 « trnche monde ». **PV et mesure** (réglables) : Reine **70 000**, avatar **130 000**. Avec la copie corrigée de `lequipe_a_chaque_niveau` (les états vieillissent, `DIAG=92,89`) : à 120 000 / 200 000, deux défaites en phase 1 (tours 6 et 9) ; à 70 000 / 130 000, deux défaites — tour 6 la Reine à 5 000, tour 8 l'avatar à 75 % — : ce qui tue, c'est Fleur Écarlate et sa Pourriture, et Cendreux (rang A, 42 421 PV, Fournaise) ; l'IA du banc ne soigne presque pas. Banc : `navigateur/la_souveraine_ecarlate.js` (37 contrôles).

**Les plantages** (2026-11-03 ; JOKO : *« vérifie dans le jeu que crash. Je me saoule qu'il y ait autant de crash »*, puis *« Système de runes avec les pièges, c'est ça qui marche pas »*). Son « Cannot read property 'scope' of null » en combat : après « Garder / Piège » (une rune de zone), `LEcrit.choisirRune` **réactivait la liste des compétences**, cachée derrière la fenêtre des cibles ; une fenêtre cachée mais active répond encore aux touches et à la souris : un clic droit l'annulait, l'action se vidait, et la fenêtre des alliés relisait l'action vide. La liste reste inactive, comme après un OK ; et `YEP_BattleEngineCore` (`specialSelectionText`, marqué `[JOKO]`) ne lit plus une action vide. `GALV_TimedMessagePopups` (copie corrigée `[JOKO]`, l'original v2.0 dans l'historique git) : une bulle `<c:0>` lancée sans événement (un événement commun en processus parallèle) ou sur un événement absent plantait (« screenX of undefined ») — sur le joueur pour 0, pas de bulle sinon. Vérifié : la chasse aux bugs, 3 370 pages et événements communs joués, aucune erreur dans le jeu (les « ✎ » à part) ; le combat du troll (troupe 91) jusqu'au chant et retour, sans erreur. Banc : `navigateur/les_menus_de_combat.js` (chaque commande, ligne, rune au choix et cible de chaque héros, annulée d'un clic droit ; jamais deux fenêtres de saisie actives ; les deux contre-épreuves).

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
après l'action d'un ennemi (côté héros : seulement s'il a visé un héros), ou quand on ferme le cercle. **Deux runes au choix** (v2.1,
JOKO, 2026-10-27 : *« tu mets un truc, et c'est toi qui l'actives au bon moment. C'était supra méta »*, garder le cercle et rajouter
l'ancien, puis *« Deux runes au choix »*) : en lançant une rune de zone, une fenêtre demande **ᛟ Garder** (elle attend au sol qu'on
ferme le cercle, comme l'Écrit d'avant) ou **✒ Piège** (elle part quand l'ennemi agit) ; une rune à une cible ne demande rien ; sans
choix (combat auto, bancs), `solParDefaut` « piege ». Réglages `solAuChoix`, `solParDefaut`, `nomGarder`, `nomPiege` ; l'aide dit « au
sol » ou « piège ». Banc : `les_runes` ⑦. Chaque écrit est une rune « Rune de
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

**Le combat fluide et son rapport** (`CombatFluide.js` v1.0, `RapportDeCombat.js` v1.0, 2026-11-10 ; JOKO : *« Améliore le jeu la fluidité des
combats et un rapport des combats que le joueur va faire »*, et pour le rapport : *« Dans le jeu, après le combat »*). **Mesuré d'abord** (le vrai
combat avancé image par image, sans horloge : l'équipe contre Kevératus, trois tours) : une action dure 221 images (3,7 s) — 45 % l'animation,
31 % des pauses où rien ne bouge, 9 % les pas. **① Les temps morts** : en vue de côté le journal n'affiche pas ses lignes (SimpleMsgSideView),
mais chacune faisait attendre 16 images (Korrah : 107 images par action sans rien à l'écran) — une ligne invisible n'attend plus (`attenteMuette`
0), la pause du journal 16 → 8 (`attenteJournal`), le geste du héros 20 → 12 (`attenteGeste`) ; un « wait: n » écrit dans une séquence d'action
n'est pas touché. **② Les images chargées d'avance** (`precharger`) : MV charge l'image d'une animation quand elle part (un arrêt la première
fois, bien plus long en ligne) — maintenant quand la technique est choisie, au début du tour pour tout ce qui est prévu, au début du combat pour
ce que les ennemis savent faire (l'arme pour l'Attaque, les « animation n » des séquences). **③ Les animations** : 3 images par dessin en combat
au lieu de 4 (`cadence` ; la carte ne change pas). **④ L'avance rapide** : Maj tenue, ou un appui long (souris, doigt), les actions défilent ×3
(`avanceRapide`, `touches`, `doigt`) — jamais pendant la saisie, un message, un chant, les effets de l'avatar d'Ardélia, la victoire ; pas « ok »
(tenue, elle validerait le menu suivant). **⑤ L'option « Vitesse des combats »** (Normale ×1 par défaut, Vive ×1,25, Rapide ×1,5, Très rapide ×2).
Mesure : les mêmes actions, 156 → 112 images (2,6 s → 1,9 s), −28 % ; les pas ne changent pas. `CombatFluide._eteint = true` rend tout comme
avant. CombatFluide est le **dernier** plugin de la liste (il rejoue `Scene_Battle.update` : un plugin chargé après lui ne serait pas accéléré).
**Le rapport** : une étape de l'écran de victoire (YEP_VictoryAftermath, entre l'expérience et le butin) — tours, durée, ennemis vaincus ; pour
chaque héros au combat (seiryu compris) ses dégâts infligés (une barre : sa part de l'équipe), reçus, ses soins (les PV vraiment rendus), combien
de fois il est tombé, son meilleur coup ; le plus gros coup du combat (« ★ Record battu » : le record de la partie, dans `$gameSystem`), les
réactions élémentaires, les boucliers brisés, qui est tombé. Compté : le chiffre qui s'affiche (après le rang, la brisure, l'instinct) ; pas le
poison ni une mort d'état (l'Ogre a « mort 20 % » sur son attaque). Réglages `toursMin` (1 = toujours), `records` ; commande `RAPPORT off / on`.
Les lignes du Pacte, de la Colère, du livre, de la phrase et de seiryu s'écrivaient sur l'écran de victoire : elles s'effacent dès qu'il s'ouvre.
Banc : `navigateur/le_combat_fluide.js` (38 contrôles ; ⚠ `Graphics.frameCount` ne monte qu'au dessin : un banc sans dessin le monte lui-même,
sinon la jauge d'expérience de la victoire ne finit jamais).

**Les favoris et « Refaire »** (`LesFavoris.js` v1.0, 2026-11-10 ; JOKO : *« Si je devais améliorer un truc ? »* — les menus de capacités : Korrah 92
lignes, Aël 93, ludwing 72, neuf à l'écran — puis, aux Favoris et à « Refaire » : *« Pourquoi pas »*). **★ Favoris** : dans une liste de techniques
(en combat ou au menu), Maj — ou un appui long — épingle la technique sous le curseur (une étoile sur son icône), la même touche l'enlève ; 8 par
héros (`favorisMax`), dans la sauvegarde (`actor._favoris`) ; « ★ Favoris » sous l'Attaque les ouvre (vide, la liste dit comment épingler) ; un
favori que le héros ne voit plus dans aucun menu (désappris, un autre Style) n'est pas montré et revient. **↻ Refaire** : « ↻ Nom » sous l'Attaque,
la dernière technique choisie (`lastBattleSkill` de MV ; jamais l'Attaque, la Garde, ᛟ Activer — `pasRefaire`) : OK la relance **par le vrai
chemin** (`onSkillOk` : une rune de zone redemande Garder / Piège), le curseur déjà sur la même cible si elle est debout ; grisée si on ne peut pas
la payer. Ce sont des branches qui n'existent que dans le menu (904, 905 ; 901-903 sont les arts) : aucune fiche ni liste n'est touchée. Piège :
pendant que les branches s'ajoutent aux ordres, nos deux lignes sortent de la liste puis y reviennent (LesStylesDeVesper retire toute branche
« vide pour ce Style », et LesTroisArts range ce qui vient d'être ajouté en comptant les lignes : une ligne retirée au milieu mettait « capacité »
devant les Voies chez Vesper — attrapé par `un_menu_par_art`).
Pas fait (proposé, à montrer d'abord) : replier les degrés d'une même technique. Banc : `navigateur/les_favoris.js` (20 contrôles ; ⚠ choisir une
technique charge une image — CombatFluide — : un banc qui n'avance que « si les images sont prêtes » se fige dans un `evaluate`).

**Le menu des capacités et le tableau des éléments** (`OrbeDesCapacites.js` v1.1, `LeTableauDesElements.js` v1.0, 2026-11-11 ; JOKO : *« j'aimerais que
tu retravailles le menu de compétence hors combats et le tableau des éléments »*). **L'Orbe** (il reste l'Orbe : le héros, ses branches, ses nœuds) :
la liste écrit le **nom court** (« Premier art de l'épée : Fil du Vent » → « Fil du Vent » ; les noms entiers étaient écrasés), le **coût dans sa
monnaie** et sa couleur (PM, PT, PV — le vrai, affinité comprise ; la barre de défilement mangeait « PM »), l'étoile d'un favori ; le bandeau du bas
(184 px) : le nom entier, ses **étiquettes** (VOIE / PAROLE / RUNE, l'élément, la cible, la recharge, « en combat », « ◇ hors affinité », le coût),
la description **entière** sur trois lignes (elle finissait par « … » sur deux), les touches ; le titre dit la branche et « 8 / 18 apprises ».
**Tab** épingle la technique dans les favoris du combat (Maj reste la montée de niveau de l'Orbe ; `LesFavoris` prend « shift, tab »). Pour un
banc : `OrbeDesCapacites.nomCourt / couts / etiquettes`. **Le tableau** : l'ancien (VisualMaxEX, gardé — `TableauDesElements.ancienne`) listait les
noms avec un tiret en face et disait encore « recul PV — la forme projetée » ; le nouveau prend sa place (`Scene_MvxElements`, la commande
« Éléments » du menu), trois pages, ← → : **① Les trois arts** (le triangle dessiné, la phrase de la Genèse, source / art / mana / monnaie / temps,
ce que le triangle vaut dans le jeu — la médiane des fiches d'ennemis par courant : ▲ ×1,8, ▼ ×0,55-0,6 —, les affinités de l'équipe et la règle
hors affinité) ; **② Les réactions** (la grille 8 × 8, le curseur s'y promène, le bas dit l'effet avec les chiffres des réglages de FusionElements
et qui dans l'équipe peut la faire, seul ou à deux) ; **③ L'équipe** (par héros, ses techniques apprises qui blessent par élément, et les réactions
qu'il fait seul). Tout est **lu** dans le jeu (System.json, les fiches, les réglages) : rien n'est recopié. Banc :
`navigateur/le_menu_et_le_tableau.js` (30 contrôles). **Proposer d'abord** (JOKO, 2026-11-11 : *« Propose des idées et dit ton avis avant de faire
quoique se soit »*) : six idées proposées avec un avis, il a dit *« Oui »* — lu : les deux recommandées. **Ctrl range la liste de l'Orbe** (v1.2 : par
niveau → apprises seulement → par coût → par élément ; rien n'est retiré, le curseur reste sur sa technique, le pied dit le tri). **Ctrl ouvre les
réactions en combat** (`LeTableauDesElements` v1.1) : pendant la saisie (les ordres ou la liste), la page des réactions par-dessus le combat, fond
plein, le curseur sur l'élément qu'un ennemi porte et sur une case qui réagit, « Sur le terrain » dit qui porte quoi ; Ctrl ou Échap la referme et
la même liste reprend au même endroit. Ce n'est pas une autre scène (revenir dans Scene_Battle relancerait le début du combat) ; ⚠ MV rouvre la
fenêtre des ordres dès qu'aucune fenêtre de saisie n'est active (`changeInputWindow`) : tant qu'il est ouvert, `isAnyInputWindowActive` répond oui.
Pas faites : replier les degrés (à montrer d'abord), fusionner la page « équipe », marquer les techniques nouvelles. (⚠ une fenêtre à défilement ne dessine que ses lignes visibles : un banc qui lit ce qui
s'écrit appelle `drawItem` pour chaque ligne).

**Les menus** (`LesMenus.js` v1.0, 2026-11-12 ; JOKO : *« Continue dans les menus pour les améliorer ou refaire »*, puis, sur six idées proposées avec un
avis : *« Oui tout »*). **① En français** — les mots sont changés là où ils sont : `System.json` (HP / MP / TP → **PV / PM / PT**, « PV max », « PM max »),
les réglages de YEP_ItemCore (« Soin %1 », « + État », « − Bonus »…), YEP_EquipCore (« <Vide> »), YEP_SaveCore (« Temps de jeu : », Oui / Non),
TSR_EquipSlots (PV max, ATQ, DÉF, AGI, CHA…), ItemBook (Prix, Équipement, Type) ; dans le plugin, seulement ce qui est en dur : « remove / optimize /
cancel / change / equip » de l'écran d'équipement (les symboles ne bougent pas). **② Les Carnets** : Bestiaire, Encyclopédie, Musiques, Éléments et
Statistiques sous une ligne « Carnets » après les Quêtes (`carnets`, `nomCarnets`, `apresQuoi` ; vide : rien ne bouge) — une petite liste, chaque
commande rappelle le gestionnaire que le menu lui avait donné. **③ Le Statut** : la description entière (le corps se resserre de 20 à 13 jusqu'à ce
qu'elle tienne ; ManaVisuals la coupait à 20). **④ Le Bestiaire** (`bestiaireRange`) : les rencontrés d'abord, une ligne « ?????? × n », le bas dit
« 12 / 593 créatures rencontrées » ; les deux fenêtres d'EnemyBook sont privées : on les rejoint par la scène, une fois. **⑤ Les Options**
(`optionsRangees`) : Jeu, Combat, Affichage, Son (`LesMenus.groupeDe`, par le symbole puis le nom ; inconnue → Jeu), le curseur saute les titres.
**⑥ Le menu principal** (`menuRefait`) : dix commandes sans défiler, **les cinq combattants** (seiryu était sous la flèche) — visage, nom, classe,
niveau, états, PV / PM / PT en barres et en chiffres —, et sous les commandes une fenêtre : le lieu, le jour et l'heure (MOG_TimeSystem), « ✦ Âmes »
(c'était « ✦ 0 » sans un mot, PorteurDAmes) et l'or ; les fenêtres d'avant sont cachées, pas retirées. Banc : `navigateur/les_menus.js` (18 contrôles).

**Le système : états, objets, armes, armures** (`bancs/outils/le_systeme.js`, 2026-11-12 ; JOKO : *« Maintenant pour le système surtout état, objets,
arme et armure […] tu peux changer ce qui est déjà là pour l'améliorer […] mais toujours tu proposes, on réfléchit ensemble »*, puis, sur six idées :
*« Oui tout mais reste cohérent au lore aussi »*). **États** : une icône aux 15 qui agissent et n'en avaient pas (les Résistances — Eau à Positif prennent
l'icône que le jeu donne à leur élément, comme Résistance — Feu et les auras ◈ ; les 9 marqueurs des plugins, sans effet, restent invisibles exprès :
un héros n'affiche que deux icônes) ; sur les 50 états « sans fin », 48 sont voulus (passifs `<Custom Passive Condition>`, marqueurs, armes de ludwing
tenues par un plugin) — **Domaine Déployé (16)**, posé par une compétence de héros, restait sur lui après le combat : il finit avec le combat ; noms
distincts : Normal · Korrah / Vesper / ludwing (62-64, les jauges 12, 14, 13), Provocation · garde baissée (69, la DÉF à 0 ; 152 reste « Provocation »),
Euphorie · vitesse (186 ; 167 reste « Euphorie »). **Prix** : 112 armes et 9 armures à 0 reçoivent celui de la règle (puissance = ATQ + DÉF + ATQ M. + DÉF M. +
AGI + CHA + PV/10 + PM/5, × la médiane des prix posés : 35,7 G par point pour une arme, 34,5 pour une armure) — jamais les mains nues, jamais les pièces
de l'Âme, **jamais un prix déjà posé** (51 s'écartent de plus du double de la règle, surtout les Légendaires et Runiques : listés, à JOKO). **Descriptions**
(54 armes, 4 armures, la clé de l'auberge) : ce que la pièce FAIT, lu dans ses traits (« Hache : AGI −5. », « Épée : PM max +5 · ATQ M. +36 ») — aucun
lore inventé ; le « cored » (68) reste muet. **Le tableau des pièces sans source** (`docs/EQUIPEMENT_SANS_SOURCE.md`, une mesure) : 171 armes sur 226,
63 armures sur 69, 39 objets sur 104 ne sont ni en butin, ni en boutique, ni donnés par un événement — chacune avec son **rang** de la Bible (*« une relique
a un rang selon ses performances »*, D à S selon sa puissance parmi celles de son genre) ; rien n'est posé sur les cartes. Le fichier garde la forme de
RPG Maker (une entrée par ligne). **Proposé, pas fait** : l'identité par l'équipement (quels types d'armes pour qui) — la Bible ne le dit pas, à JOKO.
**`LesMenus` v1.1** : sur l'écran d'équipement, la description se replie sur les deux lignes de sa case (corps 18 → 13) — TSR_EquipSlots l'écrivait d'une traite : 182 descriptions sortaient du cadre, les 54 neuves et celles de JOKO (« Relique du Fond… », la forge, les armes d'ombre) ; `tous_les_menus` l'a attrapé, son texte n'est pas touché. Banc : `26_le_systeme.js` (14 contrôles, dont 6 contre-épreuves : une icône retirée, un état sans fin posé par un héros, un double, un prix à 0, une
description qui ment sur l'élément ou une statistique).

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
  n'appelle plus `BattleManager.update` et le combat se fige sans erreur ;
- une fenêtre **cachée** (`hide()`) mais active répond encore aux touches et à la souris
  (`isOpenAndActive` regarde l'ouverture, pas la visibilité) : jamais deux fenêtres de saisie actives
  à la fois — après un choix glissé entre la liste et la cible, ne pas réactiver la liste.
- une fenêtre de saisie **ajoutée** à Scene_Battle doit se déclarer dans `isAnyInputWindowActive` : sinon, dès que
  la liste d'en dessous est désactivée, MV rouvre les ordres derrière elle (`changeInputWindow`) et OK valide les
  deux — le choix « Garder / Piège » de `LEcrit` ne lançait plus la rune (JOKO, 2026-11-13 ; `les_runes` ⑦) ;
- « Traitement du combat » (301) **dans un combat ne fait rien** : une phase 2 se fait par « Transformer
  l'ennemi » (336), dans le même combat ; et une page « ennemi à 0 % » ne se joue que s'il ne tombe pas
  (Immortel, état 3) — sinon le combat finit avant ;
- une page de troupe en portée **« Moment »** se relance dès qu'elle finit : avec un texte, le combat ne
  commence jamais ;
- « Soigner l'ennemi » (334) **retire aussi tous ses états** (Immortel compris) : les reposer après.

---

## 8. Git

**Ce qui est pour le jeu va directement sur `main`, sans pull request.** JOKO, le 2026-10-14 :
*« pas de pr (pour ce qui est pour le jeu.) Met sur le main directement »*. Je travaille sur la
branche que la session désigne, puis je pousse aussi sur `main` en avance rapide
(`git push origin HEAD:main`) — jamais en force : si `main` a bougé, je récupère d'abord ses
commits. Pas de pull request sans demande explicite.

**Le jeu en ligne** (2026-11-03 ; JOKO : *« Met le jeu possible d'accéder par URL directement et qui se
met à jour grâce à github »*, puis *« Un 2e dépôt, juste le jeu »*). Project1 reste **privé** ; à chaque
push sur `main` qui touche le jeu (data, js, img, audio, fonts, icon, index.html),
`.github/workflows/jeu-en-ligne.yml` construit la version web (`tools/version_web.js`) et la publie,
en une seule version sans historique, dans le dépôt **public** `lussamakijosuee-spec/Project1-jeu`, que
GitHub Pages sert à https://lussamakijosuee-spec.github.io/Project1-jeu/. Il lui faut le secret
`JETON_JEU` (un jeton à JOKO qui peut écrire dans Project1-jeu ; sans lui : un avertissement, rien de
publié). Le jeu pèse plus de 4 Go, Pages en prend 1 : la version web ne garde que ce que le jeu cite
(~750 Mo — les ~5 500 sons d'internet jamais cités et `audio/_originaux_mp3` restent) ; un nom cité avec
d'autres majuscules que son fichier (« Inn » / INN.ogg) y est copié sous le nom cité (en ligne, la casse
compte) ; un nom qu'un plugin fabrique (« flame_0 » pour Flame_0.png, MOG_EventIndicators, carte 16) est
corrigé dans le navigateur par `js/casse_web.js` (`tools/casse_web.js` + la liste des fichiers, chargé en
premier, sur `src` et `XMLHttpRequest` : YEP_X_CoreUpdatesOpt remplace les chargeurs de MV) ; un son sans
.m4a (Safari, iPhone) y est converti par ffmpeg. Rien de privé n'y part (ni docs,
ni bancs, ni studio, ni CLAUDE.md). Le jeton et le secret sont à JOKO : je ne crée ni ne colle de jeton.
**Sans le jeton** (JOKO, 2026-11-05 : *« Oui, fais-le »*) : `PUBLIER_EN_LIGNE.bat` (`tools/publier_en_ligne.js`)
fait la même chose depuis son PC, par son accès git — la version web des fichiers du PC tels qu'ils sont
(RPG Maker ouvert : enregistrer d'abord), envoyée dans Project1-jeu (une version, sans historique ;
`dist/web.git` garde ce qui est en ligne, seule la différence repart : 321 octets quand seul `version.txt`
change), puis l'attente de GitHub Pages. L'auteur d'une version publiée est l'adresse noreply de GitHub
(`293176437+lussamakijosuee-spec@users.noreply.github.com`), jamais l'e-mail de JOKO : le dépôt est public.
En ligne depuis le 2026-11-05 (écran titre, nouvelle partie et combat essayés sur la vraie adresse). En ligne, les sauvegardes restent dans le navigateur de chaque
joueur. Banc : `la_version_web.js` ; et la chasse aux bugs se joue contre la version web
(`ETT_URL`, un serveur qui respecte la casse).
