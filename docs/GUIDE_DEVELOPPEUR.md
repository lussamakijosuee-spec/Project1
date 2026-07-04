# LE GUIDE COMPLET — Les systèmes des Trois Sources

> **Tout ce qui existe dans le jeu** : chaque ID, chaque bonus, chaque malus, chaque commande, chaque script, chaque notetag. Copie-colle directement.
>
> - **Commande de plugin** → événement : `Commandes avancées → Commande de plugin`.
> - **Script** → événement : `Commandes avancées → Script`, ou **condition** : onglet 4 → Script.
> - **Notetag** → case **Note** d'un skill / acteur / classe / ennemi / armure.

---

# PARTIE A — LA RÉFÉRENCE (tous les IDs & tous les chiffres)

## A1. Les héros — clés, variables, facettes

| Acteur | ID | Clé script | Variable santé mentale | Facette (excès) |
|---|---|---|---|---|
| **Thylane** | 1 | `'thylane'` | **Var 11** | la Colère |
| **Neyssa** | 2 | `'neyssa'` | **Var 12** | la Concentration perdue |
| **Lou** | 3 | `'lou'` | **Var 13** | les Âmes (porteuse du stock) |
| **Tianna** | 4 | `'tianna'` | **Var 14** | le Doute / la Confiance |

Toutes les commandes acceptent la clé **ou** l'ID : `CORRUPTION add lou 10` = `CORRUPTION add 3 10`.

## A2. Variables & interrupteurs système

| Variable | Rôle |
|---|---|
| **11–14** | Santé mentale de chaque héros (jauge **1–10**) |
| **15** | **Stock d'âmes** (partagé, porté par Lou) — en gagner fait monter l'Errance |
| 90–91 | Utilisées par l'épilogue (fin de faction, pire corruption) |

Interrupteurs : aucun réservé par défaut. À créer toi-même : un pour la **Porte de Fusion** (à mettre dans `PortesProgression.fusionSwitch` **et** `FusionElements.switchId`), un pour le HUD triangle si tu utilises `hudSwitch`.

## A3. Les éléments (System.json)

| ID | Nom | Rôle | Chiffres attachés |
|---|---|---|---|
| 1 | Physique | arme / Objet Spirituel | — |
| 2 | mana spirituelle | **Âme** — le Symbole | usage offensif : **+1 Errance**, mise à mort : **+5** |
| 3 | mana positive | **Esprit** — la Parole | faiblit si santé mentale basse : phase 3 ×0.85 · 2 ×0.70 · 1 ×0.55 |
| 4 | mana négative | **Corps** — projeté | recul PV : **15 %** des dégâts infligés · +2 corruption/frappe |
| 5 | Mana Sombre | **Corps** — source brute | recul PV : **25 %** · +3 corruption/frappe |
| 6 | Mana Originel | Esprit — source brute | — |
| 7 | AME / Parfait | **Mana Pur** | **perce toute résistance** (taux forcé à 100 %) |
| 8–15 | Feu·Eau·Vent·Terre·Foudre·Glace·Lumière·Ombre | les 8 fondamentaux | fusionnables (voir A7-Fusion) |
| 16 | mana semi parfait | l'équilibre | perce aussi toute résistance |
| 17 | Vapeur | = Feu+Eau (8+9) | dérivé |
| 19 | Lave | = Feu+Terre (8+11) | dérivé |
| 20 | Plante | = Eau+Terre (9+11) | dérivé |
| 22 | Givre | = Eau+Glace (9+13) | dérivé |
| 23 | Métal | = Terre+Foudre (11+12) | dérivé |
| 29 | Crépuscule | = Lumière+Ombre (14+15) | dérivé |

## A4. Les skill types

