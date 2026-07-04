# Guide développeur — Les systèmes des Trois Sources

> Tout ce qu'il faut pour utiliser les plugins : **commandes d'événement**, **appels de script** et **notetags**, prêts à copier-coller.
>
> - **Commande de plugin** → dans un événement : `Commandes avancées → Commande de plugin`, colle la ligne telle quelle.
> - **Script** → dans un événement : `Commandes avancées → Script`, ou dans une **condition** : onglet 4 → Script.
> - **Notetag** → dans la case **Note** d'un skill / acteur / classe / ennemi de la base de données.

---

## ⚙️ Ordre de chargement des plugins

Dans le Gestionnaire de plugins, respecte cet ordre (les producteurs de jauges d'abord) :

```
JadeEntitePlunging      (santé mentale → window.Ame)
CorruptionAme           (la Bête → window.Corruption)
Errance                 (l'Errant → window.Errance)
────────────────────────────────────────────────────
ManaAffinity            (le prix du Corps)
MaitriseVoies           (les 9 Voies)
ParolesSysteme          (la magie-Parole)
FrappeAme               (la Frappe d'âme)
Surpassement            (l'Équilibre → window.Equilibre)
RangsPuissance          (les rangs D→S → window.Rangs)
TriangleAffinites       (le triangle + HUD)
MarqueVivante           (la Marque)
FusionElements          (la fusion d'éléments)
PortesProgression       (l'entraînement des 3 voies)
Lore_LoiNoyade · Lore_AldebaranAppel · Lore_Reprises ·
Lore_MaitrisesInterdites · Lore_CampsLumiereOmbre
```

Les stubs (`ParolesMagic`, `Lore_ManaReculVital`, `Lore_ManaPurPerce`, `Lore_CyclePopup`) peuvent rester cochés ou non : ils ne font rien.

---

## 🟣 CORPS — la jauge de la Bête (`CorruptionAme`)

### Commandes de plugin
```
CORRUPTION ecran                 → ouvre l'écran de corruption
CORRUPTION add lou 10            → +10 de corruption à Lou
CORRUPTION add 3 10              → pareil, par id d'acteur
CORRUPTION purge thylane 30      → -30 (ex. au Feu d'Âme)
```

### Scripts
```js
Corruption.niveau('lou')         // 0-100
Corruption.niveau(3)             // pareil, par id
```

### Exemple — condition « Lou est en Fièvre ou pire »
Condition → Script :
```js
Corruption.niveau('lou') >= 70
```

### Notetags
| Tag | Où | Effet |
|---|---|---|
| `<Relic: antirot>` | Note d'une **armure** | le porteur gagne 2× moins de corruption |

Paliers automatiques : 0 Calme · 40 Frémissement (état 181) · 70 Fièvre (182) · 100 la Mue (183).

---

## 🔴 ÂME — la jauge de l'Errant (`Errance`)

### Commandes de plugin
```
ERRANCE ecran                    → écran d'errance
ERRANCE add lou 10               → +10 d'errance
ERRANCE purge lou 30             → -30 (Feu d'Âme, Sanctuaire…)
```

### Scripts
```js
Errance.niveau('lou')            // 0-100
Errance.niveau(3)
```

### Automatique (rien à faire)
- Achever un ennemi avec un art de l'Âme (élément 2 / skill type 9) → +5.
- **Chaque âme ajoutée au stock (variable 15) → +2 d'errance** au porteur (« plus on a d'âme, plus on sombre »). Dépenser des âmes ne réduit rien.

Paliers : 0 Ancré · 40 Décharné · 70 Gonflé d'âmes · 100 l'Errant.

---

## 🔵 ESPRIT — santé mentale / lucidité (`JadeEntitePlunging`)

### Scripts
```js
Ame.jauge('neyssa')              // jauge 1-10
Ame.phase('neyssa')              // phase 1-5 (1=Effondrement … 5=Maîtrise)
Ame.nomPhase('neyssa')           // "Stable", "Tension"…
Ame.bon('neyssa', 1)             // +1 (bon choix, sang-froid)
Ame.mauvais('neyssa', 2)         // -2 (excès, trauma)
Ame.calme('neyssa')              // true si phase ≥ 4
```

