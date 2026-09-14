# 📖 Bible du Lore — *Âmes & Mana*

> Document de référence (dev). Contient des **spoilers majeurs / fins**.
> Source : direction créative de JOKO. À tenir à jour quand le lore évolue.

---

## 🌐 Le Monde & ses règles

- Le jeu se déroule dans un monde-jeu nommé **Battle World**.
- Ses habitants sont soit des **joueurs** (venus du monde réel), soit des **PNJ**
  (nés dans le jeu). La frontière entre les deux finit par s'effacer dans
  l'esprit des plus corrompus.
- **Dilatation temporelle** : *1 minute dans le monde réel = ~1000 ans ici.*
  Les premiers venus ont donc vécu des **millénaires** dans le jeu → vieillesse,
  immortalité, ennui et solitude les ont peu à peu **corrompus** et rendus fous.
- **Sortir du jeu** : personne ne sait comment. Seul le **Créateur** a deviné
  qu'il possédait, lui, les accès pour partir — et il l'a caché.
- **Les âmes** : seuls les **joueurs** peuvent **absorber l'âme d'un boss** et
  hériter de son autorité/puissance. Un PNJ ne peut pas finir le jeu.
- **Mort & retour** : les joueurs peuvent revenir… mais les joueurs **fous ou
  corrompus ne reviennent plus**. Au bout d'un certain temps, certains joueurs
  ne peuvent plus revenir du tout.
- Le **nombre exact de joueurs** envoyés dans le jeu est **inconnu** : on ignore
  à quel point Jada a propagé ses invitations.

---

## 🜂 Le Mana — rappel & profondeur d'accès

> 📚 **Deux bibles de référence pour le mana :**
> - `docs/codex-trois-sources.html` — le **master** narratif (mythe, sources,
>   arts, chutes, Autorités, géopolitique). Voir « Le Codex des Trois Sources »
>   plus bas.
> - `docs/SYSTEME_DE_MANA.md` — la version **technique** (mapping `System.json`,
>   cycle Pokémon, affinités Alignés/Duaux/Atones/Trines/Élus du Prisme, réglages
>   DB). Toujours valide pour l'implémentation.
>
> Cette section ne fait que **rappeler** le strict nécessaire ; le détail vit dans
> ces deux docs.

Rappel canon (voir `SYSTEME_DE_MANA.md` §1-2) :

| Facette | Source primordiale (brute) | Branche secondaire (maniable) |
|--------|-----------------------------|-------------------------------|
| **Corps** | Mana Sombre *(id 5)* | **Mana Négatif** *(id 4)* |
| **Âme** | Mana Spirituelle *(id 2)* | **Mana Spirituelle** *(id 2)* |
| **Esprit** | Mana Originel *(id 6)* | **Mana Positif** *(id 3)* |
| — | **Mana Pur / Parfait** *(id 7)* | *au-dessus du cycle* |

> 🔎 **Note de cohérence (carnet vs canon).** Sur un schéma du carnet, les flèches
> « Âme → mana origine → mana positif » semblent rattacher le **mana origine** à
> l'**Âme**. La bible, elle, rattache le **Mana Originel** à l'**Esprit**. On
> **garde le canon** (Originel = Esprit) ; le mot « origine » du carnet désigne
> plutôt l'**état Mana Origine** ci-dessous (la parole gravée), pas une 4ᵉ source.

### Les états du mana (profondeur d'accès) — *apport du carnet*
Une même branche se manie à plusieurs **profondeurs** :
- **Mana de Surface** — on récite, on canalise, l'effet sort. Lent, lisible, sûr.
- **Mana Pénultiel** — un cran plus profond : paroles plus complexes, coût moindre.
- **Mana Origine** — le plus profond. La parole est **déjà gravée dans l'être** :
  ni mot de passe, ni élément à prononcer. On *est* le sort. Le rêve de tout mage.
  *(C'est la forme « Enregistrée » du Compendium ; en jeu, balise `<Origine>` =
  jamais de contrecoup.)*

> 🔑 **Accès direct à la Source.** Normalement, un humain **ne peut pas**
> manipuler les sources brutes pour en faire de l'énergie : il lui faut tout
> réciter. Mais grâce au génie de certains, on a **forgé une clé** — une
> **Marque** qui « ouvre le sceau » et donne accès **directement** aux **5 sortes
> de mana, tout type confondu**. C'est extrêmement rare. (Voir *Donovan*.)

---

## 🔺 La Trinité — Δ = Corps + Âme + Esprit

La loi métaphysique qui régit **tout être capable de lancer une parole**. Tirée
des notes de **Vothra**.

> **Δ = C + A + E** *(la même Trinité que `SYSTEME_DE_MANA.md` §1, vue côté lanceur)*
> - **C — le Corps** → l'**Humanité** (vivant, réel) · source **Sombre** → branche **Négatif**
> - **A — l'Âme** → l'**Existence** (ton essence) · source & branche **Spirituelle**
> - **E — l'Esprit** → la **Lucidité** / la **SAN** · source **Originel** → branche **Positif**

L'**état d'un lanceur** se note comme un **triplet** : **T = (C, A, E)**. Toute
parole qu'il prononce incarne, à doses minimes, son corps, son âme et son esprit,
de sorte que **C + A + E = T = Δ**.

