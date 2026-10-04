# 🌌 SYSTÈME DE MANA — BIBLE DU JEU
### RPG Maker MV · Guide complet des Énergies, Sources, Éléments & Affinités
> Version remodelée & cohérente — intègre l'ancien guide (les 8 éléments, Âme vs Esprit, classes) avec la nouvelle théorie des **3 Sources Primordiales**.

---

## 0. RÉSUMÉ EN UNE PHRASE
> Tout être est un **triptyque — Corps, Âme, Esprit**. Chacun est un **puits de magie primordial** quasi impossible à puiser directement, alors les civilisations ont creusé des **branches secondaires** plus maniables (Négatif, Spirituelle, Positif), à partir desquelles naissent les **sorts, capacités et éléments**. Au sommet, transcendant tout : le **Mana Pur**.

---

## 1. LA TRINITÉ — LES 3 SOURCES PRIMORDIALES

Au commencement, il n'existe pas « de la magie » mais **trois puits de réalité**, un par facette de l'être vivant. Ce sont des **sources primordiales** : immenses, brutes, presque impossibles à utiliser directement. Un joueur peut avoir **plus d'affinité** avec l'une d'elles selon la nature de son **âme**.

| Facette | Source primordiale | Élément (ID jeu) | Nature | Couleur |
|---|---|---|---|---|
| **LE CORPS** | **Mana Sombre** | 5 · `Mana Sombre` | ~~Manifestation physique de **toutes les émotions et désirs enfouis**.~~ ⚠️ *Remplacé le 2026-10-04 (JOKO : « existe plus ») : le corps est l'instinct, sans émotion ; l'émotion vient de l'âme — voir [`CANON_LA_GENESE.md`](CANON_LA_GENESE.md).* Puissance brute et dévastatrice. | ⬛ Noir |
| **L'ÂME** | **Âme / Mana Spirituelle** | 2 · `mana spirituelle` | L'**essence immortelle** de l'être. Énergie produite directement par l'âme. | 🟥 Cramoisi |
| **L'ESPRIT** | **Mana Originel** | 6 · `Mana Originel` | Le **mental & la santé mentale** convertis en énergie créatrice. | 🟦 Cyan |

> ⚠️ **Pourquoi des branches secondaires ?**
> Puiser une source primordiale **directement** revient à plonger les mains dans un soleil. C'est mortel pour la quasi-totalité des joueurs. Pour rendre la magie **utilisable**, les peuples ont « domestiqué » chaque source en une **branche secondaire** plus douce et plus stable.

---

## 2. LES 3 BRANCHES SECONDAIRES (la magie « utilisable »)

Chaque source primordiale a été raffinée par une civilisation en une branche secondaire. **C'est là que naissent les vrais sorts, capacités et éléments.**

### 🟪 MANA NÉGATIF — la branche du **Corps** (ID 4 · `mana négative`)
> ⚠️ **Remplacé le 2026-10-04** (JOKO : « existe plus ») : le mana négatif vient des **voies d'art des mouvements** créées par **le Premier** — voir [`CANON_LA_GENESE.md`](CANON_LA_GENESE.md). L'ancienne version est gardée ci-dessous, barrée.
- ~~**Origine** : l'**Empire Vultric**, fondé par un joueur. Ils ont démontré que le Mana Sombre, longtemps cru **purement maléfique**, est en réalité un **concept fondamental** de la réalité.~~
- **Principe** : transformer ses **émotions et ses pensées sombres** en **puissance physique extraordinaire**.
- **Force** : capacités physiques surhumaines, dégâts bruts.
- **Contrepartie** : **inflige des blessures à l'utilisateur** et **draine ses PV**. Plus on frôle ses émotions les plus noires, plus on devient fort — au prix de son corps.

### 🟥 MANA SPIRITUELLE — la branche de l'**Âme** (ID 2)
- **Origine** : aussi ancienne que les âmes elles-mêmes. **Tout le monde peut l'apprendre** avec le temps.
- **Principe** : manipuler l'énergie produite par l'âme. Sa **forme et sa nature changent selon l'âme** de chacun (deux personnes n'ont jamais le même Mana Spirituel).
- **Utilisée par** : **Invocateurs**, **Nécromanciens**, et **Lou**, pour **manipuler les âmes**.
- **Contrepartie** : communiquer avec les âmes et jouer avec leur énergie est **extrêmement dangereux**, même pour les plus talentueux → **traumas et cauchemars** des âmes contactées.

