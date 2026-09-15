# LE SOCLE NEUF — mis de côté, pas supprimé

> Le **2026-09-15**, JOKO a demandé de **remettre le jeu comme il était** : toute l'ancienne
> base, les 70 cartes, les événements — **sauf les plugins écrits par JOKO ou par Claude**.
> Seuls les plugins **tiers** (MOG, YEP, et les autres bibliothèques externes) tournent.
>
> Le « socle neuf » — la base de 17 fichiers écrite du 14 au 15 septembre, le plugin de la faim
> et ses bancs — **n'a pas été jeté**. Il est ici, entier, et se réinstalle en trois commandes.
>
> L'historique git est intact : git a enregistré des **renommages**, pas des suppressions.

---

## Ce qu'il y a dedans

| Dossier | Ce que c'est | Fichiers |
|---|---|---|
| `base_de_donnees/` | la base neuve : éléments à trous, 14 états, 4 classes, 4 acteurs, 25 compétences, 3 cartes | 17 |
| `bancs/` | les quatre bancs d'essai écrits pour cette base | 6 |
| `plugins/ETT_Faim.js` | **le système de faim** — la jauge, le socle, les quatre stades, les puretés | 1 |
| `plugins.js.socle_neuf` | l'ordre de chargement du socle neuf : une seule entrée, `ETT_Faim` | 1 |

## Ce qui n'est PAS ici — parce que ça n'a pas bougé

Ces fichiers sont restés dans `docs/`, ils valent toujours :

- `CONVENTIONS.md` — les règles d'écriture des plugins MV. Valables quelle que soit la base.
- `JOURNAL.md` — le journal du projet.
- `GAME_DESIGN.md` — l'extrait implémentable du lore, et le **suivi « À TRANCHER »**
  *(5 questions réglées, 11 ouvertes)*.
- `CANON_LA_PAROLE.md` et `CANON_LE_CORPS_ARTIFICIEL.md` — **du canon dicté par JOKO**.
  Ils ne dépendent d'aucune base.

`docs/REGISTRE_VARIABLES.md` décrit les **ID du socle neuf**, pas ceux de la base restaurée.
Il porte un bandeau qui le dit. Pour la base restaurée, les ID sont dans
`docs/GUIDE_DEVELOPPEUR.md`.

---

## Remettre le socle neuf

```bash
# 1 · mettre la base restaurée de côté à son tour (rien ne se supprime)
mkdir -p _base_restauree && mv data/*.json _base_restauree/

# 2 · la base neuve, les bancs, le plugin de la faim
mv _socle_neuf/base_de_donnees/*.json data/
mv _socle_neuf/bancs/* bancs/
mv _socle_neuf/plugins/ETT_Faim.js js/plugins/

# 3 · l'ordre de chargement
cp _socle_neuf/plugins.js.socle_neuf js/plugins.js
```

> ⚠️ `js/plugins.js` est **exclusif** : celui du socle neuf ne charge qu'`ETT_Faim`, celui de la
> base restaurée ne charge que les plugins tiers. Le remplacer éteint l'autre jeu — c'est voulu,
> les deux bases n'ont pas les mêmes ID.

## Reprendre une seule pièce

```bash
# juste le système de faim, par-dessus la base restaurée
mv _socle_neuf/plugins/ETT_Faim.js js/plugins/
# … puis ajouter son entrée dans js/plugins.js en reprenant plugins.js.socle_neuf
```

> Le plugin de la faim lit les **variables 50-53** et **60-63** et les **interrupteurs 20-21**.
> Sur la base restaurée, ces numéros peuvent déjà servir à autre chose : vérifier
> `docs/GUIDE_DEVELOPPEUR.md` avant de l'activer.

## Les bancs

`_socle_neuf/bancs/` mesure **la base neuve**. Relancés sur la base restaurée, ils échoueront —
c'est normal, ils n'ont plus la même matière à mesurer. Les bancs de la base restaurée sont
dans `bancs/`.