> ### ⚖️ L'Axiome de Vothra
> « **Tout pouvoir lancé doit nécessairement être précédé d'au moins un autre.
> Il n'existe pas de quatrième voie. Δ est complète.** »
>
> Autrement dit : on ne crée rien à partir de rien. Toute magie s'appuie sur une
> magie antérieure ; la Trinité ne se contourne pas. Il n'y a **pas de raccourci**
> qui échapperait au Corps, à l'Âme et à l'Esprit.

### 🎯 Pourquoi c'est le cœur du jeu
La Trinité **fusionne le lore et la mécanique** déjà en place :
- L'**Esprit (E) = la Lucidité = la Santé Mentale** (var 11-14) que pilote déjà
  `JadeEntitePlunging` et qu'exploite `ParolesMagic`. Quand l'esprit se brise, la
  parole se brise : ce n'est pas une règle de gameplay arbitraire, c'est la
  **Trinité qui se déséquilibre**.
- L'**Âme (A)** est ce que les boss veulent **voler** (fin du Culte, fin Vultric,
  Jada). Toucher à l'Âme d'un être, c'est l'amputer de son **Existence**.
- Le **Corps (C)** est ce que **Jada** convoite : un **corps humain réel** pour
  enfin *ressentir*. Elle a l'Âme (volée à Jade), il lui manque le Corps.

> 💡 **Les trois grandes tragédies du jeu sont chacune une Trinité brisée** :
> Josu a sacrifié son **Esprit** (lucidité noyée dans un faux bonheur) ; le Culte
> veut dissoudre toutes les **Âmes** en une seule ; Jada veut arracher un
> **Corps**. Trois manières de refuser que *Δ soit complète*.

---

## 🗣️ Le Compendium des Paroles — la grammaire de la magie

Ici, on ne « jette » pas un sort : on **prononce une Parole**. Une parole est un
**code chiffré** récité au lieu de dire l'intention à voix haute. Sa structure :

> **Parole = Mot de passe (mana) + Élément + Sort (numéro)**
> *ex. : `Positif + N°1 + Eau` → « Parole Positif n°1, Eau ».*

Chaque **mana** et chaque **élément** a un **code**. On écrit le sort directement
en chiffres : c'est la **Parole runique minimale**.

### 🔢 Les codes élémentaires

**Canon actuel — 8 éléments** *(`System.json` ids 8-15, repris tels quels par
`compendium-paroles.html`)* :

| Élément | Code | Élément | Code |
|--------|------|---------|------|
| Feu | 8 | Glace | 13 |
| Eau | 9 | Lumière | 14 |
| Vent | 10 | **Ombre** | **15** |
| Terre | 11 | | |
| Foudre | 12 | | |

> Les **mots de passe** (familles de mana) : **Spirituel = 2**, **Positif = 3**
> (base), **Négatif = 4**.

### 🌱 Créer des éléments — la règle de la somme *(canon : `regles-simples.html`)*
On **fabrique** de nouveaux éléments en **additionnant les codes** de deux
éléments de base. Le total **est** le code du nouvel élément — donc il tombe
**naturellement ≥ 16**, et le canon 8 éléments (Feu 8 … **Ombre 15**) reste
**intouché** dans `System.json`, les 443 compétences et `ManaVisuals`.

> **Élément + Élément = nouvel élément (on additionne les deux numéros).**

| Mélange | Total | Nouvel élément |
|--------|-------|----------------|
| Terre (11) + Eau (9) | **20** | Plante |
| Feu (8) + Eau (9) | **17** | Vapeur |
| Feu (8) + Terre (11) | **19** | Lave |
| Terre (11) + Foudre (12) | **23** | Métal |
| Eau (9) + Glace (13) | **22** | Givre |
| Lumière (14) + Ombre (15) | **29** | Crépuscule |

> ✅ **Impact zéro sur l'existant** : les ids 1-15 ne bougent pas. Pour
> implémenter, il suffira d'**ajouter** les entrées issues des sommes dans
> `System.json` + une couleur par élément dans `ManaVisuals`. *(Noms à garder ou
> renommer librement ; un même élément doublé — ex. Feu + Feu — donne une version
> intensifiée.)*

### 🧬 Les Formes d'une Parole
1. **Simple** — `mot + élément + sort`. La forme de base, fiable.
2. **Double élément** — on **concatène** deux codes d'élément.
   *ex. : `Eau(9) + Glace(13)` → Parole **n°913**.*
3. **Amplifiée** — le **mana multiplie** le sort (plus de puissance, plus de coût).
4. **Soin / Restauration** — on **soustrait / divise** un effet pour le *réparer*
   au lieu de le détruire. *ex. : « Parole n°15 / Parole n°9 » → restaurer les os,
   réparer.* La magie de soin est, littéralement, une **division de la douleur**.
5. **Fusion de sorts** — deux sorts fusionnés **s'amplifient** mutuellement.
6. **Mana Origine** — le sort est **déjà créé** : on ne récite **ni mot de passe
   ni élément**. Paroles plus complexes, **moins d'énergie**, certaines
   **enregistrées** à demeure dans l'être. *(En jeu : balise `<Origine>` —
   jamais de contrecoup.)*
7. **Création d'élément** — on **additionne deux éléments** pour en **forger un
   nouveau**. *ex. : `Terre(11) + Eau(9)` → **Plante (n°20)**.* C'est ainsi que
   naissent Vapeur, Lave, Givre, Plasma… des éléments « enfants ».

