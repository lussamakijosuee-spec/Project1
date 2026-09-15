# 🧪 Les bancs d'essai

Dix scripts qui vérifient le système **sans lancer le jeu**. Ils lisent les vrais fichiers de
`data/` et rejouent le vrai code de `js/plugins/` sur un moteur RPG Maker MV simulé.
Plus un onzième, `navigateur/jouer.js`, qui **ouvre le jeu pour de vrai**.

---

> ## ⚠️ Depuis la restauration du 2026-09-15 : six bancs sur onze ne peuvent plus tourner
>
> JOKO a demandé de remettre le jeu comme il était, **mais sans les plugins écrits par lui ou
> par Claude** : seuls les 42 plugins **tiers** (MOG, YEP, Aries, Olivia, Irina, TSR,
> Community_Basic) sont chargés. Les 135 plugins du projet sont rangés dans
> `_ancien_projet/02_plugins/`.
>
> Or six bancs **chargent le fichier d'un plugin du projet** pour le rejouer. Sans ce fichier,
> ils s'arrêtent sur un `ENOENT` — ils ne mesurent rien, ils ne sont pas en échec.
>
> | Banc | État | Ce qui lui manque |
> |---|---|---|
> | `4_un_seul_don.js` | ✅ **76 contrôles passés** | rien : il lit `data/` seul |
> | `audit/6_bestiaire.js` | ✅ **tout passe** | rien : il lit `data/` seul |
> | `audit/7_nouveau_lot.js` | ✅ **tout passe** | rien : il lit `data/` seul |
> | `navigateur/jouer.js` | ✅ **26 contrôles passés** | rien : il ouvre le jeu tel qu'il tourne |
> | `1_dons_spirituels.js` | ⛔ ne démarre pas | `DonsSpirituels.js` |
> | `3_avatar_spirituel.js` | ⛔ ne démarre pas | `DonsSpirituels.js` |
> | `6_avatar_niveaux.js` | ⛔ ne démarre pas | `DonsSpirituels.js` |
> | `2_evolution_paliers.js` | ⛔ ne démarre pas | `ObjetSpirituel.js` |
> | `5_verrou_et_ordres.js` | ⛔ ne démarre pas | `ObjetSpirituel.js` |
> | `audit/8_tableau_de_chasse.js` | ⛔ ne démarre pas | `ChasseAuxPrimes.js` |
> | `audit/9_equilibre.js` | ⛔ ne démarre pas | `SoulsDifficulty.js` |
>
> **Rien n'est cassé et rien n'est perdu.** Le jour où un de ces plugins revient dans
> `js/plugins/`, son banc se remet à mesurer tout seul, sans modification :
>
> ```bash
> mv _ancien_projet/02_plugins/systemes_du_jeu/DonsSpirituels.js js/plugins/
> node bancs/1_dons_spirituels.js
> ```
>
> *(Le remonter dans `js/plugins/` suffit au banc. Pour que **le jeu** le charge aussi, il faut
> en plus l'inscrire dans `js/plugins.js` — son entrée d'origine, réglages compris, est dans
> `_ancien_projet/02_plugins/plugins.js.ancien`.)*

---

## Comment on les lance

Il faut **Node.js** installé. Depuis la racine du projet :

```bash
node bancs/4_un_seul_don.js          # un seul banc
```

Ou tous d'un coup :

```bash
for f in bancs/*.js bancs/audit/*.js; do node "$f"; done
```

Chaque banc sort `✅ TOUT PASSE` ou la liste de ce qui cloche, et renvoie le code 1 en cas d'échec.

## Ce que chacun contrôle

