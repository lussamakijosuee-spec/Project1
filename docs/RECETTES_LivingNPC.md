# RECETTES `LivingNPC` — LES 52 PNJ, PRÊTS À COPIER-COLLER

> **Tout le casting de `LivingNPC.js`, un bloc par PNJ.** Pour chacun : la ligne de **Commentaire**
> et la **Commande de plugin** exactes à taper, plus un aperçu de ce qu'il dit et de ses sujets.
> Fiche complète du plugin (barks, rumeurs, technique) : `docs/PLUGIN_LivingNPC.md`.

## COMMENT S'EN SERVIR (à lire une fois)
Dans RPG Maker MV, tu ne colles pas un événement depuis du texte — tu **recopies les deux lignes** de chaque bloc :
1. Crée un événement sur la carte.
2. `Commandes ▸ Commentaire` → colle la ligne **`<NPC: clé>`**.
3. `Commandes ▸ Commande de plugin` → colle la ligne **`NPC talk clé`**.
4. Règle le **Déclencheur** et la **Priorité** indiqués en tête de chaque section.
5. Donne-lui un **graphisme** (le plugin ne pose pas l'image, juste le comportement).

> Les **barks** (petites phrases flottantes) apparaissent **tout seuls** dès que le joueur est proche — rien à câbler.
> Les PNJ « ambiance » n'ont même pas besoin de la commande : pose juste le commentaire.

---

## 🧩 LES 3 MODÈLES UNIVERSELS (copie, puis remplace la clé)

**A) PNJ qui parle (civils, lore, soldats, service)**
```
Déclencheur : Touche d'action    Priorité : Comme les personnages
◆ Commentaire        : <NPC: mira>
◆ Commande de plugin : NPC talk mira
```

**B) PNJ d'ambiance (juste vivant, barks auto)**
```
Déclencheur : (Action ou aucun)  Mouvement : Au hasard   Priorité : Comme les personnages
◆ Commentaire : <NPC: paysan>
```

**C) PNJ de service (parle PUIS ouvre une boutique/auberge/soin)**
```
Déclencheur : Touche d'action    Priorité : Comme les personnages
◆ Commentaire        : <NPC: marchand>
◆ Commande de plugin : NPC talk marchand
◆ Traitement d'une boutique : … (ta boutique)      ← ou Soin complet / Repos / FORGE selon le PNJ
```

---

# LE CASTING — 52 BLOCS PRÊTS

## CIVILS INTERACTIFS (20) — riches, avec menu de sujets
> Réglage recommandé pour ce type : **Touche d'action · Priorité : Comme les personnages**

### Mira la tavernière  `mira`
*Sujets :* **Le monde** · **Les rumeurs** · **Et toi, Mira ?**
*Il/elle dit :* « Un visage neuf ! Assieds-toi, l'étranger. La première chope est pour les curieux. »
```
Commentaire        : <NPC: mira>
Commande de plugin : NPC talk mira
```

### Orin le vieux pêcheur  `orin`
*Sujets :* **Le passé** · **Les âmes** · **Un conseil**
*Il/elle dit :* « Hé. Tu n'es pas d'ici. Ça se voit à ta façon de regarder l'horizon. »
```
Commentaire        : <NPC: orin>
Commande de plugin : NPC talk orin
```

### Lyse la marchande  `lyse`
*Sujets :* **Les affaires** · **Tes prix** · **Un secret**
*Il/elle dit :* « Acheteur ? Curieux ? Voleur ? Décide-toi vite, j'ai pas que ça à faire. »
```
Commentaire        : <NPC: lyse>
Commande de plugin : NPC talk lyse
```

### Tobias l'enfant  `tobias`
*Sujets :* **Jouer** · **La dame** · **Une vérité**
*Il/elle dit :* « Tu brilles bizarre ! Comme les gens qui tombent du ciel. T'es tombé du ciel toi aussi ? »
```
Commentaire        : <NPC: tobias>
Commande de plugin : NPC talk tobias
```