### 🟦 MANA POSITIF — la branche de l'**Esprit** (ID 3 · `mana positive`)
- **Origine** : le **Culte des Sorcières des Étoiles**, fondé par une **joueuse**. Ce sont **les femmes** qui ont créé les sorts purement positifs.
- **Principe** : énergie liée à l'**intelligence**, aux **soins**, à l'**eau** et au **cosmos**.
- **Force** : la plus **polyvalente** ; facile à modifier et adapter.
- **Contrepartie** : de **plus en plus faible** quand la **santé mentale** du joueur décline (l'esprit fatigué produit moins de Mana Originel à raffiner).

> 📝 **Note de lore** : Mana Originel (primordial) ≈ le **potentiel mental brut** ; Mana Positif (secondaire) ≈ sa version **canalisée et bienveillante**. De même, Mana Sombre (brut, corps) ↔ Mana Négatif (canalisé). L'Âme/Spirituelle est particulière : sa branche secondaire porte presque le même nom car l'âme se laisse moins « domestiquer » — on travaille presque la source brute.

---

## 3. LE CYCLE DES AVANTAGES (style Pokémon)

Les trois branches secondaires forment un **pierre-feuille-ciseaux** :

```
        ┌──────────────────────────────┐
        ▼                              │
   MANA NÉGATIF  ──bat──►  ÂME / SPIRITUELLE  ──bat──►  MANA POSITIF
   (Corps)                  (Âme)                        (Esprit)
        ▲                                                   │
        └───────────────────bat─────────────────────────────┘
```

- **Mana Négatif > Âme/Spirituelle** : la fureur du corps brise les âmes fragiles.
- **Âme/Spirituelle > Mana Positif** : l'essence pure transperce les barrières de l'esprit.
- **Mana Positif > Mana Négatif** : la lumière de l'esprit apaise et contre la rage du corps.

> ⚖️ **Règle de combat** : frapper avec la branche **avantagée** inflige **×1.5 dégâts** ; frapper avec la branche **désavantagée** inflige **×0.5**. (Réglable dans les éléments de la base de données.)

### 👑 LE MANA PUR — au-dessus de tout (ID 7 · `Mana Parfait`)
Le **Mana Pur** transcende le cycle : il **ignore** les avantages/faiblesses des trois branches et des éléments. C'est l'énergie des **attaques magiques spéciales** des êtres transcendants.
- **Sous-branche ultra-rare : le MANA SEMI-PARFAIT** (skill type 7 dans ton jeu).
  - **1 chance sur 1000** : naître avec une affinité pour **toutes les sources** à la fois.
  - **Risque** : son usage **défie la réalité** elle-même (instabilité, conséquences imprévisibles).

---

## 4. LES 8 ÉLÉMENTS PHYSIQUES (la couche tactique)

Les éléments ne sont **pas naturellement utilisables** : ce sont des **formes** que l'on apprend à donner au mana. Ils constituent la couche tactique du combat, **indépendante** du cycle Négatif/Âme/Positif, mais **amplifiable** par certains manas. Le **Mana Pur** transcende les affinités élémentaires.

| Élément (ID jeu) | Faiblesse | Rôle | Amplifié par | Lié à la source |
|---|---|---|---|---|
| 🔴 **FEU** (8) | EAU | Attaque directe, brûlure continue | Mana Négatif | Corps |
| 🔵 **EAU** (9) | FOUDRE | Soin, ralentissement | Mana Positif | Esprit |
| 🟢 **VENT** (10) | GLACE | Vitesse, évasion, dégâts de zone | Mana Originel | Esprit |
| 🟤 **TERRE** (11) | VENT | Défense, écrasement | Résistance physique | Corps |
| 🟡 **FOUDRE** (12) | TERRE | Paralysie, dégâts techniques | INT (Mana Positif) | Esprit |
| 🧊 **GLACE** (13) | FEU | Gel, ralenti, armure | Précision mentale | Esprit |
| ⬜ **LUMIÈRE** (14) | OMBRE | Purification, guérison d'âme | Mana Pur | Âme |
| 🟣 **OMBRE** (15) | LUMIÈRE | Silence, peur, corruption | Mana Sombre | Corps |

### La Roue des Éléments (faiblesses)
```
FEU ─► EAU ─► FOUDRE ─► TERRE ─► VENT ─► GLACE ─► FEU
(chaque élément est faible contre le suivant)

OMBRE ◄──► LUMIÈRE   (s'opposent mutuellement)
```

### Combinaisons ÉLÉMENT + MANA (sorts signature)
| Combinaison | Sort | Effet |
|---|---|---|
| **Feu + Mana Négatif** | *Flammes Maudites* | Dégâts ×1.5, la brûlure **ignore la résistance au feu** |
| **Eau + Mana Positif** | *Vague Sacrée* | Soin de zone + **bouclier cosmique** pour tous les alliés |
| **Ombre + Mana Sombre** | *Puits d'Abîme* | Réduit à **0** la résistance magique ennemie pendant 2 tours |
| **Lumière + Mana Pur** | *Nova Sainte* | Purifie la corruption d'âme + dégâts massifs **non-élémentaux** |
| **Foudre + Mana Originel** | *Arc Créatif* | Le joueur **définit librement** la forme du sort au lancement |
| **Terre + Mana Spirituel** | *Forteresse d'Âme* | Crée un bouclier lié directement aux **PV de l'Objet Spirituel** |

---

## 5. ÂME vs ESPRIT — différences fondamentales

| | **ÂME** | **ESPRIT** |
|---|---|---|
| Nature | Essence spirituelle et **immortelle** | Dimension **mentale et intellectuelle** |
| Destructibilité | **Ne peut jamais être détruite** — elle retourne dans les **codes sources** du jeu | Peut être **fragilisé, brisé, ou guéri** selon la Santé Mentale (SAN) |
| Énergie produite | **Mana Spirituelle** | **Mana Originel** |
| Représentation | l'**Objet Spirituel** en surface | la **barre de Santé Mentale (SAN)** |
| Affinités | Invocateurs, nécromanciens | Mages créateurs, stratèges |
| Dégradation | **Corruption → perte de personnage permanente** | **Traumatisme → réduction du Mana Originel disponible** |

> 💡 **Le retour des âmes** : une âme peut être **absorbée, manipulée, changée, scellée**… mais **jamais réellement détruite**. Elle retourne dans les codes sources. **Seuls les joueurs non corrompus** peuvent revenir via les **sauvegardes**. Une âme corrompue, elle, ne revient **jamais vraiment**.

---

## 6. LE DON SPIRITUEL

> 📦 **Le dossier complet** — toutes les données récupérables (les 16 armes 501-516, les 4 reliques
> d'âme, les compétences, les états, les animations, les 3 plugins et leurs réglages) :
> **[`docs/DONS_SPIRITUELS.md`](docs/DONS_SPIRITUELS.md)**.

Le **Don Spirituel** est la manifestation physique de l'âme **en surface**. ~~Il n'est pas remis : il **apparaît de lui-même**, à la **première fois** qu'un marqué se sert vraiment de son âme.~~ On ne le choisit pas, on ne le fabrique pas.

> 🆕 **Le Don ne s'obtient QUE par le donjon de couverture** (JOKO, 2026-10-04) : *« on ne naît pas avec des dons, on peut QUE l'obtenir par le donjon »*. Réussir un donjon de couverture donne un **vrai Don** — seulement à qui n'en a pas encore, et **toujours un seul**. Voir [`CANON_LA_GENESE.md`](CANON_LA_GENESE.md).


**Image de l'âme = une coquille :**
- **La surface** : ce qui peut être **touché et matérialisé** → le Don Spirituel.
- **Les profondeurs** : là où résident le **Trait**, la **nature** de l'âme et ses pouvoirs secrets.

### 6.1 · Les trois formes du Don — **et chacune a sa place sur le corps**

| Forme | Fréquence | **Où ça se porte** | Ce qu'elle donne | Ce qu'elle coûte |
|---|---|---|---|---|
| ⚔️ **L'ARME spirituelle** | **80 %** | l'**Arme** | Rien de plus qu'une arme. Sa seule particularité est sa **résistance**, liée à l'âme. | **Rien** — l'accessoire et l'Âme restent **libres**. |
| 🔮 **L'OBJET spirituel** | **18 %** | l'**Accessoire** | Peut prendre **n'importe quelle forme** — y compris celle d'une arme — mais confère **un effet ou un talent**. | **L'accessoire.** On ne porte rien d'autre. |
| 👤 **L'AVATAR SPIRITUEL** | **2 %** | l'**Âme** | Une **créature née directement de l'âme**, qui **agit d'elle-même**. Peut porter **un Trait**. | **Le slot d'Âme.** |

> ⚖️ **C'est là tout l'équilibre.** L'arme des 80 % n'a l'air de rien — mais elle est la seule à ne
> **rien** prendre en échange. Un Objet et un Avatar sont plus forts, et plus chers : ils occupent
> une place que les autres gardent libre. **Un Don qu'on ne porte pas n'apporte plus rien**, et un
> Avatar absent **referme le Trait qu'il débloquait**.
>
> 🔒 **ET ON N'EN A QU'UN.** Une arme, OU un objet, OU un avatar — jamais deux, jamais de cumul.
> C'est ce qui donne son sens à la ligne ci-dessus : si tout le monde avait aussi une arme
> spirituelle, l'avantage des 80 % ne voudrait plus rien dire. Ce que le porteur tient dans
> l'autre main est de **l'acier ordinaire** : acheté, trouvé, remplaçable — et qui ne grandit
> pas tout seul. **Seul le Don fait ça.**

### 6.2 · L'Endurance — commune aux trois formes

Tout Don Spirituel possède une **jauge d'Endurance**. Elle **s'use à l'usage** et se **restaure au repos**.

> ⚠️ **Un Don ne se perd jamais.** Quand l'Endurance tombe à zéro, il **casse** — mais il reste utilisable. Simplement, **tout ce qu'il apporte est divisé par deux** : dégâts, effets, bénéfices. Un Don brisé n'est pas une arme perdue, c'est une arme qui ne tient plus sa promesse.

Plus le porteur est **puissant** — plus il monte en niveau, plus son âme s'affermit — **plus son Don résiste**. La jauge maximale grandit avec lui. Un marqué faible casse son arme en un combat ; un marqué accompli la fait tenir des semaines.

### 6.3 · ⚔️ L'ARME SPIRITUELLE (80 %)

Le cas ordinaire, celui de la grande majorité. **Aucun effet particulier, aucun talent, aucun pouvoir.** C'est une arme, et c'est tout. Sa seule vertu est de **résister** : elle est liée à l'âme, donc elle encaisse ce qu'aucun acier ne encaisserait.

C'est peu, et c'est déjà énorme : une arme qui ne se brise pas au premier choc, qui grandit avec toi, qu'on ne peut pas te voler — et **qui ne te prend aucun autre emplacement**. Là où un Objet mange l'accessoire et un Familier le slot d'Âme, l'Arme, elle, **ne coûte rien**.

**Aël** porte une arme spirituelle : un **arc et ses flèches**. Son accessoire et son Âme restent libres, et c'est tout son avantage. Et c'est son **unique** Don : elle n'a rien d'autre.

### 6.4 · 🔮 L'OBJET SPIRITUEL (18 %)

L'Objet peut avoir **exactement la même apparence qu'une arme** — la différence n'est pas visible. Ce qui le distingue, c'est qu'il **confère un effet ou un talent**.

Un Objet porte **deux jauges** : son **Endurance**, comme tout Don, et une **jauge propre** liée à son effet. Cette seconde jauge est le vrai piège : **en abuser a un prix**, et ce prix est toujours pire que la simple casse.

**L'Objet se porte à l'accessoire.** C'est son prix permanent : là où un porteur d'arme spirituelle met ce qu'il veut, celui d'un Objet ne met que son Objet.

**⬛ L'AMULETTE DE LUDWING — l'absorption des ombres**
Elle lui permet d'**absorber les ombres** et de **mieux les manier**. C'est elle qui donne l'impression que Ludwing possède **deux Traits, alors qu'il n'en a qu'un** : son Trait est l'absorption des âmes, l'ombre vient de l'amulette.
- Elle porte une **jauge d'Ombre** qui se remplit à mesure qu'il absorbe.
- **En abuser la fait exploser.** L'explosion **bloque temporairement ses capacités d'ombre**, le temps qu'il récupère, et **rend l'absorption d'âmes plus difficile**.

**🩸 LE MASQUE DE VESPER — le sang sans blessure**
Il lui permet d'**utiliser son sang comme elle l'entend sans se blesser** — son sang se régénère, et son style de combat *Sang* est appris par-dessus.
- Il porte une **jauge de Sang** qui se remplit à chaque technique de sang.
- **En abuser le brise.** La jauge pleine, **le masque se fend d'un coup** — sans attendre l'usure. Dès lors, **chaque attaque de sang la blesse pour de bon**, et son style de combat devient plus dur à tenir : **la régénération faiblit**.

### 6.5 · 👤 L'AVATAR SPIRITUEL (2 %)

Le cas **vraiment rare**. L'Avatar Spirituel est une **créature issue directement de l'âme** — pas une invocation, pas un pacte : une part de soi qui marche à côté de soi. Sa forme n'a aucune limite.

**Et il agit.** Ce n'est pas un objet qu'on porte : c'est **quelqu'un** qui se bat à côté de toi. Il joue **son propre tour**, choisit sa cible, frappe de lui-même — et se met devant toi quand tu es sur le point de tomber. Tu ne le commandes pas au coup par coup ; tu lui donnes une **posture** — *laisse-le faire*, *assaut*, *devant moi* — et il décide du reste. Ces trois ordres se donnent **en plein combat**, sans coûter de mana.

Son prix est à la mesure : chacune de ses actions **use l'Endurance du Don**, comme les tiennes. Un Avatar qui se bat tout le temps **brûle sa jauge deux fois plus vite** — et protéger l'use encore davantage. Brisé, il ne disparaît pas : il **fatigue**, n'agit plus qu'un tour sur deux, et tout ce qu'il fait vaut moitié moins.

**L'Avatar se porte à l'Âme** — c'est son prix : il occupe l'emplacement le plus profond, celui que personne d'autre n'utilise pour ça.

Ce qui rend les Avatars **redoutables**, c'est qu'un Avatar peut **porter un Trait**. Son porteur se retrouve alors avec **deux Traits** — et c'est bien **lui** qui possède le second, même si c'est l'Avatar qui l'a débloqué. **Sans l'Avatar, ce second Trait n'existe plus.**

**❄️ L'AVATAR SPIRITUEL DE KORRAH**
Une **armure volante** : des **poings** et un **torse** qui flottent sans corps.
- **Il est inséparable d'elle.** Rien ne peut le lui prendre — ni un désarmement, ni un dissipateur, ni la casse. Il ne meurt pas : brisé, il **fatigue**. Deux choses seulement l'éteignent : **elle tombe**, ou **elle perd conscience**. Elle rouvre les yeux, il est là.
- **Il monte en trois niveaux avec elle** — aux niveaux **25**, **50** et **85**. À chacun il gagne en puissance et **apprend deux techniques**.
- **Et elle le tient de mieux en mieux** : *automatique* au début (il décide tout), puis *semi-automatique* (elle désigne la cible, puis le geste), puis **contrôle total**. Plus la puissance monte, plus la prise est fine.
- Trait débloqué : **HIVER** — elle manipule la glace **directement, sans passer par une formule**.
- ⚠️ **Elle en subit les effets elle aussi.** Le froid ne fait pas de distinction — et l'Avatar ne lui donne **aucune** résistance à la glace.

---

## 6-bis. LES TRAITS

Le **Trait** est le don que l'âme offre à la naissance : une capacité unique, instinctive, qu'on ne contrôle jamais tout à fait. **Il est rare** — il faut une **certaine puissance**, une **volonté forte** et une **âme puissante**. La plupart des gens n'en ont aucun.

| Marqué | Trait | Ce qu'il fait |
|---|---|---|
| **Vesper** | **LE SANG** | Contrôle son sang **directement, sans formule**, et le **fusionne avec le mana**. |
| **Korrah** | **CHANGE** | Échange les places. *(Trait de base.)* |
| **Korrah** | **HIVER** | Manipule la glace sans formule — **elle en subit les effets aussi**. *(Via son Avatar Spirituel.)* |
| **Ludwing** | **L'ABSORPTION DES ÂMES** | Absorbe les âmes **directement** et les emploie. *(L'ombre vient de son amulette, pas de son Trait.)* |
| **Aël** | **MIRACLE** | **Développe de nouvelles techniques en temps réel.** |

### Le Miracle d'Aël — comment il fonctionne
Face à un ennemi, elle finit par **développer d'elle-même la technique capable de le toucher**, même si elle **ne connaît pas le sort**. Exemple : contre un ennemi faible au mana positif — en particulier au *Crépuscule* — elle développera au fil du combat de quoi l'atteindre.

Deux contraintes, et elles sont dures :
- **C'est lent.** Le Miracle prend du temps à se former.
- **Elle doit économiser son mana.** Trop en dépenser lui fait **perdre l'effet en cours de route**.

Ce qu'elle développe se **matérialise en flèches** — d'où les **Flèches Miracle**.

### ⚖️ La règle d'or : le Trait et le Don sont liés

**Le porteur est affecté par son propre Trait et par ses propres effets.** Un Trait de feu te brûle aussi. Le froid d'Hiver gèle Korrah. Le sang de Vesper est *son* sang.

C'est pour cela que **le Don Spirituel arrive presque toujours comme une sécurité adaptée au Trait** :

> Si mon Trait est le feu, mon Don sera très probablement quelque chose **à distance**, ou une pièce **faite pour manier le feu sans me blesser**.

Le Don n'est pas une récompense : c'est la réponse de l'âme au danger que le Trait lui fait courir. **Il faut donc bien jouer** — la puissance et la protection viennent du même endroit, et l'une ne va pas sans l'autre.

---

## 7. AFFINITÉS — comment un joueur se connecte aux sources

L'affinité dépend de la **nature de l'âme**. Elle détermine la **puissance** et la **facilité** dans chaque branche :

- **Plus d'affinité** avec une source → plus **puissant** et plus **à l'aise** dans sa branche secondaire… mais **des difficultés** dans les autres branches.
- L'affinité **n'est pas figée** : elle peut **changer au fil des décisions** prises dans la vie du personnage (lien direct avec le système de **Santé Mentale de l'Âme**).

**Distribution des affinités dans la population :**
| Cas | Fréquence | Description |
|---|---|---|---|
| Cas | Nom de société | Fréquence | Description courte |
| **Affinité Simple** (1 source) | *les Alignés* | **≈ 72 %** | Prédisposition claire à un puits. Le cas « normal ». |
| **Affinité Double** (2 sources) | *les Duaux* | **≈ 15 %** | Polyvalents, deux branches accessibles. Souvent élites/leaders. |
| **Aucune Affinité** (0 source) | *les Atones* | **≈ 12 %** | Aucun bonus naturel — tout apprendre à la dure. |
| **Affinité Triple** (3 sources, faibles) | *les Trines* | **≈ 0,9 %** | Touchent les 3 puits, mais aucun n'est dominant. |
| **Mana Semi-Parfait** (3 sources maîtrisées) | *les Élus du Prisme* | **≈ 0,1 % (1/1000)** | Apex absolu — sous-branche du Mana Pur. Défie la réalité. |

> *(Les pourcentages se cumulent à 100 % de la population des joueurs.)*

### 7.1 · Détail des cinq cas

**🟦 LES ALIGNÉS — Affinité Simple (≈72 %)**
La grande majorité. Une âme « penche » naturellement vers **un seul** puits (Corps, Âme ou Esprit).
- **Avantages** : puissance et facilité d'apprentissage **élevées** dans la branche secondaire correspondante. Coûts en mana réduits, montée en compétence rapide.
- **Inconvénients** : **difficulté marquée** dans les deux autres branches (coûts majorés, sorts instables, plafond de puissance bas).
- **Gameplay** : +20 % de dégâts/efficacité dans sa branche, −20 % dans les autres.
- **Exemples** : **Thylane** *(Corps → Négatif)*, **Neyssa** & **Tianna** *(Esprit → Positif)*.

**🟪 LES DUAUX — Affinité Double (≈15 %)**
Deux puits répondent à l'âme. Plus rare, souvent perçu comme un signe de destin.
- **Avantages** : **deux branches** réellement utilisables → grande **adaptabilité tactique** (peut couvrir une faiblesse du cycle).
- **Inconvénients** : maîtrise un peu **moins profonde** qu'un Aligné dans chaque branche (l'âme se partage). Risque de **conflit intérieur** si les deux sources s'opposent (ex. Corps + Esprit).
- **Gameplay** : +10 % dans ses deux branches, neutre dans la troisième.
- **Exemple** : **Lou** *(Âme + Esprit → Spirituelle + Originel)* — d'où sa capacité unique à manipuler les âmes **et** à copier/adapter, mais aussi ses **traumatismes intenses** (deux sources = deux portes ouvertes aux contrecoups).

**⬛ LES ATONES — Aucune Affinité (≈12 %)**
L'âme ne résonne avec aucun puits. Longtemps méprisés, parfois… les plus libres.
- **Avantages** : **aucune corruption naturelle**, aucune dépendance ; ils choisissent **librement** la branche qu'ils travaillent, et progressent de façon **stable et prévisible**. Insensibles à certains pièges (la rage du Négatif les blesse moins).
- **Inconvénients** : **aucun bonus** ; tout coûte plus cher et plus lentement au départ. Plafond plus bas sans entraînement acharné.
- **Gameplay** : 0 % bonus partout, mais **réduction des malus** (recul PV du Négatif/Sombre divisé par 2, immunité partielle à la corruption).
- **Lore** : beaucoup d'**artisans, marchands et stratèges** sont des Atones — ils compensent par l'intelligence et la technique, pas la magie.

**🌗 LES TRINES — Affinité Triple faible (≈0,9 %)**
Les trois puits frémissent, mais **aucun ne domine**. État instable, souvent transitoire.
- **Avantages** : accès aux **trois branches** → couvre tout le cycle.
- **Inconvénients** : **puissance diluée** (aucune source forte), grande **instabilité** — une mauvaise série de décisions peut faire basculer brutalement vers une seule source… ou vers la corruption.
- **Gameplay** : −10 % partout, mais peut utiliser **toutes** les branches sans pénalité d'accès.
- **Destin** : un Trine qui **stabilise** ses trois sources par une volonté extraordinaire peut « cristalliser » en **Élu du Prisme**.

**🌈 LES ÉLUS DU PRISME — Mana Semi-Parfait (≈0,1 %, 1/1000)**
L'apex. Sous-branche directe du **Mana Pur**. Affinité **totale et maîtrisée** avec les trois sources.
- **Avantages** : ignore le cycle, lance du **Mana Semi-Parfait** (skill type 7), accès quasi-illimité aux trois branches **et** aux éléments.
- **Le prix** : leur magie **défie la réalité** — chaque usage intense peut provoquer des **distorsions** (glitches du monde, retours de code, conséquences imprévisibles). Plus ils sont puissants, plus le monde **devient instable** autour d'eux.
- **Lore** : un Élu du Prisme est à la fois **bénédiction et menace** pour la trame du jeu. Les civilisations les craignent autant qu'elles les vénèrent.

### 7.2 · L'affinité n'est PAS figée
L'affinité dépend de la **nature de l'âme**, mais cette nature **évolue avec les décisions** du personnage :
- Frôler ses émotions noires sans cesse → glissement vers le **Corps (Négatif/Sombre)**.
- Cultiver la sérénité, l'étude, l'altruisme → renforcement de l'**Esprit (Positif)**.
- Côtoyer la mort, les âmes, le deuil → ouverture vers l'**Âme (Spirituelle)**.
- Une **chute de santé mentale (SAN)** peut **fermer** temporairement l'accès à une source (l'esprit brisé produit moins de Mana Originel).

