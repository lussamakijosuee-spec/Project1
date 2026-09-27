# Les habitants — ce qui a été mis dans le jeu

> Généré par `node bancs/outils/rapport_habitants.js` à partir des fiches de
> `bancs/outils/habitants/`. 112 personnages.

Inspirations données par JOKO : **Skyrim** pour l'immersion, **Kenshi** pour la dureté du
monde, **GTA** pour la ville qui vit toute seule. Et on reste dans un RPG médiéval
magique : les gens mènent leur vie, quoi qu'il se passe autour d'eux.

Ce que JOKO a fixé le 27/09 :

| Sujet | Décision |
|---|---|
| Magie | courante mais modeste (lampes enchantées, petits sorts, fioles) ; tout le monde connaît les Dons |
| De quoi on parle | du lord et des nobles, en **ragots vagues** : taxes, soldats, fêtes, invités. Aucun mystère inventé ; la suite du lore viendra de JOKO |
| Ton | dur mais ordinaire : misère, dettes, soldats qui se servent, morts au travail |
| Croyances | aucune pour l'instant : personne ne prie, personne ne jure par un dieu |
| Bar | ouvert de 10 h à 4 h |
| Auberge | toujours ouverte |

---

## 1. Les horaires de JOKO réparés

Les pages de JOKO testaient les interrupteurs **101 à 115** (« Sunrise », « Day »…,
« Friday »). Or MOG_TimeSystem allume en réalité les interrupteurs **200 à 214**
(« TS · Lever du jour »…). Aucun événement ne pouvait donc s'afficher à son heure.

| Avant | Après |
|---|---|
| 101 Dawn · 102 Sunrise · 103 Day · 104 Sunset · 105 Dusk · 106 Night | 200 · 201 · 202 · 203 · 204 · 205 |
| 107 Day Shift · 108 Night Shift | 206 · 207 |
| 109 Sunday … 115 Saturday | 208 … 214 |

Trois autres corrections, faites par `bancs/outils/reparer_les_horaires.js` :

- **Flamme de l'auberge.** Une page à deux moments (« Crépuscule » ET « Nuit ») n'est
  jamais vraie. Elle est devenue deux pages : Crépuscule OU Nuit.
- **Toujours la même flamme.** Sa page sans condition était la dernière, donc elle
  gagnait toujours. Elle est remise en tête.
- **Le soigneur de l'auberge.** Son animation se relançait à chaque image. Il attend
  maintenant 2 secondes entre deux animations.

Les noms 101 à 115 sont gardés, précédés de « ✗ jamais allumé → 2xx », pour ne plus
s'y tromper.

**À savoir pour tes prochains événements :** utilise les interrupteurs **TS · …**
(200 à 218) dans les conditions de page.

## 2. Les gens vivent leur vie

### Dehors (Ville Forestière, Marché, Village de Pêche, Village Montagnard)

Ces quatre cartes utilisent maintenant l'extension **VieDuVillage**, passée en v1.1.

**La journée type :**

| Heure | Ce qu'ils font |
|---|---|
| 6 h | ils sortent |
| journée | ils travaillent à leur poste |
| 12 h | ils vont sur la place |
| soirée | ils flânent |
| 21 h | ils rentrent chez eux et disparaissent |

- **Les gardes** ne rentrent jamais : ils font leur ronde la nuit.
- **Les marchands** tiennent leur étal de 7 h à 20 h.
- **Sous la pluie**, tout le monde rentre, sauf les gardes.

**Ce qui est nouveau :** un commentaire sur la page suffit.

| Commentaire | Effet |
|---|---|
| `<Agenda: 9-11 0,24 ; 12-14 20,15>` | à ces heures, il va à cette case. Si c'est une porte ou une sortie de carte, il y entre (il est « au marché », « au bar ») |
| `<Soiree: 14,32>` | de 18 h à 21 h, il va à cette porte. C'est la porte du bar de la Ville Forestière : Gaston, Colette et Mado y vont chaque soir |
| `<Logis: 7,24>` | sa porte à lui, au lieu de la plus proche |
| `<Vie: fixe>` | il garde la ronde que JOKO lui a tracée (gardes au déplacement personnalisé) |