### Selena la voyante  `selena`
*Sujets :* **Mon avenir** · **Jada** · **Le Créateur**
*Il/elle dit :* « Je t'attendais. Non — je VOUS attendais. Combien d'âmes portes-tu, voyageur ? »
```
Commentaire        : <NPC: selena>
Commande de plugin : NPC talk selena
```

### Dame Elara, mage de la cour  `dame_elara`
*Sujets :* **Ce monde** · **Un conseil** · **Qui es-tu vraiment ?**
*Il/elle dit :* « Oh… te voilà enfin. Approche, mon enfant, n'aie pas peur. Je t'attendais. …Façon de parler, bien sûr. »
```
Commentaire        : <NPC: dame_elara>
Commande de plugin : NPC talk dame_elara
```

### Le Roi Aldric  `roi`
*Sujets :* **Le royaume** · **Ta requête** · **Dame Elara**
*Il/elle dit :* « Ainsi, c'est toi que les présages annonçaient. Relève-toi, voyageur — mon royaume a besoin de bras, et plus encore d'âme. »
```
Commentaire        : <NPC: roi>
Commande de plugin : NPC talk roi
```

### La Reine Sériane  `reine`
*Sujets :* **La cour** · **Le Roi** · **Un conseil**
*Il/elle dit :* « Sois le bienvenu en ces murs, enfant. La cour t'observe déjà — tiens-toi avec grâce. »
```
Commentaire        : <NPC: reine>
Commande de plugin : NPC talk reine
```

### Le Chambellan  `chambellan`
*Il/elle dit :* « Le protocole, voyageur, le protocole ! »
```
Commentaire        : <NPC: chambellan>
Commande de plugin : NPC talk chambellan
```

### Dame de la cour  `dame_cour`
*Sujets :* **Les ragots** · **La cour**
*Il/elle dit :* « Oh, du sang neuf à la cour ! Raconte, raconte… »
```
Commentaire        : <NPC: dame_cour>
Commande de plugin : NPC talk dame_cour
```

### Régis le Magnifique  `regis`
*Sujets :* **Te défier** · **Ton « talent »** · **Quentin**
*Il/elle dit :* « Tiens, tiens. Encore un figurant qui se croit héros. MOI, je suis le véritable élu de ce monde. Incline-toi, tant que c'est gratuit. »
```
Commentaire        : <NPC: regis>
Commande de plugin : NPC talk regis
```

### Quentin  `quentin`
*Sujets :* **Régis** · **Et toi ?**
*Il/elle dit :* « …Salut. »
```
Commentaire        : <NPC: quentin>
Commande de plugin : NPC talk quentin
```

### Muta  `muta`
*Sujets :* **Marchander** · **Mes affaires volées ?!** · **Ton refuge** · **L'Empire**
*Il/elle dit :* « Hé, l'ami ! Approche ! T'as une tête de bonne affaire, toi. (Une explosion claque entre ses doigts.) T'inquiète — c'est juste mon charme. »
```
Commentaire        : <NPC: muta>
Commande de plugin : NPC talk muta
```

### Yuki la boulangère  `yuki`
*Sujets :* **Ta cuisine** · **Ton passé**
*Il/elle dit :* « Oh ! Bienvenue ! Tu as l'air affamé… tiens, c'est offert. Un ventre plein, c'est déjà un peu de bonheur, non ? »
```
Commentaire        : <NPC: yuki>
Commande de plugin : NPC talk yuki
```

### Kaze  `kaze`
*Sujets :* **Une énigme** · **Le monde**
*Il/elle dit :* « …Mh ? Tu veux quelque chose ? C'est fatigant, les gens qui veulent des choses. …Bon. Vas-y. Vite. »
```
Commentaire        : <NPC: kaze>
Commande de plugin : NPC talk kaze
```

### Sora  `sora`
*Sujets :* **Ton rêve** · **L'amitié**
*Il/elle dit :* « OUAAAH t'es trop cool ! Tu te bats ? Moi aussi je me bats ! On devient amis ? On devient amis ! »
```
Commentaire        : <NPC: sora>
Commande de plugin : NPC talk sora
```

