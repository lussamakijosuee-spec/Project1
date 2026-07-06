# Suite Ambiance & Chutes — README technique

Documentation unique de la refonte visuelle/sonore et de son intégration au lore.
Sert de **source de vérité pour l'ordre de chargement et les dépendances**.

---

## 1. Le canon (à connaître avant tout)

Trois jauges gouvernent l'ambiance. Toute la suite lit ces mêmes sources :

| Système | Défini par | Échelle | Paliers |
|---|---|---|---|
| **Santé mentale** | `JadeEntitePlunging` → `window.Ame` | jauge **1–10**, phase **1–5** (5 = sain) | Effondrement (1) · Instable (2) · Tension (3) · Stable (4) · Maîtrise (5) |
| **Errance** | `Errance.js` → `window.Errance` | `niveau` **0–100** | Ancré (<40) · Décharné (40) · Gonflé d'âmes (70) · l'Errant (100) |
| **Corruption** | `CorruptionAme.js` → `window.Corruption` | `niveau` **0–100** | Calme (<40) · Frémissement (40) · Fièvre (70) · la Mue (100) |
| **Voies** (Corps) | `MaitriseVoies.js` → `window.Voies` | `mastery` **0–40** | Dormante · Éveil · Adepte · Maître · Légende |
| **Paroles** (magie) | `ParolesSysteme.js` → `window.Paroles` | `tenue` **0–1** | fiabilité selon santé mentale × longueur |

**Règle d'or de l'ambiance** : rien ne se déclenche tant qu'on est « soi-même »
(phase ≥ 3, niveaux < 40). Le dread **commence à l'éveil** (phase 2 / niveau 40)
et **culmine à la Chute** (phase 1 / niveau 100).

---

## 2. Ordre de chargement

Charger dans cet ordre (les systèmes de base existent déjà dans ton projet) :

```
… (moteur, libs) …
JadeEntitePlunging      ← window.Ame      (déjà présent)
Errance                 ← window.Errance  (déjà présent)
CorruptionAme           ← window.Corruption (déjà présent)
MaitriseVoies           ← window.Voies    (déjà présent)
ParolesSysteme          ← window.Paroles  (déjà présent)

LoreCanon               ★ NOUVEAU — source de vérité (AVANT les HUD)

VisualOverhaul          ★ refonte visuelle générale (assez bas dans la liste)

ChutesCinematiques      (déjà présent)
ChutesDefinitives       (déjà présent, après ChutesCinematiques)
ChutesProgression       ★ voiles progressifs
ChutesHallucinations    ★ créatures / monde enfantin
ChutesLacMusique        ★ musique procédurale (3 voies)
ChutesMurmures          ★ murmures + poème des âmes (APRÈS ChutesLacMusique)
ChutesAnalogHorror      ★ VHS / analog horror (APRÈS ChutesLacMusique)

GuideVoiesParoles       ★ écran d'explication (APRÈS MaitriseVoies + ParolesSysteme)
```

★ = créé/retouché pendant la refonte.

---

## 3. Les plugins de la suite

| Plugin | Version | Rôle | Dépend de |
|---|---|---|---|
| `LoreCanon` | 1.0 | Noms de paliers + couleurs + jauge arrondie partagés. Aucun effet de jeu. | — |
| `VisualOverhaul` | 1.0 | Rendu net, fondus doux, fenêtres animées, jauges arrondies, vignette. | — |
| `ChutesProgression` | 1.0 | Voiles d'écran progressifs (violet Bête / vignette Errant / vert Fond). | Ame, Errance, Corruption |
| `ChutesHallucinations` | 1.0 | Errant → créatures d'ombre ; Dément → faux monde enfantin. | Ame, Errance |
| `ChutesLacMusique` | 2.0 | 30 mélodies WebAudio, 1 horreur par Chute (Errant/Bête/Fond). | Ame, Errance, Corruption |
| `ChutesMurmures` | 1.0 | Murmures « laisse-toi couler » + poème adapté au nb d'âmes. | Ame, ChutesLacMusique, Chutes |
| `ChutesAnalogHorror` | 1.0 | Écran-cassette VHS (scanlines, tracking, REC, pertes de signal). | Ame |
| `GuideVoiesParoles` | 1.0 | Écran clair expliquant Voies (maîtrise+Prix) et Paroles (fiabilité). | Voies, Ame, ParolesSysteme, LoreCanon |

Retouchés pour l'unification (repli sûr si `LoreCanon` absent) :
`Errance`, `CorruptionAme`, `Lore_SANEcran`.

---

## 4. Commandes d'événement

| Commande | Effet |
|---|---|
| `GUIDEVP` | Ouvre l'écran Voies & Paroles (à mettre derrière un livre / PNJ tuto). |
| `CHUTEPOEME [n]` | Récite le poème des âmes (n = forcer le nombre). |
| `CHUTELAC voie <errant\|bete\|fond> [%]` | Force une voie musicale. |
| `CHUTELAC play [thème] [%]` · `stop` · `auto on\|off` | Contrôle de la musique. |
| `CHUTEVHS off \| on \| burst \| niveau <%>` | Contrôle de l'effet VHS. |
| `CHUTEMURMURE off \| on` · `CHUTEPROG` (voir plugin) | Coupe/rallume les murmures. |

APIs script utiles : `ChutesLac.voie('bete',0.9)`, `Chutes.survivants()`,
`ChutesMurmures.nbAmes()`, `Voies.mastery(id,'forge')`, `Paroles.tenue(actor,skill)`,
`LoreCanon.errance(lv)` / `.corruption(lv)` / `.mental(phase)`.

---

## 5. Principe d'intégration (non destructif)

- Aucun plugin de la suite n'écrit dans `$gameScreen` (teintes d'événements intactes).
- Aucun ID d'image `showPicture` réservé (tout passe par des calques Sprite gérés).
- Chaque Chute ne réagit qu'à **sa** jauge (mental→phase, Errant→Errance, Bête→Corruption).
- Tout est paramétrable et désactivable dans le gestionnaire de plugins.
