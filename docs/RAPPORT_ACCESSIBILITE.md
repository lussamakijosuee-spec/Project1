# 🔓 CE QUI EXISTAIT ET QUE PERSONNE NE POUVAIT ATTEINDRE

> **Ce qui a été fait :** tout le contenu joueur a été passé au crible d'une seule question —
> *le joueur peut-il réellement y accéder ?* Pas « est-ce équilibré », pas « est-ce bien écrit » :
> **est-ce atteignable, une seule fois, dans une partie entière ?**
>
> La réponse était non pour **une compétence sur quatre**.
>
> **Rien n'a été supprimé.** Tout ce qui suit consiste à ouvrir des portes, pas à retirer du contenu.

---

## Le point de départ : une remarque imprécise de ma part

J'avais écrit que le niveau 85 « dépassait ta courbe, qui s'arrête à 60 ». C'était mal dit : le
`maxLevel` de tes quatre héros est **99**, donc le niveau 85 est parfaitement atteignable.

Le vrai problème était en dessous, et il était bien plus gros.

---

## 1. 🕳️ Trente-neuf niveaux de vide

| héros | 1-20 | 21-40 | 41-60 | **61-80** | **81-99** |
|---|---|---|---|---|---|
| Vesper | 52 | 22 | 16 | **0** | **0** |
| Korrah | 53 | 23 | 17 | **0** | 2 |
| ludwing | 54 | 19 | 15 | **0** | **0** |
| Aël | 48 | 20 | 15 | **0** | **0** |

**Du niveau 61 au niveau 99 — 39 niveaux, presque 40 % de la progression — les héros
n'apprenaient plus rien.** Les deux seules entrées étaient les ordres d'Avatar ajoutés à Korrah au
niveau 85.

Et ce n'est pas que le jeu s'arrête à 60 : le bestiaire monte jusqu'à **145 600 PV** et **DÉF 1157**.
Le contenu de fin de partie existe côté ennemis. Il n'existait pas côté joueur.

---

## 2. 📦 243 compétences que personne ne pouvait apprendre

Sur **929 compétences** écrites, **332** étaient apprises par une classe et **368** employées par un
ennemi. Il restait **243 orphelines** : écrites, réglées, nommées, animées — et hors de portée de
tout le monde, à jamais.

Ce n'était pas du remplissage. C'était, entre autres :

- les **échelles de Paroles élémentaires complètes** (Flamme Petit → Déluge de Flamme, et pareil
  pour Vague, Bourrasque, Roche, Foudre…) ;
- **toute la ligne de soins** — Soin Léger, Soin, Grand Soin, Soin de Groupe, Vague de Vie,
  Lumière Vitale, Bénédiction Curative ;
- les **huit Ponctions** élémentaires (les drains) ;
- les **éléments exotiques** que tu as créés : Vapeur, Lave, Plante, Givre, Métal, et le
  **Crépuscule** — celui-là même dont le canon dit que Miracle apprend à le toucher ;