### Exemple — choix de dialogue qui rend de la lucidité
Après le choix « Respirer un grand coup » → Script :
```js
Ame.bon('thylane', 1)
```

---

## ⚔️ LES 9 VOIES DE LA MAÎTRISE (`MaitriseVoies`)

### Notetags (Note d'un **skill**)
```
<Voie: forge>        le Point Final — dégâts ×1.5, se blesse si ça rate
<Voie: onde>         le Reflux — contre la prochaine attaque subie ×2
<Voie: source>       le Reflux des chairs — soigne le lanceur
<Voie: miroir>       le Renvoi — atténue et renvoie la prochaine attaque
<Voie: vide>         l'Immobile — traverse la garde, +corruption
<Voie: eclair>       l'Instant Foudroyant — +critique, ne rate jamais
<Voie: domaine>      le Territoire Scellé — touche garantie ×1.3, +corruption
<Voie: flash>        l'Éclat Noir — 25 % de burst ×2.5
<Voie: sang>         l'Art du Sang — vol de vie (45 % des dégâts)
```

### Notetag (Note d'un **acteur / classe / ennemi**)
```
<VoieDefaut: onde>   ses techniques de Maîtrise non taguées suivent cette voie
```

### Commande & script
```
VOIES ecran                          → aperçu des maîtrises du groupe
```
```js
Voies.mastery(1, 'forge')            // niveau de maîtrise (0-40) de l'acteur 1
```
Chaque usage fait progresser la voie (effets renforcés, plafonné à 40).

---

## 📜 LA PAROLE — magie de l'Esprit (`ParolesSysteme`)

Toute magie à coût de PM est déjà une Parole **automatiquement**. Les tags servent à régler :

### Notetags (Note d'un **skill**)
```
<Parole>             force le skill à suivre le système
<ParoleL: 3>         longueur 2-5+ (plus long = plus fort mais plus fragile)
<Parole: origine>    parole enregistrée : INFAILLIBLE, jamais de contrecoup
<NoParole>           exclut le skill du système
```

### Script
```js
Paroles.tenue(actor, skill)          // chance de réussite estimée
```

Repères : `<ParoleL: 2>` sort simple fiable · `<ParoleL: 5>` très puissant, exige une haute lucidité · `<Parole: origine>` pour les ultimes.

---

## 💥 LA FRAPPE D'ÂME (`FrappeAme`)

### Notetags (Note d'un **skill**)
```
<FrappeAme>              ignore DEF/MDF + résistances (frappe l'âme)
<FrappeAmeEtat: 17>      applique l'état 17 (sonné) à 30 %
```

Prix automatiques : +2 Errance à l'impact ; **si la frappe rate : contrecoup** (10 % PV max + 2 Errance).

---

## 🔺 LE TRIANGLE (`TriangleAffinites`)

### Commandes de plugin
```
TRIANGLE                 → ouvre l'écran du triangle
TRIANGLE hud on          → mini-triangle sur la carte (meneur)
TRIANGLE hud off         → le cacher
TRIANGLE hud toggle      → basculer
```
Aussi dans le menu (« Le Triangle »). Tout est lu automatiquement depuis les 3 jauges.

---

## ⭐ L'ÉQUILIBRE — Mana Semi-Parfait (`Surpassement`)

Automatique : les 3 jauges engagées **et** équilibrées → état **Surpassé** (188) en combat.

### Scripts
```js
Equilibre.etat(1)        // 'semiparfait' | 'calme' | 'corps' | 'ame' | 'esprit'
Equilibre.intensites(1)  // {e: 0.3, c: 0.5, a: 0.2}
```

### Exemple — condition « Thylane tient l'équilibre »
```js
Equilibre.etat(1) === 'semiparfait'
```

---

## 🏅 LES RANGS D→S (`RangsPuissance`)

