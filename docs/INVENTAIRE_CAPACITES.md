# Inventaire des capacités

Relevé du 2026-10-19. **Rien n'a été modifié** : ce fichier dit ce qui EST.
Il se régénère avec `node bancs/audit/12_inventaire_capacites.js`.

Trois colonnes de vérité, que l'éditeur ne montre pas :

| Marque | Ce que ça veut dire |
|---|---|
| ✔ **ouvert** | la classe, l'acteur ou un état passif ouvre le type : la compétence se voit toujours |
| ◑ **à condition** | le type s'ouvre sous un état que le héros sait poser, ou sous un équipement qu'il peut porter. La branche marche — la colonne « État » dit par où |
| ✘ **INVISIBLE** | aucun chemin : soit rien n'ouvre le type, soit le seul ouvreur est hors d'atteinte (état que rien ne pose, arme que la classe ne porte pas) |
| **encre morte** | la note porte une balise qu'aucun plugin de `js/plugins/` ne lit — elle ne fait rien |
| **coquille** | ni dégâts ni effet : la compétence s'exécute et il ne se passe rien |

---

## Vesper — l'Équilibre

| | |
|---|---|
| Classe | 1 · l'Équilibre |
| Son unique Don | **le Masque** *(objet)* → emplacement Accessoire (5) |
| Trait | sang |
| Note de l'acteur | `<Passive State: 61> · <Passive State: 10> · <Mana: spirituelle> · <Mana2: negatif> · <VoieDefaut: sang> · <Camp: ombre> · ` |

### Ses branches

| | Type | Compétences | État |
|---|---|---|---|
| ✔ | 1 · capacité | 55 | ouvert |
| ✔ | 2 · Spéciale | 17 | ouvert |
| ✔ | 3 · ult | 4 | ouvert |
| ◑ | 5 · BERSEK | 4 | à condition : en lançant « 🩸 Berserker » → état « 🩸 Berserker » |
| ✔ | 10 · sang | 7 | ouvert |
| ◑ | 19 · Arts Sereins | 3 | à condition : en lançant « ☯ Art Serein : État de Flow » → état « ☯ État de Flow » |
| ✔ | 25 · Combo | 3 | ouvert |

> **7 compétences de Vesper attendent leur condition.** Elles ne sont pas mortes : la branche s'ouvre dès que la condition est remplie, et la colonne « État » dit laquelle.

### Type 1 — capacité

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 3 | Attaque Consécutive | — | dégâts PV `Math.floor(a.atk * 4.2 * 200 / (200 + b.def))` · pose « état 0 ABSENT » 100% | arme | `<Style: lame>` |
| 1 | 4 | Double Attaque | — | dégâts PV `Math.floor(a.atk * 4.2 * 200 / (200 + b.def))` · pose « état 0 ABSENT » 100% | arme | `<Style: lame>` |
| 1 | 5 | Triple Attaque | — | dégâts PV `Math.floor(a.atk * 4.2 * 200 / (200 + b.def))` · pose « état 0 ABSENT » 100% | arme | `<Style: lame>` |
| 1 | 6 | Fuir | — | fuite spéciale | 51 | — |
| 1 | 9 | Parole n°8 Feu | 5 PM | dégâts PV *FEU* `Math.floor((100 + a.mat * 2) * 0.717 * 200 / (200 + b.mdf))` | 66 | `<Parole>` `<NomOrigine: Feu>` ⚠ `<Style: garde>` |
| 1 | 10 | Parole n°12 Étincelle | 5 PM | dégâts PV *FOUDRE* `Math.floor((100 + a.mat * 2) * 0.717 * 200 / (200 + b.mdf))` | 78 | `<Parole>` `<NomOrigine: Étincelle>` ⚠ `<Style: garde>` |
| 1 | 17 | Parole n°3 Technique d'Inversion | 30 PM | soin PV *mana positive* `1500 + a.mat` | 42 | `<Parole>` `<NomOrigine: Technique d'Inversion>` ⚠ `<Style: garde>` |
| 1 | 18 | Pas de Rupture | 5 PM + 10 PT | dégâts PV *Physique* `Math.floor(a.atk * 8.7 * 200 / (200 + b.def))` | 6 | `<NoParole>` `<Style: lame>` |
| 1 | 74 | Reprends-toi | 10 PM | dégâts PV `a.atk * 0.5` · retire « Déstabilisé » 100% · retire « Folie Totale » 100% | 346 | `<Post-Damage Eval>` |
| 1 | 139 | Déchaînement Négatif | 40 PT | dégâts PV *mana négative * `Math.floor(a.atk * 6.7 * 200 / (200 + b.def))` | 491 | `<Style: sang>` |
| 1 | 461 | revelation | — | **coquille** — rien | 405 | `<Regard>` |
| 4 | 1130 | Ouvrir | 14 PM | drain PV *Physique* `Math.floor(a.atk * 14 * 200 / (200 + b.def))` · pose « 🩸 Hémorragie Profonde » 60% | 423 | `<Voie: sang>` `<Style: sang>` |
| 5 | 143 | Coup Furieux | 8 PT | dégâts PV *mana négative * `Math.floor(a.atk * 8.7 * 200 / (200 + b.def))` | 487 | `<ParoleL: 3>` `<Style: sang>` |
| 5 | 1226 | Pansement Rapide | 18 PM | soin PV `Math.floor(a.mat * 3.5)` | 41 | — |
| 6 | 1186 | Parole n°8 Feu — Braise | 10 PM | dégâts PV *FEU* `Math.floor(a.mat * 6.6 * 200 / (200 + b.mdf))` | 397 | `<ParoleL: 3>` `<NomOrigine: Feu — Braise>` ⚠ `<Style: garde>` |
| 10 | 144 | Brise-Garde | 6 PM | dégâts PV *Physique* `Math.floor(a.atk * 8.7 * 200 / (200 + b.def))` · malus DÉF 3t | 2 | `<Style: lame>` |
| 11 | 1131 | Le Sang Répond | 26 PT | drain PV *mana négative * `Math.floor(a.atk * 19 * 200 / (200 + b.def))` | 433 | `<Voie: sang>` `<Style: sang>` |
| 12 | 1066 | Frappe Pleine | 12 PM | dégâts PV *Physique* `Math.floor(a.atk * 9.8 * 200 / (200 + b.def))` | 21 | `<Voie: forge>` `<Style: garde>` |
| 13 | 1228 | Purger | 20 PM | retire « 🩸 Hémorragie Profonde » 100% · retire « ❄ Engourdissement » 100% · retire « 🔥 Combustion » 100% · retire « 🌀 Vertige » 100% | 439 | — |
| 15 | 145 | Onde de Rage | 24 PT | dégâts PV *mana négative * `Math.floor(a.atk * 6.3 * 200 / (200 + b.def))` | 34 | `<ParoleL: 4>` `<Style: sang>` |
| 16 | 1191 | Parole n°9 Eau — Goutte | 10 PM | dégâts PV *EAU* `Math.floor(a.mat * 7.7 * 200 / (200 + b.mdf))` | 393 | `<ParoleL: 3>` `<NomOrigine: Eau — Goutte>` ⚠ `<Style: garde>` |
| 17 | 1132 | Art du Sang | 48 PT | drain PV *mana négative * `Math.floor(a.atk * 27 * 200 / (200 + b.def))` | 436 | `<Voie: sang>` `<Style: sang>` |
| 18 | 1067 | Enclume | 20 PM | dégâts PV *Physique* `Math.floor(a.atk * 13 * 200 / (200 + b.def))` · pose « 🔩 Blindage Fissuré » 50% | 369 | `<Voie: forge>` `<Style: garde>` |
| 18 | 1187 | Parole n°8 Feu — Flamme | 22 PM | dégâts PV *FEU* `Math.floor(a.mat * 12 * 200 / (200 + b.mdf))` · pose « 🔥 Combustion » 40% | 398 | `<ParoleL: 4>` `<NomOrigine: Feu — Flamme>` ⚠ `<Style: garde>` |
| 20 | 146 | Sang pour Sang | 14 PT | drain PV *mana négative * `Math.floor(a.atk * 14.55 * 200 / (200 + b.def))` | 102 | `<ParoleL: 3>` `<Sang>` `<Style: sang>` |
| 20 | 1074 | Reflux | 14 PM | dégâts PV *Physique* `Math.floor(a.atk * 15 * 200 / (200 + b.def) * (1 + (a.mhp - a.hp) / a.mhp * 0.8))` | 365 | `<Voie: onde>` `<Style: garde>` |
| 22 | 1233 | Garde Haute | 12 PM | pose « 🛡 Posture de Fer » 100% · boost DÉF 4t | 437 | `<Style: garde>` |
| 24 | 1133 | Fil Écarlate | 38 PT | drain PV *mana négative * `Math.floor(a.atk * 11 * 200 / (200 + b.def))` | 379 | `<Voie: sang>` `<Style: sang>` |
| 25 | 147 | Cri de Fureur | 10 PT | boost ATQ 4t | 37 | `<ParoleL: 3>` `<Style: sang>` |
| 25 | 1068 | Le Point Final | 55 PM | dégâts PV *Physique* `Math.floor(a.atk * 17 * 200 / (200 + b.def))` | 373 | `<Voie: forge>` `<Nerf 2026-09-25: a.atk * 21 * → a.atk * 17 * — était au-dessus de ×2,5 la médiane du héros contre le boss médian>` ⚠ `<Style: garde>` |
| 29 | 1188 | Parole n°8 Feu — Brasier | 34 PM | dégâts PV *FEU* `Math.floor(a.mat * 12 * 200 / (200 + b.mdf))` | 399 | `<ParoleL: 4>` `<NomOrigine: Feu — Brasier>` ⚠ `<Style: garde>` |
| 30 | 148 | Charge Brutale | 16 PM + 20 PT | dégâts PV *Physique* `Math.floor(a.atk * 20 * 200 / (200 + b.def))` | 11 | `<Style: lame>` |
| 30 | 1134 | Saignée Continue | 20 PM | dégâts PV *Physique* `Math.floor(a.atk * 7.7 * 200 / (200 + b.def))` · pose « 🩸 Hémorragie Profonde » 100% · pose « 🫀 Ravage » 50% | 421 | `<Voie: sang>` `<Style: sang>` |
| 30 | 1239 | Briser la Garde | 22 PM | pose « 🔩 Blindage Fissuré » 90% | 429 | `<Style: lame>` |
| 31 | 1069 | Marteau à Deux Mains | 30 PM | dégâts PV *Physique* `Math.floor(a.atk * 16 * 200 / (200 + b.def))` · malus DÉF 3t | 376 | `<Voie: forge>` `<Nerf 2026-09-25: a.atk * 19 * → a.atk * 16 * — ×2,84 pour 30 PM>` ⚠ `<Style: garde>` |
| 32 | 1078 | Grande Marée | 55 PM | dégâts PV *EAU* `Math.floor(a.atk * 26 * 200 / (200 + b.def) * (1 + (a.mhp - a.hp) / a.mhp * 0.8))` | 428 | `<Voie: onde>` `<Style: garde>` |
| 33 | 1075 | Vague Basse | 28 PM | dégâts PV *EAU* `Math.floor(a.atk * 9.4 * 200 / (200 + b.def))` | 427 | `<Voie: onde>` `<Style: garde>` |
| 35 | 149 | Fracas Sismique | 26 PM + 20 PT | dégâts PV *TERRE* `Math.floor(a.atk * 7.9 * 200 / (200 + b.def))` | 89 | `<ParoleL: 4>` `<Style: garde>` |
| 37 | 1070 | Fendre l'Enclume | 35 PM | dégâts PV *Physique* `Math.floor(a.atk * 11 * 200 / (200 + b.def))` | 375 | `<Voie: forge>` `<Style: garde>` |
| 37 | 1135 | Cercle de Sang | 52 PT | drain PV *mana négative * `Math.floor((a.atk + a.mat) * 21 * 100 / (200 + b.def + b.mdf))` | 415 | `<Voie: sang>` `<Style: sang>` |
| 37 | 1192 | Parole n°9 Eau — Vague | 22 PM | dégâts PV *EAU* `Math.floor(a.mat * 14 * 200 / (200 + b.mdf))` · pose « 🌀 Vertige » 40% | 394 | `<ParoleL: 4>` `<NomOrigine: Eau — Vague>` ⚠ `<Style: garde>` |
| 38 | 1194 | Parole n°9 Eau — Déferlante | 46 PM | dégâts PV *EAU* `Math.floor(a.mat * 22 * 200 / (200 + b.mdf))` · pose « 🌀 Vertige » 70% | 396 | `<ParoleL: 5>` `<NomOrigine: Eau — Déferlante>` ⚠ `<Style: garde>` |
| 40 | 150 | Exécution | 30 PT | dégâts PV *mana négative * `Math.floor(a.atk * 25 * 200 / (200 + b.def))` | 65 | `<ParoleL: 4>` `<Nerf 2026-09-25: a.atk * 32 * → a.atk * 25 * — était au-dessus de ×2,5 la médiane du héros contre le boss médian>` ⚠ `<Style: sang>` |
| 40 | 1189 | Parole n°8 Feu — Fournaise | 46 PM | dégâts PV *FEU* `Math.floor(a.mat * 22 * 200 / (200 + b.mdf))` · pose « 🔥 Combustion » 70% | 400 | `<ParoleL: 5>` `<NomOrigine: Feu — Fournaise>` ⚠ `<Style: garde>` |
| 43 | 1071 | Trempe | 18 PM | boost ATQ 5t · boost DÉF 5t | 51 | `<Voie: forge>` `<Style: garde>` |
| 43 | 1136 | Prix du Sang | 18 PT | dégâts PV *mana négative * `Math.floor(a.atk * 20 * 200 / (200 + b.def) * (1 + (a.mhp - a.hp) / a.mhp * 0.8))` | 399 | `<Voie: sang>` `<Nerf 2026-09-25: a.atk * 30 * → a.atk * 20 * — était au-dessus de ×2,5 la médiane du héros contre le boss médian>` ⚠ `<Style: sang>` |
| 44 | 1204 | Parole n°11 Terre — Faille | 46 PM | dégâts PV *TERRE* `Math.floor(a.mat * 22 * 200 / (200 + b.mdf))` · pose « ⛓ Ancrage » 70% | 203 | `<ParoleL: 5>` `<NomOrigine: Terre — Faille>` ⚠ `<Style: garde>` |
| 47 | 1076 | Contre-Courant | 26 PM | dégâts PV *Physique* `Math.floor(a.atk * 19 * 200 / (200 + b.def))` · pose « 🌀 Vertige » 50% | 367 | `<Voie: onde>` `<Style: garde>` |
| 50 | 1072 | Reprise du Marteau | 34 PM | dégâts PV *Physique* `Math.floor(a.atk * 7 * 200 / (200 + b.def))` | 21 | `<Voie: forge>` `<Style: garde>` |
| 50 | 1137 | Tout Ce Qui Coule | 68 PT | drain PV *mana négative * `Math.floor((a.atk + a.mat) * 31 * 100 / (200 + b.def + b.mdf))` | 427 | `<Voie: sang>` `<Style: sang>` |
| 50 | 1232 | Souffle Second | — | PT +60 | 51 | — |
| 52 | 1190 | Parole n°8 Feu — Incendie | 62 PM | dégâts PV *FEU* `Math.floor(a.mat * 21 * 200 / (200 + b.mdf))` · pose « 🔥 Combustion » 50% | 283 | `<ParoleL: 5>` `<NomOrigine: Feu — Incendie>` ⚠ `<Style: garde>` |
| 56 | 1073 | Le Coup qu'On Garde | 45 PM | dégâts PV *Physique* `Math.floor(a.atk * 16 * 200 / (200 + b.def) * (b.hp / b.mhp < 0.35 ? 1.8 : 1))` | 22 | `<Exécution>` `<Voie: forge>` `<Nerf 2026-09-25: a.atk * 24 * → a.atk * 16 * — était au-dessus de ×2,5 la médiane du héros contre le boss médian>` ⚠ `<Style: garde>` |
| 58 | 1193 | Parole n°9 Eau — Courant | 34 PM | dégâts PV *EAU* `Math.floor(a.mat * 14 * 200 / (200 + b.mdf))` | 395 | `<ParoleL: 4>` `<NomOrigine: Eau — Courant>` ⚠ `<Style: garde>` |
| 60 | 1077 | Ressac | 24 PM | dégâts PV *EAU* `Math.floor(a.atk * 9 * 200 / (200 + b.def))` | 425 | `<Voie: onde>` `<Style: garde>` |

### Type 2 — Spéciale

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 52 | Écaille Rouge Dansante | 15 PT | boost ATQ 3t · boost AGI 3t | 53 | `<NoParole>` `<Style: sang>` |
| 1 | 53 | Lame de Sang | 15 PT | dégâts PV *mana négative * `Math.floor(a.atk * 8.9 * 200 / (200 + b.def))` · pose « Saignement » 20% | 423 | `<NoParole>` `<Sang>` `<Style: sang>` |
| 1 | 54 | Parole n°3 Tir Perçant | 25 PM | dégâts PV *mana positive* `Math.floor(a.atk * 18 * 200 / (200 + b.def))` · pose « Saignement » 40% | 114 | `<Parole>` `<NomOrigine: Tir Perçant>` ⚠ `<Style: garde>` |
| 1 | 55 | Pluie de Flèches Sanglantes | 40 PT | drain PV *mana négative * `Math.floor(a.atk * 6.42 * 200 / (200 + b.def))` · pose « Saignement » 60% | 494 | `<Parole>` `<Sang>` `<Style: sang>` |
| 1 | 99 | « Ohhh, lève-toi ! » | 50 PM | PV 100% +1000 · boost PVmax 2t | 49 | — |
| 1 | 413 | Fureur Spectrale (Duo) | 30 PT | dégâts PV *mana négative * `(a.atk + $gameActors.actor(3).atk) * 4 - b.def*1.5` | 335 | `<Combo: 1,3>` `<ComboLien: 3>` |
| 1 | 417 | Trinité d'Âmes (Trio) | 50 PT | dégâts PV *AME * `(a.atk + $gameActors.actor(2).mat + $gameActors.actor(3).mat) * 4` | 533 | `<Combo: 1,2,3>` `<ComboLien: 5>` |
| 1 | 418 | Communion des Quatre (Escouade) | 80 PT | dégâts PV *AME * `$gameParty.aliveMembers().reduce(function(s,m){return s+m.atk+m.mat;},0) * 3` | 533 | `<Combo: 1,2,3,4>` `<ComboLien: 7>` |
| 1 | 419 | Pacte d'Âme | 30 PT | PV -30% +0 · pose « Pacte d'Âme » 100% | 537 | `<Style: sang>` |
| 1 | 447 | Faille d'Armure | 28 PM | dégâts PV *Physique* `Math.floor(a.atk * 8.7 * 200 / (200 + b.def))` | 16 | `<Style: lame>` |
| 1 | 448 | Garde Sereine | 24 PM | dégâts PV *Physique* `Math.floor((a.atk*3 + a.mdf*2) * 1.382 * 200 / (200 + b.def))` | 111 | `<Style: garde>` |
| 20 | 814 | Parole n°16 Tranche des Trois Sources | 30 PM | dégâts PV *mana semi parfait* `Math.floor((a.atk*2 + a.mat*2) * 1.054 * 200 / (200 + b.def))` | 447 | `<ParoleL: 3>` `<NomOrigine: Tranche des Trois Sources>` ⚠ `<Style: garde>` |
| 23 | 1142 | Garde Écarlate | 22 PM | pose « 🛡 Posture de Fer » 100% · pose « 🪞 Reflet » 100% | 439 | `<Style: garde>` |
| 33 | 1144 | Parole n°2 Fil de Vie | 11% PV | dégâts PV *mana spirituelle * `Math.floor(a.mat * 14 * 200 / (200 + b.mdf))` · pose « ⚖ Verdict » 80% | 450 | `<NomOrigine: Fil de Vie>` ⚠ `<Style: garde>` |
| 38 | 1145 | L'Équilibre Tenu | 36 PM | boost ATQ 5t · boost DÉF 5t · boost MDF 5t | 408 | `<Style: garde>` |
| 48 | 1147 | Ce Qu'elle Retient | 48 PT | drain PV *mana négative * `Math.floor((a.atk + a.mat) * 28 * 100 / (200 + b.def + b.mdf))` | 364 | `<Voie: sang>` `<Style: sang>` |
| 53 | 1148 | La Ligne Rouge | 44 PT | drain PV *mana négative * `Math.floor(a.atk * 15 * 200 / (200 + b.def))` | 427 | `<Voie: sang>` `<Style: sang>` |

### Type 3 — ult

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 133 | Déflagration Spirituelle | 10% PV | dégâts PV *mana spirituelle * `Math.floor(a.atk * 17 * 200 / (200 + b.def))` | 470 | `<Post-Damage Eval>` `<Parole: origine>` `<Cooldown: 2>` `<Style: sang>` |
| 1 | 445 | Tranche-Néant | 60 PM + 25% PV | dégâts PV *AME * `Math.floor(a.atk * 20 * 200 / (200 + b.def))` | 527 | `<Ulti>` `<UltiColor: #ff5a4a>` `<After Eval>` `<Parole: origine>` `<Cooldown: 3>` `<Style: lame>` |
| 1 | 446 | Jugement de Soi | 50 PM + 33% PV | dégâts PV *Physique* `Math.floor(a.atk * 36 * 200 / (200 + b.def))` | 35 | `<Ulti>` `<UltiColor: #ff8a3a>` `<After Eval>` `<Cooldown: 3>` `<Style: lame>` |
| 58 | 1149 | Verdict de l'Équilibre | 60 PM | dégâts PV *mana positive* `Math.floor((a.atk + a.mat) * 60 * 100 / (200 + b.def + b.mdf))` · pose « ⚖ Verdict » 100% | 412 | `<Cooldown: 2>` `<Style: garde>` |