- les **Fusions** (la Chair d'Âme, le Fil du Rasoir, le Songe Incarné) et les **Runes** ;
- les techniques d'**Ombre** et de **Sang** hautes.

**239 des 240 récupérables sont maintenant distribuées**, à leurs héros et à leur puissance :

| héros | ajoutées | dont en 61-99 |
|---|---|---|
| **Vesper** | +56 | 28 |
| **Korrah** | +57 | 29 |
| **ludwing** | +71 | 36 |
| **Aël** | +55 | 28 |

L'attribution ne tire pas au sort. Elle suit, dans l'ordre : le tag `<Voie: …>` inscrit sur la
compétence, puis le tag `<Trait: …>`, puis l'élément, puis le nom. La **puissance mesurée** décide
du niveau — les plus fortes vont en 61-99, où le trou était ; le reste comble la courbe basse, où
elles étaient de toute façon inaccessibles.

### La courbe, maintenant

| héros | 1-20 | 21-40 | 41-60 | 61-80 | 81-99 | total |
|---|---|---|---|---|---|---|
| Vesper | 49 | 38 | 31 | **15** | **14** | 147 |
| Korrah | 54 | 38 | 30 | **15** | **16** | 153 |
| ludwing | 49 | 38 | 35 | **19** | **18** | 161 |
| Aël | 49 | 34 | 28 | **14** | **14** | 139 |

---

## 3. 🔒 Quatre systèmes entiers que personne ne pouvait ouvrir

C'est la trouvaille la plus lourde, et elle était invisible.

Dans RPG Maker MV, une compétence n'apparaît dans un menu que si **son type de compétence** est
ouvert au personnage par un trait. **Quatre types n'étaient ouverts par rien ni personne** :

| Type | Compétences | Déjà « apprises » par | Le joueur les a vues |
|---|---|---|---|
| **4 · JACKPOT** | 5 | ludwing, **au niveau 1** | **jamais** |
| **5 · BERSEK** | 4 | Vesper, **au niveau 1** | **jamais** |
| **8 · invocation** | 3 | ludwing, **au niveau 1** | **jamais** |
| **19 · Arts Sereins** | 5 | Vesper, **au niveau 1** | **jamais** |

**Quatorze compétences étaient marquées « apprises au niveau 1 » depuis le début du jeu, et
n'apparaissaient dans aucun menu.** Parmi elles le *Dragon de la Nuit Sanglante* — la compétence la
plus puissante de tout le jeu (ATQ × 25 plus les PV manquants, au prix de la moitié de sa vie).

**Ouvert, à qui de droit** — les noms ne laissaient aucun doute :

- **BERSEK** → **Vesper**. *Paon Hémorragique · Frappe Écarlate · Rafale de Coups Écarlates ·
  Dragon de la Nuit Sanglante.* C'est du sang, c'est elle.
- **JACKPOT** → **ludwing**. *Rafale de Jetons · Rush du Tambour · Pari Téméraire · Danse de
  l'Euphorie.* C'est le jeu — « le Symbole », l'état *Folie du Joueur*, c'est lui.
- **invocation** → **ludwing**. *Jugement des Défunts · Rappel des Âmes*, et *Déchaînement Copié*
  dont la note dit littéralement « Lou entouré de toutes les âmes qu'il a volées ».
- **Arts Sereins** → **aux quatre**. Ce sont cinq techniques, **une par Voie** : miroir, vide,
  forge, onde, source. Chaque héros reçoit celle de sa Voie.

### Et il a fallu les remettre sur la courbe

Les quatorze étaient « apprises au niveau 1 ». Comme elles étaient invisibles, **aucune sauvegarde
ne s'en sert** — les laisser au niveau 1 en les rendant visibles aurait offert le *Dragon de la Nuit
Sanglante* au premier combat du jeu. Elles sont réparties selon leur puissance mesurée :

| | avant | après | force |
|---|---|---|---|
| Rafale de Coups Écarlates | niv 1 | **22** | 1 890 |
| Frappe Écarlate | niv 1 | **40** | 1 891 |
| Paon Hémorragique | niv 1 | **58** | 2 244 |
| **Dragon de la Nuit Sanglante** | niv 1 | **74** | **17 500** |
| Danse de l'Euphorie | niv 1 | **18** | — |
| Frappe Éclair | niv 1 | **32** | 500 |
| Rush du Tambour | niv 1 | **46** | 680 |
| Pari Téméraire | niv 1 | **60** | 200 |
| Rafale de Jetons | niv 1 | **76** | 900 |

---

## 4. 🐛 Deux défauts de données

**`#132 Aura Recueillie`** — Voie **source** (la seule Voie qui répare), portée **« soi-même »**…
et **type de dégâts 1** (dégâts de PV). Telle quelle, elle infligeait **1 000 + MAG à sa propre
lanceuse** au lieu de la soigner. C'est un `3` (restauration de PV) qui a été saisi `1`. Corrigé.

**Deux entrées d'apprentissage strictement identiques** chez ludwing (`#13 Vannes` et
`#14 Roulette du Destin`, toutes deux inscrites deux fois au niveau 1). Sans effet en jeu, mais
retirées — les compétences restent apprises, au même niveau.

---

## 5. ⚖️ Une conséquence qu'il a fallu traiter

