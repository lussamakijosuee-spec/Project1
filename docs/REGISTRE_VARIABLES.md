# REGISTRE DES VARIABLES & INTERRUPTEURS — *L'Empire aux Trois Têtes*

> ## ⚠️ Ce registre décrit le **socle neuf**, qui n'est plus la base en place
>
> Le **2026-09-15**, JOKO a demandé de remettre l'ancien jeu : `data/` contient à nouveau la
> base d'origine — **1 258 compétences, 2 000 ennemis, 65 cartes**, et ses propres ID d'états et
> d'acteurs, qui ne sont **pas** ceux listés plus bas.
>
> - Les ID de la **base en place** sont dans **`docs/GUIDE_DEVELOPPEUR.md`**.
> - Les ID listés ici sont ceux du socle neuf, rangé dans **`_socle_neuf/`**.
>
> Le reste du document — les **plages réservées** et les **pièges MV** — vaut toujours : ce sont
> des conventions de projet, pas des données.

---

> **Le registre fait foi.** Avant d'employer une variable, un interrupteur ou un ID de base de
> données — en plugin comme en événement —, on l'inscrit ici. Une case vide est **libre** ; une
> case remplie est **prise**, même si le système qui la prend n'est pas encore codé.
>
> **État au 2026-09-14 :**
> — **variables 50-53 et 60-63**, **interrupteurs 20 et 21** : attribués à **`ETT_Faim.js`** ;
> — les autres plages : réservées, **aucune case attribuée** ;
> — **états et acteurs** : ID définitifs, [renseignés plus bas](#les-id-de-base-de-données).

---

## Les plages réservées

| Plage | Réservée à | État |
|---|---|---|
| **Variables 1 – 19** | **libre** — usage courant, scénario, événements ponctuels | vide |
| **Variables 20 – 49** | **manifestations** | vide |
| **Variables 50 – 69** | **faim** — *50-53 faim · 60-63 socle, pris par `ETT_Faim.js`* | **en service** |
| **Variables 70 – 89** | **Parole et cristaux** — *définis depuis le 2026-09-14 : voir [`CANON_LA_PAROLE.md`](CANON_LA_PAROLE.md)* | vide |
| **Variables 90 – 99** | **Culte** | vide |
| **Interrupteurs 20 – 49** | **systèmes** — *20 la nuit · 21 la Mue, pris par `ETT_Faim.js`* | **en service** |
| **Interrupteurs 200 – 231** | **`MOG_TimeSystem`** — phases, jours, saisons, mois, + le verrou météo | **en service** |
| **Variables 200 – 202** | **`MOG_TimeSystem`** — heure, jour du mois, année | **en service** |

| **Variables 300 – 340** | **`QuetesDuMonde`** — les compteurs de quête (chasse, visite, usage…), *nommés « Quête · compteur n »* | **en service** |

**Hors plage :** variables 100+ et interrupteurs 1-19 / 50+ ne sont pas réservés. Ils
s'inscrivent quand même ici, dans la dernière section.

---

## Interrupteurs 200 – 230 · le cycle du temps *(base restaurée)*

> Posés le **2026-09-15** en branchant `MOG_TimeSystem`. Les 31 cases étaient **vides**, et
> **aucune** n'était employée par un événement — mesuré sur les 67 cartes et les 1 000
> événements communs avant d'écrire. Elles portent toutes le préfixe **`TS ·`** dans l'éditeur.

| Id | Nom | Levé quand |
|---|---|---|
| 200 – 207 | `TS · Aube` · `Lever du jour` · `Jour` · `Coucher du soleil` · `Crépuscule` · `Nuit` · `Service de jour` · `Service de nuit` | la phase du jour en cours |
| 208 – 214 | `TS · Dimanche` … `TS · Samedi` | le jour de la semaine |
| 215 – 218 | `TS · Printemps` · `Été` · `Automne` · `Hiver` | la saison *(change tous les 3 mois)* |
| 219 – 230 | `TS · Janvier` … `TS · Décembre` | le mois |
| **231** | **`TS · Météo des saisons`** | **à lever à la main** — c'est le verrou maître des 4 événements communs de saison *(60 Spring · 61 Summer · 62 Fall · 63 Winter)*. Baissé, aucune météo saisonnière ne part. |

> ⚠️ **Ces quatre événements venaient de la démo MOG, et leur verrou tombait sur l'interrupteur
> 4** — qui est, dans cette base, **« combat boss1 »**. Tels quels, les feuilles d'automne
> seraient parties pendant un combat de boss. Le verrou a été déplacé sur le 231 ; le 4 est
> intact.

| Variable | Nom | Plage |
|---|---|---|
| 200 | `TS · Heure` | 0 – 23 |
| 201 | `TS · Jour du mois` | 1 – 30 |
| 202 | `TS · Année` | 1 et plus |

> ⚠️ **La démo MOG plaçait tout ça sur les interrupteurs 21-51 et les variables 10-12.** Sur
> cette base, ces cases sont prises : `ZK Âme 1-7` et `ZK Résultat` occupent 44-51,
> « maitrise de soi » sert **21 fois** et « concentration » **9 fois**. Recopier la démo telle
> quelle aurait fait basculer les interrupteurs de JOKO toutes les quelques secondes, sans
> un message d'erreur. **Ne jamais reprendre les ID d'une démo sans les mesurer d'abord.**

> ℹ️ Les **minutes et les secondes** vivent sur les variables **10101** et **10102** — hors de
> la portée de l'éditeur, c'est le choix par défaut de MOG pour ne pas consommer une vraie case.
> Ce n'est pas une erreur : ne pas les « corriger ».

> 🕳️ **Un trou dans un tableau de `System.json` fait planter le jeu.** Écrire l'index 200 d'un
> tableau long de 101 crée 99 cases vides ; `JSON.stringify` les écrit `null`, et
> `Olivia_MetaControls` appelle `.match()` dessus au démarrage d'une partie : l'écran-titre ne
> répond plus, **sans une erreur visible**. Après toute écriture dans `switches` ou `variables`,
> **combler les trous avec `""`**.

> ℹ️ Le mot **« manifestations »** est repris tel que JOKO l'a écrit en réservant la plage. Il
> n'est pas défini dans le lore lu à ce jour — voir la question ouverte correspondante dans
> [`GAME_DESIGN.md`](GAME_DESIGN.md), section **À TRANCHER**. La plage reste réservée en l'état ;
> rien n'y sera écrit avant réponse.

---

## Variables 1 – 19 · libre

| Id | Nom | Plage de valeurs | Qui l'écrit | Qui la lit |
|---|---|---|---|---|
| — | *(libre)* | | | |

## Variables 20 – 49 · manifestations

| Id | Nom | Plage de valeurs | Qui l'écrit | Qui la lit |
|---|---|---|---|---|
| — | *(réservé, non attribué)* | | | |

## Variables 50 – 69 · faim

> Écrites par **`ETT_Faim.js`** *(paramètres `varFaim` = 50 et `varSocle` = 60)*. Le plugin les
> **recopie**, il ne les lit pas : la vérité vit sur `$gameSystem._ettFaim`, conformément à
> [`CONVENTIONS.md`](CONVENTIONS.md) §4. Y écrire à la main ne change donc rien — pour agir,
> passer par `FAIM ajouter` / `FAIM nourrir`.

| Id | Nom | Plage | Qui l'écrit | Qui la lit |
|---|---|---|---|---|
| **50** | faim de **Vesper** *(acteur 1)* | 0 – 100 | `ETT_Faim` | événements, conditions de page |
| **51** | faim de **Ludwig** *(acteur 2)* | 0 – 100 | `ETT_Faim` | idem |
| **52** | faim d'**Aël** *(acteur 3)* | 0 – 100 | `ETT_Faim` | idem |
| **53** | faim de **Korrah** *(acteur 4)* | 0 – 100 | `ETT_Faim` | idem |
| 54-59 | *(libre — pour les acteurs 5+)* | | | |
| **60** | socle de **Vesper** | 0 – 70 | `ETT_Faim` | événements |
| **61** | socle de **Ludwig** | 0 – 70 | `ETT_Faim` | idem |
| **62** | socle d'**Aël** | 0 – 70 | `ETT_Faim` | idem |
| **63** | socle de **Korrah** | 0 – 70 | `ETT_Faim` | idem |
| 64-69 | *(libre — pour les acteurs 5+)* | | | |

**La faim et le socle sont deux nombres distincts, et c'est le cœur du système :**

- la **faim** est ce qu'on ressent maintenant — elle monte avec le temps, descend quand on mange ;
- le **socle** est le plancher de la faim. **Aucun repas ne descend en dessous, et il ne
  redescend jamais.** C'est 🟩 *« une faim qui ne peut pas être comblée »*, et 🟩 *« elle grandit
  de plus en plus si tu te nourris mal »*.

En fin de partie, un socle au-dessus de 40 laisse le porteur **en permanence au Frémissement**,
sans qu'il ait rien fait ce jour-là.

## Variables 70 – 89 · Parole et cristaux

| Id | Nom | Plage de valeurs | Qui l'écrit | Qui la lit |
|---|---|---|---|---|
| — | *(réservé, non attribué)* | | | |

## Variables 90 – 99 · Culte

| Id | Nom | Plage de valeurs | Qui l'écrit | Qui la lit |
|---|---|---|---|---|
| — | *(réservé, non attribué)* | | | |

## Interrupteurs 20 – 49 · systèmes

| Id | Nom | Ce que ON veut dire | Qui l'écrit | Qui le lit |
|---|---|---|---|---|
| **20** | **il fait nuit** | la nuit est tombée → la faim monte **deux fois plus vite** | **toi**, en événement *(aucun système de jour/nuit n'existe encore)* | `ETT_Faim` |
| **21** | **la Mue** | un porteur a atteint le maximum : **stade 4** | `ETT_Faim` | **toi**, en événement |
| 22-49 | *(libre)* | | | |

> ⚠️ **L'interrupteur 21 est une sortie de secours, pas une fin.** L'état du **stade 4 · la Mue**
> **n'existe pas en base** — tu ne l'avais pas demandé. Le plugin lève donc cet interrupteur et
> s'arrête là : c'est à un événement de décider ce qui arrive. Le jour où l'état existera, il
> suffira de renseigner le paramètre `etatMue`.

## Hors plage réservée

| Type | Id | Nom | Rôle | Qui l'écrit |
|---|---|---|---|---|
| — | — | *(rien)* | | |

---

# LES ID DE BASE DE DONNÉES

> Écrits dans `data/` le **2026-09-14**. Ce sont les ID **définitifs** : un plugin peut les
> mettre en `@param` et compter dessus. Vérifiés par `node bancs/1_base_de_donnees.js`.

## ÉTATS — `data/States.json`

| Id | Nom | Effet MV | Dissipation | Notetags pour les plugins |
|---|---|---|---|---|
| **1** | Mort | restriction 4 · EXR ×0 | aucune | ⚠️ **imposé par le moteur** : MV code `deathStateId = 1` en dur. Ne jamais déplacer. |
| **2** | Garde | drapeau de garde | fin de tour, fin de combat | état de la commande Garde du moteur |
| **3** | Manifestation brisée | ATQ ×0.5 · DÉF ×0.5 | **aucune — ne part pas seule** | `<manifestationBrisee>` `<facteurDon: 0.5>` |
| **4** | Masque brisé | ATQ ×0.5 · DÉF ×0.5 · HRG −2 %/tour | **aucune** | `<manifestationBrisee: porteur=Vesper>` `<retourDegats: pourcentPvMax=8, surType=sang>` `<regeneration: ratio=0.5>` |
| **5** | Amulette explosée | ATQ ×0.5 · DÉF ×0.5 · **scelle le type de compétence 11 (Ombre)** | **aucune** | `<manifestationBrisee: porteur=Ludwig>` `<scelleType: 11>` `<blocage: tours=4>` |
| **6** | En creuset | *(aucun trait)* | **à la prochaine attaque subie** (100 %) | `<creuset>` |
| **7** | Gelé | AGI ×0.5 · HRG −5 %/tour | 2 à 4 tours, fin de combat | `<gele>` `<degatsParTour: pourcentPvMax=5>` |
| **8** | En fuite | *(aucun trait — marqueur pur)* | **aucune** | `<marqueur: fuite>` — **porté en même temps qu'un vœu = vœu violé** |
| **9** | Stade 1 — Le Calme | ATQ ×1.05 | **aucune** | `<stade: rang=1, nom=Le Calme>` |
| **10** | Stade 2 — Le Frémissement | AGI ×1.15 | **aucune** | `<stade: rang=2, nom=Le Fremissement>` |
| **11** | Stade 3 — La Fièvre | ATQ ×1.40 · ATQm ×1.40 · DÉF ×0.60 · DÉFm ×0.60 | **aucune** | `<stade: rang=3, nom=La Fievre>` |
| **12** | Vœu mineur | ATQ ×1.20 · ATQm ×1.20 | **aucune** | `<voeu: rang=mineur, degats=1.20>` |
| **13** | Vœu majeur | ATQ ×1.50 · ATQm ×1.50 | **aucune** | `<voeu: rang=majeur, degats=1.50>` |
| **14** | Vœu absolu | ATQ ×2.00 · ATQm ×2.00 | **aucune** | `<voeu: rang=absolu, degats=2.00>` |

**Prochain id d'état libre : 15.**

> ⚠️ **Deux effets ne sont pas exprimables en traits MV** et attendent leur plugin — le trait
> posé n'en est que l'approximation visible, le notetag porte la règle exacte :
> le **retour de dégâts** du Masque brisé (MV n'a pas de trait « recul »), et le
> **multiplicateur de dégâts** des vœux (MV n'a que des taux d'ATQ / ATQm, pas de
> « dégâts infligés ×N »).
>
> ℹ️ Les **icônes** (`iconIndex` 1, 128, puis 4 à 15) sont des **repères provisoires** : elles
> pointent vers la rangée d'icônes d'état de l'IconSet. À choisir à l'œil dans l'éditeur.

## ACTEURS — `data/Actors.json`

| Id | Nom | Classe | Manifestation | Seconde jauge |
|---|---|---|---|---|
| **1** | **Vesper** | 1 · Chasseur de monstres | **Le Masque** — `objet`, endurance **140** | **Saturation** 0-100, rupture à 100 → `brisure` |
| **2** | **Ludwig** | 3 · Écrivain | **L'Amulette** — `objet`, endurance **90** | **Ombre** 0-100, rupture à 100 → `explosion` |
| **3** | **Aël** | 4 · Mage stellaire | **L'Arc** — `arme`, endurance **110** | — *(le propre d'une arme : aucune)* |
| **4** | **Korrah** | 2 · Chasseur d'insectes | **Les Poings** — `avatar`, endurance **160** | — *(le propre d'un avatar : aucune)* |

Les notetags, tels qu'ils sont dans le champ **Note** de chaque acteur :

```
Vesper  <manifestation: type=objet, nom=Le Masque, endurance=140>
        <jaugePropre: nom=Saturation, max=100, seuil=100, rupture=brisure>
Ludwig  <manifestation: type=objet, nom=L'Amulette, endurance=90>
        <jaugePropre: nom=Ombre, max=100, seuil=100, rupture=explosion>
Aël     <manifestation: type=arme, nom=L'Arc, endurance=110>
Korrah  <manifestation: type=avatar, nom=Les Poings, endurance=160>
```

> ⚠️ **Piège MV, à ne pas oublier en lisant ces notetags :** la métadonnée **garde l'espace
> après le `:`**. `<manifestation: type=objet…>` donne `" type=objet…"`. **`trim()` sur chaque
> valeur**, toujours. Le banc contrôle que l'espace est bien là.

**Prochain id d'acteur libre : 5.**

## LE RESTE DE LA BASE — écrit le 2026-09-15

> Vérifié par `node bancs/3_base_complete.js`, et **joué** par
> `node bancs/navigateur/jouer.js`.

| Fichier | Contenu | Repères |
|---|---|---|
| `Skills.json` | **25** | **1 Attaquer · 2 Se garder** *(imposés par le moteur)* · 3-6 communes · 7-9 sang *(Vesper)* · 10-13 ombre et âme *(Ludwig)* · 14-18 Parole *(Aël)* · 19-22 Maîtrise *(Korrah)* · 23-25 ennemis |
| `Items.json` | **12** | **1-7 la nourriture** *(lue par `ETT_Faim`)* · 8-11 soins · 12 laissez-passer |
| `Weapons.json` | **10** | **8 = L'Arc**, le Don d'Aël *(`<DonDe: 3>`)* |
| `Armors.json` | **10** | **7 Le Masque** *(Vesper)* · **8 L'Amulette** *(Ludwig — elle ouvre le type Ombre)* · **9 Les Poings** *(Korrah, slot Âme)* |
| `Enemies.json` | **8** | tous marqués `<origine: M>` — ils lâchent de la viande |
| `Troops.json` | **7** | **7 = la Bête de la Fièvre**, le combat de fin de tranche |
| `CommonEvents.json` | **3** | **1 Annone** · **2 La Mue** *(autorun sur l'interrupteur 21 → game over)* · 3 Repos |
| `Tilesets.json` | **3** | 1 Extérieur · 2 Intérieur · 3 Souterrain |
| `Map001-003` | **3 cartes** | 1 Quartier des chasseurs *(départ, 9·8)* · 2 Terrain de chasse · 3 Souterrain au sang pourri |
| `Animations.json` | **0** | aucune : tous les `animationId` sont à 0. À poser dans l'éditeur. |

> ⚠️ **Le drapeau qui casse tout en silence :** dans chaque tileset, **`flags[0]` doit valoir 16**.
> La tuile `0` signifie « pas de tuile », et MV la lit sur toutes les couches vides. À `0`, plus
> aucun mur ne bloque ; à `15`, la carte entière devient infranchissable. Le jeu se lance
> normalement dans les deux cas. `bancs/3_base_complete.js` le contrôle.

## Pour mémoire — classes et types

| | Id | Nom |
|---|---|---|
| **Classes** | 1 · 2 · 3 · 4 | Chasseur de monstres · Chasseur d'insectes · **Écrivain** *(mauvais combattant, voulu)* · Mage stellaire |
| **Slots d'équipement** | 1-7 | Arme · Bouclier · Tête · Corps · **Accessoire** · Talisman · **Âme** |
| **Types de compétence** | 1 · 2 · 9 · 10 · **11** | Capacité · Spéciale · Âme · Sang · **Ombre** *(celui que scelle l'état 5)* — 3 à 8 réservés |
| **Types d'arme** | 1,2,4,6,**7**,10,11,12,14,15 | Dague · Épée · Hache · Canne · **Arc** *(le Don d'Aël)* · Griffe · Gant · Lance · Ombre · Sang |
| **Éléments** | voir `docs/GAME_DESIGN.md` §2 | 1 Physique · 8-15 les huit · 17/19/20/22/23/29 les dérivés · 30 Mana positif · 31 Mana spirituel — **les trous sont volontaires** |

---

## Comment on inscrit une case

1. **Prendre le plus petit id libre** de la plage qui correspond au système. On ne saute pas de
   numéro « pour faire joli » : un trou, c'est une case qu'on croira libre dans six mois.
2. **Remplir les cinq colonnes.** « Qui l'écrit » et « qui la lit » sont les colonnes utiles :
   c'est là qu'on voit, avant de coder, qu'un système lit une variable que personne ne remplit.
3. **Renseigner la plage de valeurs** (`0-100`, `1-5`, `0/1`). Une variable sans borne écrite
   est une variable qu'on finira par dépasser.
4. **Le nom est celui du jeu**, pas celui du code : *« faim de Vesper »*, pas `_ettFaim1`.
5. Un id **n'est jamais réattribué**. Un système abandonné laisse sa ligne, marquée
   `(dormant)` — conformément à la règle « on ne supprime rien ».

## Ce qui ne va PAS dans une variable

Une variable / un interrupteur, c'est ce qu'un **événement** doit pouvoir lire ou écrire sans
script. Le reste vit sur `$gameSystem` ou `$gameActors` (voir
[`CONVENTIONS.md`](CONVENTIONS.md) §4) :

- un état interne que seul le plugin manipule ;
- une valeur par acteur qui n'a pas besoin d'être visible en événement ;
- tout ce qui est structuré (liste, objet, table) — une variable MV tient **un** nombre.