### ◑ Type 5 — BERSEK  *(à condition)*

*à condition : en lançant « 🩸 Berserker » → état « 🩸 Berserker »*

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 56 | Paon Hémorragique | 20 PT | dégâts PV *Physique* `Math.floor(a.atk * 5 * 200 / (200 + b.def))` · pose « 🩸 Hémorragie Profonde » 100% | 379 | `<NoParole>` `<Sang>` `<HorsFamille>` `<Style: sang>` |
| 1 | 57 | Frappe Écarlate | 10 PT | dégâts PV *Physique* `Math.floor(a.atk * 16 * 200 / (200 + b.def))` | 423 | `<NoParole>` `<Sang>` `<HorsFamille>` `<Style: sang>` |
| 1 | 58 | Rafale de Coups Écarlates | 15 PT | dégâts PV *Physique* `Math.floor(a.atk * 2.5 * 200 / (200 + b.def))` | 423 | `<NoParole>` `<Sang>` `<HorsFamille>` `<Style: sang>` |
| 1 | 59 | Dragon de la Nuit Sanglante | 10 PM + 20 PT + 50% PV | dégâts PV *Physique* `Math.floor(a.atk * 20 * 200 / (200 + b.def)) + (a.mhp - a.hp)` | 415 | `<NoParole>` `<Sang>` `<Nerf 2026-09-25: a.atk * 25 → a.atk * 16 — était au-dessus de ×2,5 la médiane du héros contre le boss médian>` ⚠ `<HorsFamille>` `<Style: sang>` |

### Type 10 — sang

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 3 | 1138 | Première Entaille | 12 PM | dégâts PV *Physique* `Math.floor(a.atk * 8.4 * 200 / (200 + b.def))` · pose « 🩸 Hémorragie Profonde » 50% | 423 | `<Voie: sang>` `<InscritDette>` `<HorsFamille>` `<Style: sang>` |
| 8 | 1139 | Lame Liquide | 20 PT | dégâts PV *mana négative * `Math.floor(a.atk * 11 * 200 / (200 + b.def))` | 379 | `<Voie: sang>` `<Style: sang>` |
| 13 | 1140 | Deux Cercles | 32 PT | drain PV *mana négative * `Math.floor((a.atk + a.mat) * 20 * 100 / (200 + b.def + b.mdf))` | 415 | `<Voie: sang>` `<InscritDette>` `<HorsFamille>` `<Style: sang>` |
| 18 | 1141 | Elle Ne Recule Pas | 26 PT | dégâts PV *mana négative * `Math.floor(a.atk * 24 * 200 / (200 + b.def) * (1 + (a.mhp - a.hp) / a.mhp * 0.8))` | 399 | `<Voie: sang>` `<Style: sang>` |
| 28 | 1143 | Rendre le Sang | 30 PT | drain PV *mana négative * `Math.floor(a.atk * 22 * 200 / (200 + b.def))` | 436 | `<Voie: sang>` `<RendreLeSang>` `<HorsFamille>` `<Style: sang>` |
| 43 | 1146 | Écarlate Montante | 34 PT | dégâts PV *mana négative * `Math.floor(a.atk * 7.7 * 200 / (200 + b.def))` | 421 | `<Voie: sang>` `<Style: sang>` |
| 45 | 813 | ✶ la Convergence | 15 PM | pose « ✶ Convergence » 100% | 387 | `<Ultime: convergence>` `<Convergence>` `<HorsFamille>` `<Voie: sang>` `<Style: sang>` |

### ◑ Type 19 — Arts Sereins  *(à condition)*

*à condition : en lançant « ☯ Art Serein : État de Flow » → état « ☯ État de Flow »*

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 128 | Fil Clair | 12 PM | dégâts PV `Math.floor(a.atk * 24 * 200 / (200 + b.def))` | 372 | `<Voie: miroir>` `<HorsFamille>` `<Style: lame>` |
| 1 | 129 | Chirurgie du Vide | 10 PM | dégâts PV `Math.floor(a.atk * 9 * 200 / (200 + b.def))` | 369 | `<Voie: vide>` `<NomOrigine: Chirurgie du Vide>` ⚠ `<HorsFamille>` `<Style: lame>` |
| 1 | 131 | Frappe de l'Instant Juste | — | dégâts PV `Math.floor(a.atk * 16 * 200 / (200 + b.def))` | 21 | `<Voie: onde>` `<HorsFamille>` `<Style: lame>` |

### Type 25 — Combo

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 20 | 1303 | Lame de Givre | — | dégâts PV *Physique* `Math.floor(a.atk * 28.75 * 200 / (200 + b.def) + a.mat * 33.35 * 200 / (200 + b.mdf))` | 224 | `<unison item actors: 1, 2>` `<unison item actor learn: t, t>` `<unison item actor tp cost: 30, 30>` `<unison item atk actors: 1>` `<unison item mat actors: 2>` `<Multiple Elements: 13>` `<Combo: JOKO 2026-10-18 — somme des deux coups de référence × 1.15>` |
| 20 | 1304 | La Lame et son Ombre | — | dégâts PV *Physique* `Math.floor(a.atk * 28.75 * 200 / (200 + b.def) + a.mat * 26.45 * 200 / (200 + b.mdf))` | 250 | `<unison item actors: 1, 3>` `<unison item actor learn: t, t>` `<unison item actor mp cost: 0, 42>` `<unison item actor tp cost: 30, 0>` `<unison item atk actors: 1>` `<unison item mat actors: 3>` `<Multiple Elements: 15>` `<Combo: JOKO 2026-10-18 — somme des deux coups de référence × 1.15>` |
| 20 | 1305 | Feu Attisé | — | dégâts PV *FEU* `Math.floor(a.atk * 12.65 * 200 / (200 + b.def) + a.mat * 27.6 * 200 / (200 + b.mdf))` | 167 | `<unison item actors: 1, 4>` `<unison item actor learn: t, t>` `<unison item actor mp cost: 35, 46>` `<unison item atk actors: 1>` `<unison item mat actors: 4>` `<Multiple Elements: 10>` `<Combo: JOKO 2026-10-18 — somme des deux coups de référence × 1.15>` |

### Ses états passifs

| # | État | Traits | Ouvre |
|---|---|---|---|
| 61 | NORMALTHY | 0 **aucun : il ne fait rien** | — |
| 10 | Traqueur de Coups | 0 **aucun : il ne fait rien** | — |

### Son Don dans l'équipement

| Genre | # | Nom | etypeId | Note |
|---|---|---|---|---|
| arme | 529 | arrachée à Ton Visage | 1 | `<ButinBoss: 800> · <Famille: Les Masques> · <Image d'arme: Dagger Magenta> <!-- auto -->` |
| arme | 530 | que La Doublure tenait | 1 | `<ButinBoss: 801> · <Famille: Les Masques> · <Image d'arme: Dagger Magenta> <!-- auto -->` |
| armure | 68 | Éclat de Masque | 5 | `<Don: vesper> · <Forme: objet> · <Palier: 1> · <DonDe: 1>` |
| armure | 69 | Masque Naissant | 5 | `<Don: vesper> · <Forme: objet> · <Palier: 2> · <DonDe: 1>` |
| armure | 70 | Masque Résonant | 5 | `<Don: vesper> · <Forme: objet> · <Palier: 3> · <DonDe: 1>` |
| armure | 71 | Vérité du Masque | 5 | `<Don: vesper> · <Forme: objet> · <Palier: 4> · <DonDe: 1>` |
| armure | 87 | Relique — Ton Visage | 7 | `<ButinBoss: 800> · <Famille: Les Masques>` |

