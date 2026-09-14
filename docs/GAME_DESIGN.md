# GAME DESIGN — *L'Empire aux Trois Têtes*

> **Ce que ce document est.** L'extrait **implémentable** du lore : ce qui devient une valeur,
> un état, une jauge, une formule ou un plugin. Rien d'autre. Pas de narration, pas d'ambiance,
> pas de personnages secondaires sans mécanique.
>
> **Ce que ce document n'est pas.** Une décision. Là où deux fichiers de lore se contredisent, ou
> là où une règle est ambiguë, **rien n'est tranché** : la question part en fin de page, section
> [**À TRANCHER**](#à-trancher).
>
> **Sources lues** *(toutes archivées dans `_ancien_projet/03_lore_canon/`)* :
> `lore.md` · `EMPIRE_DU_CORPS.md` · `SYSTEME_DE_MANA.md` · `DONS_SPIRITUELS.md` ·
> `personnages.md` · `scenario.md` · `bestiaire.md` · `perso-iris-et-joah.md` ·
> `codex-trois-sources.html` (v5) · `codex-trois-sources-v10.html` · `breviaire-cendres.html` ·
> `notes/Le Gardien de l'Orbe Harmonique.txt` · `_archive/` (Battle World, marqué obsolète).
>
> **Convention de lecture :**
> 🟩 = écrit noir sur blanc dans le lore · 🟨 = chiffre qui ne vient **que** de l'ancienne
> implémentation (`_ancien_projet/04_documentation_technique/`), donc à confirmer avant usage ·
> ⬜ = mécanique nommée par le lore mais **non chiffrée** nulle part.

---

## 1 · LES PERSONNAGES JOUABLES

### 1.1 · La règle du Don — commune aux quatre

🟩 **Un seul Don par personne.** Une **Arme**, **OU** un **Objet**, **OU** un **Avatar
Spirituel**. Jamais deux, jamais de cumul. Ce que le porteur tient dans l'autre main est de
l'acier ordinaire, acheté ou trouvé, qui ne monte pas de palier tout seul.
*(`DONS_SPIRITUELS.md` §0 · `SYSTEME_DE_MANA.md` §6.1)*

| Forme | Fréquence | Slot occupé (`etypeId`) | Ce qu'elle donne | Ce qu'elle coûte |
|---|---|---|---|---|
| ⚔️ **Arme** | 🟩 80 % | **1 · Arme** | rien de plus qu'une arme — sa résistance est liée à l'âme | rien : Accessoire et Âme restent libres |
| 🔮 **Objet** | 🟩 18 % | **5 · Accessoire** | **un effet ou un talent** + **une seconde jauge** | tout l'accessoire |
| 👤 **Avatar Spirituel** | 🟩 2 % | **7 · Ame** | une **créature qui agit seule**, et qui peut porter un **Trait** | tout le slot Âme |

🟩 **Le Don apparaît de lui-même**, la première fois qu'un marqué se sert vraiment de son âme.
Il n'est ni remis, ni fabriqué, ni choisi.
🟩 **Il ne se retire pas et ne se prête pas** : il est né de cette âme-là.
🟩 **Il grandit en 4 paliers** : `Éclat` → `Forme` → `Résonance` → `Vérité`.
🟨 Seuils de niveau : **1 · 15 · 35 · 60**.
🟩 Le mot **« Éclat » est réservé au palier 1 d'un Don** : une arme ordinaire ne s'appelle jamais « Éclat de… ».

**Endurance** — commune aux trois formes. 🟩 Elle s'use à l'usage, se restaure au repos ; plus le
porteur est puissant, plus son Don résiste. 🟩 **À zéro, le Don casse mais reste utilisable :
tout ce qu'il apporte est divisé par deux.**
🟨 Formule : `enduranceMax = 40 + niveau × 2 + (palier − 1) × 20` · usure 1 par action
offensive · malus de casse ×0,50.

**La seconde jauge** — 🟩 propre aux **Objets** seulement. Chaque Objet a sa jauge, son carburant
et sa punition, et 🟩 **en abuser coûte toujours plus cher que de laisser l'Endurance tomber**.

### 1.2 · Le Trait — commun aux quatre

🟩 Le Trait est **donné à la naissance par l'Âme**, rare (il faut de la puissance, une volonté
forte, une âme puissante), **instinctif**, **impossible à prêter**. Il permet de faire
directement ce que les autres font par formule. *(`DONS_SPIRITUELS.md` §2 · `codex v10`, « Les Traits »)*

🟩 **Le prix, et c'est la règle de sécurité du système :** *l'utilisateur est affecté par ses
propres effets.* Un Trait de feu brûle aussi son porteur. **C'est pour cela que le Don arrive
comme la sécurité adaptée au Trait** — un Trait de feu appelle un Don à distance, ou une pièce
faite pour manier le feu sans se brûler.

🟩 Le Trait **puise dans les trois énergies à la fois** : il prend sur le mana réservé aux sorts,
brûle la vitalité, et force la marque (→ Errance). 🟩 **Une marque creuse ne répond plus : le
Trait s'éteint avec elle.**
🟨 Tarif chiffré par usage, en plus du coût affiché : **−20 % PM max · −20 TP · +2 Errance**.

### 1.3 · Les quatre marqués — **deux attributions concurrentes**

⚠️ **Les sources ne disent pas la même chose.** Les deux tableaux ci-dessous sont incompatibles
sur le Don *et* sur le Trait de chaque héros. Ils sont donnés tels quels ; l'arbitrage est en
[À TRANCHER §1](#1--quelle-attribution-don--trait-fait-foi-).

**Lecture A — `DONS_SPIRITUELS.md` v3.0** *(le dossier le plus détaillé ; c'est aussi celle que reprend `CLAUDE.md`)*

| Héros | Don unique | Forme | Slot | Sa main tient | Trait |
|---|---|---|---|---|---|
| 🩸 **Vesper** | le **Masque** | Objet | 5 · Accessoire | acier | **sang** |
| ❄️ **Korrah** | l'**Armure Volante** | Avatar | 7 · Ame | acier | **change** + **hiver** *(via l'Avatar)* |
| ⬛ **ludwing** | l'**Amulette** | Objet | 5 · Accessoire | acier | **ames** |
| ✦ **Aël** | l'**Arc et ses Flèches** | Arme | 1 · Arme | *son Don* | **miracle** |

**Lecture B — `codex-trois-sources-v10.html`, « Les héritiers du prix »**

| Héros | Don | Trait | Source | Chute | Carte finale |
|---|---|---|---|---|---|
| ✦ **Aël** — l'Équilibre | sa **lame** | le **Point de Rupture** — le coup touche toujours le défaut | les trois, tenues | aucune en propre : **les trois** | la **Convergence** |
| ❄️ **Korrah** — la Maîtrise | le **Sablier de Givre** | l'**Instant Gelé** — Zéro Absolu ; ne rate jamais, engourdit | Corps | la **Bête** | la **Mue Souveraine** |
| ⬛ **ludwing** — le Symbole | ses **familiers** | la **Porte d'Ombre** — passage par l'Envers ; quasi intouchable un souffle | Âme | l'**Errant** | le **Royaume Impérial des Ténèbres** |
| 🩸 **Vesper** — la Parole | le **Premier Mot** | le **Verbe Vrai** — nommer, et le monde obéit ; ne rate jamais | Esprit | le **Dément** | la **Parole Originelle** |

### 1.4 · Effets mécaniques par héros — ce qui est écrit dans les deux lectures

#### 🩸 VESPER

| Élément | Effet mécanique | Source |
|---|---|---|
| **le Masque** *(Objet, slot 5)* | tant qu'il tient, **elle taille dans son propre sang sans se blesser**. C'est tout son talent d'Objet. | 🟩 A |
| **jauge de SANG** | monte à chaque technique de sang · **pleine → le Masque SE FEND d'un coup** (Endurance à zéro sans attendre l'usure) | 🟩 A |
| **Masque fendu** | chaque attaque de sang lui coûte un **% de ses PV max** · sa **régénération tombe de moitié** · tout ce que le Masque apporte ÷2 | 🟩 A |
| 🟨 chiffres | jauge 0-100 · +10 par technique · coût 8 % PV max | 🟨 A |
| **techniques de SANG** | `skillType 10` | 🟩 A |
| **Trait `sang`** | contrôler son sang **directement, sans formule**, et le **fusionner avec du mana** | 🟩 A |
| **Trait `Verbe Vrai`** | ses frappes portées par le Trait **ne ratent jamais** · « Viens » attire · « Assez » arrête · « Debout » relève | 🟩 B |
| **ultime — la Parole Originelle** | magie **qui ne peut plus rater** | 🟩 B |