### Dedans (bar, auberge, boutiques, manoir)

C'est l'extension **Habitants**, en v1.1.

- **Les horaires** se mettent dans la **Note** de l'événement : `<Horaire: 18-4>`, `<Saisons: 1,2,3>`.
- **Personne ne clignote.** À la fin de son heure, le PNJ **marche jusqu'à la porte**,
  puis disparaît. À son heure, il **entre par la porte** et va à sa place.
- **S'il est bloqué**, au bout de 12 secondes il « se téléporte ».
- **On ne part pas au milieu d'une phrase** : le PNJ attend la fin du dialogue.
- **Pour tes PNJ à interrupteur de moment**, ajoute `<Passage>` dans la Note : ils
  entrent et sortent à pied aussi. C'est déjà fait pour tes clients de la forge, et
  pour Gaspard et Edmée.

## 3. Les portes

Toutes les portes des villes ont été refaites par `bancs/outils/poser_les_portes.js`.
Chacune garde **exactement** la destination que tu avais posée.

**Heures d'ouverture :**

| Ce qu'il y a derrière | Ouvert |
|---|---|
| boutique | 8 h – 20 h |
| bar | 10 h – 4 h |
| auberge | toujours |
| maison | 6 h – 22 h |
| manoir | 7 h – 21 h |

- **Quand c'est ouvert**, la porte s'ouvre (son et animation), on passe, elle se referme.
- **Quand c'est fermé**, l'écriteau le dit, et on peut **frapper**. Quelqu'un répond,
  selon ce qu'il y a derrière.
- **Une porte sans destination** est une maison fermée à clé. On frappe : le jour,
  quelqu'un répond (8 réponses) ; la nuit, on râle (5 réponses). Dans l'auberge,
  c'est une chambre occupée.
- **Non touchée :** la porte à clé de l'auberge (ta quête).

**Intérieurs** — extension **Interieurs** :
- **Quelles cartes** : une carte dont le tileset s'appelle « Intérieur… » ou « Donjon »
  est un intérieur. `<Intérieur>` ou `<Extérieur>` dans la Note force le choix.
- **En entrant** : la météo des saisons s'arrête et la teinte de nuit s'efface.
  L'heure continue de tourner.
- **En sortant** : tout revient.
- **Rien à mettre dans les portes.**

## 4. Comment parle un habitant

Chaque habitant est fait de commandes MV ordinaires, modifiables dans l'éditeur. Il
suit la même mécanique que ton aubergiste, en plus fin.

- **Il se souvient de toi.** La première rencontre est à part, et il remarque
  quand tu reviens après 7 jours d'absence.
- **Il dit bonjour selon le moment** (matin, après-midi, soir, nuit) et fait une
  **remarque de saison**.
- **Il réagit si ton chef d'équipe est blessé.**
- **Son menu revient après chaque sujet**, jusqu'à « Au revoir » :
  - Discuter ;
  - Quoi de neuf ? (ragots, dont certains propres à la saison) ;
  - **son sujet à lui**, qui s'ouvre au fil des visites : au début il se ferme, au
    bout de 4 à 10 visites il raconte sa vraie vie ;
  - ce qu'il vend ou propose.
- **Des histoires se croisent :**
  - Lise, du bar, est la fille de Gaudry le forgeron.
  - Blanche, au manoir, est la sœur de Lila la bergère.
  - Pia amoureuse de Colin.
  - les jumeaux Vannier.
  - Roul et Tobin.
  - Berthe qui nourrit Théo en cachette.

**Pour relancer après une modification d'une fiche :**
`node bancs/outils/poser_les_habitants.js --ecrire`. L'outil réécrit la page de
l'habitant ; tes boutiques, tes quêtes et tes commentaires d'origine sont gardés.

## 5. Les personnages

### Ville Forestière — carte 29 (21)

