# PLUGIN — `DestinsParalleles.js` — TOUT

> **Les héros que tu n'as pas recrutés continuent leur vie.** v1.0 · auteur JOKO · **activé** ✅ · 361 lignes.
> Leurs jauges **dérivent vers leur Chute**, ils **gagnent de l'XP**, et quand tu les croises tu peux
> **les recruter** — ou **affronter ce qu'ils sont devenus**. 100 % additif.
>
> Fichier : `js/plugins/DestinsParalleles.js`. Charger **après** les producteurs de jauges.

---

## 1. CE QUE FAIT LE PLUGIN
- Tout héros **1-4 absent du groupe** vit sa vie : tous les **60 pas**, sa jauge dérive vers **SA voie**.
- Il **gagne 50 % de l'XP** de tes combats (il mène les siens).
- Aux paliers **40/70/100**, une **rumeur** s'affiche sur la carte.
- Au bout (Corruption 100 / Errance 100 / phase mentale 1) → il **A CHUTÉ** : à toi de scénariser la rencontre.

---

## 2. RÉGLAGES (paramètres)
| Paramètre | Défaut | Rôle |
|---|---|---|
| `pasParTick` | **60** | pas entre deux « battements de vie » |
| `deriveMin` / `deriveMax` | **1 / 2** | dérive par battement |
| `chanceRepit` | **30 %** | chance que la jauge **recule** au lieu d'avancer |
| `xpPct` | **50 %** | part d'XP des absents |
| `pauseSwitch` | 0 | interrupteur ON = fige toutes les dérives |
| `voieThylane` (1) | **corps** | vers quoi dérive Aël (corps/esprit/ame/aleatoire) |
| `voieNeyssa` (2) | **esprit** | Korrah |
| `voieLou` (3) | **ame** | ludwing |
| `voieTianna` (4) | **aleatoire** | Vesper |
| `rumeurs` | **Oui** | rumeurs aux paliers |

> Axes : **corps → +Corruption** · **esprit → −santé mentale** · **ame → +Errance**.

---

## 3. COMMANDE `DESTINS`
| Commande | Effet |
|---|---|
| `DESTINS ecran` | écran des vies parallèles (jauges, rang, chute) |
| `DESTINS tick <n>` | fait avancer la vie des absents de **n battements** (ellipse : « trois lunes passèrent… ») |
| `DESTINS pause on` | fige les dérives (prologue, cutscene) |
| `DESTINS pause off` | relance |

*(Pas de notetag : tout passe par les commandes et les scripts.)*

---

## 4. LES CHIFFRES EXACTS
### Un « battement » (tous les 60 pas, par absent non-chuté)
| Étape | Détail |
|---|---|
| Axe visé | la voie du héros (ou aléatoire) |
| Dérive `n` | **1 ou 2** (`deriveMin`..`deriveMax`) |
| Répit | **30 %** de chance que `n` devienne **négatif** (il résiste) |
| Application `corps` | `Corruption.add(id, n)` |
| Application `ame` | `Errance.add(id, n)` |
| Application `esprit` | `Ame.mauvais(id, n/2)` si n>0 · sinon `Ame.bon(id, n/2)` |
| Rumeur | au **franchissement** de 40/70/100 (une seule fois par héros/axe/seuil) |

### XP des absents
- À chaque combat gagné : chaque absent reçoit `floor(exp × 50 %)` (via `changeExp`, sans afficher de level-up).

### La Chute (lecture d'état)
| `Destins.chute(id)` | Condition |
|---|---|
| `'bete'` | Corruption ≥ **100** |
| `'errant'` | Errance ≥ **100** |
| `'dement'` | phase mentale ≤ **1** |
| `''` | tient encore debout |

> **Jauges partagées** : recruter un héros (`$gameParty.addActor`) arrête sa vie parallèle, mais il **garde ses jauges** (ce sont les mêmes que celles du groupe).

---

## 5. SCRIPTS
```js
Destins.absent(2)     // true si l'acteur 2 vit sa vie ailleurs (pas dans le groupe)
Destins.chute(2)      // '' | 'bete' | 'dement' | 'errant'
Destins.aChute(2)     // true s'il a chuté
Destins.tick(20)      // avance 20 battements (identique à DESTINS tick 20)
```

---

## 6. RECETTES
### 6.1 — La rencontre : recruter OU affronter
```
◆ Si (Script) : Destins.chute(2) === ''
    ◆ Texte : « Korrah ?! Tu es vivante… »
    ◆ Afficher choix : Rejoins-moi / Pas encore
      ◆ Si Rejoins-moi : Script : $gameParty.addActor(2)
◆ Sinon
    ◆ Texte : « Ce qui te fait face n'est plus tout à fait Korrah. »
    ◆ Lancer le combat : sa troupe chutée (crée l'ennemi dans la base)
```
> Raccourci : les **événements communs 201-204** (Aël/Korrah/ludwing/Vesper) font déjà tout automatiquement — pose un PNJ, `Appeler un événement commun ▸ 201-204`.

### 6.2 — Une ellipse temporelle (« le temps a passé »)
```
◆ Texte : « Trois lunes s'écoulèrent sur la route. »
◆ Commande de plugin : DESTINS tick 30      (les absents dérivent de 30 battements)
```

### 6.3 — Figer les destins pendant le prologue
```
◆ Commande de plugin : DESTINS pause on
   … (prologue) …
◆ Commande de plugin : DESTINS pause off
```
(ou règle `pauseSwitch` sur un interrupteur et active-le).

### 6.4 — Dialogue qui varie selon la gravité (AVANT la chute)
Condition ▸ Script :
```js
Corruption.niveau(2) >= 70     // Korrah au bord du gouffre : dialogue urgent
```

### 6.5 — Consulter l'état des absents
```
◆ Commande de plugin : DESTINS ecran
```

---

## 7. DÉTAILS TECHNIQUES & PIÈGES
- **Stockage** : `$gameSystem._destins = { pause, paliers }` → **sauvegardé** (`paliers` mémorise les rumeurs déjà dites).
- **Battement** : hook sur `Game_Party.increaseSteps` (tous les `TICK` pas) ; **XP** : hook sur `BattleManager.gainExp`.
- **Les jauges elles-mêmes** appartiennent à `CorruptionAme` / `Errance` / `JadeEntitePlunging` — Destins ne fait que **les pousser**. Il faut donc que ces plugins soient chargés **avant**.
- **Pause** : respectée pour la dérive **et** pour l'XP.
- **Répit** : un battement « répit » applique `-n`, donc `esprit` fait alors `Ame.bon` (lucidité qui remonte).
- **Rumeurs** : n'apparaissent que si `$gameMessage` est libre — sinon le palier est quand même marqué comme franchi (la rumeur peut être manquée si un message tourne pile à ce moment).

---

> **Voir aussi :** `docs/GUIDE_DEVELOPPEUR.md` (section « Destins parallèles » + matrice des chutes),
> `docs/RECETTES.md` §7.1 & §18.4, `docs/FICHES_PLUGINS.md`, `docs/INDEX.md`.
> **Systèmes liés :** `ViesParalleles` (ce que font les absents, IA), `ChutesDefinitives` (perte réelle), `CorruptionAme`/`Errance`/`JadeEntitePlunging` (les jauges).
