# 🗂️ À TRIER — ce qui est construit et qui ne sert pas

> **Comment ça marche.** Une ligne par famille. Tu écris `garde`, `jette` ou `plus tard`
> dans la dernière colonne — dix lignes à la fois, ou jamais. Ce que tu gardes, je le branche
> pour de bon. **`jette` ne supprime rien** : ça veut juste dire « on arrête de faire semblant
> que c'est dans le jeu ». Rien ne sera effacé de `data/`.

> Ce fichier est **mesuré**, pas écrit de mémoire. Une chose est « atteignable » si une classe
> l'apprend, si un ennemi l'emploie, si un combat est posé sur une carte, ou si le Tableau de
> Chasse l'ouvre. Le reste dort.

**33 décisions à prendre, pour 527 éléments.**

---

## Compétences

### Les Paroles élémentaires  —  119

- **Ce que c'est :** les échelles complètes par élément (Braise → Flamme → Brasier → Fournaise → Incendie, et pareil pour les 7 autres)
- **À quoi ça servait :** donner à chaque élément une gamme jouable, avec la longueur de Parole comme coût
- **Ce qui pointe dessus aujourd'hui :** le système de Paroles tourne (plugin actif)
- **Exemples :** Voile d'Ombre · Nuée Damnée · Abysse · Flamme Petit …
- **Tu gardes ?** `                    `

### Les soins et les soutiens  —  8

- **Ce que c'est :** Soin Léger → Soin → Grand Soin → Soin de Groupe → Vague de Vie, Lumière Vitale, Bénédiction Curative…
- **À quoi ça servait :** la ligne de soin du jeu
- **Ce qui pointe dessus aujourd'hui :** rien : aucune classe ne les apprend, aucun ennemi ne les lance
- **Exemples :** Régénération Rapide · « Relève-toi. » — le Rappel · Lien des Morts · Soin Léger …
- **Tu gardes ?** `                    `

### Les Ponctions (drains élémentaires)  —  3

- **Ce que c'est :** une ponction par élément — elles rendent une part des dégâts
- **À quoi ça servait :** donner un outil de survie qui ne soit pas un soin
- **Ce qui pointe dessus aujourd'hui :** rien
- **Exemples :** Ponction de Âme · Ponction de Étoile · Ponction de Fureur
- **Tu gardes ?** `                    `

### Les Paroles restantes  —  45

- **Ce que c'est :** les Paroles hors gamme élémentaire (Néant Pur, Verdict du Mana, Big Bang, les éléments exotiques…)
- **À quoi ça servait :** le haut du système de Paroles
- **Ce qui pointe dessus aujourd'hui :** le système de Paroles tourne
- **Exemples :** Drain d'Âme · Récolte Spectrale · Âme Petit · Âme Grand …
- **Tu gardes ?** `                    `

### Les Fusions et les Runes  —  9

- **Ce que c'est :** les 3 Fusions (Chair d'Âme, Fil du Rasoir, Songe Incarné) et les 3 Runes
- **À quoi ça servait :** un système de combinaison à part
- **Ce qui pointe dessus aujourd'hui :** des plugins de Fusion sont ACTIFS
- **Exemples :** ⟡ Fusion — la Chair d'Âme · ⟡ Fusion — le Fil du Rasoir · ⟡ Fusion — le Songe Incarné · ⟡ Lame de Chair …
- **Tu gardes ?** `                    `

### Les Arts Sereins — un par Voie  —  1

- **Ce que c'est :** Fil d'Écarlate Clair (miroir), Chirurgie du Vide, Éclat Noir Concentré (forge), Frappe de l'Instant Juste (onde), Aura Recueillie (source)
- **À quoi ça servait :** une technique signature par Voie de combat
- **Ce qui pointe dessus aujourd'hui :** AUCUNE classe n'ouvre le type 19
- **Exemples :** Aura Recueillie
- **Tu gardes ?** `                    `

### Les invocations  —  1

- **Ce que c'est :** Jugement des Défunts, Rappel des Âmes, Déchaînement Copié
- **À quoi ça servait :** ludwing qui rappelle les âmes qu'il a prises
- **Ce qui pointe dessus aujourd'hui :** AUCUNE classe n'ouvre le type 8
- **Exemples :** Déchaînement Copié
- **Tu gardes ?** `                    `

### Les Transformations  —  3

- **Ce que c'est :** Transformation, Second Stade, Stade Final
- **À quoi ça servait :** une montée en puissance en trois temps
- **Ce qui pointe dessus aujourd'hui :** rien ne les donne
- **Exemples :** Transformation · Transformation — Second Stade · Transformation — Stade Final
- **Tu gardes ?** `                    `

### Le sang et l'ombre restants  —  6

