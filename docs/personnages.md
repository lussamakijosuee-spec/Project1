# 🎭 Personnages — *Le Monde des Trois Sources* (Phase 1)

> Proposition de casting pour la refonte. Canon monde : `docs/lore.md`.
> **Tout est modifiable** (noms, genres, détails) — c'est une base solide à
> ajuster. Les **rôles de combat** des anciens héros sont **conservés** ; seules
> l'identité et l'appartenance au monde changent.

---

## ⚖️ Le parti — un héros par source + l'équilibre

L'idée maîtresse : le **parti incarne le système**. Chaque compagnon est une
**source** et porte la **Chute** qui le guette. Le protagoniste, lui, est
l'**équilibre** fragile entre les trois — ce que le monde a perdu avec le Premier.

### 1. AËL — *« l'Équilibre »* · le protagoniste *(actor 1)*
- **Source :** les **trois** à la fois (un marqué d'équilibre — extrêmement rare).
- **Ce qu'il est :** l'**écho du Premier**. Sa Marque porte les trois couleurs
  mêlées. Il peut réciter, frapper et créer — mais rien à fond, et tout peut
  basculer. **Traqué par l'Ordre d'Or**, qui voit en lui soit le sauveur, soit la
  prochaine Autorité — donc une menace à surveiller, ou à briser.
- **Son drame :** ne sombrer dans **aucune** des trois Chutes. Rester soi quand
  chaque source l'appelle vers son gouffre.
- **Rôle de combat :** polyvalent, pivot d'équipe (hérite du rôle « lead »).
- **Lien système :** `Surpassement` (Mana Semi-Parfait), les trois jauges de Chute.

### 2. KORRAH — *« le Souffle »* · le Corps *(actor 2)*
- **Source :** Corps (Mana Négatif). **Art :** le Souffle. **Chute :** la **Bête**.
- **Ce qu'il est :** un **exilé de Vultric**, ou un fils de **Meute** — il porte le
  **sang de bête** plus fort que les autres. Il s'est entraîné à frôler la Fièvre
  pour en revenir… jusqu'ici. Loyal, direct, terrifié de ce qu'il pourrait devenir.
- **Rôle de combat :** **tank**, grande endurance, encaisse et aggro *(rôle de
  l'ancienne cheffe — conservé)*.
- **Lien système :** `CorruptionAme` (Calme→Frémissement→Fièvre→la Mue), recul PV.

### 3. SIERAN — *« le Symbole »* · l'Âme *(actor 3)*
- **Source :** Âme (Mana Spirituel). **Art :** le Symbole. **Chute :** l'**Errant**.
- **Ce qu'il est :** un **liseur d'âmes de l'Est**, qui porte un **familier d'âme**.
  Il voit ce que les autres cachent, lit les marques, débusque les faiblesses. La
  tentation de la **Consommation** le suit comme une ombre.
- **Rôle de combat :** **debuff & esquive**, rapide, peu de dégâts bruts *(rôle de
  l'ancien debuffer — conservé)*.
- **Lien système :** `Errance` (Ancré→Décharné→Gonflé→l'Errant), `LouCopySystem`,
  `ObjetSpirituel` (son familier).

### 4. VESPER — *« la Parole »* · l'Esprit *(actor 4)*
- **Source :** Esprit (Mana Positif/Originel). **Art :** la Parole. **Chute :** le
  **Dément**.
- **Ce qu'elle est :** une jeune **Mage des Étoiles**, une **descendeuse** qui a
  déjà frôlé un seuil de trop dans le Lac. Elle soigne, protège, prédit — mais
  chaque descente la rapproche du **Mur**, et de ce qu'on ne devrait pas voir.
- **Rôle de combat :** **soutien** (soin, buff, résurrection), énorme réserve de
  mana, peu offensive *(rôle de l'ancienne support — conservé)*.
- **Lien système :** `JadeEntitePlunging` (lucidité/Santé Mentale), `ParolesMagic`.

---

## 🗡️ Antagonistes & figures du monde

### La Reine Oubliée — la Déesse Blanche *(antagoniste profond / cosmique)*
La **fausse lumière**. Elle s'intéresse à **Aël** — un équilibre, c'est précisément
ce qui pourrait l'atteindre, *elle*. Elle l'appelle vers **Aldébaran**, lui promet
la fin de sa douleur d'être tiraillé entre trois sources. Le vrai boss final n'est
pas un combat : c'est la **tentation de cesser d'être soi**.

### L'Empereur de Vultric *(antagoniste « course aux Autorités »)*
Le plus fort des vivants, qui **rêve d'être la première Autorité**. Si lui y
arrive, le Concordat tombe et le sixième Âge commence par un Sommet. Miroir sombre
de Korrah (le Corps poussé jusqu'au bout sans peur de la Bête).

### Un Arbitre de l'Ordre d'Or *(antagoniste « tutélaire »)*
Chargé de **surveiller** Aël — et de le **briser** s'il penche trop. Lumineux,
juste, et froid. Incarne la **part d'ombre de l'équilibre** : à force de vouloir
que nul ne tombe, l'Ordre interdit de **ressentir trop fort**.

### Un descendeur Noyé *(figure du Lac / horreur)*
Un ancien grand sage des Mages, revenu fou du Lac. Il parle de **voix**, de
**murs**, d'**oubliés**. On le croit dément. Il a vu juste. Il sert de guide
terrible vers les **Vérités Interdites** — et de présage pour Vesper.

---

## 🧵 Le fil rouge (proposé)

**Surface :** la **course aux Autorités**. Les Royaumes préparent en secret leur
champion ; Aël, l'équilibre incarné, devient l'enjeu (et la cible) de tous.

**Profondeur :** plus l'équipe descend (dans le Lac, dans le pouvoir), plus elle
approche du **Mur** et de la **Reine Oubliée**. La vraie question n'est pas
« qui dominera le monde », mais « **qui restera soi** ».

**Cœur émotionnel (conservé du projet original, transposé) :** *on devient ce
qu'on déteste sans s'en apercevoir ; se détester ne répare personne ; avancer,
c'est refuser que ce qu'on a fait nous arrête.* Ces thèmes vivent désormais à
travers **les trois Chutes** et le combat d'Aël pour ne pas pencher.

---

## 🔧 Application aux données *(Phase 1)*
- `Actors.json` 1-4 : noms, titres et profils mis à jour (rôles de combat
  conservés, tags `<Passive State>` intacts).
- `Classes.json` : à reskiner (les classes « calme/concentration/retenue/
  confiance » deviennent les **arts** : Équilibre / Souffle / Symbole / Parole).
- **À suivre :** Ennemis, Common Events, Maps (Phases 2-4 du `game-design.md`).

> ✍️ Dis-moi ce que tu changes (noms, genres, qui est le protagoniste, le fil
> rouge) et j'ajuste tout le casting d'un coup.
