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
| **Aël** — l'Équilibre | 1 | `'thylane'` (clé héritée) | **Var 11** | l'équilibre qui vacille (dérive aléatoire) |
| **Korrah** — la Maîtrise | 2 | `'neyssa'` (clé héritée) | **Var 12** | le Corps → **la Bête** |
| **ludwing** — le Symbole | 3 | `'lou'` (clé héritée) | **Var 13** | l'Âme → **l'Errant** (porteur du stock, Var 15) |
| **Vesper** — la Parole | 4 | `'tianna'` (clé héritée) | **Var 14** | l'Esprit → **le Dément** |

> Les clés texte (`'lou'`…) datent d'anciens prénoms mais fonctionnent toujours ; le plus sûr est d'utiliser les **IDs** (1-4).

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
| **195-197** | Chair d'Âme · Fil du Rasoir · Songe Incarné | les 3 **Fusions** (voir Fusion des Mana) | `<Fusion: …>` |
| **198** | Royaume Impérial des Ténèbres — Domaine | **MAT ×1.6 · MDF ×1.4 · ATK ×1.3** + invocations libres | skill 810 `<RoyaumeImperial>` |
| **199** | Contre Totale | renvoie **toute** frappe subie ce tour à l'envoyeur | skill 812 `<ContreTotale>` |
| **200** | Traumatisé — déstabilisé | prix de l'Aspiration (revivre les morts) | skill 70 `<AspirationDamnees>` |
| **201** | la Convergence — ultime d'Aël | **ATK/MAT ×1.35 · DEF/MDF ×1.25 · +15 % crit** + ignore les résistances | skill 813 `<Ultime: convergence>` |
| **202** | la Mue Souveraine — ultime de Korrah | **ATK ×1.7 · DEF/AGI ×1.4 · +20 % crit · MAT ×0.5** + vol de vie 15 % | skill 815 `<Ultime: mue>` |
| **203** | la Parole Originelle — ultime de Vesper | **MAT ×1.7 · MDF ×1.4 · +10 % crit** + magie infaillible | skill 818 `<Ultime: parole>` |
| **204** | l'Envers — Trait de ludwing | **+50 % esquive** (1 tour) : un pied encore de l'autre côté | après un `<Trait: porte>` |
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

