# CONVENTIONS DE CODE — *L'Empire aux Trois Têtes*

> Les règles techniques du projet. Elles ne se discutent pas au cas par cas : un plugin qui
> ne les respecte pas est à corriger, même s'il marche.
>
> **Moteur : RPG Maker MV 1.6.1.** Pas MZ. Pas MV « compatible MZ ». MV.

---

## 1. RPG Maker MV, JavaScript ES5

Le moteur de MV tourne sur NW.js 0.29 (Chromium 66). Il lit l'ES5, et **rien au-delà** ne doit
être écrit : MV lui-même est écrit en ES5, les plugins tiers (YEP, MOG…) le sont aussi, et
l'éditeur ne prévient pas quand une syntaxe passe mal.

| ✔ On écrit | ✘ On n'écrit pas |
|---|---|
| `var` | `let` · `const` |
| `function () {}` | `() => {}` |
| `'a' + b` | `` `a${b}` `` |
| `Object.keys(o).forEach(…)` | `for (const k of o)` |
| `arguments`, `apply`, `call` | paramètres par défaut · rest/spread |
| `Array.prototype.indexOf` | `includes` · `find` · `flat` |
| `JSON.parse` / `JSON.stringify` | `async` · `await` · `Promise` |

**Trois pièges d'ES5 dans MV :**

- `this` se perd dans une fonction imbriquée → `var self = this;` en haut de méthode.
- Pas de `class`. Un objet se déclare `function Machin() { this.initialize.apply(this, arguments); }`
  puis `Machin.prototype.initialize = function () { … };` — exactement comme le fait `rpg_objects.js`.
- Les sauvegardes MV passent par `JSON.stringify` : **rien d'autre que des types JSON** ne survit
  à un `save`/`load` (pas de `Map`, pas de `Set`, pas de fonction, pas de référence circulaire).

---

## 2. Les commandes de plugin sont en syntaxe **MV**

MV et MZ n'ont pas la même API. En MV, une commande de plugin est un **texte** que l'événement
envoie à `Game_Interpreter.prototype.pluginCommand`. Il faut l'intercepter, en aliasant.

```js
// ✔ MV — la seule syntaxe valide ici
var _ETT_Faim_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _ETT_Faim_pluginCommand.call(this, command, args);   // toujours appeler l'original d'abord
    if (command !== 'FAIM') { return; }                  // et sortir si ce n'est pas pour nous
    switch (String(args[0] || '').toLowerCase()) {
        case 'ajouter':  ETT.Faim.ajouter(Number(args[1]), Number(args[2])); break;
        case 'nourrir':  ETT.Faim.nourrir(Number(args[1])); break;
    }
};
```

```js
// ✘ MZ — n'existe pas dans MV. Le plugin ne fera RIEN, sans message d'erreur.
PluginManager.registerCommand('ETT_Faim', 'ajouter', function (args) { /* … */ });
```

**Règles de commande :**

- Un **verbe unique en MAJUSCULES** par système : `FAIM`, `PAROLE`, `CULTE`… suivi d'un
  sous-verbe en minuscules. Le nom du système, pas le nom du fichier.
- `args` est **toujours un tableau de chaînes**, découpé aux espaces : `Number(args[1])` sur
  tout ce qui doit être un nombre, jamais de comparaison directe.
- Une commande inconnue **ne plante pas** : on sort en silence.
- Toute commande a une contrepartie script (`ETT.Faim.ajouter(1, 10)`) pour les conditions
  d'événement, qui ne savent pas appeler une commande de plugin.

---

## 3. Toujours **aliaser**, jamais écraser

Une méthode du moteur écrasée casse tous les plugins qui l'aliasaient — et on ne le voit
qu'au combat, trois semaines plus tard.

```js
// ✔ le motif imposé
var _ETT_Sang_Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
Game_Battler.prototype.onBattleStart = function () {
    _ETT_Sang_Game_Battler_onBattleStart.call(this);
    // notre ajout ensuite
};
```

```js
// ✘ interdit : tout ce que faisait MV (et YEP, et MOG) disparaît
Game_Battler.prototype.onBattleStart = function () { /* … */ };
```

- **Nom de l'alias :** `_ETT_<Systeme>_<Classe>_<methode>`. Il doit être unique dans tout le
  projet — c'est ce qui rend le conflit lisible dans la pile d'erreur.
