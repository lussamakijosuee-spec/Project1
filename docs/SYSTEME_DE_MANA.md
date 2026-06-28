# 🌌 SYSTÈME DE MANA — BIBLE TECHNIQUE
### RPG Maker MV · La traduction *jouable* du système des Trois Sources
> **v2 — refonte complète.** Cette bible remplace l'ancien modèle (cycle
> Pokémon + 5 paliers d'affinité). Le canon narratif vit dans
> `docs/codex-trois-sources.html` (édition complète) et `docs/traite-trois-sources.html`
> (édition science). Ce document est leur **traduction en données & plugins**.
>
> 🔁 **Ce qui change vs l'ancien système :** voir §0bis « Migration ».

---

## 0. RÉSUMÉ EN UNE PHRASE
> Tout être est un **trépied — Corps, Âme, Esprit**. Chaque source remonte du
> **Fond** (les codes sources) et se manie par un **art** (Souffle, Symbole,
> Parole). Pencher vers une source donne de la puissance **et** sa **Chute**
> (la Bête, l'Errant, le Dément). Rester au **centre** = le **Mana Semi-Parfait**.

---

## 0bis. MIGRATION — ce qui remplace quoi

| Ancien système (retiré) | Nouveau système (canon) |
|--------------------------|--------------------------|
| Cycle Pokémon Négatif>Spirituel>Positif (×1.5/×0.5) | **Pas de pierre-feuille-ciseaux des branches.** Le coût/risque vient des **Chutes**, pas d'un cycle. *(cf. §6)* |
| 5 paliers d'affinité (Alignés/Duaux/Atones/Trines/Élus) | **3 voies qu'on entraîne** (Esprit/Corps/Âme) + **équilibre**. L'« Élu » = celui qui tient les **trois** en équilibre (Semi-Parfait). |
| Affinité = case figée à la naissance | **Affinité = où penche ton entraînement**, qui évolue (et te rapproche d'une Chute). |
| « Mana Pur = chance 1/1000 » | **Mana Semi-Parfait = équilibre maîtrisé des trois** (rare car dur à *tenir*, pas à *tirer au sort*). |

> ⚙️ **Bonne nouvelle :** `data/System.json` est **déjà aligné** (voir §11). Le
> chantier est surtout du **texte/lore** et le **recadrage** de quelques plugins.

---

## 1. LE FOND & LES TROIS SOURCES

Sous le monde s'étend le **Fond** (la *Vérité*, le *Lac*) : la couche profonde du
réel, source de **tout mana** et de **toute folie**. *(Couche méta : le Fond = les
**codes sources** du jeu.)* L'énergie en **remonte par trois canaux** — les
**trois sources** — une par facette de l'être :

| Facette | Touche le monde par | Source primordiale (brute) | Branche maniable | Art | Prix | Chute |
|---------|---------------------|----------------------------|------------------|-----|------|-------|
| **ESPRIT** | la pensée | Mana Originel *(id 6)* | **Positif** *(id 3)* | la **Parole** | lucidité | le **Dément** |
| **CORPS** | le geste | Mana Sombre *(id 5)* | **Négatif** *(id 4)* | le **Souffle** | humanité | la **Bête** |
| **ÂME** | le sentiment | Mana de l'Âme *(id 2)* | **Spirituel** *(id 2)* | le **Symbole** | essence | l'**Errant** |

Au sommet, hors cycle : le **Mana Pur / Parfait** *(id 7)*, et son état rare
d'équilibre, le **Mana Semi-Parfait** *(id 16)*.

> **La Marque (l'ADN de l'âme)** est l'**interrupteur** : sans elle, aucun accès
> aux sources. Elle **vit** et change avec l'âme ; sa couleur trahit la source
> dominante. *(Plugin : `ObjetSpirituel` — la Marque = la face « profondeurs » de
> l'Objet Spirituel.)*

---

## 2. LES TROIS ARTS (la magie *utilisable*)

### 🔵 LA PAROLE — l'art de l'Esprit *(branche Positif, id 3)*
Un sort **récité** : `mot de passe (mana) + élément + sort`. Précis, modulable,
**lent**. Plus la parole est longue (L), plus elle frappe — mais plus il faut de
**lucidité** pour la tenir ; sinon elle se **brise** (contrecoup).
- **Plugin :** `ParolesMagic` (réussite = f(lucidité, L)), `ManaVisuals` (couleurs).
- **Réf joueur :** `compendium-paroles.html`, `regles-simples.html`.

### 🔴 LE SOUFFLE — l'art du Corps *(branche Négatif, id 4)*
Un **art martial instantané** : pas d'incantation, on lance « comme on contracte
un muscle ». Le mana sombre **circule comme le sang**. Écoles : Onde, Brisure,
Racine, Spectre. **Progresse par le combat** (on absorbe le style adverse).
- **Coût mécanique :** **recul PV** (le Corps se paie en chair) → `ManaAffinity`
  (recoil Négatif/Sombre) + montée de **Corruption** → `CorruptionAme`.
- **Skill types existants à rattacher :** `10 · sang`, les `ombre de <arme>` (11-18).

### 🟣 LE SYMBOLE — l'art de l'Âme *(branche Spirituel, id 2)*
On **crée** depuis l'âme : **matérialiser** un objet/familier (sentiment + désir +
croyance), **Résonance** (accorder deux âmes), **Lecture** (le Regard). Opération
**interdite** : la **Consommation** (dévorer des âmes → l'Errant).
- **Plugins :** `ObjetSpirituel` (matérialisation/évolution), `InvocationAmes`,
  `LouCopySystem` (absorption/copie), `AmeStatusScene`.
- **Skill types existants :** `9 · ame`, `8 · invocation`.

---

## 3. LA LUCIDITÉ — descendre dans le Lac

La **lucidité = la Santé Mentale** (vars 11-14, plugin `JadeEntitePlunging`).
Elle sert à **deux** choses : **tenir les longues Paroles**, et **voir le caché**.
C'est une **descente par seuils** :

| Seuil | Ce qu'on voit | En jeu |
|-------|---------------|--------|
| 0 · Surface | le monde ordinaire | normal |
| 1 · Le voile | âmes errantes, sang, **marques** des gens | indices, PNJ cachés |
| 2 · La trame | le **code** sous les choses (Paroles, nombres) | secrets, glitches lisibles |
| 3 · Le Mur | ce qui **regarde du dehors** : présences, **vies reprises** (sauvegardes), **oubliés** | horreur méta (`CorruptedUI`) |
| 4 · Le Fond | tout, d'un coup — la folie | game-over « Dément » |

> 💡 **Double tranchant :** trop **basse** → les grandes Paroles ratent ; trop
> **haute** → on touche le Mur et on glisse vers le **Dément**. L'équilibre se tient.

---

## 4. LES TROIS CHUTES (le cœur du gameplay)

Pencher trop vers une source **brise l'équilibre** et appelle sa Chute. **Chaque
Chute existe déjà comme mécanique** — il s'agit de les unifier sous ce nom :

| Chute | Source | On gagne | On perd | Plugin / mécanique |
|-------|--------|----------|---------|--------------------|
| **La Bête** | Corps (sang de bête / Ombrefauves) | puissance brute | la conscience | `CorruptionAme` (jauge 0-100), `CorruptionFX`, `CorruptedUI` |
| **L'Errant** | Âme (Consommation) | pouvoir sans fin (+ATK/+MAT) | le corps (fragilité +dégâts subis) | **jauge `Errance`** (0-100 : Ancré→Décharné→Gonflé→l'Errant), nourrie par `AmeSouls`/`LouCopySystem` |
| **Le Dément** | Esprit (lucidité au Mur) | voir toute vérité | la raison | Santé Mentale extrême (`JadeEntitePlunging`) |

> 🔗 **Lien lore :** les **âmes errantes** que régit la **Reine Oubliée / Déesse
> Blanche** *furent* des Errants montés trop haut (voir `lore.md`).

> 🎯 **Paliers de la Bête (canon, à garder dans `CorruptionAme`) :**
> 40 = Ternie · 70 = Souillée · 100 = Corrompue. Renommables en
> **Calme → Frémissement → Fièvre → Mue** pour coller au lore.

---

## 5. L'ÉQUILIBRE — le Mana Semi-Parfait

Le **centre** des trois sources : ni Bête, ni Errant, ni Dément. Celui qui le tient
peut **tout** (réciter, frapper, créer) sans basculer. **Rare**, non par chance,
mais parce que c'est une **tension** à tenir en permanence.
- **Plugin :** `Surpassement` (jauge mentale 9-10 → état « Surpassé » +stats/+crit).
- **Élément/skill-type :** `mana semi parfait` (élém 16), skill type `7`.
- **Progression (cf. `compendium-paroles.html` onglet Progression) :** entraîner
  ses **trois** voies > en maxer une. Portes : Fusion (2 voies niv 2),
  Semi-Parfait (3 voies niv 3), Parole ultime (3 voies niv 5 + équilibre tenu).

---

## 6. LES ÉLÉMENTS (couche tactique)

8 éléments de base, **inchangés** (`System.json` 8-15) :

| id | Élément | id | Élément |
|----|---------|----|---------|
| 8 | FEU | 12 | FOUDRE |
| 9 | EAU | 13 | GLACE |
| 10 | VENT | 14 | LUMIÈRE |
| 11 | TERRE | 15 | **OMBRE** |

### Créer des éléments — la règle de la somme
**Élément + Élément = nouvel élément** (on additionne les codes → résultat ≥ 16,
donc le canon 8 reste intact). Ex. : Terre (11) + Eau (9) = **20 · Plante** ;
Feu + Eau = 17 · Vapeur ; Feu + Terre = 19 · Lave ; Terre + Foudre = 23 · Métal ;
Eau + Glace = 22 · Givre ; Lumière + Ombre = 29 · Crépuscule.
- **Réf joueur :** `regles-simples.html` (mélangeur). **À implémenter :** entrées
  `System.json` 16+ + couleurs `ManaVisuals` quand on voudra des sorts dérivés.

> ⚠️ **Plus de cycle pierre-feuille-ciseaux des branches.** Lumière ⇄ Ombre
> peuvent rester opposés (lisible), mais l'avantage de combat ne vient plus d'un
> cycle Négatif/Positif/Spirituel : il vient des **Arts** et des **Chutes**.

---

## 7. LES AUTORITÉS (au-delà des Chutes)

Accumuler assez d'essence (par n'importe quelle voie) **sans** être emporté = une
**Autorité** : le monde se **plie** à elle. Deux Autorités ne coexistent pas sans
que le monde se brise (les *Sommets*).
> 🔗 **Couche méta :** les **4 Originels** (âme du Roi Démon) **sont** des
> Autorités. Le **Concordat des Sommets** = la peur de leurs guerres. *(Boss :
> `JadeObsession`, `DonoBoss`, `MahoragaBoss`, `KevSignature`, `JosuMirror`.)*

---

## 8. LES QUATRE ROYAUMES ↔ le casting

| Royaume | Voie | Pont méta (Battle World) |
|---------|------|--------------------------|
| **Ordre d'Or** | équilibre | Église de l'Équilibre · **Donovan, l'Élu** |
| **Empire Vultric** | Corps / force | l'empire de **Kev** |
| **Mages des Étoiles** | Esprit / savoir | Sorcières des Étoiles · **Royaume des Étoiles** (Jade) |
| **Empire Uni de l'Est** | Âme / essence | **Voix de l'Âme** · proche du Culte des Âmes (femme de Dono) |

*(Factions jouables : `FactionsAmes`. Détail : `lore.md` & `codex-trois-sources.html`.)*

---

## 9. LES ÂMES & L'AU-DELÀ

À la mort, l'âme **redescend vers le Fond** (les codes sources). Certaines
**restent accrochées** = âmes errantes. **Seuls les joueurs non corrompus
reviennent** (sauvegardes). La **corruption** = réécriture irréversible.
- **Plugins :** `AmeSouls` (Feu d'Âme, mort = perte d'âmes, pas de Game Over),
  `Bloodstain` (récupérer ses âmes), `ForgeAmes`, `SanctuaireAmes`.

---

## 10. L'OBJET SPIRITUEL & LA MARQUE

- **Surface** = l'**Objet Spirituel** (arme de départ, 4 paliers
  Éclat→Forme→Résonance→Vérité ; `ObjetSpirituel`).