---

## Korrah — la Maîtrise

| | |
|---|---|
| Classe | 2 · la Maîtrise |
| Son unique Don | **l'Armure Volante** *(avatar spirituel)* → emplacement Âme (7) |
| Trait | change + hiver |
| Note de l'acteur | `<Passive State: 62> · <Mana: negatif> · <Mana2: positif> · <VoieDefaut: flash> · <Camp: lumiere>` |

### Ses branches

| | Type | Compétences | État |
|---|---|---|---|
| ✔ | 1 · capacité | 55 | ouvert |
| ✔ | 2 · Spéciale | 15 | ouvert |
| ✔ | 3 · ult | 5 | ouvert |
| ✔ | 6 · hiver | 14 | ouvert |
| ✔ | 21 · avatar | 14 | ouvert |
| ✔ | 25 · Combo | 3 | ouvert |

### Type 1 — capacité

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 1 | Attaque | — | dégâts PV `Math.floor(a.atk * 4.2 * 200 / (200 + b.def))` · pose « état 0 ABSENT » 100% | arme | — |
| 1 | 2 | Garde | — | pose « Garde » 100% | 415 | — |
| 1 | 3 | Attaque Consécutive | — | dégâts PV `Math.floor(a.atk * 4.2 * 200 / (200 + b.def))` · pose « état 0 ABSENT » 100% | arme | `<Style: lame>` |
| 1 | 4 | Double Attaque | — | dégâts PV `Math.floor(a.atk * 4.2 * 200 / (200 + b.def))` · pose « état 0 ABSENT » 100% | arme | `<Style: lame>` |
| 1 | 5 | Triple Attaque | — | dégâts PV `Math.floor(a.atk * 4.2 * 200 / (200 + b.def))` · pose « état 0 ABSENT » 100% | arme | `<Style: lame>` |
| 1 | 12 | Parole n°2 Encouragement | 9% PV | soin PV *mana spirituelle * `400 + a.mat` · PM 20% +0 · PT +5 | 37 | `<ParoleL: 4>` `<NomOrigine: Encouragement>` ⚠ |
| 1 | 25 | Lecture du Corps | 5 PM + 10 PT | pose « Confus » 100% | 36 | `<NoParole>` `<Regard>` |
| 1 | 73 | Mots de Réconfort | 12 PM | PV 10% +0 | 41 | `<Post-Damage Eval>` |
| 1 | 140 | Parole n°3 Verdict de l'Équilibre | 24 PM | dégâts PV *mana positive* `Math.floor(a.mat * 8.7 * 200 / (200 + b.mdf))` | 480 | `<ParoleL: 4>` `<NomOrigine: Verdict de l'Équilibre>` ⚠ |
| 1 | 461 | revelation | — | **coquille** — rien | 405 | `<Regard>` |
| 4 | 1106 | Pas de Côté | 12 PM | dégâts PV *FOUDRE* `Math.floor(a.atk * 7.8 * 200 / (200 + b.def))` · boost AGI 4t | 381 | `<Voie: eclair>` |
| 5 | 151 | Parole n°3 Éclat Positif | 10 PM | dégâts PV *mana positive* `Math.floor(a.mat * 8.7 * 200 / (200 + b.mdf))` | 122 | `<ParoleL: 3>` `<NomOrigine: Éclat Positif>` ⚠ |
| 5 | 1230 | Délier | 14 PM | retire « ⛓ Ancrage » 100% | 404 | — |
| 8 | 1151 | Prise de Position | 16 PM | boost AGI 5t · boost DÉF 5t | 404 | — |
| 10 | 152 | Barrière Magique | 9% PV | boost MDF 4t | 42 | `<ParoleL: 4>` |
| 11 | 1107 | Trait Foudroyant | 24 PM | dégâts PV *FOUDRE* `Math.floor(a.atk * 11 * 200 / (200 + b.def))` | 384 | `<Voie: eclair>` |
| 12 | 1098 | Traverser | 18 PM | dégâts PV *Physique* `Math.floor(a.atk * 11 * 200 / (200 + b.def * 0.3))` | 405 | `<Perce-Armure>` `<Voie: vide>` |
| 13 | 1236 | Accélérer | 28 PM | boost AGI 4t | 381 | — |
| 15 | 153 | Parole n°4 Faille Négative | 14 PT | dégâts PV *mana négative * `Math.floor(a.mat * 10 * 200 / (200 + b.mdf))` | 493 | `<ParoleL: 3>` `<NomOrigine: Faille Négative>` ⚠ |
| 16 | 1206 | Parole n°12 Foudre — Étincelle | 10 PM | dégâts PV *FOUDRE* `Math.floor(a.mat * 7.7 * 200 / (200 + b.mdf))` | 381 | `<ParoleL: 3>` `<NomOrigine: Foudre — Étincelle>` ⚠ |
| 17 | 1108 | Trois Fois Avant Lui | 30 PM | dégâts PV *FOUDRE* `Math.floor(a.atk * 5.6 * 200 / (200 + b.def))` | 382 | `<Voie: eclair>` |
| 18 | 1099 | Paume Immobile | 30 PM | dégâts PV *Physique* `Math.floor(a.atk * 14 * 200 / (200 + b.def * 0.25))` | 1 | `<Perce-Armure>` `<Voie: vide>` `<Cooldown: 2>` |
| 18 | 1153 | Lecture du Geste | 20 PM | dégâts PV *Physique* `Math.floor(a.atk * 13 * 200 / (200 + b.def))` · malus ATQ 4t | 2 | — |
| 20 | 154 | Analyse Tactique | 16 PM | malus ATQ 3t · malus MAT 3t | 51 | — |
| 20 | 1122 | Éclat Bref | 16 PT | dégâts PV *mana négative * `Math.floor(a.atk * 11 * 200 / (200 + b.def))` | 64 | `<Voie: flash>` |
| 22 | 1241 | Ralentir | 20 PM | pose « ❄ Engourdissement » 80% | 385 | — |
| 23 | 1154 | Contre-Prise | 28 PM | dégâts PV *Physique* `Math.floor(a.atk * 16 * 200 / (200 + b.def))` · pose « ⛓ Ancrage » 50% | 21 | — |
| 24 | 1109 | Instant Foudroyant | 48 PM | dégâts PV *FOUDRE* `Math.floor(a.atk * 20 * 200 / (200 + b.def))` | 383 | `<Voie: eclair>` |
| 25 | 155 | Parole n°3 Vague Équilibrée | 26 PM | dégâts PV *mana positive* `Math.floor(a.mat * 6.5 * 200 / (200 + b.mdf))` | 84 | `<ParoleL: 4>` `<NomOrigine: Vague Équilibrée>` ⚠ |
| 25 | 1100 | Le Souffle Retenu | 12 PM | boost MAT 5t · boost MDF 5t · PT +25 | 51 | `<Voie: vide>` |
| 30 | 156 | Contre-Sort | 12 PM | boost MAT 4t · boost MDF 4t | 52 | `<ParoleL: 3>` |
| 30 | 1110 | Fil de Foudre | 38 PM | dégâts PV *FOUDRE* `Math.floor(a.atk * 10 * 200 / (200 + b.def))` | 384 | `<Voie: eclair>` |
| 30 | 1243 | Sceller la Voix | 30 PM | pose « 🔇 Silence Runique » 75% | 415 | — |
| 31 | 1101 | Point Creux | 44 PM | dégâts PV *Physique* `Math.floor(a.atk * 17 * 200 / (200 + b.def * 0.2))` · pose « ⛓ Ancrage » 50% | 64 | `<Perce-Armure>` `<Voie: vide>` `<Cooldown: 3>` `<Nerf 2026-09-25: a.atk * 22 * → a.atk * 17 * — était au-dessus de ×2,5 la médiane du héros contre le boss médian>` ⚠ |
| 32 | 1079 | Prendre l'Élan | 16 PM | pose « 🛡 Posture de Fer » 100% · PT +30 | 437 | `<Voie: onde>` |
| 33 | 1123 | Distorsion | 28 PT | dégâts PV *mana négative * `Math.floor(a.atk * 17 * 200 / (200 + b.def))` | 430 | `<Voie: flash>` |
| 33 | 1156 | Elle Prend Ta Place | 24 PM | PV 20% +0 · retire « 👁 Marqué » 100% | 404 | — |
| 35 | 157 | Parole n°4 Jugement Dual | 30 PT | dégâts PV *mana négative * `Math.floor(a.mat * 29 * 200 / (200 + b.mdf))` | 493 | `<ParoleL: 4>` `<NomOrigine: Jugement Dual>` ⚠ |
| 37 | 1102 | Rien de Visible | 40 PM | dégâts PV *Physique* `Math.floor(a.atk * 9.4 * 200 / (200 + b.def * 0.35))` | 407 | `<Perce-Armure>` `<Voie: vide>` |
| 37 | 1111 | Charge Statique | 20 PM | boost AGI 5t · boost CHA 5t | 51 | `<Voie: eclair>` |
| 37 | 1207 | Parole n°12 Foudre — Arc | 22 PM | dégâts PV *FOUDRE* `Math.floor(a.mat * 14 * 200 / (200 + b.mdf))` · pose « 🌀 Vertige » 40% | 382 | `<ParoleL: 4>` `<NomOrigine: Foudre — Arc>` ⚠ |
| 38 | 1157 | Angle Parfait | 34 PM | dégâts PV *Physique* `Math.floor(a.atk * 19 * 200 / (200 + b.def * 0.3))` | 369 | `<Perce-Armure>` `<Voie: vide>` `<Cooldown: 2>` |
| 38 | 1195 | Parole n°9 Eau — Océan | 62 PM | dégâts PV *EAU* `Math.floor(a.mat * 18 * 200 / (200 + b.mdf))` · pose « 🌀 Vertige » 50% | 425 | `<ParoleL: 5>` `<NomOrigine: Eau — Océan>` ⚠ |
| 43 | 1103 | L'Immobile | 50 PM | dégâts PV *mana positive* `Math.floor((a.atk + a.mat) * 24 * 100 / (200 + b.def + b.mdf))` · pose « 🌀 Vertige » 60% | 418 | `<Voie: vide>` |
| 43 | 1112 | Coup de Grâce Éclair | 26 PM | dégâts PV *FOUDRE* `Math.floor(a.atk * 22 * 200 / (200 + b.def) * (b.hp / b.mhp < 0.35 ? 1.8 : 1))` | 381 | `<Exécution>` `<Voie: eclair>` |
| 43 | 1158 | Trois Temps | 30 PM | dégâts PV *Physique* `Math.floor(a.atk * 6.8 * 200 / (200 + b.def))` | 371 | — |
| 44 | 1205 | Parole n°11 Terre — Séisme | 62 PM | dégâts PV *TERRE* `Math.floor(a.mat * 18 * 200 / (200 + b.mdf))` · pose « ⛓ Ancrage » 50% | 431 | `<ParoleL: 5>` `<NomOrigine: Terre — Séisme>` ⚠ |
| 47 | 1124 | Éclat Noir | 50 PT | dégâts PV *mana négative * `Math.floor(a.atk * 24 * 200 / (200 + b.def))` | 445 | `<Voie: flash>` `<Nerf 2026-09-25: a.atk * 29 * → a.atk * 24 * — ×2,98 en moyenne pour 50 PT>` ⚠ |
| 50 | 1104 | Vider le Geste | 20 PM | dégâts PV *Physique* `Math.floor(a.atk * 17 * 200 / (200 + b.def))` | 371 | `<Voie: vide>` |
| 50 | 1113 | Plus Vite que le Geste | 58 PM | dégâts PV *FOUDRE* `Math.floor(a.atk * 31 * 200 / (200 + b.def))` | 210 | `<Voie: eclair>` `<Cooldown: 2>` |
| 50 | 1237 | Affûter | 28 PM | boost ATQ 5t · boost MAT 5t | 51 | — |
| 53 | 1160 | Maîtrise | 22 PM | dégâts PV *Physique* `Math.floor(a.atk * 17 * 200 / (200 + b.def))` | 1 | `<Nerf 2026-09-25: a.atk * 20 * → a.atk * 17 * — ×2,85 en moyenne pour 22 PM>` ⚠ |
| 56 | 1105 | Le Creux Entre Deux | 65 PM | dégâts PV *Physique* `Math.floor(a.atk * 22 * 200 / (200 + b.def * 0.15))` | 417 | `<Perce-Armure>` `<Voie: vide>` `<Cooldown: 4>` `<Nerf 2026-09-25: a.atk * 34 * → a.atk * 22 * — était au-dessus de ×2,5 la médiane du héros contre le boss médian>` ⚠ |
| 58 | 1208 | Parole n°12 Foudre — Trait | 34 PM | dégâts PV *FOUDRE* `Math.floor(a.mat * 14 * 200 / (200 + b.mdf))` | 383 | `<ParoleL: 4>` `<NomOrigine: Foudre — Trait>` ⚠ |
| 60 | 1125 | Angle Impossible | 24 PT | dégâts PV *mana négative * `Math.floor(a.atk * 18 * 200 / (200 + b.def))` | 447 | `<Voie: flash>` |

### Type 2 — Spéciale

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 15 | Parole n°12 l'Onde | 15 PM + 20 PT | dégâts PV *FOUDRE* `Math.floor(a.mat * 14 * 200 / (200 + b.mdf))` · pose « Confus » 30% · pose « Mana Sombre » 20% | 76 | `<Parole>` `<NomOrigine: l'Onde>` ⚠ |
| 1 | 92 | Sauvetage in extremis | 12 PM | pose « PERMUTATION » 100% | 415 | — |
| 1 | 93 | Main Ouverte | 12 PM | pose « ouverture parfaite » 100% | 415 | — |
| 1 | 94 | Désorientation | 7% PV | pose « Confus » 100% · malus AGI 3t | 413 | `<ParoleL: 3>` |
| 1 | 95 | Œil du Stratège | 12 PM | pose « Analyse » 100% | 415 | — |
| 1 | 96 | Corps-à-corps lourd | 10 PM | dégâts PV *Physique* `Math.floor(a.atk * 8.7 * 200 / (200 + b.def))` · pose « Vulnérable » 30% | 2 | `<NoParole>` |
| 1 | 100 | Debout ! | 50 PM | PV 100% +1000 · boost PVmax 2t | 49 | — |
| 1 | 414 | Parole n°3 Verdict Stellaire (Duo) | 30 PM | dégâts PV *mana positive* `(a.mat + $gameActors.actor(4).mat) * 4 - b.mdf*1.5` | 481 | `<Combo: 2,4>` `<ComboLien: 3>` `<NomOrigine: Verdict Stellaire (Duo)>` ⚠ |
| 1 | 416 | Parole n°14 Aube Ardente (Duo) | 30 PT | dégâts PV *LUMIÈRE* `(a.mat + $gameActors.actor(1).atk) * 4 - b.mdf` | 243 | `<Combo: 4,1>` `<ComboLien: 3>` `<NomOrigine: Aube Ardente (Duo)>` ⚠ |
| 1 | 420 | Posture de Parade | 10 PM | pose « Posture de Parade » 100% | 485 | — |
| 1 | 451 | Parole n°3 Focalisation | 30 PM | dégâts PV *mana positive* `Math.floor(a.mat * 8.7 * 200 / (200 + b.mdf))` | 480 | `<ParoleL: 4>` `<NomOrigine: Focalisation>` ⚠ |
| 1 | 452 | Parole n°2 Onde Concentrée | 12% PV | dégâts PV *mana spirituelle * `Math.floor(a.mat * 3 * 200 / (200 + b.mdf))` | 468 | `<ParoleL: 5>` `<NomOrigine: Onde Concentrée>` ⚠ |
| 20 | 816 | Carnage des Neuf Voies | 25 PT | dégâts PV *Physique* `Math.floor(a.atk * 4.9 * 200 / (200 + b.def))` | 450 | `<Invocation: 3>` `<ParoleL: 4>` |
| 30 | 817 | Étreinte de la Bête | 20 PT | dégâts PV *mana négative * `Math.floor(a.atk * 14 * 200 / (200 + b.def))` | 451 | `<ReculVital: 20>` |
| 45 | 815 | ⚔ la Mue Souveraine | 40 PT | **coquille** — rien | 449 | `<Ultime: mue>` |

