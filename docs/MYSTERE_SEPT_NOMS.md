# Le Mystère des Sept Noms — guide de montage (v1.2)

> *Sheva Shemot · Zikhrael_Mazal.js v1.2 · Les Sept Âmes n'apparaissent qu'avec LE REGARD (touche R).*

## Ce qui est déjà fait (rien à refaire)

Tout ce qui suit est **déjà installé et configuré** dans le projet :

- `js/plugins/Zikhrael_Mazal.js` mis à jour en **v1.2** (chargé après LeRegard — ne pas le déplacer avant).
- Les paramètres du plugin sont enregistrés dans `js/plugins.js`.
- La base de données est nommée et réservée :

| N° | Type | Nom | Rôle |
|---|---|---|---|
| 44–50 | Interrupteurs | ZK Âme 1 Temira … ZK Âme 7 Maroth | ON = l'âme a été nommée à l'autel |
| 51 | Interrupteur | ZK Résultat | ON si le nom entré est reconnu |
| 52 | Interrupteur | ZK Scribe | géré par le plugin (Mazal = 7 et jamais vu) |
| 53 | Interrupteur | ZK Stèle | géré par le plugin (Mazal = 77) |
| 54 | Interrupteur | ZK Vision | géré par le plugin : ON pendant le Regard |
| 43 | Variable | ZK Mazal | le tirage secret de la partie (1–100), jamais montré |
| 44 | Variable | ZK Âmes | nombre d'âmes nommées (0–7) |
| — | Héros n°5 | « • » | l'acteur fantôme de l'autel, jamais dans l'équipe |

⚠️ Les anciens numéros du guide HTML (interrupteurs 21–32, variables 41–42, héros 10)
sont **abandonnés** : 21, 22, 28 servaient déjà à tes événements et 41–42 au gacha.

## La carte de démo : « Sanctuaire des Sept Noms » (carte 56)

Une carte complète est **déjà montée** (`data/Map056.json`, visible dans
l'éditeur en bas de la liste des cartes). Tout y est fonctionnel et testé :

- **L'autel** (flamme bleue, centre de la grande salle) : saisie du nom,
  vérification, les trois réponses possibles.
- **Les 7 âmes** en cercle autour de l'autel (`$AmeErrante`, tag
  `<ZK Esprit>`, chacune avec ses commentaires LeRegard `<Nom:>`, `<Ame:>`
  et `<Verite:>` — un Regard posé sur un spectre lit son âme).
