# 🔨 LE GROS LOT — 180 compétences, 62 équipements, 24 matériaux, le Tableau de Chasse

> **Consigne suivie :** ne rien supprimer. Tout ce qui est ici s'ajoute à l'existant, ou remonte ce
> qui était trop bas. Aucun contenu retiré, aucune compétence effacée, aucune formule à caractère
> écrasée.

| | Avant | Après |
|---|---|---|
| **Compétences** | 736 | **916** *(+180)* |
| **Apprentissages** | 165 | **349** *(+184)* |
| **Armes** | 182 | **223** *(+41)* |
| **Armures** | 80 | **101** *(+21)* |
| **Objets** | 85 | **109** *(+24)* |
| **Plugins** | 193 | **194** *(+1)* |

---

## 1. Les 9 Voies enfin remplies — 72 techniques

`MaitriseVoies.js` implémente **neuf Voies de combat**, chacune avec sa mécanique propre. Elles
étaient codées, réglées, documentées… et **seules 14 compétences dans tout le jeu les employaient**.
Trois Voies n'en avaient **aucune** : le système tournait à vide.

| Voie | Sa mécanique | Avant | Après |
|---|---|---|---|
| ⚒️ **FORGE** — le Point Final | ×1,5 de dégâts bruts | 3 | **11** |
| 🌊 **ONDE** — le Reflux | retourne la force encaissée | 4 | **12** |
| 🌿 **SOURCE** — le Reflux des chairs | la seule voie qui répare | 1 | **9** |
| 🪞 **MIROIR** — le Renvoi | renvoie et réduit | 2 | **10** |
| 🕳️ **VIDE** — l'Immobile | traverse la garde | 2 | **11** |
| ⚡ **ÉCLAIR** — l'Instant Foudroyant | critique et vitesse | **0** | **8** |
| 🔒 **DOMAINE** — le Territoire Scellé | touche garantie | 2 | **10** |
| ✦ **FLASH** — l'Éclat Noir | la frappe se distord | **0** | **8** |
| 🩸 **SANG** — l'Art du Sang | drain | **0** | **16** |

Chaque Voie reçoit **8 techniques** avec une vraie progression : une ouverture bon marché, deux ou
trois techniques de milieu de courbe, une technique signature qui porte le nom de la Voie, et une
finisseuse.

> *« Le Point Final » · « Le Reflux Complet » · « La Source Entière » · « Le Renvoi Total » ·
> « Le Creux Entre Deux » · « Plus Vite que le Geste » · « Le Domaine Entier » ·
> « Ce Qui Ne Devrait Pas Toucher » · « Tout Ce Qui Coule »*

---

## 2. Les quatre héros — 48 capacités personnelles

Douze chacun, écrites pour ce qu'ils sont et pas pour remplir un tableau.

**🩸 Vesper** — le sang qui durcit le temps d'un geste, les deux cercles, *« Elle Ne Recule Pas »*
(plus elle saigne, plus elle avance), et *« Verdict de l'Équilibre »* : elle décide qui a tort.