- **Profondeurs** = la **Marque / ADN** : signature **unique**, **interrupteur**
  d'accès aux sources, **vit** avec l'âme (s'étend, se rétracte si l'âme se brise).
- **Natures d'âme** (ce qu'on matérialise) : Volonté → armes ; Attachement →
  familiers/boucliers ; Colère → objets voraces ; Foi → sceaux/masques ; Deuil →
  objets liés aux morts ; Curiosité → clés/lentilles.

---

## 11. CORRESPONDANCE BASE DE DONNÉES (déjà en place)

**Éléments (`System.json`)** — *alignés, ne rien renuméroter :*
| id | Nom en base | Rôle |
|----|-------------|------|
| 1 | Physique | arme / Objet Spirituel |
| 2 | mana spirituelle | **Âme** (source & branche) — le Symbole |
| 3 | mana positive | branche **Esprit** — la Parole |
| 4 | mana négative | branche **Corps** — le Souffle |
| 5 | Mana Sombre | **Corps** (source brute) |
| 6 | Mana Originel | **Esprit** (source brute) |
| 7 | AME / Parfait | **Mana Pur** |
| 8-15 | FEU…OMBRE | les 8 éléments |
| 16 | mana semi parfait | l'**équilibre** des trois |

**Skill types utiles :** `7 · MANA semi-parfait`, `8 · invocation`, `9 · ame`,
`10 · sang`, `11-18 · ombre de <arme>` (Souffle), `19 · Arts Sereins`.