### Type 3 — ult

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 89 | Armure de Givre | 12 PM | pose « arret du temps (corporelle) » 100% | 312 | `<Parole: origine>` `<Trait: gel>` |
| 1 | 97 | Valse des Positions | 10 PM | dégâts PV *mana positive* `Math.floor(a.atk * 8.1 * 200 / (200 + b.def))` | 404 | `<ParoleL: n>` `<Trait: change>` |
| 1 | 438 | Change | 20 PM + 20 PT | **coquille** — rien | 437 | `<Trait: change>` |
| 1 | 449 | Parole n°3 Instant Absolu | 90 PM | dégâts PV *mana positive* `Math.floor(a.mat * 7.6 * 200 / (200 + b.mdf))` | 483 | `<Ulti>` `<UltiColor: #5cc8ff>` `<After Eval>` `<Parole: origine>` `<NomOrigine: Instant Absolu>` ⚠ |
| 1 | 450 | Parole n°3 Point Zéro | 80 PM | dégâts PV *mana positive* `Math.floor(a.mat * 20 * 200 / (200 + b.mdf))` | 40 | `<Ulti>` `<UltiColor: #3a9bff>` `<After Eval>` `<Parole: origine>` `<NomOrigine: Point Zéro>` ⚠ |

### Type 6 — hiver

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 24 | le Monde Gelé | 100 PM + 50 PT | pose « Monde Gelé » 100% · script commun 6 | 232 | `<ParoleL: 5>` `<Trait: gel>` |
| 1 | 90 | Instant Gelé | 12 PM | pose « le monde court » 100% | 223 | `<Parole>` `<Trait: gel>` |
| 1 | 91 | Zéro Absolu | 12 PM | pose « le monde prolonger » 100% | 231 | `<Parole>` `<Trait: gel>` |
| 1 | 800 | Le Froid Rendu | 100 PT | drain PV *GLACE* `Math.floor(a.mat * 3.2 * 200 / (200 + b.mdf))` · pose « Monde Gelé » 100% | 232 | `<ParoleL: 5>` `<Trait: gel>` `<FroidConfie: 100>` |
| 3 | 1150 | Parole n°13 Souffle Court | 14 PM | dégâts PV *GLACE* `Math.floor(a.mat * 8.4 * 200 / (200 + b.mdf))` · pose « ❄ Engourdissement » 60% | 385 | `<NomOrigine: Souffle Court>` ⚠ |
| 6 | 1211 | Parole n°13 Glace — Givre | 10 PM | dégâts PV *GLACE* `Math.floor(a.mat * 6.6 * 200 / (200 + b.mdf))` | 385 | `<ParoleL: 3>` `<NomOrigine: Glace — Givre>` ⚠ |
| 13 | 1152 | Parole n°13 Gel de Surface | 32 PM | dégâts PV *GLACE* `Math.floor(a.mat * 8.4 * 200 / (200 + b.mdf))` · pose « ❄ Engourdissement » 50% | 387 | `<NomOrigine: Gel de Surface>` ⚠ |
| 18 | 1212 | Parole n°13 Glace — Éclat | 22 PM | dégâts PV *GLACE* `Math.floor(a.mat * 12 * 200 / (200 + b.mdf))` · pose « ❄ Engourdissement » 40% | 386 | `<ParoleL: 4>` `<NomOrigine: Glace — Éclat>` ⚠ |
| 28 | 1155 | Parole n°13 Givre Profond | 40 PM | dégâts PV *GLACE* `Math.floor(a.mat * 20 * 200 / (200 + b.mdf))` · pose « ❄ Engourdissement » 100% · malus AGI 4t | 388 | `<NomOrigine: Givre Profond>` ⚠ |
| 29 | 1213 | Parole n°13 Glace — Aiguille | 34 PM | dégâts PV *GLACE* `Math.floor(a.mat * 12 * 200 / (200 + b.mdf))` | 387 | `<ParoleL: 4>` `<NomOrigine: Glace — Aiguille>` ⚠ |
| 40 | 1214 | Parole n°13 Glace — Banquise | 46 PM | dégâts PV *GLACE* `Math.floor(a.mat * 22 * 200 / (200 + b.mdf))` · pose « ❄ Engourdissement » 70% | 388 | `<ParoleL: 5>` `<NomOrigine: Glace — Banquise>` ⚠ |
| 48 | 1159 | Parole n°13 Le Froid Partagé | 54 PM + 10% PV | dégâts PV *GLACE* `Math.floor(a.mat * 30 * 200 / (200 + b.mdf))` | 232 | `<NomOrigine: Le Froid Partagé>` ⚠ `<Cooldown: 2>` |
| 52 | 1215 | Parole n°13 Glace — Hiver | 62 PM | dégâts PV *GLACE* `Math.floor(a.mat * 21 * 200 / (200 + b.mdf))` · pose « ❄ Engourdissement » 50% | 232 | `<ParoleL: 5>` `<NomOrigine: Glace — Hiver>` ⚠ |
| 58 | 1161 | Point d'Arrêt | 58 PM | dégâts PV *GLACE* `Math.floor((a.atk + a.mat) * 32 * 100 / (200 + b.def + b.mdf))` · pose « ⛓ Ancrage » 80% · pose « ❄ Engourdissement » 100% | 223 | — |

### Type 21 — avatar

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 1246 | Avatar — Laisse-le faire | — | **coquille** — rien | 21 | `<AvatarPosture: libre>` `<HorsFamille>` |
| 1 | 1247 | Avatar — Assaut | — | **coquille** — rien | 21 | `<AvatarPosture: agressif>` `<HorsFamille>` |
| 1 | 1248 | Avatar — Devant moi | — | **coquille** — rien | 440 | `<AvatarPosture: garde>` `<HorsFamille>` |
| 1 | 1250 | Saisie de l'Armure | — | dégâts PV *mana négative * `Math.floor(a.atk * 0.9 * 200 / (200 + b.def))` · pose « Étourdi » 55% | 487 | `<Avatar>` `<AvatarNiveau: 1>` |
| 1 | 1251 | Étau de l'Armure | — | dégâts PV *mana négative * `Math.floor(a.atk * 1.9 * 200 / (200 + b.def))` · pose « 🔩 Blindage Fissuré » 70% | 404 | `<Avatar>` `<AvatarNiveau: 2>` |
| 1 | 1252 | Le Torse Se Referme | — | pose « 🛡 Posture de Fer » 100% | 440 | `<Avatar>` `<AvatarNiveau: 2>` `<AvatarGarde>` ⚠ |
| 1 | 1253 | Déferlante d'Unisson | — | dégâts PV *mana négative * `Math.floor(a.atk * 1.6 * 200 / (200 + b.def))` | 404 | `<Avatar>` `<AvatarNiveau: 3>` |
| 1 | 1254 | Ce Que Le Froid Garde | — | dégâts PV *GLACE* `Math.floor(a.atk * 1.4 * 200 / (200 + b.def))` · pose « Gelure » 60% | 232 | `<Avatar>` `<AvatarNiveau: 3>` |
| 1 | 1263 | Avatar — Protège-le | — | **coquille** — rien | 437 | `<AvatarProtege>` `<HorsFamille>` |
| 1 | 1264 | Avatar — Soigne-le | — | **coquille** — rien | 405 | `<AvatarOrdre: 1259>` `<HorsFamille>` |
| 25 | 1255 | Avatar — Vise ça | — | **coquille** — rien | 21 | `<AvatarOrdre: 1249>` `<AvatarNiveau: 1>` `<HorsFamille>` |
| 50 | 1256 | Avatar — Étau | — | **coquille** — rien | 404 | `<AvatarOrdre: 1251>` `<AvatarNiveau: 2>` `<HorsFamille>` |
| 85 | 1257 | Avatar — Unisson | — | **coquille** — rien | 404 | `<AvatarOrdre: 1253>` `<AvatarNiveau: 3>` `<HorsFamille>` |
| 85 | 1258 | Avatar — Rends-le | — | **coquille** — rien | 232 | `<AvatarOrdre: 1254>` `<AvatarNiveau: 3>` `<HorsFamille>` |

### Type 25 — Combo

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 20 | 1303 | Lame de Givre | — | dégâts PV *Physique* `Math.floor(a.atk * 28.75 * 200 / (200 + b.def) + a.mat * 33.35 * 200 / (200 + b.mdf))` | 224 | `<unison item actors: 1, 2>` `<unison item actor learn: t, t>` `<unison item actor tp cost: 30, 30>` `<unison item atk actors: 1>` `<unison item mat actors: 2>` `<Multiple Elements: 13>` `<Combo: JOKO 2026-10-18 — somme des deux coups de référence × 1.15>` |
| 20 | 1306 | Nuit d'Hiver | — | dégâts PV *GLACE* `Math.floor(a.mat * 54.05 * 200 / (200 + b.mdf))` | 258 | `<unison item actors: 2, 3>` `<unison item actor learn: t, t>` `<unison item actor mp cost: 62, 42>` `<unison item mat actors: 2, 3>` `<Multiple Elements: 15>` `<Combo: JOKO 2026-10-18 — somme des deux coups de référence × 1.15>` `<Cooldown: 2>` |
| 20 | 1307 | Ciel d'Orage | — | dégâts PV *FOUDRE* `Math.floor(a.mat * 51.75 * 200 / (200 + b.mdf))` | 219 | `<unison item actors: 2, 4>` `<unison item actor learn: t, t>` `<unison item actor mp cost: 62, 46>` `<unison item mat actors: 2, 4>` `<Multiple Elements: 14>` `<Combo: JOKO 2026-10-18 — somme des deux coups de référence × 1.15>` |

### Ses états passifs

| # | État | Traits | Ouvre |
|---|---|---|---|
| 62 | normal | 0 **aucun : il ne fait rien** | — |

### Son Don dans l'équipement

| Genre | # | Nom | etypeId | Note |
|---|---|---|---|---|
| armure | 79 | Vérité de l'Armure Volante | 7 | `<Don: korrah> · <Forme: avatar> · <Palier: 4> · <TraitDebloque: hiver> · <DonDe: 2>` |

---

## ludwing — le Symbole

| | |
|---|---|
| Classe | 3 · le Symbole |
| Son unique Don | **l'Amulette** *(objet)* → emplacement Accessoire (5) |
| Trait | ames |
| Note de l'acteur | `<Passive State: 64> · <Mana: spirituelle> · <Mana2: positif> · <VoieDefaut: source> · <Camp: ombre> · ` |

### Ses branches

| | Type | Compétences | État |
|---|---|---|---|
| ✔ | 1 · capacité | 44 | ouvert |
| ✔ | 2 · Spéciale | 17 | ouvert |
| ✔ | 3 · ult | 2 | ouvert |
| ✘ | 4 · JACKPOT | 5 | **INVISIBLE** — seul chemin : état « JACKPOT » — que rien ne pose, hors d'atteinte |
| ✘ | 8 · invocation | 2 | **INVISIBLE** — seul chemin : état « Royaume Impérial » — que rien ne pose, hors d'atteinte |
| ✔ | 9 · ame | 9 | ouvert |
| ◑ | 11 · ombre d'épeé | 1 | à condition : en équipant arme « Épée d'Ombre » |
| ◑ | 12 · ombre de dague | 1 | à condition : en équipant arme « Dague d'Ombre » |
| ◑ | 13 · ombre de hache | 1 | à condition : en équipant arme « Hache des Ténèbres » |
| ✘ | 14 · ombre de katana | 1 | **INVISIBLE** — seul chemin : état « katana de la mort » — que rien ne pose, hors d'atteinte |
| ◑ | 15 · ombre de lance | 1 | à condition : en équipant arme « Lance des Abysses » |
| ✘ | 16 · ombre de griffe | 1 | **INVISIBLE** — seul chemin : état « griffe hurleur d'ame » — que rien ne pose, hors d'atteinte |
| ✘ | 17 · ombre de arc | 1 | **INVISIBLE** — seul chemin : état « arc d'ombre » — que rien ne pose, hors d'atteinte |
| ◑ | 18 · ombre de arme a feu | 1 | à condition : en équipant arme « Fusil à Pompe Éternel » |
| ✔ | 25 · Combo | 3 | ouvert |