- **Ce que c'est :** Saignée, Fouet de Sang, Cercle Écarlate, Voile d'Ombre, Abysse…
- **À quoi ça servait :** compléter les deux jauges (Masque de Vesper, Amulette de ludwing)
- **Ce qui pointe dessus aujourd'hui :** les jauges existent et fonctionnent — ces compétences les rempliraient
- **Exemples :** Pluie de Lances d'Ombre · Armure de Sang · Disque Sanglant · Saignée …
- **Tu gardes ?** `                    `

### Les séquences d'action scriptées  —  3

- **Ce que c'est :** compétences avec chorégraphie écrite (tremblement d'écran, teintes, flashs)
- **À quoi ça servait :** les grands moments visuels
- **Ce qui pointe dessus aujourd'hui :** YEP_BattleEngineCore lit ces séquences — elles marcheraient telles quelles
- **Exemples :** Assaut Fulgurant · Danse des Ailes Écorchées · Brisement de Concept
- **Tu gardes ?** `                    `

### Le reste, sans famille claire  —  44

- **Ce que c'est :** compétences isolées, sans tag ni motif commun
- **Ce qui pointe dessus aujourd'hui :** à regarder une par une, ou à laisser dormir
- **Exemples :** Déluge de Poings · Peau de Dragon · Rafale Fantôme · Danse des Mirages …
- **Tu gardes ?** `                    `

## Combats

### Troupes « Archange Déchu »  —  2

- **Ce que c'est :** combats montés mais posés sur aucune carte
- **Ce qui pointe dessus aujourd'hui :** rien : ni carte, ni Tableau de Chasse
- **Exemples :** Archange Déchu · Archange Déchu
- **Tu gardes ?** `                    `

### Troupes « JADE prime »  —  2

- **Ce que c'est :** combats montés mais posés sur aucune carte
- **Ce qui pointe dessus aujourd'hui :** rien : ni carte, ni Tableau de Chasse
- **Exemples :** JADE prime  · JADE prime 
- **Tu gardes ?** `                    `

### Troupes « dragon abuse »  —  2

- **Ce que c'est :** combats montés mais posés sur aucune carte
- **Ce qui pointe dessus aujourd'hui :** rien : ni carte, ni Tableau de Chasse
- **Exemples :** dragon abuse  · dragon abuse 
- **Tu gardes ?** `                    `

### Troupes « Muta »  —  2

- **Ce que c'est :** combats montés mais posés sur aucune carte
- **Ce qui pointe dessus aujourd'hui :** rien : ni carte, ni Tableau de Chasse
- **Exemples :** Muta · Muta
- **Tu gardes ?** `                    `

### Troupes « Faucheur d'Âmes »  —  3

- **Ce que c'est :** combats montés mais posés sur aucune carte
- **Ce qui pointe dessus aujourd'hui :** rien : ni carte, ni Tableau de Chasse
- **Exemples :** Faucheur d'Âmes · Faucheur d'Âmes · Faucheur d'Âmes
- **Tu gardes ?** `                    `

### Troupes « Hydre Venimeuse »  —  3

- **Ce que c'est :** combats montés mais posés sur aucune carte
- **Ce qui pointe dessus aujourd'hui :** rien : ni carte, ni Tableau de Chasse
- **Exemples :** Hydre Venimeuse · Hydre Venimeuse · Hydre Venimeuse
- **Tu gardes ?** `                    `

### Troupes « Titan de Roche »  —  4

- **Ce que c'est :** combats montés mais posés sur aucune carte
- **Ce qui pointe dessus aujourd'hui :** rien : ni carte, ni Tableau de Chasse
- **Exemples :** Titan de Roche · Titan de Roche · Titan de Roche …
- **Tu gardes ?** `                    `

### Troupes « Séraphin Corrompu »  —  2

- **Ce que c'est :** combats montés mais posés sur aucune carte
- **Ce qui pointe dessus aujourd'hui :** rien : ni carte, ni Tableau de Chasse
- **Exemples :** Séraphin Corrompu · Séraphin Corrompu
- **Tu gardes ?** `                    `

### Troupes « Nécromancien »  —  2

- **Ce que c'est :** combats montés mais posés sur aucune carte
- **Ce qui pointe dessus aujourd'hui :** rien : ni carte, ni Tableau de Chasse
- **Exemples :** Nécromancien · Nécromancien
- **Tu gardes ?** `                    `

### Troupes « Cultiste du Vide »  —  2

- **Ce que c'est :** combats montés mais posés sur aucune carte
- **Ce qui pointe dessus aujourd'hui :** rien : ni carte, ni Tableau de Chasse
- **Exemples :** Cultiste du Vide · Cultiste du Vide
- **Tu gardes ?** `                    `

### Troupes « Wyverne »  —  2

- **Ce que c'est :** combats montés mais posés sur aucune carte
- **Ce qui pointe dessus aujourd'hui :** rien : ni carte, ni Tableau de Chasse
- **Exemples :** Wyverne · Wyverne
- **Tu gardes ?** `                    `

### Troupes « Golem de Pierre »  —  2

