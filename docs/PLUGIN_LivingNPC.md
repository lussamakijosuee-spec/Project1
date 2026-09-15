# PLUGIN — `LivingNPC.js` — TOUT

> **PNJ vivants « à la Skyrim ».** v1.0 · auteur JOKO · **activé** ✅ · 487 lignes.
> Dialogues réactifs, rumeurs au courant du monde, répliques d'ambiance flottantes (« barks »),
> et un **casting de 52 PNJ** prêts à poser par thèmes.
>
> Fichier : `js/plugins/LivingNPC.js`. Ne dépend d'aucun autre plugin.

---

## 1. CE QUE FAIT LE PLUGIN
- Tu poses un événement sur la carte, tu lui donnes une **clé de PNJ** (ex. `mira`), et il devient vivant.
- **Dialogue** riche quand on l'active : première rencontre différente des suivantes, éventuelle rumeur du monde, menu de **sujets** (topics) qui reboucle.
- **Barks** : de petites phrases s'affichent **toutes seules au-dessus du PNJ** quand le héros passe à côté — rien à câbler.
- **Rumeurs** : le monde « sait » ce qui s'y passe ; les rumeurs s'activent selon **tes interrupteurs d'histoire**.

---

## 2. POSER UN PNJ (l'étape obligatoire)
Sur l'événement de map, ajoute un **Commentaire** (`Commandes ▸ Commentaire`) contenant la clé :
```
<NPC: mira>
```
- La clé doit exister dans le casting (§4). Insensible à la casse.
- `<Bark: mira>` marche aussi comme identifiant (même effet pour les barks).
- Le commentaire est lu **sur la page active** de l'événement (codes d'événement 108/408).

Pour qu'il **parle** à l'action : déclencheur **Touche d'action**, puis une **Commande de plugin** :
```
NPC talk mira
```
S'il a des **barks**, ils apparaissent automatiquement dès que le joueur est proche — tu n'as rien d'autre à faire.

---

