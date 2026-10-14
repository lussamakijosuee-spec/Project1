# Les habitants — ce qui a été mis dans le jeu

> Généré par `node bancs/outils/rapport_habitants.js` à partir des fiches de
> `bancs/outils/habitants/`. {{TOTAL}} personnages.

Inspirations données par JOKO : **Skyrim** pour l'immersion, **Kenshi** pour la dureté du
monde, **GTA** pour la ville qui vit toute seule. Et on reste dans un RPG médiéval
magique : les gens mènent leur vie, quoi qu'il se passe autour d'eux.

Ce que JOKO a fixé le 27/09 :

| Sujet | Décision |
|---|---|
| Magie | courante mais modeste (lampes enchantées, petits sorts, fioles) ; plus personne ne parle des Dons (retirés du lore le 2026-10-14) |
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

C'est l'extension **Habitants**, en v1.2.

- **Les horaires** se mettent dans la **Note** de l'événement : `<Horaire: 18-4>`, `<Saisons: 1,2,3>`.
- **Personne ne clignote.** À la fin de son heure, le PNJ **marche jusqu'à la porte**,
  puis disparaît. À son heure, il **entre par la porte** et va à sa place.
- **S'il est bloqué**, au bout de 8 secondes il « se téléporte ».
- **Ils ne se bousculent pas à la porte** : chacun entre à son tour, dans les trois secondes.
- **Ils contournent le décor** (réverbères, tonneaux, étals) et attendent quand quelqu'un est en travers.
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
- **Il parle du temps qu'il fait** (MeteoVivante) : par pluie, orage, neige, tempête ou brouillard, sa remarque du jour change, dans la voix de son milieu (la caserne pour les gardes, le port pour les pêcheurs, la montagne, le marché, le bar, l'auberge, le manoir).
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
{{PERSONNAGES}}

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