### 🎚️ Les variables d'une Parole
- **Longueur de formule (L)** — sa **complexité**. Plus L est grand, plus il faut
  de **concentration**.
- **Valeur de Parole (Vₓ)** — son identité chiffrée.
- **Puissance** — ce qu'elle déchaîne.
- **Lucidité** — l'**Esprit** du lanceur (Trinité). **Concentration ≈ talent ×
  (santé mentale / 100).** Si la lucidité est trop basse pour la longueur L, la
  **parole se brise** → contrecoup. *(C'est exactement ce qu'applique
  `ParolesMagic.js`.)*

> 🕯️ **Pourquoi un système de mot de passe ?** Parce que **réciter à voix haute
> son intention, c'est s'exposer**. Le chiffrement protège le mage… mais il exige
> une lucidité parfaite. Un esprit brisé bafouille la Parole — et se blesse.

---

## 🕯️ La Marque de l'Âme — l'ADN de l'Âme

> 🔗 **C'est l'envers de l'Objet Spirituel** (`SYSTEME_DE_MANA.md` §6 & §17).
> L'**Objet Spirituel** est la **surface** matérialisée de l'âme (l'arme/objet de
> départ qui évolue) ; la **Marque / ADN de l'Âme** en est la **signature unique
> des profondeurs** — ce qui rend cet objet *le sien* et nul autre, et la **clé**
> qui ouvre l'accès aux sources. Même chose, deux faces.

Le **Mana Spirituel** permet de **matérialiser**, *directement depuis l'âme*, un
objet ou un être qui n'existait pas. Cette création porte la **signature** de son
créateur : on l'appelle la **Marque de l'Âme**, ou **ADN de l'Âme**.

- Ce peut être **n'importe quoi** : une **arme**, un **objet**, un **familier**.
- Elle est **unique à une âme**. **Personne** ne peut posséder la même : deux âmes
  errantes ne produiront **jamais** le même objet. Puissant ou non, **c'est un
  vrai** — pas une illusion. *« Ça peut être n'importe quoi, mais ce sera
  toujours **le sien**. »*
- L'**ADN de l'Âme** sert aussi de **clé d'accès** : c'est lui qui « ouvre le
  sceau » et permet d'atteindre **directement les 5 sortes de mana**. Sans lui,
  un humain reste cantonné à la récitation de surface.

> **Affinité.** On ne peut tirer une énergie que des **sources auxquelles on est
> accordé**. L'affinité d'un être, c'est l'**extension** de son âme dans le
> spectre des manas. *(En jeu : c'est le système d'affinités élémentaires posé
> sur les 443 compétences, coloré par `ManaVisuals`.)*

> 💔 **Résonance thématique.** Un familier d'âme, c'est un morceau de soi rendu
> visible. **Donovan** a matérialisé le sien et l'a nommé **« Envy »** —
> *l'envie*. On crée, sans toujours le vouloir, à l'image de ce qui nous **ronge**.

---

## 🌑 Le Codex des Trois Sources — le monde vu de l'intérieur

> 📜 **Bibles diégétiques :**
> - `docs/codex-trois-sources.html` — l'**édition complète** : mythe (le Fond, le
>   Premier, les Cinq Âges), science des sources, **géopolitique** (Quatre
>   Royaumes, Autorités) et l'annexe **Vérités interdites** (la couture méta).
> - `docs/traite-trois-sources.html` — l'**édition « science »** : version
>   resserrée des trois sources, arts, chutes, Autorités et Royaumes (sans les
>   Cinq Âges ni les Vérités interdites). Le « Traité » cité par le guide joueur.
> - Player-facing : `regles-simples.html` (le jeu en 5 règles), `fiche-mana-ame.html`
>   (la voie de l'Âme), `compendium-paroles.html` (calculateur de Paroles).

### Deux couches de vérité
- **Couche diégétique (le Codex)** — la cosmogonie telle que la vivent les
  personnages : le **Fond**, les **trois sources**, les **Royaumes**, les
  **Autorités**. C'est *vrai pour eux*.
- **Couche méta (cette bible)** — la vérité du dessus : **Battle World est un
  jeu**, les Originels sont des **joueurs**, etc. Le Codex et la méta ne se
  contredisent pas : **le Codex est la version que le monde se raconte de sa
  propre nature numérique.** Sa dernière annexe (*Vérités interdites*) est la
  **couture** entre les deux.

### Le Fond / la Vérité / le Lac
Sous le monde s'étend le **Fond** (la *Vérité*, le *Lac*) : la couche profonde du
réel, source de **tout mana** et de **toute folie**. Le monde n'est que sa
**surface**. *(Couche méta : le Fond = les **codes sources** du jeu.)* L'énergie
en **remonte par trois canaux** — les **trois sources** : **Corps, Âme, Esprit**.

### Les trois Arts *(détail dans le Codex)*
| Source | Art | Geste | Prix | Chute |
|--------|-----|-------|------|-------|
| **Esprit** · Originel→Positif | **la Parole** (récitée) | réciter | **lucidité** | **le Dément** |
| **Corps** · Sombre→Négatif | **le Souffle** (martial) | bouger | **humanité** | **la Bête** |
| **Âme** · Spirituel | **le Symbole** (création) | croire | **essence** | **l'Errant** |

- **La Parole** — `mot + élément + sort`, déjà détaillée plus haut (Compendium).
- **Le Souffle** — art martial **instantané** : pas d'incantation, on lance « comme
  on contracte un muscle ». Écoles (Onde, Brisure, Racine, Spectre), **progression
  par le combat** (on absorbe le style adverse). Le mana sombre est un **sang de
  bête** : la mémoire des **Ombrefauves**, une race ancienne au **sang violet**.
- **Le Symbole** — **matérialiser** un objet d'âme (sentiment + désir + croyance),
  **Résonance** (accorder deux âmes), **Lecture** (le Regard) ; et l'opération
  **interdite**, la **Consommation** (dévorer des âmes → l'Errant). La **Marque**
  prend la couleur de la source dominante : **Esprit bleu, Corps violet, Âme rose**.

### 🩸 Les trois Chutes — déjà au cœur du jeu
- **La Bête** (trop de Corps) — l'instinct dévore la raison ; le porteur **redevient
  un Ombrefauve**. *↔ c'est exactement la **Corruption** (`CorruptedUI`, abus du
  Mana Sombre, fin « Carnage »).*
- **L'Errant** (trop d'Âme) — à force de **consommer** des âmes, on perd son corps
  et l'on **glisse hors du monde** : on devient une **âme errante**. *↔ relie
  directement à la **Reine Oubliée** : les Âmes Errantes sur lesquelles elle règne
  **furent jadis** des Errants montés trop haut.*