- **Appeler l'original en premier**, sauf raison écrite en commentaire juste au-dessus.
- Une méthode qui **retourne** une valeur : on garde le retour de l'original et on le modifie.
  ```js
  var _ETT_X = Game_Actor.prototype.paramRate;
  Game_Actor.prototype.paramRate = function (paramId) {
      var taux = _ETT_X.call(this, paramId);
      return taux * monFacteur(this, paramId);
  };
  ```
- Si un plugin doit **remplacer** un comportement (et pas l'augmenter), il le dit dans son
  `@help`, nomme le plugin remplacé, et se charge **après** lui.

---

## 4. Toute donnée persistante va sur `$gameSystem` / `$gameActors` / `$gameVariables`

MV sauvegarde en sérialisant `$gameSystem`, `$gameActors`, `$gameParty`, `$gameSwitches`,
`$gameVariables`, `$gameMap`… **et rien d'autre**. Une donnée rangée ailleurs est perdue au
chargement — souvent sans erreur, ce qui est pire.

| La donnée est… | Elle vit sur… |
|---|---|
| globale à la partie (jauge de faim d'un héros, état du Culte, compteur de chasses) | `$gameSystem._ettXxx` |
| propre à un acteur (son Don, sa dérive) | `$gameActors.actor(id)._ettXxx` |
| lisible/écrivable par un événement sans script | `$gameVariables` / `$gameSwitches` (**plages réservées : voir [`REGISTRE_VARIABLES.md`](REGISTRE_VARIABLES.md)**) |
| valable un seul combat | `BattleManager` / `Game_Battler`, remise à zéro dans `onBattleStart` |
| jamais sauvegardée (cache, référence à un sprite) | variable locale du plugin, **reconstruite** à chaque chargement |

```js
// ✔ initialisation défensive : une partie sauvegardée AVANT ce plugin doit se charger sans planter
Game_System.prototype.ettFaim = function (actorId) {
    if (!this._ettFaim) { this._ettFaim = {}; }          // jamais dans initialize() seul
    if (this._ettFaim[actorId] === undefined) { this._ettFaim[actorId] = 0; }
    return this._ettFaim[actorId];
};
```

> **La règle qui évite 90 % des bugs de sauvegarde :** ne jamais supposer qu'une propriété existe.
> On la crée à la lecture, pas seulement à `initialize` — sinon toute sauvegarde antérieure au
> plugin plante.

**Interdit dans une donnée sauvegardée :** une fonction, un `Sprite`, un `Window`, une référence
à `$dataSkills[n]` (on stocke l'**id**, on relit la donnée). Une référence à un objet de base
gonfle la sauvegarde et la fige à la version du jour.

---

## 5. Nommage des fichiers & espace de noms

- **Un système = un fichier** : `ETT_<Systeme>.js`, en CamelCase, sans accent ni espace.
  `ETT_Faim.js` · `ETT_Parole.js` · `ETT_Culte.js` · `ETT_Manifestation.js`.
- L'en-tête `@plugindesc` nomme le système **en français**, `@author` porte le nom du projet.
- **Un seul espace de noms global : `window.ETT`.** Rien d'autre ne s'écrit sur `window`.

```js
var ETT = ETT || {};
ETT.Faim = ETT.Faim || {};
ETT.Faim.version = '1.0.0';

(function () {
    'use strict';

    var params = PluginManager.parameters('ETT_Faim');
    var FAIM_MAX = Number(params['faimMax'] || 100);

    // … tout le plugin vit ici : rien ne fuit dans le global.

    ETT.Faim.ajouter = function (actorId, n) { /* … */ };   // l'API publique, explicitement
})();
```

- **Une IIFE par plugin**, en `'use strict'`. Ce qui doit être appelé de l'extérieur (événement,
  autre plugin) est posé sur `ETT.<Systeme>` ; le reste reste privé.
- Un plugin qui dépend d'un autre le **teste** au lieu de le supposer :
  `if (!ETT.Faim) { return; }` — un système absent rend le plugin neutre, il ne le fait pas planter.
- **Ordre de chargement** : les producteurs de données d'abord, les consommateurs ensuite ; les
  plugins tiers avant les nôtres. L'ordre se justifie en une ligne dans le `@help`.

---

## 6. Tout nombre d'équilibrage est un `@param`

Un nombre en dur dans le code, c'est un réglage que JOKO ne peut pas changer sans ouvrir un
fichier `.js`. **Aucun chiffre de gameplay ne se code en dur.**

```js
/*:
 * @plugindesc La faim du sang — la jauge de l'Empire du Corps.
 * @author L'Empire aux Trois Têtes
 *
 * @param faimMax
 * @text Faim maximale
 * @desc La borne haute de la jauge de faim.
 * @type number
 * @min 1
 * @default 100
 *
 * @param gainParPas
 * @text Montée à la marche
 * @desc Faim gagnée tous les N pas du groupe.
 * @type number
 * @default 1
 *
 * @param seuilFievre
 * @text Seuil — la Fièvre
 * @desc Faim à partir de laquelle le stade Fièvre s'applique.
 * @type number
 * @default 70
 *
 * @help
 * ...
 */
```

**Est un `@param` :** un seuil, un palier, un coût, un pourcentage, une durée en tours, un
nombre de pas, un id d'état / d'élément / de variable / d'interrupteur / d'animation.

**N'est pas un `@param` :** une constante du moteur (les 8 paramètres MV), une chaîne de
format interne, une clé de notetag.

Corollaires :

- `PluginManager.parameters()` rend **toujours des chaînes** : `Number(p['x'])` ou
  `p['x'] === 'true'`, avec une valeur de repli (`|| 100`) si le paramètre est vide.
- Un **id** de base de données (état, élément, variable) est un `@param` de `@type number`, pas
  une constante : la base bouge, le code non.
- Pas de « nombre magique » dans une formule : il se nomme en haut du fichier à partir du param.

---

## 7. Commentaires et paramètres en français

Le projet est français. Le code aussi.

- `@text`, `@desc`, `@help`, `@plugindesc` : **en français**, avec les accents.
- Les **commentaires** en français, et ils disent *pourquoi*, pas *quoi* :
  ```js
  // La faim retombe à la marche : c'est la seule façon de la baisser sans manger.
  // Volontairement lent — le joueur doit chasser, pas se promener.
  ```
- Les **noms de variables et de fonctions** : français quand c'est du domaine du jeu
  (`faim`, `stade`, `ancre`, `chasseur`), anglais quand c'est du moteur MV (`actorId`,
  `paramId`, `stateId`, `skillType`) — on ne traduit pas l'API de MV.
- Les **clés de notetag** en français, sans accent (MV les lit mal) :
  `<Faim: 10>` · `<Stade: fievre>` · `<Ancre: masque>`.
- **Piège MV :** les métadonnées gardent l'espace après le `:`. `<Stade: fievre>` donne
  `" fievre"` → **toujours `String(v).trim()`** avant de comparer.

---

## 8. Rappels de pièges MV

Ils ne sont pas théoriques : chacun a déjà coûté une session.

- **`Math.max(eval(formule), 0)`** — MV plancher les dégâts à 0. Une formule négative fait
  **0 dégât**, jamais un soin. Un soin est une compétence de type « Récupération PV ».
- **Formule en soustraction** — `a.atk * k - b.def * k` tombe à 0 contre la DÉF de fin de
  partie. Formule ratio : `Math.floor(a.atk * K * 200 / (200 + b.def))`.
- **Type de compétence sans trait** — une compétence dont le type n'est ouvert par aucun trait
  de classe ou d'équipement est apprise mais **invisible** dans tous les menus.
- **`numRepeats()`** — MV ne l'applique que dans son propre enchaînement d'action. Une action
  jouée à la main par un plugin doit boucler elle-même.
- **`select()` à l'initialisation** — un `Window_Selectable` maison se teste avec les plugins
  qui surchargent `select()` chargés, pas contre une fenêtre nue.
- **Les notetags se lisent une fois** — au chargement de la base. Un notetag lu à chaque frame
  est du gaspillage ; on met en cache dans `DataManager.isDatabaseLoaded`.

---

## 9. Vérifier

- Les bancs d'essai se lancent avec **Node depuis la racine**, et sont écrits en
  **JavaScript** — comme le moteur. (Un contrôle écrit dans un autre langage a déjà sauté en
  silence toutes les formules contenant `b.def`.)
- Un banc **mesure le symptôme**, pas le motif : on ne cherche pas une chaîne de caractères
  dans une formule, on rejoue la formule.
- Un banc vérifie **dans les deux sens** : il doit attraper le vrai coupable *et* innocenter
  les faux.
- **Après toute modification de `data/`, les bancs passent avant de committer.**

---

*Ces conventions sont le contrat technique. Le contrat de travail — ce qu'on a le droit de
décider seul, et ce qu'on demande — est dans `CLAUDE.md` à la racine.*