| ID | Nom | Systèmes branchés |
|---|---|---|
| 1 | capacité | entraînement Esprit si coût PM + élément mana |
| 2 | Spéciale | idem |
| 3 | ult | **Paroles « origine »** automatiques (infaillibles) |
| 4 | JACKPOT · 5 BERSEK · 6 TIME | libres |
| 7 | MANA semi-parfait | réservé équilibre |
| 8 | invocation | `<Invocation: n>` dépense n âmes |
| 9 | ame | compte comme **Consommation** (Errance) + entraînement Âme |
| 10 | sang | libre (thème Corps) |
| 11–18 | ombre d'épée/dague/hache/katana/lance/griffe/arc/arme à feu | Maîtrise par arme |
| 19 | Arts Sereins | exemples des Voies |

## A5. Les états système — bonus/malus exacts

| ID | Nom | Effets chiffrés | Posé par |
|---|---|---|---|
| **181** | Frémissement | MAT ×0.9 · MDF ×0.9 | Corruption ≥ 40 (début de combat) |
| **182** | Fièvre | MAT ×0.8 · MDF ×0.8 · PV max ×0.9 | Corruption ≥ 70 |
| **183** | la Mue | MAT ×0.65 · MDF ×0.65 · PV max ×0.8 · **dégâts Sombre reçus ×1.4** | Corruption = 100 |
| **188** | Surpassé | **ATK ×1.15 · MAT ×1.15 · +10 % critique** | Équilibre Semi-Parfait tenu (chaque tour) |
| 17 | Saigment | (ta base) | ex. Aspiration des Âmes Damnées |
| 39 | Royaume Impérial | domaine de Lou (copies infinies) | skill « copie d'Ame » |
| 45 | Technique Incomplète | (ta base) | prix de la copie |
| 190 | Épuisement de l'Âme | (ta base) | arts de l'âme |

## A6. LES TROIS JAUGES — tout ce qui les fait bouger

### 🟣 Corruption (la Bête) — 0 à 100, par héros
**Monte :**
| Source | Gain |
|---|---|
| Frappe offensive élément 4 (Négatif) | **+2** |
| Frappe offensive élément 5 (Sombre) | **+3** |
| …avec l'armure `<Relic: antirot>` | gain **÷2** |
| Technique `<Voie: vide>` | **+2** / usage |
| Technique `<Voie: domaine>` | **+3** / usage |
| Skill `<Interdit>` | **+8** / usage |
| Commande `CORRUPTION add x n` | +n |

**Descend :** −1 tous les **60 pas** · `CORRUPTION purge x n` (défaut 30).
**Paliers :** 0 Calme · **40** Frémissement (état 181) · **70** Fièvre (182) · **100** la Mue (183) → voir A5.

### 🔴 Errance (l'Errant) — 0 à 100, par héros
**Monte :**
| Source | Gain |
|---|---|
| Usage offensif d'un art de l'Âme (élém 2 / stype 9) | **+1** |
| Achever un ennemi avec un art de l'Âme | **+5** |
| **Chaque âme ajoutée au stock (Var 15)** | **+2** (porteur : Lou) |
| `<FrappeAme>` à l'impact | **+2** |
| `<FrappeAme>` ratée (retour) | **+2** de plus |
| Une Noyade (Effondrement mental) | **+5** |
| Le Pacte de la Reine | **+10** |
| `ERRANCE add x n` | +n |

**Descend :** −1 tous les **75 pas** · `ERRANCE purge x n`. ⚠️ Dépenser des âmes ne réduit **rien**.
**Paliers :** 0 Ancré · **40** Décharné · **70** Gonflé d'âmes (murmures d'Aldébaran) · **100** l'Errant.
**Effets permanents (sans état, automatiques) :** **+ATK/+MAT jusqu'à +50 %** à 100 (0.5 % × niveau d'errance) · **dégâts subis jusqu'à +40 %** à 100 (le corps se dissout).

### 🔵 Santé mentale (le Dément) — jauge 1 à 10 (vars 11-14)
| Jauge | Phase | Nom | Effets |
|---|---|---|---|
| 9–10 | 5 | **Maîtrise** | Paroles à pleine puissance |
| 6–8 | 4 | Stable | — |
| 4–5 | 3 | Tension | Mana Positif ×0.85 |
| 2–3 | 2 | Instable | Mana Positif ×0.70 · Marque **Fêlée** |
| 1 | 1 | **Effondrement** | Mana Positif ×0.55 · **NOYADE** (voir A7) |

