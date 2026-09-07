# 🧪 Les bancs d'essai

Huit scripts qui vérifient le système **sans lancer le jeu**. Ils lisent les vrais fichiers de
`data/` et rejouent le vrai code de `js/plugins/` sur un moteur RPG Maker MV simulé.

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
| `audit/6_bestiaire.js` | les 400+ ennemis et les 41 boss |
| `audit/7_nouveau_lot.js` | les compétences, les apprentissages, le butin |
| `audit/8_tableau_de_chasse.js` | le Tableau de Chasse et les primes |

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