| év. | Qui | Sa voix | Quand | Ce qu'il propose |
|---|---|---|---|---|
| 11 | **Brunehaut** — garde de la porte nord | sèche, sarcastique, dévisage les voyageurs. | — | « Pourquoi garde ? » (2 paliers) |
| 12 | **Oswin** — jeune garde de la porte nord, s'ennuie | jeune, las, rêve d'être muté au manoir. | — | « Le manoir ? » (2 paliers) |
| 14 | **Arno** — recrue, vient de recevoir son Don | nerveux, fier, parle trop vite. | — | « Ton Don ? » (3 paliers) |
| 25 | **Élise** — jeune femme, se promène avec Tomas (la ronde tracée par JOKO) | vive, impatiente, rêve d'ailleurs. | — | « Et Tomas ? » (2 paliers) |
| 26 | **Tomas** — jeune homme, se promène avec Élise | posé, casanier, amoureux, un peu inquiet. | — | « Et Élise ? » (2 paliers) |
| 27 | **Gaston** — paysan, râle contre les taxes, finit ses journées au bar | grognon, fataliste, drôle malgré lui. | le soir au bar | « Votre ferme ? » (2 paliers) |
| 28 | **Hilde** — mère de quatre enfants, débordée | pressée, affectueuse, parle en surveillant ses enfants. | agenda 9-11 0,24 | « Et vous, Hilde ? » (2 paliers) |
| 29 | **Fernand** — vieux paysan, prédit le temps | lent, sage, un peu sourd. | — | « Vos genoux ? » (2 paliers) |
| 30 | **Sergent Doran** — sergent de la garde, suit la ronde que JOKO lui a tracée | autoritaire, bourru, protège ses hommes. | garde la ronde de JOKO | « Et le lord ? » (2 paliers) |
| 31 | **Ida** — garde, rude, n'aime pas les escortes de nobles | franche, dure, un humour tranchant. | — | « Pourquoi la garde ? » (2 paliers) |
| 32 | **Paulin** — garde, joueur, doit de l'argent à Anselme | rigolard, parieur, toujours une combine. | — | « Ta paie ? » (2 paliers) |
| 33 | **Mathis** — guetteur, en haut près de la porte nord | rêveur, observateur, parle du ciel. | — | « Qu'est-ce que tu vois ? » (2 paliers) |
| 34 | **Rolf** — garde de la porte sud | jovial, colossal, mange tout le temps. | — | « Tu manges tout le temps ? » (2 paliers) |
| 35 | **Konrad** — garde de la porte sud, taciturne | lent, deux mots par phrase, regard lourd. | — | « Tu parles peu. » (2 paliers) |
| 36 | **Béran** — vétéran, trois doigts à la main gauche | cynique, las, a vu trop de guerres de lords. | — | « Les guerres ? » (3 paliers) |
| 37 | **Aude** — garde de nuit | calme, attentive, aime la nuit. | — | « Tu aimes la nuit ? » (2 paliers) |
| 38 | **Colette** — marchande d'œufs, amie de Mireille | bavarde, rieuse, chuchote en regardant autour. | le soir au bar | « Des œufs, alors ? » (2 paliers) · Acheter des œufs (5 G) |
| 39 | **Tobias** — allumeur des lampes enchantées de la ville | doux, poétique, parle de la lumière comme d'un être vivant. | — | « Pourquoi les lampes ? » (2 paliers) |
| 40 | **Kaze** — bretteur de passage | laconique, précis, regard d'acier. | — | « Pourquoi voyager ? » (2 paliers) |
| 41 | **Mado** — lavandière | forte, franche, les mains rouges, rit fort. | le soir au bar | « Le linge du manoir ? » (2 paliers) |
| 42 | **Pépin** — mendiant, ancien carrier | humble, ironique, sans apitoiement. | vit la nuit | « Qu'est-il arrivé ? » (2 paliers) · Lui donner 5 G |

### Marché — carte 30 (15)