Rendre 239 compétences atteignables a rendu atteignables **cinq techniques puissantes qui ne
coûtaient rien** — elles n'avaient simplement jamais eu de coût saisi, et ça ne se voyait pas
puisque personne ne pouvait les lancer.

`#16 Déluge de Poings` en particulier : un **ultime à 0 mana** qui battait à lui seul toutes les
compétences payantes du jeu.

Le prix posé n'est pas arbitraire — c'est celui que **ta propre courbe** pratique déjà, mesuré sur
l'ensemble des compétences payantes : **42,5 dégâts par point de mana**.

| | force | prix posé |
|---|---|---|
| **#16 Déluge de Poings** | 2 380 | **55 mana** |
| #67 Pluie de Lances d'Ombre | 800 | 20 mana |
| #138 Disque Sanglant | 780 | 20 mana |
| #84 Danse des Ailes Écorchées | 500 | 10 mana |
| #60 Rafale Fantôme | 300 | 5 mana |

**Aucune n'est affaiblie** : les formules sont intactes. Elles coûtent, c'est tout. Les attaques de
base (`#1`, `#3`, `#4`, `#5`, `#462`) restent gratuites — elles le sont par nature.

---

## 6. 🚫 Ce que j'ai laissé de côté, exprès

**`#45 Assaut Fulgurant`** — formule `b.mhp * 0.80`, coût **0 mana**. Elle ignore tout : défense,
niveau, boss. Dans les mains du joueur, elle ferait **116 000 dégâts sur le boss final, gratuitement**.
C'est une compétence d'ennemi, elle le reste. Idem pour tout ce qui calibre ses dégâts sur les PV
max de la cible.

**`#7 Attendre`** — compétence système, sans type. Elle n'a rien à faire dans un menu.

**Une seule orpheline subsiste**, et c'est volontaire : `#132` est désormais apprise, et le décompte
n'en laisse plus qu'une hors de portée — un résidu sans type de compétence.

---

## 7. ✅ Vérification — un dixième banc d'essai

`bancs/7_courbe_et_acces.js` (**35 contrôles**) verrouille tout ce qui précède pour que ça ne puisse
plus régresser :

| Contrôle | Résultat |
|---|---|
| Les **598 apprentissages** mènent tous à une compétence **visible dans un menu** | ✅ |
| Les **19 types de compétence** ont chacun au moins un porteur | ✅ |
| Aucune tranche de niveaux n'est vide, pour aucun héros | ✅ |
| Chaque héros a **au moins 10 compétences après le niveau 60** (28 à 37 en réalité) | ✅ |
| Il ne reste **plus de contenu orphelin** | ✅ |
| **Aucune compétence d'ennemi** n'est dans les mains du joueur | ✅ |
| **Aucune compétence gratuite** ne dépasse la payante médiane | ✅ |

> **Le contrôle §5 mesure le symptôme, pas le texte.** Ma première version cherchait la chaîne
> `b.mhp` dans les formules — et accusait à tort `#1073 Le Coup qu'On Garde` et `#1112 Coup de Grâce
> Éclair`, qui l'emploient légitimement comme **condition d'achèvement** (« +80 % si la cible est
> sous 35 % de PV »). La version retenue évalue la formule contre une cible à 10 000 PV puis à
> 200 000 : si les dégâts suivent, c'est une compétence d'ennemi. Vérifié dans les deux sens — elle
> attrape bien `#45`, et innocente bien les deux autres.

**Les dix bancs passent.**

---

## 8. Ce qui reste ouvert

1. **Les niveaux attribués sont calculés, pas écrits à la main.** Ils viennent de la puissance
   mesurée de chaque compétence. C'est cohérent, mais ça n'a pas ton oreille : si une compétence te
   semble arriver trop tôt ou trop tard, c'est une ligne de `Classes.json` à bouger.
2. **La classe 5 « familié » n'a toujours aucun apprentissage.** Je n'y ai pas touché — c'est ton
   personnage-Stand, et tu m'as dit de le laisser.
3. **L'écart de puissance entre compétences reste large** en fin de partie : la médiane payante fait
   1 300, le *Dragon de la Nuit Sanglante* en fait 17 500. C'est un choix de design (il coûte la
   moitié des PV), pas un défaut — mais si tu veux resserrer, c'est mesurable.
