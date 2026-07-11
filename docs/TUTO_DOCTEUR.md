# 🩺 LE DOCTEUR DU CODEX — tutoriel complet
> `tools/verifier.js` vérifie TOUS les IDs croisés du projet en une commande :
> skills appris par les classes, animations, états posés par les effets,
> ennemis des troupes, actions des ennemis, alignement des fichiers data.

## 0. Prérequis : Node.js (une seule fois)
Le docteur a besoin de **Node.js** (gratuit). Pour vérifier s'il est déjà là :
1. Touche **Windows**, tape `cmd`, Entrée.
2. Tape `node -v` puis Entrée.
   - Tu vois un numéro (ex. `v20.11.0`) → c'est bon, passe à l'étape 1.
   - Tu vois « n'est pas reconnu » → va sur **nodejs.org**, télécharge la
     version **LTS**, installe en cliquant Suivant partout, redémarre le PC.

## 1. Méthode A — le double-clic (la plus simple)
1. Ouvre le dossier du projet dans l'Explorateur Windows.
2. Va dans `tools/mvtools/VerificateurCodex/`.
3. **Double-clique sur `verifier.bat`.**
4. Une fenêtre noire s'ouvre, affiche le rapport, et attend une touche.
C'est tout. Fais un raccourci de ce .bat sur le Bureau si tu veux.

## 2. Méthode B — le terminal (si tu préfères taper)
1. Ouvre le dossier du projet dans l'Explorateur.
2. Clique dans la **barre d'adresse** (en haut, là où il y a le chemin),
   tape `cmd` et Entrée → une console s'ouvre DÉJÀ placée au bon endroit.
3. Tape : `node tools/verifier.js` puis Entrée.

## 3. Méthode C — depuis l'éditeur RPG Maker (optionnel)
1. Menu **Tools → RPG Maker MV Tools**.
2. **Select Path…** → choisis le dossier `tools/mvtools` du projet.
3. Si « Vérificateur du Codex » apparaît dans *Found Tools* → **Ajouter** → OK.
4. Il se lancera ensuite depuis ce menu. (Si l'éditeur ne le détecte pas,
   ce n'est pas grave : les méthodes A et B font exactement pareil.)

## 4. Lire le résultat
- `✓ TOUT EST SAIN — aucun ID cassé.` → rien à faire, joue tranquille.
- Sinon, chaque ligne dit PRÉCISÉMENT quoi et où, par exemple :
  - `✗ classe 3 apprend skill inexistant 999` → ouvre la base de données,
    onglet Classes, classe 3, retire/corrige l'apprentissage 999.
  - `✗ troupe 24 ennemi inexistant 450` → onglet Troupes, troupe 24,
    remplace le membre fantôme.
  - `✗ Skills désaligné id 40 index 41` → un fichier data a été mélangé :
    NE CORRIGE PAS À LA MAIN, redemande-moi le fichier propre.
  - `✗ skill 66 anim inexistante 700` → onglet Compétences, skill 66,
    choisis une animation qui existe.

## 5. QUAND le lancer (le réflexe)
- Après **chaque synchronisation** GitHub (pull/merge) — c'est comme ça
  qu'on aurait attrapé le fichier DestinsParalleles vidé.
- Après avoir **remplacé des fichiers** dans data/.
- Avant de donner une nouvelle version à Gérard.
- Quand le jeu plante au lancement sans raison visible.

## 6. Ce que le docteur ne voit PAS
- Le contenu de `js/plugins.js` (ta liste de plugins cochés) → pour ça,
  suis `docs/ORDRE_PLUGINS.md`.
- L'équilibrage (un boss trop fort, un prix trop cher) → ça, c'est du playtest.
- Les images/audio manquants → le jeu te le dit lui-même au chargement.

## Rappel : où va chaque type de fichier
| Fichier | Où | Quoi faire |
|---|---|---|
| `*.json` (Skills, States, Classes…) | `data/` | remplacer, RIEN à cocher |
| plugin `*.js` | `js/plugins/` | + cocher dans le gestionnaire |
| `verifier.js` | `tools/` | lancer au terminal (JAMAIS en plugin) |
| `verifier.bat`, `tool.json` | `tools/mvtools/VerificateurCodex/` | double-clic |
| guides `*.md` | `docs/` | à lire |