| év. | Qui | Sa voix | Quand | Ce qu'il propose |
|---|---|---|---|---|
| 6 | **Bertrand** — marchand de primeurs | crieur, blagueur, vante ses légumes comme des bijoux. | — | « Les affaires ? » (2 paliers) · Acheter |
| 7 | **Mirabelle** — mage de quartier : recharge les lampes enchantées, vend de petits sorts | pétillante, affairée, parle vite de choses compliquées. | — | « Votre Don ? » (2 paliers) · Un Éther (40 G) · Un charme de lumière (60 G) |
| 8 | **Gustave** — fromager | lent, gourmand, parle de fromage avec émotion. | — | « Votre femme ? » (2 paliers) |
| 10 | **Rose** — fleuriste | douce, rêveuse, un peu triste. | — | « Pourquoi triste ? » (2 paliers) |
| 11 | **Tian** — marchand d'épices venu de loin | cérémonieux, patient, proverbes étranges. | — | « Votre pays ? » (2 paliers) |
| 12 | **Oriane** — apprentie enchanteresse de maître Aldebert | enthousiaste, maladroite, fait tout brûler un peu. | — | « Pourquoi la magie ? » (2 paliers) |
| 13 | **Aldebert** — vieux mage réparateur d'objets enchantés | grincheux, érudit, méprise les amateurs et adore son apprentie. | — | « Votre passé ? » (2 paliers) |
| 14 | **Selma** — diseuse de bonne aventure (charlatane, et elle le sait) | mystérieuse en surface, pragmatique dessous. | — | « Vous voyez vraiment ? » (2 paliers) · Se faire lire l'avenir (10 G) |
| 15 | **Hugo** — crieur public : annonce les décrets du lord | voix de stentor, solennelle, puis normale quand il cesse de crier. | — | « Le dernier décret ? » (3 paliers) |
| 16 | **Dame Véra** — dame noble du manoir, fait ses emplettes | hautaine, polie, curieuse malgré elle du peuple. | — | « Pourquoi venir au marché ? » (3 paliers) |
| 17 | **Jacquot** — colporteur, vend de tout et surtout n'importe quoi | bonimenteur, rapide, sympathique. | — | « Toujours sur la route ? » (2 paliers) · Voir sa marchandise |
| 18 | **Firmin** — garde du marché, suit la ronde tracée par JOKO | garde de la ville : fatigué, pragmatique, humour de caserne. | garde la ronde de JOKO | — |
| 19 | **Nestor** — garde du marché, suit la ronde tracée par JOKO | garde de la ville : fatigué, pragmatique, humour de caserne. | garde la ronde de JOKO | — |
| 20 | **Madeleine** — bouchère | solide, directe, tranche la conversation comme la viande. | — | « Votre mari ? » (2 paliers) · Acheter de la viande |
| 23 | **Lucien** — cartographe, près de la carte du monde | méticuleux, passionné, s'excuse beaucoup. | — | « Vos voyages ? » (2 paliers) |

### Village de Pêche — carte 33 (13)

| év. | Qui | Sa voix | Quand | Ce qu'il propose |
|---|---|---|---|---|
| 16 | **Jonas** — recrue de la garde, fils de pêcheur | timide, sincère, se sent trahir son père. | — | « Et ton père ? » (2 paliers) |
| 17 | **Orin** — ravaudeur de filets | patient, taiseux, parle en nouant ses filets. | — | « Vos mains ? » (2 paliers) |
| 18 | **Maëlle** — lit le vent avec un charme de coquillages | lente, attentive, parle au vent autant qu'aux gens. | — | « Le charme ? » (2 paliers) |
| 19 | **Sora** — petite fille qui ramasse des coquillages | curieuse, vive, pose des questions sans attendre les réponses. | — | « Tes coquillages ? » (2 paliers) · Accepter un coquillage |
| 21 | **Barnabé** — charpentier de barques | bourru, fier de son métier, jure beaucoup (sans dieux). | — | « Votre plus belle barque ? » (2 paliers) |
| 22 | **Yvon** — vendeur de poisson | gouailleur, crie ses prix, rit de tout. | — | « Toujours content ? » (2 paliers) · Acheter du poisson |
| 23 | **Régis** — vieux capitaine à la retraite | grandiloquent, nostalgique, exagère ses campagnes. | — | « Votre navire ? » (2 paliers) |
| 24 | **Annick** — femme de pêcheur, langue bien pendue | bavarde, drôle, lucide. | — | « Votre mari ? » (2 paliers) |
| 25 | **Hervé** — ancien pêcheur passé garde, regrette le lac (garde du port) | garde du port : sent le sel et la fatigue. | — | « Le lac te manque ? » (2 paliers) |
| 26 | **Gwen** — garde, fille de la meunière du port (garde du port) | garde du port : sent le sel et la fatigue. | — | « Ta mère ? » (2 paliers) |
| 27 | **Ewen** — garde, jeune et hâbleur (garde du port) | garde du port : sent le sel et la fatigue. | — | « Tes exploits ? » (2 paliers) |
| 28 | **Morgane** — garde, experte en nœuds et en bagarres (garde du port) | garde du port : sent le sel et la fatigue. | — | « Les nœuds ? » (2 paliers) |
| 29 | **Loïc** — garde, poète raté (garde du port) | garde du port : sent le sel et la fatigue. | — | « Tes poèmes ? » (2 paliers) |

