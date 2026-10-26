# 🧪 Les bancs d'essai

Dix scripts qui vérifient le système **sans lancer le jeu**. Ils lisent les vrais fichiers de
`data/` et rejouent le vrai code de `js/plugins/` sur un moteur RPG Maker MV simulé.
Plus un onzième, `navigateur/jouer.js`, qui **ouvre le jeu pour de vrai**.

---

> ## ⚠️ Sept bancs ne démarrent pas — et pourquoi ce n'est pas un échec
>
> La restauration du 2026-09-15 ne gardait que les plugins **tiers**. JOKO a ensuite rajouté
> lui-même ses **13 plugins du mana**, puis on a dû remonter les **7 socles** dont ils
> dépendaient — `LoreCanon`, `JadeEntitePlunging`, `Lore_SanteMentale`, `Errance`,
> `CorruptionAme`, `Surpassement`, `RangsPuissance` — sans quoi tout le système « chaque Voie
> a un prix » tournait à vide *(voir `navigateur/ponts_du_mana.js`)*.
>
> Il reste **quatre** plugins du projet dans `_ancien_projet/02_plugins/`, et sept bancs les
> chargent pour les rejouer. Sans le fichier, ils s'arrêtent sur un `ENOENT` : ils ne mesurent
> rien, ils ne sont pas en échec.
>
> | Banc | Ce qui lui manque |
> |---|---|
> | `1_dons_spirituels.js` · `3_avatar_spirituel.js` · `6_avatar_niveaux.js` | `DonsSpirituels.js` |
> | `2_evolution_paliers.js` · `5_verrou_et_ordres.js` | `ObjetSpirituel.js` |
> | `audit/8_tableau_de_chasse.js` | `ChasseAuxPrimes.js` |
> | `audit/9_equilibre.js` | `SoulsDifficulty.js` |
>
> **Aucun plugin chargé ne dépend de ces quatre-là** — on l'a vérifié : rien ne lit
> `window.Dons`, `window.Primes` ni `window.Scene_Difficulty`. Les remonter n'est donc pas une
> réparation mais un **choix de jeu**, et le choix appartient à JOKO *(§2)*.
>
> **Rien n'est cassé et rien n'est perdu.** Le jour où l'un d'eux revient dans `js/plugins/`,
> son banc se remet à mesurer tout seul, sans modification :
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
| `1_dons_spirituels.js` | ⏸ **en sommeil** — Endurance, jauges, casse : le système des Dons est retiré |
| `2_evolution_paliers.js` | ⏸ **en sommeil** — la montée des paliers d'un Don |
| `3_avatar_spirituel.js` | ⏸ **en sommeil** — l'Avatar joué à travers Korrah |
| `4_un_seul_don.js` | **la règle d'or** : un seul Don par personne, 76 contrôles |
| `5_verrou_et_ordres.js` | ⏸ **en sommeil** — le verrou du Don |
| `6_avatar_niveaux.js` | ⏸ **en sommeil** — les seuils sont passés dans la classe 5 |
| `audit/6_bestiaire.js` | les 400+ ennemis et les 41 boss |
| `audit/7_nouveau_lot.js` | les compétences, les apprentissages, le butin |
| `audit/8_tableau_de_chasse.js` | le Tableau de Chasse et les primes |
| `audit/9_equilibre.js` | **l'équilibre mesuré** : TTK / TTD à chaque palier, contre le vrai bestiaire |
| `7_trois_sources.js` | **les trois sources** : le repli des éléments 5 et 6, et le prix de chaque source — 16 contrôles |
| `9_doctrines.js` | **la dangerosité et les doctrines de combat** des 547 ennemis — 24 contrôles |
| `10_troupes.js` | **les phases deux et les renforts** des 270 troupes de famille — 18 contrôles |
| `11_degats_et_voies.js` | **la forme des formules** et **les neuf Voies** — 17 contrôles |
| `24_ultimes_et_rendements.js` | **le paquet commun du rework** (2026-10-25 — JOKO : « Oui tout ») : chaque ultime frappe au moins ×1,3 la meilleure capacité de sa portée, du niveau où il s'apprend au 99 (affinité comprise) ; chaque rendement entre ×0,5 et ×2 de la médiane de sa monnaie au niveau 60 ; ce qui se dit ULTIME est un ultime, et à celui qui l'a ; Dévoreur d'Âmes en ratio ; chaque ultime d'Aël au moins ×1,2 le meilleur ultime des trois autres de sa portée (A1) ; ce qu'un ennemi utilise et le Verbe qui Défait ne bougent pas — 7 contrôles et 8 contre-épreuves |
| `25_lecrit_est_spirituel.js` | **l'écrit, c'est le mana spirituel** (JOKO, 2026-10-25) : aucun écrit d'un héros n'est un coup physique ; Saignée Continue est un mouvement à 20 PT ; tout écrit se paie en PV, et seulement en PV (sauf ce qu'un ennemi utilise, et Transfusion, par son effet) ; toute technique au mana spirituel est un écrit ; la règle de LesTroisArts refuse l'écrit à une fiche physique marquée `<Art: ecrit>` ; les six techniques que JOKO a sorties de l'écrit (Fouet de Sang, Cercle Écarlate, Tranche-Néant, Lotus des Ténèbres, Tracer le Cercle, Territoire Scellé) sont des mouvements, dans leur monnaie, sans verbe de l'écrit ; La Règle du Lieu reste spirituelle (JOKO, 2026-10-26) : un écrit à 17 % de PV, avec son Sceau — 9 contrôles et 8 contre-épreuves, dont une contre une copie du plugin chargée sans la règle |
| `navigateur/jouer.js` | **le jeu, ouvert dans Chromium et joué à la touche** — 43 contrôles |
| `navigateur/chevauchements.js` | **les textes qui se dessinent l'un sur l'autre** — il détourne `drawText` et compare les rectangles |
| `navigateur/ponts_du_mana.js` | **le mana sans l'ancien lore** : les Chutes parties, les Voies qui tiennent — 9 contrôles |
| `navigateur/etats_en_combat.js` | **les états posés sur un vrai combattant** : les notetags qui ne faisaient rien — 12 contrôles |
| `navigateur/doctrines_en_combat.js` | **un boss qui décide pour de vrai**, tour par tour, dans le moteur — 7 contrôles |
| `outils/trier_les_sons.py` | **les sons** : chaque MP3 (que MV ne lit pas) devient un `.ogg` et un `.m4a`, rangé dans le bon dossier (un jingle court → `me`, une ambiance d'une minute → `bgs`) ; le MP3 d'origine part dans `audio/_originaux_mp3/` ; les musiques sont classées par le nom et l'écoute mesurée dans `docs/MUSIQUES.md`. Il faut `pip install imageio-ffmpeg numpy` |
| `outils/poser_les_recettes.js` | **les recettes** : 769 événements communs prêts à l'emploi (1001–1805, un séparateur par thème) — portes, coffres, lampes qui s'allument la nuit, météo, PNJ, boutiques, auberges, énigmes, pièges, récolte, combats, quêtes, cinématiques, mini-jeux, discrétion, village… écrits dans `outils/recettes/r*.js` avec un vocabulaire (`recettes/dsl.js`) qui produit de vraies commandes MV. Refuse d'écrire si un son, une animation, un objet, une troupe, un état, une commande de plugin manque, si un script ne compile pas ou si un bloc n'est pas refermé. Nomme les interrupteurs et variables ✎ 901+ |
| `navigateur/les_recettes.js` | **les recettes tournent** : chacune exécutée 3 fois dans le vrai moteur, choix au hasard ; ce qui tourne encore est rejoué en temps réel — 0 erreur, 767 vont au bout, 2 attendent le joueur à dessein |
| `outils/poser_la_vitrine.js` | **la vitrine** : carte 70 « ✎ ATELIER · Recettes à copier », les 769 recettes posées en vrais événements de carte, à copier-coller — commandes dans l'événement, image, déclencheur, page 2 (coffre ouvert, torche allumée…), portes en « Transférer le joueur » direct. Un thème par bande, un panneau par bande |
| `navigateur/la_vitrine.js` | **la vitrine tourne** : 25 s de promenade en temps réel (aucun transfert, combat ni game over tout seul), toutes les images se chargent, chaque page de chaque événement exécutée 3 fois avec son numéro d'événement — 850 pages, 0 erreur |
| `outils/poser_les_habitants.js` | **les habitants** : le bar (46) et l'auberge (44) au niveau de l'aubergiste de JOKO — 26 habitués du bar, l'aubergiste (textes de JOKO gardés, annonce en toute saison, chambre pendant la quête), les négociants du vendredi, le tableau d'affichage. Chaque fiche (`outils/habitants/*.js`) devient de vraies commandes MV : 1re rencontre, retour après 7 jours, bonjour selon le moment, remarque de saison, blessure, menu en boucle, sujet perso qui s'ouvre avec les visites. Horaires dans la Note (`<Horaire: 18-4>`), mémoire par `js/plugins/Habitants.js`. Garde les boutiques, quêtes et commentaires d'origine (instantané `outils/habitants/originaux.json`) |
| `navigateur/les_habitants.js` | **les habitants vivent** : qui est là à 8 h, 14 h, 20 h, 2 h ; Silas absent à 10 h et présent à 20 h sans quitter la carte ; mémoire des visites et des jours d'absence ; 592 conversations (4 saisons × 4 moments × chaque page) jusqu'à « Au revoir », 0 erreur |
| `outils/reparer_les_horaires.js` | **les horaires de JOKO** : ses pages testaient 101-115, MOG allume 200-214 → remappées ; pages « Crépuscule ET Nuit » coupées en OU ; page sans condition remise en tête ; animation relancée à chaque image → attente |
| `outils/poser_les_portes.js` | **les portes des villes** : destination de JOKO gardée, ouverture animée, heures selon ce qu'il y a derrière (boutique 8-20, bar 10-4, auberge toujours, maison 6-22, manoir 7-21), écriteau et « frapper » quand c'est fermé ; maisons sans destination fermées à clé |
| `outils/rapport_habitants.js` | régénère `docs/HABITANTS.md` : tous les habitants, leur voix, leurs heures, ce qu'ils proposent |
| `navigateur/une_journee_en_ville.js` | **une journée en ville** : horaires réparés, portes (ouvertes, fermées, frapper), intérieurs sans météo, Silas qui entre et sort à pied, Gaston qui va au bar le soir, 1 104 conversations sur 10 cartes — 0 erreur |
| `navigateur/ca_rame_en_ville.js` | **est-ce que ça rame en ville ?** images par seconde et temps de calcul par image sur chaque carte habitée et la vitrine, à 19 h — échec sous 55 img/s ou au-delà de 12 ms par image, ou si le jeu s'arrête |
| `outils/poser_l_atelier.js` | **l'atelier** : le carnet en vrais événements, sur deux cartes que rien ne relie au monde — 068 « ✎ ATELIER · Situations » (un panneau par situation, avec les vraies commandes d'événement) et 069 « ✎ ATELIER · Tous les plugins » (un panneau par plugin actif, toutes ses commandes). Refuse d'écrire une commande qu'aucun plugin actif n'écoute à cette orthographe. Il pose aussi le même carnet en **événements communs** : à partir de 701 les situations (un séparateur « ▬▬ ✎ thème ▬▬ » par thème), puis un par plugin à partir de 801 — ou de la dizaine suivante quand les situations débordent (le 2026-10-03, 93 situations allaient jusqu'à 803 et les trois dernières étaient écrasées : l'outil refuse maintenant d'écrire deux fois le même numéro). Déclencheur « Aucun ». Les cartes portent `<Atelier>`, les événements communs commencent par « ✎ » : `outils/atelier.js` les fait ignorer par les bancs et le carnet |
| `outils/carnet_des_plugins.js` | **le carnet des plugins** : pour chacun des plugins actifs, ses commandes (lues dans son code), ses balises, ses scripts, ses interrupteurs, ses réglages et son aide ; en tête, les situations écrites à la main (`outils/carnet_situations.js`), chaque ligne vérifiée contre le code du plugin qu'elle cite. `--ecrire` produit `docs/CARNET_DES_PLUGINS.html` — à relancer quand on allume ou éteint un plugin |
| `navigateur/les_boss.js` | **les boss, joués** : la rupture de la charge (et l'IA qui renonce à frapper), les insécables, les 27 mécaniques de `MecaniquesDeBossSuite` mise en garde → frappe, 14 d'entre elles mesurées ; Mahoraga, les météores de Radahn, l'Esprit de Dono, l'âme de Lou — 41 contrôles, deux captures |
| `navigateur/les_livres.js` | **le Bestiaire et l'Encyclopédie, ouverts depuis le menu et parcourus** — 12 contrôles |
| `21_le_retrait_des_dons.js` | **le retrait des Dons tient** : greffons éteints mais présents, 16 pièces gardées, l'Avatar survivant — 26 contrôles |
| `navigateur/seiryu_cinquieme.js` | **seiryu, cinquième combattant** : ses PV, son tour, ses décisions (Vesper : soignée en Lame, pas avec un Pacte en Garde), ses trois postures, sa protection — 27 contrôles |
| `navigateur/seiryu_et_lhiver.js` | **seiryu et l'Hiver** (2026-10-14) : tombé sous un coup il disparaît 2 tours, et Korrah perd l'Hiver et ses ordres — mais rien d'autre, et personne d'autre ; ni Plume de Phénix ni PV rendus ne le ramènent plus tôt ; éteint avec elle, rien ne change ; un vrai combat laissé tourner (il s'efface, se reforme au bon tour, réapparaît) ; ses soins pèsent un quart d'une vie — 29 contrôles. La mesure en combat réel : `NIVEAUX=60,89 node navigateur/lequipe_a_chaque_niveau.js`, chaque combat porte `seiryu: {morts, toursSansLui, soins, encaisse}` |
| `navigateur/le_froid_confie.js` | **Le froid confié** (`LeFroidConfie.js`, 2026-10-19, le rework de Korrah) : la jauge monte du coût exact en PM et seulement avec l'Hiver de Korrah ; seiryu chargé — soins ×1,25, coups de glace ×1,5 qui engourdissent (toujours sous le plus petit Hiver de Korrah), gardes +1 tour et « le froid mord », rien sous 25 de froid ; « Rends-le » vide tout (×2,6 à 80) et pose la Gelure ; Le Froid Rendu demande la jauge pleine, 0 PM ; tombé chargé, le froid revient sur elle (Saisie dès 60, ce tour-ci ou le suivant), pas s'il s'éteint avec elle ; Change : la place, ce que les ENNEMIS ont posé (pas la garde de seiryu), les coups ciblés détournés — pas la zone, pas les soins, plus quand elle est saisie ; un vrai combat où elle perd exactement un tour ; l'ordre du groupe rendu à la fin — 52 contrôles |
| `navigateur/les_capacites_de_korrah.js` | **Ses capacités** (`LeFroidConfie.js` v1.1-1.2, 2026-10-20) : les réglages, les balises et lignes des 20 fiches ; `<SurEngourdi>` ×1,5 sur un engourdi (pas sans l'état, pas Maîtrise, pas Vesper) ; `<ConfieFroid>` Ralentir confie ses 20 PM (pas Trait Foudroyant, pas seiryu tombé) ; `<ADeux>` Prise de Position et Le Souffle Retenu buffent aussi seiryu (pas Vesper, pas Accélérer, pas seiryu tombé) ; `<APlace>` 🔄 2 tours, le coup ciblé détourné sur Korrah, pas la zone, une place à la fois, soin et Marqué gardés ; `<SeiryuSuit>` son coup chargé au chiffre près, 25 de froid, engourdit, rien sans froid ni sans balise ; un vrai combat où il suit Pas de Côté ; le deuxième paquet (v1.2) : `<ReprendFroid>` 25 de froid repris et l'engourdissement sûr (rien avec 10 de froid, rien pour Instant Foudroyant), Instant Foudroyant ×1,5, Contre-Sort et Charge Statique sur seiryu aussi, Sceller la Voix sans dégâts prépare seiryu ; 20 fiches — 42 contrôles |
| `navigateur/le_registre.js` | **Le Registre** (`LeRegistre.js`, 2026-10-19, le rework de ludwing) : le compteur ✦ Âmes suit la variable 15 ; une mort +1, un Marqué qui tombe +2 de plus, ses drains +1 (+1 sur un Marqué), pas ses coups qui ne drainent pas ; les invocations dans son menu dès le début, à leur prix ; la branche Copies seulement avec des copies, les copies nulle part ailleurs, 2 âmes et ni PM ni PT, « à sa mesure » (50 % d'Ombre — Nuit × l'élément de la copie ; Copie d'Âme reste à moitié de ses stats), consommées ; un Marqué copié dès sa première technique, pas un autre, jamais l'Attaque ; les mises (Roulette : seuil 1 → 6 ; Arme d'Ombre : le meilleur de 4 tirages imposés, tous les 4 pris par l'événement — avant le 2026-10-26, le poids des âmes en avalait un en posant son état, et le contrôle passait par chance) et rien sans âme ni pour Vesper ; le Domaine 198 (copies gratuites et gardées, mise offerte, invocation sans âme) et LouCopySystem réglé dessus ; un vrai combat — 39 contrôles |
| `navigateur/la_parole.js` | **La Parole** (`LaParole.js`, 2026-10-20) : qui est une Parole (mana positif seulement : pas n°2/4/7, pas une Voie, pas l'Attaque) et les 5 degrés des échelles ; FusionElements éteint ; les 6 fusions de JOKO et plus aucune collision ; un héros ne rate plus en silence, un ennemi si ; la phrase commune (posée, à l'écran, tenue au tour suivant, pas après ; une Voie ou seiryu n'y touchent pas) ; la Double à deux éléments (pas sur le même, pas sans rien) ; la Fusion Lumière + Ombre = Crépuscule ×1,5 (pas une autre paire, pas une Simple) ; le dernier degré bloqué au tour suivant ; l'aide ; un vrai combat où la Fusion de ludwing part en dernier et fond la Lumière d'Aël, et se brise à moitié sous un coup de 20 % ; la ligne « ✦ En suspens » ne s'écrit ni sur le Pacte, ni sur la Colère, ni sur le livre (contre : à son ancienne place, elle tombait sur le Pacte) |
| `navigateur/le_mouvement.js` | **Le Mouvement** (`LeMouvement.js`, 2026-10-20 — JOKO : « D'abord, fais les mouvements ») : les 9 postures (une icône chacune, priorité 98) ; qui fait un mouvement (Voie écrite, l'Attaque — pas une Parole, pas l'âme, pas l'ordre à seiryu, pas un ennemi) ; une chaîne de Korrah : posture, ×1,15 en changeant de Voie, le geste juste ×1,5 au flux 3, ×0,85 sur la même technique, rien sur une autre technique de la même Voie, les dégâts au chiffre près ; l'icône en tête et le flux en chiffre, les annonces ; le geste faux (20 % brise, 5 % non ; 💥 Brisé brise, un autre état non ; une Parole arrête le corps, la Garde et un ordre à seiryu non) ; en premier dans le flux, pas sans, pas avec une Parole ; un vrai combat où le geste juste sort et où elle joue en tête — 31 contrôles |
| `navigateur/le_spirituel.js` | ⏸ **éteint le 2026-10-22** (LeSpirituel remplacé par L'Écrit : ce banc échoue tant qu'il reste éteint) — **Le Spirituel** (`LeSpirituel.js`, 2026-10-20 — JOKO : « finis le rework spirituel ») : l'état 257 ; qui écrit (élément 2, élément 7, type ame — pas un mouvement, pas une Parole, pas l'Attaque, pas un ennemi) ; la marque garde 40 % du coup, se compte en chiffre, 3 au plus (la plus vieille s'en va) ; l'ennemi agit : tout éclate d'un coup — pas sans marque ; l'éclat qui tue compte l'âme (PorteurDAmes) et rend les PV ; tombé marqué : 8 % des PV max rendus par marque — rien sans marque ; la volonté ×1,25 à mi-PV, +0,25 par allié tombé, ×1,75 au plus, sur les soins de l'âme aussi, pas sur un mouvement ; 3 tours ; un vrai combat où la marque éclate — 26 contrôles |
| `navigateur/les_trois_arts.js` | **Les trois arts** (`LesTroisArts.js`, 2026-10-22 — JOKO : « resete tout et fait comme ça devait être de base », « je t'autorise à tout […] sauf les dons ») : les réglages (LeSpirituel, FusionMana, ElementsVivants éteints ; plus de recul en PV du négatif) ; l'art de chaque compétence (Paroles, mouvements, écrits, aucun art) et LaParole / LeMouvement qui suivent la même règle ; le triangle (une Parole de Feu en Feu + positif, un mouvement fiché en positif frappe en négatif, ×2 sur un ennemi faible au négatif, ▲ annoncé — pas chez un ennemi) ; le prix suit l'art sur toutes les capacités des classes 1-4 — pas sur les dons ; la barre de PT (l'Attaque à 20 PT × TCR, les Reliques ne les gardent plus) ; l'aide 【ART · ÉLÉMENT】. |
| `navigateur/les_affinites.js` | **Les affinités** (`LesTroisArts.js` v1.1, 2026-10-24 — JOKO : « L'affinité unique oui c'est tout ») : les affinités des quatre (seiryu et les ennemis n'en ont pas) ; hors affinité, héros par héros, le coût ×1,5 dans sa monnaie (Paroles de Vesper et de ludwing en PM, écrits de Korrah en PV, mouvements d'Aël en PT ; Le Domaine Entier à 100 PT, pas 105, et il part avec la jauge pleine) et ×0,75 sur les dégâts, les soins et les PM rendus — contre-épreuve : `_sansAffinites` rend les valeurs d'avant ; dans l'affinité, rien ne change ; l'Attaque, seiryu, un ennemi, les dons (Ténèbres Impériales, JACKPOT) et un combo non plus ; l'aide « hors affinité », le coût affiché, « ◇ Hors affinité » au-dessus du héros (pas sur un art à lui). |
| `navigateur/le_sang_de_vesper.js` | **Vesper, le sang** (le rework, V1, 2026-10-25) : chaque technique de la branche sang se paie en PV, ni PM ni PT (contre : la Voie du Sang reste en PT, l'Hiver de Korrah en PM) ; elle paie vraiment, et à son prix en PV elle ne peut plus la lancer ; Rendre le Sang la soigne toujours ; ce sont des mouvements (la Voie du Sang, le négatif), dans son affinité — les « Parole n°2 » restent des écrits ; le menu affiche le prix en PV. |
| `navigateur/la_tete_en_lair.js` | **Korrah, la tête en l'air** (le rework, K1, 2026-10-25) : les réglages et l'état 258 ; distraite, son attaque visée rate et « 💭 La tête ailleurs… » flotte (contre : Vesper, une `<Sur>`, un coup de zone, un tirage au-dessus de 15 %) ; ~15 % sur 4 000 tirages ; Focalisation la concentre sans rater elle-même ; concentrée, elle ne rate pas, ne s'esquive pas, frappe ×1,25, et la concentration part ; penser juste la concentre, la Parole qui pense ne l'use pas, le mouvement d'après si ; ni Vesper ni un ennemi. |
| `navigateur/le_poids_des_ames.js` | **ludwing, le poids des âmes** (le rework, L1, 2026-10-25) : les réglages et l'état 259 ; ses dégâts suivent ses âmes (5 : ×1,1 ; 30 : ×1,2, le plafond de 10) — pas ses soins, pas les coups de Vesper ; « ✦ Âmes ×1,1 » quand il frappe ; sa DÉF ne bouge pas jusqu'à 5, −9 % à 8, −60 % au plus — pas celle de Vesper ; l'état 259 et « -9% », l'annonce ; dépenser l'allège ; `Registre._sansPoids` coupe tout. |
| `navigateur/l_ecrit.js` | **L'Écrit** (`LEcrit.js`, 2026-10-22 — JOKO : « le système de Full Metal Alchemist », « B pour l'écrit ») : « ᛟ Activer » (1309, instantanée, niveau 1, classes 1-4) et l'état 257 qui ne s'use pas ; ce qui s'écrit (les écrits des capacités — pas les dons, pas un Combo, pas la Parole lue d'Aël, pas un mouvement ni une Parole ni un ennemi) ; écrire ne fait rien partir (pas de « raté »), se montre et s'annonce ; Activer grisé sans écrit, puis tout part ×1,25 ; un soin écrit ne soigne qu'à l'activation ; 3 au plus ; un ennemi tombé emporte ses écrits ; la volonté (écrit et don, pas un mouvement) ; un vrai combat : écrit, écrit, activé ; l'aide d'Activer dit ce qui attend, un écrit grisé dit pourquoi (contre : un don garde sa description) ; « ᛟ Activer · n » juste sous l'Attaque, choisie par la fenêtre d'une seule touche, et au tour les écrits partent (contre : Korrah, sans écrit, n'a pas la commande). |
| `navigateur/les_signatures.js` | **Les signatures des quatre** (2026-10-22 — JOKO : « rendre les vraiment intéressant et original ») : Vesper, le contre-temps (la riposte arme, rend, fait monter le flux, au 3 geste juste ×1,5 ; après la riposte ×1,5 ; pas chez Korrah ; un gros coup passe avant) ; Korrah, penser juste (sa Parole est un pas du flux, le mouvement d'après change de Voie, PENSER JUSTE ×1,5 ; pas chez Vesper ; la Lecture ×1,5 une fois, pas pour une autre) ; ludwing, le piège (ses écrits partent quand l'ennemi le frappe, pas s'il frappe un autre, pas les écrits de Korrah), la chance (1 sur 4, l'écrit reste) et la résonance (trois ensemble ×1,3) ; Aël, pour elle (sa propre phrase reste ouverte ×1,2 ; celle d'un autre se referme). |
| `navigateur/les_verbes.js` | **Les verbes des trois arts** (2026-10-22 — JOKO : « Oui rework tout », « surtout jouable et dans les règles ») : chaque verbe sur sa vraie capacité, dans les deux sens. Corps : Ouvre, Finit, Reprise (contre : une autre s'use), Sur (contre : une autre s'use), Entre, Grâce, Immobile, Accumule, Éclat Noir sûr à 2 de flux (pas sans). Parole : « Reste. », « Assez. » (avec et sans phrase), Le Mot Juste (deux ennemis, deux mots), les ciels d'Aël, « Viens. » (une fois), « Pars. » (ce tour et le suivant), Nommée (consommée par une Parole, pas par un mouvement). Écrit : le Cercle (essayé sur Marquer la Cible : gratuit dedans, 7 % dehors), Referme sur Dévoreur d'Âmes (tout part ; contre : rien), La Règle du Lieu (l'ennemi perd sa prochaine action), les six sorties de l'écrit sans verbe de l'écrit, Faire Douter (1 sur 2), Ombre Prêtée (Vesper oui, Korrah non), le Symbole (×1,3 contre ×1,15), Vannes (l'ennemi provoqué frappe ludwing, un autre non), Saignée Continue écrite. Deuxième et troisième paquets : Lâche (×1,5, et elle encaisse ×1,5 jusqu'à son action), Premier (contre : sans flux, rien), Neuf Voies, Tout ou Rien (ludwing tire deux fois), la riposte armée en frappant, Avec (Trait Clair), Leurre (+30 % d'esquive, jusqu'à son action). Quatrième paquet, le soutien : Encourage (×1,2, une fois), Devant (« Debout. » : relevée, elle part en premier, une fois), Rythme (un point de flux à qui est en posture, jamais 3 ; rien sans posture), Rempart (écrit, il ne protège pas ; activé, le prochain coup ÷2, une fois, un soin ne l'use pas). |
| `navigateur/ce_qui_se_voit.js` | **Ce qui se voit** (2026-10-23 — JOKO : « vraiment zéro diff » ; le journal de combat est muet en vue de côté) : Korrah confie son froid → « ❄ Confié +n · x/100 » sur seiryu (contre : une Attaque, rien) ; la ligne de seiryu, le cinquième hors de la fenêtre de statut (sa vie et son froid ; tombé, « se reforme · n t. ») ne s'écrit ni sur le livre ni sur le Pacte ; seiryu se dissipe (et « ❄ Plus d'Hiver » sur Korrah) ; ludwing copie ; le livre d'Aël plein (contre : à deux pages, rien) ; la Rage de Vesper (contre : à 50, rien) ; une annonce longue au bord droit reste dans l'écran (contre : centrée comme avant, elle débordait) ; le menu de combat : « ᛟ Activer » et chaque capacité à verbe ont leur ligne (contre : avec la clé de famille d'avant, 43 étaient repliées sous une autre), et le nombre de lignes par héros ; la réplique du tableau de LesInteractions (la Vanne sur Vesper) flotte au-dessus de ludwing telle qu'écrite (contre : sur Korrah, rien) ; les lignes de journal des boss, des ennemis et des dons passent en bandeau (longues : coupées à leur pause, dans la couleur de leur C[n] ; pas de doublon quand le plugin pose son propre bandeau au même instant — contre : à un autre instant, les deux restent ; MecaBoss.dire aussi) ; la fenêtre des capacités montre 9 lignes, et tant qu'elle est ouverte les lignes du Pacte, de la Colère, du livre, de la phrase et de seiryu s'effacent, puis reviennent. |
| `navigateur/la_regle_pour_tous.js` | **La règle pour tous** (`MaitriseVoies` « reglePourTous », 2026-10-20 — JOKO : « les dons ne t'écartent pas du système ») : la Voie par défaut d'un héros ne va plus qu'à ses mouvements ; une Parole de chacun des quatre ne prend ni la maîtrise ni l'effet de sa Voie (Korrah : aucun Éclat Noir en 200 Paroles) ; l'Attaque la garde (l'Éclat Noir une fois sur quatre) ; une technique de l'âme de ludwing ne prend pas la Source, un objet n'arme pas le Renvoi d'Aël ; une Voie écrite (Ouvrir, sang) reste la sienne ; les ennemis ne changent pas — 15 contrôles (7 échecs avec la règle coupée) |
| `navigateur/le_livre_dael.js` | **Le livre** (`LaBibliothequeDAel.js` v2.0, 2026-10-19, le rework d'Aël) : l'interrupteur 27 et la ligne des 8 ultimes ; une page par compétence de 1 à 20 PM (Comète à 20 tout juste), rien pour l'Attaque, la Garde, le gratuit, un objet, Étau à 40 PM (qui n'efface rien), 3 pages au plus, ■■□ à l'écran ; le prix compte, pas qui paie (Contrat) ; une Porte pas chère écrit ; Miracle éteint : ni Lecture ni branche « miracle », rien de désappris ; allumé : +25 %, « elle perd le fil », la page du Miracle ; livre vide à chaque combat ; dans un vrai combat, Celle Qu'on Ne Dit Qu'une Fois lue part au tour 1 sans incantation ni Surcharge, au plein prix, et Éclat de Conviction sans PV ni Doute — sans livre, tout comme avant — 38 contrôles |
| `navigateur/le_corps_de_lavatar.js` | ⏸ **remplacé** par `seiryu_cinquieme.js` |
| `navigateur/ecran_des_dons.js` | ⏸ **en sommeil** — l'écran des Dons est parti avec son système |
| `navigateur/les_commandes_qui_repondent.js` | **les commandes que les cartes appelaient dans le vide**, le marchand, les trois reliques — 43 contrôles |
| `navigateur/le_royaume_imperial.js` | **Royaume Impérial** dans un vrai combat : 2 min, une âme par retour, tous les PM, la fatigue — 25 contrôles |
| `navigateur/les_quetes.js` | **les quêtes, jouées** : la Caverne ouvre la première, la ville l'accomplit, le garde donne un contrat, cinq bandits tombent, il paie ; Tobin, Colin et Sarielle revivent ; la sauvegarde reconstruit le journal — avec contre-épreuves. Les quêtes sont posées par `outils/poser_les_quetes.js` |
| `22_animations_coherentes.js` | **chaque attaque se voit, et dans sa couleur** : aucune arme muette, aucune compétence de feu qui joue de l'eau, les vraies teintes (rotation = voulue − départ), et huit états qui faisaient le contraire de leur nom — 30 contrôles. Règle dans `outils/coherence_animations.js`, correction par `outils/animer_les_competences.js`, teintes mesurées par `outils/mesurer_teintes.js` |
| `navigateur/lavatar_obeit.js` | **l'Avatar obéit, et il apprend** : de vrais tours joués, qui frappe qui, les trois paliers du Lien — 21 contrôles |
| `navigateur/lorbe_en_raccord.js` | **l'Orbe montre ce que le héros a vraiment** : ses branches = son menu de combat — 13 contrôles |
| `navigateur/vesper_et_ael.js` | **Vesper (le Pacte, comme Arlecchino ; les trois Styles) et Aël (Lecture, Miracle — interrupteur 27 allumé, comme après l'événement —, Contrat, Portes)**, chaque règle avec sa contre-épreuve — Pacte v2.0 (2026-10-14) : ni Pacte ni Masque en Lame, Masque ×1,6 en Garde et ×1,9 en Sang, plus de Réserve, et en Lame on la soigne normalement — 48 contrôles |
| `navigateur/vesper_les_styles.js` | **Vesper, ses trois Styles et sa Colère** (`LesStylesDeVesper.js`, 2026-10-14) : chaque Style ne voit que son kit et les branches vides disparaissent ; les arts suivent l'arme tenue (Lames Écarlates = épée, canne = lance, griffe et mains nues = poings, fouet = rien) ; **Lame** — l'État de Flow sous 20 % seulement, deux actions par tour pendant 3 tours pleins, une contre-attaque par esquive (après l'action ennemie, l'« esquive » reste affichée), l'Épuisement ; **Sang** — le Berserker en Rage seulement, la Colère boit les coups, 1 PV minimum, +25 % de vol de vie, BERSEK ×2, le contrecoup ; la Convergence (Sang Perçant ×2 sans défense, Supernova 6 éclats) ; **Garde** — −15 % par coup du même type jusqu'à −75 %, chaque type à part, la Garde boit 5/10/20 % des PM, l'armure cède deux tours pleins, l'Arme de Sang (+120 % du sang encaissé) ; **la Colère** — +5/+15/+10 par coup selon le Style, la Vanne de ludwing sur elle (+50, et pas sur Korrah), la Rage ×1,5 et ludwing prend 60 % de ses coups à cible unique (jamais un coup de zone) ; un vrai combat laissé tourner — 88 contrôles |
| `navigateur/les_interactions.js` | **Les interactions** (`LesInteractions.js`, 2026-10-14) : le tableau du gestionnaire de plugins se lit tel que l'éditeur l'écrit ; B1 les répliques (%1, %2, une au hasard), B2 Colère / PT / état, B3 esquive (rien ne passe, la moquerie si) et riposte (sur le lanceur, pas sur un ennemi), B4 l'action en retour et la copie (4 places) ; la ligne précise avant la générique, pas sur soi-même ; **deux vrais combats** : la riposte de Vesper et la contre de son Flow ne lui coûtent plus son tour — avec le `forceAction` de MV elle le perdait (0 action à elle sur 2 tours) — 30 contrôles |
| `navigateur/le_bouclier_et_la_brise.js` | **Le bouclier et la brisure** (`AstfglSCB.js`, copie corrigée, 2026-10-18) : aucun ennemi de la base n'a de bouclier ; sans bouclier, rien ne change (ni brisure, ni faiblesse notée, nom affiché comme Yanfly) — contre-épreuve avec `<mSh>` en mémoire ; une faiblesse use le bouclier, un autre élément ou un coup raté non, deux faiblesses −2, `<shImpact>` ; à 0 l'état de brisure, brisé plus rien ne bouge, l'état parti le bouclier est plein ; faiblesses découvertes sauvées ; une sauvegarde sans le plugin se charge ; **un vrai combat joué en accéléré** (la logique du moteur image par image, sans dessin) : brisé, il perd son tour, rechargé, brisé à nouveau ; ⑤ les réglages de JOKO : boucliers par rang (D 2 … boss 8, sans rang aucun, `<mSh>` écrit passe avant), l'état 1005, ×1,5 sur les dégâts et pas sur les soins, le nom entier et le chiffre qui suit le combat, et un vrai combat sur les **vraies données** (troupe 1, rang D) — 38 contrôles. Sur le plugin d'origine non corrigé : 6 échecs et un plantage |
| `navigateur/les_attaques_combinees.js` | **Les attaques combinées** (DoubleX Unison Item + module CTB, copies corrigées, 2026-10-18). Sections ① à ④ avec des compétences créées **en mémoire** ; ⑤ sur les six duos de la base. ① une action normale ne change pas (le héros s'avance), une compétence créée en jeu se joue, le combat automatique ne prend jamais une attaque combinée ; ② en tour par tour, le lanceur est avant son partenaire dans l'équipe, partenaire tombé ou hors liste : non, deux actions dont une réservée : une seule saisie (et deux sans réservation), chacun paie son coût, `<unison item atk actors>` mélange l'ATQ seule (entière), `<unison item mat actors: 4>` prend la MAG d'Aël, la règle `max`, un vrai calcul de dégâts ; ③ **un vrai combat en tour par tour saisi par les vraies fenêtres de commande** et joué en accéléré : Korrah ne reçoit pas de commande et ne joue pas en plus quand Vesper lance l'attaque, les deux s'avancent, Korrah reprend la main au tour suivant, une sauvegarde d'avant saisit ; ④ en CTB : partenaire juste après (contre-épreuve : un ennemi entre les deux), un vrai combat, puis `<async unison item>` ; ⑤ **les six duos de JOKO** (1303-1308) : une par paire de héros, type 25 « Combo », deux éléments, connus dès la nouvelle partie avec le menu, pas chez seiryu, le premier des deux dans l'équipe lance (contre-épreuve : Korrah passée devant), le partenaire qui l'oublie la bloque, les coûts, les stats empruntées, des dégâts, −2 de bouclier sur une double faiblesse, et un vrai combat avec Lame de Givre — 49 contrôles. Le banc attend en **images de jeu**, pas en secondes : il tient quand le PC est occupé. Sur les originaux : 8 échecs (mouvements coupés, plantage, combat auto, balises `atk`/`mat` sans effet, « and », Korrah qui joue deux fois) |
| `navigateur/la_planche_dexpressions.js` | **La planche d'expressions du Studio** (`/planche`, 2026-10-19) : lance deux serveurs du Studio à lui (ports 8791 et 8792, jamais celui de JOKO). ① la page s'ouvre depuis l'accueil ; ② un PNG de 100×100 est refusé avec sa taille, rien n'est placé ; ③ huit PNG de couleurs différentes, déposés dans le désordre, se rangent par nom, « Enregistrer » écrit `img/faces/<nom>.png`, **relu par un décodeur PNG à part** (pas celui du navigateur) : 576×288, chaque case entièrement de sa couleur dans l'ordre, un bord à alpha 128 qui le reste (écart de couleur mesuré : 1, toléré : 2) ; ④ le même nom une 2e fois, puis un visage déjà là que le Studio n'a pas écrit (un leurre posé par le banc, jamais un visage de JOKO), même en MAJUSCULES : refusés, fichiers intacts, un autre nom proposé ; ⑤ une case glissée sur une autre les échange, une case vidée sort transparente ; ⑥ RPG Maker « ouvert » (`STUDIO_EDITEUR=node.exe`) : refusé, rien d'écrit ; ⑦ le serveur refuse lui-même un PNG de 100×100, autre chose qu'un PNG, un nom en `../`. Le banc efface ses fichiers et vérifie que `img/faces` est exactement comme avant — 28 contrôles. Contre-épreuves (2026-10-19) : serveur qui écrase, page qui accepte toute taille, fond blanc, contrôle de RPG Maker retiré, fichiers non triés — chacune attrapée |
| `navigateur/lequipe_a_chaque_niveau.js` | **l'équipe complète, en combat, à 13 niveaux** : ~420 combats joués dans le moteur, vraies troupes, vraie IA, phases de boss — écrit `mesures_equipe.json` *(une mesure, pas un contrôle)* |
| `navigateur/analyser_equipe.js` | **lit ces mesures** : tours pour gagner, victoires, dégâts reçus par tour, qui joue en premier — et le multiplicateur qui amènerait chaque rang sur sa cible |
| `navigateur/analyser_vesper.js` | **Vesper, Style par Style**, dans ces mesures : sa part des dégâts, ses chutes, le temps passé dans chaque Style, Rage / Flow / Berserker / armure brisée, ce que ludwing a pris, ses coups qui font le travail. `VESPER_STYLE=lame\|sang\|garde` fige son Style dans `lequipe_a_chaque_niveau.js` (auto sinon) ; chaque combat porte `vesper: {styles, rage, flow, berserker, brisee, toursMorte, surLudwing}` |

## `navigateur/lequipe_a_chaque_niveau.js` — le banc qui jouait mal et faisait dire n'importe quoi

Il ne lit aucune formule : il **joue**. Et quatre fois, c'est sa façon de jouer qui mentait, pas le jeu.

| Ce que le banc faisait | Ce qu'il en concluait | Ce qui était vrai |
|---|---|---|
| Aël ne lançait que ses Portes | « Aël fait 0 à 200 dégâts par action » | elle a un vrai kit de Paroles : **3 800 à 10 000** |
| les pages de troupe n'étaient pas jouées | « Le Compteur est imbattable en 40 tours » | sans ses phases, il n'avait pas de PHASE II : **battu en 17 tours** |
| il lançait le coup le plus fort, point | « au niveau 1, l'équipe perd contre un rang D » | les héros **se tuaient eux-mêmes** : recul, Renvoi, Reflet, Parole brisée |
| il visait un Miroir avec de la magie | idem | le 🪞 Reflet est affiché : un joueur frappe ailleurs |

Il joue donc maintenant comme un joueur **raisonnable, pas parfait** : pas de magie sur une cible
en Reflet, pas une Parole que l'aide du menu dit risquée (tenue < 50 %), pas un coup qui laisse le
lanceur sous 30 % de ses PV, pas une cible dont « le Renvoi est prêt ».

```bash
TROUPES=16 node bancs/navigateur/lequipe_a_chaque_niveau.js        # la mesure (≈ 2 min)
node bancs/navigateur/analyser_equipe.js                           # la lecture
MULT="D:3.5,1.4;A:1.8,1" node bancs/navigateur/lequipe_a_chaque_niveau.js   # essayer un réglage
DIAG=552,80 node bancs/navigateur/lequipe_a_chaque_niveau.js       # un combat, coup par coup
SONDE=4,45,579 node bancs/navigateur/lequipe_a_chaque_niveau.js    # le kit d'un héros, trié
```

> Les boss restent **bruyants** : avec la même configuration, le niveau 60 a donné 2 victoires sur 8,
> puis 5 sur 8. Un chiffre de boss se lit sur plusieurs passages, jamais sur un seul.

## `9_doctrines.js` — pourquoi il ne relit pas le script qui a écrit les doctrines

`YEP_BattleAICore` était chargé et ne faisait **rien** : aucun des 547 ennemis ne portait de bloc
`<AI Priority>`. Ils en portent un maintenant. Mais **tout ce qui rate là-dedans rate en silence** —
Yanfly abandonne la ligne et l'ennemi retombe sur l'IA ordinaire de MV, sans une erreur :

| Ce qu'on écrit | Ce que Yanfly en fait |
|---|---|
| une condition qu'il ne sait pas lire | `passAIConditions` finit par `return false` — la ligne ne part **jamais** |
| `ALWAYS:Attaque` *(sans l'espace)* | aucun des 4 motifs ne mord — ligne ignorée |
| un nom de compétence inconnu | `initialCheck` rend `false` — ligne ignorée |
| une compétence trop chère | `meetsSkillConditions` rend `false` — ligne ignorée |
| **un nom porté par DEUX compétences** | `Yanfly.SkillIdRef` garde **la dernière** |

Le dernier est le plus vicieux : il ne tue pas la ligne, il la **détourne**. Cinq ennemis écrivaient
« Éclat Noir » en possédant l'id 11 *(×14 ATK)* — Yanfly leur rendait l'id 1124 *(×29 ATK)*. La
compétence partait, **au double des dégâts prévus**, sans une ligne de journal. Quatorze lignes
étaient dans ce cas. Elles sont désormais épinglées par identifiant (`Skill 11`), que Yanfly lit
avant le nom.

D'où la règle appliquée ici : le banc ne rejoue pas la logique qui a **écrit** les doctrines, il
rejoue **les expressions régulières de `YEP_BattleAICore.js` lui-même**, relues dans le fichier du
plugin. On mesure ce que le moteur fera, pas ce qu'on croit lui avoir dit.

> **Seize noms de compétence sont portés par deux compétences** *(« Requiem », « Bris Total »,
> « Il Abat le Bras »…)*. Épingler les doctrines par identifiant met l'IA à l'abri, mais le joueur,
> lui, voit toujours deux lignes identiques dans ses menus. **Les renommer est une décision de
> JOKO** *(§2 : on ne renomme pas ce qui s'affiche à l'écran)*.

## `8_visages_ennemis.js` — le banc qui s'est trompé, et ce qu'il a coûté

Il contrôlait qu'un `battlerName` désigne **un sprite** : couche alpha, pas plus de 900×900. Tout
passait. Sauf que la bande visible du combat ne fait que **444 px de haut** — en dessous, c'est
l'interface. Un sprite de 780 px posé à `y=300` a **478 px au-dessus de l'écran**, et le joueur n'en
voit que les pieds qui pendent.

**298 placements sur 1 057 étaient dans ce cas**, sur 223 troupes, et le banc disait que tout allait
bien. Il mesurait le **motif** — « ça ressemble à un sprite » — au lieu du **symptôme** — « on le
voit en entier ». C'est très exactement l'erreur que §6 décrit.

Il mesure maintenant ce que le joueur voit : à la place la plus haute où une troupe pose l'ennemi,
le sprite **mis à l'échelle par son `<Scale Sprite: n%>`** doit tenir dans les 816×444 visibles.
201 ennemis portent désormais cette échelle ; les 346 autres tenaient déjà et n'ont rien reçu.

> `Sprite_Enemy` s'ancre aux **pieds** (ancre 0.5, 1) : `y` est le bas du sprite, jamais son haut.
> C'est ce qui rend l'erreur invisible à la lecture des données.

## `navigateur/jouer.js` — celui qui ouvre vraiment le jeu

Les dix autres **lisent des fichiers**. Celui-là lance le jeu, appuie sur les touches et
regarde : l'écran-titre, les plugins tiers effectivement chargés, la base entière relue par
le moteur, une nouvelle partie, la marche au clavier, le menu, l'écran des compétences, celui
de l'équipement, **un combat mené jusqu'à son terme**, **l'horloge qui tourne et la nuit qui
tombe**, **le chrono** — puis il compte les erreurs JavaScript et les ressources manquantes.

C'est le seul qui puisse dire si `js/plugins.js`, reconstruit à la main le 2026-09-15, tient
debout : une entrée qui désignerait un fichier absent ne lève **aucune erreur visible**, MV se
tait.

**Six pannes qu'il a attrapées et que rien d'autre n'aurait vues :**

| Ce qu'on voyait | Ce que c'était |
|---|---|
| la météo des saisons **ne partait jamais** — et serait partie **en plein combat de boss** | les 4 événements communs venus de la démo guettaient ses interrupteurs à elle *(116-119)*, et leur verrou maître tombait sur l'**interrupteur 4**, qui ici s'appelle **« combat boss1 »** |
| l'écran-titre s'affichait, et **« Nouvelle Partie » ne répondait plus** | 99 trous `null` dans `$dataSystem.variables`, créés en nommant la variable 200 d'un tableau long de 101. `Olivia_MetaControls` appelle `.match()` sur chaque nom au démarrage d'une partie |
| **le combat ne se terminait plus** | un saut de ligne collé à une valeur de réglage : MV demandait `audio/bgm/Ship3\n.ogg`. Un 404 muet, et la fin de combat reste en attente d'un son qui n'arrive jamais |
| **six commandes de menu en double** | `YEP_MainMenuManager` livre ses créneaux 50, 55, 90, 95 et 100 déjà remplis en exemple. Le second créneau `formation` rappelle `addOriginalCommands` — d'où le Music Book deux fois |
| la fenêtre du temps **recouvrait le menu** | deux fenêtres qui se superposent ne lèvent rien : elles se dessinent l'une sur l'autre |
| l'horloge s'affichait, mais mesurée sur la mauvaise case | le contrôle lisait `$gameVariables.value(200)` **choisi d'avance**. Il demande maintenant au plugin **quelles cases il emploie** (`$gameSystem._hour_variableId`) et lit celles-là |

> Le dernier est la règle n°2 appliquée au réglage d'un plugin : **on ne vérifie pas ce qu'on
> croit avoir écrit, on vérifie ce que le moteur emploie vraiment.**

**Et un contrôle qui accusait un innocent.** Le contrôle « aucun libellé en anglais » listait
`Options` et `Formation` comme suspects — ce sont les **termes français de JOKO**, écrits dans
`System.json`. Il vise désormais nommément les libellés que les plugins posent par défaut
*(`Quest`, `Patch Notes`, `Music Book`…)*. Règle n°3 : un contrôle doit **innocenter les faux**
autant qu'attraper le vrai.

Il n'est **pas automatique** — il lui faut Playwright et un serveur :

```bash
npx http-server -p 8899 -c-1 .        # dans un autre terminal, à la racine
node bancs/navigateur/jouer.js
```

Les captures atterrissent dans `bancs/navigateur/captures/` (non versionné).

## `navigateur/les_livres.js` — le plantage qu'on a livré pour n'avoir ouvert qu'un écran

`EnemyBook` et `ItemBook` ont été branchés le même jour. Le Bestiaire a été ouvert dans le
moteur et vérifié. L'Encyclopédie, non — elle plantait à l'ouverture :

```
TypeError: Cannot read property 'name' of null
at Window_ItemBookIndex.refresh (ItemBook.js:274)
```

**Et la cause est invisible dans `data/`.** Les quatre fichiers sont pleins : 2 000 objets,
560 armes, 290 armures, **zéro trou**. Mais `YEP_ItemCore` rallonge ces tableaux **au
démarrage** avec un réservoir d'emplacements **nuls** pour ses objets indépendants — mesuré
dans le moteur : les armes passent de 560 à **3 008 dont 2 440 nuls**, les armures de 290 à
**3 008 dont 2 710**. Les trois boucles de `refresh()` lisaient `.name` sans vérifier l'entrée.

> Un écran ne se vérifie pas en lisant les données : il se vérifie en l'**ouvrant**. Et quand
> deux écrans se ressemblent, on ouvre **les deux** — c'est exactement l'erreur qui a coûté ce
> plantage.

Contre-épreuve faite : la garde retirée, le banc rend 4 échecs et cite l'erreur mot pour mot.

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


## Le message qui tuait un village

Le 2026-09-24, JOKO a retiré le système des Dons Spirituels et gardé l'Avatar de
Korrah. Allumer `AvatarSpirituel.js` a fait tomber `une_journee_au_village.js` :
**0 PNJ pris en charge** au Village de Pêche, là où il y en avait douze.

Aucune erreur JavaScript. Aucun plantage. Le village était simplement mort.

La cause tient en une ligne de repli :

```js
if (w) { w.push('addText', txt); }              // le journal de combat
else if ($gameMessage && !$gameMessage.isBusy()) $gameMessage.add(txt);   // ← ici
```

Hors combat, il n'y a pas de journal — alors le greffon écrivait dans
`$gameMessage`. Sur la carte, une boîte de dialogue ouverte par du code n'est
pilotée par **aucun interpréteur** : personne ne la referme. `isBusy()` reste
vrai pour toujours. Et `VieDuVillage` teste précisément `$gameMessage.isBusy()`
avant de recenser ses PNJ.

Un message de combat, posé sur la carte, avait gelé tout ce qui attendait un
message libre.

**Ce que ça apprend.** Un greffon qu'on rallume n'est pas un greffon qu'on a
vérifié : celui-ci dormait depuis assez longtemps pour que son repli n'ait
jamais servi. Et surtout — *une panne sans erreur ne se voit qu'en jouant*. Le
seul contrôle qui l'a attrapée est celui qui compte les PNJ vivants sur une
vraie carte.

**Comment on l'a trouvée.** Pas en lisant le code : en bissectant. Quatre
bascules du registre, une à la fois, jusqu'à ce que le compte de PNJ remonte à
douze. Puis en mesurant `$gameMessage.isBusy()` sur la carte au lieu de le
supposer. Le texte en attente disait le reste :

```
textes en attente : 1  ["\\C[23]✦ Korrah rouvre les yeux — l'Armure Volante est là."]
```


## `occasion: 3` — la compétence que personne ne peut jouer

seiryu est devenu un vrai combattant le 2026-09-24. Au premier essai, il a
choisi **« Attaque »** — le coup de base — alors qu'il connaissait treize
techniques et qu'il avait 970 PM.

Le banc ne s'est pas contenté de constater : il a demandé à MV, ligne par ligne,
pourquoi chacune lui était refusée.

```
#1253 Déferlante d'Unisson   apprise=true  canUse=false  occasion=3  coût=true
```

`occasion: 3` veut dire **jamais jouable** — ni au menu, ni au combat. C'était
juste tant que l'Avatar était forcé à travers Korrah : le greffon appelait
`Game_Action` directement et court-circuitait `canUse()`. Le jour où il a fallu
que le personnage **choisisse lui-même**, MV a repris ses droits et lui a tout
refusé.

Trois d'entre elles avaient en plus `stypeId: 0`, le type que rien n'ouvre —
apprises et invisibles, le piège du §7.

**Ce que ça apprend.** Une donnée n'est pas juste ou fausse dans l'absolu : elle
est juste *pour un mécanisme donné*. Changer le mécanisme peut retourner sa
validité sans que rien ne bouge dans le fichier. Et surtout : quand un
personnage fait quelque chose d'inattendu, on ne relit pas le code — on demande
au moteur ce qu'il a refusé, et pourquoi.

---

## La chasse aux bugs (2026-10-02)

| Banc | Ce qu'il vérifie |
|---|---|
| `23_chasse_aux_bugs.js` | toutes les données, sans lancer le jeu : fichiers introuvables (y compris dans les commandes de plugin, les paramètres « fichier », les indicateurs MOG et les noms écrits en dur dans le code des plugins), scripts et formules qui ne compilent pas, références vers rien, commandes de plugin que personne ne lit, transferts sur une case d'où l'on ne peut plus bouger |
| `navigateur/la_chasse_aux_bugs.js` | le vrai moteur : chaque carte chargée et jouée 3 s, chaque page d'événement et chaque événement commun exécuté (premier et dernier choix), chaque troupe combattue en automatique. `cartes`, `pages`, `combats`, `--cartes-de / --cartes-a`, `--de / --a` |

Ce qu'ils ont trouvé et qui est corrigé : la neige `Snow_01A` (événement commun 229), le jingle `Recovery` du Feu d'Âme (EvenementsUtiles), le contre de Mahoraga qui faisait planter le combat suivant, le son vide préchargé par Irina (troupe 24), deux recettes d'atelier.

---

## Le dernier check-up (2026-10-02)

| Banc | Ce qu'il vérifie |
|---|---|
| `navigateur/les_plugins_qui_se_marchent_dessus.js` | **les conflits de plugins** : le jeu chargé comme MV le fait, une photo de toutes les fonctions du moteur entre deux plugins. Un plugin qui remplace la modification d'un AUTRE sans la rappeler est listé ; les 34 cas voulus sont relus un par un (liste `RELUS`). **À relancer quand tu ajoutes un plugin** : un conflit nouveau le fait échouer |
| `navigateur/les_textes_qui_debordent.js` | **le texte coupé** : chaque ligne de dialogue (8 870) et chaque description (1 387) mesurée avec la police du jeu, puis dessinée par la vraie fenêtre. 155 lignes et 388 descriptions dépassaient ; `TexteQuiTient.js` les fait tenir. `--sans-repli` : la contre-épreuve, plugin éteint |
| `navigateur/tous_les_menus.js` | **chaque commande du menu** ouverte, parcourue au clavier, refermée — et tout texte tracé hors de son cadre (il a trouvé l'Orbe, le journal des quêtes, le livre des musiques) |
| `navigateur/les_outils_de_scene.js` | **OutilsDeScene** : PNJ figés en scène, déplacement bloqué qui traverse, caméra, bandes, « passer » en maintenant Échap, « attendre » — chacun avec sa contre-épreuve |
| `navigateur/le_confort_et_latelier.js` | **ConfortDeLecture** (vitesse du texte mesurée en images, journal des dialogues) et **AtelierDeTest** (absent hors test ; F6, F7, F10, Ctrl+clic en test) |
| `navigateur/jouer_une_scene.js` | **joue une scène** comme un joueur et rend une planche d'images minutée, le déroulé, et ce qui cloche (bloqué ligne N, écran resté noir, images restées, mode cinématique oublié, joueur coincé). `--carte 1 --evenement 10 --page 1`, `--commun 20`, `--choix 2`, `--deroule` |
| `23_chasse_aux_bugs.js` (ajout) | **ce qui sort de sa feuille** : icône au-delà d'IconSet, visage ou sprite hors de son image, case d'animation au-delà de son image |

## Le pack Yanfly, en code maison (2026-10-03)

Quatre plugins inspirés de la collection Yanfly, sans rien en copier : **DialoguesPlus**, **EvenementsPlus**, **InterfacePlus**, **CombatPlus**. Chaque banc joue le vrai moteur et fait sa contre-épreuve.

| Banc | Ce qu'il vérifie |
|---|---|
| `navigateur/les_dialogues_plus.js` | choix `<si:>` cachés puis revenus, choix `<grisé:>` refusés, deux blocs de choix fusionnés qui mènent chacun à SA branche, `\bulle[n]` posée au-dessus de l'événement (et le message suivant revenu à sa place), macros `\m[…]` |
| `navigateur/les_evenements_plus.js` | modèles `<Modèle:>`, `APPEL`, `LOCALE`, étiquettes, gros événements `<Taille:>`, glace `<Glissant:>`, bruits de pas |
| `navigateur/les_interfaces_plus.js` | `TOUCHE` (et une touche non liée qui ne fait rien), image cliquable (et un clic à côté qui ne fait rien), `MENU_EC` avec l'entrée cachée par `<si:>` |
| `navigateur/le_combat_plus.js` | **en WebGL** (le rendu du jeu sur PC) puis en Canvas : la transition (tourbillon, éclats, boss, « mv »), mesurée en PIXELS à l'écran ; la musique et le fondu de MV à la même image ; la jauge ennemie (visé, touché, trace, effacement, `<Sans jauge>`, boss avec sa grande barre) ; l'ennemi qui vacille sous 25 %. Il attend en **images de jeu**, pas en millisecondes : en WebGL logiciel le jeu tourne à quelques images par seconde |
| `navigateur/les_outils_de_combat.js` | l'option « Animations (combat) » (vitesse 4 → 3 → 2 en combat, inchangée sur la carte), `COMBAT musique garder` (la musique de la carte reprend d'où MV l'avait coupée, une seule fois), `<Fond région n: …>` (et le fond habituel hors de la région) |
| `navigateur/le_test_de_combat.js` | le **« Test de combat »** de l'éditeur rejoué (`DataManager.setupBattleTest`, sans carte) : il plantait à l'ouverture (MOG_VisualTimer lisait la carte). Contre-épreuve : sans la garde d'Allegement, le banc voit le plantage |

**WebGL contre Canvas.** Chromium sans carte graphique refuse WebGL et MV passe alors en Canvas : tous les bancs d'avant tournaient en Canvas. `index.html?webgl` force WebGL (avec `--enable-unsafe-swiftshader --ignore-gpu-blocklist`). Ce rendu logiciel plafonne les textures à 8 192 px (comme beaucoup de portables) : IconSet.png en fait 8 384 de haut, et chaque icône posée par un sprite (états sur les ennemis, bandeaux) sortait en carré noir. **Corrigé le 2026-10-03** : Allegement découpe en pages, en mémoire, une image plus haute que ce que la carte accepte (l'image du projet n'est pas touchée) — `navigateur/les_icones_sur_les_sprites.js` le mesure en pixels contre une copie de référence passée par le même rendu, et sa contre-épreuve sans découpage voit le carré noir revenir.

**Ajouts du même jour.** `les_evenements_plus` vérifie aussi `<si:>` sur une page (⑩), `<Clic>` (⑪, mesuré JUSTE après le clic : sans la balise, MV fait marcher le joueur puis lance l'événement à l'arrivée), `<Décalage:>` (⑫), `<Région:>` (⑬) et `CHRONO` (⑭) ; `les_interfaces_plus` les événements communs automatiques (④, la montée de niveau passe par `changeExp(…, true)` : GALV_ManualLevel met l'expérience en réserve sinon), `CHOISIR` (⑤), `<Boutique si:>` (⑥) et la sauvegarde auto (⑦) ; `les_outils_de_scene` `SCENE icone` (⑦) ; `les_dialogues_plus` une condition qui contient « > » (`<si: v[3] >= 2>`), que l'ancienne lecture coupait au premier « > ».

**Les bancs en temps réel.** Le 2026-10-03, le Chromium des bancs tournait à 7 images par seconde (rendu logiciel), avec ou sans les plugins du jour (coût d'une image : 1,8 ms en ville, 6 à 7 ms sur la vitrine et ses 808 événements, mêmes chiffres avant et après). `la_vitrine` (une animation + un flash = 61 images, plus de 8 s à ce rythme) et `une_journee_en_ville` jugent en secondes réelles : à ce rythme ils signalent des pages « encore en cours » qui ne sont pas bloquées. Avant d'y voir un bug, mesurer `Graphics.frameCount` pendant l'attente.

**Les images d'armes.** `outils/images_des_armes.js [--ecrire]` pose `<Image d'arme: …>` sur les 226 armes (famille selon le type, couleur selon l'élément, sinon le rang de prix) ; tables réglables en tête, relançable, une balise écrite à la main n'est jamais touchée. ⚠ YEP_ItemCore vide la note des exemplaires possédés (`ItemNoteParse` éteint) : CombatPlus lit la balise sur l'arme d'origine (`baseItemId`), et `les_outils_de_combat` ④ le vérifie sur une vraie arme, sans retoucher sa note.

**Les décors libres.** `navigateur/les_decors.js` : les décors de `data/Decors.json` s'affichent sur leur carte, au pixel, sur leur couche, les `[3x1]` défilent, et pas sur une autre carte ; hors test, Ctrl+D n'ouvre rien ; en test, poser sous la souris, clic droit pour enlever (sans ouvrir le menu), Annuler, Enregistrer. ⚠ MV pose sur le canevas un paragraphe vide (`ErrorPrinter`) qui reçoit les clics : l'éditeur juge un clic à sa position, pas à l'élément touché. `outils/index_des_decors.js` refait `data/DecorsIndex.json` quand on ajoute des images dans `img/doodads`.


## Les systèmes gardés du pack (2026-10-03)

JOKO a gardé quinze systèmes du pack Yanfly, refaits en code maison dans quatre plugins : **CombatTactique** (limite d'équipe, barrière, provocation, overkill, instantané, usages limités, vol, difficulté), **MaitriseDesCompetences** (maîtrise, statistiques), **ExplorationPlus** (attaque surprise, furtivité, sols dangereux), **EconomiePlus** (artisanat, autres monnaies). Tout passe par des balises : rien n'est écrit dans `data/`. Les deux bancs créent leurs compétences, états, événements, régions et recettes d'essai **en mémoire**.

| Banc | Ce qu'il vérifie |
|---|---|
| `navigateur/le_combat_tactique.js` | la limite (+3 en frappant, +4 en encaissant, +15 quand un héros tombe, `<Coût limite>` qui bloque puis paie, gardée d'un combat à l'autre, jauge cachée sans compétence qui la coûte) ; la barrière (absorbe, s'épuise, `<Perce-barrière>`, 30 %, plafond, tours, départ ; le bleu mesuré en **pixels** sur la jauge de PV, et pas sans barrière) ; la provocation (60 coups sur 60, répartis sans elle, « magique » ne détourne pas un coup physique, un ennemi qui provoque est le seul visable) ; l'overkill (et un coup juste qui n'en donne pas) ; l'instantané (le héros rechoisit ; revenir en arrière retire l'action en plus) ; usages, vol, difficulté ; la maîtrise (★1 au 5e usage, +4 %) ; les statistiques (une victoire comptée **une** fois : YEP_VictoryAftermath rappelle `processVictory` à chaque image tant que l'écran de victoire est là, on compte donc dans `endBattle`) |
| `navigateur/lexploration_et_leconomie.js` | l'attaque surprise en **vrais déplacements** (le joueur fonce dans le dos d'un ennemi, un ennemi fonce dans le dos du joueur, face à face, `<Pas de surprise>`, un boss, un PNJ à la touche OK) ; la furtivité (repéré seulement collé, transparence, minuteur, objet, état) ; les sols en marchant (10 %, état, immunité, case sans danger) ; l'artisanat (entrée du menu seulement avec une recette, ingrédients, arme « indépendante » de YEP, quantité, atelier, écran) ; les monnaies (objet, variable, la boutique suivante revient à l'or) |

⚠ **La carte est relue au retour d'un combat** (`Scene_Map.create` recharge `$dataMap`) : un événement d'essai ajouté en mémoire doit être retiré de `$gameMap._events` avant, sinon les sprites plantent sur une page introuvable.
⚠ **`die()` ne tue pas** au sens de MV (il met les PV à 0 sans l'état de mort) : pour finir un combat, `setHp(0)`.
