# 📖 RÉFÉRENCE COMPLÈTE — toutes les commandes, notetags, formules & scripts

> Le mémo total de tout ce qui a été ajouté. Chaque système : ses **commandes de
> plugin**, ses **notetags**, son **API script**, ses **paramètres**. + les
> formules, les IDs canon (éléments, états, animations) et le Dément tombé créé.
> Garde-le ouvert à côté de l'éditeur.

## Sommaire
1. Touches clavier
2. Les Chutes (Codex_Chutes) + ambiance
3. Le Regard · les Pactes · la Marque
4. Mue · Rêves · Résonance · Monde te Lit
5. Chasseurs · Contagion · Objet Éveillé
6. Le Dément : Plonger · Théâtre · Mur · DementInterne
7. La Chronique du Monde
8. Le Dément tombé (données créées : ennemi 404, skills 461-465, troupe 507)
9. Annexes : formules, éléments, états, animations

---

## 1) ⌨️ Touches clavier (carte)
| Touche | Effet | Plugin |
|---|---|---|
| **R** | Le Regard : lire l'âme du PNJ en face | `LeRegard` (param `touche`) |
| **F** | Plonger / remonter dans le Lac | `PlongerLac` (param `touche`) |

---

## 2) 🩸 Les Chutes — `Codex_Chutes` (v4)
**Commandes**
```
BETE chute <id>            déclenche la Bête lâchée (héros id)
BETE ancre <id>            l'Objet Spirituel suspend la griffe (1× — annule la chute, corr -45)
ERRANT chute <id>          déclenche l'effacement
ERRANT ancrage <id>        les alliés au Lien ≥ 5 le retiennent (errance -20 chacun)
DEMENT chute <id>          déclenche « il croit rester »
DEMENT ancrage <id>        les alliés lucides (jauge ≥ 8) le retiennent
DECHIRE chute <id>         le Déchiré (Aël, 3 gouffres)
DECHIRE ancrage <id>       ancrage à quatre
```
**Notetags ennemis** : `<Bete>` (bête sauvage : reconnaît le sang), `<BeteTombee>`
`<ErrantTombe>` `<DementTombe>` `<DechireTombe>` (héros tombés).
**Auto** : Loi du Sang (nuit ×1.5 corruption, la bête épargne le Fiévreux),
Loi des Amarres (Lien réduit l'errance), cartes de palier, battement de cœur,
vision du sang, l'Instinct, la Curée, la Traversée, étoiles noires, nom qui
s'efface. *(Aucune commande — se déclenche selon les jauges.)*

### Ambiance des Chutes
```
CHUTEHALL on | off                     hallucinations (Errant/Dément/Bête)
CHUTEMURMURE on | off                  murmures des 3 voix
CHUTEPOEME [n]                         récite le poème (n âmes ; auto sinon)
CHUTELAC play [thème] [intensité%]     musique procédurale (30 thèmes)
CHUTELAC voie <errant|bete|fond> [%]
CHUTELAC theme <nom|index> | intensite <%> | stop | auto on|off
CHUTEVHS on | off | burst | niveau <%> analog horror (Fond/Errant/Bête)
```
**Scripts** : `ChutesMurmures.nbAmes()` · `ChutesMurmures.poeme()` ·
`ChutesLac.play(i,0.8)` · `ChutesLac.voie('bete',0.9)` · `ChutesLac.stop()` ·
`ChutesLac.themes()`.

---

## 3) 👁 Le Regard · 🌌 les Pactes · 🩸 la Marque

### `LeRegard`
```
REGARD                lit le PNJ en face (comme la touche R)
REGARD event <id>     lit un événement précis
```
**Notetags événement/ennemi** : `<Ame: colère>` (volonte|attachement|colere|foi|
deuil|curiosite) · `<Marque: fêlée>` (pleine|felee|affamee|gonflee|creuse) ·
`<Verite: …>` · `<Menteur>` · `<AmeErrante>` · `<Mur: …>` · `<Nom: …>`.
**Lucidité** (profondeur du chef) : ≥3 vérité · ≥5 menteurs & errants · ≥7 le Mur.
**Script** : `LeRegard.lucidite()` → 0-9.

### `PactesAldebaran`
```
PACTE           ouvre le sanctuaire (3 offres, prix affiché)
PACTE oubli     force un Oubli (scénarisé)
```
**Params** : `soulVar` (15) · `donAmes` · `oubliSwitch`/`oubliVar` (0=off ; câble
pour effacer un PNJ) · `menuPactes`. **Scripts** : `Pactes.nombre()` · `Pactes.beni(id)`.

### `MarqueVivante` (v2 — sigils animés)
```
MARQUE          écran des sigils vivants
```
**Scripts** : `Marque.etat(id)` (pleine|felee|affamee|gonflee|creuse) ·
`Marque.etendue(id)` · `Marque.info(id)`.

---

## 4) 🐺 Mue · 🔥 Rêves · ⚔️ Résonance · 👁‍🗨 Monde te Lit

### `MueMaitrisee`
**Compétences à créer** (notetag dans la Note) : `<Mue>` (« Déchaîner », scope soi) ·
`<MueFin>` (« Reprendre forme ») · `<MueSkill>` (bestiale, utilisable en Mue).
```
MUE forcer <id>     transforme
MUE fin <id>        revient humain
```
**Scripts** : `Mue.actif(id)` · `Mue.controle(id)`. **Params** : seuil (40), toursBase
(3), boostAtk (60), degatsBonus (40), regen (8), coutCorruption (4).

### `RevesFeuAme`
```
REVE [id]           le héros le plus proche de sa Chute rêve (id force un héros)
```
**Auto** : après `FEUAME repos` / `FEU repos` (proba `autoRepos`, déf. 70 %).

### `Resonance`
**Compétences** : `<Resonance>` (scope 1 allié) · `<ResonanceUlt>` (ultime duo) ·
`<ResonanceFin>` (rompre). **Scripts** : `Resonance.actif()` · `Resonance.paire()`.
**Params** : seuilLien (5), aura (20), partage (35), backlash (15).

### `MondeTeLit`
**Notetag** : `<NoRead>` (PNJ qui ne réagit jamais). **Auto** : méfiance/peur/
effacement selon corruption/errance ; prix marchands gonflés. **Script** :
`MondeLit.reputation()`.

---

## 5) 🎯 Chasseurs · 🩸 Contagion · 🗡️ Objet Éveillé

### `ChasseursAme`
```
CHASSE on | off
CHASSE force [bete|errant|fond]     embuscade immédiate
```
**Params** : seuil (45), pasMin (40), chance (6), boost (35), troupeBete/Errant/
Dement (0 = pioche les rencontres de la carte). Épargne les cartes `<SafeZone>`.
**Script** : `Chasseurs.pression()`.

### `ContagionAme`
```
CONTAGION on | off
```
**Notetag acteur/classe** : `<Atone>` (capte à moitié). **Mécanique** : un membre
ACTIF au-dessus du seuil contamine les autres actifs — le mettre au **banc**
(formation) stoppe. **Params** : seuil (60), taux (1), pas (25), errance, enCombat.

### `ObjetEveille`
**Notetag arme** : `<Eveil>` (l'arme parle). **Params** : `heros` (1,2,3,4),
bavardage (25), ancreSeuil (85), ancrePurge (20). L'**Ancre** : à corr ≥ 85, l'arme
crie ton nom (1×/combat, corr -20).

---

## 6) 🌀🎭👁️ Le Dément

### `PlongerLac`
```
PLONGER            descend d'un palier (touche F)
REMONTER           refait surface
PLONGER on | off
```
**Notetag événement** : `<Cache>` (visible seulement en plongée). **Param** :
`switchLucide` (ON pendant la plongée → câble tes passages secrets dessus),
pasLucide (30), coutSAN (1). **Scripts** : `PlongerLac.lucide()` · `PlongerLac.palier()` (0-4).

### `TheatreDement`
```
THEATRE on | off
```
Sous la phase `seuilPhase` (3), l'interface ment (PV/noms/or brouillés, faux
journal). Trompe-l'œil : aucune vraie valeur touchée. Param : intensite (100).

### `LeMur`
```
MUR on | off
MUR forcer         déclenche une manifestation méta
```
Distorsion visuelle dès la Trame ; au Mur/Fond : lit ta partie (temps/sauvegardes/
Reprises), faux plantage, titre qui ment. Params : seuilDistorsion (3), seuilMur
(2), frequence (100). **À charger en dernier des plugins Dément.**

### `DementInterne`
```
HALLUCO [troopId]   combat-hallucination (sans butin, « Il n'y avait rien »)
DEMENTINT on | off
```
Sur `<DementTombe>` : parle avec vos répliques + Verbe « Viens » (attire un allié).
Params : autoHalluc (25), pasMin (35).

---

## 7) 🌍 La Chronique du Monde — `ChroniqueMonde`
```
CHRONIQUE region <Nom> etat <Texte_d_etat> [valeur 0-100]
CHRONIQUE region <Nom> valeur <+n|-n>
CHRONIQUE faction <Nom> <+n|-n>
CHRONIQUE pnj <Nom> <destin>
CHRONIQUE flag <cle> <valeur>
CHRONIQUE note <texte du journal…>
CHRONIQUE fin <id> "<Titre>"            débloque une fin
CHRONIQUE fin <id> secrete "<Titre>"     fin secrète (??? avant)
CHRONIQUE ecran                          l'État du Monde (3 pages ← →)
```
> Identifiants en **un seul mot** : `_underscores_` pour les espaces
> (`Royaume_Etoiles` → « Royaume Etoiles »).

**Scripts** : `Chronique.region('Nom')` → {etat,valeur} · `Chronique.faction('Nom')`
· `Chronique.pnj('Nom')` · `Chronique.flag('cle')` · `Chronique.finDebloquee(id)` ·
`Chronique.records()` → {corr,err,phase}.
**Fin secrète auto** : `l'Éveil` se dévoile aux 3 fonds (corr 100 + err 100 + phase 1).
**Menu** : « Chronique ».

---

## 8) 💀 Le Dément tombé — DÉJÀ CRÉÉ dans les données

> Rien à saisir : l'ennemi, les compétences et la troupe sont **dans le projet**.

**Compétences** (magie, base a.mat, coût 0) :
| ID | Nom | Formule | Portée | Anim |
|---|---|---|---|---|
| 461 | Verbe Brisé | `a.mat * 4 - b.mdf * 2` | 1 ennemi | 413 |
| 462 | « Reste. » | `a.mat * 2` (+Paralysie 70 %, état 136) | 1 ennemi | 417 |
| 463 | Murmure du Fond | `a.mat * 3 - b.mdf` (−1 SAN cible) | tous | 445 |
| 464 | Fausse Guérison | `a.mat * 3` (dégât sous anim de soin) | 1 ennemi | 449 |
| 465 | Regard du Fond | `a.mat * 5 - b.mdf * 2` | tous | 453 |

**Ennemi 404** — « Vesper, le Reflet du Fond » · PV 6500, MAT 210, AGI 160 ×1.5 ·
résiste Positif, faible Négatif · note `<DementTombe><Ame: curiosite><Marque: felee>`
· **Troupe 507** (intro au tour 0).

**Déclencher** : `DEMENT chute 4` (mise en scène) ou rencontres 201-204 (auto), ou
lancer la troupe 507 (test). Les plugins ajoutent : copie de vos skills, lecture
de vos Reprises, « Viens », vos répliques, mensonges d'UI. *(Change le
`battlerName` de l'ennemi 404 dans l'éditeur pour mettre le vrai portrait de Vesper.)*