### Village Montagnard — carte 36 (7)

| év. | Qui | Sa voix | Quand | Ce qu'il propose |
|---|---|---|---|---|
| 9 | **Hald** — sentinelle devant le manoir, suit la ronde tracée par JOKO | raide, loyal au lord, mal à l'aise avec les villageois. | garde la ronde de JOKO | « Tu es d'ici ? » (2 paliers) |
| 10 | **Brisa** — sentinelle devant le manoir, suit la ronde tracée par JOKO | cynique, lucide, rit jaune. | garde la ronde de JOKO | « Et toi ? » (2 paliers) |
| 24 | **Sire Aubry** — chevalier au service du lord | noble, las, fier, honnête malgré tout. | — | « Votre serment ? » (3 paliers) |
| 25 | **Léon** — chevrier | rude, terre à terre, préfère les chèvres aux gens. | — | « Vos chèvres ? » (2 paliers) |
| 27 | **Lila** — bergère, jeune, farouche | méfiante, directe, s'adoucit avec le temps. | — | « Pourquoi méfiante ? » (2 paliers) |
| 35 | **Soren** — jeune homme qui rêve d'entrer au manoir | naïf, ambitieux, admire les nobles. | — | « Pourquoi le manoir ? » (2 paliers) |
| 36 | **Mei** — herboriste des montagnes | calme, précise, un peu mystérieuse. | — | « Vous vivez seule ? » (2 paliers) · Acheter des herbes |

### Magasin d'Armes — carte 41 (3)

| év. | Qui | Sa voix | Quand | Ce qu'il propose |
|---|---|---|---|---|
| 3 | **Gaudry** — forgeron-armurier, père de Lise (la fille du bar) | grave, fier, inquiet pour sa fille, parle métal. | 8 h – 20 h | « Et Lise ? » (3 paliers) · Voir la marchandise |
| 4 | **Renaud** — mercenaire client de la forge, le jour | bavard, compare tout, marchande mal. | entre et sort par la porte (interrupteur de moment) | — |
| 6 | **Clarisse** — chasseuse, cliente de la forge, le jour | froide, efficace, n'aime pas perdre son temps. | entre et sort par la porte (interrupteur de moment) | — |

### Magasin d’Armures — carte 42 (1)

| év. | Qui | Sa voix | Quand | Ce qu'il propose |
|---|---|---|---|---|
| 5 | **Hélène** — armurière, tient le magasin d'armures | pratique, maternelle avec les recrues, sévère avec les nobles. | 8 h – 20 h | « Pourquoi armurière ? » (2 paliers) · Voir la marchandise |

### Magasin d'Objets — carte 43 (1)

| év. | Qui | Sa voix | Quand | Ce qu'il propose |
|---|---|---|---|---|
| 3 | **Pascaline** — épicière, tient le magasin d'objets | vive, organisée, compte tout de tête. | 8 h – 20 h | « Les affaires ? » (2 paliers) · Voir la marchandise |

### Auberge 1F — carte 44 (5)