- **La porte scellée** (porte de fer, mur nord) : close tant que les 7 âmes
  ne sont pas nommées *et* regardées. À l'ouverture elle joue un son et
  affiche un message — remplace ce message par ta téléportation vers la
  Chambre du Souvenir (le commentaire DEV dans l'événement te le rappelle).
- **Le Scribe Gris** (silhouette noire, coin sud-ouest) : n'existe que si
  Mazal = 7, s'efface en fondu après sa phrase, ne revient jamais.
- **La stèle blanche** (cristal blanc, à l'écart) : n'existe que si Mazal = 77.
- **Deux événements DEV invisibles** près de l'autel : « MODE D'EMPLOI »
  (les instructions en jeu) et « DEV nommer les sept » (nomme les sept âmes
  d'un coup pour tester). **À supprimer avant la sortie.**

Pour y aller en playtest : console F8 →
`$gamePlayer.reserveTransfer(56, 21, 21, 8, 0)` — ou copie-colle les
événements vers ta vraie carte de sanctuaire (clic droit → Copier dans
l'éditeur d'événements, tout est transportable tel quel).

## La règle de vision : uniquement avec le Regard

Les Sept Âmes ne dépendent plus d'un seuil de lucidité permanent. **Elles
n'existent que pendant le Regard** : quand le joueur appuie sur **R** (le
vitrail de LeRegard s'ouvre), l'interrupteur `ZK Vision (54)` passe ON et le
reste **8 secondes** après la fermeture du vitrail, puis les âmes s'estompent.
Changer de carte referme l'œil.

Réglages dans le Gestionnaire de plugins (Zikhrael_Mazal) :

- **Regard Vision Duree** : durée de la vision en secondes (défaut 8).
- **Regard Lucidite Min** : lucidité minimale (échelle LeRegard 0–9) pour que
  le Regard révèle les âmes. À 0, chaque Regard les révèle ; à 5 par exemple,
  seul un esprit déjà proche du Lac les voit.
- **Vision Mode** : `regard` (actuel). Repasser à `lucidite` rebranche
  l'ancienne logique sur la jauge mentale de Thylane (variable 11, inversée,
  seuil 4).

Commandes de mise en scène : `Zikhrael VisionOn 20` (force la vision 20 s),
`Zikhrael VisionOff` (la referme).

## 1. L'autel des Sept Noms

Un événement sur la carte du sanctuaire, déclencheur **Touche action**.

```
◆ Afficher un message : L'autel attend un nom.
◆ Afficher un choix : Prononcer un nom / Se taire
: Si Prononcer un nom
    ◆ Commande de plugin : Zikhrael ClearName 5
    ◆ Entrer le nom d'un héros : Héros n°5, 8 caractères
    ◆ Commande de plugin : Zikhrael CheckName 5
    ◆ Embranchement conditionnel : Interrupteur [0051 : ZK Résultat] = ON
        ◆ Embranchement conditionnel : Interrupteur [0054 : ZK Vision] = ON
            ◆ Afficher un message : Une silhouette pâle se dessine, quelque part dans le sanctuaire.
        : Sinon
            ◆ Afficher un message : Un murmure. Personne.
        : Fin
    : Sinon
        ◆ Afficher un message : L'autel reste froid.
    : Fin
: Fin
```

Le joueur peut donc rendre les sept âmes au monde **sans jamais en voir une
seule** — s'il ne pense pas à Regarder. C'est voulu.

## 2. Les Sept Âmes — les événements spectres

Sept événements PNJ. Pour chacun, écris `<ZK Esprit>` dans le champ **Note**
(la petite case en haut à droite de l'éditeur d'événement) : semi-transparence
et scintillement spectral automatiques.

**Page 1** — sans condition, sans graphisme, sans contenu (l'âme n'est pas là).

**Page 2** — conditions : **Interrupteur [son ZK Âme] = ON** ET
**Interrupteur [0054 : ZK Vision] = ON** · graphisme de spectre · Touche action.

| Âme | Interrupteur | Réplique (Zikhraël) | Traduction (pour toi seul) |
|---|---|---|---|
| Temira | 0044 | « Shemi — Temira. Ha-rishona. Todah lakh. » | Mon nom — Temira. La première. Merci à toi. |
| Kavor | 0045 | « Shemi — Kavor. Yesh chof be-choshkum. » | Mon nom — Kavor. Il y a un rivage dans le noir. |
| Oshka | 0046 | « Shemi — Oshka. Tashama ha-shira ? » | Mon nom — Oshka. Entends-tu le chant ? |
| Sulith | 0047 | « Shemi — Sulith. Ha-kol — lah. Ve-ze dayat. » | Mon nom — Sulith. Tout — à elle. Et cela suffit. |
| Nedra | 0048 | « Shemi — Nedra. Ze ha-mekhirum. Ze ha-matanum. » | Mon nom — Nedra. C'est le prix. C'est le don. |
| Ilesse | 0049 | « Shemi — Ilesse. Lo yachida. Me'olam lo. » | Mon nom — Ilesse. Pas seule. Plus jamais. |
| Maroth | 0050 | « Shemi — Maroth. Ha-acharon. Ha-deleta : patach ! » | Mon nom — Maroth. Le dernier. La porte : ouvre ! |

L'image à viser : le joueur nomme, ne voit rien… puis un soir il utilise le
Regard sur un PNJ quelconque du sanctuaire — et sept silhouettes pâles se
tiennent autour de lui pendant huit secondes.

Bonus lore gratuit : chaque âme peut aussi porter des commentaires LeRegard
(`<Ame: deuil>`, `<Nom: Temira>`, `<Verite: ...>`) — un Regard posé
directement sur un spectre ouvrira son vitrail comme pour un vivant.

## 3. La porte de la Chambre du Souvenir

**Page 1** — sans condition, Touche action :

```
◆ Afficher un message : La porte ne bouge pas. Quelque chose attend d'être vu.
```

**Page 2** — conditions : **Variable [0044 : ZK Âmes] ≥ 7** ET
**Interrupteur [0054 : ZK Vision] = ON** · déclencheur **Touche action** :

```
◆ Jouer un SE : l'ouverture
◆ Téléporter : Chambre du Souvenir
```

Nommer les sept ne suffit pas : il faut **les regarder en face**. Le joueur
doit ouvrir le Regard devant la porte, entouré des sept âmes qu'il a
ramenées, et la franchir pendant que l'œil est ouvert.

## 4. Le Scribe Gris

Événement dans un lieu anodin. Une seule page, condition
**Interrupteur [0052 : ZK Scribe] = ON**, `<ZK Esprit>` dans la Note si tu
veux l'effet spectral. **L'ordre des commandes compte** (le `GlobalOn` éteint
l'interrupteur immédiatement — s'il vient trop tôt, l'événement disparaît
d'un coup et le fondu ne se voit jamais) :

```
◆ Afficher un message : « Al chapas oti. Chapas ha-shemot. »
◆ Déplacer un événement : Cet événement, Opacité 0, vitesse lente
     ☑ Attendre la fin du déplacement
◆ Effacer l'événement temporairement
◆ Commande de plugin : Zikhrael GlobalOn scribe_vu
```

La clef `scribe_vu` est écrite dans `save/zikhrael.rpgsave` (ou le
localStorage en version navigateur) : elle survit aux sauvegardes **et aux
nouvelles parties**. Le Scribe n'existera plus jamais — sauf si tu supprimes
ce fichier, ou passes `Zikhrael GlobalOff scribe_vu` en événement de test.

**La stèle blanche** : événement décoratif muet, page conditionnée par
**Interrupteur [0053 : ZK Stèle] = ON**, aucun contenu. Elle est juste là.

## 5. Les autres indices

- **Musique aux notes inversées** (Mazal multiple de 7) : dans l'événement
  d'accueil de la carte, Embranchement conditionnel → onglet 4 → Script →
  `Zikhrael.mazalMultipleOf(7)` → jouer la BGM variante.
- **La fin du don** : dans l'événement final de la Chambre, si le joueur
  accepte : `Zikhrael EraseName 1` — le héros s'appelle « ??? » partout,
  jusqu'à la fin de la partie.

## 6. Tester (console F8 en playtest)

1. `Zikhrael.mazal()` — voir le tirage. `Zikhrael MazalSet 7` (commande de
   plugin en événement de test) pour le forcer.
2. **L'autel** : entrer « temira » en minuscules → `Zikhrael.ames()` doit
   rendre 1, et sans Regard le message est « Un murmure. Personne. ».
3. **La vision** : appuyer sur **R** n'importe où dans le sanctuaire →
   les âmes nommées se matérialisent ~8 secondes (`Zikhrael.voit()` → true,
   `Zikhrael.visionRestante()` → secondes restantes), puis s'estompent.
4. **La porte** : 7 âmes nommées + Regard ouvert → page 2, téléportation.
   7 âmes sans Regard → porte close : comportement voulu.
5. **Le Scribe** : `Zikhrael MazalSet 7`, aller sur sa carte, lui parler :
   il s'efface. Nouvelle partie, re-forcer 7 : il n'est plus là. Supprimer
   `save/zikhrael.rpgsave` : il renaît.
6. **Avant la sortie** : retirer les événements de test. La règle du déni
   commence dans l'éditeur.

---

*Shemi — lah. Nefeshi — lah. Ve-Emeritas — li.*