### ⚔️ Les 9 Voies (`MaitriseVoies`) — LA LOI DU PRIX
Chaque usage : +1 maîtrise (plafond 40). La maîtrise amplifie **les bonus ET les malus** du même facteur (jusqu'à **×1.2**) : *plus tu es puissant, plus tu paies.*

| Voie | Bonus | Prix (grandit avec la maîtrise) |
|---|---|---|
| `forge` | dégâts **×1.5** | **−5 % des dégâts** en PV à chaque coup · ratée : **−12 % PV max** |
| `onde` | prochaine attaque **contrée ×2** | Reflux armé = exposé : l'attaque contrée frappe **+20 %** |
| `source` | soigne **60 %** des dégâts (min 8 % PV max) | **+1 Errance** par soin (réparer la chair puise dans l'être) |
| `miroir` | attaque **−30 %** + **renvoyée à 100 %** | le miroir se fêle : le porteur encaisse **20 % du renvoyé** |
| `vide` | traverse la garde (jusqu'à **+20 %**) | **+2 corruption** / usage |
| `eclair` | **+50 % critique**, ne rate jamais | la vitesse brûle : **−8 % des dégâts** en PV |
| `domaine` | touche garantie, dégâts **×1.3** | **+3 corruption** / usage |
| `flash` | **25 %** d'Éclat Noir **×2.5** | au déclenchement : **−10 % PV max** (la distorsion revient) |
| `sang` | vole **45 %** des dégâts en PV | **+2 corruption** / drain (le sang appelle le sang) |

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
| Dérive par battement | **+1 à +2** vers SA voie (Aël→aléatoire, Korrah→Corps, ludwing→Âme, Vesper→Esprit) |
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
ChutesCinematiques · ChutesDefinitives · ElementsVivants · FusionMana
RoyaumeImperial    ← après InvocationAmes, Errance, JadeEntitePlunging
UltimesSources     ← après CorruptionAme, Errance, JadeEntitePlunging, ManaAffinity
TraitsAme          ← après Errance, JadeEntitePlunging, MarqueVivante
PremiersPas · AtelierTest
ClarteUI            ← l'aide enrichie lit les notetags de TOUS les systèmes
GrimoireHub        ← EN DERNIER (il regroupe les écrans des autres)
```
Stubs sans effet (activés ou non) : `Lore_ManaReculVital`, `Lore_ManaPurPerce`, `Lore_CyclePopup`. (`ParolesMagic` retiré — Lot 1 du nettoyage ; le vrai système est `ParolesSysteme`.)

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

---

# PARTIE D — CONTENU & OUTILS PRÊTS À L'EMPLOI

## 🗡️ Les 4 versions « chutées » (déjà dans la base !)

| Ennemi | ID | Troupe | Rang | Faiblesse | Skills |
|---|---|---|---|---|---|
| **Aël, le Déchiré** | 401 | **504** | A | Mana Pur ×1.2 | black flash, sort d'inversion, Frappe Aveuglante |
| **Korrah, la Bête** | 402 | **505** | A | Lumière ×1.3 · résiste Sombre ×0.5 | lame de mana sombre, Fendoir Obscur (Voie Forge) |
| **Ludwing, l'Errant** | 403 | **506** | A | Lumière ×1.2 · résiste Physique ×0.7 | Aspiration des Âmes, Déchirure d'Âme, Moisson |
| **Vesper, le Dément** | 404 | **507** | A | Ombre ×1.3 | l'onde, sort d'inversion, black flash |

Les battlers utilisent tes images `Actor*_*.png` existantes (change-les dans l'éditeur si tu préfères d'autres visuels ; teintes déjà réglées).

## 🎬 Les 4 événements de rencontre (déjà écrits !)

**Événements communs 201-204** : `201` = Aël · `202` = Korrah · `203` = Ludwing · `204` = Vesper.

Pose un PNJ sur une carte → `Appeler un événement commun → 201-204`. L'événement fait TOUT :
- il vérifie `Destins.chute(N)` ;
- **pas chuté** → dialogue + choix « Fais route avec nous » → recrutement (`\N[n]`, jauges conservées) ;
- **chuté** → dialogue sombre + **combat contre sa version chutée** (troupe liée).

Tu peux les modifier librement dans l'éditeur (onglet Événements communs).

## 📖 Le Grimoire (`GrimoireHub`) — le menu rangé
UNE entrée « Grimoire » regroupe tous les écrans : Triangle, Rangs, Marque, Destins, Entraînement, Corruption, Errance, Codex. Les entrées individuelles sont masquées (paramètre `masquerEntrees`, désactivable). Un plugin d'écran désactivé disparaît de la liste tout seul.
```
GRIMOIRE                → ouvrir le hub par commande
```

## 🎓 Premiers Pas (`PremiersPas`) — tutoriels contextuels
La **première fois** qu'un système touche le joueur (1er gain de corruption, 1re errance, 1re perte de lucidité, 1re Voie, 1er Frémissement, 1er Surpassé, 1re rumeur des Destins), deux lignes l'expliquent — une seule fois par partie.
```
TUTOS reset             → tout revoir
TUTOS off / on          → couper / réactiver
```

## ⚙️ L'Atelier (`AtelierTest`) — playtest uniquement
En test depuis l'éditeur : entrée « ⚙ Atelier » dans le menu (invisible en jeu exporté) ou commande `ATELIER`. En deux clics :
Corruption/Errance ±, santé mentale ±, +20 âmes, +300 entraînement, **simuler chaque chute** (Korrah→Bête, Ludwing→Errant, Vesper→Dément), avancer les Destins de 50 battements, tout purger.

## 👻 Les Chutes à l'écran (`ChutesCinematiques`) — horreur & méta

**Automatique sur la carte** (déclenché au franchissement, une fois par plongée) :
| Chute | Ce qui se passe |
|---|---|
| **l'Errant** (Errance 100) | animation 358 + la marque envahit l'écran en 3 vagues + « il fond dans le sol, le monde l'oublie » |
| **la Bête** (Corruption 100) | animation 359 + éclat violet + secousse + silhouette de la Bête + **le sprite du héros devient `$BigMonster1`** (restauré si purgé sous 100) |
| **le Fond** (phase 1) | animation 360 (l'œil plein écran) puis **mode BROKENSCRIPT** : glitchs, stickmen qui te fixent, yeux dans le noir, fausses erreurs, **le titre de la fenêtre murmure**, messages méta rares |
| phase ≤ 2 | hallucinations légères (silhouettes lointaines, ~toutes les 18 s) |

```
CHUTE errant 3          CHUTE bete 2         CHUTE fond
CHUTE calme             CHUTE reprendre      (couper / relancer l'ambiance)
```
⚠️ Réserve les **images 91-96** à ce plugin (paramètre picBase).

## 🖼️ Assets horreur générés (16 fichiers, déjà dans img/)
| Fichier | Usage |
|---|---|
| `characters/$OmbreStick.png` · `$OmbreStickGrand.png` | **stickmen jouables en événements** (PNJ hallucination, poursuite…) |
| `pictures/stickman_regard.png` · `stickman_foule.png` | apparitions BROKENSCRIPT |
| `pictures/glitch_overlay1-3.png` | vagues de glitch plein écran |
| `pictures/marque_envahissante1-3.png` | l'Errant englouti (3 étapes) |
| `pictures/yeux_du_fond.png` · `erreur_ame.png` · `silhouette_bete.png` | le Fond, fausse erreur, la Bête |
| `animations/ChuteErrant/ChuteBete/FondLac.png` | feuilles des **animations 358-360** |

## 🗡️ Matrice complète des chutes (12 ennemis · 12 troupes)
| Héros | la Bête | l'Errant | le Dément |
|---|---|---|---|
| Aël | ennemi 405 · troupe **508** | 406 · **509** | 401 (le Déchiré) · **504** |
| Korrah | 402 · **505** | 407 · **510** | 408 · **511** |
| Ludwing | 409 · **512** | 403 · **506** | 410 · **513** |
| Vesper | 411 · **514** | 412 · **515** | 404 · **507** |

Les **rencontres 201-204** branchent maintenant automatiquement sur le TYPE de chute (`Destins.chute(n)`) et lancent la bonne troupe. Rien à faire : pose le PNJ, appelle l'événement commun.

## 🎆 Le catalogue des 100 animations (361-460)

25 effets × 4 teintes chacun (base / **·Violet** / **·Rose** / **·Or**). Assigne-les à tes skills dans l'éditeur (champ Animation) :

| IDs | Effet | Feuille | Idéal pour |
|---|---|---|---|
| 361-364 | Éclat | FX_Eclat | explosions, Forge |
| 365-368 | Onde de choc | FX_Onde | Onde, eau, chocs |
| 369-372 | Lames triples | FX_Lames | attaques d'armes |
| 373-376 | Pilier | FX_Pilier | lumière, invocations |
| 377-380 | Pluie perçante | FX_Pluie | eau, flèches |
| 381-384 | Foudre | FX_Foudre | foudre, Éclair |
| 385-388 | Cristal | FX_Cristal | glace, Givre |
| 389-392 | Pétales | FX_Petales | Plante, soins |
| 393-396 | Bulles | FX_Bulles | eau, souffle |
| 397-400 | Braises | FX_Braises | feu, Lave |
| 401-404 | Vortex | FX_Vortex | ombre, Domaine |
| 405-408 | Concentration | FX_Charge | charges, buffs |
| 409-412 | Croix de lumière | FX_Croix | Lumière, Saint |
| 413-416 | Cercle de runes | FX_Runes | Paroles, Symbole |
| 417-420 | L'Œil | FX_Oeil | lucidité, Regard |
| 421-424 | Griffes | FX_Griffes | la Bête, arts interdits |
| 425-428 | Grande vague (écran) | FX_Vague | ultimes d'eau |
| 429-432 | Éclats brisés | FX_Eclats | Miroir, Métal |
| 433-436 | Drain de vie | FX_Drain | Voie du Sang |
| 437-440 | Dôme gardien | FX_Dome | Terre, défenses |
| 441-444 | Rayon | FX_Rayon | lasers, Mana Pur |
| 445-448 | Étoiles noires (écran) | FX_EtoilesNoires | Aldébaran, la Reine |
| 449-452 | Volutes d'âme | FX_Volutes | âmes, soins spirituels |
| 453-456 | Corruption (écran) | FX_Glitch | méta, glitch |
| 457-460 | Mains de l'ombre | FX_Mains | peur, malédictions |

## 🖼️ Les 70 nouvelles images (img/pictures)

**Glyphes & symboles** : `glyphe_feu/eau/vent/terre/foudre/glace/lumiere/ombre` · `mana_positif/negatif/sombre/spirituel/pur/semiparfait` · `crest_esprit/corps/ame` · `triangle_sources` · `rune1-6` · `sceau_codex` · `porte_fusion`
**Chutes & figures** : `chute_bete/errant/dement/dechire` · `reine_oubliee` · `trone_vide` · `oeil_unique` · `flaque_ombre` · `feu_ame` · `nom_oublie`
**Stickmen (BROKENSCRIPT)** : `stick_rampant/tendu/porte/rangee` · `portrait_glitch1-4`
**Plein écran (816×624)** : `etoiles_noires` · `aldebaran_ciel` · `lune_noire` · `lac_fond` · `brume1-3` · `static1-3` · `fissure1-3` · `eclats1-3` · `pluie1-2` · `neige1` · `distorsion`

**Personnages posables** (img/characters, événements) : `$AmeErrante` · `$BeteOmbre` · `$StickDement` · `$ReineBlanche` · `$StickRampant` (+ `$OmbreStick`, `$OmbreStickGrand`).

## 💀 Les Chutes définitives (`ChutesDefinitives`) — Fear & Hunger

**Une Chute = une perte.** Quand un héros DU GROUPE chute (détection sur la carte, la cinématique se joue d'abord) :

| Chute | Ce qui arrive |
|---|---|
| **la Bête** | quitte l'équipe → son ennemi (matrice 401-412) prend **sa puissance modifiée** : PV ×8.4, **ATK ×2.2**, DEF ×1.6, MAT ×0.6 + **ses 5 meilleures techniques** en actions |
| **le Dément** | quitte l'équipe en riant → son ennemi **garde ses capacités et son niveau** (stats reprises, MAT ×1.6, PV ×7) + ses skills |
| **l'Errant** | **écran noir · mélodie (Curse2) · poème** écrit ligne à ligne… puis le jeu reprend. Il a disparu. Aucun message. Personne ne se souvient. |
| **tous chutés** | « Le monde, lui, continue. Sans vous. » → **Game Over** |

Le transfert de puissance **survit à la sauvegarde** et les rencontres 201-204 font affronter la version chutée **avec la vraie force du joueur perdu**.

```
CHUTEDEF off / on            (désactiver pendant une cutscene scriptée)
CHUTEDEF forcer bete 2       (mise en scène : forcer une perte)
```
```js
Chutes.perdu(2)              // '' | 'bete' | 'dement' | 'errant'
Chutes.survivants()          // héros encore debout (0 = fin)
```
Ordre : charger **après** ChutesCinematiques.

## 🎬 Cinématiques en images (`Cinematiques`) — ⚠️ plugin RETIRÉ (Lot 1 : il n'était chargé par rien)
```
CINE duel                        le duel pixel art inclus (17 frames, sons calés)
CINE jouer <prefixe> <nb> <ms>   tes propres séquences (img/pictures/<prefixe>_01.png…)
```
```js
Cine.jouer('cine_duel', 17, {tempo:[...ms], se:{5:'Slash2'}})
```
Letterbox auto, joueur figé, images 88-90 réservées (picId).

## 🌪️ L'esprit du sort (`ElementsVivants`) — les éléments servent enfin

Sans roue ni cycle (fidèle au Codex) : quand un sort élémentaire **fait des dégâts**, son esprit a **25 %** de chance d'agir (**35 %** pour les dérivés de Fusion) :

| Élément | Esprit en combat |
|---|---|
| Feu (8) | **Brûlure** (état 91) sur la cible |
| Eau (9) | soigne le lanceur (10 % des dégâts) |
| Vent (10) | **+AGI** au lanceur (2 tours) |
| Terre (11) | **+DEF** au lanceur (2 tours) |
| Foudre (12) | **Étourdi** (134) sur la cible |
| Glace (13) | **Gelure** (94) sur la cible |
| Lumière (14) | soigne **l'allié le plus blessé** (15 %) |
| Ombre (15) | **Aveuglé** (5) sur la cible |
| Vapeur (17) | Brûlure **+** Aveuglé |
| Lave (19) | Brûlure (chance **×2**) |
| Plante (20) | drain : vole 15 % des dégâts |
| Givre (22) | Gelure (chance **×2**) |
| Métal (23) | **Paralysie** (136) |
| Crépuscule (29) | Aveuglé + soigne le lanceur |

→ choisir son élément = un choix **tactique** (contrôle / soutien / dégâts sur la durée), et la **Fusion** devient doublement précieuse. Les ennemis profitent des mêmes esprits. Chance + IDs d'états réglables.

## 🟣 La Fusion des Mana (`FusionMana`) — « la Chair d'Âme »

**Le canon :** le *Mana Semi-Parfait* équilibre les trois sources (le centre, la voie sûre). La **Fusion** en fond **deux** l'une dans l'autre — plus puissant qu'une source seule, mais instable : faute d'équilibre, elle tire vers les **deux Chutes** concernées.

**Les 3 Fusions** — chaque paire de sources tire vers ses **deux** Chutes :

| Fusion | Sources | État | Gain | Prix / tour (escalade) |
|---|---|---|---|---|
| **Chair d'Âme** | Âme → Corps | 195 | ATK ×1.45 · DEF ×1.30 · +12 % crit · robuste | **+4 Bête** & **+3 Errant** |
| **Fil du Rasoir** | Corps → Esprit | 196 | **AGI ×1.6** · ATK ×1.2 · +15 % crit · +précision · +esquive | **+3 Bête** & **−1 lucidité** (Dément) |
| **Songe Incarné** | Esprit → Âme | 197 | **MAT ×1.5** · MDF ×1.30 · +12 % crit | **−1 lucidité** (Dément) & **+3 Errant** |

**Entrée :** Chair = 4 âmes (var 15, sinon +18 Errance) · Rasoir & Songe = −2 santé mentale (ouvrir/plonger l'esprit).
→ Rester fusionné = courir vers **deux gouffres à la fois**. Avec `ChutesDefinitives`, une double chute est une **perte définitive rapide**.

```
FUSION chair 1      FUSION rasoir 1      FUSION songe 1
FUSION fin 1        (arrêter ; tombe aussi en fin de combat)
```
```js
Fusion.actif(1)     // clé de la fusion active ('chair'/'rasoir'/'songe') ou ''
```
Skills prêts : **807** (chair, `<Fusion: chair>`) · **808** (rasoir) · **809** (songe). Réservable à un acteur (`acteurRequis`). Charger **après** CorruptionAme, Errance et JadeEntitePlunging.


## ☠ Le Royaume Impérial des Ténèbres (`RoyaumeImperial`) — l'ultime de ludwing

**Le canon :** ludwing est le porteur du **Symbole** et le porteur du **stock d'âmes** (Var 15). Sa dernière carte est une **expansion de domaine** : il déploie son Royaume, et **toutes les âmes qu'il a jamais récoltées reviennent**. Dans son domaine, il est le maître — les invocations ne coûtent plus rien, ses stats se décuplent, et il ouvre l'arsenal des Ténèbres. Fidèle au lore : faire revenir toutes les âmes d'un coup **gonfle l'Errance** (plus une âme porte d'âmes, plus elle sombre vers l'Errant).

### Déployer le Domaine — skill **810** `<RoyaumeImperial>` (à donner à ludwing)
| Effet | Chiffres |
|---|---|
| Les âmes reviennent | **+30** au stock (Var 15) d'un coup — ce qui **monte l'Errance** |
| Invocations libres | tant que le Domaine tient, `<Invocation: n>` ne **coûte plus d'âmes** et n'est jamais grisée |
| Stats décuplées | état **198** : **MAT ×1.6 · MDF ×1.4 · ATK ×1.3** |

### L'arsenal (utilisable dans le Domaine)
| Skill | Note | Effet |
|---|---|---|
| **66** Lotus des Ténèbres | (base) | attaque unique dévastatrice (déjà présente) |
| **811** Pluie de Lance du Styx | `<Invocation: 3>` | pluie d'ombre sur **tous** les ennemis (invocation, donc gratuite en Domaine) |
| **68** Annihilation des Ténèbres | `<SceauMagie>` | **zone** : détruit le corps **et** la magie → PM de la cible **à 0** + **MAT brisé** (debuff 3 tours) |
| **812** Contre Totale | `<ContreTotale>` | état **199** : **tout** ce qui te frappe ce tour est **renvoyé à l'envoyeur** |
| **70** Aspiration des Âmes Damnées | `<AspirationDamnees>` | aspire les âmes de **tous ceux tués dans l'aventure** : régénère PV + PM + **santé mentale** au prorata du **total récolté** — mais revivre les morts te **déstabilise** (état **200 Traumatisé**) |

### Le total d'âmes de toute la partie
`RoyaumeImperial` tient un compteur **cumulatif** (`$gameSystem._amesTotal`, incrémenté à chaque hausse de la Var 15). C'est **lui** qui alimente l'Aspiration : régen = `aspirationParAme` (défaut **6**) × total en PV, ×0.6 en PM, et **+1 santé mentale par 15 âmes**.
```js
RoyaumeTenebres.total()          // âmes récoltées depuis le début de la partie
RoyaumeTenebres.domaineActif(3)  // le Domaine de ludwing est-il ouvert ?
```
```
DOMAINE ouvrir 3     DOMAINE fermer 3     (mise en scène hors skill)
```
Charger **après** `InvocationAmes`, `Errance` et `JadeEntitePlunging`. Skill 810 → à équiper sur **ludwing (acteur 3)**. Le nettoyage de skill 70 supprime l'ancien `<Before Eval>` (qui doublait la régen sur le stock courant) : la régen passe désormais **uniquement** par le total cumulatif du plugin.

## ✶⚔✴ Les Ultimes des Trois Sources (`UltimesSources`) — la carte finale de chacun

**Le canon :** le Royaume Impérial de ludwing a ouvert la voie — chaque héros a **SA** carte finale, taillée dans sa source. Et, **Loi du Prix** oblige : chacune coûte exactement ce qu'elle donne. Le prix **s'escalade** (+1 par tour tenu au-delà du premier) ; tout tombe en fin de combat.

| Héros | Ultime | Skill | État | Gain | Prix / tour (escalade) |
|---|---|---|---|---|---|
| **Aël** (Équilibre) | ✶ **la Convergence** — fondre les TROIS sources | **813** `<Ultime: convergence>` | 201 | ATK/MAT ×1.35 · DEF/MDF ×1.25 · +15 % crit · **ignore les résistances** | **+2 Bête, +2 Errant, −1 lucidité** — les trois gouffres à la fois |
| **Korrah** (Corps) | ⚔ **la Mue Souveraine** — lâcher la Bête, garder la laisse | **815** `<Ultime: mue>` | 202 | ATK ×1.7 · DEF/AGI ×1.4 · +20 % crit · **vol de vie 15 %** (coups physiques) | **+4 Bête** · MAT ×0.5 (le corps dévore l'esprit) |
| **Vesper** (Esprit) | ✴ **la Parole Originelle** — le premier mot du monde | **818** `<Ultime: parole>` | 203 | MAT ×1.7 · MDF ×1.4 · +10 % crit · **la magie ne rate jamais** | **−1 lucidité** — elle court vers le Dément |
| **ludwing** (Âme) | ☠ le Royaume Impérial | **810** | 198 | (voir sa section) | +30 âmes → **+Errance** |

### L'arsenal de chacun (appris au niveau 1, avec l'ultime)
| Héros | Skills |
|---|---|
| Aël | **814** Tranche des Trois Sources — zone, mana **semi-parfait (16) : perce tout** |
| Korrah | **816** Carnage des Neuf Voies (zone physique) · **817** Étreinte de la Bête (frappe Sombre massive, `<ReculVital: 20>` : la chair paie) |
| Vesper | **819** le Verbe qui Défait — zone + `<SceauMagie>` : **PM à 0 + MAT brisé** · **820** Syllabe de la Fin — Mana Pur (7), perce |
| ludwing | 811 Pluie du Styx · 68 Annihilation · 812 Contre Totale · 70 Aspiration |

```
ULTIME convergence 1     ULTIME mue 2     ULTIME parole 4     (mise en scène)
ULTIME fin <id>          (refermer)
```
```js
Ultimes.actif(2)     // 'convergence'|'mue'|'parole' ou ''
```
**Apprentissage câblé dans les classes** (niveau 1) : classe 1 → 813-814 · classe 2 → 815-817 · classe 3 → **810-812** · classe 4 → 818-820. Charger `UltimesSources` **après** CorruptionAme, Errance, JadeEntitePlunging et ManaAffinity (le `<ReculVital>` de 817 et le `<SceauMagie>` de 819 passent par ManaAffinity/RoyaumeImperial).

## 🧬 Les Traits d'Âme (`TraitsAme`) — le don de naissance

**Le canon :** l'Âme est la source la **moins comprise** du monde et la plus imprévisible — elle peut être bonne, mauvaise, faire l'impossible. À la naissance, elle offre **toujours deux choses** : un **don spirituel** (arme, familier ou objet spirituel) et un **TRAIT** — une capacité unique, aléatoire, qui n'appartient qu'à toi. Tout le reste s'apprend ; le Trait, lui, est là depuis le début : un **mana pur primitif, instinctif**, que personne ne contrôle vraiment. C'est la **Marque** (l'ADN de l'âme) qui l'active — et les objets spirituels en sont presque une extension. *(Le modèle : le Kamui de Dono, `DonoKamui.js` — son familier Mimi, l'Esprit Vengeur, EST son deuxième œil.)*

### Les quatre Traits
| Héros | Trait | Ce qu'il fait (bonus en combat) | Don spirituel |
|---|---|---|---|
| **Aël** | **le Point de Rupture** `<Trait: rupture>` | voir la faille exacte où tout casse → ses Traits sont **toujours critiques** | son **arme** — la lame qui trouve la faille |
| **Korrah** | **l'Instant Gelé** `<Trait: gel>` | le **Zéro Absolu** : pas du contrôle du temps, du FROID qui fige tout → ses Traits **ne ratent jamais** + engourdissent (**−AGI 2 tours**) | le **Sablier de Givre** |
| **ludwing** | **la Porte d'Ombre** `<Trait: porte>` | son âme ouvre sur **l'Envers** (le pays des âmes errantes) : pas de téléportation, un passage → après un Trait, **esquive +50 % 1 tour** (état 204) | ses **familiers** — les âmes liées (ses invocations) |
| **Vesper** | **le Verbe Vrai** `<Trait: verbe>` | ce qu'elle nomme, le monde l'écoute → ses Traits **ne ratent jamais** | le **Premier Mot** |

### Le prix (la vraie contrainte)
Le Trait **réunit toutes les sources** d'un coup — alors il **empiète sur toutes les énergies en même temps** :
| Prix | Chiffres |
|---|---|
| Drain de PM (en plus du coût du skill) | **20 % des PM max** / usage → ton prochain sort peut être hors de portée |
| Drain de TP | **20 TP** / usage |
| Forcer la marque | **+2 Errance** / usage |
| Trait d'un autre (marque étrangère) | prix **doublé** + **+6 Errance** |
| **Marque CREUSE** (âme vidée) | le Trait **ne répond plus** (skill inutilisable) |

### Les skills canonisés (l'inspiration anime → le canon)
| Avant | Après | L'explication canon |
|---|---|---|
| black flash (11, 130) | **Éclat Noir** / Concentré | frapper le point de rupture exact — critique né du Trait, pas de la chance |
| speed blist (18) · attaque ultra rapide (131) | **Pas de Rupture** · **Frappe de l'Instant Juste** | l'œil du Trait lit l'ouverture avant le geste |
| super gama (133) | **Déflagration Spirituelle** | Mana Spirituelle pure |
| le monde (24) | **le Monde Gelé** (élém → Glace 13) | l'air gèle au Zéro Absolu : rien ne bouge — le froid, pas le temps |
| armure/arrêt du temps (89-91) | **Armure de Givre · Instant Gelé · Zéro Absolu** | tous en Glace : l'instant figé par le froid |
| ta prochaine phrase sera (25) | **Lecture du Corps** | la Maîtrise lit la tension des muscles, pas l'avenir |
| Best Friendo (93) | **Main Ouverte** | une prise de Maîtrise désarme (voie de l'onde) |
| génie incompris QI 530 000 (95) | **Œil du Stratège** | trois échanges d'avance |
| Boogie Woogie (97) | **Valse des Positions** | une passe de Maîtrise si vive que les postures s'échangent |
| portail d'ombre (69) · déplacement d'ombre (110) | **Porte de l'Envers** · **Abri de l'Envers** | pas de téléportation : il PASSE par l'Envers et ressort ailleurs |
| Bleu/Rouge (101, 102) | **« Viens. » — l'Attraction** · **« Pars. » — la Répulsion** (élém → Positif 3) | le Verbe Vrai : elle le dit, le monde obéit |
| snap rouge (19) · TRAIN DE LA HYPE (22) · rage quit (23) · aura farm (29) | **Claquement du Verbe** · **« Debout ! » — l'Appel** · **« Assez. »** · **Recueillement** | des Paroles, dans sa voix à elle |

```js
Traits.de(2)              // {cle:'gel', nom:"l'Instant Gelé", don:'le Sablier de Givre'}
Traits.possede(1,'rupture')  // true
```
Charger **après** Errance, JadeEntitePlunging et MarqueVivante. Les notes existantes (Paroles, mises en scène YEP) ont été **conservées** — le tag `<Trait: x>` s'ajoute, il ne remplace rien.

### La canonisation complète (2e passe — références vérifiées sur internet)
| Avant | Référence identifiée | Après | L'explication canon |
|---|---|---|---|
| ORRAAAAAAAAAA (16) | JoJo's Bizarre Adventure (le cri « ORA » de Star Platinum) | **Déluge de Poings** | le Corps à l'état pur : l'instinct déchaîné en avalanche de coups |
| l'onde (15) | JoJo (le Hamon / l'Onde) | **l'Onde** (gardé !) | déjà canon : la **voie de l'onde** existe dans les 9 Voies |
| sort d'inversion (17) | Jujutsu Kaisen (technique d'inversion de Gojo) | **Technique d'Inversion** | inverser le flux du mana pour reconstruire — soigner est plus dur que blesser |
| extension du térritoir (46) | Jujutsu Kaisen (l'Extension du Territoire) | **Déploiement de Domaine** | le sommet de la **voie du domaine** (canon depuis les 9 Voies) |
| Arise (98) | Solo Leveling (« Lève-toi » de Sung Jinwoo) | **« Relève-toi. » — le Rappel** | une âme tombée se relève de **l'Envers** par la Porte de ludwing |
| speed blist (18, 136) | « Speed Blitz » (terme VS Battle : frapper avant la perception) | **Pas de Rupture** · **Blitz — l'Éclair Humain** | l'écart de vitesse devient un mur : la cible ne voit jamais le coup |
| super gama (133) | One-Punch Man (le Gamma Ray Burst de Garou) | **Déflagration Spirituelle** | une déflagration de Mana Spirituelle |
| lame/pluie/disque de sang (53, 55, 138…) | Demon Slayer (l'Art du Sang de Gyutaro : faucilles de sang durci) | noms gardés, orthographe corrigée | **l'art du sang** : le Corps se taille des armes dans sa propre chair (voie du sang) |
| Danse de l'Acier (423) | Sekiro (mention retirée de la description) | inchangé | la Maîtrise absolue de l'acier |
| Danse du Sauvageon (433) | Elden Ring (Waterfowl Dance de Malenia, mention retirée) | inchangé | un corps poussé au-delà de ce que la chair permet |
| Fléau des Étoiles (437) | Elden Ring (Radahn le Fléau des Astres) | inchangé | Kev retombe en étoile filante — c'est SON histoire maintenant |
| Glitch/404/.exe/.sys (76-88) | esthétique BROKENSCRIPT / creepypasta | noms **gardés** | canon : c'est le langage de **l'entité du Fond** (méta-horreur des Chutes) |
| TRANSFORMATION ×3 (26/126/127) | — | **Transformation / — Second Stade / — Stade Final** | la chair qui se refond, palier par palier |
| + ~35 corrections | fautes de frappe, majuscules, descriptions vides | (Fuir, Griffe, Souffle Draconique, Poing Fracassant…) | chaque skill du jeu a désormais un nom propre et une description canon |

### Les ultimes signature & combos (3e passe — canonisés et VÉRIFIÉS branchés)
Le système existant fonctionne : `<Ulti>`/`<UltiColor>` → **UltiCinematics** · `<HP Cost: x%>` + `<After Eval>` → **YEP_SkillCore** · `<Combo>`/`<ComboLien>` → **ComboLiens**. Les contre-coups (états 190-193) ont de vrais malus — c'est déjà la **Loi du Prix**.

| Skill | Héros | Canonisé | Contre-coup |
|---|---|---|---|
| 445 Tranche-Néant · 446 Jugement de Soi | Aël | le **Point de Rupture** porté au comble | 25/33 % PV + Épuisement de l'Âme (190) |
| 449 **Instant Absolu** (ex-« Convergence Absolue », renommé : collision avec la Convergence 813) · 450 Point Zéro | Korrah | l'**Instant Gelé** comprimé puis relâché / le Zéro Absolu concentré | 15/25 % PV + Brûlure Mentale (191) |
| 453 Dévoreur d'Âmes · 454 Tout ou Rien | ludwing | la **Porte** ouverte en grand / son âme jouée à pile ou face | 30/35 % PV + Folie du Joueur (192) |
| 457 Éclat de Conviction · 458 Certitude Absolue | Vesper | le **Verbe Vrai** à pleine voix | 20/28 % PV + Doute Paralysant (193) |
| 413-416 (Duos) · 417 Trinité d'Âmes · 418 **Communion des Quatre** (ex-« Convergence des Ames ») | combos | descriptions passées aux **vrais noms** (Aël/Korrah/ludwing/Vesper — fini Thylane/Neyssa/Lou/Tianna) | TP 30/50/80 via ComboLiens |

### La canonisation TOTALE (4e passe — Ennemis · États · Objets · Armes · Classes)
| Avant | Référence (vérifiée) | Après |
|---|---|---|
| boss secret dio (ennemi 12, battler Vampire + état « le monde ») | **JoJo** — DIO, le vampire qui arrête le temps | **Dio, le Voleur d'Instants** (son « arrêt du temps » = un Trait de froid, comme Korrah) |
| GASTER (ennemi 83) | **Undertale** — W.D. Gaster, « tombé dans sa création », fragmenté, accessible par glitch | **Celui qui est Tombé** (canon du Fond ; le tag `<Gaster>` de `JadeGaster.js` est conservé, rien ne casse) |
| Confiance Absolue (nah i'd win) (état 40) | **JJK** — le « Nah, I'd win » de Gojo | **Confiance Absolue** |
| le monde (état 13) · territoire (état 16) | JoJo · JJK | **Monde Gelé** · **Domaine Déployé** (suivent les skills 24 et 46 canonisés) |
| Maître du Chill (état 34) | meme | **Maître Serein** (Arts Sereins) |
| soul breaker · void chopper · emperor · siren song · soldier's rifle · nightbane · darkeheart (armes 26-66) | nommage anglais type WoW/MMO | **Brise-Âme · Fendeur du Vide · L'Empereur · Chant de Sirène · Fusil du Soldat · Fléau-Nocturne · Cœur-Sombre** (+ descriptions) |
| téléphones iPhone/Samsung/Redmi/Nokia/stream + live intedit (armes 7, 59-64 · objet 5) | anachronismes volontaires | **gardés** — canonisés en **Reliques du Fond** : des objets qui n'existent pas dans ce monde, l'entité les a laissés filtrer |
| Objets Spirituels 501-516 | anciens prénoms (Thylane/Neyssa/Lou/Tianna) | descriptions passées à **Aël/Korrah/ludwing/Vesper** + lien canon : « le don spirituel de sa marque — presque une extension de son Trait » |
| classes « maitrise / aprenti / confiance / magie » | — | **l'Équilibre · la Maîtrise · le Symbole · la Parole** (alignées sur A1) |
| bot boss · 2LITE GARDE D2MONIAQUE · IMAGE REMANAT · arc dechu · dragon abuse · poulet bizzare… | typos | **Colosse Sans Âme · Élite — Garde Démoniaque · Image Rémanente · Archange Déchu · Dragon Tyran · Poulet Bizarre**… (~25 ennemis) |
| Épée rouillé · diament ×4 · tenerbre · scetre des ame perdus · Saigment… | typos | tout corrigé (armes, objets 1-10 avec descriptions, états) |

### La mise en conformité des plugins (5e passe)
Audit complet des plugins custom. Les clés script minuscules (`thylane`/`neyssa`/`lou`/`tianna`) sont **canon** (héritées, gardées partout). Corrigé :
| Plugin | Ce qui n'était pas conforme | Réparé |
|---|---|---|
| **ThylaneFormes** | ⚠️ utilisait les états **196/197** — pris depuis par les **Fusions** (conflit réel !) | Formes repointées sur **205** (Art Serein ◈ Forme d'Aël, ATK/MAT ×1.25 +esquive) et **206** (Semi-Forme, ×1.15) — les 3 visages de l'Équilibre : rage / sérénité / entre-deux |
| **JadeObsession** | « STASE TEMPORELLE de Neyssa » (le contrôle du temps n'existe pas) | « **STASE GELÉE** de Korrah » — l'Instant Gelé, son Trait |
| **MirrorTaunts** · Lore_MiroirJosu/Dono/Kev · JosuMirror | les Miroirs raillaient « Thylane, Neyssa, Tianna » | toutes les répliques passées à **Aël, Korrah, Vesper** |
| **JadeEntitePlunging** · Neyssa_Concentration · JadeEchos · FusionElements · Lore_AffiniteAlignes | labels/textes aux anciens prénoms | textes canonisés (les **clés de paramètres** sont inchangées : tes réglages sauvegardés marchent toujours) |
⚠️ Si `ThylaneFormes` est déjà coché dans ton gestionnaire de plugins avec 196/197 en paramètres, mets à jour ces deux nombres (**205** et **206**) ou re-ajoute le plugin.

### Le sceau canon (6e passe — balayage final)
Plus **aucune** trace hors-lore dans tout le projet : commentaires des evals de skills/états canonisés (8+11 remplacements), événements communs **Miroir 50/51/53** renommés et dialogues passés aux vrais noms, `Lore_DilatationTemps` re-canonisé — « Battle World » devient **l'Envers** (1 min réelle ≈ 1000 ans : le temps de l'Envers ne passe pas comme le nôtre, assez pour qu'une âme y oublie son nom), et le « virus temporel » de Jade devient le **Virus du Fond** (gel des techniques). Vérifié : zéro occurrence de Thylane/Neyssa/Tianna dans data/ et js/plugins/.

## 👁️ Clarté (`ClarteUI`) — voir ce qu'on paie, en combat et dehors

**« Toute puissance a un prix — encore faut-il le VOIR. »** Purement additif, aucune donnée modifiée, deux options désactivables :

▶ **L'aide enrichie** (combat **et** menus) : en survolant une compétence, la 2e ligne d'aide affiche automatiquement, lus dans les notetags : l'**élément**, la **Voie et son prix** (ex. `Voie forge (×1.5 — prix −5 % PV/coup)`), le **niveau de Parole**, le **TRAIT et son prix** (20 % PM · 20 TP · +2 Errance), la **Fusion** et ses deux Chutes, l'**Ultime**, le **Domaine**, l'**Invocation** (coût en âmes), l'**Interdit**, le **recul vital**, le **coût en % PV**. Rien à configurer.

▶ **Les 3 Chutes en combat** : sous chaque héros, trois mini-barres — **violet** = Corruption (la Bête), **rouge** = Errance (l'Errant), **bleu** = santé mentale (pleine = saine). Le joueur voit ses gouffres en permanence.

▶ **Icônes d'états distinctes** : les états 195-206 (Fusions, Domaine, Ultimes, Traits, Formes) partageaient la même icône — chacun a maintenant la sienne.

Charger **en dernier**, juste avant GrimoireHub. Hors combat, rappel : le HUD des jauges sur la carte existe déjà (`TRIANGLE hud on`).

## ⟡ La Fusion généralisée (`FusionsEtendues`) + le Codex en jeu (`CodexSources`) — Codex v6

**Le canon (v6) : la Fusion est un PRINCIPE, pas un sort.** Dès que l'âme, le mana originel ou le mana sombre fondent ensemble — technique, rune ou transformation — c'est une Fusion. Trois échelles :
| Forme | Skills | Prix |
|---|---|---|
| **La Technique** `<FusionTech: chair\|rasoir\|songe>` — fondre UN instant | **821** Lame de Chair · **822** Pensée Tranchante · **823** Vision Faite Chair | **immédiat** (moitié du prix/tour des formes) : chair +2 Bête +2 Errant · rasoir +2 Bête −1 lucidité · songe −1 lucidité +2 Errant |
| **La Rune** `<Rune>` — une Parole **gravée en chiffres**, agit sans être récitée | **824** Rune d'Entrave (fige) · **825** Rune de Renvoi (contre) · **826** Rune de Saignée | **jamais ratée**, utilisable même **Muet** (la gravure ne se récite pas) |
| **La Forme** (transformation) | 807-809, états 195-197 (`FusionMana`) | prix/tour qui escalade — inchangé |
Appris par **les 4 classes** au niveau 1. Charger `FusionsEtendues` après FusionMana/CorruptionAme/Errance/JadeEntitePlunging.

**Le Codex en jeu (`CodexSources`)** — parce qu'en combat le texte est coupé et qu'on n'a pas le temps de lire : commande **`CODEX`** → un livre posé, 7 pages (les Trois Sources · la Fusion généralisée · les Traits & les natures d'âme · les 4 Traits des marqués · l'Envers & le Fond · la Loi du Prix · la Mort & les Reprises). Les natures d'âme (canon v6) : **Volonté**→armes · **Attachement**→familiers/boucliers · **Colère**→objets voraces · **Foi**→sceaux/masques · **Deuil**→objets des morts · **Curiosité**→clés/lentilles. Les mystères du codex (le Fond, le Premier…) restent volontairement inexpliqués.

**Messages de combat raccourcis** : les logs de RoyaumeImperial, FusionMana, TraitsAme et UltimesSources tiennent maintenant sur une ligne courte — l'explication complète vit dans le CODEX et l'aide enrichie (`ClarteUI`), pas au milieu du combat.

## ➕ CanonPlus — purge tragique · Graveur · Traits des boss · Fiche · Reprises
| Système | Usage | Chiffres |
|---|---|---|
| **Purge** (on transvase, on n'efface pas) | `PURGE bete/errant/dement <id>` | bête : −30 Corr **+10 Err** · errant : −30 Err **−2 lucidité** · dément : +3 lucidité **+10 Corr** |
| **Graveur** | `GRAVER entrave/renvoi/saignee` | **5 âmes** → 1 rune gravée (items **65-67**, jamais ratées) |
| **Traits des boss** | note `<TraitBoss: Nom\|type>` | types : gel (10 % fige) · faim (vole 10 %) · rupture (+15 % crit) · renvoi (10 % contre ×0.5) · regard (ne rate jamais). Posé sur Dio, Muta ×2, Kevératus, Régis, la Reine, Celui qui est Tombé |
| **Fiche du marqué** | `FICHE` | Trait, don, nature d'âme (Aël=Volonté · Korrah=Attachement · ludwing=Deuil · Vesper=Foi), marque, rang, 3 jauges |
| **Reprises** | automatique | chaque chargement compté ; à 5/10/20 le Fond laisse des traces (`$gameSystem._reprises`) |

**Équilibrage corrigé** : le Royaume Impérial coûte **+15 Errance fixes** au déploiement (plus jamais +2/âme ×30 = +60). L'aide (`ClarteUI`) affiche désormais **« TRAIT de X — marque étrangère : prix ×2 »** quand un héros utilise le Trait d'un autre. **`docs/ORDRE_PLUGINS.md`** : la référence complète du gestionnaire de plugins (js/plugins.js est désormais versionné).

## 🗣️ Les PNJ vivants+ (`PNJVivantsPlus`) — le monde te voit, te raconte, et meurt aussi
| Outil | Usage (dans un événement PNJ) | Ce que ça fait |
|---|---|---|
| **Réactions aux jauges** | `PNJ react` | le PNJ commente l'état du chef : marque creuse/gonflée, Corruption 40/70+, Errance 70+, lucidité basse — 8 répliques automatiques |
| **Rumeurs des vies** | `PNJ rumeur` | raconte la dernière action d'un héros absent (lit le journal de ViesParalleles) |
| **Le PNJ du Fond** | `PNJ fond` | se souvient des Reprises : normal / 5+ (« Encore vous ? ») / 20+ (« Il te regarde faire ») |
| **Le Graveur incarné** | `PNJ graveur` | dialogue complet : refuse si lucidité < 5, sinon 5 âmes → rune 65/66/67 |
| **Destins de PNJ** | `PNJ destin marc 5` · `PNJ soigner marc 20` · `PNJ lire marc` | chaque PNJ nommé a SA chute (0-100, +1 auto/120 pas) — le Regard la lit (PLEINE/FÊLÉE/AFFAMÉE/CREUSE) |
| **L'Envers caché** | note d'événement `<Envers>` | l'événement n'existe QUE si le chef voit l'autre côté (Errance ≥ 40 ou lucidité ≤ 3) |
| **Liens PNJ** | `PNJLIEN up marc` | compteur de lien par PNJ, pour débloquer des services |
| **Conditions script** | `PNJ.peur()` · `PNJ.voitEnvers()` · `PNJ.destin('marc')` · `PNJ.perdu('marc')` · `PNJ.lien('marc')` | pour les pages conditionnelles d'événements |
Recette « PNJ qui chute » : page 1 dialogue normal + `PNJ destin marc 1` au premier contact · page 2 (condition script `PNJ.destin('marc')>=70`) il supplie qu'on l'aide → quête → `PNJ soigner marc 40` · page 3 (`PNJ.perdu('marc')`) maison vide, monstre à sa place. Charger **après** ViesParalleles et CanonPlus.
