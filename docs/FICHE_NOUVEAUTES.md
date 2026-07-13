# 🗂️ Fiche de synthèse — tout ce qui a été ajouté

> Mémo à garder ouvert à côté de RPG Maker. Regroupe **ce que tu dois créer/câbler
> dans l'éditeur** pour activer les nouveaux systèmes, plus les touches et les
> commandes. Détail complet : `docs/GUIDE_DEVELOPPEUR.md`.

---

## ⌨️ Touches clavier (sur la carte)

| Touche | Effet | Plugin |
|---|---|---|
| **R** | Le Regard : lire l'âme du PNJ en face | `LeRegard` |
| **F** | Plonger / remonter dans le Lac (lucidité) | `PlongerLac` |

*(Les deux touches sont réglables dans les paramètres du plugin.)*

---

## 🎯 À CRÉER dans l'éditeur — Compétences (avec notetag)

Ces systèmes se déclenchent par des **compétences** : crée-les dans la base de
données et mets le notetag dans la case *Note*, puis donne-les aux héros.

| Notetag (dans la Note du skill) | Compétence à créer | Système |
|---|---|---|
| `<Mue>` | « Déchaîner » (cible : soi) — devient la Bête | `MueMaitrisee` |
| `<MueFin>` | « Reprendre forme » (cible : soi) | `MueMaitrisee` |
| `<MueSkill>` | technique bestiale (utilisable seulement en Mue) | `MueMaitrisee` |
| `<Resonance>` | « Résonner » (cible : 1 allié) | `Resonance` |
| `<ResonanceUlt>` | ultime duo (utilisable seulement en résonance) | `Resonance` |
| `<ResonanceFin>` | « Rompre » (option) | `Resonance` |

---

## 🏷️ À CRÉER dans l'éditeur — Notetags

### Sur les ÉVÉNEMENTS (commentaire dans la page)
| Notetag | Effet | Plugin |
|---|---|---|
| `<Ame: colère>` | nature de l'âme (volonte/attachement/colere/foi/deuil/curiosite) | `LeRegard` |
| `<Marque: fêlée>` | état de marque (pleine/felee/affamee/gonflee/creuse) | `LeRegard` |
| `<Verite: …>` | vérité chuchotée révélée par le Regard | `LeRegard` |
| `<Menteur>` | démasqué par le Regard (lucidité ≥ 5) | `LeRegard` |
| `<AmeErrante>` | âme errante déguisée (révélée lucidité ≥ 5) | `LeRegard` |
| `<Mur: …>` | vérité méta (révélée lucidité ≥ 7) | `LeRegard` |
| `<Nom: …>` | nom affiché par le Regard | `LeRegard` |
| `<NoRead>` | ce PNJ ne réagit jamais à ton âme | `MondeTeLit` |
| `<Cache>` | invisible sauf en plongée (Lucide) | `PlongerLac` |
| `<Bete>` | bête sauvage (reconnaît le sang ; ne chasse plus le Fiévreux) | `Codex_Chutes` |

### Sur les ENNEMIS (Note)
`<Ame: …>` `<Marque: …>` `<Verite: …>` (lisibles au Regard) · `<Bete>`
`<BeteTombee>` `<ErrantTombe>` `<DementTombe>` `<DechireTombe>` (Chutes).

### Sur les ARMES (Note)
| Notetag | Effet |
|---|---|
| `<Eveil>` | cette arme « parle » (Objet Éveillé), quel que soit le porteur |

### Sur les ACTEURS / CLASSES (Note)
| Notetag | Effet |
|---|---|
| `<Atone>` | résiste à moitié à la Contagion ; -corruption divisée par 2 |
| `<Mana: ame>` / `<Mana2: …>` | affinités (systèmes existants) |

### Sur les CARTES (Note de la carte)
| Notetag | Effet |
|---|---|
| `<SafeZone>` | refuge : pas de Chasseurs ; +SAN en marchant |

---

## 🔀 Interrupteurs à assigner (paramètres de plugin)

| Paramètre | Plugin | À quoi ça sert |
|---|---|---|
| `switchLucide` | `PlongerLac` | ON pendant la plongée → câble tes passages/ennemis cachés dessus |
| `oubliSwitch` / `oubliVar` | `PactesAldebaran` | déclenché quand tu paies un **Oubli** → efface un PNJ / ferme du contenu |

*(Laissés à 0 = désactivés. Mets-y un numéro d'interrupteur/variable pour les brancher.)*

---

## 🎮 Commandes de plugin (par système)

**Chutes** · `BETE ancre <id>` · `ERRANT ancrage <id>` · `DEMENT chute/ancrage <id>`
**Ambiance** · `CHUTEHALL on/off` · `CHUTEMURMURE on/off` · `CHUTEPOEME [n]` · `CHUTELAC play/voie/stop` · `CHUTEVHS on/off/burst`
**Le Regard** · `REGARD` · `REGARD event <id>`
**Pactes** · `PACTE` (ouvre le sanctuaire) · `PACTE oubli`
**Marque** · `MARQUE` (écran des sigils)
**Mue** · `MUE forcer/fin <id>`
**Rêves** · `REVE [id]` (auto après `FEUAME repos`)
**Monde te Lit** · *(automatique)* — script `MondeLit.reputation()`
**Chasseurs** · `CHASSE on/off` · `CHASSE force [bete|errant|fond]`
**Contagion** · `CONTAGION on/off`
**Plonger** · `PLONGER` · `REMONTER` · `PLONGER on/off`
**Théâtre** · `THEATRE on/off`
**Le Mur** · `MUR on/off` · `MUR forcer`

---

## 🖥️ Nouveaux écrans / entrées de menu

- **Marque** (`MARQUE`) — les sigils vivants des 4 héros.
- **Pactes** (menu optionnel `menuPactes`) — les pactes scellés.
- **Le Regard** (vitrail à la touche R) · **Errance** / **Corruption** (existants).

---

## 🔗 La boucle de conséquence (comment tout s'enchaîne)

Tu chutes → **l'Objet Éveillé** t'avertit et t'**ancre** → la **Contagion** menace
ton groupe → le **Monde te Lit** → les **Chasseurs** t'embusquent. En parallèle :
la **Mue** (Corps) et **Plonger** (Esprit) transforment tes Chutes en pouvoirs
maîtrisables, la **Résonance** lie tes héros, les **Pactes** offrent la puissance
contre un prix, les **Rêves** approfondissent, et au plus profond de l'Esprit le
**Théâtre** puis le **Mur** brisent le 4e mur.