| év. | Qui | Sa voix | Quand | Ce qu'il propose |
|---|---|---|---|---|
| 5 p1 | **Aubergiste** — l'aubergiste de JOKO — page 1 (avant l'annonce) | celle de JOKO : directe, un peu lasse, des rumeurs plein la tête. Ses répliques sont reprises telles quelles. | — | « Et vous ? » (3 paliers) · Des nouvelles · Une chambre · L'annonce |
| 5 p2 | **Aubergiste** — l'aubergiste de JOKO — page 2 (dette de Grod en cours) | celle de JOKO : directe, un peu lasse, des rumeurs plein la tête. Ses répliques sont reprises telles quelles. | — | « Et vous ? » (3 paliers) · Des nouvelles · Une chambre · Les bières de Grod |
| 5 p3 | **Aubergiste** — l'aubergiste de JOKO — page 3 (Grod a repris son tabouret) | celle de JOKO : directe, un peu lasse, des rumeurs plein la tête. Ses répliques sont reprises telles quelles. | — | « Et vous ? » (3 paliers) · Des nouvelles · Une chambre |
| 10 | **Gaspard** — négociant en laine, vient chaque vendredi soir | affable, compte tout, parle affaires même en mangeant. | entre et sort par la porte (interrupteur de moment) | « Et Edmée ? » (2 paliers) |
| 11 | **Edmée** — sœur et comptable de Gaspard | précise, pince-sans-rire, lève les yeux au ciel quand son frère parle. | entre et sort par la porte (interrupteur de moment) | « Pourquoi le vendredi ? » (2 paliers) |

### BAR — carte 46 (32)