> ⚙️ **Branchement jeu** : ce glissement est déjà piloté par tes jauges de **Santé Mentale de l'Âme** (vars 11–14). On peut faire **changer l'affinité `<Mana>` d'un héros automatiquement** quand sa jauge bascule de phase (ex. Thylane qui sombre → son affinité Négatif s'intensifie).

---

## 8. CLASSES & AFFINITÉS DE MANA

| Classe | Affinité dominante | Spécialité |
|---|---|---|
| **Mage des Étoiles** | Mana Positif + Eau/Cosmos | Guérison cosmique, prédiction, protection |
| **Nécromancien** | Mana Spirituelle + Ombre | Manipulation d'âmes, résurrection corrompue |
| **Berserker Arcanique** | Mana Négatif + Feu | Dégâts bruts, auto-destruction maîtrisée |
| **Invocateur** | Mana Spirituelle + Terre/Vent | Création d'entités, lien avec les âmes |
| **Ombremancien** | Mana Sombre + Ombre | Corruption, manipulation psychique, abîme |
| **Artiste Arcanique** | Mana Originel + Tout élément | Sorts libres, adaptation en combat |
| **Élu / Transcendant** | Mana Pur + Multi-éléments | **Classe finale**, accès aux pouvoirs absolus |
| **Lou** *(personnage)* | Mana Spirituelle + Originel | Manipulation d'âmes — **traumatismes intenses** |