### Ren  `ren`
*Sujets :* **La force** · **Ton passé**
*Il/elle dit :* « Hn. »
```
Commentaire        : <NPC: ren>
Commande de plugin : NPC talk ren
```

### Lila  `lila`
*Sujets :* **Jouer** · **Es-tu dangereuse ?**
*Il/elle dit :* « Oooh~ une nouvelle tête ! (Elle tourne autour de toi.) Tu es… intéressant. J'adore les choses intéressantes. Elles cassent si joliment. »
```
Commentaire        : <NPC: lila>
Commande de plugin : NPC talk lila
```

### Goro  `goro`
*Sujets :* **L'honneur** · **Tout va bien ?**
*Il/elle dit :* « Oh ! Petite personne ! Attention, je ne t'avais pas vu. Je m'appelle Goro. Je protège. C'est ce que je fais de mieux. »
```
Commentaire        : <NPC: goro>
Commande de plugin : NPC talk goro
```

### Mei  `mei`
*Sujets :* **L'organisation** · **Tu vas bien ?**
*Il/elle dit :* « Tu es en retard ! …Sur quoi, je l'ignore, mais sûrement quelque chose ! Tiens-toi droit, je te surveille ! »
```
Commentaire        : <NPC: mei>
Commande de plugin : NPC talk mei
```

## SOLDATS (7) — barks « garde de Skyrim »
> Réglage recommandé pour ce type : **Touche d'action · Mouvement : Au hasard · Priorité : Comme les personnages**

### Garde  `garde_ville`
*Il/elle dit :* « Circule, citoyen. »
```
Commentaire        : <NPC: garde_ville>
Commande de plugin : NPC talk garde_ville
```

### Garde de la porte  `garde_porte`
*Il/elle dit :* « Personne ne passe sans raison. »
```
Commentaire        : <NPC: garde_porte>
Commande de plugin : NPC talk garde_porte
```

### Sentinelle  `sentinelle`
*Il/elle dit :* « … »
```
Commentaire        : <NPC: sentinelle>
Commande de plugin : NPC talk sentinelle
```

### Capitaine Vance  `capitaine`
*Il/elle dit :* « Soldat. Ou civil ? Peu importe, tiens-toi droit. »
```
Commentaire        : <NPC: capitaine>
Commande de plugin : NPC talk capitaine
```

### Recrue  `recrue`
*Il/elle dit :* « J-je monte la garde ! Tout va bien ! »
```
Commentaire        : <NPC: recrue>
Commande de plugin : NPC talk recrue
```

### Vétéran  `veteran`
*Il/elle dit :* « Hmpf. Encore un jeune qui croit comprendre ce monde. »
```
Commentaire        : <NPC: veteran>
Commande de plugin : NPC talk veteran
```

### Chevalier de la couronne  `chevalier`
*Il/elle dit :* « Honneur et devoir, voyageur. »
```
Commentaire        : <NPC: chevalier>
Commande de plugin : NPC talk chevalier
```

## LORE (7) — porteurs d'histoire
> Réglage recommandé pour ce type : **Touche d'action · Priorité : Comme les personnages**

### Érudit Halewyn  `erudit`
*Il/elle dit :* « Ah, un esprit curieux ! Laisse-moi t'instruire. »
```
Commentaire        : <NPC: erudit>
Commande de plugin : NPC talk erudit
```

### Prêtre du Feu d'Âme  `pretre`
*Il/elle dit :* « Que la flamme veille sur ton âme, voyageur. »
```
Commentaire        : <NPC: pretre>
Commande de plugin : NPC talk pretre
```

### Archiviste Nell  `archiviste`
*Il/elle dit :* « Chut. Ici, on respecte les morts en lisant ce qu'ils ont laissé. »
```
Commentaire        : <NPC: archiviste>
Commande de plugin : NPC talk archiviste
```

### L'Ermite  `ermite`
*Il/elle dit :* « Va-t'en. …Ou reste. Je parle seul de toute façon. »
```
Commentaire        : <NPC: ermite>
Commande de plugin : NPC talk ermite
```

