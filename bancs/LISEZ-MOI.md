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
| `2_faim.js` | **`js/plugins/ETT_Faim.js`**, rejoué sur un moteur MV simulé — 25 contrôles |

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

**4 · Un contrôle est saboté, ou déclaré invariant. Jamais ni l'un ni l'autre.**
Certains contrôles n'ont aucun levier extérieur : ils gardent un invariant du code lui-même
*(une borne, un drapeau anti-récursion, une initialisation défensive)*. Aucun réglage ne peut les
faire tomber — c'est justement ce qui en fait des garde-fous. Ils doivent alors être **déclarés
un par un, avec leur raison**. Un contrôle qui n'est ni saboté ni déclaré est un contrôle dont
personne n'a vérifié qu'il mesure quoi que ce soit : `2_faim.js` **sort en erreur** dans ce cas.

Un banc simule le moteur assez fidèlement pour attraper le bug, ou il ne sert à rien.

## `2_faim.js` — comment il simule MV

Il ne teste pas une copie de la logique : il **charge le vrai fichier du plugin** dans un bac à
sable (`vm`) qui contient un moteur MV reconstruit — `PluginManager`, `DataManager`,
`Game_System`, `Game_Party`, `Game_Actor`, `Game_Action`, `Game_Interpreter`, `BattleManager`,
et les globales d'une partie.

Deux détails de la simulation font tout son intérêt :

- **`extractMetadata` est reproduit à l'identique**, espace après le `:` compris. Le plugin
  affronte donc le vrai piège, et non une version propre qui l'aurait masqué.
- **`Game_Actor.refresh()` rappelle la mise à jour du plugin**, comme MV le fait. Sans la garde
  anti-récursion, la pile déborde — le banc le vérifie en comptant les appels.

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