#### ❄️ KORRAH

| Élément | Effet mécanique | Source |
|---|---|---|
| **l'Armure Volante** *(Avatar, slot 7)* | des **poings et un torse qui flottent sans corps**. **Il agit de lui-même, à son propre tour** — ce n'est pas une seconde action pour elle, elle ne dépense rien. | 🟩 A |
| **inséparabilité** | rien ne le lui prend (ni désarmement, ni dissipateur, ni le joueur). **Brisé, il ne meurt pas : il fatigue.** Deux choses seulement l'éteignent : **elle tombe**, ou **elle perd conscience**. Elle rouvre les yeux, il est là. | 🟩 A |
| **interception** | quand elle encaisse, l'Avatar en prend une part — et c'est **son Endurance** qui paie | 🟩 A |
| **3 niveaux d'Avatar** | il monte **avec elle** ; à chaque niveau : **+puissance**, **+interception**, **deux nouvelles techniques** | 🟩 A |
| **contrôle croissant** | `automatique` → `semi-auto` (elle désigne la **cible**) → `semi-auto affermi` (elle choisit le **geste**) → `contrôle total` | 🟩 A |
| **3 postures**, en plein combat | `libre` · `agressif` · `garde` — **0 mana, 0 TP, le tour n'est pas perdu** | 🟩 A |
| **ordres dirigés** | un ordre **passe outre la posture de garde** ; un ordre au-dessus du niveau d'Avatar est **refusé proprement**, sans gaspiller le tour | 🟩 A |
| ⚠️ **l'Avatar ne porte pas le Trait à sa place** | ses frappes n'ont pas l'élément GLACE et **ne déclenchent pas le recul d'HIVER** — sinon l'Avatar serait la faille qui annule la règle d'or | 🟩 A |
| 🟨 chiffres | seuils **25 / 50 / 85** · +15 % puissance et +5 interception par niveau · bonus passif **+10 % ATQ/DÉF/AGI** (+5 % brisé, 0 retiré) · postures : interception 20 % / peu / **45 %** · l'Avatar brûle l'Endurance **deux fois plus vite**, +2 par interception | 🟨 A |
| **Trait `hiver`** | manipule la glace **sans formule** — ⚠️ **le froid l'atteint elle aussi**, et l'Avatar ne lui donne **aucune** résistance à la glace. Débloqué **par l'Avatar** : Avatar absent → Trait absent, compétences `<Trait: hiver>` **impayables**. | 🟩 A |
| **Trait `change`** | ⬜ nommé « son Trait de base ». **Aucune mécanique écrite nulle part.** | ⬜ A |
| **Trait `Instant Gelé`** | froid absolu qui **fige la matière, l'air, le mouvement** ; frappes qui **ne ratent jamais** et **engourdissent** (ralenti, alourdi) ; relâché d'un coup = **Instant Absolu**, le champ se fige | 🟩 B |
| **ultime — la Mue Souveraine** | lâcher la Bête **en gardant la laisse** ; **à chaque Mue commandée, la laisse s'use un peu** | 🟩 B |

#### ⬛ LUDWING

| Élément | Effet mécanique | Source |
|---|---|---|
| **l'Amulette** *(Objet, slot 5)* | **absorbe les ombres et les lui rend maniables** — c'est elle qui donne l'impression qu'il a deux Traits alors qu'il n'en a qu'un | 🟩 A |
| **ouverture des types d'ombre** | **deux types par palier** : P1 → épée, dague · P2 → + hache, katana · P3 → + lance, griffe · P4 → + arc, arme à feu (**les huit**) | 🟩 A |
| **jauge d'OMBRE** | monte à chaque technique d'ombre · **pleine → elle EXPLOSE** : capacités d'ombre **bloquées**, et **absorption d'âmes deux fois moins efficace** pendant ce temps | 🟩 A |
| 🟨 chiffres | jauge 0-100 · +12 par technique · blocage **4 tours** | 🟨 A |
| **techniques d'ombre** | `skillType 11 à 18` · **techniques d'âme** : `skillType 9` | 🟩 A |
| **Trait `ames`** | **absorber les âmes directement** et les employer | 🟩 A |
| **Trait `Porte d'Ombre`** | ce n'est **pas** de la téléportation : un **passage** par l'Envers ; l'espace d'un souffle, **presque impossible à toucher** (→ esquive). Ses **familiers** viennent de là. | 🟩 B |
| **ultime — le Royaume Impérial des Ténèbres** | expansion de domaine : **toutes les âmes moissonnées reviennent d'un coup**, les **invocations ne coûtent plus rien**, ses forces décuplent, l'arsenal s'ouvre. **Prix : ça gonfle l'Errance.** | 🟩 B |
| **copie** | voir une technique ennemie et **la refaire, âme contre âme** ; chaque emprunt le déleste un peu plus de lui-même | 🟩 B |
| **porteur du stock** | c'est **lui** qui porte le stock d'âmes du groupe | 🟩 A+B |

#### ✦ AËL

| Élément | Effet mécanique | Source |
|---|---|---|
| **l'Arc et ses Flèches** *(Arme, slot 1)* | **aucun effet, aucun talent** : une arme qui ne cède pas. En échange, **Accessoire et Âme restent libres** — c'est l'avantage des 80 %. | 🟩 A |
| **Trait `miracle`** | **développe de nouvelles techniques en temps réel** : face à un ennemi faible à un mana positif (le **Crépuscule** en particulier), elle finit par développer la technique capable de le toucher **même sans connaître le sort** | 🟩 A |
| **les deux contraintes de Miracle** | **c'est lent** · et **elle doit ne pas trop dépenser de mana**, sinon elle **perd l'effet en cours de route** | 🟩 A |
| **matérialisation** | ce qu'elle développe **se matérialise en flèches** → la **Flèche de Miracle** | 🟩 A |
| **Trait `Point de Rupture`** | voit **la faille exacte** ; les coups portés par le Trait **touchent toujours le défaut** (critique / point mortel systématique) | 🟩 B |
| **ultime — la Convergence** | fondre les trois sources un instant, **ignorer toute résistance**, frapper d'un mana qui n'appartient à aucune voie | 🟩 B |
| **son Accessoire** | 🟩 le **Carquois d'Étoiles n'est pas un Don** : c'est un carquois, il marque la place libre | 🟩 A |