| Banc | Ce qu'il vérifie |
|---|---|
| `1_dons_spirituels.js` | Endurance, jauges de Sang et d'Ombre, casse, ÷2, bonus de l'Avatar, repos |
| `2_evolution_paliers.js` | la montée Éclat → Forme → Résonance → Vérité — **et que l'acier, lui, ne monte pas** |
| `3_avatar_spirituel.js` | l'Avatar : son tour, son ciblage, son interception, ses trois postures |
| `4_un_seul_don.js` | **la règle d'or** : un seul Don par personne, 76 contrôles |
| `5_verrou_et_ordres.js` | le Don ne se retire pas / ne se prête pas · les trois ordres en combat |
| `6_avatar_niveaux.js` | les 3 niveaux de l'Avatar (25/50/85), le contrôle croissant, l'inséparabilité |
| `audit/6_bestiaire.js` | les 400+ ennemis et les 41 boss |
| `audit/7_nouveau_lot.js` | les compétences, les apprentissages, le butin |
| `audit/8_tableau_de_chasse.js` | le Tableau de Chasse et les primes |
| `audit/9_equilibre.js` | **l'équilibre mesuré** : TTK / TTD à chaque palier, contre le vrai bestiaire |
| `navigateur/jouer.js` | **le jeu, ouvert dans Chromium et joué à la touche** — 26 contrôles |

## `navigateur/jouer.js` — celui qui ouvre vraiment le jeu

Les dix autres **lisent des fichiers**. Celui-là lance le jeu, appuie sur les touches et
regarde : l'écran-titre, les plugins tiers effectivement chargés, la base entière relue par
le moteur, une nouvelle partie, la marche au clavier, le menu, l'écran des compétences, celui
de l'équipement, **un combat mené jusqu'à son terme**, **l'horloge qui tourne et la nuit qui
tombe**, **le chrono** — puis il compte les erreurs JavaScript et les ressources manquantes.

C'est le seul qui puisse dire si `js/plugins.js`, reconstruit à la main le 2026-09-15, tient
debout : une entrée qui désignerait un fichier absent ne lève **aucune erreur visible**, MV se
tait.

**Deux pannes qu'il a attrapées et que rien d'autre n'aurait vues :**

| Ce qu'on voyait | Ce que c'était |
|---|---|
| l'écran-titre s'affichait, et **« Nouvelle Partie » ne répondait plus** | 99 trous `null` dans `$dataSystem.variables`, créés en nommant la variable 200 d'un tableau long de 101. `Olivia_MetaControls` appelle `.match()` sur chaque nom au démarrage d'une partie |
| l'horloge s'affichait, mais mesurée sur la mauvaise case | le contrôle lisait `$gameVariables.value(200)` **choisi d'avance**. Il demande maintenant au plugin **quelles cases il emploie** (`$gameSystem._hour_variableId`) et lit celles-là. Un ID mal recopié se verrait aussitôt |

> Le deuxième est la règle n°2 appliquée au réglage d'un plugin : **on ne vérifie pas ce qu'on
> croit avoir écrit, on vérifie ce que le moteur emploie vraiment.**

Il n'est **pas automatique** — il lui faut Playwright et un serveur :

```bash
npx http-server -p 8899 -c-1 .        # dans un autre terminal, à la racine
node bancs/navigateur/jouer.js
```

Les captures atterrissent dans `bancs/navigateur/captures/` (non versionné).

## Pourquoi ils existent

Deux bugs sont passés à travers des tests écrits trop à la légère :

1. **Un passage de rééquilibrage écrit en Python** ignorait silencieusement toutes les formules
   contenant `b.def` — `def` est un mot-clé Python. Toutes les compétences **physiques** avaient
   été sautées. Les bancs sont en JavaScript depuis.

2. **`ChasseAuxPrimes` plantait à l'ouverture** parce que le test était écrit contre un
   `Window_Selectable` nu, sans les surcharges de `MOG_Scrollbar`, `MOG_CursorBorder` et
   `YEP_X_BattleSysCTB` qui appellent `select()` pendant l'initialisation.

D'où la règle : **un banc simule le moteur assez fidèlement pour attraper le bug, ou il ne sert à
rien.** `5_verrou_et_ordres.js` rejoue par exemple `changeEquip`, `clearEquipments` et
`optimizeEquipments` exactement comme MV les enchaîne.

## Si un banc échoue après une modification volontaire

C'est normal — ils encodent des attentes précises (nombre d'ennemis, nombre de compétences…).
Ouvre le fichier, la ligne du contrôle porte son libellé en clair. Corrige l'attente si le
changement est voulu ; corrige les données si ce n'en est pas un.
