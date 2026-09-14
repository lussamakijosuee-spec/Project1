# REGISTRE DES VARIABLES & INTERRUPTEURS — *L'Empire aux Trois Têtes*

> **Le registre fait foi.** Avant d'employer une variable ou un interrupteur — en plugin comme
> en événement —, on l'inscrit ici. Une case vide est **libre** ; une case remplie est **prise**,
> même si le système qui la prend n'est pas encore codé.
>
> **État : registre vide.** Les plages sont réservées, aucune case n'est encore attribuée.

---

## Les plages réservées

| Plage | Réservée à | État |
|---|---|---|
| **Variables 1 – 19** | **libre** — usage courant, scénario, événements ponctuels | vide |
| **Variables 20 – 49** | **manifestations** | vide |
| **Variables 50 – 69** | **faim** | vide |
| **Variables 70 – 89** | **Parole et cristaux** | vide |
| **Variables 90 – 99** | **Culte** | vide |
| **Interrupteurs 20 – 49** | **systèmes** | vide |

**Hors plage :** variables 100+ et interrupteurs 1-19 / 50+ ne sont pas réservés. Ils
s'inscrivent quand même ici, dans la dernière section.

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

| Id | Nom | Plage de valeurs | Qui l'écrit | Qui la lit |
|---|---|---|---|---|
| — | *(réservé, non attribué)* | | | |

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
| — | *(réservé, non attribué)* | | | |

## Hors plage réservée

| Type | Id | Nom | Rôle | Qui l'écrit |
|---|---|---|---|---|
| — | — | *(rien)* | | |

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
