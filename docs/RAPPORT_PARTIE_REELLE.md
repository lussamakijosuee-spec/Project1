# 🎮 RAPPORT — le jeu lancé pour de vrai

> **Ce qui a été fait :** ton jeu a été **réellement démarré** dans un navigateur Chromium, avec
> **les 168 plugins actifs**, la base de données complète, une nouvelle partie, tous les écrans du
> menu et un vrai combat. Pas un banc d'essai, pas une simulation : le moteur.
>
> C'est la première fois de ce projet. Et ça a immédiatement trouvé des choses qu'aucun de mes
> bancs n'avait pu voir.

---

## 🔴 1. TON JEU NE DÉMARRAIT PLUS. C'ÉTAIT MA FAUTE.

Premier constat, et le plus grave : **écran noir permanent au lancement.** Pas de message d'erreur,
pas de plantage — le jeu se figeait sur « Now Loading… » et n'atteignait jamais l'écran-titre.

J'ai bissecté les 168 plugins un par un. Le coupable : **`DonsSpirituels.js`**, que j'ai écrit.

### Le mécanisme

```js
function acteur(id) {
    return $gameActors.actor(id);     // ← le piège
}
```

`$gameActors.actor(id)` ne se contente pas de *lire* un acteur : **il le CONSTRUIT** s'il n'existe
pas encore. Or ma fonction était appelée depuis `paramPlus()`, que RPG Maker déclenche pendant
`Game_Actor.refresh()` — c'est-à-dire **pendant cette construction même** :

```
actor(2) → new Game_Actor → refresh() → paramPlus() → acteur(2) → actor(2) → new Game_Actor → …
```

Récursion sans fin. Le fil JavaScript tournait à vide, pour toujours, en silence.

### La correction

```js
function acteur(id) {
    // On lit la table directement : jamais de construction, jamais de récursion.
    return ($gameActors && $gameActors._data) ? ($gameActors._data[id] || null) : null;
}
```

Plus un garde-fou anti-réentrance sur `paramPlus`.

**Vérifié : avant → figé. Après → le jeu démarre.**

> ⚠️ Ce bug était **déjà présent avant cette semaine** — la version d'`origin/main` fige aussi. Je
> l'ai introduit dans une session antérieure. Si tu n'arrivais plus à lancer ton jeu, c'était ça.

### Pourquoi mes bancs ne l'avaient pas vu

Mes bancs simulaient `$gameActors` comme `{ actor: i => ACTORS[i] }` — une fonction qui *rend* un
acteur sans jamais en construire. Le vrai MV, lui, construit à la demande. **Ma simulation était
plus gentille que le moteur.** Les neuf bancs ont été corrigés pour porter `_data`, comme MV.

---

## 🔴 2. KORRAH NE PEUT PAS AGIR. DEPUIS LE PREMIER COMBAT.

Une fois le jeu démarré, j'ai regardé le groupe. Et là :

```
Vesper       peut agir : ✅ OUI   (restriction 0)
ludwing      peut agir : ✅ OUI   (restriction 0)
Aël          peut agir : ✅ OUI   (restriction 0)
Korrah       peut agir : ❌ NON   (restriction 4)
                 #25 Méditation Profonde [restriction 4 = ne peut pas agir]
```

**Korrah est paralysée dès la nouvelle partie.** Le personnage qui porte l'Avatar Spirituel —
ton système le plus original — ne peut pas jouer un seul tour.

### La cause : les variables mentales démarrent à 0

L'état #25 s'applique sur cette condition, que tu as écrite :

```js
condition = $gameVariables.value(12) <= 2;   // variable 12 = « concentration » de Korrah
```

C'est juste. Mais **au démarrage d'une partie, toutes les variables valent 0**, et `0 <= 2` est
vrai. L'état s'installe et ne part jamais.

### Ce n'est pas isolé — les quatre héros sont touchés

