# 📜 LA PAROLE, LE CRISTAL ET LES HÔTELS

> **Canon dicté par JOKO le 2026-09-14.** Transcrit **sans rien ajouter** : là où son texte
> s'arrête, ce document s'arrête. L'extrait implémentable est dans
> [`GAME_DESIGN.md`](GAME_DESIGN.md) ; les questions que ce canon ouvre sont en fin de page.

---

## Le principe de base

Un mage n'a **pas de manifestation spirituelle**. Le cristal ferme son canal spirituel au premier
contact, définitivement. N'ayant rien qui sorte de son âme, il a fallu construire.

Le cristal est un **filtre qui filtre par ressemblance**. Il est chargé de mana positif, donc seul
le positif passe. Le négatif et le spirituel ne sont pas interdits : ils sont **sans
correspondance**. Il n'y a rien dans la pierre à quoi ils puissent s'accorder.

Un cristal ne fabrique rien. Il prête. Et ce qu'il prête, il l'avait déjà.

## La Parole

Un sort se compose comme une phrase codée :

> **mot de passe + élément + sort**

Le mot de passe ouvre les canaux un instant, puis ils se referment. L'exactitude fait tout : une
syllabe fausse et rien ne vient.

Plus la phrase est longue, plus ça frappe fort, et plus ça demande de temps et de concentration.
Sous pression, une formule trop longue se brise. D'où le dilemme du lettré : **dire court et juste
bat presque toujours dire long et tremblant**.

## Les huit éléments

| Élément | Code | Élément | Code |
|---|---|---|---|
| Feu | 8 | Foudre | 12 |
| Eau | 9 | Glace | 13 |
| Vent | 10 | Lumière | 14 |
| Terre | 11 | Ombre | 15 |

## Les quatre formes

**Simple** — un élément, un sort.
*parole n°1, boule de feu*

**Fusion** — les codes s'**additionnent**, et ça crée un élément nouveau.
Feu (8) + Eau (9) = **17, Vapeur**

**Double élément** — les codes se **concatènent**, et les deux effets coexistent.
Vent (10) + Feu (8) → **1008** — *bourrasque de feu*

**Amplifiée** — un mot spécial multiplie la puissance du sort.
*parole n°8, amplification, bulle d'eau*

## La règle des fusions

Le total doit atteindre **16 minimum**. En dessous, échec — c'est ce qui protège les huit
fondamentaux.

- Terre (11) + Eau (9) = **Plante, 20**
- Feu (8) + Terre (11) = **Lave, 19**
- Terre (11) + Foudre (12) = **Métal, 23**
- Eau (9) + Glace (13) = **Givre, 22**
- Lumière (14) + Ombre (15) = **Crépuscule, 29**

Les fusions occupent 16 à 29, les concaténations commencent bien plus haut. Aucune collision
possible.

**Une précision à imposer** : écrire les codes sur **deux chiffres** à la concaténation. Sinon 108
peut se lire 10|8 ou 1|08. Vent devient « 10 », Feu devient « 08 », donc **1008**.

## Le prix

La Parole ne coûte ni humanité ni chair. Un mage à court de mana ne se transforme pas — il
s'épuise, ou tombe dans le coma. De la fatigue.

Il reste physiquement humain. Il ne gagne rien en corps. Il gagne un esprit plus clair, une
intelligence supérieure, une compréhension plus vaste.

Et c'est là qu'est le piège.

## Le paradoxe du lac sans fond

Tu dois plonger pour devenir puissant. Plus tu descends, plus tu comprends. Et il existe une
profondeur au-delà de laquelle comprendre est pire que mourir.

Personne ne sait où elle est avant de l'avoir dépassée. Pas de vertige, pas de palier, pas de
signal. On descend, on comprend mieux, on est promu — et un jour on comprend une chose de plus.

Le chasseur risque de devenir un monstre. Le mage risque de devenir **lucide**.

## Ce qui découle du cristal

Les Paroles peuvent être **gravées en chiffres** sur parchemin ou sur arme : ce sont les runes, et
elles agissent sans être récitées. C'est l'essentiel de l'armement stellaire, parce qu'un soldat
qui n'a pas le temps de réciter porte la phrase sur sa lame.

Le cristal se vide. Il faut le changer ou le recharger, aux **hôtels** — relais qui font point de
repos, de sauvegarde et de recharge.

Ce qui veut dire que **le mage a un coût logistique et le chasseur non**. Un chasseur descend
trois semaines sous terre avec lui-même. Un mage ne va nulle part sans réseau. Une carte des
hôtels est une carte de la portée réelle de la Démocratie Stellaire — et couper les hôtels
désarme une armée sans la combattre.

---

## Ce que ce canon corrige ou ajoute ailleurs

| Où | Ce qui change |
|---|---|
| `GAME_DESIGN.md` §2 | la composition d'un sort est **chiffrée** : quatre formes, la somme pour les fusions, la concaténation **sur deux chiffres** pour les doubles |
| `GAME_DESIGN.md` §4.3 | la lucidité a maintenant son **paradoxe** : le seuil fatal **n'est pas signalé**, ni par un palier, ni par un vertige |
| `GAME_DESIGN.md` §5 | le **cristal** devient une ressource consommable, avec un **coût logistique** |
| `GAME_DESIGN.md` §6 | trois systèmes nouveaux : le **cristal**, les **runes**, les **hôtels** |
| `_ancien_projet/03_lore_canon/` | les anciens textes parlent des **Mages des Étoiles**, de **Stellaria** et de la **République des étoiles** ; ce canon dit **Démocratie Stellaire** |

---

## ❓ Ce qui reste à trancher — je n'ai pas décidé à ta place

1. **Ombre + Ombre = 30**, et 30 est déjà **« Mana positif »** dans `data/System.json`. La règle
   « ≥ 16 » n'exclut pas les paires identiques, et 15+15 est la somme la plus haute possible.
2. **Huit sommes sur quinze n'ont aucun élément** : 16, 18, 21, 24, 25, 26, 27, 28. La règle dit
   qu'elles réussissent ; la base dit qu'elles ne donnent rien.
3. **Aël est « Mage stellaire » et porte `<manifestation: type=arme, nom=L'Arc>`.** Ce canon dit
   qu'un mage **n'a pas de manifestation**. Les deux ne tiennent pas ensemble.
4. **L'amplification** multiplie la puissance — de combien ?
5. **Démocratie Stellaire** : nouveau nom, ou nom qui remplace les trois autres ?