> **5 compétences de ludwing attendent leur condition.** Elles ne sont pas mortes : la branche s'ouvre dès que la condition est remplie, et la colonne « État » dit laquelle.

> **10 compétences de ludwing ne sont accessibles nulle part.** Elles s'apprennent, et rien — ni classe, ni état posable, ni équipement portable — n'ouvre leur type.

### Type 1 — capacité

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 14 | Roulette du Destin | 100 PM | script commun 1 | 51 | — |
| 1 | 17 | Parole n°3 Technique d'Inversion | 30 PM | soin PV *mana positive* `1500 + a.mat` | 42 | `<Parole>` `<NomOrigine: Technique d'Inversion>` ⚠ `<Style: garde>` |
| 1 | 111 | Arme d'Ombre | 12 PM | script commun 22 | 415 | `<ParoleL: 3>` `<Ombre>` |
| 1 | 112 | Âme d'Ombre | 12 PM | pose « Malédiction Ancienne » 100% | 415 | `<ParoleL: 3>` `<Ombre>` |
| 1 | 141 | Parole n°2 Moisson des Âmes | 15% PV | drain PV *mana spirituelle * `Math.floor(((a.atk + a.mat) * 2) * 1.352 * 200 / (200 + b.mdf))` | 468 | `<NomOrigine: Moisson des Âmes>` ⚠ |
| 1 | 461 | revelation | — | **coquille** — rien | 405 | `<Regard>` |
| 1 | 480 | VUE | — | **coquille** — rien | 417 | — |
| 4 | 1082 | Main Chaude | 14 PM | soin PV `Math.floor(a.mat * 4)` | 41 | `<Voie: source>` |
| 5 | 158 | Parole n°2 Trait Spectral | 7% PV | dégâts PV *mana spirituelle * `Math.floor(a.mat * 8.7 * 200 / (200 + b.mdf))` | 467 | `<ParoleL: 3>` `<NomOrigine: Trait Spectral>` ⚠ |
| 5 | 1227 | Remonter le Mana | — | soin PM `Math.floor(a.mat * 0.8)` | 407 | — |
| 6 | 1221 | Parole n°15 Ombre — Voile | 10 PM | dégâts PV *OMBRE* `Math.floor(a.mat * 6.6 * 200 / (200 + b.mdf))` | 445 | `<ParoleL: 3>` `<NomOrigine: Ombre — Voile>` ⚠ |
| 8 | 1163 | Parole n°15 Porte Entrouverte | 22 PM | dégâts PV *OMBRE* `Math.floor(a.mat * 11 * 200 / (200 + b.mdf))` · boost AGI 3t | 253 | `<NomOrigine: Porte Entrouverte>` ⚠ |
| 11 | 1083 | Remonter la Source | 32 PM | soin PV `Math.floor(a.mat * 3)` | 439 | `<Voie: source>` |
| 12 | 1114 | Tracer le Cercle | 22 PM | dégâts PV *mana positive* `Math.floor(a.mat * 9.8 * 200 / (200 + b.mdf))` | 413 | `<Voie: domaine>` |
| 13 | 1229 | Rompre le Silence | 16 PM | retire « 🔇 Silence Runique » 100% | 405 | — |
| 16 | 1201 | Parole n°11 Terre — Caillou | 10 PM | dégâts PV *TERRE* `Math.floor(a.mat * 7.7 * 200 / (200 + b.mdf))` | 203 | `<ParoleL: 3>` `<NomOrigine: Terre — Caillou>` ⚠ |
| 17 | 1084 | Cautère | 26 PM | soin PV `Math.floor(a.mat * 6)` · retire « 🩸 Hémorragie Profonde » 100% | 397 | `<Voie: source>` |
| 18 | 1222 | Parole n°15 Ombre — Tache | 22 PM | dégâts PV *OMBRE* `Math.floor(a.mat * 12 * 200 / (200 + b.mdf))` · pose « 🌑 Éclipse » 40% | 446 | `<ParoleL: 4>` `<NomOrigine: Ombre — Tache>` ⚠ |
| 20 | 1126 | Sept Éclats | 36 PT | dégâts PV *mana négative * `Math.floor(a.atk * 3.5 * 200 / (200 + b.def))` | 446 | `<Voie: flash>` |
| 22 | 1242 | Faire Douter | 24 PM | pose « 🌀 Vertige » 80% | 418 | — |
| 23 | 1166 | Ombre Prêtée | 24 PM | pose « 🛡 Posture de Fer » 100% · boost DÉF 4t | 260 | — |
| 24 | 1085 | Second Souffle | 45 PM | retire « mort » 100% · PV 50% +0 | 449 | `<Voie: source>` |
| 27 | 1115 | Territoire Scellé | 44 PM | dégâts PV *mana positive* `Math.floor(a.mat * 14 * 200 / (200 + b.mdf))` · pose « ⛓ Ancrage » 40% | 415 | `<Voie: domaine>` |
| 29 | 1223 | Parole n°15 Ombre — Nappe | 34 PM | dégâts PV *OMBRE* `Math.floor(a.mat * 12 * 200 / (200 + b.mdf))` | 447 | `<ParoleL: 4>` `<NomOrigine: Ombre — Nappe>` ⚠ |
| 30 | 1086 | Sève | 30 PM | boost PVmax 6t · boost MDF 6t | 391 | `<Voie: source>` |
| 30 | 1244 | Relever | 50 PM | retire « mort » 100% · PV 40% +0 | 449 | — |
| 32 | 1080 | Écume | 15 PM | dégâts PV *EAU* `Math.floor(a.atk * 10 * 200 / (200 + b.def))` · malus AGI 3t | 393 | `<Voie: onde>` |
| 33 | 1127 | Le Noir se Répand | 42 PM | dégâts PV *OMBRE* `Math.floor(a.atk * 10 * 200 / (200 + b.def))` · pose « 🌑 Éclipse » 50% | 448 | `<Voie: flash>` |
| 33 | 1168 | Lame d'Envers | 30 PM | dégâts PV *OMBRE* `Math.floor((a.atk + a.mat) * 21 * 100 / (200 + b.def + b.mdf))` | 250 | — |
| 37 | 1087 | Prendre sur Soi | 22 PM | soin PV `Math.floor(a.mat * 5)` | 433 | `<Voie: source>` |
| 37 | 1202 | Parole n°11 Terre — Éclat | 22 PM | dégâts PV *TERRE* `Math.floor(a.mat * 14 * 200 / (200 + b.mdf))` · pose « ⛓ Ancrage » 40% | 203 | `<ParoleL: 4>` `<NomOrigine: Terre — Éclat>` ⚠ |
| 38 | 1199 | Parole n°10 Vent — Tempête | 46 PM | dégâts PV *VENT* `Math.floor(a.mat * 22 * 200 / (200 + b.mdf))` · pose « 🌀 Vertige » 70% | 192 | `<ParoleL: 5>` `<NomOrigine: Vent — Tempête>` ⚠ |
| 40 | 1224 | Parole n°15 Ombre — Nuit | 46 PM | dégâts PV *OMBRE* `Math.floor(a.mat * 22 * 200 / (200 + b.mdf))` · pose « 🌑 Éclipse » 70% | 448 | `<ParoleL: 5>` `<NomOrigine: Ombre — Nuit>` ⚠ |
| 41 | 1116 | La Règle du Lieu | 50 PM | dégâts PV *mana positive* `Math.floor(a.mat * 20 * 200 / (200 + b.mdf))` · pose « 🔇 Silence Runique » 60% | 416 | `<Voie: domaine>` |
| 43 | 1088 | Rendre le Mana | 30 PT | soin PM `Math.floor(a.mat * 1.2)` | 407 | `<Voie: source>` |
| 44 | 1209 | Parole n°12 Foudre — Orage | 46 PM | dégâts PV *FOUDRE* `Math.floor(a.mat * 22 * 200 / (200 + b.mdf))` · pose « 🌀 Vertige » 70% | 384 | `<ParoleL: 5>` `<NomOrigine: Foudre — Orage>` ⚠ |
| 47 | 1128 | Contre-Éclat | 34 PT | dégâts PV *mana négative * `Math.floor(a.atk * 19 * 200 / (200 + b.def) * (1 + (a.mhp - a.hp) / a.mhp * 0.8))` | 453 | `<Voie: flash>` `<Nerf 2026-09-25: a.atk * 25 * → a.atk * 19 * — ×3,10 en moyenne pour 34 PT>` ⚠ |
| 50 | 1089 | La Source Entière | 70 PM | soin PV `Math.floor(a.mat * 7)` · retire « 🩸 Hémorragie Profonde » 100% · retire « 🫀 Ravage » 100% | 440 | `<Voie: source>` |
| 50 | 1238 | Marquer la Cible | 16 PM | pose « 👁 Marqué » 100% | 419 | — |
| 52 | 1225 | Parole n°15 Ombre — Fond | 62 PM | dégâts PV *OMBRE* `Math.floor(a.mat * 21 * 200 / (200 + b.mdf))` · pose « 🌑 Éclipse » 50% | 457 | `<ParoleL: 5>` `<NomOrigine: Ombre — Fond>` ⚠ |
| 53 | 1172 | Ombres Multiples | 38 PM | dégâts PV *OMBRE* `Math.floor((a.atk + a.mat) * 11 * 100 / (200 + b.def + b.mdf))` | 252 | — |
| 56 | 1117 | Cloison | 30 PM | pose « 🛡 Posture de Fer » 100% · boost MDF 4t | 437 | `<Voie: domaine>` |
| 58 | 1203 | Parole n°11 Terre — Pilier | 34 PM | dégâts PV *TERRE* `Math.floor(a.mat * 14 * 200 / (200 + b.mdf))` | 204 | `<ParoleL: 4>` `<NomOrigine: Terre — Pilier>` ⚠ |
| 60 | 1129 | Ce Qui Ne Devrait Pas Toucher | 64 PT | dégâts PV *mana négative * `Math.floor(a.atk * 26 * 200 / (200 + b.def))` | 456 | `<Voie: flash>` `<Nerf 2026-09-25: a.atk * 36 * → a.atk * 26 * — ×4,70 en moyenne (pic ×7,9) pour 64 PT>` ⚠ |

### Type 2 — Spéciale

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 11 | Point de Rupture | 20 PT | dégâts PV *mana négative * `Math.floor(a.atk * 14 * 200 / (200 + b.def))` | 64 | `<Parole>` `<Trait: rupture>` `<Interdit>` |
| 1 | 13 | Vannes | 10 PM | pose « Enragé » 30% · malus MDF 2t | 36 | — |
| 1 | 65 | copie d'Ame | 12 PM | **coquille** — rien | 51 | `<Parole: origine>` |
| 1 | 66 | Lotus des Ténèbres | 10 PM | dégâts PV *OMBRE* `Math.floor(a.atk * 8.7 * 200 / (200 + b.def))` · pose « Aveuglé » 100% | 257 | `<ParoleL: 3>` `<Ombre>` |
| 1 | 68 | Parole n°15 Annihilation des Ténèbres | 10 PM + 20 PT | dégâts PV *OMBRE* `a.mat * 10` · pose « Muet » 100% | 258 | `<ParoleL: 3>` `<SceauMagie>` `<Ombre>` `<NomOrigine: Annihilation des Ténèbres>` ⚠ |
| 1 | 69 | Porte de l'Envers | 12 PM | pose « Contre Total » 100% | 253 | `<ParoleL: 3>` `<Trait: porte>` |
| 1 | 70 | Aspiration des Âmes Damnées | 8% PV | soin PV *mana spirituelle * `a.mhp * 0.50` · pose « Déstabilisé » 100% · script commun 16 | 434 | `<ParoleL: 4>` `<AspirationDamnees>` |
| 1 | 99 | « Ohhh, lève-toi ! » | 50 PM | PV 100% +1000 · boost PVmax 2t | 49 | — |
| 1 | 110 | Abri de l'Envers | 12 PM | pose « dimension d'ombre » 100% | 537 | `<Parole: origine>` `<Trait: porte>` |
| 1 | 123 | Décharge Infinie | 15 PM | dégâts PV *AME * `Math.floor(a.atk * 8.7 * 200 / (200 + b.def))` | 364 | `<Parole: origine>` |
| 1 | 418 | Communion des Quatre (Escouade) | 80 PT | dégâts PV *AME * `$gameParty.aliveMembers().reduce(function(s,m){return s+m.atk+m.mat;},0) * 3` | 533 | `<Combo: 1,2,3,4>` `<ComboLien: 7>` |
| 1 | 453 | Parole n°7 Dévoreur d'Âmes | 50 PM + 30% PV | drain PV *AME * `a.atk*4 + a.mat*3 - b.mdf` | 532 | `<Ulti>` `<UltiColor: #9b5cff>` `<After Eval>` `<Parole: origine>` `<NomOrigine: Dévoreur d'Âmes>` ⚠ |
| 1 | 454 | Tout ou Rien | 40 PT | dégâts PV *mana négative * `((Math.random()<0.5)?(a.atk*12):(a.atk*2)) - b.def` | 487 | `<Ulti>` `<UltiColor: #c800ff>` `<After Eval>` `<Parole: origine>` |
| 35 | 811 | Parole n°15 Pluie de Lance du Styx | 26 PM | dégâts PV *OMBRE* `Math.floor(a.mat * 4.1 * 200 / (200 + b.mdf))` | 377 | `<Invocation: 3>` `<ParoleL: 4>` `<NomOrigine: Pluie de Lance du Styx>` ⚠ |
| 35 | 812 | Contre Totale | 22 PM | **coquille** — rien | 429 | `<ContreTotale>` |
| 43 | 1170 | Parole n°2 Le Symbole | 15% PV | dégâts PV *mana spirituelle * `Math.floor(a.mat * 26 * 200 / (200 + b.mdf))` · pose « ✨ Grâce Volée » 60% | 417 | `<NomOrigine: Le Symbole>` ⚠ |
| 58 | 1173 | Parole n°7 Ce Qu'il A Gardé | 68 PM | dégâts PV *AME * `Math.floor(a.mat * 36 * 200 / (200 + b.mdf))` | 447 | `<NomOrigine: Ce Qu'il A Gardé>` ⚠ `<Cooldown: 2>` |

### Type 3 — ult

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 71 | Royaume Impérial · le Domaine des Retours | 1000 PM | pose « 👑 Royaume Impérial » 100% | 415 | `<DomaineRoyal>` `<Ancien After Eval>` ⚠ `<Voie: domaine>` |
| 45 | 810 | ☠ Ténèbres Impériales | 60 PM | **coquille** — rien | 445 | `<RoyaumeImperial>` `<Parole: origine>` |

### ✘ Type 4 — JACKPOT  *(INVISIBLE)*

*INVISIBLE — seul chemin : état « JACKPOT » — que rien ne pose, hors d'atteinte*

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 47 | Rafale de Jetons | 8 PM | dégâts PV *Physique* `Math.floor((a.luk*3) * 1.203 * 200 / (200 + b.def))` | 16 | `<NoParole>` |
| 1 | 48 | Frappe Éclair | 6 PM | dégâts PV *Physique* `Math.floor((a.luk*4) * 1.315 * 200 / (200 + b.def))` | 35 | `<NoParole>` |
| 1 | 49 | Rush du Tambour | 14 PM | dégâts PV *Physique* `Math.floor((a.luk*5) * 1.114 * 200 / (200 + b.def))` | 111 | `<NoParole>` |
| 1 | 50 | Pari Téméraire | 10 PM | dégâts PV *Physique* `((Math.random()<0.5)?(a.luk*12):(a.luk*2)) - b.def` | 21 | `<NoParole>` `<Cooldown: 2>` |
| 1 | 51 | Danse de l'Euphorie | 12 PM | boost AGI 5t · boost ATQ 5t · boost CHA 5t | 40 | `<Parole: origine>` |

### ✘ Type 8 — invocation  *(INVISIBLE)*

*INVISIBLE — seul chemin : état « Royaume Impérial » — que rien ne pose, hors d'atteinte*

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 124 | Jugement des Défunts | 12 PM | dégâts PV *AME * `Math.floor(a.mat * 11 * 200 / (200 + b.mdf))` | 449 | `<Invocation: 3>` |
| 1 | 125 | Rappel des Âmes | 12 PM | dégâts PV *AME * `Math.floor(a.mat * 7 * 200 / (200 + b.mdf))` | 450 | `<Invocation: 2>` |

### Type 9 — ame

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 466 | Parole n°2 Aspiration d'Âme | 7% PV | drain PV *mana spirituelle * `Math.floor(a.mat * 14.55 * 200 / (200 + b.mdf))` | 434 | `<Ame>` `<NomOrigine: Aspiration d'Âme>` ⚠ |
| 3 | 1162 | Parole n°2 Prendre un Peu | 8% PV | drain PV *mana spirituelle * `Math.floor(a.mat * 14 * 200 / (200 + b.mdf))` | 434 | `<NomOrigine: Prendre un Peu>` ⚠ |
| 10 | 467 | Parole n°2 Chaîne d'Âmes | 9% PV | dégâts PV *mana spirituelle * `Math.floor(a.mat * 2.9 * 200 / (200 + b.mdf))` | 450 | `<Ame>` `<NomOrigine: Chaîne d'Âmes>` ⚠ |
| 13 | 1164 | Parole n°2 Chaîne Courte | 11% PV | dégâts PV *mana spirituelle * `Math.floor(a.mat * 11 * 200 / (200 + b.mdf))` | 450 | `<NomOrigine: Chaîne Courte>` ⚠ |
| 18 | 1165 | Parole n°7 Registre | 26 PM | dégâts PV *AME * `Math.floor(a.mat * 14 * 200 / (200 + b.mdf))` · pose « 👁 Marqué » 80% | 458 | `<NomOrigine: Registre>` ⚠ |
| 22 | 468 | Parole n°2 Dette d'Âme | 9% PV | drain PV *mana spirituelle * `Math.floor(a.mat * 14.55 * 200 / (200 + b.mdf))` | 458 | `<Ame>` `<Trait: ames>` `<NomOrigine: Dette d'Âme>` ⚠ |
| 28 | 1167 | Parole n°2 Il Se Sert | 12% PV | drain PV *mana spirituelle * `Math.floor(a.mat * 24 * 200 / (200 + b.mdf))` | 436 | `<NomOrigine: Il Se Sert>` ⚠ |
| 38 | 1169 | Parole n°7 Rappel | 42 PM | dégâts PV *AME * `Math.floor(a.mat * 23 * 200 / (200 + b.mdf))` | 449 | `<NomOrigine: Rappel>` ⚠ |
| 48 | 1171 | Parole n°7 Dette Ancienne | 56 PM | dégâts PV *AME * `Math.floor(a.mat * 33 * 200 / (200 + b.mdf))` · pose « 🫀 Ravage » 70% | 460 | `<NomOrigine: Dette Ancienne>` ⚠ `<Cooldown: 2>` |