| Héros | variable | état déclenché à 0 | conséquence |
|---|---|---|---|
| **Korrah** | 12 · concentration | **#25 Méditation Profonde** | ⛔ **ne peut pas agir** |
| **Vesper** | 11 · maîtrise de soi | **#28 Folie Destructrice** | subie dès le départ |
| **ludwing** | 13 · LOU | *aucun* (ses conditions demandent ≥ 2) | il n'a **aucun** état mental |
| **Aël** | 14 · tianaa | *aucun* (#43 exige `<=1 && >0`) | idem |

Résultat : le système mental complet est incohérent au lancement. Deux héros ont un état extrême,
deux n'en ont aucun.

### La correction ne m'appartient pas

Deux façons, et c'est ton choix :

1. **Initialiser les variables 11 à 14** à une valeur « normale » au début de la partie (7 mettrait
   chacun dans sa bande normale : *NORMALTHY* 6-8 pour Vesper, *normal* 6-8 pour Korrah).
2. **Corriger les conditions** pour ignorer la valeur 0 (`> 0 && <= 2`).

La première est plus propre : elle fait exister l'échelle mentale dès le départ. **Dis-moi laquelle
et je l'applique** — je n'y touche pas sans toi.

### Deux coquilles trouvées au passage, dans les mêmes conditions

- **#23 « Distraite »** (Korrah) lit `value(12) >= 4 && value(11) <= 6` — la seconde est la variable
  de **Vesper**.
- **#63 « normal »** (Aël) lit `value(13)` — la variable de **ludwing**.
- **#34 « Maître Serein »** et **#37 « Souffre-Douleur »** (ludwing) ont la **même** condition
  (`>= 9`) : ils s'appliquent toujours ensemble.

---

## 🔴 3. LES SEPT PRIX DES VOIES NE FONCTIONNAIENT PAS

Dans le premier combat, le filet de sécurité a intercepté ceci :

```
ReferenceError: SANG_CORR is not defined
    at Game_Action.apply (MaitriseVoies.js:541)
```

`MaitriseVoies.js` déclare sept paramètres de prix en tête de plugin, les emploie plus bas… et
**n'en lisait aucun**. Les variables n'existaient pas :

| variable manquante | paramètre déclaré | ce qui ne marchait plus |
|---|---|---|
| `FORGE_RECUL` | forgeRecul (5 %) | l'élan brûlé de la Forge |
| `ONDE_EXPO` | ondeExpo (20 %) | l'exposition de l'Onde |
| `MIR_RETOUR` | miroirRetour (20 %) | les éclats du Miroir |
| `ECL_RECUL` | eclairRecul (8 %) | la brûlure de l'Éclair |
| `FLASH_CC` | flashContrecoup (10 %) | le contrecoup du Flash |
| `SRC_ERR` | sourceErrance (1) | le prix en Errance de la Source |
| `SANG_CORR` | sangCorruption (2) | la corruption du Sang |

**Tout le système « chaque Voie a un prix » était mort.** Et comme l'erreur tombait *au milieu* du
calcul, elle emportait avec elle le **drain de la Voie du Sang** — donc **la jauge du Masque de
Vesper ne se remplissait jamais**.

Les sept déclarations sont ajoutées (pourcentages ÷100 comme `sangSteal`, montants à plat comme
`videCorruption`). Rien d'autre n'est touché.

**Après correction, en combat réel :**

```
compétence « Saignée »
jauge de Sang        : 0 → 40   ✅
endurance du Masque  : 42 → 38  ✅ elle s'use
erreurs JavaScript   : 0
```

---

## 🟠 4. UN CINQUIÈME HÉROS SANS NOM DANS LE GROUPE DE DÉPART

```
#1 Vesper    (l'Équilibre) 470PV · 36 comp. · Lame Écarlate de Fer, Éclat de Masque
#3 ludwing   (le Symbole)  450PV · 36 comp. · Hache Valo, Éclat d'Amulette
#4 Aël       (la Parole)   450PV · 29 comp. · Éclat Stellaire, le Carquois d'Étoiles
#2 Korrah    (la Maîtrise) 475PV · 33 comp. · Gantelet de Fer, Éclat Volant
#5 (SANS NOM)(l'Équilibre) 450PV · 32 comp. · AUCUN ÉQUIPEMENT
```

`System.partyMembers` vaut `[1, 3, 4, 2, 5]`. L'acteur **5 a un nom vide et aucun équipement**.

Je n'y touche pas : c'est peut-être une place réservée pour un personnage à venir. Mais tel quel, le
joueur commence avec un cinquième membre anonyme et nu.

---

## ✅ 5. CE QUI MARCHE — et il y en a beaucoup

| | |
|---|---|
| **Le jeu démarre** *(après correction)* | `Scene_Title`, 168 plugins actifs |
| **Fichiers manquants** | **0** — pas une seule image, pas un son |
| **Nouvelle partie** | le groupe se forme, l'équipement est en place |
| **Les écrans** | Menu · Objet · Compétences · Équipement · Statut · Options · **LES DONS SPIRITUELS** — tous s'ouvrent |
| **Un vrai combat** | `Scene_Battle`, phase « input », les ennemis apparaissent |
| **Erreurs JS en combat** *(après corrections)* | **0** |

### La règle d'un seul Don, vérifiée dans le moteur

```
1  le Masque           · Objet spirituel  · slot Accessoire · endurance 42/42 · jauge Sang 0/100
2  l'Armure Volante    · Avatar spirituel · slot Âme        · endurance 42/42
3  l'Amulette          · Objet spirituel  · slot Accessoire · endurance 42/42 · jauge Ombre 0/100
4  l'Arc et ses Flèches· Arme spirituelle · slot Arme       · endurance 42/42
```

### L'évolution des paliers, en jouant

```
Vesper  niv60 → Vérité du Masque            (palier 4/4)
Korrah  niv60 → Vérité de l'Armure Volante  (palier 4/4)
ludwing niv60 → Vérité de l'Amulette        (palier 4/4)
Aël     niv60 → Vérité de l'Arc             (palier 4/4)
Korrah  niv85 → Avatar niveau 3/3 · CONTRÔLE TOTAL · 8 techniques
```

Tes deux menus personnalisés — **LES DONS SPIRITUELS** et **LE TABLEAU DE CHASSE** — sont bien dans
le menu principal et s'ouvrent.

---

## 6. Ce que je n'ai pas pu tester

- **Le scénario et les cartes.** J'ai démarré une partie et lancé des combats, mais je n'ai pas
  parcouru tes 66 cartes ni joué tes événements — il faudrait piloter le personnage.
- **L'Avatar en action.** Bloqué par le bug n°2 : tant que Korrah est paralysée, son Avatar est
  considéré absent. À retester une fois les variables mentales réglées.
- **Le son.** Coupé dans mon navigateur.
- **Le rendu graphique.** Mon navigateur tourne sans carte graphique (PixiJS en mode Canvas). Ton
  jeu, lui, tourne en WebGL sur ta machine — l'affichage peut différer.

---

## 7. Ce qui a changé dans le dépôt

| Fichier | Changement |
|---|---|
| `js/plugins/DonsSpirituels.js` | la récursion qui figeait le démarrage — **corrigée** |
| `js/plugins/MaitriseVoies.js` | les 7 déclarations manquantes — **ajoutées** |
| `bancs/*.js` (5 fichiers) | `$gameActors` porte maintenant `_data`, comme le vrai MV |
| `docs/A_TRIER.md` | tes 6 décisions « jette » enregistrées |

**Aucune donnée du jeu (`data/*.json`) n'a été modifiée.** Les 9 bancs passent.

---

## 8. Ce qui t'attend, par ordre d'urgence

1. **Les variables mentales 11-14.** Korrah ne peut pas jouer. C'est le point bloquant, et il te
   faut trancher entre les deux corrections proposées au §2.
2. **Les trois coquilles de conditions** (#23, #63, #34/#37).
3. **Le cinquième héros sans nom** — tu gardes, tu nommes, ou tu retires du groupe de départ ?
4. **Retester l'Avatar** une fois Korrah libérée.

---

*Rapport produit en lançant le jeu, pas en le lisant.*