## 3. LES 4 COMMANDES (toutes commencent par `NPC`)
| Commande | Effet |
|---|---|
| `NPC talk <clé>` | ouvre le **dialogue complet** : accueil (1re fois ≠ suivantes) + rumeur (si le PNJ est « aware ») + menu de sujets (ou réplique simple) |
| `NPC bark <clé>` | **force** une réplique d'ambiance au-dessus du PNJ correspondant (ignore le délai) |
| `NPC rumeur` | affiche une **rumeur du moment** dans une fenêtre (crieur public, panneau, tavernier…) |
| `NPC mute <clé>` | **coupe les barks** du PNJ (clé = celle de l'événement qui exécute la commande) |

> `talk` et `bark` cherchent l'événement portant `<NPC: clé>` sur la carte ; si le PNJ n'a pas de barks, `bark` retombe sur son `hello`.

---

## 4. LE CASTING COMPLET — 52 PNJ
> Colonne **capacités** : `TOPICS` = menu de sujets · `réplique` = une ligne simple · `barks` = phrases d'ambiance auto · `rumeur` = glisse une rumeur du monde · `1re` = accueil spécial à la première rencontre.

### 4.1 — Civils interactifs (20) — les plus riches, avec menu de sujets
| Clé | Nom | Capacités |
|---|---|---|
| `mira` | Mira la tavernière | rumeur · 1re · TOPICS |
| `orin` | Orin le vieux pêcheur | rumeur · 1re · TOPICS |
| `lyse` | Lyse la marchande | rumeur · 1re · TOPICS |
| `tobias` | Tobias l'enfant | rumeur · 1re · TOPICS |
| `selena` | Selena la voyante | rumeur · 1re · TOPICS |
| `dame_elara` | Dame Elara, mage de la cour | rumeur · 1re · TOPICS |
| `roi` | Le Roi Aldric | rumeur · 1re · TOPICS |
| `reine` | La Reine Sériane | rumeur · 1re · TOPICS |
| `chambellan` | Le Chambellan | réplique · barks |
| `dame_cour` | Dame de la cour | rumeur · TOPICS |
| `regis` | Régis le Magnifique | rumeur · 1re · TOPICS · barks |
| `quentin` | Quentin | rumeur · TOPICS · barks |
| `muta` | Muta | rumeur · 1re · TOPICS · barks |
| `yuki` | Yuki la boulangère | rumeur · 1re · TOPICS · barks |
| `kaze` | Kaze | rumeur · 1re · TOPICS · barks |
| `sora` | Sora | 1re · TOPICS · barks |
| `ren` | Ren | rumeur · TOPICS · barks |
| `lila` | Lila | 1re · TOPICS · barks |
| `goro` | Goro | 1re · TOPICS · barks |
| `mei` | Mei | rumeur · 1re · TOPICS · barks |

### 4.2 — Soldats (7) — barks « garde de Skyrim »
| Clé | Nom | Capacités |
|---|---|---|
| `garde_ville` | Garde | rumeur · réplique · barks |
| `garde_porte` | Garde de la porte | barks |
| `sentinelle` | Sentinelle | barks |
| `capitaine` | Capitaine Vance | rumeur · réplique · barks |
| `recrue` | Recrue | barks |
| `veteran` | Vétéran | rumeur · réplique · barks |
| `chevalier` | Chevalier de la couronne | rumeur · réplique · barks |

### 4.3 — Lore (7) — porteurs d'histoire
| Clé | Nom | Capacités |
|---|---|---|
| `erudit` | Érudit Halewyn | réplique |
| `pretre` | Prêtre du Feu d'Âme | réplique |
| `archiviste` | Archiviste Nell | rumeur · réplique |
| `ermite` | L'Ermite | réplique |
| `barde` | Caelan le barde | réplique |
| `fossoyeur` | Le Fossoyeur | rumeur · réplique |
| `conseiller` | Le Vieux Conseiller | rumeur · réplique |

### 4.4 — Système (6) — PNJ de service (à coupler à un marchand, une auberge…)
| Clé | Nom | Capacités |
|---|---|---|
| `marchand` | Marchand | réplique |
| `guerisseur` | Guérisseuse | réplique |
| `forgeron` | Forgeron Bram | réplique · barks |
| `aubergiste` | Aubergiste | réplique |
| `banquier` | Changeur | réplique |
| `maitre_arme` | Maître d'armes | réplique · barks |

> Ces PNJ **ne font que parler** : branche toi-même la boutique / l'auberge / le soin après le `NPC talk` (voir recette §8.3).

### 4.5 — Ambiance (12) — la vie de la ville (barks seulement)
| Clé | Nom | Capacités |
|---|---|---|
| `paysan` | Paysan | barks |
| `mere` | Mère de famille | barks |
| `ivrogne` | Ivrogne | barks |
| `mendiant` | Mendiant | barks |
| `noble` | Noble | barks |
| `ouvrier` | Ouvrier | barks |
| `chasseur` | Chasseuse | rumeur · barks |
| `voyageur` | Voyageur | rumeur · barks |
| `servante` | Servante | barks |
| `cuisinier` | Cuisinier du château | barks |
| `page_cour` | Page | barks |
| `jardinier` | Jardinier | rumeur · barks |

---

## 5. LE DIALOGUE (`NPC talk`) — comment il se construit
Quand tu appelles `NPC talk <clé>`, le plugin monte le dialogue dans cet ordre :
1. **Accueil** : à la **première rencontre** il utilise `first[]` (si défini), sinon `hello[]`. Le « déjà rencontré » est mémorisé dans `$gameSystem._npcMet[clé]` → **sauvegardé**.
2. **Rumeur** : si le PNJ est `aware: true`, il glisse une rumeur active entre guillemets (voir §6).
3. **Le corps** :
   - s'il a des **`topics`** → un **menu de sujets** s'affiche (chaque sujet a un `label` + des lignes) ; après chaque sujet, **le menu revient** (boucle via étiquette `npcmenu`) jusqu'à « Au revoir » ;
   - sinon, s'il a des **`lines`** → une **réplique simple** au hasard.
4. Une ligne est piochée **au hasard** dans chaque liste (`hello`, `lines`, `barks`) → le PNJ ne se répète pas mot pour mot.

---

## 6. LES RUMEURS — « le monde est au courant »
Table `RUMORS` en haut du fichier. Chaque entrée = `{ sw: <interrupteur>, text: [répliques] }`.
- Une rumeur est **disponible** si `sw === 0` (toujours) **ou** si l'**interrupteur `sw` est ON**.
- `NPC rumeur` en pioche une au hasard parmi toutes les disponibles ; les PNJ `aware` en glissent une dans leur dialogue.

**Rumeurs livrées :**
| `sw` | Quand | Exemples |
|---|---|---|
| `0` | **toujours** | « Le Mana se dérègle… », « Méfie-toi des reflets… », « Une femme aux yeux de jade hanterait les rêves… » |
| `21` | interrupteur 21 ON | « Des étrangers tombent du ciel, comme invoqués. » |
| `22` | interrupteur 22 ON | « Jada… on murmure qu'elle voit à travers l'écran. » |
| `23` | interrupteur 23 ON | « Le Créateur existe pour de vrai. Il vit parmi nous. » |

> ⚠️ Les interrupteurs **21/22/23** sont des **exemples** : mappe-les sur TES vrais interrupteurs d'histoire (édite la colonne `sw` de `RUMORS`). Dans ton projet, 20-21 s'appellent « JJJ » / « JIJIJ » — à réconcilier.

---

## 7. LES BARKS — répliques d'ambiance flottantes (auto)
Aucune commande nécessaire : un PNJ avec `barks[]` lâche une phrase au-dessus de sa tête tout seul.

**Conditions d'apparition (par frame, hors fenêtre de message, sur `Scene_Map`) :**
| Règle | Valeur |
|---|---|
| Distance joueur ↔ PNJ | **≤ 7 cases** (Manhattan) **et** visible à l'écran |
| Délai avant qu'un même PNJ re-parle | **360 à 720 frames** (~6-12 s) |
| Délai global après un bark | **100 à 220 frames** ; **30** si aucun PNJ éligible |
| PNJ mis en sourdine (`NPC mute` ou `_barkMute`) | jamais de bark |

- Forcer : `NPC bark <clé>`. Couper : `NPC mute <clé>`.
- Les barks sont des sprites temporaires au-dessus de l'événement, retirés automatiquement.

---

## 8. RECETTES

### 8.1 — Une tavernière qui accueille et discute
```
Événement ▸ Déclencheur : Touche d'action
◆ Commentaire : <NPC: mira>
◆ Commande de plugin : NPC talk mira
```
→ 1re fois : accueil chaleureux + rumeur + menu (Le monde / Les rumeurs / Et toi ? / Au revoir).

### 8.2 — Un garde d'ambiance (aucune interaction, juste vivant)
```
Événement (mouvement libre)
◆ Commentaire : <NPC: garde_ville>
```
→ Il lâchera seul « Garde tes mains où je peux les voir. », « Le Mana se dérègle… » quand tu passes.

### 8.3 — Un PNJ « système » branché sur une vraie boutique
```
◆ Commentaire : <NPC: marchand>
◆ Commande de plugin : NPC talk marchand      (il te salue)
◆ Traitement d'une boutique : … (ta boutique RPG Maker classique)
```
Idem : `guerisseur` → soigner le groupe · `aubergiste` → repos · `forgeron` → `FORGE` · `banquier` → change.

### 8.4 — Un crieur public / panneau de rumeurs
```
◆ Commande de plugin : NPC rumeur
```

### 8.5 — Faire taire un PNJ trop bavard pendant une cutscene
```
◆ Commande de plugin : NPC mute      (depuis l'événement du PNJ concerné)
```

### 8.6 — Brancher une rumeur sur ton histoire
Dans `js/plugins/LivingNPC.js`, table `RUMORS`, remplace le `sw` d'exemple par ton interrupteur, ou ajoute une entrée :
```js
{ sw: 12, text: [ 'On dit que le pont de Valombre s\'est effondré cette nuit.' ] },
```
→ dès que l'interrupteur 12 est ON, la rumeur circule chez les PNJ `aware`.

---

## 9. AJOUTER / MODIFIER UN PNJ (dans le fichier)
Casting = objet `NPCS` (une entrée = une clé). Champs disponibles :
| Champ | Rôle |
|---|---|
| `name` | nom affiché dans la fenêtre |
| `type` | `civil` · `soldat` · `lore` · `systeme` · `ambiance` (indicatif) |
| `aware` | `true` → glisse une rumeur dans son dialogue |
| `first[]` | accueil à la **première** rencontre (facultatif) |
| `hello[]` | accueils suivants (piochés au hasard) |
| `lines[]` | réplique simple (si pas de `topics`) |
| `topics{}` | `{ clé: { label, lines[] } }` → menu de sujets bouclé |
| `barks[]` | phrases d'ambiance auto |

Exemple d'ajout :
```js
farah: { name: 'Farah la contrebandière', type: 'civil', aware: true,
    first: ['Chut. T\'as pas l\'air d\'un garde, toi. Approche.'],
    hello: ['De retour ? Qu\'est-ce qu\'il te faut ?'],
    topics: {
        marche: { label: 'Le marché noir', lines: ['Tout s\'achète. Même ce qui ne devrait pas exister.'] },
        rumeurs:{ label: 'Les rumeurs', lines: ['J\'entends des choses, aux docks…'] }
    },
    barks: ['Garde tes distances, la milice traîne.'] },
```
→ ensuite, sur la carte : `<NPC: farah>` + `NPC talk farah`.

---

## 10. DÉTAILS TECHNIQUES
- **Où c'est stocké** : `$gameSystem._npcMet` (PNJ déjà rencontrés) → **persiste à la sauvegarde**.
- **Lecture de la clé** : `Game_Event.prototype.npcKey()` lit les commentaires (codes 108/408) de la page active, avec cache par page.
- **Rumeurs** : `currentRumor()` filtre `RUMORS` par interrupteur ; `pick()` choisit au hasard.
- **Dialogue** : monté en liste de commandes d'événement puis `interp.setupChild(...)` (choix = codes 102/402/404, étiquette/saut = 118/119 pour reboucler le menu).
- **Barks** : `Spriteset_Map.prototype.updateBarks()` ajouté à l'update de la carte ; `Sprite_Bark` = sprite texte temporaire ; `forceBark(clé)` pour la commande.
- **Aucune dépendance** ni notetag de base de données : tout passe par le **commentaire d'événement** `<NPC: clé>` et les **commandes `NPC …`**.

---

> **Voir aussi :** `docs/RECETTES.md` §1 (recettes PNJ, dont PNJVivantsPlus qui ajoute réactions aux jauges,
> destin des PNJ et l'Envers), `docs/FICHE_COMMANDES_COMPLETE.md` (toutes les commandes), `docs/INDEX.md`.
> **Ne pas confondre :** `LivingNPC` (ce plugin, dialogues + barks + casting) et `PNJVivantsPlus` (réactions
> aux jauges, chute des PNJ, runes, l'Envers) — les deux cohabitent.