### Caelan le barde  `barde`
*Il/elle dit :* « Une chanson contre une pièce, ou une histoire contre un sourire ? »
```
Commentaire        : <NPC: barde>
Commande de plugin : NPC talk barde
```

### Le Fossoyeur  `fossoyeur`
*Il/elle dit :* « Encore vivant, toi. Tant mieux. J'ai assez de travail. »
```
Commentaire        : <NPC: fossoyeur>
Commande de plugin : NPC talk fossoyeur
```

### Le Vieux Conseiller  `conseiller`
*Il/elle dit :* « Hmm ? Ah, un jeune. Approche, que je te raconte l'avant. »
```
Commentaire        : <NPC: conseiller>
Commande de plugin : NPC talk conseiller
```

## PNJ DE SERVICE (6) — à coupler à une boutique/auberge/soin
> Réglage recommandé pour ce type : **Touche d'action · Priorité : Comme les personnages**

### Marchand  `marchand`
*Il/elle dit :* « Bienvenue ! Regarde ma marchandise, tu trouveras ton bonheur. »
```
Commentaire        : <NPC: marchand>
Commande de plugin : NPC talk marchand
```

### Guérisseuse  `guerisseur`
*Il/elle dit :* « Tu es blessé ? Approche, je vais arranger ça. »
```
Commentaire        : <NPC: guerisseur>
Commande de plugin : NPC talk guerisseur
```

### Forgeron Bram  `forgeron`
*Il/elle dit :* « Tu as du métal à travailler ? Pose ça sur l'enclume. »
```
Commentaire        : <NPC: forgeron>
Commande de plugin : NPC talk forgeron
```

### Aubergiste  `aubergiste`
*Il/elle dit :* « Une chambre ? Un repos répare bien des choses, va. »
```
Commentaire        : <NPC: aubergiste>
Commande de plugin : NPC talk aubergiste
```

### Changeur  `banquier`
*Il/elle dit :* « Or, âmes, faveurs : je convertis tout, contre commission. »
```
Commentaire        : <NPC: banquier>
Commande de plugin : NPC talk banquier
```

### Maître d'armes  `maitre_arme`
*Il/elle dit :* « Tu veux apprendre à te battre ? Montre-moi tes mains. »
```
Commentaire        : <NPC: maitre_arme>
Commande de plugin : NPC talk maitre_arme
```

## AMBIANCE (12) — la vie de la ville (barks auto)
> Réglage recommandé pour ce type : **Mouvement : Au hasard · Priorité : Comme les personnages**

### Paysan  `paysan`
*Il/elle dit :* « M'sieur-dame. »
```
Commentaire        : <NPC: paysan>
Commande de plugin : NPC talk paysan      (optionnel — les barks tournent seuls)
```

### Mère de famille  `mere`
*Il/elle dit :* « Pardon, j'ai les petits à surveiller. »
```
Commentaire        : <NPC: mere>
Commande de plugin : NPC talk mere      (optionnel — les barks tournent seuls)
```

### Ivrogne  `ivrogne`
*Il/elle dit :* « Hé… hic… t'es réel toi ? Personne est réel ici… »
```
Commentaire        : <NPC: ivrogne>
Commande de plugin : NPC talk ivrogne      (optionnel — les barks tournent seuls)
```

### Mendiant  `mendiant`
*Il/elle dit :* « Une pièce ? Une âme ? N'importe quoi… »
```
Commentaire        : <NPC: mendiant>
Commande de plugin : NPC talk mendiant      (optionnel — les barks tournent seuls)
```

### Noble  `noble`
*Il/elle dit :* « Écartez-vous. Je ne fréquente pas les… aventuriers. »
```
Commentaire        : <NPC: noble>
Commande de plugin : NPC talk noble      (optionnel — les barks tournent seuls)
```