---

## 9. HISTOIRE — les grands tournants de la magie

1. **L'Ère des Sources Brutes** : les premiers joueurs ne pouvaient toucher que les puits primordiaux. La plupart en mouraient. La magie était rare, terrifiante, presque mythique.
2. **Le Culte des Sorcières des Étoiles** *(fondé par une joueuse)* : domestication de l'Esprit en **Mana Positif**. Naissance des **soins**, de l'**eau** et des sorts **cosmiques**. La magie devient enseignable.
~~3. **L'Empire Vultric** *(fondé par un joueur)* : réhabilitation du **Mana Sombre**, longtemps cru maléfique. Création du **Mana Négatif** — la force par les émotions. La guerre change de visage.~~ ⚠️ *Remplacé le 2026-10-04 : voir `CANON_LA_GENESE.md`.*
4. **Les Nécromanciens & Invocateurs** : maîtrise progressive de la **Mana Spirituelle**, au prix de traumas. On apprend à parler aux âmes.
5. **L'Éveil du Mana Pur** : l'apparition des premiers **Transcendants**, et la légende du **Mana Semi-Parfait** (1/1000) qui défie la réalité.

---

## 10. EXEMPLES CONCRETS (pour comprendre vite)

- **Une berserker au Mana Négatif** lance *Flammes Maudites* sur une nécromancienne (Âme) → **avantage du cycle (×1.5)** : la rage du corps brise l'âme fragile. Mais elle **perd des PV** à chaque coup.
- **Une Sorcière des Étoiles (Mana Positif)** affronte cette même berserker → **avantage (×1.5)** : la lumière de l'esprit apaise la rage. Sauf que si la Sorcière a une **mauvaise SAN**, son Mana Positif s'**affaiblit**.
- **Lou (Mana Spirituelle)** absorbe une âme ennemie → il se renforce, mais **récolte le trauma** de l'âme (cf. *LouCopySystem* : aspiration → soin + risque de Trauma).
- **Un Élu** lance *Nova Sainte* (Lumière + Mana Pur) → **ignore toutes les résistances** et purifie la corruption : aucun cycle ne le contre.
- **Un joueur sans affinité** doit choisir une branche et l'apprendre lentement, sans bonus — mais sans malus de corruption non plus.