- **Ce que c'est :** combats montés mais posés sur aucune carte
- **Ce qui pointe dessus aujourd'hui :** rien : ni carte, ni Tableau de Chasse
- **Exemples :** Golem de Pierre · Golem de Pierre
- **Tu gardes ?** `                    `

### Troupes « Orc »  —  2

- **Ce que c'est :** combats montés mais posés sur aucune carte
- **Ce qui pointe dessus aujourd'hui :** rien : ni carte, ni Tableau de Chasse
- **Exemples :** Orc · Orc
- **Tu gardes ?** `                    `

### Troupes « Noyé du Lac »  —  2

- **Ce que c'est :** combats montés mais posés sur aucune carte
- **Ce qui pointe dessus aujourd'hui :** rien : ni carte, ni Tableau de Chasse
- **Exemples :** Noyé du Lac · Noyé du Lac
- **Tu gardes ?** `                    `

### Troupes « Seconde Forme »  —  2

- **Ce que c'est :** combats montés mais posés sur aucune carte
- **Ce qui pointe dessus aujourd'hui :** rien : ni carte, ni Tableau de Chasse
- **Exemples :** Seconde Forme · Seconde Forme
- **Tu gardes ?** `                    `

### Troupes « Errant Gonflé »  —  2

- **Ce que c'est :** combats montés mais posés sur aucune carte
- **Ce qui pointe dessus aujourd'hui :** rien : ni carte, ni Tableau de Chasse
- **Exemples :** Errant Gonflé · Errant Gonflé
- **Tu gardes ?** `                    `

### Troupes « Mage de la Lumière »  —  2

- **Ce que c'est :** combats montés mais posés sur aucune carte
- **Ce qui pointe dessus aujourd'hui :** rien : ni carte, ni Tableau de Chasse
- **Exemples :** Mage de la Lumière · Mage de la Lumière
- **Tu gardes ?** `                    `

### Troupes isolées  —  116

- **Ce que c'est :** combats uniques, chacun sans famille
- **Ce qui pointe dessus aujourd'hui :** rien
- **Exemples :** boss roi1 · poulet bizzare · vampire · zombie · fanatique …
- **Tu gardes ?** `                    `

## Ennemis

### ⚠ Les Chutes — tes héros en ennemis  —  24

- **Ce que c'est :** des versions tombées de tes quatre héros : le Dément, la Bête, l'Errant, le Déchiré — 14 000 à 18 000 PV, entièrement réglées
- **À quoi ça servait :** affronter ce que tes personnages deviennent s'ils tombent
- **Ce qui pointe dessus aujourd'hui :** les plugins des Chutes tournent (ChutesNoyau, ChutesProgression, ChutesDefinitives…), mais AUCUN combat ne convoque ces ennemis — le travail est fait, il n'est branché nulle part
- **Exemples :** Vesper, le Dément · Korrah, la Bête · Ludwing, l'Errant · Aël, le Dément · Vesper, la Bête · Vesper, l'Errant · Aël, le Déchiré · Korrah, le Dément …
- **Tu gardes ?** `                    `

### Des noms réservés, jamais remplis  —  35

- **Ce que c'est :** ennemis restés aux statistiques par défaut (100 PV) — « le dieu sans visage », « minos veritable », « enara », « le vrai visage de dieu »…
- **À quoi ça servait :** poser les noms des grandes figures pour ne pas les oublier
- **Ce qui pointe dessus aujourd'hui :** rien. Ce sont des intentions, pas des combats
- **Exemples :** Poulet Bizarre · bj · Seconde Forme · Seconde Forme II · fée · voleuse II · voleur II · tete · bras gauche  · bras droit  …
- **Tu gardes ?** `                    `

### Ennemis réglés mais sans combat  —  63

- **Ce que c'est :** ennemis avec de vraies statistiques, qui n'apparaissent dans aucune troupe atteignable
- **Ce qui pointe dessus aujourd'hui :** rien
- **Exemples :** Roi Poulet · e · voleur  · Zombie · Fanatique · Mimic · Colosse Sans Âme · Image Rémanente · Mage · Noyé du Lac …
- **Tu gardes ?** `                    `

## Plugins

### Plugins éteints  —  9

- **Ce que c'est :** systèmes écrits et désactivés
- **Ce qui pointe dessus aujourd'hui :** ils ne tournent pas
- **Exemples :** MadeWithMv · SoulMessages · Lore_JadaMail · Lore_JadaTitre · Lore_JadaChoix · Lore_RealiteGlitch · Lore_DilatationTemps · Lore_RumeurMonde · AtelierTest
- **Tu gardes ?** `                    `

---

## Ce qui n'est PAS là-dedans, et pourquoi

- **Les 270 contrats du Tableau de Chasse** : le plugin est actif et les ouvre depuis le menu.
  Ils sont atteignables. Ils ne dorment pas.
- **Les gestes de l'Avatar de Korrah** : personne ne les apprend, et c'est voulu — c'est
  l'Avatar qui les joue.
- **Ta classe 5 « familié »** : je n'y touche pas, tu me l'as dit.
