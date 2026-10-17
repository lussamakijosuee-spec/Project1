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
| Korrah | hiver *(type 6)* + avatar *(type 21)* — **seulement tant que seiryu est là** | `SeiryuLeFamilier.js` |
| ludwing | l'âme et l'ombre — Royaume Impérial | `PorteurDAmes.js`, `RoyaumeImperial.js` |
| Aël | miracle — Lecture, Contrat, Portes | `LaBibliothequeDAel.js` |

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
de `studio/scenes/` sont à JOKO : je n'en écris pas sans lui.

**Sur le PC de JOKO** : Node 24 et Playwright (dans `node_modules/`, ignoré) sont installés depuis
le 2026-10-17. Les bancs navigateur y tournent lentement (Chromium sans carte graphique) :
`les_outils_de_scene` y fait 7 échecs de minutage, les mêmes sur la version d'avant — pas un bug.

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
  de MV : GALV_TimedMessagePopups plante sur `this._params.clone`. Passer par `W.JSON.parse` du jeu.

---

## 8. Git

**Ce qui est pour le jeu va directement sur `main`, sans pull request.** JOKO, le 2026-10-14 :
*« pas de pr (pour ce qui est pour le jeu.) Met sur le main directement »*. Je travaille sur la
branche que la session désigne, puis je pousse aussi sur `main` en avance rapide
(`git push origin HEAD:main`) — jamais en force : si `main` a bougé, je récupère d'abord ses
commits. Pas de pull request sans demande explicite.