**Monte :** `Ame.bon(x, n)` (bons choix, repos). **Descend :** `Ame.mauvais(x, n)`, Parole brisée (−1), le Pacte (−3), absorption d'âmes par Lou (−1/âme).

## A7. Tous les bonus/malus chiffrés par système

### ⚔️ Les 9 Voies (`MaitriseVoies`) — chaque usage : +1 maîtrise (plafond 40, chaque point = +0.5 % d'effet → jusqu'à **+20 %**)
| Voie | Bonus | Malus / prix |
|---|---|---|
| `forge` | dégâts **×1.5** | si la frappe **rate** : −12 % PV max |
| `onde` | prochaine attaque subie **contrée ×2** | (une seule charge) |
| `source` | soigne **60 %** des dégâts infligés (min 8 % PV max) | — |
| `miroir` | prochaine attaque **−30 %** + **renvoyée à 100 %** | (une seule charge) |
| `vide` | traverse la garde (jusqu'à **+20 %** dégâts) | **+2 corruption** / usage |
| `eclair` | **+50 % critique**, **ne rate jamais** | — |
| `domaine` | **touche garantie**, dégâts **×1.3** | **+3 corruption** / usage |
| `flash` | **25 %** de chance d'Éclat Noir **×2.5** | — |
| `sang` | vole **45 %** des dégâts en PV | — |

### 📜 Les Paroles (`ParolesSysteme`) — formules exactes
- Concentration requise **Kr = 8 · L^1.8** · fenêtre de combat **tf = 5.0** · temps **0.8·L**.
- Tenue = min(1, Kd/Kr) × min(1, tf/(0.8·L)) → les paroles longues (L 5+) échouent si la lucidité est basse.
- **Parole brisée** : aucun effet + contrecoup **6 % PV max** + **−1 santé mentale**.
- Longueur : auto selon coût de PM, ou `<ParoleL: n>`. Type 3 (ult) = **origine** (infaillible).

### 💥 Frappe d'âme (`FrappeAme`)
Ignore **DEF/MDF + toutes les résistances** · 30 % de sonner (`<FrappeAmeEtat: id>`) · prix **+2 Errance** · **ratée : −10 % PV max + 2 Errance**.

### 🏅 Les Rangs (`RangsPuissance`) — calcul exact
`score = réserves (niveau/99 × 40) + maîtrise (meilleure Voie/40 × 30) + aura (palier × 7.5)`
| Score | Rang | Titre |
|---|---|---|
| < 25 | **D** | l'Étincelle |
| 25–44 | **C** | l'Adepte |
| 45–64 | **B** | le Maître |
| 65–84 | **A** | le Champion |
| ≥ 85 | **S** | la Légende |

Semi-Parfait tenu = **+1 cran**. `<Rang: astre>` = hors échelle (jamais calculé).
**Paliers d'aura** (niveau) : <20 → 1 · <40 → 2 · <60 → 3 · 60+ → 4. Ennemis : `<Aura: n>`.

### 🖐️ La Marque (`MarqueVivante`) — seuils exacts (priorité de haut en bas)
| État | Condition |
|---|---|
| **Creuse** | Corruption = 100 **ou** Errance = 100 |
| **Gonflée** | Errance ≥ 40 |
| **Fêlée** | phase mentale ≤ 2 |
| **Affamée** | Corruption ≥ 70 |
| **Pleine** | sinon |

Étendue = score de Rang (%). Purement descriptif (pas de double peine).

### ⭐ L'Équilibre (`Surpassement`) — conditions exactes
Surpassé (état 188) si : les 3 jauges **≥ 15 %** d'intensité **et** écart max-min **≤ 22 %**.
(Intensités : Corps = corruption/100 · Âme = errance/100 · Esprit = (5−phase)/4.)

### 🌊 La Noyade (`Lore_LoiNoyade`)
Chaque passage en phase 1 : **plafond mental −1 pour toujours** (plancher : 4) + **+5 Errance**. `NOYADE pardonne <id>` retire une cicatrice.

### 👑 La Reine (`Lore_AldebaranAppel`)
Murmures sur la carte dès **Errance ≥ 70** (~1 chance sur 3 toutes les 30 s).
**Pacte** : **+20 % ATK & MAT permanent** · prix : **−3 santé mentale, +10 Errance**. Une seule fois par héros.

### 👁️ Les Reprises (`Lore_Reprises`)
Chaque game over compté **à travers les parties** (config). Murmure 1×/session si un héros est en phase ≤ 3.

### ✨ La Fusion (`FusionElements`)
Sort fondamental → élément en suspens (le tour courant). Fondamental suivant dont la **somme existe** → fusionne : élément somme + dégâts **×1.25**. Verrouillable par interrupteur.

### 🚪 Les Portes (`PortesProgression`) — courbe exacte
Entraînement : **+10 / action** (Esprit = Parole · Corps = Voie/élém 4-5 · Âme = élém 2/stype 9/Frappe/Invocation).
Niveaux (cumul) : **100 → niv 1 · 300 → 2 · 600 → 3 · 1000 → 4 · 1500 → 5**.
| Porte | Condition | Effet |
|---|---|---|
| ① Fusion | 2 arts niv 2+ | interrupteur + skill configurables |
| ② Semi-Parfait | 3 arts niv 3+ | interrupteur + skill |
| ③ Parole ultime | 3 arts niv 5 **et** équilibre tenu | skill |

### ☀️🌑 Camps (`Lore_CampsLumiereOmbre`)
Sorts 14/15 seulement : camp opposé **×1.5** · même camp **×0.5**.

### 🩸 Interdites (`Lore_MaitrisesInterdites`)
`<Interdit>` = dégâts **×1.6** (ou `<Interdit: x>`) · **+8 corruption** / usage.

### 🛤️ Les Destins parallèles (`DestinsParalleles`)
Tu choisis **un** héros au départ ; les trois autres **vivent leur vie** :
| Mécanique | Chiffres |
|---|---|
| Battement de vie | tous les **60 pas** du groupe |
| Dérive par battement | **+1 à +2** vers SA voie (Thylane→Corps, Neyssa→Esprit, Lou→Âme, Tianna→aléatoire) |
| Répit | **30 %** de chance que la jauge **recule** au lieu d'avancer |
| XP des absents | **50 %** de l'XP de tes combats (ils mènent les leurs) |
| Rumeurs | 1 message aux paliers **40 / 70 / 100** franchis (une seule fois chacun) |
| Chute | Corruption 100 → **la Bête** · Errance 100 → **l'Errant** · phase 1 → **le Dément** |
| Recruté | la vie parallèle **s'arrête**, il **garde ses jauges** (jauges partagées) |

### 💀 Âmes & mort (systèmes existants)
| Système | Chiffres |
|---|---|
| `AmeSouls` (mort souls-like) | mort = perd **50 %** des âmes (Var 15) sur place, récupérables |
| `ForgeAmes` | renforcer coûte **5 âmes** de base |
| `SanctuaireAmes` | apprendre des skills contre des âmes |
| `InvocationAmes` | `<Invocation: n>` dépense n âmes |
| Objet Spirituel (paliers) | **Éclat** niv 1 · **Forme** niv 15 · **Résonance** niv 35 · **Vérité** niv 60 |
| Absorption de Lou (`Ame.absorber(n)`) | +puissance (Var 15) mais **−1 santé mentale par âme** |

---

# PARTIE B — UTILISATION (commandes · scripts · notetags)

## 🟣 Corruption (`CorruptionAme`)
```
CORRUPTION ecran            CORRUPTION add lou 10
CORRUPTION purge lou 30
```
```js
Corruption.niveau('lou')             // 0-100
Corruption.niveau('lou') >= 70       // condition « Fièvre ou pire »
```
Notetag armure : `<Relic: antirot>` (gains ÷2).

## 🔴 Errance (`Errance`)
```
ERRANCE ecran               ERRANCE add lou 10
ERRANCE purge lou 30
```
```js
Errance.niveau('lou')                // 0-100
```

## 🔵 Santé mentale (`JadeEntitePlunging`)
```js
Ame.jauge('neyssa')          // 1-10
Ame.phase('neyssa')          // 1-5
Ame.nomPhase('neyssa')       // 'Stable'…
Ame.bon('neyssa', 1)         // +1 (bon choix)
Ame.mauvais('neyssa', 2)     // -2 (trauma)
Ame.calme('neyssa')          // true si phase >= 4
Ame.absorber(2)              // Lou dévore 2 âmes (+Var 15, -2 mental)
```

## ⚔️ Voies (`MaitriseVoies`)
Notes de **skill** : `<Voie: forge|onde|source|miroir|vide|eclair|domaine|flash|sang>`
Note d'**acteur/classe/ennemi** : `<VoieDefaut: onde>`
```
VOIES ecran
```
```js
Voies.mastery(1, 'forge')    // 0-40
```

## 📜 Paroles (`ParolesSysteme`) — notes de skill
```
<Parole>            <ParoleL: 4>
<Parole: origine>   <NoParole>
```
```js
Paroles.tenue(actor, skill)  // chance de tenue estimée
```

## 💥 Frappe d'âme (`FrappeAme`) — notes de skill
```
<FrappeAme>
<FrappeAmeEtat: 17>
```

## 🔺 Triangle (`TriangleAffinites`)
```
TRIANGLE                    TRIANGLE hud on
TRIANGLE hud off            TRIANGLE hud toggle
```

## ⭐ Équilibre (`Surpassement`)
```js
Equilibre.etat(1)            // 'semiparfait'|'calme'|'corps'|'ame'|'esprit'
Equilibre.intensites(1)      // {e, c, a} en 0-1
Equilibre.etat(1) === 'semiparfait'   // condition
```

## 🏅 Rangs (`RangsPuissance`)
```
RANGS
```
```js
Rangs.rang(1)                // 'D'…'S'|'Astre'
Rangs.details(1)             // {reserves, maitrise, aura, score, semi, rang}
```
Note d'**ennemi** : `<Rang: S>` ou `<Rang: astre>` · `<Aura: 3>`.

## 🖐️ Marque (`MarqueVivante`)
```
MARQUE
```
```js
Marque.etat(1)               // 'pleine'|'felee'|'affamee'|'gonflee'|'creuse'
Marque.etendue(1)            // 0-100
```

## 🌊 Noyade (`Lore_LoiNoyade`)
```
NOYADE pardonne 2
```
```js
LoiNoyade.noyades(2)         // nombre de cicatrices
```

## 👑 La Reine (`Lore_AldebaranAppel`) — toujours après un choix !
```
REINE pacte 3                REINE oubli 3
```
```js
Aldebaran.aPacte(3)          // true si déjà pactisé
```

## 👁️ Reprises (`Lore_Reprises`)
```
REPRISES dire
```
```js
Reprises.total()             // morts « qui n'ont pas compté »
```

## 🩸 Interdites — notes de skill
```
<Interdit>          <Interdit: 2.2>
```

## ✨ Fusion (`FusionElements`)
```js
Fusion.enSuspens()           // id de l'élément en suspens (0 sinon)
```

## 🚪 Portes (`PortesProgression`)
```
PORTES ecran                PORTES xp 1 corps 50
```
```js
Portes.niveau(1, 'esprit')   // 0-5
Portes.xp(1, 'ame')          // cumul
```

## ☀️🌑 Camps — notes acteur/classe/ennemi
```
<Camp: lumiere>     <Camp: ombre>
```

## 🛤️ Destins parallèles (`DestinsParalleles`)
```
DESTINS ecran               → l'écran des vies parallèles (jauges, rang, chute)
DESTINS tick 30             → ellipse : la vie des absents avance de 30 battements
DESTINS pause on            → fige les dérives (prologue, cutscene)
DESTINS pause off           → relance
```
```js
Destins.absent(2)            // true si l'acteur 2 vit sa vie ailleurs
Destins.chute(2)             // '' | 'bete' | 'dement' | 'errant'
Destins.aChute(2)            // true s'il a chuté
```

### Recette — l'événement de rencontre (recruter OU affronter)
```
◆ Si (Script) : Destins.chute(2) === ''
    ◆ Texte : « Neyssa ?! Tu es vivante… »
    ◆ Afficher choix : Rejoins-moi / Pas encore
      ◆ Si Rejoins-moi : Script : $gameParty.addActor(2)
◆ Sinon
    ◆ Texte : « Ce qui te fait face n'est plus tout à fait Neyssa. »
    ◆ Lancer le combat : « Neyssa, la Démente » (ennemi à créer dans la base,
      avec <Rang: A> <Mana: positif> et ses skills à elle)
```
Astuce : varie le dialogue selon la gravité **avant** la chute :
```js
Corruption.niveau(1) >= 70        // Thylane au bord du gouffre : dialogue urgent
```

## 💀 Âmes (systèmes existants)
```
<Invocation: 5>              // note de skill : dépense 5 âmes
```
```js
$gameVariables.value(15)               // stock d'âmes
ObjetSpirituel.palier($gameActors.actor(1))   // {n:'Forme', lv, c}
```

## 🧰 Notetags transverses (Corps)
```
<Mana: negatif>      <Mana2: positif>     // affinités (acteur/classe/ennemi)
<ReculVital: 20>                          // force le recul PV d'un skill à 20 %
<Atone>                                   // sans affinité : recul ÷2
```

---

# PARTIE C — ORDRE DE CHARGEMENT & RECETTES

## Ordre des plugins (producteurs d'abord)
```
JadeEntitePlunging → CorruptionAme → Errance
────────────────────────────────────────────
ManaAffinity · MaitriseVoies · ParolesSysteme · FrappeAme
Surpassement · RangsPuissance · TriangleAffinites · MarqueVivante
FusionElements · PortesProgression · DestinsParalleles
Lore_LoiNoyade · Lore_AldebaranAppel · Lore_Reprises ·
Lore_MaitrisesInterdites · Lore_CampsLumiereOmbre
```
Stubs sans effet (activés ou non) : `ParolesMagic`, `Lore_ManaReculVital`, `Lore_ManaPurPerce`, `Lore_CyclePopup`.

## Recettes complètes

**Boss de rang S, être d'Ombre, art interdit** — note de l'ennemi :
```
<Rang: S>
<Camp: ombre>
<Mana: sombre>
<Aura: 4>
```
Note de son skill signature :
```
<Voie: domaine>
<Interdit: 1.8>
```

**Le Pacte de la Reine (événement complet)** :
```
◆ Texte : « Je peux te donner ce que tu cherches. Il y aura un prix. »
◆ Afficher choix : Accepter / Refuser
  ◆ Si Accepter :  Commande de plugin : REINE pacte 3
  ◆ Si Refuser  :  Texte : « Sage. Ou lâche. Les deux se ressemblent. »
```

**Feu d'Âme qui purge tout (checkpoint)** :
```
Commande : CORRUPTION purge 1 20      (répéter pour 2,3,4)
Commande : ERRANCE purge 1 20
Script   : Ame.bon(1, 2); Ame.bon(2, 2); Ame.bon(3, 2); Ame.bon(4, 2)
```

**PNJ liseur d'âmes** — condition → Script : `Marque.etat(1) === 'gonflee'`
→ *« Ta marque est difforme, voyageuse. Combien d'âmes as-tu dévorées ? »*

**Héros « pur » pour une scène** — condition :
```js
Corruption.niveau(1) < 40 && Errance.niveau(1) < 40 && Ame.phase(1) >= 4
```

**Débloquer la fusion narrativement** : crée l'interrupteur #41 « Porte de Fusion », mets-le dans `PortesProgression.fusionSwitch` **et** `FusionElements.switchId`. La fusion s'ouvrira quand un héros aura 2 arts au niveau 2.
