# LES BANCS D'ESSAI

> Ils se lancent avec **Node, depuis la racine du projet** :
>
> ```bash
> node bancs/1_base_de_donnees.js
> ```
>
> Ils sortent `0` si tout passe, `1` sinon.
>
> **Après toute modification de `data/`, les bancs doivent passer avant de committer.**

| Banc | Ce qu'il contrôle |
|---|---|
| `1_base_de_donnees.js` | `System.json` · `States.json` · `Classes.json` · `Actors.json` — 23 contrôles |

---

## Les trois règles d'un banc de ce projet

Elles viennent de trois bugs qui sont passés à travers des contrôles écrits trop vite.

**1 · En JavaScript, comme le moteur.** Une passe de rééquilibrage écrite en Python avait ignoré
en silence toute formule contenant `b.def` — `def` est un mot-clé Python. **Toutes** les
compétences physiques avaient été sautées, sans un message d'erreur.

**2 · On mesure le symptôme, pas le motif.** Un contrôle qui cherche une chaîne de caractères
dans le texte d'une formule accuse des innocents. On rejoue la formule, on lit la vraie donnée.

**3 · On vérifie dans les deux sens.** Un contrôle doit attraper le vrai coupable **et**
innocenter les faux. C'est la deuxième moitié de `1_base_de_donnees.js` : chaque contrôle est
rejoué sur une base **sabotée exprès**, et il doit **échouer**. Un contrôle qui passe sur une
base cassée ne mesure rien — le banc le dénonce lui-même, et sort en erreur.

```
1) Sur la vraie base — tout doit passer
   ✓ les notetags <manifestation> se lisent comme MV les lira
2) Contre-épreuve — chaque contrôle doit tomber quand on sabote ce qu'il vise
   ✓ les notetags <manifestation> se lisent comme MV les lira
```

Un banc simule le moteur assez fidèlement pour attraper le bug, ou il ne sert à rien.

## Ce que celui-ci attrape en particulier

- un **élément décalé d'un cran** — la numérotation à trous sert à composer les sorts par
  addition, un décalage casse tout l'arbre en silence ;
- la **somme de deux fondamentaux** qui ne retombe plus sur le bon dérivé (8+9 doit faire
  *Vapeur*, 14+15 doit faire *Crépuscule*) ;
- l'**état 1** qui ne serait plus la mort — MV code `deathStateId = 1` **en dur** ;
- un **type de compétence scellé qui n'existe pas** : le sceau porte sur du vide, et le jeu ne
  dit rien ;
- une classe qui **ouvre un type de compétence vide** — le piège MV classique : la compétence
  est apprise mais **invisible dans tous les menus** ;
- l'**espace après le `:`** dans une métadonnée : `<manifestation: type=objet>` donne
  `" type=objet"`, il faut `trim()` ;
- un héros qui porterait **deux manifestations** — la règle d'or du monde s'est déjà fait violer
  une fois ;
- une **seconde jauge sur une arme ou un avatar** : elle est le propre des Objets ;
- l'**Écrivain** qui cesserait d'être le plus mauvais combattant — contrôlé **à chacun des 99
  niveaux**, pas seulement au niveau 1 : une courbe peut démarrer plus bas et rattraper tout le
  monde au niveau 40.