### ◑ Type 11 — ombre d'épeé  *(à condition)*

*à condition : en équipant arme « Épée d'Ombre »*

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 115 | Frappe Aveuglante | 10 PM | dégâts PV *LUMIÈRE* `Math.floor(a.atk * 8.7 * 200 / (200 + b.def))` · pose « Aveuglé » 15% | 236 | `<Voie: forge>` |

### ◑ Type 12 — ombre de dague  *(à condition)*

*à condition : en équipant arme « Dague d'Ombre »*

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 116 | Rafale d'Ombre | 10 PM | dégâts PV *OMBRE* `Math.floor(a.atk * 4.4 * 200 / (200 + b.def))` | 249 | `<Voie: onde>` |

### ◑ Type 13 — ombre de hache  *(à condition)*

*à condition : en équipant arme « Hache des Ténèbres »*

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 118 | Fendoir Obscur | 22 PM + 20 PT | dégâts PV *OMBRE* `Math.floor(a.atk * 5.2 * 200 / (200 + b.def))` | 250 | `<Voie: forge>` |

### ✘ Type 14 — ombre de katana  *(INVISIBLE)*

*INVISIBLE — seul chemin : état « katana de la mort » — que rien ne pose, hors d'atteinte*

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 122 | Danse Macabre | 8% PV | dégâts PV *mana spirituelle * `Math.floor(a.atk * 2.2 * 200 / (200 + b.def))` | 468 | `<Voie: onde>` |

### ◑ Type 15 — ombre de lance  *(à condition)*

*à condition : en équipant arme « Lance des Abysses »*

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 121 | Parole n°15 Geyser Abyssal | 22 PM + 20 PT | dégâts PV *OMBRE* `Math.floor(((a.atk + a.mat) * 2.5) * 1.173 * 200 / (200 + b.def))` | 84 | `<Voie: onde>` `<NomOrigine: Geyser Abyssal>` ⚠ |

### ✘ Type 16 — ombre de griffe  *(INVISIBLE)*

*INVISIBLE — seul chemin : état « griffe hurleur d'ame » — que rien ne pose, hors d'atteinte*

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 120 | Déchirure d'Âme | 8% PV | drain PV *mana spirituelle * `Math.floor(a.atk * 14.55 * 200 / (200 + b.def))` | 467 | `<FrappeAme>` ⚠ |

### ✘ Type 17 — ombre de arc  *(INVISIBLE)*

*INVISIBLE — seul chemin : état « arc d'ombre » — que rien ne pose, hors d'atteinte*

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 117 | Tir d'Ombre | 10 PM | dégâts PV *OMBRE* `a.atk * 2.5` | 251 | `<Voie: miroir>` |

### ◑ Type 18 — ombre de arme a feu  *(à condition)*

*à condition : en équipant arme « Fusil à Pompe Éternel »*

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 119 | Balle Corrompue | 15 PT | dégâts PV *mana négative * `Math.floor(a.atk * 8.7 * 200 / (200 + b.def))` · pose « Mana Sombre » 50% | 253 | `<Voie: vide>` |

### Type 25 — Combo

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 20 | 1304 | La Lame et son Ombre | — | dégâts PV *Physique* `Math.floor(a.atk * 28.75 * 200 / (200 + b.def) + a.mat * 26.45 * 200 / (200 + b.mdf))` | 250 | `<unison item actors: 1, 3>` `<unison item actor learn: t, t>` `<unison item actor mp cost: 0, 42>` `<unison item actor tp cost: 30, 0>` `<unison item atk actors: 1>` `<unison item mat actors: 3>` `<Multiple Elements: 15>` `<Combo: JOKO 2026-10-18 — somme des deux coups de référence × 1.15>` |
| 20 | 1306 | Nuit d'Hiver | — | dégâts PV *GLACE* `Math.floor(a.mat * 54.05 * 200 / (200 + b.mdf))` | 258 | `<unison item actors: 2, 3>` `<unison item actor learn: t, t>` `<unison item actor mp cost: 62, 42>` `<unison item mat actors: 2, 3>` `<Multiple Elements: 15>` `<Combo: JOKO 2026-10-18 — somme des deux coups de référence × 1.15>` `<Cooldown: 2>` |
| 20 | 1308 | Crépuscule | — | dégâts PV *OMBRE* `Math.floor(a.mat * 54.05 * 200 / (200 + b.mdf))` | 256 | `<unison item actors: 3, 4>` `<unison item actor learn: t, t>` `<unison item actor mp cost: 42, 40>` `<unison item mat actors: 3, 4>` `<Multiple Elements: 14>` `<Combo: JOKO 2026-10-18 — somme des deux coups de référence × 1.15>` `<Cooldown: 2>` |

### Ses états passifs

| # | État | Traits | Ouvre |
|---|---|---|---|
| 64 | normal | 0 **aucun : il ne fait rien** | — |

### Son Don dans l'équipement

| Genre | # | Nom | etypeId | Note |
|---|---|---|---|---|
| armure | 56 | Amulette Purifiante | 5 | `<Relic: antirot>` |
| armure | 72 | Éclat d'Amulette | 5 | `<Don: ludwing> · <Forme: objet> · <Palier: 1> · <DonDe: 3>` |
| armure | 73 | Amulette Naissante | 5 | `<Don: ludwing> · <Forme: objet> · <Palier: 2> · <DonDe: 3>` |
| armure | 74 | Amulette Résonante | 5 | `<Don: ludwing> · <Forme: objet> · <Palier: 3> · <DonDe: 3>` |
| armure | 75 | Vérité de l'Amulette | 5 | `<Don: ludwing> · <Forme: objet> · <Palier: 4> · <DonDe: 3>` |

---

## Aël — la Parole

| | |
|---|---|
| Classe | 4 · la Parole |
| Son unique Don | **l'Arc** *(arme)* → emplacement Arme (1) |
| Trait | miracle |
| Note de l'acteur | `<Passive State: 63> · <Mana: positif> · <VoieDefaut: miroir> · <Camp: lumiere> · <Trait: miracle>` |

### Ses branches

| | Type | Compétences | État |
|---|---|---|---|
| ✔ | 1 · capacité | 68 | ouvert |
| ✔ | 2 · Spéciale | 12 | ouvert |
| ✔ | 3 · ult | 8 | ouvert |
| ✔ | 20 · miracle | 1 | ouvert |
| ✔ | 23 · portes | 8 | ouvert |
| ✔ | 25 · Combo | 3 | ouvert |