---

## 12. CARTE DES PLUGINS (qui fait quoi)

| Pilier | Plugin(s) |
|--------|-----------|
| La Parole (Esprit) | `ParolesMagic`, `ManaVisuals`, `ManaCodex` |
| Le Souffle (Corps) | `ManaAffinity` (recul PV), skill types `sang`/`ombre` |
| Le Symbole (Âme) | `ObjetSpirituel`, `InvocationAmes`, `LouCopySystem`, `AmeStatusScene` |
| Lucidité / Dément | `JadeEntitePlunging`, `Neyssa_Concentration`, `CorruptedUI` |
| Bête (Corps) | `CorruptionAme` (Calme/Frémissement/Fièvre/Mue), `CorruptionFX` |
| Errant (Âme) | `Errance` (jauge dédiée), `AmeSouls`, `Bloodstain`, `LouCopySystem` |
| Équilibre / Semi-Parfait | `Surpassement` |
| Feu d'Âme / mort | `AmeSouls`, `ForgeAmes`, `SanctuaireAmes` |
| Factions / Royaumes | `FactionsAmes` |

---

## 13. CHANTIER DE COHÉRENCE

- [x] `ManaCodex` : pages refaites → 3 Arts / 3 Voies / 3 Chutes / équilibre.
- [x] `ManaAffinity` : **cycle ×1.5/×0.5 retiré**. Conservés : recul PV (prix du
      Corps), couplage Positif/Santé Mentale, Mana Pur perce-résistances.
- [x] `CorruptionAme` : paliers → **Calme / Frémissement / Fièvre / la Mue**
      (états 181-183 renommés, écran + messages mis à jour).
- [x] **Errant** : jauge `Errance` formalisée (plugin dédié, auto-suffisant).
- [ ] Éléments dérivés (16+) : à ajouter dans `System.json` quand on créera les
      sorts correspondants.
- [ ] (Option) brancher le gain d'`Errance` sur les skills de Consommation précis
      (balise `<Consume>`) plutôt que tout art de l'Âme.

---

> *« Les faibles choisissent une voie. Les forts les portent toutes. Les sages
> savent qu'aucune ne se porte sans prix. »* — enseignement de l'Ordre d'Or