### Commande & scripts
```
RANGS                    → écran des rangs du groupe
```
```js
Rangs.rang(1)            // 'D' … 'S' | 'Astre'
Rangs.details(1)         // {reserves, maitrise, aura, score, semi, rang}
```

### Notetag (Note d'un **ennemi** — ou acteur spécial)
```
<Rang: S>                annoncé au début du combat
<Rang: astre>            « on ne classe pas un dieu : fuyez »
```

---

## 🖐️ LA MARQUE VIVANTE (`MarqueVivante`)

### Commande & scripts
```
MARQUE                   → écran de lecture des marques
```
```js
Marque.etat(1)           // 'pleine'|'felee'|'affamee'|'gonflee'|'creuse'
Marque.etendue(1)        // 0-100 (% du corps couvert)
```

### Exemple — un PNJ liseur d'âmes réagit à la marque
Condition → Script :
```js
Marque.etat(1) === 'gonflee'
```
Puis message : *« Ta marque est difforme, voyageuse. Combien d'âmes as-tu dévorées ? »*

---

## 🌊 LA LOI DE LA NOYADE (`Lore_LoiNoyade`)

Automatique : chaque Effondrement (phase 1) = une **Noyade** — plafond de santé mentale −1 pour toujours, +5 Errance.

### Commande & script
```
NOYADE pardonne 2        → retire une noyade à l'acteur 2 (rare ! bénédiction…)
```
```js
LoiNoyade.noyades(2)     // nombre de noyades subies
```

---

## 👑 LA REINE OUBLIÉE (`Lore_AldebaranAppel`)

### Commandes de plugin — **toujours après un choix du joueur** (jamais sans consentement)
```
REINE pacte 3            → le Pacte : +20 % ATK/MAT permanent,
                           contre santé mentale -3 et Errance +10
REINE oubli 3            → l'Oubli (cutscene) : le héros quitte le groupe,
                           le monde l'oublie
```

### Script
```js
Aldebaran.aPacte(3)      // true si l'acteur 3 a pactisé
```

### Exemple d'événement complet — proposer le Pacte
```
◆ Texte : « Je peux te donner ce que tu cherches. Il y aura un prix. »
◆ Afficher choix : Accepter / Refuser
  ◆ Si Accepter :
    ◆ Commande de plugin : REINE pacte 3
  ◆ Si Refuser :
    ◆ Texte : « Sage. Ou lâche. Les deux se ressemblent. »
```

Automatique : les héros à Errance ≥ 70 entendent des murmures sur la carte.

---

## 👁️ LES REPRISES (`Lore_Reprises`)

Automatique : chaque game over est compté **à travers les parties** ; les héros profonds (phase ≤ 3) s'en souviennent une fois par session.

### Commande & script
```
REPRISES dire            → force le murmure (mise en scène)
```
```js
Reprises.total()         // nombre de morts « qui n'ont pas compté »
```

---

## 🩸 LES MAÎTRISES INTERDITES (`Lore_MaitrisesInterdites`)

### Notetags (Note d'un **skill**)
```
<Interdit>               dégâts ×1.6, +8 corruption par usage
<Interdit: 2.2>          amplification personnalisée
```
Cumulable avec une voie :
```
<Voie: forge>
<Interdit: 2>
```
→ une Forge interdite : ×1.5 ×2 de dégâts, mais la Bête approche vite.

---

## ✨ LA FUSION DES ÉLÉMENTS (`FusionElements`)

Automatique en combat : un héros lance un sort **fondamental** (Feu 8 … Ombre 15) → l'élément reste « en suspens » ; si un allié (ou lui-même) enchaîne avec un fondamental dont la **somme existe**, le second sort **fusionne** (élément somme + dégâts ×1.25).