| év. | Qui | Sa voix | Quand | Ce qu'il propose |
|---|---|---|---|---|
| 11 | **Ulric** — graveur, vend aussi le nécessaire du voyageur | lent, précis, parle comme il grave : peu de mots, bien choisis. | 8 h – 20 h | « Qui vous a appris ? » (3 paliers) · Voir la marchandise · Faire graver ton nom (30 G) |
| 12 p2 | **Colin** — barde, cherche le chant du lac | rêveur, dramatique, rit de lui-même. | — | « Le chant du lac ? » (3 paliers) · Une rumeur ? *(sous condition)* · Une chanson · Le mot de Pia *(sous condition)* |
| 13 | **Le vieux** — l'ivrogne du comptoir — JOKO : « ancien rang S », âme en deuil | grave, lent, cynique ; ne parle jamais du passé en face. | — | « Qui étiez-vous ? » (4 paliers) · Lui payer un verre (10 G) |
| 14 | **Mireille** — la commère, sait tout sur tout le monde (et se trompe une fois sur deux) | volubile, chuchote fort, « tu sais pas la meilleure ». | 10 h – 23 h | « Et vous, Mireille ? » (3 paliers) · Un vrai secret (5 G) |
| 15 | **Baptiste** — charretier, fait la route entre les villages | jovial, parle de ses bœufs comme de ses enfants. | 12 h – 22 h | « Toujours sur la route ? » (3 paliers) · Des nouvelles de la route |
| 17 | **Odon** — vieux retraité, joue aux cartes seul | râleur, « de mon temps », mauvais perdant. | 9 h – 24 h | « Une partie, alors ? » (3 paliers) · Jouer aux cartes (10 G) |
| 18 | **Lise** — fille du forgeron, rêve d'aventure | enthousiaste, pose trop de questions, parle vite. | 18 h – 23 h | « Pourquoi partir ? » (3 paliers) · Lui raconter un combat |
| 19 | **Garrec** — mercenaire de rang C (il dit B) | fort, fanfaron, gentil au fond, ment sur ses exploits. | 16 h – 3 h | « Le rang C, alors ? » (3 paliers) · Bras de fer (20 G) |
| 20 | **Anselme** — joueur de dés, doit de l'argent à tout le monde | charmeur, nerveux, toujours « sûr de gagner cette fois ». | 19 h – 4 h | « Et ta dette ? » (3 paliers) · Jouer aux dés (20 G) |
| 21 | **Pia** — fille du meunier, amoureuse en secret de Colin le barde | timide, phrases qui s'arrêtent au milieu. | 17 h – 22 h | « Colin ? » (3 paliers) · Porter son mot à Colin *(sous condition)* |
| 22 | **Aimé Vannier** — bûcheron, jumeau « aîné » | bourru, contredit son frère sur tout. | 18 h – 23 h | « Et Basile ? » (3 paliers) · Qui est l'aîné ? |
| 23 | **Basile Vannier** — bûcheron, jumeau « aîné » (lui aussi) | bourru, contredit son frère sur tout. | 18 h – 23 h | « Et Aimé ? » (3 paliers) · Qui est l'aîné ? |
| 24 | **Hector** — vieux mari, bon vivant | blagueur, taquine sa femme, l'adore. | 11 h – 21 h | « Trente ans ? » (3 paliers) |
| 25 | **Maude** — vieille épouse, lucide | soupirs, piques sèches, tendresse cachée. | 11 h – 21 h | « Et vous, Maude ? » (3 paliers) |
| 26 | **Roul** — pêcheur, rival de Tobin | grincheux, jaloux, exagère ses prises. | 14 h – 22 h | « Tobin et vous ? » (3 paliers) · Parier sur la prochaine prise |
| 27 | **Margot** — serveuse, au bar depuis quinze ans | sèche, rapide, jamais méchante ; appelle tout le monde « mon grand ». | — | « Et toi, Margot ? » (3 paliers) · Commander · Offrir une tournée (50 G) |
| 28 | **Ysolde** — herboriste, boit une tisane au bar | calme, douce, parle des plantes comme des gens. | 8 h – 18 h | « Vous avez appris où ? » (3 paliers) · Une tisane (15 G) |
| 29 | **Merle** — garde de nuit, en fin de ronde | fatigué, pragmatique, humour de caserne. | 20 h – 2 h | « Pourquoi garde ? » (3 paliers) |
| 30 | **Casimir** — garde de jour, fier de son uniforme | réglementaire, un peu naïf, cite le règlement. | 12 h – 20 h | « Pourquoi garde ? » (3 paliers) |
| 31 | **Silas** — marchand de fioles, menteur de métier | mielleuse, trop polie, compliments à tout bout de champ. | 18 h – 4 h | « D'où vous venez ? » (3 paliers) · Voir ce qu'il vend · Une « affaire exceptionnelle » (100 G) |
| 32 | **Jehan** — écrivain public, écrit les lettres des autres | poli, cultivé, un brin mélancolique. | 9 h – 17 h | « Et vos lettres à vous ? » (3 paliers) · Faire écrire une lettre (10 G) |
| 36 | **Théo** — gamin des rues, vend des « nouvelles » | effronté, rapide, commerçant-né. | 8 h – 19 h | « Où tu dors ? » (3 paliers) · Une nouvelle (1 G) |
| 37 | **Berthe** — cuisinière du bar, nourrit tout le monde | maternelle, autoritaire, « mange ». | 6 h – 23 h | « Votre recette secrète ? » (3 paliers) · Le plat du jour (20 G) |
| 38 | **Nell** — ancienne pickpocket, rangée (presque) | moqueuse, maligne, prévient contre les arnaques. | 17 h – 3 h | « Pourquoi avoir arrêté ? » (3 paliers) · Des conseils |
| 39 | **Tanneur** — la foule des soirs de fête (interrupteur 18 « parle ») | un habitant comme un autre, avec sa vie. | — | — |
| 40 | **Cliente** — la foule des soirs de fête (interrupteur 18 « parle ») | un habitant comme un autre, avec sa vie. | — | — |
| 42 | **Charpentier** — la foule des soirs de fête (interrupteur 18 « parle ») | un habitant comme un autre, avec sa vie. | — | — |
| 43 | **Meunier** — la foule des soirs de fête (interrupteur 18 « parle ») | un habitant comme un autre, avec sa vie. | — | — |
| 44 | **Habitué** — la foule des soirs de fête (interrupteur 18 « parle ») | un habitant comme un autre, avec sa vie. | — | — |
| 45 | **Colporteuse** — la foule des soirs de fête (interrupteur 18 « parle ») | un habitant comme un autre, avec sa vie. | — | — |
| 48 | **Voyageur** — de passage : jamais le même selon la saison | change avec la saison — un marchand, une pèlerine, un conteur, une chasseuse. | — | « D'où venez-vous ? » (2 paliers) |
| 49 | **Tableau d'affichage** — affiches de saison | — | — | — |

### Manoir — carte 47 (14)

