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
copiée dès la première fois. **Dépenser** : invocations (type 8, ouvert sur la classe 3) ; la branche
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
**Pas d'état posé** (`etatLongue` 0) : le 227 d'Aël fragilise. `FusionElements` est **éteint** (sa
fusion de n'importe quels deux sorts, avec 10 collisions, est remplacée) ; `ParolesSysteme` garde son
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
système passe par une annonce, jamais par le seul journal. **Restent muets, à JOKO de dire** : les messages des
boss (`MecaniquesDeBoss` — la Dîme et son compte —, `DonoBoss`, `DonoKamui` — « c'est LE moment ! » —,
`MahoragaBoss`, la Parole ratée des ennemis de `ParolesSysteme`) et des dons (`RoyaumeImperial`, `JackpotHakari`,
`LouCopySystem`) : ce sont ses ennemis et ses dons, je ne les ai pas touchés.
**Le menu de combat cachait le rework** : `FamillesDeCapacites` replie en une ligne les compétences aux mêmes chiffres
(branche, portée, nature, élément, états) — 43 capacités à verbe, et « ᛟ Activer » (sur soi, sans dégâts), étaient
repliées sous une voisine. Depuis le 2026-10-23, l'**art** et le **verbe** (et « instantanée ») font partie de la
famille, et Activer ne se replie jamais. Le menu s'allonge d'autant (au niveau de départ : Korrah 76 → 92 lignes,
ludwing 61 → 72, Aël 69 → 93, Vesper 25 → 27) — presque tout vient des verbes, l'art seul n'en ajoute qu'une ou deux.
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
Douter, Ombre Prêtée, Lotus des Ténèbres, Âme d'Ombre), Aël parle (Halo seul est écrit), Vesper bouge (ses
gardes ; L'Équilibre Tenu est écrit), Korrah bouge (prises, postures) et parle (ordres de l'esprit, Ralentir
qui confie ses PM) ; restent sans art Fuir, revelation, VUE et les pièces des dons (438, 818, 14, 111, 69).
**« Sauf les dons »** : les types ouverts par l'acteur ou par son don (4, 5, 6, 8-24, 26) et 71, 810,
438 ne changent pas ; ni 15, 18, 96, 148, 1173, dont un ennemi se sert. Recharges (règle de `18_recharges`) :
retirées sur 8 mouvements que leurs PT limitent, posée sur Annihilation des Ténèbres (68). **La barre de PT**
(JOKO : *« oui pour le 2 »*) : l'Attaque rend 20 PT (× TCR ~2,4 ≈ 47), les Reliques 44-46 ne les gardent plus.
**Éteints** : FusionMana, ElementsVivants, LeSpirituel ; ManaAffinity : recul 0 / 0, `elPur` 99 (7 est le
spirituel). Les 9 Voies de MaitriseVoies restent (les styles du corps ; le Masque de Vesper boit le drain du
Sang). Banc : `navigateur/les_trois_arts.js`.

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
attendent déjà »). Banc : `navigateur/l_ecrit.js`.

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
Saignée Continue devient **son écrit** (*« on attend que ça fasse effet »*, 7 % PV) ; Korrah : Le Creux Entre
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