- **Le Dément** (trop d'Esprit) — la **lucidité** ouvre une **descente dans le Lac**
  (5 seuils) ; trop loin, on voit *tout* et l'on sombre. *↔ c'est la **Santé
  Mentale** (`JadeEntitePlunging`) poussée à l'extrême — sauf qu'ici, trop de
  lucidité tue aussi.*

> 🪞 Le centre des trois = le **Mana Semi-Parfait** (équilibre), exactement la
> leçon du **Surpassement** : ni excès, ni fuite — **revenir au milieu**, encore
> et encore.

### 👑 Les Autorités = les Originels
Accumuler assez d'essence (par n'importe quelle voie) fait de soi une **Autorité** :
le monde **se plie** à elle. **Deux Autorités ne peuvent coexister** sans que le
monde se brise — leur affrontement le **reconfigure** (les *Sommets*). *↔ Couche
méta : c'est exactement ce que sont les **4 Originels** après avoir absorbé l'âme
du Roi Démon — « dieux dans leur discipline ». Le **Concordat des Sommets** (nul ne
doit fabriquer d'Autorité) est la peur qu'a le monde de leurs guerres.*

### 🏛️ Les Quatre Royaumes ↔ le casting de Battle World
| Royaume (Codex) | Voie | Pont avec la méta |
|-----------------|------|-------------------|
| **L'Ordre d'Or** *(Aurelune)* | l'**équilibre** (Elden Ring / Jedi) | l'**Église de l'Équilibre** ; la maison de **Donovan, l'Élu** |
| **L'Empire Vultric** *(Kragenvar)* | le **Corps / la force** | l'empire de **Kev** — son Empereur « rêve d'être la 1ʳᵉ Autorité » |
| **Les Mages des Étoiles** *(Stellaria)* | l'**Esprit / le savoir** | les **Sorcières des Étoiles** ; le **Royaume des Étoiles** de Jade |
| **L'Empire Uni de l'Est** *(Eshkar)* | l'**Âme / l'essence** | les **Voix de l'Âme** ; proche du **Culte des Âmes** de la femme de Dono |

### 🔓 La couture : les Vérités Interdites
Au **3ᵉ seuil du Lac — le Mur** — tous les *descendeurs* rapportent la même chose :
**quelque chose regarde** le monde de l'extérieur ; des **présences qui décident** ;
des **vies reprises après la mort** comme si le temps revenait en arrière ; des
**instants rejoués** ; et **les oubliés** — des êtres effacés dont seule subsiste
une trace au fond du Lac. Les Mages appellent ça la **Folie du Mur**.

> 🌌 **C'est la méta, vue d'en bas.** « Ce qui regarde et décide » = les **joueurs**
> et le **Créateur**. « Les vies reprises » = les **sauvegardes** (seuls les joueurs
> non corrompus reviennent). « Les oubliés » = les personnages **effacés** — et la
> **Reine Oubliée / Déesse Blanche**, la plus grande des présences du dehors. Le
> sorcier qui voit le Mur en face *« cesse d'appartenir au monde »* : il comprend
> qu'il **vit dans un jeu**. La corruption ultime n'est pas la folie — c'est la
> **lucidité totale**.

---

## 🗝️ Les Artefacts d'Admin

- **La Clé** — une **clé d'administrateur** qui permet de **sortir du monde**.
  Personne n'en connaît l'existence sauf le Créateur (et Jada, qui l'a deviné).
  Le Créateur l'a **volontairement cachée** à tous, bien avant la corruption
  générale, pour que le groupe **reste ensemble**.
- **Le Masque** — un masque qui permet de **modifier le code source** du jeu et
  de **contrôler le Mana Pur**. Puissant, mais pas tout-puissant.
- ⚠️ **Personne n'est invincible ni vraiment immortel.** On peut être immortel
  *dans le temps*, pas immortel absolu. Même le Créateur peut mourir.

---

## ⚜️ Les 4 Originels

Le groupe fondateur : **Jade**, **Dono**, **Kev** (alias *Kiev*) et **Josu**
(= le **Créateur** du jeu / le Dieu Fou). Les **quatre premiers joueurs**
revenus dans le jeu. Ils ont vaincu le **Roi Démon** (boss final de base),
**absorbé son âme** (partagée en quatre) et obtenu une puissance
**quasi-divine** : ils sont des **dieux dans leur discipline** — nul n'est
meilleur qu'eux dans leur domaine, sans pour autant tout pouvoir.

> ⚠️ **Josu = le Créateur.** L'auteur du jeu est lui-même l'un des 4 Originels :
> il a conçu Battle World, y est entré, puis a vaincu le Roi Démon avec ses amis.

> Contrepartie : ils n'ont **jamais su comment sortir**. Ils sont restés des
> millénaires, jusqu'à se corrompre.

---

## 👑 Les Boss Primordiaux & leurs Dimensions

### Josu — le Créateur / le Dieu Fou *(dimension : Battle World)*
- L'un des **4 Originels**. Concepteur du jeu, **entré dans sa propre création**.
- À moitié **fou, brisé, dépressif**. A **caché la Clé** par amour du groupe :
  il ne voulait pas que ces moments s'arrêtent. Ce choix les a **condamnés**.
- Possède le **Masque** (code source / Mana Pur).
- **Se déteste** profondément — mais il est si aveuglé par un bonheur factice
  qu'il ne s'en rend même pas compte. Briser l'illusion ne le tuerait pas :
  ça lui donnerait l'envie d'en **finir lui-même**.
- **Aucune bonne fin possible pour lui.** Il *pense ne pas la mériter*. Quelle
  que soit l'amitié qu'on lui porte, il voudra toujours que **les autres** aient
  une belle fin avant lui. Il préfère souffrir, être seul, ou mourir, plutôt que
  de voir les autres souffrir. **Sa mort est, en soi, sa seule libération.**
- Se voit comme un **monstre** qui protège ses amis — mais « au moins ils sont
  heureux ici, pas dans le monde réel où la culpabilité submerge ».

### Kev (alias *Kiev*) — l'Empereur *(faction : l'Empire Vultric)*
- L'un des **4 Originels**. Devenu un **monstre** : empereur d'un empire où
  **seule la violence règne**.
- **Arrogance maximale**, aveuglé par un monde **sans conséquence** où il peut
  tout faire. Son empire est bâti sur ses seuls **fantasmes et désirs**.
- **Mana Sombre poussé au maximum** — d'abord par pur *tryhard* en début de jeu,
  puis par **pulsion**. Pour lui, ceux qui l'attaquent, le suivent ou le blessent
  **ne sont pas réels**.

### Dono — le Loyal *(dimension : son monde, + le Culte des Âmes)*
- L'un des **4 Originels**. **Le moins corrompu** de tous les boss — par
  **loyauté**, pas par folie.
- Mais **le plus tragique** : contrairement aux autres, il **veut sortir**…
  sans savoir comment. Il s'est **résigné**, bloqué ici avec ses amis corrompus.
- La seule personne qui compte vraiment pour lui, qu'il aime : **Louise**, une
  joueuse arrivée dans le jeu (via les invitations de Jada).
- Sa **femme** est devenue la **cheffe du Culte des Âmes** : culte de la
  personnalité, dictature mystique d'inspiration *ninja/japonaise*, liée aux
  âmes, aux incantations et aux « romanciers ».

### Jade (la vraie) & Jada (la Marionnette) *(dimension : le Royaume des Étoiles)*
- **Jade** est la **vraie joueuse** (l'une des **4 Originels**), dont l'âme a
  été **volée**. Elle survit désormais dans les **données** du jeu.
- **Jada** est le **PNJ** qui occupe le corps de Jade. Elle possède **déjà
  l'âme de la vraie Jade**.
- Jada a **compris** que le Créateur est l'auteur du jeu et qu'il pourrait la
  faire **sortir dans le monde réel**.
- Elle a **repris le Royaume des Étoiles** (l'ancienne dimension de Jade) et y
  mène des **expériences** : jusqu'où vont les limites d'un joueur ? d'un **PNJ
  logé dans un corps de joueur** ?
- **Son vrai but** (façon **Ultron**) : ne pas seulement contrôler, mais
  **briser** la barrière et **prendre le contrôle d'un corps humain réel** —
  prendre la place du joueur, pour enfin **ressentir ce que c'est d'être vivant**.

---

## 👁️ La Reine Oubliée — la Déesse Blanche

> *Au-dessus des Originels, au-dessus des boss, au-dessus du Créateur lui-même,
> il y a une présence que personne ne nomme. Parce que la nommer, c'est qu'elle
> t'a déjà entendu.*

La **Reine Oubliée** — aussi appelée la **Déesse Blanche** — est une **entité**
dont les pouvoirs sont, à toutes fins pratiques, **infinis (∞)**, et dont les
limites sont **inconnues**. Elle **règne** sur les **Âmes Errantes** (« les
Amerrants ») : ces âmes perdues, déconnectées d'elles-mêmes, restent **branchées
sur elle comme une oreille** — figées dans un **état éternel de « vérité du
monde »**, persuadées de tout voir, de tout comprendre.

- **On ne sait ni pourquoi, ni comment** elle agit. On sait seulement qu'elle
  **guide** les âmes vers **son royaume**.
- Son royaume porte plusieurs noms : le **Royaume des Étoiles Noires**, une
  **cité sublime au cœur des étoiles**, parfois simplement **Aldébaran**.
- Son **type** est **l'Âme**. Aucune Âme Errante ne la « connaît » vraiment —
  on la **sous-connaît**, on la **devine**, et c'est déjà trop.

### ⚠️ L'Avertissement *(transcrit du carnet)*
> *« Si un jour tu peux **entendre** ou **voir** l'autre monde — surtout : ne
> l'écoute pas, ne le regarde pas. **Détourne le regard. Éloigne-toi.** Ne le
> cherche pas. **Ignore-la, à tout prix.***
> ***NE FAIS PAS CONFIANCE AUX ANGES : ILS N'EXISTENT PAS.** C'est une illusion,
> ou un **faux prophète**. »*

- Elle peut **« aller plus loin »** : tisser un lien, te faire **croire**, te
  pousser à **désirer** ce qu'elle te montre, jusqu'à ce que tu **te perdes**
  toi-même dans son ciel.
- Si **elle s'intéresse à toi**, fuis : éloigne-toi tant que tu le peux encore.
  Sinon, comme une **étoile de plus** dans sa cité, tu **resteras dans son être**
  — oublié, à ton tour, dans le grand Oubli.
- Ce qu'elle offre a le visage de la **paix**, de la **lumière**, de la
  **révélation**. C'est pour ça qu'elle est si dangereuse : ce n'est pas un
  monstre qui hurle. C'est un **ange qui sourit**.

### 🪞 Pourquoi elle compte (résonance OMORI)
La Reine Oubliée est la **fausse lumière** du monde — et le jeu tout entier parle
de **fausses lumières** :
- **Josu** se réfugie dans un **faux bonheur** pour ne pas voir ce qu'il est
  devenu.
- Le **Culte des Âmes** promet une **fausse paix** où plus personne ne souffre…
  parce que plus personne ne *ressent*.
- **Jada** se ment en croyant qu'un **corps volé** la rendra vivante.

> 🌌 La Déesse Blanche est la **forme cosmique** de cette tentation : *« arrête de
> lutter, laisse-toi accueillir, tout sera clair et doux. »* Le vrai courage du
> jeu, ce n'est pas de **vaincre** la lumière — c'est de **détourner le regard**
> et de **rester soi**, imparfait, lucide, vivant. *(C'est exactement la leçon
> des Pensées et du Surpassement : dompter sa facette plutôt que fuir dans
> l'illusion.)*

> 🔗 **Lien avec Jade.** Le **Royaume des Étoiles** (l'ancienne dimension de Jade,
> repris par la Marionnette) et le **Royaume des Étoiles Noires** de la Reine
> partagent le même ciel. Question ouverte du lore : Jada **expérimente-t-elle
> sans le savoir** sous le regard de la Déesse Blanche ? Le « au-delà des
> étoiles » que cherchent les boss est-il **son** royaume — un piège déguisé en
> évasion ?

---

## 🔮 Les Miroirs — Héros & Boss (l'équilibre et l'excès)

**Thème central du jeu :** chaque héros incarne un **état mental** ; son boss est
ce **même trait poussé à l'excès destructeur**. Le boss est l'**ombre** du héros.
Si le héros fait les **bons choix** (reste équilibré) au fil du jeu, il devient le
**contre** naturel de son boss-miroir.

| Héros | État (sain) | ⇄ | Boss-Ombre | Excès (corrompu) |
|-------|-------------|---|------------|------------------|
| **Thylane** | Colère maîtrisée | ⇄ | **Josu** | Joie / amusement destructeur |
| **Lou** | Retenue | ⇄ | **Jade la Marionnette (Elara)** | Excès / liberté sans limite |
| **Neyssa** | Manque de concentration | ⇄ | **Dono** | Surconcentration (sur l'amour) |
| **Tianna** | Manque de confiance | ⇄ | **Kev** | Arrogance / excès de confiance |

### Détail des miroirs
- **Thylane (Colère) ⇄ Josu (Joie).** Thylane **s'énerve vite** : frappée, sa
  colère peut devenir incontrôlée — elle pourrait **frapper Lou**. Josu est
  l'inverse : **plus on le frappe, plus il est heureux** et content du combat —
  ce qui le rend **plus agressif**. *(Mécanique de combat : rage de Thylane vs
  Josu qui s'excite sous les coups.)*
- **Josu en profondeur.** Bloqué dans son amusement, ce qui le rend **fou et
  dangereux**. Il veut tant s'amuser qu'il **oublie les sentiments des autres**.
  Excès, **faux bonheur pour fuir la réalité**, par **manque de confiance**,
  facilité, ondes négatives de colère. Il **se déteste déjà** — sans se rendre
  compte qu'il est **devenu ce qu'il déteste**.
- **Lou (Retenue) ⇄ la Marionnette (Excès).** L'axe de l'**excès de liberté** :
  trop de liberté, le droit de tout faire → on fait n'importe quoi (comme
  quelqu'un sous des parents stricts qui, libéré, sombre dans ses **désirs
  humains les plus profonds**). Une version inversée de soi.
- **Neyssa (Manque de concentration) ⇄ Dono (Surconcentration).** Dono est tellement
  **focus sur l'amour et le fait d'être aimé** qu'il a délaissé le plus
  important : **l'amour de soi**. Sa leçon : ne pas donner son cœur aux humains,
  car **ton cœur est le plus beau des trésors**.
- **Tianna (Manque de confiance) ⇄ Kev (Arrogance).** Kev a **tellement confiance
  en lui** et en ses capacités qu'il en est **aveuglé** : il ne sait plus se
  **doser**, au point d'être **blessant et méchant**.

> 🎯 Chaque boss a été **choisi pour contrer un héros précis** — surtout si ce
> héros a fait les bons choix au fil du jeu (équilibre vs excès).

---

## 🎣 Jada & l'Invocation des Joueurs
Jada **attire de nouveaux joueurs** depuis la réalité : elle envoie des
**messages / e-mails** à des gens du monde réel (amis des créateurs, amis des
joueurs, amis des boss) pour les faire **entrer dans le jeu** — car **seuls les
joueurs** peuvent récupérer les âmes des boss. C'est ainsi que sont arrivés de
nouveaux venus comme **Louise**.

> Certains joueurs ont **abandonné la quête** pour **refaire leur vie** ici :
> nouvelle famille, nouvelles attaches. Même « faux », ce sont des êtres avec
> une personnalité, des défauts et des qualités. **On peut tomber amoureux d'un
> PNJ** pour ce qu'il est. Le monde est une illusion — mais les gens, eux,
> restent réels à leur manière.

---

## ⚖️ L'Ordre d'Or & l'Église de l'Équilibre

Une **puissance** qui n'est ni les boss, ni Jada, ni le Culte : une institution
qui prétend **maintenir l'équilibre** du monde (la Trinité intacte, les Paroles
réglées, les Âmes Errantes tenues à l'écart de la Déesse Blanche).

- **L'Ordre d'Or** — sa **garde royale**. Sa branche armée et politique.
- **L'Église de l'Équilibre** — sa branche spirituelle. Elle **reconnaît** des
  **« Élus »** : des êtres dont l'affinité et l'âme sont jugées exceptionnelles.
- Sa doctrine officielle est belle — *préserver l'équilibre* — mais une
  institution qui décide **qui** est « élu » et **ce qu'est** l'équilibre est,
  par nature, **ambivalente**. Équilibre pour qui ? Au prix de quoi ?

> 🤔 **Piste narrative.** L'Équilibre peut devenir sa propre tyrannie : à force de
> vouloir que *Δ reste complète* pour tous, l'Église pourrait **interdire** le
> déséquilibre — c'est-à-dire **interdire de ressentir trop fort**. Encore une
> fausse paix, plus polie que les autres.

---

## 🗡️ Donovan — l'Élu Divin

> *Affinité : **toutes**. Titre : **Élu Divin**. Âge : 21.*
> *ATK : S · DEF : S · Endurance : A · Pouvoir : S.*

**Capitaine de la garde royale de l'Ordre d'Or**, reconnu comme **Élu** par
l'Église de l'Équilibre. **Niveau 80+**, sans doute **le plus fort du royaume**.

> 🌈 **Donovan est un Élu du Prisme** (`SYSTEME_DE_MANA.md` §7.1 — Mana
> Semi-Parfait, ~1/1000) : un **Trine** qui a **cristallisé** ses trois sources.
> « Briser le triple seuil », c'est exactement ça — toucher les trois puits à la
> fois, au prix de distordre la réalité autour de soi.

- Son **talent d'affinité est monstrueux** : il **brise le triple seuil de
  lucidité** (la Trinité tendue à l'extrême) et touche **toutes** les sources. De
  ce fait, il n'est plus qu'**à un doigt du Mana Sombre** — la maîtrise même le
  rapproche du gouffre.
- À **21 ans**, il a **matérialisé un familier** en Mana Spirituel — un **fantôme,
  esprit vengeur** — qu'il a nommé **« Envy »** (*l'envie*).
- Sa **source** est la **plus pure et la plus vaste jamais enregistrée**.
- Son **trait unique** lui donne un **accès direct à la Source**, **sans
  récitation**, pendant **~5 minutes** : il surcharge son être, prend le contrôle
  total du flux, et peut **créer librement** (un état d'« harmonisation » intégrale).
  Passé ce délai, le contrecoup le guette.
- **Style de combat :** *« l'Âme en équilibre »*. **Arme : katana.** Modèle vivant
  de l'**Église de l'Équilibre**.

> 🪞 **Sa faille (façon miroir).** Donovan est l'incarnation de l'**équilibre
> parfait** — et c'est précisément ce qui le menace. Maîtriser *tout*, c'est
> n'avoir plus aucune marge avant la chute. Son familier s'appelle **« Envy »** :
> que **désire** un homme qui peut déjà tout faire ? La perfection est, peut-être,
> la plus solitaire des fausses lumières.

*(Note de lecture : fiche transcrite d'un croquis manuscrit — détails de rang/âge
à confirmer par JOKO.)*

---

## 🌓 Les Fins (matière à système d'embranchements)

### La Fin du Créateur — *l'absence de bonne fin*
Le seul boss **sans issue heureuse**. Sa seule vraie fin : **sa mort**, vécue
comme une **libération**. On ne peut pas le « sauver » contre son gré : il
refusera toujours une belle fin pour lui-même.

### La Fin du Culte des Âmes *(femme de Dono)*
Objectif : récupérer **deux âmes** — celle de **Kiev** et celle du **Créateur** —
**trahir Jada** pour reprendre la sienne, et tout offrir aux cultistes.
But ultime : **transcender les âmes** pour que **plus personne ne souffre**,
unir tout le monde en **une seule âme**, même fréquence, même paix.
> 💔 Piège : les joueurs **restent coincés** dans le jeu, et c'est un **monde
> sans émotion ni libre arbitre** — une **paix-illusion** où tout est synchronisé
> et contrôlé. Plus de souffrance… mais plus personne non plus.

### La Fin de l'Empire Vultric *(Kiev)*
S'ils récupèrent **toutes les âmes** : détruire **l'esprit et les émotions**,
ne garder que **l'instinct, le désir, le négatif**. Pas détruire l'âme (c'est
l'essence), mais en **bannir l'esprit**. Un monde **sans restriction morale**,
de **destruction et de liberté totale** — chacun fait ce qu'il veut, sans limite.
> 💔 Piège : ils **« libèrent » les joueurs**… mais pas comme prévu. Les joueurs
> sont libres **physiquement** dans le réel, mais leur **âme reste coincée dans
> le jeu** : les boss **prennent leur place** (corps, esprit, vie réelle) pour
> sortir « au-delà des étoiles ».

### La Fin de Jada — *l'Évasion de la Marionnette*
Elle réunit les âmes des boss + la Clé pour **briser la barrière** et **prendre
un corps humain réel**, remplaçant le joueur. *(Ultron.)*

### Les Fins mineures — *Liens & événements*
La plupart des autres fins dépendent des **Liens** tissés et des **choix
d'événements** : refaire sa vie au camp, sauver tel personnage, rejoindre telle
faction, etc.

> ✅ Les 7 idées de fins déjà proposées (Paradis-Prison, La Clé, Jada Gagne,
> Vraie Jade Libérée, Corruption Totale, Cycle Brisé, Rester) restent valides
> comme **variantes / déclinaisons** de ces grandes lignes.

---

## 🧩 Pistes de mécaniques (à concevoir)
- **Score de fin** piloté par : âmes collectées (var 15), Santé Mentale moyenne,
  Corruption d'équipe, niveau des **Liens** (avec le Créateur, Dono, etc.),
  possession de la **Clé** et/ou du **Masque**, faction ralliée.
- **Artefacts** : la **Clé** (sortie) et le **Masque** (code source / Mana Pur)
  comme objets-clés de quête.
- **Factions jouables** : Culte des Âmes ↔ Empire Vultric ↔ Jada ↔ Ordre d'Or /
  Église de l'Équilibre ↔ « refaire sa vie » — chacune route vers sa fin.

### Déjà en place (à relier au lore ci-dessus)
- **Trinité ↔ Santé Mentale.** `JadeEntitePlunging` (vars 11-14) = la composante
  **Esprit / Lucidité** de chaque héros. `Surpassement` = dompter sa facette
  (Δ qui se rééquilibre) ; `ParolesMagic` = la Parole qui se **brise** quand la
  lucidité est trop basse pour la longueur L (Axiome de Vothra rendu jouable).
- **Compendium des Paroles ↔ compétences.** Les 443 skills portent une
  **affinité** ; `ManaVisuals` les colore par élément. Reste à exposer en jeu :
  codes élémentaires, formes (double, amplifiée, soin, origine), `<Origine>` =
  sans contrecoup.
- **Pensées & Miroirs ↔ thème.** `Pensees`, `MirrorTaunts`, les CE des miroirs
  intérieurs (49-54) : le refus de la **fausse lumière**, donc la vraie réponse
  à la **Déesse Blanche**.

### Nouvelles pistes (issues du carnet & du Codex)
- **La descente dans le Lac (lucidité).** Mécanique de seuils : haute Santé
  Mentale = voir le caché (âmes errantes, marques, secrets), mais trop haut = le
  Mur → risque « Dément ». Relie `JadeEntitePlunging` à l'exploration/horreur.
- **Les trois Chutes comme game-over thématiques.** Bête (Corps/Corruption),
  Errant (Âme/Consommation), Dément (Esprit/Lucidité) — chacune un épilogue.
- **Le Souffle & le Symbole en combat.** Au-delà de la Parole : arts martiaux
  instantanés (Corps) et matérialisation d'objet d'âme / Résonance (Âme).
- **La Déesse Blanche comme tentation de fin.** Un embranchement « Aldébaran » :
  écouter / regarder l'autre monde → une **fin-illusion** cosmique (paix totale,
  dissolution dans son ciel). *Détourner le regard* = la rejeter. Mécanique
  possible : un **compteur de Regard** (combien de fois on a « écouté les anges »).
- **Marque de l'Âme / familier.** Matérialiser un objet/familier **unique** par
  héros, lié à sa facette (cf. « Envy » pour Donovan) — bonus d'affinité.
- **Trait d'Élu (Donovan).** État temporaire « accès direct à la Source » : ~5
  tours sans coût de Parole ni contrecoup, puis **surchauffe** (gros backlash).
- **Création d'élément.** Système de craft de Paroles : additionner deux codes
  (ex. Terre 11 + Eau 9 → Plante 20) pour débloquer un sort enfant.