---

## 2 · LES ÉLÉMENTS ET LEURS CODES

🟩 Les éléments **ne se trouvent pas dans la nature** : ce sont des **formes** qu'on donne au
mana. *(`codex v10` · `SYSTEME_DE_MANA.md` §4)*

### 2.1 · Les sources et les branches

| Code | Nom | Rôle | Chiffres attachés |
|---|---|---|---|
| **1** | Physique | arme / Don | — |
| **2** | mana spirituelle | 🟩 **Âme** — source *et* branche (l'art du **Symbole**) | 🟨 usage offensif **+1 Errance**, mise à mort **+5** |
| **3** | mana positive | 🟩 branche **Esprit** (l'art de la **Parole**) | 🟩 **faiblit quand la lucidité baisse** · 🟨 ×0,85 / ×0,70 / ×0,55 |
| **4** | mana négative | 🟩 branche **Corps** (l'art de la **Maîtrise**), ce qu'on **projette** | 🟩 **recul en PV** · 🟨 15 % des dégâts · 🟨 +2 corruption |
| **5** | Mana Sombre | 🟩 **Corps** — la source brute qui dort dans les veines | 🟨 recul 25 % · 🟨 +3 corruption |
| **6** | Mana Originel | 🟩 **Esprit** — la source brute | — |
| **7** | **AME** *(nom réel dans `System.json`)* | 🟩 le **Mana Pur** | 🟩 **perce toute résistance** |
| **16** | mana semi parfait | 🟩 l'équilibre des trois | 🟩 perce aussi toute résistance |

> ⚠️ `SYSTEME_DE_MANA.md` §11 nomme le code 7 « **Mana Parfait** » ; l'ancienne base
> (`_ancien_projet/01_base_de_donnees/System.json`) le nomme « **AME** ». → [À TRANCHER §6](#6--le-code-7--ame-ou-mana-parfait-).

### 2.2 · Les huit fondamentaux

| Code | Élément | 🟩 Esprit du sort | 🟩 Source vers laquelle il penche |
|---|---|---|---|
| **8** | FEU | brûlure, élan, destruction | Corps |
| **9** | EAU | flux, soin, apaisement | Esprit |
| **10** | VENT | poussée, vitesse, souffle | Esprit |
| **11** | TERRE | défense, masse, endurance | Corps |
| **12** | FOUDRE | choc, vitesse, jugement | Esprit |
| **13** | GLACE | gel, contrôle, silence | Esprit |
| **14** | LUMIÈRE | révélation, soin, vérité | Âme |
| **15** | OMBRE | corruption, secret, âme | Corps |

### 2.3 · Les dérivés — **la règle est une addition**

🟩 **On forge un élément nouveau en additionnant deux codes.** Le total est ≥ 16, donc les huit
fondamentaux restent intacts. *(`codex v10`, « Créer des éléments »)*

| Code | Élément | = |
|---|---|---|
| **17** | Vapeur | Feu (8) + Eau (9) |
| **19** | Lave | Feu (8) + Terre (11) |
| **20** | Plante | Eau (9) + Terre (11) |
| **22** | Givre | Eau (9) + Glace (13) |
| **23** | Métal | Terre (11) + Foudre (12) |
| **29** | **Crépuscule** | Lumière (14) + Ombre (15) — 🟩 *la faiblesse que **Miracle** apprend à toucher* |

### 2.4 · Les avantages

🟩 **Seuls Lumière ⇄ Ombre s'opposent** — faibles l'un à l'autre.
🟩 **Le Mana Pur perce toute résistance élémentaire.**
🟩 **Un élément n'a pas de valeur morale** : l'Ombre n'est pas le mal, la Lumière n'est pas le
bien. C'est la main qui décide.

⚠️ `SYSTEME_DE_MANA.md` §3 et §4 décrivent en plus un **cycle pierre-feuille-ciseaux entre
branches (×1,5 / ×0,5)** et une **roue élémentaire** (Feu→Eau→Foudre→Terre→Vent→Glace→Feu).
`lore.md` et `codex v10` disent explicitement que **ces deux mécaniques ont été retirées**.
→ [À TRANCHER §4](#4--le-cycle-des-branches-et-la-roue-des-éléments--retirés-ou-pas-).

---

## 3 · LES ÉTATS NÉCESSAIRES

> Liste des états à créer dans `data/States.json`. **Aucun id n'est attribué ici** : la base est
> vide, et l'attribution d'ids est une décision de JOKO. Les effets chiffrés marqués 🟨 viennent
> de l'ancienne implémentation.

### 3.1 · Les paliers de Chute — **obligatoires** (ce sont les états moteur du jeu)

| État | Posé quand | Effet | |
|---|---|---|---|
| **Frémissement** | Corruption ≥ seuil 1 | 🟩 sens surdéveloppés · encore **réversible** · 🟨 MAT ×0,9 · MDF ×0,9 | 🟩 |
| **Fièvre** | Corruption ≥ seuil 2 | 🟩 le corps mute par éclats · 🟩 *c'est à ce stade que les chasseurs exécutent* · 🟨 MAT/MDF ×0,8 · PV max ×0,9 | 🟩 |
| **la Mue** | Corruption au max | 🟩 **tu n'es plus humain** · 🟨 MAT/MDF ×0,65 · PV max ×0,8 · **dégâts Sombre reçus ×1,4** | 🟩 |
| **Décharné** | Errance ≥ seuil 1 | ⬜ non chiffré | 🟩 |
| **Gonflé d'âmes** | Errance ≥ seuil 2 | 🟩 **murmures d'Aldébaran** | 🟩 |
| **l'Errant** | Errance au max | 🟩 glisse hors du monde physique | 🟩 |
| **Marque Fêlée / Affamée / Gonflée / Creuse** | 🟨 phase mentale ≤ 2 / Corr ≥ 70 / Err ≥ 40 / une jauge au max | 🟩 **descriptif** — la Marque *dit* l'état, elle ne double pas la peine. 🟩 **Marque creuse → le Trait s'éteint.** | 🟩 |
| **Surpassé** *(Mana Semi-Parfait)* | 🟩 les trois jauges tenues au centre | 🟩 +stats, +critique · 🟨 ATK ×1,15 · MAT ×1,15 · +10 % crit · 🟨 conditions : 3 jauges ≥ 15 % d'intensité **et** écart max-min ≤ 22 % | 🟩 |

### 3.2 · Les états de Don

| État | Posé quand | Effet |
|---|---|---|
| **Don brisé** | Endurance à 0 | 🟩 le Don **reste utilisable**, tout ce qu'il apporte **÷2** |
| **Masque fendu** | jauge de Sang pleine | 🟩 attaques de sang coûtent des PV · 🟩 **régénération ÷2** · 🟩 apport du Masque ÷2 |
| **Ombre scellée** | jauge d'Ombre pleine | 🟩 capacités d'ombre **bloquées** · 🟩 absorption d'âmes **÷2** pendant le blocage |
| **Avatar éteint** | Korrah tombe **ou** perd conscience (sommeil, étourdissement, paralysie) | 🟩 l'Avatar disparaît le temps qu'elle revienne |
| **Avatar fatigué** | Avatar brisé | 🟩 il agit **un tour sur deux**, tout ce qu'il fait ÷2 |

### 3.3 · Les états de Fusion — 🟩 trois, nommés

| État | Ce qu'elle fond | 🟩 Tire vers |
|---|---|---|
| **la Chair d'Âme** | l'Âme dans le Corps | la **Bête** & l'**Errant** |
| **le Fil du Rasoir** | le Corps dans l'Esprit | la **Bête** & le **Dément** |
| **le Songe Incarné** | l'Esprit dans l'Âme | le **Dément** & l'**Errant** |

🟩 **Loi de la Fusion :** rester fusionné, c'est courir vers **deux** gouffres à la fois — une
double chute est la plus rapide de toutes. 🟩 Trois échelles : la **Forme** (transformation, prix
qui grimpe à chaque instant tenu) · la **Technique** (un seul instant, prix d'un coup) · la
**Rune** (gravée, agit sans être récitée, **ne rate jamais**).

### 3.4 · Les contrecoups & états de prix

| État | Posé par |
|---|---|
| **Parole brisée** | 🟩 une Parole trop longue tenue sans la lucidité : **aucun effet + contrecoup** · 🟨 −6 % PV max, −1 lucidité |
| **Frappe d'âme ratée** | 🟩 le retour · 🟨 −10 % PV max, +2 Errance |
| **Trauma d'âme** | 🟩 écouter une âme : **les traumas des morts deviennent les tiens** |
| **Traumatisé** | 🟩 prix de la copie / de l'aspiration |
| **Surchauffe** | 🟩 trop d'énergie cinétique stockée (le Contre-Poids d'Iris) : vapeur, brûlures sur sa propre peau, risque de blessure interne |
| **un contrecoup par héros** | 🟨 4 états d'épuisement personnels |

### 3.5 · Les états du Dément — 🟩 **les plus spécifiques du jeu**

🟩 *La Bête se transforme, l'Errant disparaît — **le Dément, lui, ne part pas.*** Il reste à sa
place dans le groupe, et **il est le seul à ne pas savoir**.

| État | Effet mécanique |
|---|---|
| **Il frappe le vide** | 🟩 ses coups **ne touchent plus rien** : il vise des ennemis qui ne sont pas là. **Zéro dégât**, et une certitude tranquille d'avoir touché. |
| **On ne le voit plus** | 🟩 les PNJ **cessent de lui répondre, de le nommer, de le regarder** |
| **Puis il se retourne** | 🟩 au bout de quelques combats, **en pleine bataille, il frappe le groupe** |
| **Les seuils qui mentent** | 🟩 avant la chute : **des chiffres faux**, un son qui n'existe pas, un visage en trop, un choix de dialogue qui ne dit que « … », des **combats qui n'ont pas eu lieu** (ni butin, ni corps), un **faux écran de fin** qui se déchire |
| **l'Ancrage** *(la fenêtre de sauvetage)* | 🟩 tout au bord, **si les autres ont gardé l'esprit clair**, ils peuvent le rappeler — chacun d'une parole lucide. 🟩 **Une équipe qui a elle-même sombré ne peut rien dire.** |

### 3.6 · États de soutien attendus

🟩 *« Chaque état négatif introduit par le bestiaire a son contre. »* — il faut donc, en face :
purger · délier · rompre le silence · voir clair · relever · encourager · affûter · marquer la
cible · briser la garde · ralentir · faire douter · sceller la voix.

---

## 4 · LES JAUGES

### 4.1 · 🟣 Corruption — la Bête *(Corps)*

| | |
|---|---|
| **Plage** | 🟩 0 → max, **par héros** · 🟨 **0-100** |
| **Paliers** | 🟩 Calme → **Frémissement** → **Fièvre** → **la Mue** · 🟨 0 / 40 / 70 / 100 |
| **Monte** | 🟩 frapper avec le **mana négatif (4)** · 🟩 frapper avec le **mana sombre (5)**, davantage · 🟩 les **Maîtrises interdites** · 🟩 la **Voie du Sang** (drainer) · 🟩 **se nourrir mal, ou se nourrir trop** par rapport à ce dont la réserve a besoin · 🟨 +2 / +3 / +8 / +2 par drain · 🟨 Voie `vide` +2, Voie `domaine` +3 |
| **Descend** | 🟩 **marcher** (lentement) · 🟩 une **purge à un point d'étape** · 🟨 −1 tous les 60 pas · 🟨 purge 30 |
| **Divisée par 2** | 🟩 une relique anti-corruption · 🟩 les **Atones** (aucune affinité) |
| **La nuit** | 🟩 *« quand le mana sombre est roi, tout descend plus vite : la Fièvre attrapée au soir n'est pas celle du matin »* — ⬜ non chiffré |
| **Ce qu'on gagne / perd** | 🟩 une **puissance brute** / la **conscience** |

### 4.2 · 🔴 Errance — l'Errant *(Âme)*

| | |
|---|---|
| **Plage** | 🟩 0 → max, **par héros** · 🟨 **0-100** |
| **Paliers** | 🟩 Ancré → **Décharné** → **Gonflé d'âmes** → **l'Errant** · 🟨 0 / 40 / 70 / 100 |
| **Monte** | 🟩 tout art de l'**Âme** employé offensivement · 🟩 **achever** avec un art de l'Âme · 🟩 **chaque âme ajoutée au stock** · 🟩 la **Frappe d'âme** (et davantage si elle rate) · 🟩 **chaque usage d'un Trait** (il force la marque) · 🟩 une **Noyade** · 🟩 le **Pacte de la Reine** · 🟩 la **Voie de la Source** (réparer la chair puise dans l'être) · 🟩 le **Royaume Impérial** (faire revenir les âmes) · 🟨 +1 / +5 / +2 / +2 / +2 / +5 / +10 |
| **Descend** | 🟩 **marcher** (plus lentement que la Corruption) · 🟩 l'**Ancrage** : être nommé chaque jour, être attendu quelque part, devoir quelque chose à quelqu'un, nourrir ses morts · 🟨 −1 tous les 75 pas |
| **⚠️ Ne descend PAS** | 🟩 **dépenser des âmes ne réduit rien.** On monte en récoltant, on ne redescend pas en dépensant. |
| **Effets continus (sans état)** | 🟩 **pouvoir sans fin** : +ATK/+MAT qui montent avec la jauge · 🟩 **le corps se dissout** : dégâts subis qui montent avec la jauge · 🟨 jusqu'à +50 % / +40 % au max |
| **Ce qu'on gagne / perd** | 🟩 un **pouvoir sans fin** / le **corps** |

### 4.3 · 🔵 Lucidité — le Dément *(Esprit)*

⚠️ **Trois échelles concurrentes dans les sources** → [À TRANCHER §5](#5--la-lucidité--quelle-échelle-).

| Échelle | Source |
|---|---|
| **1 → 10**, une variable par héros, 5 phases | 🟨 `GUIDE_DEVELOPPEUR.md` A6 |
| **0 → 100** | 🟩 `codex v10`, « La lucidité — tenir & voir » |
| **5 seuils, 0 → 4** | 🟩 `codex v10` + `lore.md` |

| | |
|---|---|
| **Les 5 seuils du Lac** | 🟩 **0 · la Surface** (le monde ordinaire) → **1 · le Voile** (âmes errantes, sang sous la peau, marques : on voit qui manie le mana ; PNJ cachés) → **2 · la Trame** (le code sous les choses : nombres, secrets lisibles) → **3 · le Mur** (*ce qui regarde du dehors* : présences, vies reprises, oubliés — l'horreur méta) → **4 · le Fond** (tout d'un coup : **la folie**, game over « Dément ») |
| **Monte** *(= on remonte vers la surface)* | 🟩 le **repos**, les **bons choix**, une **zone sûre** où marcher restaure · 🟩 le **Feu d'Âme** |
| **Descend** *(= on plonge)* | 🟩 une **Parole brisée** · 🟩 le **Pacte de la Reine** · 🟩 **chaque âme absorbée** · 🟩 les mauvais choix · 🟩 un sort de **mana spirituel** (risque de trauma) |
| **Ce qu'elle sert** | 🟩 deux choses : **tenir les longues Paroles**, et **voir le caché** |
| **Le paradoxe** | 🟩 **trop basse → les grands sorts ratent ; trop haute → on touche le Mur et on glisse vers le Dément** |
| **Effet sur le mana positif** | 🟩 *un esprit brisé soigne mal* : la puissance du Positif **décroît** avec la lucidité · 🟨 ×0,85 / ×0,70 / ×0,55 |
| **Loi de la Noyade** | 🟩 passé une certaine profondeur, **la descente devient irréversible** — on paie en raison, puis **en âme** · 🟨 chaque passage au plancher : **plafond mental −1 pour toujours** (plancher 4) + **+5 Errance** |
| **Ce qu'on gagne / perd** | 🟩 **voir toute vérité** / la **raison** |

### 4.4 · 🍖 La Faim — *l'Empire du Corps*

🟩 Décrite en détail dans `EMPIRE_DU_CORPS.md`, ⬜ **jamais chiffrée**, ⬜ **jamais implémentée**.
C'est la jauge que réserve la plage **variables 50-69**.

| | |
|---|---|
| **Origine** | 🟩 boire **une gorgée d'un litre** du sang de l'Arbre active **tous les canaux de mana** (corps, esprit, âme) et libère le potentiel. Pas de rituel, pas de marque. Juste boire. |
| **Le contrecoup** | 🟩 **permanent**. Une faim de mana constante, **qui ne peut pas être comblée**. |
| **Elle revient toujours** | 🟩 *« même si tu ne la sens pas, elle reviendra toujours avec force un jour »* |
| **Elle grandit** | 🟩 *« elle grandit de plus en plus si tu te nourris mal pour la combler »* |
| **Ce qui la comble** | 🟩 la **chair de monstre** (le civil) · 🟩 les **puits**, les **bouteilles de sang des racines**, les **gaz de sang** (le chasseur) · 🟩 le **verre de sang** (distribué par les Libéralistes) · 🟩 **boire à la branche** (les Libéralistes, qui s'en enivrent) |
| **Durée** | 🟩 le **sang des racines** est **moins pur** que celui du tronc et des branches : il comble la faim **quelques heures** |
| **Le boost** | 🟩 **certains monstres**, grâce à leur sang, **nourrissent la faim ET boostent** l'utilisateur — ils portent une grosse quantité de mana |
| **Lien avec la Corruption** | 🟩 **succomber arrive quand on se nourrit mal, ou qu'on se nourrit trop** par rapport à ce dont la réserve de mana sombre a besoin → **c'est la faim qui pilote les quatre stades** |
| **L'exception** | 🟩 **manger le fruit — le cœur — de l'Arbre** : la faim **disparaît**, tout est comblé, on est **toujours satisfait**. Prix : **tout perd goût et valeur** — *il a comblé sa faim au prix de toute sensation*. |
| **Le couvre-feu** | 🟩 **20 h**, pour les chasses et pour éviter un risque de trop de monstres |

### 4.5 · Les jauges de Don

| Jauge | Porteur | Plage | Monte | Se vide | Pleine / à zéro |
|---|---|---|---|---|---|
| **Endurance** | 🟩 **les trois formes** | 🟨 `40 + niv × 2 + (palier−1) × 20` | — | 🟩 s'use à **chaque action offensive** · 🟩 l'Avatar la brûle **deux fois plus vite** · 🟩 **+ à chaque interception** | 🟩 **à zéro → casse**, tout ÷2, **reste utilisable** |
| **Sang** | 🟩 Vesper *(Objet)* | 🟨 0-100 | 🟩 chaque technique de sang · 🟨 +10 | 🟩 repos | 🟩 **pleine → le Masque se fend d'un coup** |
| **Ombre** | 🟩 ludwing *(Objet)* | 🟨 0-100 | 🟩 chaque technique d'ombre · 🟨 +12 | 🟩 repos | 🟩 **pleine → elle explose** (ombre bloquée, absorption ÷2) |
| **Maîtrise (par Voie)** | 🟩 tout manieur du Corps | 🟨 0-40 | 🟩 **par le combat** — *« un duel est une leçon volée »* · 🟨 +1 par usage | — | 🟩 **elle amplifie les bonus ET les malus du même facteur** : *plus tu es puissant, plus tu paies* |
| **Alerte avant la casse** | 🟩 les deux jauges | 🟨 seuils 70 % / 25 % | — | — | 🟩 **une seule alerte par seuil**, et il reste des tours pour changer d'avis |

---

## 5 · LES RESSOURCES CONSOMMABLES

### 5.1 · Ressources de combat

| Ressource | 🟩 Ce qui la dépense | 🟩 Ce qui la rend |
|---|---|---|
| **PM** | les Paroles (coût croissant avec la longueur) · **chaque usage d'un Trait** prend sur le mana réservé aux sorts | repos, objets |
| **PV** | 🟩 **le recul du Corps** : le mana négatif et sombre ne coûtent pas (ou peu) de PM — **ils coûtent des PV**. *« La force se paie avec sa propre chair. »* · la Voie de la Forge, la Voie de l'Éclair, le Flash · le Masque fendu | soins, la Voie de la Source, la Voie du Sang (drain), le repos |
| **TP** | 🟨 le prix du Trait | le combat |

### 5.2 · Le stock d'âmes — 🟩 **ressource centrale**

| | |
|---|---|
| **Porté par** | 🟩 **ludwing** (partagé pour le groupe) |
| **Gagné en** | 🟩 **absorbant** une âme · 🟩 **moissonnant** les âmes croisées |
| **Coût caché** | 🟩 **chaque âme ajoutée fait monter l'Errance** · 🟩 **chaque âme absorbée fait descendre la lucidité** |
| **Dépensé en** | 🟩 **invocations** · 🟩 **forger / renforcer** un équipement · 🟩 **apprendre** des compétences à un sanctuaire |
| **À la mort** | 🟩 on **perd ses âmes là où on est tombé** (le **Feu d'Âme**), et on peut aller les **récupérer sur place** — tant qu'on n'y retombe pas · 🟨 50 % |
| **⚠️** | 🟩 **les dépenser ne réduit pas l'Errance.** |

### 5.3 · Les consommables de la faim — *l'Empire du Corps*

| Objet | 🟩 Pour qui | 🟩 Effet |
|---|---|---|
| **chair de monstre** | les civils | comble la faim ; certaines chairs **boostent** (grosse quantité de mana) |
| **bouteille de sang des racines** | chasseurs, chasseurs d'insectes | comble la faim **quelques heures** — moins pur que le tronc |
| **gaz de sang** | chasseurs, chasseurs d'insectes | ⬜ non détaillé |
| **verre de sang** | tout citoyen, via la distribution des Libéralistes | ⬜ non détaillé |
| **sang de branche** | les Libéralistes (accès privilégié) | 🟩 **s'enivrer de puissance** — et vivre dans la **terreur de la Mue** |
| **le fruit / le cœur de l'Arbre** | 🟩 **une seule personne l'a mangé** | supprime la faim **et toute sensation** — objet de scénario, pas de boutique |

> 🟩 **La tragédie mécanique à ne pas oublier :** *la chair de monstre, ce sont des chasseurs, des
> humains ou d'autres personnes transformés en Bête qui ont fui. C'est assez rarement des animaux.*
> La ressource qui nourrit le joueur **est** l'ennemi qu'il chasse.

### 5.4 · Matériaux & objets nommés

| Objet | 🟩 Rôle |
|---|---|
| **Éclat d'Âme** | *fragment d'une âme retournée au code* — matériau de forge |
| **Fil de Crépuscule** | *ni jour ni nuit* — **la matière dont Miracle fait ses flèches** |
| **Larme d'Âme** | *rend une âme à elle-même* : **ranime un allié tombé** |
| **Poudre Spectrale** | onde spirituelle sur tous les ennemis |
| **matériaux de famille** | 🟨 un par famille d'ennemis, lâché avec une probabilité qui monte avec le rang |

---

## 6 · LES SYSTÈMES À CODER

> Ordre de lecture = **ordre de chargement**. Un système ne peut pas dépendre d'un système placé
> plus bas dans la liste. `ETT_<Systeme>.js`, espace de noms `window.ETT` (voir
> [`CONVENTIONS.md`](CONVENTIONS.md) §5).

### 6.1 · Socle — aucun prérequis

| # | Système | Ce qu'il produit | Dépend de |
|---|---|---|---|
| **S1** | **`ETT_Marque`** | la **marque** : le noyau coloré par la source dominante, qui **s'étend avec la puissance et se rétracte quand l'âme se brise**. État purement **descriptif** (Pleine / Fêlée / Affamée / Gonflée / **Creuse**). 🟩 **Creuse → le Trait s'éteint.** | — |
| **S2** | **`ETT_Affinite`** | l'affinité d'un être aux trois sources : 🟩 **elle n'est pas figée, elle évolue avec les décisions**. 🟩 Les **Atones** (sans affinité) : aucun bonus, mais **malus réduits** et **corruption ÷2**. | — |
| **S3** | **`ETT_Elements`** | la table des codes, **la somme qui forge les dérivés**, Lumière ⇄ Ombre, le perce-résistance du Mana Pur | — |

### 6.2 · Les trois jauges de Chute — **le moteur du jeu**

| # | Système | Ce qu'il produit | Dépend de |
|---|---|---|---|
| **S4** | **`ETT_Corruption`** | la jauge 🟣, ses paliers, ses états, la descente à la marche, la purge | S1 · S2 · S3 |
| **S5** | **`ETT_Errance`** | la jauge 🔴, ses paliers, ses **effets continus sans état**, l'Ancrage | S1 · S2 · S3 |
| **S6** | **`ETT_Lucidite`** | la jauge 🔵, les **5 seuils du Lac**, la **Loi de la Noyade**, l'affaiblissement du mana positif | S1 · S2 · S3 |
| **S7** | **`ETT_Equilibre`** | l'état **Surpassé** — le Mana Semi-Parfait : *ni Bête, ni Errant, ni Dément* | **S4 + S5 + S6** |

### 6.3 · La faim — *le système propre à l'Empire du Corps*

| # | Système | Ce qu'il produit | Dépend de |
|---|---|---|---|
| **S8** | **`ETT_Faim`** | la jauge 🍖, sa **montée permanente**, le fait qu'elle **grandit si on se nourrit mal**, les consommables qui la comblent et pour combien de temps | S4 *(🟩 se nourrir mal fait succomber → la faim pilote la Corruption)* |
| **S9** | **`ETT_Chasse`** | le **cycle de la chasse** : contrats, familles de monstres, primes, **le couvre-feu de 20 h**, l'exécution des porteurs en Fièvre | S8 · S4 |

### 6.4 · Les trois arts

| # | Système | Ce qu'il produit | Dépend de |
|---|---|---|---|
| **S10** | **`ETT_Parole`** *(Esprit)* | 🟩 la Parole = **mot de passe (mana) + élément + n° de sort**, additionnés. 🟩 Longueur 1→5 mots : **puissance qui monte, fiabilité qui descend**. 🟩 La **lucidité requise** pour tenir. 🟩 La **Parole brisée** (aucun effet + contrecoup). 🟩 Les **runes** : Paroles gravées en chiffres, qui **agissent sans être récitées** et **ne ratent jamais**. | S6 · S3 |
| **S11** | **`ETT_Maitrise`** *(Corps)* | 🟩 **instantané, pas d'incantation.** 🟩 **Renforcer** (mana négatif dans les membres) et **Projeter** (ondes, lames sombres). 🟩 Les **cinq Voies** : Forge · Onde · Source · Miroir · **Vide** *(l'aura disparaît — le plus mauvais signe)*. 🟩 **Progresse par le combat.** 🟩 **La Loi du Prix : la maîtrise amplifie les bonus ET les malus.** | S4 · S3 |
| **S12** | **`ETT_Symbole`** *(Âme)* | 🟩 les **4 opérations** : **Matérialisation** (sentiment + désir + croyance) · **Résonance** (accorder deux âmes) · **Lecture** (le Regard) · **Frappe d'âme** (*traverse chair, armure et mana sombre* ; sonne, paralyse ou brise). 🟩 **✕ la Consommation** — interdite, **et elle fonctionne**. | S5 · S3 |

### 6.5 · Le Don & le Trait

| # | Système | Ce qu'il produit | Dépend de |
|---|---|---|---|
| **S13** | **`ETT_Don`** | le **registre** (un héros = **une** entrée, **un** type, **un** slot : il n'y a nulle part où mettre un second Don) · l'**Endurance** · la **casse ÷2** · le **verrou** (ni retrait, ni prêt, invisible chez les autres) · l'**alerte avant la casse** | S1 |
| **S14** | **`ETT_DonPaliers`** | l'**évolution en 4 paliers** : la pièce est donnée et équipée, les versions inférieures purgées ; l'évolution **passe le verrou** | **S13** |
| **S15** | **`ETT_Trait`** | les Traits, leur **prix commun** (mana + vitalité + marque → Errance), le **gating par l'Avatar**, et 🟩 **l'extinction sur marque creuse** | S13 · S5 · S1 |
| **S16** | **`ETT_Avatar`** | la créature qui **joue son propre tour** : ciblage, **interception**, **3 postures** en combat, **3 niveaux** de contrôle croissant, **inséparabilité**. ⚠️ 🟩 **doit boucler `numRepeats()` lui-même** — MV ne l'applique pas à une action jouée à la main. | **S13** · S15 |
| **S17** | **`ETT_JaugesDon`** | les **secondes jauges** des Objets (Sang, Ombre) et leurs punitions | **S13** |

### 6.6 · Systèmes de monde

| # | Système | Ce qu'il produit | Dépend de |
|---|---|---|---|
| **S18** | **`ETT_Ames`** | le **stock d'âmes**, l'absorption, le **Feu d'Âme** (on perd ses âmes là où on tombe, on va les rechercher), la forge, le sanctuaire, les invocations | S5 · S6 |
| **S19** | **`ETT_Rangs`** | l'échelle **D → S**, hors échelle **l'Astre**. 🟨 `score = réserves + maîtrise + aura` | S11 |
| **S20** | **`ETT_Aura`** | 🟩 l'aura visible **par paliers**, couleur de l'affinité — *voir une aura, c'est jauger un adversaire* | S2 · S19 |
| **S21** | **`ETT_Fusion`** | les **3 Fusions** et leurs **3 échelles** (Forme · Technique · Rune) ; 🟩 chacune **tire vers deux Chutes** | S4 · S5 · S6 |
| **S22** | **`ETT_Portes`** | l'entraînement des trois arts et les **portes de progression** : 🟩 *le secret n'est pas de maxer une voie, mais d'entraîner les trois* | S10 · S11 · S12 |
| **S23** | **`ETT_Reine`** | les **murmures d'Aldébaran** à haute Errance · le **Pacte** : 🟩 puissance démesurée, **jamais sans consentement**, **toujours un prix** — souvent une vérité. 🟩 **Elle ne ment jamais.** | S5 · S6 |
| **S24** | **`ETT_Destins`** | 🟩 les marqués qu'on ne suit pas **vivent, luttent et dérivent** chacun vers sa Chute · rumeurs aux paliers franchis · **à la rencontre : recruter (il garde ses jauges) ou affronter ce qu'il est devenu** | S4 · S5 · S6 |
| **S25** | **`ETT_Culte`** | ⬜ **rien d'écrit.** Les cultes existent dans le lore (du Premier, du trône vide, d'une Bête, d'une vérité du Lac) mais **aucune mécanique n'est écrite**. La plage variables 90-99 leur est réservée. → [À TRANCHER §8](#8--le-culte-les-cristaux--aucune-mécanique-écrite) | — |
| **S26** | **`ETT_Cristaux`** | ⬜ **rien d'écrit.** Le mot n'apparaît dans aucun fichier de lore. Plage 70-89 partagée avec la Parole. → [À TRANCHER §8](#8--le-culte-les-cristaux--aucune-mécanique-écrite) | — |

### 6.7 · Graphe de dépendances — les chemins critiques

```
S1 Marque ─┬─► S4 Corruption ─┬─► S7 Équilibre ◄─┬─ S5 Errance ─┬─► S18 Âmes
S2 Affinité┤   │               │                  │   ▲          └─► S23 Reine
S3 Éléments┘   │               └── S6 Lucidité ────┘   │
               │                        │              │
               ├─► S8 Faim ─► S9 Chasse │              │
               │                        │              │
               └─► S11 Maîtrise ─► S19 Rangs ─► S20 Aura│
                                        │              │
           S10 Parole ◄─────────────────┘              │
           S12 Symbole ────────────────────────────────┘
                   └──► S22 Portes ◄── S10 · S11

S13 Don ─┬─► S14 Paliers
         ├─► S15 Trait ──► (S5 Errance, S1 Marque)
         ├─► S16 Avatar ──► S15
         └─► S17 Jauges d'Objet

S4 + S5 + S6 ──► S21 Fusion · S24 Destins parallèles
```

**Les trois points durs, dans l'ordre :**

1. **S4 · S5 · S6 avant tout le reste.** Les trois jauges sont lues par presque tout. Tant
   qu'elles ne sont pas stables, rien d'autre n'est testable.
2. **S13 avant S14/S15/S16/S17.** Le registre du Don est la **seule source de vérité** sur qui a
   quoi ; les quatre autres le lisent.
3. **S8 (la Faim) touche S4 (la Corruption).** 🟩 Le lore dit que **c'est la mauvaise
   alimentation qui fait succomber**. Coder la Faim après la Corruption, c'est refaire la
   Corruption.

---

## À TRANCHER

> Neuf points. Aucun n'est décidé ici. Tant qu'une question reste ouverte, **rien ne s'écrit
> dans `data/` ni dans un plugin** sur ce point.

### 1 · Quelle attribution Don + Trait fait foi ?

Les deux sources sont **entièrement incompatibles**, et ce n'est pas un détail : elles changent
les quatre personnages, leurs slots d'équipement, leurs types de compétence et leurs jauges.

| | `DONS_SPIRITUELS.md` v3.0 | `codex-trois-sources-v10.html` |
|---|---|---|
| **Vesper** | le **Masque** *(Objet, accessoire)* · Trait **sang** | le **Premier Mot** · Trait **le Verbe Vrai** |
| **Korrah** | l'**Armure Volante** *(Avatar, âme)* · Traits **change** + **hiver** | le **Sablier de Givre** · Trait **l'Instant Gelé** |
| **ludwing** | l'**Amulette** *(Objet, accessoire)* · Trait **ames** | ses **familiers** · Trait **la Porte d'Ombre** |
| **Aël** | l'**Arc** *(Arme, slot arme)* · Trait **miracle** | sa **lame** · Trait **le Point de Rupture** |

**Trois lectures possibles :** le codex v10 est plus récent et remplace le dossier ; le dossier
v3.0 est plus récent et remplace le codex ; ou bien ce sont **deux couches** (le Don *visible* et
le Trait *profond*) qui coexistent — ce que la phrase du codex *« deux dons, une seule âme »*
pourrait autoriser. **Je n'ai pas tranché.**

### 2 · Quel codex est le canon ?

`lore.md` dit en tête : *« Canon unique : `docs/codex-trois-sources.html` (v5) »*. Mais un
**v10** existe dans le même dossier, nettement plus complet (72 → 100+ sections, il ajoute les
Traits, les Fusions, les quatre marqués, le Bréviaire). Lequel fait foi ? Et le v5
doit-il être marqué obsolète, comme l'a été `_archive/` ?

### 3 · Qui est acteur 1 — et qui porte quel art ?

Trois versions dans les sources :

| Source | Acteur 1 | Acteur 4 | Qui est « l'Équilibre » |
|---|---|---|---|
| ancienne `Actors.json` + `INDEX.md` + `DONS_SPIRITUELS.md` | **Vesper**, classe *l'Équilibre* | **Aël**, classe *la Parole* | **Vesper** |
| `GUIDE_DEVELOPPEUR.md` A1 | **Aël**, l'Équilibre (var 11) | **Vesper**, la Parole (var 14) | **Aël** |
| `personnages.md` + `codex v10` | **Aël** le protagoniste, l'Équilibre | **Vesper**, Mage des Étoiles / la Parole | **Aël** |

Et par-dessus : `EMPIRE_DU_CORPS.md` fait de **Vesper la chasseuse de monstres**, **jumelle de
Ludwig**, tous deux de l'Empire du Corps — ce qui sort Vesper de l'Esprit **et** ludwing de
l'Âme. JOKO avait déjà posé la question lui-même dans ce fichier (*« Dis-moi si les classes du
jeu doivent suivre »*) ; elle est restée sans réponse.

### 4 · Le cycle des branches et la roue des éléments : retirés ou pas ?

| Source | Ce qu'elle dit |
|---|---|
| `SYSTEME_DE_MANA.md` §3 | **cycle pierre-feuille-ciseaux** entre les trois branches : avantagé **×1,5**, désavantagé **×0,5** |
| `SYSTEME_DE_MANA.md` §4 | **roue élémentaire** : Feu→Eau→Foudre→Terre→Vent→Glace→Feu |
| `lore.md` | *« **Pas de cycle** entre branches ni roue élémentaire (…) Seuls Lumière ⇄ Ombre s'opposent »* |
| `codex v10`, note de version | *« Deux mécaniques de l'ancien modèle ont été **retirées** (…) : le cycle pierre-feuille-ciseaux des branches et la roue d'avantages des éléments. »* |

C'est **la contradiction la plus lourde du lot** : elle décide de tout le combat. Deux des
quatre sources disent explicitement que ces règles sont mortes, une les décrit encore en détail.

### 5 · La lucidité : quelle échelle ?

**1→10** *(une variable par héros, 5 phases)*, **0→100** *(codex v10, avec des seuils requis à
40 / 60 / 80 pour tenir une Parole de 3 / 4 / 5 mots)*, ou **5 seuils 0→4** *(la Surface, le
Voile, la Trame, le Mur, le Fond)* ?

Les trois se retrouvent dans les sources, et elles ne se convertissent pas entre elles sans
perte : la table « lucidité requise » du codex v10 est écrite en 0-100 et n'a pas d'équivalent
en 1-10. **Et une question de sens la double :** la jauge monte-t-elle quand on *va bien*
(santé mentale) ou quand on *voit loin* (profondeur dans le Lac) ? Les deux lectures existent
dans les textes, et elles sont **inverses l'une de l'autre**.

### 6 · Le code 7 : « AME » ou « Mana Parfait » ?

`SYSTEME_DE_MANA.md` §11 l'appelle **Mana Parfait**, l'ancienne `System.json` l'appelle
**AME**, `GUIDE_DEVELOPPEUR.md` écrit **AME / Parfait**. Comme la nouvelle base est vide, c'est
le moment de fixer le nom — et de dire si le code **7** et le code **16** sont bien deux choses
(le Pur et le Semi-Parfait) ou une seule.

### 7 · La Voie du Sang, et combien de Voies ?

Question que **JOKO a lui-même laissée ouverte** dans `EMPIRE_DU_CORPS.md` : le texte annonce
**« les cinq Voies »**, puis nomme le Sang comme **la plus utilisée** — ce qui en ferait une
sixième. `lore.md` parle de cinq Voies **+ des Maîtrises interdites**. Le Sang est-il une
**sixième Voie ouverte**, ou **la Maîtrise interdite que tout le monde pratique quand même** ?

Et par-dessus : l'ancienne implémentation en comptait **neuf** (Forge, Onde, Source, Miroir,
Vide, **Éclair**, **Domaine**, **Flash**, **Sang**). Quatre Voies qui n'existent dans **aucun**
fichier de lore. On repart à cinq, à six, ou à neuf ?

### 8 · Le Culte, les cristaux : aucune mécanique écrite

Deux plages de variables sont réservées à des systèmes que **le lore ne décrit pas** :

- **« Culte » (variables 90-99)** — les cultes existent bien dans le monde (du Premier, du trône
  vide, d'une Bête, d'une vérité du Lac), mais **aucun fichier ne leur donne de mécanique** :
  ni jauge, ni réputation, ni rite, ni effet.
- **« cristaux » (variables 70-89, partagées avec la Parole)** — **le mot n'apparaît dans aucun
  fichier de lore.** Le seul « cristal » trouvé dans tout le projet est un nom d'animation.

Que font-ils ? Sans une phrase de ta part, je ne peux ni les concevoir ni les coder.

**Même question pour « manifestations » (variables 20-49).** Le mot n'a pas de mécanique écrite,
et `CLAUDE.md` signale que *« la Manifestation »* a déjà été **une invention de ma part, retirée
depuis** parce qu'elle donnait deux Dons à trois héros sur quatre. Je n'y touche pas avant que tu
me dises ce que ce mot désigne ici : l'**apparition** du Don (le moment où il sort), autre chose
— ou le retour du concept retiré.

### 9 · Combien de héros joue-t-on à la fois ?

| Source | Ce qu'elle dit |
|---|---|
| `DONS_SPIRITUELS.md` §4.1 | un **équipement de départ pour les quatre** — c'est une équipe |
| `codex v10`, « La règle du voyage » | *« **Tu n'en accompagnes qu'un.** Les trois autres ne t'attendent pas »* — puis on les retrouve, à recruter **ou à affronter** |
| `personnages.md` | *« Il n'y a pas de protagoniste unique — ils sont tous des protagonistes »* (JOKO) |

Équipe de quatre dès le départ, ou **un** marqué choisi et trois **Destins parallèles** qui
dérivent ? La réponse change l'écran-titre, la création de partie, `Actors.json`, et si le
système S24 est central ou secondaire.

---

### Deux points mineurs, pour mémoire

- **Le titre.** L'ancienne base et l'ancien `package.json` portent *« Le Codex des Trois
  Sources »*. Le nouveau projet s'appelle **L'Empire aux Trois Têtes**. Le `package.json`,
  l'`index.html` et `System.json` sont à remettre à jour — je ne l'ai pas fait, ce sont des
  noms qui apparaissent à l'écran.
- **Le nom de l'empire.** `EMPIRE_DU_CORPS.md` dit *« l'Empire du Corps · l'Empire aux trois
  têtes »* ; `lore.md` dit *« l'**Empire Vultric** »* (capitale Kragenvar) ; et **Vultric** est
  aussi un nom de famille (Kevératus Vultric, Kaelen Vultric). Dynastie qui a donné son nom à
  l'empire, ou deux noms pour la même chose ? La question est **déjà posée** par JOKO dans
  `EMPIRE_DU_CORPS.md` et reste ouverte. *(Le titre du jeu tranche peut-être la question de
  lui-même — mais je ne le suppose pas.)*
