# PLUGIN — `RoyaumeImperial.js` — TOUT

> **L'expansion de domaine de ludwing (le Symbole).** v1.0 · auteur JOKO · **activé** ✅ · 235 lignes.
> Il déploie son Royaume : **toutes les âmes reviennent**, **les invocations deviennent gratuites**,
> **ses stats se décuplent**, et il ouvre l'arsenal des Ténèbres.
>
> Fichier : `js/plugins/RoyaumeImperial.js`. ⚠️ **Charger APRÈS** `InvocationAmes`, `Errance`, `JadeEntitePlunging`.

---

## 1. CE QUE FAIT LE PLUGIN
Le skill **810 `<RoyaumeImperial>`** (à équiper sur **ludwing, acteur 3**) déploie le Domaine :
- **+30 âmes** d'un coup au stock (var 15) — ce qui, canon oblige, **coûte +15 Errance fixes**.
- **Invocations libres** : tant que le Domaine tient, les skills `<Invocation: n>` **ne coûtent plus d'âmes** et ne sont jamais grisés.
- **État 198 (Domaine)** : **MAT ×1.6 · MDF ×1.4 · ATK ×1.3**.
- Un **compteur cumulatif** d'âmes de toute la partie alimente l'Aspiration (voir §5).

---

## 2. RÉGLAGES (paramètres)
| Paramètre | Défaut | Rôle |
|---|---|---|
| `etatDomaine` | **198** | état du Domaine (stats décuplées) |
| `etatContre` | **199** | état Contre Totale |
| `etatTrauma` | **200** | état Traumatisé (prix de l'Aspiration) |
| `soulVar` | **15** | variable du stock d'âmes |
| `surgeDomaine` | **30** | âmes qui reviennent à l'ouverture |
| `aspirationParAme` | **6** | PV rendus par âme aspirée (× total de la partie) |

---

## 3. COMMANDE `DOMAINE`
| Commande | Effet |
|---|---|
| `DOMAINE ouvrir <id>` | déploie le Domaine sur l'acteur (mise en scène hors skill) |
| `DOMAINE fermer <id>` | referme le Domaine |

## 4. NOTETAGS (sur les compétences de l'arsenal)
| Notetag | Skill | Effet |
|---|---|---|
| `<RoyaumeImperial>` | **810** | déploie le Domaine (+30 âmes, +15 Errance, état 198) |
| `<Invocation: n>` | 811, 68… | dépense n âmes — **gratuit** dans le Domaine |
| `<SceauMagie>` | **68** Annihilation | PM de la cible **→ 0** + **MAT brisé 3 tours** (si le coup touche) |
| `<ContreTotale>` | **812** | état 199 : **tout** ce qui te frappe ce tour est **renvoyé à l'envoyeur** |
| `<AspirationDamnees>` | **70** | régen selon le **total d'âmes de la partie** + état 200 |

---

## 5. LES CHIFFRES EXACTS
### Déploiement (skill 810 ou `DOMAINE ouvrir`)
| Effet | Valeur |
|---|---|
| Âmes rendues (var 15) | **+30** (écriture directe : ne compte **pas** +2 Errance/âme) |
| Prix en Errance | **+15 fixes** (annoncé) |
| Compteur total de la partie | **+30** |
| État posé | **198** (MAT ×1.6 · MDF ×1.4 · ATK ×1.3) |

### Invocations libres (dans le Domaine)
- `canPaySkillCost` : un skill `<Invocation>` est payable si **TP et PM** suffisent (les âmes sont ignorées).
- `paySkillCost` : après paiement, le stock d'âmes est **remis à sa valeur** (dépense annulée).

### Annihilation `<SceauMagie>` (68)
- Si la cible subit des dégâts (ou l'effet s'applique) : **PM → 0** + `addDebuff(4, 3)` = **MAT baissé 3 tours**.

### Aspiration `<AspirationDamnees>` (70) — sur le **total d'âmes récoltées dans TOUTE la partie**
| Régen | Formule (total = âmes de la partie, `ASP` = 6) |
|---|---|
| PV | `min(PVmax, 6 × total)` |
| PM | `min(PMmax, floor(6 × total × 0.6))` = ~3.6 × total |
| Santé mentale | `+ floor(total / 15)` (via `Ame.bon`) |
| Prix | état **200 Traumatisé** posé sur le lanceur |

### Contre Totale `<ContreTotale>` (812) — état 199
- Tant que l'état 199 tient : chaque coup encaissé renvoie **exactement les mêmes dégâts** à l'attaquant (`gainHp(-value)`), qui peut **en mourir**.

---

## 6. SCRIPTS
```js
RoyaumeTenebres.total()            // âmes récoltées depuis le début de la partie
RoyaumeTenebres.domaineActif(3)    // true si le Domaine de ludwing (acteur 3) est ouvert
```
> Le **total** s'incrémente automatiquement à **chaque hausse** de la variable 15 (hook sur `setValue`).

---

## 7. RECETTES
### 7.1 — Donner le Domaine à ludwing
`Base ▸ Compétences` : skill **810**, Note `<RoyaumeImperial>` `<Parole: origine>`, portée « le lanceur ». Apprends-le à **ludwing (acteur 3)** — déjà câblé dans la classe 3 au niveau 1.

### 7.2 — Une compétence d'invocation gratuite en Domaine
```
Type : invocation (stype 8)   Portée : tous les ennemis
Note : <Invocation: 3>
```
→ coûte 3 âmes normalement, **0 dans le Domaine**.

### 7.3 — Mise en scène : ludwing ouvre son Royaume dans une cutscene
```
◆ Commande de plugin : DOMAINE ouvrir 3
◆ Texte : « Vous entrez chez moi, maintenant. »
◆ (combat)
◆ Commande de plugin : DOMAINE fermer 3
```

### 7.4 — Un boss qui aspire ses morts (réutiliser la mécanique)
Donne à un ennemi un skill avec `<AspirationDamnees>` — il régénérera selon le total d'âmes de la partie (attention : c'est **fort** en fin de partie).

---

## 8. DÉTAILS TECHNIQUES & PIÈGES
- **Stockage** : `$gameSystem._amesTotal` (compteur cumulatif) → **sauvegardé** ; l'état du Domaine vit sur l'acteur (état 198).
- **Le total ne baisse jamais** : dépenser des âmes ne le réduit pas (c'est un cumul historique) → l'Aspiration devient très puissante tard dans l'aventure.
- **Écritures directes** : le +30 d'ouverture et le remboursement des invocations écrivent dans `$gameVariables._data[15]` **sans** repasser par les hooks (pour ne pas déclencher +2 Errance/âme). Ne réplique pas ça à la main.
- **Ordre de chargement** : après `InvocationAmes` (sinon `<Invocation>` non reconnu), `Errance` et `JadeEntitePlunging` (le prix et l'Aspiration en dépendent).
- Skill **70** : son ancien `<Before Eval>` a été retiré — la régen passe désormais **uniquement** par le total cumulatif du plugin.

---

> **Voir aussi :** `docs/GUIDE_DEVELOPPEUR.md` (section Royaume Impérial + Ultimes des Sources),
> `docs/RECETTES.md` §14.2, `docs/FICHES_PLUGINS.md`, `docs/INDEX.md`.
> **Systèmes liés :** `InvocationAmes`, `Errance`, `UltimesSources` (les cartes finales des 4 héros).