---

## 11. CORRESPONDANCE AVEC TA BASE DE DONNÉES (RPG Maker MV)

**Éléments (`System.json`)** — déjà en place, à utiliser tels quels :
| ID | Nom en base | Rôle dans le lore |
|---|---|---|
| 1 | Physique | attaques d'arme / Objet Spirituel |
| 2 | mana spirituelle | **Âme** (source) |
| 3 | mana positive | branche **Esprit** |
| 4 | mana négative | branche **Corps** |
| 5 | Mana Sombre | **Corps** (source brute) |
| 6 | Mana Originel | **Esprit** (source brute) |
| 7 | Mana Parfait | **Mana Pur** |
| 8–15 | FEU…OMBRE | les 8 éléments physiques |

**Réglage du cycle (à faire dans Base de données ▸ Types ▸ Éléments, onglet des traits d'ennemis/armures, OU via un plugin d'affinités) :**
- mana négative **fort** contre mana spirituelle → résistance cible **200 %**
- mana spirituelle **fort** contre mana positive → **200 %**
- mana positive **fort** contre mana négative → **200 %**
- branche désavantagée → **50 %**
- Mana Parfait → **100 %** partout (jamais réduit, jamais augmenté)

**Skill Types utiles déjà présents** : `9 · ame`, `10 · sang`, `7 · MANA semi-parfait`, `19 · Arts Sereins`.