**❄️ Korrah** — la lecture du geste, la contre-prise, l'angle parfait qui ignore la garde,
*« Le Froid Partagé »* (il la prend aussi — elle a l'habitude), et *« Maîtrise »* : rien de
spectaculaire, juste rien qui rate, jamais.

**⬛ ludwing** — la porte entrouverte, le registre de ce qu'on lui doit, l'ombre prêtée à un allié,
*« Dette Ancienne »*, et *« Ce Qu'il A Gardé »* : toutes les âmes qu'il n'a pas rendues, d'un coup.

**✦ Aël** — *« Reste. »*, *« Debout. »*, *« Assez. »* — des Paroles d'une ou deux syllabes, la
Flèche de Crépuscule, et *« La Parole Tenue »* : ce qu'elle a promis arrive, toujours.

---

## 3. Les Paroles élémentaires — 40 sorts

Ton système de Paroles gère des **longueurs** (`<ParoleL: 3>` simple, `4` double/amplifiée,
`5` fusion) : plus la Parole est longue, plus elle est puissante et plus elle est pénalisée à la
tenue. Il manquait une gamme complète pour l'employer.

**Huit éléments × cinq degrés :** FEU (Braise → Flamme → Brasier → Fournaise → Incendie), EAU, VENT,
TERRE, FOUDRE, GLACE, LUMIÈRE, OMBRE. Les degrés 1 à 2 sont des Paroles de longueur 3-4, les degrés
4 et 5 des Paroles de fusion — longues à dire, dures à encaisser.

---

## 4. Vingt soutiens — ce qui manquait vraiment

Purger, Délier, Rompre le Silence, Voir Clair, Relever, Encourager, Serrer les Rangs, Affûter,
Marquer la Cible, Briser la Garde, Ralentir, Faire Douter, Sceller la Voix, Repos Court…

Le jeu avait beaucoup de manières de frapper et très peu de manières de **réparer une situation**.
C'est réglé : chaque état négatif introduit par le bestiaire a maintenant son contre.

---

## 5. Tout cela est **atteignable** — 184 apprentissages ajoutés

Une compétence qui n'est apprise par personne n'existe pas. Les 180 sont réparties sur les quatre
classes, selon leur identité :

| Héros | Voies de cœur | Éléments | Avant | Après |
|---|---|---|---|---|
| **Vesper** | sang · forge · onde | FEU · EAU | 42 | **90** |
| **Korrah** | éclair · vide · flash | GLACE · FOUDRE | 40 | **88** |
| **ludwing** | source · domaine · flash | OMBRE · TERRE | 44 | **88** |
| **Aël** | miroir · domaine · source | LUMIÈRE · VENT | 39 | **83** |

Chaque héros a **doublé** son arsenal, avec une courbe qui va du niveau 1 au niveau 60.

---

## 6. Le butin — 41 armes de boss, 21 reliques, 24 matériaux

Les 41 boss ne lâchaient qu'un **Éclat d'Âme générique**. Maintenant chacun laisse sa trace.

**41 armes uniques**, une par boss, nommées d'après lui : *« Croc de Gargal »*, *« du Souvenir de
Fournaise »*, *« arrachée au Grand Immobile »*, *« que Thanatos tenait »*, *« née de Reprise 21 »*.
Chacune porte l'élément de sa famille et monte en puissance avec le rang du boss. Toutes à prix 0 :
ce sont des récompenses, pas des achats.

**21 Reliques d'Âme** (un boss sur deux) — équipement du slot Âme, avec une résistance à l'élément
de leur famille.

**18 matériaux de famille** — un par famille, lâché par ses 20 ennemis avec une probabilité qui
monte avec le rang : *Croc Ébréché*, *Fil de Suture*, *Braise Froide*, *Plaque d'Ordonnance*,
*Écho Figé*, *Reçu de Dîme*, *Éclat de Masque*, *Note Tenue*, *Plume Sèche*, *Tain*, *Cendre
d'Étoile*, *Éclat de Socle*, *Pièce Sans Face*, *Marque Creuse*, *Fragment Non-Défini*, *Rouage
Grippé*, *Chitine*, *Bricole*.

**6 matériaux rares** de boss : *Cœur de Boss*, *Sceau Brisé*, *Larme de Titan*, *Souffle Scellé*,
*Fil du Fond*, *Reliquat*.

> Les 360 ennemis de troupe lâchent désormais le matériau de leur famille. Chasser une famille en
> particulier a un sens : on en collectionne la matière.

---

## 7. `ChasseAuxPrimes.js` — le Tableau de Chasse

**Le problème :** 311 troupes créées, et **aucune atteignable**. Ce jeu n'a pas de rencontres
aléatoires — les 66 cartes en sont dépourvues, les combats sont posés à la main (70 sur 20 cartes)
avec des mobs visibles (`ChaseEnemies`). Placer 270 troupes de force sur tes cartes aurait été
décider de ton level design à ta place.

**La réponse :** un endroit où le joueur va *chercher* le combat.

- **Les 18 familles**, chacune déclinée par rang (D → S) et par formation (patrouille de 2, groupe
  de 3, nuée de 4). **270 contrats**, le combat démarre sur place.
- **Les primes** : chaque victoire paie. La **première victoire** sur une entrée paie le **triple** —
  on récompense l'exploration du bestiaire, pas le farm d'une seule ligne.
- **Les 41 contrats de boss**, listés à part. Un contrat ne s'ouvre qu'une fois **la famille
  correspondante nettoyée au rang S**.
- **Le suivi** : le tableau se souvient de ce qui a été battu et affiche la progression famille par
  famille.

Les niveaux affichés sont **conseillés, jamais bloquants** : si le joueur veut du rang S au niveau
12, c'est son droit et son problème. Le tableau prévient, il n'interdit pas.

**Aucune carte n'est modifiée. Aucun événement n'est posé.** Si tu préfères plus tard placer ces
troupes toi-même, désactive le plugin : tout le reste continue de fonctionner.

```
PRIMES ouvrir       → ouvre le tableau
PRIMES debloquer    → ouvre tous les contrats de boss
PRIMES etat         → résumé de la progression
```

---

## 8. Le déséquilibre que tu m'avais laissé décider

Dans le rapport précédent, j'avais signalé sans corriger : **les attaques de base gratuites
(920-1380 dégâts) battaient la compétence payante médiane (770)**. Sur beaucoup de tours, la
meilleure décision était de ne rien dépenser.

Tu as tranché : corriger. **J'ai monté les compétences payantes, je n'ai affaibli aucune attaque
gratuite** — conformément à « ne rien supprimer ».

**29 compétences** en soustraction sèche sont converties en formule ratio, calibrées sur leur coût :

| | Avant | Après |
|---|---|---|
| #18 Pas de Rupture (25 mana) | 280 | **1 587** |
| #57 Frappe Écarlate (20 mana) | 410 | **1 587** |
| #96 Corps-à-corps lourd (10 mana) | 460 | **1 587** |
| #115 Frappe Aveuglante (10 mana) | 280 | **1 587** |
| #55 Pluie de Flèches Sanglantes (100 mana) | 1 680 | **4 200** |
| **médiane des payantes** | **770** | **2 400** |

Les formules **à caractère** — pourcentage de PV max, aléatoire, dépendant d'une variable — sont
laissées telles quelles : elles font l'identité d'une compétence, pas son équilibre.

> **Un bug que le banc d'essai a attrapé :** mon premier passage était écrit en Python, où `def` est
> un mot-clé. Toutes les formules contenant `b.def` — c'est-à-dire **toutes les compétences
> physiques** — étaient silencieusement ignorées. Seules les magiques avaient été traitées. Refait
> en JavaScript.

---

## 9. Vérification

Un cinquième banc d'essai (`lot.js`, 24 contrôles) s'ajoute aux quatre existants.

| Contrôle | Résultat |
|---|---|
| 180 compétences créées, aucun doublon de nom | ✅ |
| Toutes les animations et tous les états référencés existent | ✅ |
| Les 9 Voies ont au moins 8 techniques | ✅ |
| Aucune nouvelle formule ne fait 0 dégât, même contre DÉF 600 | ✅ |
| Les 180 sont apprises par une classe, 0 orpheline | ✅ |
| Les 41 boss lâchent une arme unique, 0 butin cassé | ✅ |
| Les 18 familles ont chacune leur matériau | ✅ |
| Le Tableau de Chasse lit bien 18 familles et 41 contrats de boss | ✅ |
| 270 contrats atteignables | ✅ |
| La compétence payante médiane dépasse la meilleure gratuite | ✅ |

**Les huit bancs passent** : Dons Spirituels (24), évolution des paliers (10), Avatar Spirituel (17),
bestiaire (24), nouveau lot (24), Tableau de Chasse (15), **règle d'un seul Don (76)**,
**verrou & ordres (28)** — voir [`DONS_SPIRITUELS.md`](DONS_SPIRITUELS.md) §14.

---

## 10. Ce qui reste ouvert

1. **Une forge pour les matériaux.** 24 matériaux existent et tombent, mais `ForgeAmes.js` ne les
   connaît pas encore. Une recette par famille serait la suite logique.
2. **Le Tableau de Chasse n'a pas de lieu.** Il est dans le menu ; tu voudras peut-être en faire un
   PNJ dans une taverne, avec l'interrupteur d'accès du plugin.
3. **Les nouvelles armes de boss n'ont pas de restriction de porteur.** Chaque héros peut équiper
   celles de son type d'arme. Si tu veux les réserver, c'est un notetag à ajouter.