### Table de fusion (ta base actuelle)
```
Feu(8)    + Eau(9)     = 17 Vapeur
Feu(8)    + Terre(11)  = 19 Lave
Eau(9)    + Terre(11)  = 20 Plante
Eau(9)    + Glace(13)  = 22 Givre
Terre(11) + Foudre(12) = 23 Métal
Lumière(14) + Ombre(15) = 29 Crépuscule
```
*(Toute somme dont l'élément existe dans System.json fusionne — ajoute un élément id 21, 24… dans la base et il devient fusionnable.)*

### Script & verrouillage
```js
Fusion.enSuspens()       // id de l'élément en suspens (0 si aucun)
```
Paramètre `switchId` : la fusion ne marche que si l'interrupteur est ON — branche-le sur la Porte de Fusion ci-dessous.

---

## 🚪 LES PORTES DE PROGRESSION (`PortesProgression`)

Automatique : chaque art utilisé en combat gagne de l'entraînement (courbe du Codex : 100/300/600/1000/1500 → niv 1-5).
- **Esprit** = lancer une Parole · **Corps** = technique `<Voie:>` ou élément 4/5 · **Âme** = élément 2, stype 9, `<FrappeAme>`, `<Invocation>`.

### Les trois portes (paramètres du plugin)
| Porte | Condition | Effet configurable |
|---|---|---|
| ① Fusion de sorts | 2 arts niv 2+ | allume `fusionSwitch` + apprend `fusionSkill` |
| ② Mana Semi-Parfait | 3 arts niv 3+ | allume `semiSwitch` + apprend `semiSkill` |
| ③ Parole ultime | 3 arts niv 5 **et** équilibre tenu | apprend `ultimeSkill` |

**Branchement conseillé** : crée un interrupteur « Porte de Fusion » (ex. #41), mets-le dans `fusionSwitch` (PortesProgression) **et** dans `switchId` (FusionElements) → la fusion se débloque toute seule au bon moment.

### Commandes & scripts
```
PORTES ecran                     → écran d'entraînement du groupe
PORTES xp 1 corps 50             → +50 d'entraînement Corps à l'acteur 1
```
```js
Portes.niveau(1, 'esprit')       // 0-5
Portes.xp(1, 'ame')              // entraînement cumulé
```

---

## ☀️🌑 LUMIÈRE ⇄ OMBRE (`Lore_CampsLumiereOmbre`)

### Notetag (Note d'un **acteur / classe / ennemi**)
```
<Camp: lumiere>          être de Lumière
<Camp: ombre>            être d'Ombre
```
Effets : le camp opposé prend ×1.5 des sorts 14/15, le même camp ×0.5. Aucun autre élément concerné (pas de roue — c'est la seule opposition du lore).

---

## 🧰 Autres notetags utiles (systèmes du Corps)

| Tag | Où | Effet |
|---|---|---|
| `<Mana: negatif>` (ou `positif`, `ame`, `sombre`, `pur`) | acteur / classe / ennemi | affinité affichée (aura, lore) |
| `<Mana2: positif>` | acteur / classe | seconde affinité (duaux) |
| `<ReculVital: 20>` | skill | force le recul PV à 20 % (sinon défaut : Sombre 25 %, Négatif 15 %) |
| `<Atone>` | acteur / ennemi | sans affinité : recul PV divisé par 2 |
| `<Aura: 3>` | ennemi | force le palier d'aura affiché (1-4) |
| `<Invocation: 2>` | skill | dépense 2 âmes du stock (InvocationAmes) |

---

## 📋 Recettes rapides (copier-coller)

**Un boss de rang S, être d'Ombre, qui manie une Maîtrise interdite** — Note de l'ennemi :
```
<Rang: S>
<Camp: ombre>
<Mana: sombre>
```
Note de son skill signature :
```
<Voie: domaine>
<Interdit: 1.8>
```

**Un sort ultime de héros, Parole infaillible de Lumière** — Note du skill :
```
<Parole: origine>
```

**Vérifier l'état complet d'un héros dans un événement** — Script :
```js
Corruption.niveau(1) < 40 && Errance.niveau(1) < 40 && Ame.phase(1) >= 4
```

**Purger les trois jauges au Feu d'Âme** — trois commandes de plugin :
```
CORRUPTION purge 1 20
ERRANCE purge 1 20
```
puis Script : `Ame.bon(1, 2)`