---

## 12. LES 8 ÉLÉMENTS EN DÉTAIL

> Les éléments ne sont que des **formes** données au mana. Chacun « penche » vers une des trois sources, ce qui explique qui les manie le mieux.

- **🔴 FEU (8) — source : Corps.** L'élément de la fureur. Attaque directe et **brûlure continue** qui ronge tour après tour. Amplifié par le Mana Négatif (*Flammes Maudites*). Manié par les **Berserkers Arcaniques**. *« La colère qui prend forme. »*
- **🔵 EAU (9) — source : Esprit.** Le flux apaisant. **Soin** et **ralentissement** de l'ennemi. Amplifié par le Mana Positif (*Vague Sacrée*). Cœur de l'art des **Mages des Étoiles**. *« L'intelligence qui s'écoule. »*
- **🟢 VENT (10) — source : Esprit.** La liberté. **Vitesse, esquive, dégâts de zone**. Lié au Mana Originel — un esprit vif fend l'air. Favori des **Invocateurs** mobiles.
- **🟤 TERRE (11) — source : Corps.** L'ancrage. **Défense et écrasement**. Lié à la résistance physique : un corps solide devient une muraille.
- **🟡 FOUDRE (12) — source : Esprit.** La sanction. **Paralysie** et dégâts techniques. Sa puissance suit l'**INT** (Mana Positif). *Arc Créatif* avec le Mana Originel : le lanceur **dessine** son éclair.
- **🧊 GLACE (13) — source : Esprit.** Le contrôle. **Gel, ralenti, armure**. Lié à la précision mentale — l'esprit froid ne tremble pas.
- **⬜ LUMIÈRE (14) — source : Âme.** La rédemption. **Purification** et **guérison d'âme**. Seul élément qui répare la corruption. Amplifié par le Mana Pur (*Nova Sainte*). *« Ce qui ramène l'âme à sa source. »*
- **🟣 OMBRE (15) — source : Corps.** L'abîme. **Silence, peur, corruption**. Amplifié par le Mana Sombre (*Puits d'Abîme*). Arme des **Ombremanciens** et des **Nécromanciens**. *« Les désirs qu'on n'ose pas nommer. »*