### Type 1 — capacité

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 1 | Attaque | — | dégâts PV `Math.floor(a.atk * 4.2 * 200 / (200 + b.def))` · pose « état 0 ABSENT » 100% | arme | — |
| 1 | 4 | Double Attaque | — | dégâts PV `Math.floor(a.atk * 4.2 * 200 / (200 + b.def))` · pose « état 0 ABSENT » 100% | arme | `<Style: lame>` |
| 1 | 5 | Triple Attaque | — | dégâts PV `Math.floor(a.atk * 4.2 * 200 / (200 + b.def))` · pose « état 0 ABSENT » 100% | arme | `<Style: lame>` |
| 1 | 6 | Fuir | — | fuite spéciale | 51 | — |
| 1 | 8 | Parole n°3 Guérir | 5 PM | soin PV *mana positive* `200 + a.mat` | 41 | `<Parole>` `<NomOrigine: Guérir>` ⚠ |
| 1 | 12 | Parole n°2 Encouragement | 9% PV | soin PV *mana spirituelle * `400 + a.mat` · PM 20% +0 · PT +5 | 37 | `<ParoleL: 4>` `<NomOrigine: Encouragement>` ⚠ |
| 1 | 17 | Parole n°3 Technique d'Inversion | 30 PM | soin PV *mana positive* `1500 + a.mat` | 42 | `<Parole>` `<NomOrigine: Technique d'Inversion>` ⚠ `<Style: garde>` |
| 1 | 19 | Claquement du Verbe | 20 PM | pose « Aveuglé » 70% | 40 | `<ParoleL: 3>` |
| 1 | 20 | Regard Noir | 12 PM | pose « Confus » 30% · malus MDF 3t | 413 | `<ParoleL: 3>` |
| 1 | 21 | Parole n°3 Aura d'Espoir | 12 PM | boost DÉF 5t · PV 20% +0 | 34 | `<After Eval>` `<Parole: origine>` `<NomOrigine: Aura d'Espoir>` ⚠ |
| 1 | 23 | « Assez. » | 12 PM | fuite spéciale · PV 100% +0 · PM 100% +0 | 35 | `<ParoleL: 3>` |
| 1 | 28 | Concentration | 7% PV | boost AGI 2t · boost CHA 3t | 40 | `<NoParole>` |
| 1 | 29 | Recueillement | 15 PM | boost AGI 3t · boost CHA 1t | 485 | `<NoParole>` |
| 1 | 142 | Parole n°3 Bénédiction Stellaire | 28 PM | soin PV *mana positive* `320 + a.mat * 3` | 41 | `<ParoleL: 4>` `<NomOrigine: Bénédiction Stellaire>` ⚠ |
| 1 | 461 | revelation | — | **coquille** — rien | 405 | `<Regard>` |
| 1 | 474 | Parole n°3 « Qu'il pleuve. » | 18 PM | **coquille** — rien | 377 | `<Parole>` `<ParoleL: 3>` `<Appel: rain, 5>` `<NomOrigine: Qu'il pleuve.>` ⚠ |
| 3 | 1174 | Parole n°14 Trait Clair | 12 PM | dégâts PV *LUMIÈRE* `Math.floor(a.mat * 8.4 * 200 / (200 + b.mdf))` | 441 | `<ParoleL: 3>` `<NomOrigine: Trait Clair>` ⚠ |
| 4 | 1090 | Parade Juste | 14 PM | dégâts PV *Physique* `Math.floor(a.atk * 9.6 * 200 / (200 + b.def))` · pose « 🪞 Reflet » 40% | 2 | `<Voie: miroir>` |
| 5 | 166 | Parole n°14 Rayon Stellaire | 10 PM | dégâts PV *LUMIÈRE* `Math.floor(a.mat * 8.7 * 200 / (200 + b.mdf))` | 115 | `<ParoleL: 3>` `<NomOrigine: Rayon Stellaire>` ⚠ |
| 5 | 1231 | Voir Clair | 14 PM | retire « 🌑 Éclipse » 100% · boost CHA 4t | 417 | — |
| 6 | 1216 | Parole n°14 Lumière — Lueur | 10 PM | dégâts PV *LUMIÈRE* `Math.floor(a.mat * 6.6 * 200 / (200 + b.mdf))` | 409 | `<ParoleL: 3>` `<NomOrigine: Lumière — Lueur>` ⚠ |
| 8 | 475 | Parole n°3 « Que le ciel s'ouvre. » | 26 PM | **coquille** — rien | 483 | `<Parole>` `<ParoleL: 3>` `<Appel: storm, 5>` `<NomOrigine: Que le ciel s'ouvre.>` ⚠ |
| 8 | 1175 | Parole n°3 « Reste. » | 20 PM | dégâts PV *mana positive* `Math.floor(a.mat * 9 * 200 / (200 + b.mdf))` · pose « ⛓ Ancrage » 70% | 480 | `<ParoleL: 3>` `<NomOrigine: « Reste. »>` ⚠ |
| 10 | 167 | Parole n°3 Soin Mineur | 8 PM | soin PV *mana positive* `300 + a.mat*2` | 41 | `<ParoleL: 3>` `<NomOrigine: Soin Mineur>` ⚠ |
| 11 | 1091 | Renvoi Net | 28 PM | dégâts PV *mana positive* `Math.floor(a.atk * 13 * 200 / (200 + b.def))` | 440 | `<Voie: miroir>` |
| 12 | 1118 | Étau | 40 PM | dégâts PV *mana positive* `Math.floor(a.mat * 12 * 200 / (200 + b.mdf))` · malus AGI 4t | 414 | `<Voie: domaine>` |
| 13 | 1176 | Parole n°14 Volée Nommée | 26 PM | dégâts PV *LUMIÈRE* `Math.floor(a.mat * 5.6 * 200 / (200 + b.mdf))` | 242 | `<ParoleL: 4>` `<NomOrigine: Volée Nommée>` ⚠ |
| 13 | 1234 | Encourager | 26 PM | boost ATQ 4t · PT +20 | 408 | — |
| 14 | 476 | Parole n°3 « Qu'il neige. » | 22 PM | **coquille** — rien | 385 | `<Parole>` `<ParoleL: 3>` `<Appel: snow, 5>` `<NomOrigine: Qu'il neige.>` ⚠ |
| 15 | 168 | Parole n°14 Lumière Apaisante | 24 PM | soin PV *LUMIÈRE* `200 + a.mat*2` | 48 | `<ParoleL: 4>` `<NomOrigine: Lumière Apaisante>` ⚠ |
| 16 | 1196 | Parole n°10 Vent — Souffle | 10 PM | dégâts PV *VENT* `Math.floor(a.mat * 7.7 * 200 / (200 + b.mdf))` | 189 | `<ParoleL: 3>` `<NomOrigine: Vent — Souffle>` ⚠ |
| 17 | 1092 | Poser la Glace | 24 PM | pose « 🪞 Reflet » 100% · pose « 🛡 Posture de Fer » 100% | 439 | `<Voie: miroir>` |
| 18 | 1177 | Parole n°29 Flèche de Crépuscule | 32 PM | dégâts PV *Crépuscule* `Math.floor(a.mat * 16 * 200 / (200 + b.mdf))` | 334 | `<ParoleL: 4>` `<NomOrigine: Flèche de Crépuscule>` ⚠ |
| 18 | 1217 | Parole n°14 Lumière — Rayon | 22 PM | dégâts PV *LUMIÈRE* `Math.floor(a.mat * 12 * 200 / (200 + b.mdf))` · pose « 🌑 Éclipse » 40% | 410 | `<ParoleL: 4>` `<NomOrigine: Lumière — Rayon>` ⚠ |
| 20 | 169 | Bénédiction | 20 PM | boost MAT 4t · boost MDF 4t | 44 | `<ParoleL: 4>` |
| 20 | 1082 | Main Chaude | 14 PM | soin PV `Math.floor(a.mat * 4)` | 41 | `<Voie: source>` |
| 22 | 1235 | Serrer les Rangs | 30 PM | boost DÉF 5t · boost MDF 5t | 439 | — |
| 23 | 1178 | « Debout. » | 44 PM | retire « mort » 100% · PV 60% +0 | 41 | `<ParoleL: 4>` |
| 24 | 1093 | Angle Mort | 22 PM | dégâts PV *Physique* `Math.floor(a.atk * 13 * 200 / (200 + b.def))` | 419 | `<Voie: miroir>` |
| 25 | 170 | Parole n°3 Comète | 20 PM | dégâts PV *mana positive* `Math.floor(a.mat * 17 * 200 / (200 + b.mdf))` | 346 | `<ParoleL: 4>` `<NomOrigine: Comète>` ⚠ |
| 27 | 1119 | Verdict du Domaine | 52 PM | dégâts PV *LUMIÈRE* `Math.floor(a.mat * 19 * 200 / (200 + b.mdf))` · pose « ⚖ Verdict » 70% | 412 | `<Voie: domaine>` |
| 28 | 1179 | Halo | 34 PM | boost DÉF 5t · boost MDF 5t | 437 | `<ParoleL: 4>` |
| 29 | 1218 | Parole n°14 Lumière — Colonne | 34 PM | dégâts PV *LUMIÈRE* `Math.floor(a.mat * 12 * 200 / (200 + b.mdf))` | 411 | `<ParoleL: 4>` `<NomOrigine: Lumière — Colonne>` ⚠ |
| 30 | 171 | Purification | 14 PM | purge malus PVmax · purge malus PMmax · purge malus ATQ · purge malus DÉF · purge malus MAT · purge malus MDF · purge malus AGI · purge malus CHA | 48 | — |
| 30 | 1094 | Double Reflet | 26 PM | dégâts PV *mana positive* `Math.floor(a.atk * 8.5 * 200 / (200 + b.def))` | 369 | `<Voie: miroir>` |
| 30 | 1245 | Repos Court | 40 PM | soin PV `Math.floor(a.mat * 2.5)` · PV 15% +0 | 41 | — |
| 32 | 1081 | Le Reflux Complet | 60 PM | dégâts PV *EAU* `Math.floor(a.atk * 32 * 200 / (200 + b.def) * (1 + (a.mhp - a.hp) / a.mhp * 0.8))` | 426 | `<Voie: onde>` `<Cooldown: 2>` |
| 33 | 1083 | Remonter la Source | 32 PM | soin PV `Math.floor(a.mat * 3)` | 439 | `<Voie: source>` |
| 33 | 1180 | Parole n°3 « Assez. » | 38 PM | dégâts PV *mana positive* `Math.floor(a.mat * 14 * 200 / (200 + b.mdf))` · malus ATQ 4t | 411 | `<ParoleL: 4>` `<NomOrigine: « Assez. »>` ⚠ |
| 35 | 172 | Parole n°14 Pluie d'Étoiles | 28 PM + 25 PT | dégâts PV *LUMIÈRE* `Math.floor(a.mat * 9.3 * 200 / (200 + b.mdf))` | 99 | `<ParoleL: 4>` `<NomOrigine: Pluie d'Étoiles>` ⚠ |
| 37 | 1095 | Rendre la Monnaie | 32 PM | dégâts PV *mana positive* `Math.floor(a.atk * 20 * 200 / (200 + b.def) * (1 + (a.mhp - a.hp) / a.mhp * 0.8))` | 412 | `<Voie: miroir>` |
| 37 | 1197 | Parole n°10 Vent — Rafale | 22 PM | dégâts PV *VENT* `Math.floor(a.mat * 14 * 200 / (200 + b.mdf))` · pose « 🌀 Vertige » 40% | 190 | `<ParoleL: 4>` `<NomOrigine: Vent — Rafale>` ⚠ |
| 38 | 1181 | Parole n°14 Pluie Nommée | 42 PM | dégâts PV *LUMIÈRE* `Math.floor(a.mat * 11 * 200 / (200 + b.mdf))` | 243 | `<ParoleL: 5>` `<NomOrigine: Pluie Nommée>` ⚠ |
| 38 | 1200 | Parole n°10 Vent — Ouragan | 62 PM | dégâts PV *VENT* `Math.floor(a.mat * 18 * 200 / (200 + b.mdf))` · pose « 🌀 Vertige » 50% | 193 | `<ParoleL: 5>` `<NomOrigine: Vent — Ouragan>` ⚠ |
| 40 | 1219 | Parole n°14 Lumière — Aube | 46 PM | dégâts PV *LUMIÈRE* `Math.floor(a.mat * 22 * 200 / (200 + b.mdf))` · pose « 🌑 Éclipse » 70% | 412 | `<ParoleL: 5>` `<NomOrigine: Lumière — Aube>` ⚠ |
| 41 | 1120 | Frontière | 18 PM | pose « 🪞 Reflet » 100% · boost DÉF 4t | 439 | `<Voie: domaine>` |
| 43 | 1096 | Face à Face | 30 PM | dégâts PV *mana positive* `Math.floor((a.atk + a.mat) * 17 * 100 / (200 + b.def + b.mdf))` · malus ATQ 4t | 364 | `<Voie: miroir>` |
| 43 | 1182 | Parole n°3 Le Mot Juste | 40 PM | dégâts PV *mana positive* `Math.floor(a.mat * 24 * 200 / (200 + b.mdf))` | 417 | `<ParoleL: 5>` `<NomOrigine: Le Mot Juste>` ⚠ |
| 44 | 1210 | Parole n°12 Foudre — Ciel Ouvert | 62 PM | dégâts PV *FOUDRE* `Math.floor(a.mat * 18 * 200 / (200 + b.mdf))` · pose « 🌀 Vertige » 50% | 64 | `<ParoleL: 5>` `<NomOrigine: Foudre — Ciel Ouvert>` ⚠ |
| 47 | 1084 | Cautère | 26 PM | soin PV `Math.floor(a.mat * 6)` · retire « 🩸 Hémorragie Profonde » 100% | 397 | `<Voie: source>` |
| 48 | 1183 | Parole n°14 Lumière Tenue | 46 PM | dégâts PV *LUMIÈRE* `Math.floor(a.mat * 24 * 200 / (200 + b.mdf))` · pose « 🌑 Éclipse » 50% | 443 | `<ParoleL: 4>` `<NomOrigine: Lumière Tenue>` ⚠ |
| 50 | 1097 | Le Renvoi Total | 62 PM | dégâts PV *mana positive* `Math.floor((a.atk + a.mat) * 28 * 100 / (200 + b.def + b.mdf))` · pose « 🪞 Reflet » 100% | 432 | `<Voie: miroir>` |
| 50 | 1240 | Éteindre | 20 PM | malus ATQ 4t · malus MAT 4t | 393 | — |
| 52 | 1220 | Parole n°14 Lumière — Midi | 62 PM | dégâts PV *LUMIÈRE* `Math.floor(a.mat * 21 * 200 / (200 + b.mdf))` · pose « 🌑 Éclipse » 50% | 441 | `<ParoleL: 5>` `<NomOrigine: Lumière — Midi>` ⚠ |
| 53 | 1184 | Parole n°29 Flèche Miracle | 54 PM | dégâts PV *Crépuscule* `Math.floor(a.mat * 34 * 200 / (200 + b.mdf))` | 444 | `<ParoleL: 5>` `<NomOrigine: Flèche Miracle>` ⚠ `<Cooldown: 2>` |
| 56 | 1121 | Le Domaine Entier | 70 PM | dégâts PV *mana positive* `Math.floor(a.mat * 26 * 200 / (200 + b.mdf))` | 441 | `<Voie: domaine>` `<Cooldown: 2>` `<Nerf 2026-09-25: a.mat * 33 * → a.mat * 26 * — était au-dessus de ×2,5 la médiane du héros contre le boss médian>` ⚠ |
| 58 | 1198 | Parole n°10 Vent — Bourrasque | 34 PM | dégâts PV *VENT* `Math.floor(a.mat * 14 * 200 / (200 + b.mdf))` | 191 | `<ParoleL: 4>` `<NomOrigine: Vent — Bourrasque>` ⚠ |
| 60 | 1085 | Second Souffle | 45 PM | retire « mort » 100% · PV 50% +0 | 449 | `<Voie: source>` |

### Type 2 — Spéciale

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 13 | Vannes | 10 PM | pose « Enragé » 30% · malus MDF 2t | 36 | — |
| 1 | 22 | « Debout ! » — l'Appel | 50 PM | PV 100% +1000 · boost PVmax 2t | 49 | `<ParoleL: 4>` |
| 1 | 101 | Parole n°3 « Viens. » — l'Attraction | 27 PM | dégâts PV *mana positive* `Math.floor(a.mat * 5.7 * 200 / (200 + b.mdf))` | 481 | `<Pre-Damage Eval>` `<Post-Damage Eval>` `<ParoleL: 4>` `<Trait: verbe>` `<NomOrigine: « Viens. » — l'Attraction>` ⚠ |
| 1 | 102 | Parole n°3 « Pars. » — la Répulsion | 20 PM | dégâts PV *mana positive* `a.mat * 8` | 480 | `<Pre-Damage Eval>` `<Post-Damage Eval>` `<ParoleL: 3>` `<Trait: verbe>` `<NomOrigine: « Pars. » — la Répulsion>` ⚠ `<Cooldown: 2>` |
| 1 | 103 | Parole n°3 Siphon Fébrile | 10 PM | dégâts PV *mana positive* `Math.floor(a.mat * 8.7 * 200 / (200 + b.mdf))` | 416 | `<Post-Damage Eval>` `<NomOrigine: Siphon Fébrile>` ⚠ |
| 1 | 104 | Parole n°3 Soin Fluctuant | 16 PM | soin PV *mana positive* `(a.mat * 3) * (Math.max(5, $gameVariables.value(14)) / 10)` | 246 | `<Post-Damage Eval>` `<ParoleL: 4>` `<NomOrigine: Soin Fluctuant>` ⚠ |
| 1 | 105 | Transfusion d'Âme Blanche | 30 PM | soin PV *AME * `b.mhp` | 349 | `<Pre-Damage Eval>` `<Post-Damage Eval>` `<Parole: origine>` |
| 1 | 106 | Parole n°3 Fils de Mana Pur | 10 PM | dégâts PV *mana positive* `a.mat * 1.5` | 416 | `<Post-Damage Eval>` `<NomOrigine: Fils de Mana Pur>` ⚠ |
| 1 | 107 | Geyser d'Éclats | 12 PM | **coquille** — rien | 405 | `<Post-Damage Eval>` `<ParoleL: 3>` |
| 1 | 414 | Parole n°3 Verdict Stellaire (Duo) | 30 PM | dégâts PV *mana positive* `(a.mat + $gameActors.actor(4).mat) * 4 - b.mdf*1.5` | 481 | `<Combo: 2,4>` `<ComboLien: 3>` `<NomOrigine: Verdict Stellaire (Duo)>` ⚠ |
| 1 | 416 | Parole n°14 Aube Ardente (Duo) | 30 PT | dégâts PV *LUMIÈRE* `(a.mat + $gameActors.actor(1).atk) * 4 - b.mdf` | 243 | `<Combo: 4,1>` `<ComboLien: 3>` `<NomOrigine: Aube Ardente (Duo)>` ⚠ |
| 1 | 460 | Parole n°3 Élan d'Espoir | 30 PM | dégâts PV *mana positive* `Math.floor(a.mat * 8.7 * 200 / (200 + b.mdf))` | 41 | `<ParoleL: 4>` `<NomOrigine: Élan d'Espoir>` ⚠ |

