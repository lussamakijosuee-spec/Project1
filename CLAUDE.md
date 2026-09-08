# Règles de travail sur ce projet

Projet RPG Maker MV, en français. L'univers, les personnages, les compétences et l'équilibrage
appartiennent à **JOKO**. Claude est là pour exécuter et vérifier, pas pour concevoir.

---

## 1. Le lore ne s'interprète pas. Il se cite.

Deux fois dans ce projet, j'ai inventé du lore en croyant le compléter :

- la « **Manifestation** » — une arme spirituelle donnée en plus de leur Objet ou de leur Avatar à
  trois héros sur quatre. La règle est : **un seul Don par personne**. Je l'avais lue, et j'ai
  quand même construit le contraire ;
- « **famille / familier** » compris comme une créature de compagnie, alors que le texte disait
  explicitement *« système de stand dans JoJo ou Rika dans JJK »*. C'est un **Avatar Spirituel**.

**La règle qui en découle :**

> Si une mécanique n'est **pas écrite noir sur blanc** par JOKO, elle ne s'implémente pas sans
> demander. Une lacune dans le lore n'est pas une invitation à la combler.

Avant d'écrire une ligne qui touche à l'univers, je dois pouvoir **citer la phrase de JOKO** qui la
justifie. Si je ne peux pas la citer, je pose la question — même si ça coupe l'élan, même si la
réponse me paraît évidente.

Et quand une phrase est ambiguë (« il a 3 niveaux » : trois paliers ou trois états ?), **je ne
tranche pas tout seul**. Je demande, ou j'expose les deux lectures.

---

## 2. On ne touche que ce qui est demandé

Un mot bref (« corrige », « ajoute ») **ne donne pas mandat pour un chantier**. Sur un simple
« corrige », j'ai un jour injecté **244 compétences** dans les quatre classes montées à la main par
JOKO, déplacé des niveaux d'apprentissage et réécrit des coûts en mana. Il a fallu tout annuler.

**Avant toute modification en masse, je propose et j'attends.** Est une modification en masse :

- toucher à **plus de 10 entrées** de `data/*.json` en une fois ;
- modifier les **apprentissages**, les **niveaux**, les **coûts** ou les **formules** de compétences
  que JOKO a réglés lui-même ;
- ouvrir, fermer ou réattribuer un **type de compétence**, une **classe**, un **trait de classe** ;
- renommer quoi que ce soit qui apparaît **à l'écran**.

Le fait qu'un défaut soit réel et mesuré ne suffit pas : **je le signale, JOKO décide.**

---

## 3. On ne supprime rien

Consigne permanente de JOKO : *« corriger de tout, juste sup rien mais rajoute améliore »*.

Rien ne se supprime — ni une compétence, ni un équipement, ni un ennemi, ni une entrée
d'apprentissage, **même en double, même sans effet**. Ce qui est mauvais se **corrige** ou se
**contourne** ; ce qui est en trop se **laisse**.

Une pièce qui n'a plus sa place dans un système est **renommée et redécrite**, jamais retirée.

---

## 4. Ce qu'on ne touche jamais sans instruction explicite

| | |
|---|---|
| **Classe 5 « familié »** | le personnage-Stand de JOKO. Interdit d'y toucher. |
| **Les ennemis** | JOKO a dit de les laisser hors des passes d'équilibrage joueur. |
| **Les sprites et les images** | jamais d'asset externe : licence invérifiable. On remappe sur les 2 555 sprites du projet. |
| **Les formules « à caractère »** | pourcentage de PV max, aléatoire, dépendant d'une variable : c'est l'identité d'une compétence, pas son équilibre. |
| **Les cartes et les événements** | on n'y pose rien. Le level design appartient à JOKO. |

---

## 5. Le jeu d'abord, les rapports ensuite

Ce projet a plus de documentation que nécessaire. Un rapport ne remplace pas une correction, et
**personne ne joue à un fichier Markdown**.

- Un rapport se justifie quand il **restitue une mesure** que JOKO ne peut pas faire à la main.
- Sinon, la réponse tient dans le message de chat.
- Le message de commit dit ce qui change ; il n'a pas besoin d'un document jumeau.

---

## 6. Vérifier pour de vrai

Les bancs d'essai sont dans **`bancs/`** (voir `bancs/LISEZ-MOI.md`). Ils se lancent avec Node
depuis la racine : `node bancs/4_un_seul_don.js`.

Trois bugs sont passés à travers des tests écrits trop vite :

1. une passe de rééquilibrage **écrite en Python** ignorait en silence toute formule contenant
   `b.def` — `def` est un mot-clé Python. **Toutes** les compétences physiques avaient été sautées.
   → Les bancs sont en **JavaScript**, comme le moteur ;
2. `ChasseAuxPrimes` plantait à l'ouverture parce que le test tournait contre un
   `Window_Selectable` nu, sans les surcharges de `MOG_Scrollbar`, `MOG_CursorBorder` et
   `YEP_X_BattleSysCTB` qui appellent `select()` pendant l'initialisation ;
3. un contrôle cherchait la chaîne `b.mhp` dans le **texte** des formules et accusait à tort deux
   compétences qui s'en servent comme condition d'achèvement. → On mesure le **symptôme**, pas le
   motif, et on vérifie **dans les deux sens** : le contrôle doit attraper le vrai coupable *et*
   innocenter les faux.

> Un banc simule le moteur assez fidèlement pour attraper le bug, ou il ne sert à rien.

**Après toute modification de `data/`, les bancs doivent passer** avant de committer.

---

## 7. Repères techniques

**Équipement** (`etypeId`) — 1 Arme · 2 Bouclier · 3 Tête · 4 Corps · **5 Accessoire** ·
6 talisement · **7 Ame**

**Le Don Spirituel — un seul par personne** :
⚔️ Arme (80 %) → slot Arme · 🔮 Objet (18 %) → Accessoire · 👤 **Avatar Spirituel** (2 %) → Âme

| Héros | Son unique Don | Trait |
|---|---|---|
| Vesper | le Masque *(objet)* | sang |
| Korrah | l'Armure Volante *(avatar)* | change + hiver *(via l'Avatar)* |
| ludwing | l'Amulette *(objet)* | ames |
| Aël | l'Arc *(arme)* | miracle |

**Pièges de MV rencontrés ici :**

- `Math.max(eval(formule), 0)` — une formule négative fait **0 dégât**, jamais un soin ;
- une soustraction `a.atk * k - b.def * k` tombe à **0** contre la DÉF de fin de partie. Formule
  ratio : `Math.floor(a.atk * K * 200 / (200 + b.def))` ;
- une compétence dont le **type n'est ouvert par aucun trait** est apprise mais **invisible** dans
  tous les menus ;
- MV n'applique `numRepeats()` que dans son propre enchaînement : une action jouée à la main (celle
  de l'Avatar) doit boucler elle-même ;
- les métadonnées gardent l'espace après le `:` — `<Forme: objet>` donne `" objet"`, il faut
  `trim()`.

---

## 8. Git

Branche de travail : `claude/spiritual-weapons-objects-96tc6b`. Pousser avec
`git push -u origin <branche>`. Pas de pull request sans demande explicite.
