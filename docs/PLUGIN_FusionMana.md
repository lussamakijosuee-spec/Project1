# PLUGIN — `FusionMana.js` — TOUT

> **La Fusion : fondre deux sources en une.** v2.0 · auteur JOKO · **activé** ✅ · 239 lignes.
> Trois fusions — **Chair d'Âme**, **Fil du Rasoir**, **Songe Incarné** — chacune plus forte qu'une
> source seule, mais qui **tire vers ses DEUX Chutes** à la fois.
>
> Fichier : `js/plugins/FusionMana.js`. ⚠️ **Charger APRÈS** `CorruptionAme`, `Errance`, `JadeEntitePlunging`.

---

## 1. CE QUE FAIT LE PLUGIN
Une compétence taguée `<Fusion: chair|rasoir|songe>` (skills **807/808/809**) fait entrer le lanceur en
**transformation** : gros bonus de stats, mais un **prix qui tombe à chaque tour** et **s'escalade**.
Fidèle au canon : chaque paire de sources tire vers **deux gouffres** — rester fusionné, c'est courir vers deux Chutes.

---

## 2. RÉGLAGES (paramètres)
| Paramètre | Défaut | Rôle |
|---|---|---|
| `soulVar` | **15** | variable du stock d'âmes |
| `coutAme` | **4** | Chair d'Âme : coût d'entrée en âmes |
| `erranceSansAme` | **18** | Chair d'Âme : Errance ajoutée si pas assez d'âmes |
| `coutMental` | **2** | Rasoir/Songe : lucidité perdue à l'entrée |
| `escalade` | **Oui** | le prix/tour grandit-il chaque tour ? |
| `acteurRequis` | **0** | réserve la Fusion à un acteur (0 = tous) |

---

## 3. COMMANDE `FUSION`
| Commande | Effet |
|---|---|
| `FUSION chair <id>` | entre en Chair d'Âme |
| `FUSION rasoir <id>` | entre en Fil du Rasoir |
| `FUSION songe <id>` | entre en Songe Incarné |
| `FUSION fin <id>` | sort de la Fusion active |

## 4. NOTETAG (sur une compétence)
```
<Fusion: chair>      (skill 807)
<Fusion: rasoir>     (skill 808)
<Fusion: songe>      (skill 809)
<FusionChair>        (ancienne note, = chair — toujours reconnue)
```

---

## 5. LES TROIS FUSIONS — TABLE COMPLÈTE
| Fusion | État | Anim | Entrée (prix) | Gain (défini dans States.json) | Prix / tour |
|---|---|---|---|---|---|
| **Chair d'Âme** (Âme→Corps) | **195** | 401 | **4 âmes** (sinon **+18 Errance**) | ATK ×1.45 · DEF ×1.30 · +12 % crit | **+4 Bête** · **+3 Errant** |
| **Fil du Rasoir** (Corps→Esprit) | **196** | 381 | **−2 lucidité** | AGI ×1.6 · ATK ×1.2 · +15 % crit +précision +esquive | **+3 Bête** · **−1 lucidité** |
| **Songe Incarné** (Esprit→Âme) | **197** | 413 | **−2 lucidité** | MAT ×1.5 · MDF ×1.30 · +12 % crit | **+3 Errant** · **−1 lucidité** |

### L'escalade du prix
- Le prix **Corruption** et **Errance** monte de **+1 par tour** au-delà du premier (`bonus = tours − 1`).
  Ex. Chair au tour 3 : **+6 Bête, +5 Errant**.
- La **lucidité** (santé mentale) **ne s'escalade pas** (jauge trop courte) : toujours **−1/tour**.
- Le prix est prélevé **au début de chaque tour** ; un message le rappelle **à partir du 2e tour**.

### Règles
- **Une seule Fusion à la fois** par acteur (si déjà fusionné, l'entrée est ignorée).
- La Fusion **tombe en fin de combat** (ou via `FUSION fin`).
- Si `acteurRequis > 0`, seul cet acteur peut fusionner (sinon message « ne connaît pas cette Fusion »).
- Aura colorée sur le sprite tant que la Fusion tient (chair violet-rouge · rasoir bleu · songe violet).

---

## 6. SCRIPT
```js
Fusion.actif(1)                 // 'chair' | 'rasoir' | 'songe' ou '' (rien)
Fusion.actif(1) === 'rasoir'    // condition
```

---

## 7. RECETTES
### 7.1 — Les 3 compétences de Fusion (déjà en base : 807/808/809)
`Base ▸ Compétences`, Note :
```
<Fusion: chair>      (807)   |   <Fusion: rasoir>  (808)   |   <Fusion: songe>  (809)
```
Portée « le lanceur ». Le plugin gère l'entrée, le prix et l'aura.

### 7.2 — Réserver une Fusion à un héros
Dans le gestionnaire de plugins, `acteurRequis = 1` → seul l'acteur 1 peut fusionner.

### 7.3 — Mise en scène (cutscene)
```
◆ Commande de plugin : FUSION songe 4     (Vesper matérialise ses visions)
◆ (combat)
◆ Commande de plugin : FUSION fin 4
```

### 7.4 — Aide au joueur : afficher le prix
`ClarteUI` lit déjà `<Fusion: X>` et affiche « Fusion + ses deux Chutes » dans l'aide de la compétence — rien à faire.

### 7.5 — La Fusion « technique » (un instant, pas une forme)
Voir plugin `FusionsEtendues` : `<FusionTech: chair|rasoir|songe>` (skills 821-823) applique **la moitié du prix, tout de suite**, sans transformation.

---

## 8. DÉTAILS TECHNIQUES & PIÈGES
- **Entrée par note** : hook sur `Game_Action.apply` (déclenché quand la compétence s'applique). Le flag `_fusionFaite` évite le double-déclenchement sur cible multiple.
- **Prix par tour** : hook sur `BattleManager.startTurn` ; compteur `_fusionTours` sur l'acteur.
- **Entrée Chair** : si tu as ≥ 4 âmes, elle **dépense 4 âmes** (via `setValue`, ce qui **compte** dans les hooks d'Errance/total) ; si tu n'en as pas assez, **rien n'est dépensé** mais **+18 Errance**.
- **États 195-197** : leurs bonus chiffrés vivent dans `data/States.json` — le plugin ne fait que **poser l'état** et prélever le prix.
- ⚠️ **Conflit historique résolu** : `ThylaneFormes` utilisait jadis 196/197 ; il a été repointé sur **205/206**. Si tu vois des Formes d'Aël sur 196/197 dans un vieux réglage, corrige-les.

---

> **Voir aussi :** `docs/GUIDE_DEVELOPPEUR.md` (section « la Fusion des Mana »),
> `docs/RECETTES.md` §3.8-3.9 & §14.1, `docs/FICHES_PLUGINS.md`, `docs/INDEX.md`.
> **Systèmes liés :** `FusionsEtendues` (technique/rune), `CorruptionAme` & `Errance` (les prix), `JadeEntitePlunging` (lucidité).