**Règle d'or** : Lumière ⇄ Ombre s'annulent ; le reste suit la Roue (Feu→Eau→Foudre→Terre→Vent→Glace→Feu). Le **Mana Pur** ignore toute affinité élémentaire.

---

## 13. LES GRANDES FACTIONS

**🟦 Le Culte des Sorcières des Étoiles** *(branche : Mana Positif)*
Fondé par **une joueuse** à l'Ère où l'Esprit semblait inutilisable. Les Sorcières ont prouvé qu'en canalisant l'intelligence et la compassion, on pouvait **soigner, prédire et protéger**. Hiérarchie matriarcale, sanctuaires bâtis sous le ciel étoilé (d'où le nom), savoir transmis de maîtresse à élève. Aujourd'hui, elles **enseignent** la magie au plus grand nombre — sans elles, la magie serait restée mortelle.

**🟪 L'Empire Vultric** *(branche : Mana Négatif)*
Fondé par **un joueur** visionnaire. Là où tous voyaient le **Mana Sombre** comme purement maléfique, Vultric a démontré que c'était un **concept fondamental** : transformer ses émotions — même les plus noires — en **force physique extraordinaire**. L'Empire en a fait une discipline militaire. Leurs guerriers sont terrifiants… mais **se consument** de l'intérieur (le Négatif draine la vie). Doctrine : *« La force se paie avec sa propre chair. »*

**🟥 Les Voix de l'Âme** *(branche : Mana Spirituelle)*
Ni un empire ni un culte, mais une **constellation de cercles** : nécromanciens, invocateurs, médiums. Ils parlent aux âmes, en tirent puissance et savoir interdit. **Lou** en est un héritier sauvage. Leur règle tacite : ne **jamais** écouter une âme trop longtemps — les traumas des morts deviennent les tiens.

**🌈 L'Ordre du Prisme** *(Mana Pur / Semi-Parfait)*
Quasi-mythique. Rassemblerait les rares **Élus du Prisme**. Vénéré et craint, car la présence prolongée d'un Élu **déforme la réalité** autour de lui. Beaucoup doutent qu'il existe encore.

---

## 14. LA MÉTAPHYSIQUE DES CODES SOURCES

Ce monde est **numérique**. Cela a des conséquences concrètes sur les règles de l'existence :
- Une **âme** n'est jamais vraiment détruite : absorbée, scellée, brisée… elle **retourne dans les codes sources** du jeu.
- Les **joueurs** (âmes non corrompues) peuvent **revenir** grâce aux **sauvegardes** — c'est leur privilège, et la vraie raison de leur quasi-immortalité.
- Les **PNJ** et les **âmes corrompues** n'ont pas ce filet : une fois retournés au code, ils ne reviennent **jamais vraiment** identiques.
- La **corruption** n'est donc pas une « mort » ordinaire : c'est une **réécriture** de l'âme dans les sources, irréversible.

> C'est pourquoi protéger son âme > protéger son corps : le corps n'est qu'un fichier temporaire ; l'âme est la **donnée originelle**.

---

## 15. CORRUPTION, MORT & RÉSURRECTION

**Comment l'âme se corrompt :**
- Abus du **Mana Sombre/Négatif** (frôler sans cesse ses émotions noires).
- Écouter trop d'**âmes** (Mana Spirituelle mal maîtrisé → traumas qui s'incrustent).
- **Santé mentale (SAN)** au plus bas trop longtemps → fissures, puis réécriture.