### Type 3 — ult

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 457 | Parole n°14 Éclat de Conviction | 80 PM + 20% PV | dégâts PV *LUMIÈRE* `Math.floor(a.mat * 6.7 * 200 / (200 + b.mdf))` | 245 | `<Ulti>` `<UltiColor: #ffd54a>` `<After Eval>` `<Parole: origine>` `<NomOrigine: Éclat de Conviction>` ⚠ |
| 20 | 819 | Parole n°3 le Verbe qui Défait | 32 PM | dégâts PV *mana positive* `Math.floor(a.mat * 3.4 * 200 / (200 + b.mdf))` | 458 | `<ParoleL: 4>` `<SceauMagie>` `<NomOrigine: le Verbe qui Défait>` ⚠ |
| 30 | 477 | Parole n°12 le Ciel Ouvert | 96 PM | dégâts PV *FOUDRE* `Math.floor(a.mat * 32 * 200 / (200 + b.mdf))` | 64 | `<Parole>` `<Incantation: 2>` `<Ciel: storm>` `<CTB Speed: -50%>` `<NomOrigine: le Ciel Ouvert>` ⚠ `<Cooldown: 3>` |
| 30 | 820 | Parole n°7 Syllabe de la Fin | 38 PM | dégâts PV *AME * `Math.floor(a.mat * 14 * 200 / (200 + b.mdf))` | 460 | `<ParoleL: 4>` `<NomOrigine: Syllabe de la Fin>` ⚠ |
| 36 | 478 | Parole n°14 Plein Midi | 92 PM | dégâts PV *LUMIÈRE* `Math.floor(a.mat * 38 * 200 / (200 + b.mdf))` | 441 | `<Parole>` `<Incantation: 2>` `<Ciel: none>` `<CTB Speed: -50%>` `<NomOrigine: Plein Midi>` ⚠ `<Cooldown: 3>` |
| 45 | 818 | ✴ la Parole Originelle | 60 PM | **coquille** — rien | 441 | `<Ultime: parole>` |
| 58 | 1185 | Parole n°3 La Parole Tenue | 66 PM | dégâts PV *mana positive* `Math.floor(a.mat * 38 * 200 / (200 + b.mdf))` | 412 | `<ParoleL: 5>` `<NomOrigine: La Parole Tenue>` ⚠ `<Cooldown: 2>` |
| 70 | 479 | Parole n°3 Celle Qu'on Ne Dit Qu'une Fois | 180 PM | dégâts PV *mana positive* `Math.floor(a.mat * 55 * 200 / (200 + b.mdf))` | 441 | `<Parole>` `<Incantation: 3>` `<Apres: surcharge>` `<Cooldown: 5>` `<CTB Speed: -70%>` `<NomOrigine: Celle Qu'on Ne Dit Qu'une Fois>` ⚠ |

### Type 20 — miracle

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 40 | Yin et Yang du Mana | 100 PM | dégâts PV *mana positive* `(a.mp * 2) * ($gameVariables.value(14) / 5)` | 481 | `<Pre-Damage Eval>` `<Post-Damage Eval>` `<ParoleL: 5>` |

### Type 23 — portes

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 1 | 1273 | Porte — le Voile | 12 PM | pose « Voilé » 100% | 35 | `<HorsFamille>` |
| 1 | 1279 | Le Contrat | — | **coquille** — rien | 40 | `<Contrat>` `<HorsFamille>` |
| 1 | 1280 | Contrat Forcé | — | **coquille** — rien | 58 | `<ContratForce>` `<HorsFamille>` |
| 8 | 1278 | Porte — l'Allègement | 10 PM | pose « Allégé » 100% | 51 | `<HorsFamille>` |
| 15 | 1274 | Porte — l'Oubli | 15 PM | pose « Sans Volonté » 100% | 55 | `<HorsFamille>` |
| 25 | 1276 | Porte — les Pieux de Cristal | 20 PM | dégâts PV *mana positive* `Math.floor(a.mat * 9)` · pose « Cristallisé » 30% | 72 | `<Cooldown: 2>` `<HorsFamille>` |
| 35 | 1275 | Porte — le Gouffre | 18 PM | dégâts PV `Math.floor(a.mat * 16 * 200 / (200 + b.mdf * 0.5))` | 102 | `<Cooldown: 2>` `<HorsFamille>` |
| 50 | 1277 | Porte — la Fermeture | 30 PM | **coquille** — rien | 101 | `<PorteFermee: 3>` `<Cooldown: 5>` `<HorsFamille>` |

### Type 25 — Combo

| Nv | # | Nom | Coût | Ce que ça fait | Anim | Balises |
|---|---|---|---|---|---|---|
| 20 | 1305 | Feu Attisé | — | dégâts PV *FEU* `Math.floor(a.atk * 12.65 * 200 / (200 + b.def) + a.mat * 27.6 * 200 / (200 + b.mdf))` | 167 | `<unison item actors: 1, 4>` `<unison item actor learn: t, t>` `<unison item actor mp cost: 35, 46>` `<unison item atk actors: 1>` `<unison item mat actors: 4>` `<Multiple Elements: 10>` `<Combo: JOKO 2026-10-18 — somme des deux coups de référence × 1.15>` |
| 20 | 1307 | Ciel d'Orage | — | dégâts PV *FOUDRE* `Math.floor(a.mat * 51.75 * 200 / (200 + b.mdf))` | 219 | `<unison item actors: 2, 4>` `<unison item actor learn: t, t>` `<unison item actor mp cost: 62, 46>` `<unison item mat actors: 2, 4>` `<Multiple Elements: 14>` `<Combo: JOKO 2026-10-18 — somme des deux coups de référence × 1.15>` |
| 20 | 1308 | Crépuscule | — | dégâts PV *OMBRE* `Math.floor(a.mat * 54.05 * 200 / (200 + b.mdf))` | 256 | `<unison item actors: 3, 4>` `<unison item actor learn: t, t>` `<unison item actor mp cost: 42, 40>` `<unison item mat actors: 3, 4>` `<Multiple Elements: 14>` `<Combo: JOKO 2026-10-18 — somme des deux coups de référence × 1.15>` `<Cooldown: 2>` |

### Ses états passifs

| # | État | Traits | Ouvre |
|---|---|---|---|
| 63 | normal | 0 **aucun : il ne fait rien** | — |

### Son Don dans l'équipement

| Genre | # | Nom | etypeId | Note |
|---|---|---|---|---|
| arme | 4 | Arc | 1 | `<Image d'arme: Bow Light> <!-- auto -->` |
| arme | 32 | Arc en or | 1 | `<Image d'arme: Bow Base> <!-- auto -->` |
| arme | 33 | Arc en fer | 1 | `<Image d'arme: Bow Base> <!-- auto -->` |
| arme | 34 | Arc en Diamant | 1 | `<Image d'arme: Bow Base> <!-- auto -->` |
| arme | 35 | Arc en platine | 1 | `<Image d'arme: Bow Base> <!-- auto -->` |
| arme | 36 | Arc de lumière | 1 | `<Image d'arme: Bow Base> <!-- auto -->` |
| arme | 70 | Arc d'Ombre | 1 | `<Image d'arme: Sword Dark> <!-- auto -->` |
| arme | 112 | Arc de Fer | 1 | `<Image d'arme: Bow Light> <!-- auto -->` |
| arme | 113 | Arc d'Acier | 1 | `<Image d'arme: Bow Yellow> <!-- auto -->` |
| arme | 114 | Arc d'Argent | 1 | `<Image d'arme: Bow Yellow> <!-- auto -->` |
| arme | 115 | Arc de Mithril | 1 | `<Image d'arme: Bow Yellow> <!-- auto -->` |
| arme | 116 | Arc de Cristal | 1 | `<Image d'arme: Bow Yellow> <!-- auto -->` |

*… et 5 autres pièces portant ce nom.*

---

## L'encre morte — les balises que personne ne lit

Ces balises sont écrites dans les notes des compétences des quatre héros, et **aucun**
fichier de `js/plugins/` n'en cherche le nom. Elles ne produisent aucun effet aujourd'hui.

La colonne de droite fait la différence entre deux cas qu'il ne faut pas confondre :

- **dort dans `X.js`** — le lecteur existe, il est resté dans `_ancien_projet/`. La
  mécanique a été écrite ; elle a été perdue lors du commit « projet vierge ». Elle se
  rebranche en remontant le fichier ;
- **étiquette** — aucun plugin, ni actif ni endormi, ne lit ce nom. Ce n'est pas un
  défaut : c'est une note de travail posée dans le fichier (un nom d'origine gardé
  après un renommage, par exemple). On n'y touche pas.

| Balise | Compétences | Son lecteur | Exemples |
|---|---|---|---|
| `<NomOrigine>` | 120 | **étiquette** — jamais lue nulle part | Vesper #9 Parole n°8 Feu · Vesper #10 Parole n°12 Étincelle … |
| `<Nerf 2026-09-25>` | 13 | **étiquette** — jamais lue nulle part | Vesper #1068 Le Point Final · Vesper #1069 Marteau à Deux Mains … |
| `<AvatarGarde>` | 1 | **étiquette** — jamais lue nulle part | Korrah #1252 Le Torse Se Referme |
| `<Ancien After Eval>` | 1 | **étiquette** — jamais lue nulle part | ludwing #71 Royaume Impérial · le Domaine des Retours |
| `<FrappeAme>` | 1 | dort dans `ManaCodex`, `FrappeAme`, `PortesProgression` | ludwing #120 Déchirure d'Âme |

---

## Les jauges d'esprit et ce qu'elles posent

| Variable | Nom | Héros |
|---|---|---|
| 11 | maitrise de soi | Vesper |
| 12 | concentration | Korrah |
| 13 | LOU | ludwing |
| 14 | tianaa | Aël |
| 15 | Âmes Damnées | — compteur d'âmes — |

Les états pilotés par ces jauges, avec leur condition réelle :

| # | État | Traits | Condition |
|---|---|---|---|
| 22 | Éveil du Génie | 2 | `$gameVariables.value(12) >= 9;` |
| 23 | Distraite | 1 | `$gameVariables.value(12) >= 4 && $gameVariables.value(12) <= 5;` |
| 24 | Maladresse | 1 | `$gameVariables.value(12) === 2 \|\| $gameVariables.value(12) === 3;` |
| 25 | Méditation Profonde | 1 | `$gameVariables.value(12) <= 1;` |
| 28 | Folie Destructrice | 1 | `$gameVariables.value(11) <= 1;` |
| 29 | Agressivité Nocive | 2 | `$gameVariables.value(11) >= 2 && $gameVariables.value(11) <= 3;` |
| 30 | Sérénité Absolue | 2 | `$gameVariables.value(11) >= 9;` |
| 31 | Tension Latente | 2 | `$gameVariables.value(11) >= 4 && $gameVariables.value(11) <= 5;` |
| 34 | Maître Serein | 2 | `$gameVariables.value(13) >= 9;` |
| 35 | Agaçant | 2 | `$gameVariables.value(13) >= 4 && $gameVariables.value(13) <= 5;` |
| 36 | Insupportable | 2 | `$gameVariables.value(13) >= 2 && $gameVariables.value(13) <= 3;` |
| 37 | Souffre-Douleur | 4 | `$gameVariables.value(13) <= 1;` |
| 40 | Confiance Absolue | 4 | `$gameVariables.value(14) >= 9;` |
| 41 | Hésitation | 3 | `$gameVariables.value(14) === 4  \|\| $gameVariables.value(14) === 5;` |
| 42 | Complexe d'Infériorité | 3 | `$gameVariables.value(14) === 2 \|\| $gameVariables.value(14) === 3;` |
| 43 | Blocage Psychologique | 2 | `$gameVariables.value(14) <= 1;` |
| 46 | Surcharge d'Âme | 3 | `$gameVariables.value(15) >= 1 && $gameVariables.value(15) <= 3;` |
| 47 | Surcharge d'Âme (2) | 3 | `$gameVariables.value(15) >= 4 && $gameVariables.value(15) <= 7;` |
| 48 | Surcharge d'Âme (MAX) | 1 | `$gameVariables.value(15) >= 8;` |
| 61 | NORMALTHY | 0 **aucun** | `$gameVariables.value(11) >= 6 && $gameVariables.value(11) <= 8;` |
| 62 | normal | 0 **aucun** | `$gameVariables.value(12) >= 6 && $gameVariables.value(12) <= 8;` |
| 63 | normal | 0 **aucun** | `$gameVariables.value(14) >= 6 && $gameVariables.value(14) <= 8;` |
| 64 | normal | 0 **aucun** | `$gameVariables.value(13) >= 6 && $gameVariables.value(13) <= 8;` |
| 74 | Résonance Passive | 0 **aucun** | `$gameVariables.value(14) === 10;` |

---

## Le compte

- **389** entrées d'apprentissage sur les quatre héros ;
- **10** sont invisibles en jeu : aucun chemin n'ouvre leur type ;
- **12** s'ouvrent sous condition — elles marchent, la colonne « État » dit par où ;
- **27** ne font rien du tout (ni dégâts, ni effet) ;
- **5** balises différentes sont écrites sans qu'aucun plugin actif ne les lise,
  dont **1** dont le lecteur dort dans `_ancien_projet/` (et 4 simple(s) étiquette(s)).