---

## 9) 🧮 Annexes

### Formules (RPG Maker MV — champ « Formule »)
`a` = lanceur · `b` = cible. `a.atk a.def a.mat a.mdf a.agi a.luk a.hp a.mp a.mhp
a.level` · dégâts type 1 (PV), 3 (PM), soin 5 (PV). Ex. magie : `a.mat * 4 - b.mdf * 2`.

### Éléments (System.elements)
1 Physique · **2 Spirituel (Âme)** · **3 Positif (Esprit)** · **4 Négatif** ·
5 Sombre · 6 Originel · 7 AME · 8 Feu … *(les plugins lisent : elAme 2, elPositif 3,
elNegatif 4, elSombre 5, elPur 7, semiParfait 16).*

### États utiles
136 Paralysie · 134 Étourdi · 135 Sommeil Profond · 94 Gelure · 193 Doute Paralysant.

### Animations (catalogue 361-460, 4 teintes chacune)
413 Runes (Paroles) · 417 L'Œil · 421 Griffes (Bête) · 433 Drain · 445 Étoiles
noires · 449 Volutes d'âme · 453 Corruption/glitch · 457 Mains de l'ombre.

### Jauges de Chute (paliers)
Corruption : 0 Calme · 40 Frémissement · 70 Fièvre · 100 la Mue.
Errance : 0 Ancré · 40 Décharné · 70 Gonflé d'âmes · 100 l'Errant.
Santé mentale (phase) : 5 Maîtrise · 4 Stable · 3 Tension · 2 Instable · 1 Effondrement.