**À la mort du corps :**
1. L'**Objet Spirituel** se brise (manifestation de surface détruite).
2. L'âme se replie vers les **codes sources**.
3. **Si joueur non corrompu** → peut **recharger une sauvegarde** et revenir intact.
4. **Si corrompu** → réécriture : retour possible, mais **altéré** (perte de traits, de souvenirs, voire de personnage — *game over narratif*).

**Lien avec tes systèmes** : c'est exactement ce que modélise **JadeEntitePlunging** (jauges 11–14, phases d'effondrement) et la fin **« Carnage »/« Dévoré »** du calcul de fin.

---

## 16. L'ÉCONOMIE DU MANA (règles de combat avancées)

- **Coût** : chaque sort puise dans la source du lanceur. Plus on est **éloigné** de son affinité, plus le coût explose (cf. malus des Alignés).
- **Surmenage / Surcharge d'Âme** : puiser au-delà de ses limites inflige les états **Surcharge d'Âme (1/2/MAX)** — d'abord un boost, puis l'effondrement.
- **Mana Négatif & Sombre** : ne coûtent pas (ou peu) de PM… mais **des PV** (recul). C'est le marché du Corps : la vie contre la puissance.
- **Mana Positif & la SAN** : sa puissance **décroît** avec une mauvaise santé mentale (un esprit brisé soigne mal).
- **Mana Pur** : le plus coûteux et le plus rare ; en échange, il **ignore les défenses**.

> ⚙️ **Déjà en jeu** via `ManaAffinity.js` (recul PV, Positif/SAN, Pur perce-résistances) et les états Surcharge d'Âme de ta base.

---

## 17. LE DON SPIRITUEL — ÉVOLUTION

> *Chapitre 6 dit **ce qu'est** un Don et quelles formes il prend. Celui-ci dit **comment il grandit**.*

Le Don grandit avec le **niveau** et l'**âme** du porteur, en **quatre paliers** :
1. **Éclat** (Niv. 1+) : forme brute, à peine éveillée. Reflète un trait dominant.
2. **Forme** (Niv. ~15) : le Don « choisit » sa nature définitive selon les **décisions** du joueur.
3. **Résonance** (Niv. ~35) : les **profondeurs** de l'âme s'ouvrent — une capacité spéciale unique se débloque.
4. **Vérité** (Niv. ~60) : le Don devient l'expression totale de l'âme. Forme finale, liée à la fin obtenue.

**Ce que chaque palier change concrètement** : l'**Endurance maximale** monte à chaque palier — c'est la traduction directe de « plus tu es puissant, plus ton Don résiste » (§6.2). Un Éclat casse vite ; une Vérité ne casse presque plus.

**Surface vs Profondeurs** : la *surface* est ce qu'on touche (stats, apparence) ; les *profondeurs* portent le **Trait**, la nature et les pouvoirs secrets. Deux héros avec la même arme n'ont **jamais** le même Don Spirituel.

---

## 18. LEXIQUE EXPRESS

| Terme | Définition |
|---|---|
| **Source primordiale** | Un des 3 puits bruts : Corps (Sombre), Âme, Esprit (Originel). |
| **Branche secondaire** | Version domestiquée d'une source : Négatif, Spirituelle, Positif. |
| **Affinité** | Penchant de l'âme vers une/plusieurs sources. Évolue avec les choix. |
| **SAN** | Santé Mentale ; gouverne l'Esprit et le Mana Originel/Positif. |
| **Objet Spirituel** | Manifestation physique de l'âme ; arme/objet de départ évolutif. |
| **Codes sources** | Le « code » du monde où retournent les âmes. |
| **Corruption** | Réécriture irréversible d'une âme dans les codes sources. |
| **Mana Pur / Semi-Parfait** | Énergie transcendante ; 1/1000 la maîtrise, au prix de la réalité. |

---

> *« Au centre de tout se trouve l'Âme — unique, immortelle, et seul vrai reflet du joueur dans ce monde. Protège-la. Car si le corps peut guérir, une âme corrompue ne revient jamais vraiment. »*