| év. | Qui | Sa voix | Quand | Ce qu'il propose |
|---|---|---|---|---|
| 9 | **Oudin** — portier du manoir | raide, formelle, craint ses supérieurs. | — | « Depuis longtemps ici ? » (2 paliers) |
| 10 | **Mathurin** — portier du manoir | raide, formelle, craint ses supérieurs. | — | « Et toi ? » (2 paliers) |
| 11 | **Ancel** — sentinelle du manoir | raide, formelle, craint ses supérieurs. | — | — |
| 12 | **Berthold** — sentinelle du manoir | raide, formelle, craint ses supérieurs. | — | — |
| 13 | **Jeanne** — servante, travaille ici depuis l'enfance | rapide, inquiète, chuchote. | — | « Tout va bien ? » (2 paliers) |
| 14 | **Octave** — valet, ambitieux et servile | obséquieux devant, venimeux derrière. | — | « Un secret, contre de l'or ? » (2 paliers) |
| 15 | **Guérin** — sentinelle du manoir | raide, formelle, craint ses supérieurs. | — | — |
| 16 | **Guillemette** — cuisinière du manoir | bourrue, généreuse, se moque des nobles. | — | « Les restes ? » (2 paliers) · Accepter un reste |
| 17 | **Lysandre** — garde personnel d'un comte invité | glacial, méprisant, parfaitement poli. | — | « Ton comte ? » (2 paliers) |
| 18 | **Morvan** — garde personnel d'une baronne invitée | lent, massif, peu bavard. | — | « Qui êtes-vous ? » (2 paliers) |
| 25 | **Maître Wendel** — guérisseur du manoir (il soigne, comme JOKO l'avait posé) | posé, épuisé, soupçonne des choses. | — | « Le lord est malade ? » (2 paliers) · Se faire soigner |
| 26 | **Blanche** — femme de chambre — la sœur de Lila, la bergère du village | trop polie, trop calme, comme ses lettres. | — | « Et Lila ? » (3 paliers) |
| 27 | **Fabien** — palefrenier, s'occupe des chevaux des invités | simple, gentil, préfère les chevaux aux maîtres. | — | « Les chevaux ? » (2 paliers) |
| 32 | **Anatole** — majordome du manoir | impeccable, glacé, loyal au lord d'avant l'hiver. | — | « Et le lord ? » (3 paliers) |

## 6. Ce qui n'a PAS été touché

| Quoi | Pourquoi |
|---|---|
| Carte 47, événement 8 (Actor3, au fond du manoir) et événement 19 (au centre) | c'est peut-être le lord et un noble : à toi de dire qui ils sont |
| Les personnages masqués « dono mmasque » (bar 16 et 41, Village de Pêche 20, Village Montagnard 60) | peut-être Dono |
| Toutes les quêtes | Grod, le Pêcheur, Sarielle, Marn le fossoyeur, le Milicien, la Tisserande, les ✎ quêtes, Tobin, le nomade |
| Les âmes, la foule de la scène du Village Montagnard (interrupteur 40), les pages ssB de l'ouvrier (Village Montagnard 26) | ce sont des scènes d'histoire |
| La carte 55, événement 5 | sa page 3, vide et sans condition, est la dernière, donc elle gagne toujours : la porte est inerte. Je l'ai laissée, c'est peut-être voulu |

## 7. Vérifié dans le moteur

`bancs/navigateur/une_journee_en_ville.js` :

- **Horaires** : à 10 h, « TS · Jour » s'allume et tes clients de la forge sont là ; à 22 h ils sortent par la porte.
- **Porte du bar** : à 12 h elle mène au bar ; à 6 h elle est fermée (écriteau, frapper).
- **Auberge** : ouverte à 3 h du matin.
- **Maison sans destination** : fermée à clé.
- **Intérieur** : au bar, météo des saisons coupée et teinte nulle ; dehors, elles reviennent.
- **Silas** : à 18 h il entre par la porte et marche jusqu'à sa place ; à 4 h il sort à pied.
- **Gaston** : à 19 h il marche jusqu'à la porte du bar et entre.
- **Conversations et portes** : 1 104, sur 10 cartes × 4 saisons × matin et soir, toutes jusqu'au bout, aucune erreur.