### Ouvrier  `ouvrier`
*Il/elle dit :* « Faut que je bosse, désolé. »
```
Commentaire        : <NPC: ouvrier>
Commande de plugin : NPC talk ouvrier      (optionnel — les barks tournent seuls)
```

### Chasseuse  `chasseur`
*Il/elle dit :* « Silence. Tu fais fuir le gibier. »
```
Commentaire        : <NPC: chasseur>
Commande de plugin : NPC talk chasseur      (optionnel — les barks tournent seuls)
```

### Voyageur  `voyageur`
*Il/elle dit :* « Salut, compagnon de route. »
```
Commentaire        : <NPC: voyageur>
Commande de plugin : NPC talk voyageur      (optionnel — les barks tournent seuls)
```

### Servante  `servante`
*Il/elle dit :* « Pardon, j'ai le service à finir. »
```
Commentaire        : <NPC: servante>
Commande de plugin : NPC talk servante      (optionnel — les barks tournent seuls)
```

### Cuisinier du château  `cuisinier`
*Il/elle dit :* « Hors de ma cuisine ! …Ah, un invité. Goûte, alors. »
```
Commentaire        : <NPC: cuisinier>
Commande de plugin : NPC talk cuisinier      (optionnel — les barks tournent seuls)
```

### Page  `page_cour`
*Il/elle dit :* « Un message ? Je cours, je cours ! »
```
Commentaire        : <NPC: page_cour>
Commande de plugin : NPC talk page_cour      (optionnel — les barks tournent seuls)
```

### Jardinier  `jardinier`
*Il/elle dit :* « Les roses du château, c'est moi. Touche pas. »
```
Commentaire        : <NPC: jardinier>
Commande de plugin : NPC talk jardinier      (optionnel — les barks tournent seuls)
```

---

# 🔧 RECETTES UTILITAIRES (copier-coller)

### Crieur public / panneau de rumeurs
```
◆ Commande de plugin : NPC rumeur
```

### Forcer un bark (mise en scène)
```
◆ Commande de plugin : NPC bark ivrogne
```

### Faire taire un PNJ pendant une cutscene
```
◆ Commande de plugin : NPC mute       (depuis l'événement du PNJ à museler)
```

### Brancher un PNJ « service » sur son vrai système
| PNJ | Après `NPC talk …`, ajoute |
|---|---|
| `marchand` / `muta` / `lyse` | `Traitement d'une boutique` |
| `guerisseur` | `Modifier PV : tout le groupe, +9999` (soin) |
| `aubergiste` | `Fondu au noir` + `Récupérer tout le groupe` (repos) |
| `forgeron` | `Commande de plugin : FORGE` |
| `banquier` | ta logique d'or/âmes |
| `maitre_arme` | `Commande de plugin : SANCTUAIRE` (apprendre) |

### Brancher une rumeur sur TON histoire
Édite la table `RUMORS` en haut de `js/plugins/LivingNPC.js` (les interrupteurs 21/22/23 sont des **exemples**) :
```js
{ sw: 12, text: [ 'On dit que le pont de Valombre s\'est effondré cette nuit.' ] },
```
→ dès que l'interrupteur **12** est ON, la rumeur circule chez tous les PNJ « aware ».

### Ajouter un PNJ qui n'existe pas encore
Ajoute une entrée dans l'objet `NPCS` (voir `docs/PLUGIN_LivingNPC.md` §9), puis pose `<NPC: taclé>` + `NPC talk taclé`.

---

## ✅ RÉCAP — les 4 commandes
| Commande | Effet |
|---|---|
| `NPC talk <clé>` | dialogue complet (accueil + rumeur + sujets) |
| `NPC bark <clé>` | force une réplique flottante |
| `NPC rumeur` | affiche une rumeur du moment |
| `NPC mute <clé>` | coupe les barks du PNJ |

> **Voir aussi :** `docs/PLUGIN_LivingNPC.md` (le plugin à fond), `docs/RECETTES.md` §1 (autres recettes PNJ,
> dont `PNJVivantsPlus` : réactions aux jauges, destin/chute des PNJ, l'Envers), `docs/INDEX.md`.
