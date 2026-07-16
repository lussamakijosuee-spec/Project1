# PLUGIN — `CorruptionAme.js` — TOUT

> **La jauge de Corruption (la Bête / le sang de bête).** v1.0 · auteur JOKO · **activé** ✅ · 145 lignes.
> Abuser du Mana Négatif/Sombre corrompt l'âme : une jauge **0-100 par héros**, des **états malus**
> croissants, et la **Mue** (la Bête) au maximum.
>
> Fichier : `js/plugins/CorruptionAme.js`. Producteur de jauge : à charger **tôt** (voir `ORDRE_PLUGINS.md`).

---

## 1. CE QUE FAIT LE PLUGIN
- Chaque **coup offensif** d'un héros avec un élément **Négatif (4)** ou **Sombre (5)** monte sa corruption.
- À des **paliers**, un état malus s'applique **au début du combat**. À 100, c'est **la Mue** (la Bête).
- La corruption **redescend lentement** en marchant, et se **purge** à un checkpoint.

---

## 2. RÉGLAGES (paramètres du plugin)
| Paramètre | Défaut | Rôle |
|---|---|---|
| `elNegatif` | **4** | ID de l'élément Négatif (gain +2) |
| `elSombre` | **5** | ID de l'élément Sombre (gain +3) |
| `menuCommand` | `Corruption` | intitulé de l'entrée de menu (**vide = aucune entrée**) |

---

## 3. COMMANDE `CORRUPTION`
| Commande | Effet |
|---|---|
| `CORRUPTION add <héros> <n>` | +n corruption (**défaut 10**) |
| `CORRUPTION purge <héros> <n>` | −n corruption (**défaut 30**) |
| `CORRUPTION ecran` | ouvre l'écran des 4 jauges |
`<héros>` = ID (1-4) **ou** clé (`thylane`/`neyssa`/`lou`/`tianna`).

## 4. NOTETAG (sur une armure)
```
<Relic: antirot>     → divise par 2 le gain de corruption (arrondi au sup.)
```
Concrètement : coup Sombre **+3 → +2**, coup Négatif **+2 → +1**.

---

## 5. LES CHIFFRES EXACTS
### Gain (coup offensif d'un héros qui inflige des dégâts)
| Élément du skill | Gain |
|---|---|
| Sombre (5) | **+3** |
| Négatif (4) | **+2** |
| avec `<Relic: antirot>` | gain **÷2** (ceil) |
| autre élément | 0 |

### Descente & bornes
- **−1 tous les 60 pas** du groupe (pour chaque héros dont la corruption > 0).
- Jauge **bornée 0-100**.

### Paliers → états (appliqués au **début de chaque combat**)
| Corruption | Palier | État posé |
|---|---|---|
| 0-39 | **Calme** | aucun |
| **≥ 40** | **Frémissement** | **181** |
| **≥ 70** | **Fièvre** | **182** |
| **= 100** | **la Mue** (la Bête) | **183** |
> Au passage à 100, un message s'affiche : *« … entre dans la MUE — la Bête prend tout… »*.
> Les états 181/182/183 sont **retirés puis réappliqués** à chaque début de combat (un seul à la fois, le plus haut atteint).

*(Les effets chiffrés des états 181/182/183 sont définis dans `data/States.json` — rappel dans `GUIDE_DEVELOPPEUR.md` A5 : 181 MAT/MDF ×0.9 · 182 ×0.8 + PVmax ×0.9 · 183 ×0.65 + PVmax ×0.8 + dégâts Sombre reçus ×1.4.)*

---

## 6. SCRIPTS (conditions & effets)
```js
Corruption.niveau('lou')          // 0-100  (accepte clé ou ID)
Corruption.niveau(3) >= 70        // condition « Fièvre ou pire »
Corruption.add(3, 10)             // +10 (par ID)
Corruption.purge('lou', 30)       // -30
Corruption.applyStates(actor)     // ré-applique l'état de palier (usage interne)
```

---

## 7. RECETTES
### 7.1 — Purger la corruption à un checkpoint
```
◆ Commande de plugin : CORRUPTION purge 1 20    (répéter pour 2, 3, 4)
```

### 7.2 — Une armure « Amulette Purifiante »
`Base ▸ Armures` → Note :
```
<Relic: antirot>
```

### 7.3 — Un skill qui corrompt fort (art de la Bête)
`Base ▸ Compétences` → élément **Sombre (5)** (gain +3 automatique). Pour aggraver, ajoute (via `Lore_MaitrisesInterdites`) :
```
<Interdit: 1.8>     → +8 corruption/usage en plus des +3 de l'élément
```

### 7.4 — Un PNJ qui réagit à la Bête
Condition d'une page d'événement ▸ Script :
```js
Corruption.niveau(1) >= 70
```
→ *« Tes yeux… ils ont viré. Recule. »*

### 7.5 — Forcer la Mue pour une scène
```
◆ Commande de plugin : CORRUPTION add 2 100     (Korrah bascule à 100 = la Mue au prochain combat)
```

---

## 8. DÉTAILS TECHNIQUES & PIÈGES
- **Stockage** : `$gameSystem._corruption` (objet `{actorId: valeur}`) → **sauvegardé**.
- **Gain** : hook sur `Game_Action.executeDamage`, seulement si `value > 0` **et** le lanceur est un **acteur**.
- **États** : posés dans `BattleManager.startBattle` — donc la corruption gagnée **pendant** un combat ne change l'état qu'au **combat suivant**.
- **Purge vs transvasement** : `CORRUPTION purge` efface simplement ; la version *canon* « on ne perd rien, on transvase » est `PURGE bete <id>` (plugin **CanonPlus** : −30 Corr **mais +10 Errance**).
- **Élément clé** : `<Relic: antirot>` doit être **exactement** `antirot` (sans espace).

---

> **Voir aussi :** `docs/GUIDE_DEVELOPPEUR.md` (A5 états, A6 la jauge en détail),
> `docs/RECETTES.md` §7 (checkpoints/purges), `docs/FICHES_PLUGINS.md`, `docs/INDEX.md`.
> **Systèmes liés :** `Errance` (l'autre gouffre), `CanonPlus` (PURGE tragique), `MueMaitrisee` (Bête à volonté).
