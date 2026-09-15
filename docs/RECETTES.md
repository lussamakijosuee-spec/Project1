# LE LIVRE DE RECETTES — TOUS LES TYPES, COPIER-COLLER

> **Chaque chose que tu peux créer dans le jeu, en recette prête à poser.** PNJ, ennemis, boss,
> compétences (tous les archétypes), personnages, états, armes/armures/objets, événements, quêtes,
> succès, factions, liens, chutes, fusions, difficulté, HUD, écrans.
>
> **Rappels d'emploi :**
> - **Commande de plugin** → événement : `Commandes avancées ▸ Commande de plugin` (tape la ligne, sans « / »).
> - **Script** → événement : `Commandes avancées ▸ Script` ; **condition** : onglet 4 ▸ Script.
> - **Notetag** → case **Note** de l'objet (skill, acteur, ennemi, arme, armure, objet, événement).
> - Les héros s'écrivent en **ID (1-4)** ou en **clé** (`thylane`/`neyssa`/`lou`/`tianna`). ID = plus sûr.
> - Beaucoup de commandes texte remplacent `_` par une espace (ex. `CHRONIQUE`, `PNJ`). Mets des `_` pour les phrases.
>
> Catalogue complet des commandes/notetags : `docs/FICHE_COMMANDES_COMPLETE.md`. Systèmes expliqués : `docs/GUIDE_DEVELOPPEUR.md`.

---

# SOMMAIRE
1. PNJ (7 recettes) · 2. Ennemis & boss (6) · 3. Compétences — tous les archétypes (14)
4. Personnages jouables (2) · 5. États / buffs (3) · 6. Armes · armures · objets (5)
7. Événements de scène (8) · 8. Quêtes (4) · 9. Succès & titres (2) · 10. Factions (2)
11. Liens sociaux (2) · 12. Chronique du monde (3) · 13. Chutes — mise en scène (7)
14. Fusion · Domaine · Mue · Ultime (5) · 15. Difficulté & New Game+ (3)
16. HUD & visuel MOG (6) · 17. Ouvrir chaque écran (1 table)
18. **Recettes avancées** — boss multi-phases, quête à embranchements, donjon complet, rencontre chutée, combat global, pacte à prix différé (6)
19. Chutes & horreur — tout le reste (8) · 20. Le Regard / lire une âme · 21. ludwing copie · 22. Korrah concentration
23. Pactes au sanctuaire · 24. Tutoriels · 25. Boss & entités signatures · 26. Affinités/camps/zones (notetags)
27. **TABLE DE COUVERTURE** — chaque commande → sa recette (rien ne manque)

---

# 1. PNJ

### 1.1 — PNJ simple qui parle
```
Événement ▸ Déclenchement : Touche d'action
◆ Texte : « Bonne route, voyageur. »
```

### 1.2 — PNJ réactif à ton état (LivingNPC)
```
◆ Commande de plugin : NPC talk marchand     (dialogue qui change selon tes jauges)
```
Bark (petite phrase au-dessus, sans ouvrir de fenêtre) : `NPC bark marchand`. Le faire taire : `NPC mute`.

### 1.3 — PNJ vivant+ qui commente tes gouffres (PNJVivantsPlus)
```
◆ Commande de plugin : PNJ react           (8 répliques selon marque/corruption/errance/lucidité)
◆ Commande de plugin : PNJ rumeur          (raconte la dernière action d'un héros absent)
```

### 1.4 — PNJ qui a SON destin (peut chuter)
```
— PAGE 1 (normale) —
◆ Commande de plugin : NPC talk anna
◆ Commande de plugin : PNJ destin anna 1        (sa marque s'use ; +1 auto tous les 120 pas)

— PAGE 2 (condition ▸ Script : PNJ.destin('anna') >= 70) —
◆ Texte : « Aide-moi… quelque chose me ronge. »
◆ Afficher choix : L'aider / Plus tard
  ◆ Si L'aider : Commande de plugin : PNJ soigner anna 40

— PAGE 3 (condition ▸ Script : PNJ.perdu('anna')) —
◆ (maison vide, ou un monstre à sa place)
```
Lire sa marque à voix haute : `PNJ lire anna`.

### 1.5 — PNJ du Fond (se souvient des Reprises)
```
◆ Commande de plugin : PNJ fond      (normal / « Encore vous ? » à 5+ / « Il te regarde » à 20+)
```

### 1.6 — PNJ caché dans l'Envers
Dans la **Note de l'événement** :
```
<Envers>
```
→ Il n'existe QUE si le chef voit l'autre côté (`PNJ.voitEnvers()` : Errance ≥ 40 **ou** lucidité ≤ 3).

### 1.7 — Le Graveur (5 âmes → 1 rune)
```
◆ Commande de plugin : PNJ graveur    (refuse si lucidité < 5 ; sinon 5 âmes → rune 65/66/67)
```

---

# 2. ENNEMIS & BOSS

### 2.1 — Ennemi de base
`Base ▸ Ennemis` → stats, image, actions. **Note** (facultatif mais recommandé) :
```
<Rang: C>
<Mana: negatif>
```

### 2.2 — Boss de rang S, être d'Ombre, art interdit
**Note de l'ennemi :**
```
<Rang: S>
<Camp: ombre>
<Mana: sombre>
<Mana2: negatif>
<Aura: 4>
```
**Note de son skill signature :**
```
<Voie: domaine>
<Interdit: 1.8>
<Ulti: le Fléau|#7a2fff>
```
Formule : `a.mat * 6 - b.mdf * 2`, élément **Sombre (15)**. Le plugin gère ×1.3 (domaine), ×1.8 (interdit), la corruption et le visuel.

### 2.3 — Boss avec un Trait de boss (CanonPlus)
**Note de l'ennemi**, ajoute une de ces lignes :
```
<TraitBoss: le Dévoreur|faim>     (vole 10 % des dégâts)
<TraitBoss: Zéro Absolu|gel>       (10 % de figer la cible)
<TraitBoss: l'Œil|regard>          (ne rate jamais)
<TraitBoss: le Miroir|renvoi>      (10 % de contrer à ×0.5)
<TraitBoss: la Faille|rupture>     (+15 % critique)
```

### 2.4 — Ennemi qui poursuit le joueur (ChaseEnemies)
**Note de l'événement** (pas de l'ennemi) :
```
<Chase: 4>        (poursuit dès qu'il te voit dans un rayon de 4 cases)
```

### 2.5 — La version « chutée » d'un héros
Utilise les ennemis déjà en base (matrice 401-412) **ou** crée le tien avec, dans la Note :
```
<Rang: A>
<Mana: pur>
<DechireTombe>          (ou <BeteTombee> / <DementTombe> / <ErrantTombe>)
```
Le poser : événement ▸ `Si (Script) : Destins.chute(2) === ''` → recruter, `Sinon` → combat (voir recette 7.1).

### 2.6 — Boss signature (déjà câblés)
Il suffit du bon tag dans la Note de l'ennemi : `<Gaster>` (Celui qui est Tombé) · `<Radahn>` (Kev/Mahoraga) · `<Malenia>` (obsession de Jade) · `<DonoBoss>` + `<DonoEsprit>` (Dono & son Kamui).

---

# 3. COMPÉTENCES — TOUS LES ARCHÉTYPES

> Rappel : la **formule** ne contient QUE les dégâts bruts. Les multiplicateurs (Voie, Interdit, recul…) sont ajoutés par les plugins via les **notetags**. `a` = lanceur, `b` = cible.

### 3.1 — Attaque physique simple
```
Formule : a.atk * 4 - b.def * 2   |  Élément : Physique (1)
```

### 3.2 — Sort magique simple
```
Formule : a.mat * 6 - b.mdf * 2   |  Élément : Feu (8)
```

### 3.3 — Une des 9 Voies (Corps)
**Note**, choisis une Voie :
```
<Voie: forge>     (×1.5 dégâts, −5 % PV/coup)
<Voie: onde>      (prochaine attaque contrée ×2)
<Voie: source>    (soigne 60 % des dégâts, +1 Errance)
<Voie: miroir>    (−30 % + renvoyé à 100 %)
<Voie: vide>      (traverse la garde, +2 corruption)
<Voie: eclair>    (+50 % crit, ne rate jamais, −8 % PV)
<Voie: domaine>   (touche garantie, ×1.3, +3 corruption)
<Voie: flash>     (25 % Éclat Noir ×2.5, −10 % PV max)
<Voie: sang>      (vole 45 % des dégâts en PV, +2 corruption)
```

### 3.4 — Une Parole (Esprit)
```
Formule : a.mat * 5 - b.mdf   |  Élément : mana positive (3)
Note :
  <Parole>            (longueur auto selon le coût de PM)
  <ParoleL: 4>        (forcer la longueur — les longues ratent si lucidité basse)
```
Parole **infaillible** (ultime) : type de compétence **ult (3)** + `<Parole: origine>`.

### 3.5 — Frappe d'Âme (ignore DEF/MDF + résistances)
```
Type : ame (stype 9)  |  Formule : a.mat * 5 - b.mdf   |  Élément : spirituelle (2)
Note :
  <FrappeAme>
  <FrappeAmeEtat: 134>    (30 % d'appliquer l'état 134 en plus)
```
Prix automatique : +2 Errance (ratée : −10 % PV max + 2 Errance de plus).

### 3.6 — Art interdit (gros dégâts, corruption)
```
Note :
  <Interdit: 2.0>     (dégâts ×2.0, +8 corruption/usage)
```

### 3.7 — Invocation (dépense des âmes)
```
Type : invocation (stype 8)  |  Portée : tous les ennemis
Note :
  <Invocation: 3>     (dépense 3 âmes du stock — var 15 ; gratuit dans le Domaine)
```

### 3.8 — Fusion — la FORME (transformation, prix/tour)
```
Note :
  <Fusion: chair>     (état 195 : ATK ×1.45, DEF ×1.30 ; +4 Bête & +3 Errant/tour)
```
Variantes : `<Fusion: rasoir>` (AGI ×1.6, +3 Bête & −1 lucidité) · `<Fusion: songe>` (MAT ×1.5, −1 lucidité & +3 Errant). Skills prêts : 807/808/809.

### 3.9 — Fusion — la TECHNIQUE (un instant, prix immédiat)
```
Note :
  <FusionTech: rasoir>    (moitié du prix, appliqué tout de suite)
```
Skills prêts : 821 (chair) · 822 (rasoir) · 823 (songe).

### 3.10 — Rune (Parole gravée, jamais ratée, marche même Muet)
```
Note :
  <Rune>
```
Skills prêts : 824 Entrave · 825 Renvoi · 826 Saignée. Se fabrique aussi par `GRAVER entrave|renvoi|saignee`.

### 3.11 — Ultime signature d'un héros
```
Type : ult (3)  |  Portée : selon l'effet
Note :
  <Ultime: convergence>   (Aël — état 201)
```
Variantes : `<Ultime: mue>` (Korrah — 202) · `<Ultime: parole>` (Vesper — 203). Le Domaine de ludwing = `<RoyaumeImperial>`.

### 3.12 — Arsenal du Domaine (ludwing)
```
<RoyaumeImperial>   (déploie le Domaine : +30 âmes, invocations gratuites, état 198)
<ContreTotale>      (état 199 : tout ce qui te frappe ce tour est renvoyé)
<SceauMagie>        (PM de la cible à 0 + MAT brisé 3 tours)
<AspirationDamnees> (régen selon le total d'âmes de la partie + état 200 Traumatisé)
```

### 3.13 — Combo / lien entre héros
```
Note :
  <Combo: 1,3>        (déclenchable si Aël + ludwing sont là)
  <ComboLien: 3>      (coût du lien)
```

### 3.14 — Compétence avec cinématique et séquence d'action
```
Note :
  <Ulti: Nom de l'attaque|#ff3366>     (cut-in cinématique + couleur)
  <StateFX: burst>                       (effet visuel)
<setup action>
  display action
  se: Darkness1
  wait: 20
</setup action>
<target action>
  animation 110: target
  shake screen: 5, 5, 20
  action effect
</target action>
```

---

# 4. PERSONNAGES JOUABLES

### 4.1 — Un héros complet
`Base ▸ Acteurs` → nom, classe, graphismes, arme. **Note de l'acteur :**
```
<Mana: positif>            (affinité principale)
<Mana2: spirituelle>       (seconde affinité)
<VoieDefaut: source>       (sa Voie de prédilection)
<Camp: lumiere>            (lumiere | ombre)
<Trait: verbe>             (don de naissance : rupture | gel | porte | verbe)
<Passive State: 40, 41>    (états passifs permanents)
```
Sa santé mentale : héros 1→var 11, 2→12, 3→13, 4→14 (déjà câblé pour 1-4).

### 4.2 — Recruter un héros en jeu
```
◆ Script : $gameParty.addActor(2)      (il garde ses jauges — vies partagées)
```
Sa vie parallèle s'arrête dès qu'il rejoint (voir Destins §7.1).

---

# 5. ÉTATS / BUFFS

### 5.1 — Poser un état par une compétence
Dans le skill ▸ onglet **Effets** ▸ `Ajouter un état` ▸ choisis l'état (ex. 134 Étourdi) + chance %.

### 5.2 — Buff de stats temporaire
Skill ▸ Effets ▸ `Buff/Debuff` ▸ choisis le paramètre (ATK…) + nombre de tours.

### 5.3 — État passif permanent (sur acteur/classe/ennemi)
Note :
```
<Passive State: 61, 30>    (toujours actifs, gérés par YEP_AutoPassiveStates)
```
États système déjà définis (rappel) : 181-183 corruption · 188 Surpassé · 195-197 Fusions · 198 Domaine · 199 Contre Totale · 201-203 ultimes · 204 l'Envers · 205-206 Formes d'Aël.

---

# 6. ARMES · ARMURES · OBJETS

### 6.1 — Arme qui lance une compétence
Note de l'arme :
```
<skill_id: 3>       (l'attaque de base déclenche la compétence 3)
```

### 6.2 — Armure-relique (anti-corruption)
Note de l'armure :
```
<Relic: antirot>    (tous les gains de corruption ÷2)
```

### 6.3 — Relique à passif
Note :
```
<Relic: lifesteal>  (vol de vie)      <Relic: thorns>   (épines)
<Relic: lowhp>      (bonus à bas PV)  <Relic: soulgain> (+ gain d'âmes)
<Relic: firstaid>   (premier secours)
```

### 6.4 — Objet Spirituel (arme évolutive)
Donne l'arme de départ au héros. Elle évolue seule (`OBJET check` la met à jour) : Éclat (niv 1) · Forme (15) · Résonance (35) · Vérité (60).

### 6.5 — Rune gravée (objet consommable)
```
◆ Commande de plugin : GRAVER entrave     (5 âmes → objet 65 Rune d'Entrave)
```
`renvoi` → objet 66, `saignee` → objet 67. Jamais ratées, utilisables même Muet.

---

# 7. ÉVÉNEMENTS DE SCÈNE

### 7.1 — Rencontre : recruter OU affronter la version chutée
```
◆ Si (Script) : Destins.chute(2) === ''
    ◆ Texte : « Korrah ?! Tu es vivante… »
    ◆ Afficher choix : Rejoins-moi / Pas encore
      ◆ Si Rejoins-moi : Script : $gameParty.addActor(2)
◆ Sinon
    ◆ Texte : « Ce qui te fait face n'est plus tout à fait Korrah. »
    ◆ Lancer le combat : sa troupe chutée
```
Raccourci : les **événements communs 201-204** (Aël/Korrah/ludwing/Vesper) font déjà TOUT. Pose un PNJ → `Appeler un événement commun ▸ 201-204`.

### 7.2 — Le Pacte de la Reine (choix moral)
```
◆ Texte : « Je peux te donner ce que tu cherches. Il y aura un prix. »
◆ Afficher choix : Accepter / Refuser
  ◆ Si Accepter : Commande de plugin : REINE pacte 3   (+20 % ATK/MAT ; −3 mental, +10 Errance)
  ◆ Si Refuser  : Texte : « Sage. Ou lâche. »
```
Annuler : `REINE oubli 3`.

### 7.3 — Checkpoint / Feu d'Âme (repos souls-like)
```
◆ Commande de plugin : FEU repos              (repos + checkpoint)
◆ Commande de plugin : CORRUPTION purge 1 20  (répéter 2,3,4 si besoin)
◆ Commande de plugin : ERRANCE purge 1 20
◆ Script : Ame.bon(1,2); Ame.bon(2,2); Ame.bon(3,2); Ame.bon(4,2)
```

### 7.4 — Purge tragique (on transvase, on n'efface pas)
```
◆ Commande de plugin : PURGE bete 2     (−30 Corruption mais +10 Errance)
◆ Commande de plugin : PURGE errant 2   (−30 Errance mais −2 lucidité)
◆ Commande de plugin : PURGE dement 2   (+3 lucidité mais +10 Corruption)
```

### 7.5 — Cinématique en images
```
◆ Commande de plugin : CINE duel                       (le duel pixel-art inclus)
◆ Commande de plugin : CINE jouer maScene 12 120       (img/pictures/maScene_01..12, 120 ms/frame)
```
Letterbox auto, joueur figé. Images 88-90 réservées.

### 7.6 — Choix moral générique (Pensée)
```
◆ Commande de plugin : PENSEE      (affiche une question morale/introspective)
```

### 7.7 — Basculer jour / nuit
```
◆ Commande de plugin : TEMPS nuit       (module le Mana : Positif faible la nuit…)
◆ Commande de plugin : TEMPS basculer
```

### 7.8 — Forcer une chute (mise en scène scénarisée)
```
◆ Commande de plugin : CHUTEDEF forcer bete 2     (Korrah devient la Bête — DÉFINITIF)
```

---

# 8. QUÊTES

### 8.1 — Quête principale
```
◆ Commande de plugin : QUEST add main chap1 Le_Réveil L'aventure_commence.
◆ Commande de plugin : QUEST track chap1
```
(`main` = quête principale ; `chap1` = identifiant ; puis titre et description en un mot ou avec `_`.)

### 8.2 — Quête secondaire avec objectifs
```
◆ Commande de plugin : QUEST add side herbe La_cueilleuse Ramène_3_herbes.
◆ Commande de plugin : QUEST obj herbe Trouver_l'herboriste
◆ Commande de plugin : QUEST obj herbe Cueillir_3_herbes
```
Cocher un objectif fait (le prochain non fait) : `QUEST step herbe` — ou par numéro : `QUEST step herbe 2`.

### 8.3 — Terminer / rater une quête
```
◆ Commande de plugin : QUEST done herbe     (réussie)
◆ Commande de plugin : QUEST fail herbe     (ratée)
```

### 8.4 — Ouvrir le journal
```
◆ Commande de plugin : QUEST ecran
```

---

# 9. SUCCÈS & TITRES

### 9.1 — Débloquer un succès
```
◆ Commande de plugin : SUCCES unlock 5
```

### 9.2 — Ouvrir l'écran des succès
```
◆ Commande de plugin : SUCCES ecran
```

---

# 10. FACTIONS

### 10.1 — Rejoindre / quitter une faction
```
◆ Commande de plugin : FACTION join etoiles     (etoiles/jada · vultric/empire · culte/voix/ames · libre/affranchis)
◆ Commande de plugin : FACTION quit
```

### 10.2 — Voir les factions
```
◆ Commande de plugin : FACTION ecran
```

---

# 11. LIENS SOCIAUX

### 11.1 — Renforcer un lien
```
◆ Commande de plugin : LIEN up 2 1      (+1 lien avec Korrah)
◆ Commande de plugin : LIEN set 2 5     (fixe le lien à 5)
```

### 11.2 — Écran des liens
```
◆ Commande de plugin : LIEN ecran
```

---

# 12. CHRONIQUE DU MONDE (mémoire persistante)

### 12.1 — Fixer l'état d'une région
```
◆ Commande de plugin : CHRONIQUE region Valombre etat En_ruines 3
```

### 12.2 — Réputation de faction / note / PNJ
```
◆ Commande de plugin : CHRONIQUE faction empire 10       (+10 de réputation)
◆ Commande de plugin : CHRONIQUE pnj anna Devenue_marchande
◆ Commande de plugin : CHRONIQUE note Le_pont_de_Valombre_s'est_effondré.
◆ Commande de plugin : CHRONIQUE flag pont_detruit 1
```

### 12.3 — Consulter la chronique
```
◆ Commande de plugin : CHRONIQUE ecran
```

---

# 13. CHUTES — MISE EN SCÈNE

### 13.1 — Jouer une chute visible
```
◆ Commande de plugin : CHUTE errant 3     (englouti par sa marque, 3 vagues)
◆ Commande de plugin : CHUTE bete 2        (silhouette de la Bête, sprite change)
◆ Commande de plugin : CHUTE fond          (l'Œil plein écran + mode BROKENSCRIPT)
◆ Commande de plugin : CHUTE calme         (couper) · CHUTE reprendre (relancer)
```

### 13.2 — Chutes définitives (perte réelle)
```
◆ Commande de plugin : CHUTEDEF on                (activer le système)
◆ Commande de plugin : CHUTEDEF forcer dement 4   (Vesper part en riant — définitif)
```

### 13.3 — Hallucinations avant la chute
```
◆ Commande de plugin : CHUTEHALL on
```

### 13.4 — Esthétique analog-horror (VHS)
```
◆ Commande de plugin : CHUTEVHS on
◆ Commande de plugin : CHUTEVHS burst          (pic de distorsion)
◆ Commande de plugin : CHUTEVHS niveau 60      (intensité 0-100)
```

### 13.5 — Musiques de chute générées
```
◆ Commande de plugin : CHUTELAC voie errant 80    (mélodie de l'Errant à 80 %)
◆ Commande de plugin : CHUTELAC intensite 50
◆ Commande de plugin : CHUTELAC stop
```

### 13.6 — Le Mur / le Fond (réalité déforme)
```
◆ Commande de plugin : MUR forcer      (force la déformation) · MUR off (couper)
```

### 13.7 — Plonger volontairement dans le Lac
```
◆ Commande de plugin : PLONGER      (descends d'un palier) · REMONTER
```

---

# 14. FUSION · DOMAINE · MUE · ULTIME (déclenchement scénarisé)

### 14.1 — Entrer/sortir de Fusion
```
◆ Commande de plugin : FUSION chair 1     (Aël entre en Chair d'Âme)
◆ Commande de plugin : FUSION fin 1
```

### 14.2 — Déployer le Royaume Impérial (ludwing)
```
◆ Commande de plugin : DOMAINE ouvrir 3   (toutes les âmes reviennent)
◆ Commande de plugin : DOMAINE fermer 3
```

### 14.3 — Ultime signature
```
◆ Commande de plugin : ULTIME convergence 1    (mue 2 · parole 4)
◆ Commande de plugin : ULTIME fin 1
```

### 14.4 — Mue maîtrisée (Bête à volonté)
```
◆ Commande de plugin : MUE forcer 2     (Korrah se transforme) · MUE fin 2
```

### 14.5 — Cinématique d'ultime (visuel seul)
```
◆ Commande de plugin : ULTI       (ou JACKPOT / AURA / BURST)
```

---

# 15. DIFFICULTÉ & NEW GAME+

### 15.1 — Régler la difficulté
```
◆ Commande de plugin : DIFFICULTE elden     (histoire | normal | elden | cauchemar)
```

### 15.2 — New Game +
```
◆ Commande de plugin : NGPLUS
```

### 15.3 — Choix du marqué de départ
```
◆ Commande de plugin : DEBUT
```

---

# 16. HUD & VISUEL (MOG)

### 16.1 — Boussole vers une cible
```
◆ Commande de plugin : compass_event_id 12     (pointe vers l'événement 12)
◆ Commande de plugin : show_compass  /  hide_compass
```

### 16.2 — Météo / climat
```
◆ Commande de plugin : weather rain 5     (pluie, force 5) · clear_weather
◆ Commande de plugin : battle_weather     (climat aussi en combat)
```

### 16.3 — Indicateur au-dessus d'un événement
```
◆ Commande de plugin : indicator 12           (icône animée sur l'event 12)
◆ Commande de plugin : text_indicator 12 !    (une bulle de texte)
◆ Commande de plugin : hide_indicator 12
```

### 16.4 — Ombre / traînée / éclats de sprite
```
◆ Commande de plugin : shadow_event_id 0       (ombre sous l'event courant)
◆ Commande de plugin : gtrail_player_id        (traînée fantôme du joueur)
◆ Commande de plugin : shatter_event_id 12     (éclatement d'un sprite)
```

### 16.5 — HUD d'or / trésors / variable
```
◆ Commande de plugin : show_gold_hud  /  hide_gold_hud
◆ Commande de plugin : show_treasure_hud
◆ Commande de plugin : show_variable_hud
```

### 16.6 — Filtre graphique (Pixi)
```
◆ Commande de plugin : filter_effect blur 4    (flou) · filter_clear
```

---

# 17. OUVRIR CHAQUE ÉCRAN (aide-mémoire)

| Tu veux ouvrir… | Commande |
|---|---|
| Le hub qui regroupe tout | `GRIMOIRE` |
| Le codex du lore & des règles | `CODEX` |
| Le triangle des sources | `TRIANGLE` |
| Les 9 Voies | `VOIES` |
| Le guide Voies & Paroles | `GUIDEVP` |
| Les rangs D→S | `RANGS` |
| La lecture de marque | `MARQUE` |
| La fiche du marqué | `FICHE` |
| Les Portes (entraînement) | `PORTES` |
| Corruption / Errance | `CORRUPTION ecran` / `ERRANCE ecran` |
| Santé mentale (4 jauges) | `AME` |
| Les vies parallèles | `DESTINS ecran` / `VIES` |
| Le bestiaire | `BESTIAIRE` |
| La forge / le sanctuaire / l'alchimie | `FORGE` / `SANCTUAIRE` / `ALCHIMIE` |
| Le journal de quêtes | `QUEST ecran` |
| Les succès | `SUCCES ecran` |
| Les factions | `FACTION ecran` |
| Les liens | `LIEN ecran` |
| La chronique du monde | `CHRONIQUE ecran` |
| L'atelier de test (playtest) | `ATELIER` |

---

# 18. RECETTES AVANCÉES (assemblages complets)

> Ici on combine plusieurs systèmes. Interrupteurs déjà **réservés & nommés** dans l'éditeur (utilise-les) :
> 4 « combat boss1 » · 8 « combat de boss 2 » · 10 « PHASE 2 » · 11 « victoir joueur » ·
> 41 Porte de Fusion · 42 HUD Triangle · 43 faux combat ·
> 95 Chute le Déchiré (ennemi 407) · 96 l'Errant · 97 la Bête · 98 le Dément · 99 le Fond (20 Reprises).

## 18.1 — Boss MULTI-PHASES (une seule troupe, il se transforme)
Dans **Base ▸ Groupes**, choisis la troupe du boss, puis onglet **Événements de combat**. Crée des pages :

```
— PAGE 1 —  Condition : (aucune)   Portée : Début de la bataille
◆ Texte : « Tu oses lever les yeux sur moi ? »

— PAGE 2 —  Condition : PV de l'ennemi #1 ≤ 50 %   Portée : Bataille (une seule fois)
◆ Texte : « Assez joué. »
◆ Transformer un ennemi : #1 → « Le Fléau — Second Stade »   (choisis l'ennemi phase 2)
◆ Interrupteur : 10 (PHASE 2) = ON
◆ Commande de plugin : CHUTEVHS burst          (secousse visuelle de bascule)

— PAGE 3 —  Condition : Interrupteur 10 ON  ET  PV de l'ennemi #1 ≤ 20 %   Portée : Tour
◆ Forcer une action : #1 utilise « la Convergence » sur tout le groupe
◆ Texte : « Regarde ce que tu m'as forcé à devenir. »
```
Astuces :
- L'ennemi phase 2 est un **ennemi distinct** (Base ▸ Ennemis) avec ses stats/skills — la transformation garde le % de PV.
- Pour un vrai « enrage », page condition **Tour ≥ 8** → `Forcer une action` sur un skill `<Interdit: 2.5>`.
- Boss « signature » : mets `<TraitBoss: Nom|regard>` sur l'ennemi (il ne rate jamais en phase finale).
- Musique par phase : page 2 → `CHUTELAC voie bete 70` ; à la victoire, interrupteur **11** (victoir joueur) ON.

## 18.2 — QUÊTE À EMBRANCHEMENTS (deux camps, deux fins)
```
— DÉBUT (PNJ donneur de quête) —
◆ Commande de plugin : QUEST add main pont Le_Pont_de_Valombre Choisis_un_camp.
◆ Commande de plugin : QUEST obj pont Parler_à_l'Empire
◆ Commande de plugin : QUEST obj pont Parler_aux_Affranchis
◆ Commande de plugin : QUEST track pont

— PNJ EMPIRE —  (condition : quête active)
◆ Afficher choix : Rejoindre l'Empire / Refuser
  ◆ Si Rejoindre l'Empire :
      ◆ Commande de plugin : FACTION join empire
      ◆ Commande de plugin : CHRONIQUE faction empire 15
      ◆ Interrupteur : (crée « camp_empire ») = ON
      ◆ Commande de plugin : QUEST step pont 1        (coche le 1er objectif)

— PNJ AFFRANCHIS —  (symétrique)
  ◆ Si Rejoindre : FACTION join libre · CHRONIQUE faction empire -10 · interrupteur « camp_libre » ON · QUEST step pont 2

— RÉSOLUTION (garde du pont) —
◆ Si (interrupteur camp_empire) : Texte « L'Empire te laisse passer. » · QUEST done pont
◆ Sinon si (camp_libre) :         Texte « Les Affranchis ont saboté le pont. » · combat · QUEST done pont
◆ Sinon :                          Texte « Reviens quand tu auras choisi. »
◆ Commande de plugin : CHRONIQUE note Le_joueur_a_tranché_à_Valombre.
```
Variante « échec » : si le joueur trahit son camp → `QUEST fail pont` + `CHRONIQUE faction empire -30`.

## 18.3 — DONJON COMPLET (checkpoint, chutes, gardien, récompense)
Assemble sur une carte de donjon :

**A) À l'entrée — le feu de repos (checkpoint)**
```
◆ Commande de plugin : FEU set                (pose le checkpoint)
◆ Afficher choix : Se reposer / Continuer
  ◆ Si Se reposer : Commande de plugin : FEU repos
```
**B) Dans les couloirs — pièges de chute (par région)**
Peins une **région** (ex. 7) sur les cases dangereuses, puis un événement parallèle qui lit la région du joueur :
```
◆ Si (Script) : $gamePlayer.regionId() === 7
    ◆ Si (Script) : Errance.niveau(1) >= 70
        ◆ Commande de plugin : CHUTE errant 1     (la marque affleure — avertissement visible)
    ◆ Commande de plugin : ERRANCE add 1 5
```
**C) Salle du gardien — le boss (voir 18.1)**
```
◆ Interrupteur : 4 (combat boss1) = ON
◆ Lancer le combat : troupe du gardien (multi-phases)
◆ Après victoire (interrupteur 11 victoir joueur ON) :
    ◆ Objet : +1 clé du donjon
    ◆ Commande de plugin : SUCCES unlock 7
    ◆ Commande de plugin : CHRONIQUE region Donjon etat Purifié 0
```
**D) Sortie — la conséquence**
```
◆ Si (Script) : Corruption.niveau(1) >= 100
    ◆ Commande de plugin : CHUTEDEF forcer bete 1     (le donjon a eu raison de lui)
◆ Sinon
    ◆ Commande de plugin : PORTES xp 1 corps 100       (récompense d'entraînement)
```

## 18.4 — RENCONTRE D'UN HÉROS CHUTÉ, branchée sur le vrai type de chute
```
◆ Appeler un événement commun : 202     (Korrah — fait tout : lit Destins.chute, recrute OU combat)
```
Ou à la main, avec les interrupteurs réservés :
```
◆ Si (Script) : Destins.chute(2) === 'bete'
    ◆ Interrupteur : 97 (Chute la Bête) = ON
    ◆ Lancer le combat : troupe 505 (Korrah, la Bête)
◆ Sinon si (Script) : Destins.chute(2) === ''
    ◆ Script : $gameParty.addActor(2)
```

## 18.5 — ÉVÉNEMENT DE COMBAT GLOBAL (tous les combats)
`YEP_BaseTroopEvents` est activé : la **troupe #1** sert de modèle appliqué à TOUS les combats.
Mets-y, par exemple, une page « Début de bataille » :
```
◆ Commande de plugin : ELEMENTS        (active les popups de dégâts teintés partout)
```

## 18.6 — PACTE + PRIX DIFFÉRÉ (le pouvoir qui revient te hanter)
```
— Au moment du pacte —
◆ Commande de plugin : REINE pacte 3
◆ Variable : (crée « dette_reine ») = 3

— Plus tard, à un point de repos —
◆ Si (Variable dette_reine ≥ 3)
    ◆ Texte : « La Reine réclame son dû. »
    ◆ Commande de plugin : ERRANCE add 3 15
    ◆ Commande de plugin : CHUTEHALL on
```

---

# 19. CHUTES & HORREUR — TOUT LE RESTE

### 19.1 — Faire chuter un héros (Codex_Chutes, le plugin unifié)
```
◆ Commande de plugin : DEMENT chute 4      (Vesper croit rester lui-même — il ne l'est plus)
◆ Commande de plugin : BETE chute 2         (Korrah : la laisse lâche — sa bête selon l'ID)
◆ Commande de plugin : ERRANT chute 3       (ludwing : on voit au travers de ses mains)
◆ Commande de plugin : DEMENT ancrage 4     (le raccrocher au réel — annule la dérive)
```

### 19.2 — Contagion de la chute (ContagionAme)
```
◆ Commande de plugin : CONTAGION on     (un héros trop enfoncé contamine les autres) · CONTAGION off
```

### 19.3 — Combats-hallucination du Dément (DementInterne)
```
◆ Commande de plugin : HALLUCO on        (combats sans butin ni XP quand l'esprit ment) · HALLUCO off
◆ Commande de plugin : DEMENTINT on      (active le module) · DEMENTINT off
```

### 19.4 — Chasseurs d'âme (ChasseursAme)
```
◆ Commande de plugin : CHASSE on              (à corruption/errance hautes, on te traque)
◆ Commande de plugin : CHASSE force bete      (déclenche une embuscade tout de suite)
◆ Commande de plugin : CHASSE off             (zone sûre : voir <SafeZone> §26)
```

### 19.5 — L'interface qui ment (TheatreDement)
```
◆ Commande de plugin : THEATRE on      (faux PV, faux menus quand l'esprit sombre) · THEATRE off
```

### 19.6 — Jade exploite la faille (JadeRegard)
```
◆ Commande de plugin : REGARD whisper      (un murmure)      REGARD glitch   (glitch écran)
◆ Commande de plugin : REGARD error         (fausse erreur)   REGARD title    (le titre murmure)
◆ Commande de plugin : REGARD hp            (touche à la barre de vie)
```

### 19.7 — Jade se souvient de tes parties (JadeMemoire)
```
◆ Commande de plugin : MEMOIRE greet             (elle t'accueille selon tes parties passées)
◆ Commande de plugin : MEMOIRE record_ending 3   (enregistre la fin obtenue)
◆ Commande de plugin : MEMOIRE flag pacte_reine  (mémorise un fait entre parties)
◆ Commande de plugin : MEMOIRE store_runs / store_kills / defeat_jade / forget
```

### 19.8 — Rêver au repos (RevesFeuAme)
```
◆ Commande de plugin : REVE 1        (le héros rêve — celui dont la chute est la plus proche)
◆ Commande de plugin : FEUAME repos  (repos au Feu d'Âme + rêve)   (alias : FEU repos)
```

---

# 20. LE REGARD — LIRE UNE ÂME (LeRegard)
Lire le PNJ/ennemi en face (sa nature, sa marque, ses mensonges) :
```
◆ Commande de plugin : REGARD             (lit l'événement juste en face du héros)
◆ Commande de plugin : REGARD event 12    (lit un événement précis par son ID)
```
Ce qu'il lit vient des notes de l'événement : `<Nom: ...>`, `<Verite: ...>`, `<Menteur>`, `<Marque: fêlée>`, `<Mur: ...>`.
```
Note d'un PNJ menteur :
  <Nom: Le marchand souriant>
  <Menteur>
  <Verite: Il a vendu son frère aux Errants.>
```

---

# 21. LUDWING — COPIER LES TECHNIQUES ENNEMIES (LouCopySystem)
```
◆ Commande de plugin : LOU copies            (affiche les techniques copiées, 4 slots)
◆ Commande de plugin : LOU add_copy 66       (copie manuellement la compétence 66)
◆ Commande de plugin : LOU clear_copies      (vide les slots)
```
En combat, ludwing copie les techniques ennemies automatiquement (2× de suite) — ces commandes servent à scénariser ou déboguer.

---

# 22. KORRAH — LA CONCENTRATION (Neyssa_Concentration)
```
◆ Commande de plugin : NEYSSA_CONC reset_counters      (remet les compteurs à zéro)
◆ Commande de plugin : NEYSSA_CONC set_evasion 3       (fixe le compteur d'esquives)
◆ Commande de plugin : NEYSSA_CONC set_shockwave 2     (fixe le compteur d'ondes de choc)
```

---

# 23. LES PACTES DE LA REINE — AU SANCTUAIRE (PactesAldebaran)
```
◆ Commande de plugin : PACTE         (ouvre l'écran des pactes au sanctuaire)
◆ Commande de plugin : PACTE oubli   (renonce à un pacte)
```
> À distinguer du pacte scénarisé direct : `REINE pacte 3` (§7.2), qui applique le prix tout de suite.

---

# 24. TUTORIELS CONTEXTUELS (PremiersPas)
```
◆ Commande de plugin : TUTOS reset   (tout revoir depuis le début)
◆ Commande de plugin : TUTOS off     (couper les tutos) · TUTOS on (réactiver)
```
La 1re fois qu'un système touche le joueur (1re corruption, 1re Voie, 1er Surpassé…), deux lignes l'expliquent, une seule fois.

---

# 25. BOSS & ENTITÉS SIGNATURES (notetags — déjà câblés)
Mets le bon tag dans la **Note de l'ennemi** :
| Notetag | Entité |
|---|---|
| `<Gaster>` | Celui qui est Tombé (canon du Fond) — JadeGaster |
| `<Radahn>` | le Fléau des Astres (Kev / Mahoraga) — KevSignature · MahoragaBoss |
| `<Malenia>` | l'obsession de Jade — JadeObsession |
| `<DonoBoss>` + `<DonoEsprit>` | Dono & son Kamui (le familier = son 2e œil) — DonoKamui |
| `<TraitBoss: Nom\|type>` | trait générique (gel/faim/rupture/renvoi/regard) — CanonPlus (§2.3) |

**Armes/objets signatures** (Note de l'arme/objet) :
```
<Signature: arc>         (arc créatif)      <Signature: flammes>   (flammes maudites)
<Signature: forteresse>  (forteresse d'âme) <Signature: nova>      (nova sainte)
<Signature: abime>       (puits d'abîme)    <Signature: vague>     (vague sacrée)
```

---

# 26. AFFINITÉS, CAMPS, ROUE, ZONES (notetags — aide-mémoire complet)
| Notetag | Sur | Effet |
|---|---|---|
| `<Mana: positif\|negatif\|spirituelle\|sombre\|pur\|semiparfait>` | acteur/classe/ennemi | affinité principale |
| `<Mana2: …>` | idem | seconde affinité |
| `<Atone>` | idem | sans affinité (recul vital ÷2) |
| `<NoAura>` | idem | pas d'aura calculée |
| `<Camp: lumiere\|ombre>` | idem | camp (sorts 14/15 : ×1.5 vs opposé) |
| `<VoieDefaut: forge…>` | idem | Voie par défaut |
| `<Faction: nom>` | idem | couleur/appartenance de faction |
| `<RoueElem: 8>` | skill/ennemi | force un élément sur la roue |
| `<ReculVital: 20>` | skill | recul PV forcé à 20 % |
| `<NoParole>` | skill | ce skill n'est jamais « parlé » |
| `<SafeZone>` | événement/carte | zone sûre (pas de chasseurs) |
| `<Cache>` | événement | caché sauf en plongée |
| `<NoRead>` | carte/zone | le monde ne « lit » pas ici |
| `<Envers>` | événement | n'existe que côté Envers |
| `<Chase: n>` | événement | poursuit le joueur (rayon n) |

---

# 27. TABLE DE COUVERTURE — chaque commande → sa recette
> Preuve qu'il ne manque rien : les 105 plugins à commande, rangés vers leur recette.

| Commande | Recette | Commande | Recette |
|---|---|---|---|
| CORRUPTION | §7.3, §7.4 | ERRANCE | §7.3 |
| PURGE | §7.4 | VOIES / TRIANGLE / RANGS / MARQUE | §17 |
| FUSION | §14.1, §3.8 | ULTIME | §14.3, §3.11 |
| DOMAINE | §14.2 | MUE | §14.4 |
| ULTI/JACKPOT/AURA/BURST | §14.5 | NEYSSA_CONC | §22 |
| PORTES | §17, §18.3 | FICHE | §17 |
| DESTINS / VIES | §17, §18.4 | REINE | §7.2 |
| PACTE | §23 | NOYADE / REPRISES | §17 (script) |
| FORGE / SANCTUAIRE / ALCHIMIE | §17 | GRAVER | §6.5 |
| FEU | §7.3, §18.3 | OBJET | §6.4 |
| LOU | §21 | CHUTE | §13.1 |
| CHUTEDEF | §13.2, §18.3 | CHUTEPROG/HALL | §13.3 |
| CHUTEVHS | §13.4, §18.1 | CHUTELAC | §13.5 |
| DEMENT/BETE/ERRANT | §19.1 | CONTAGION | §19.2 |
| HALLUCO/DEMENTINT | §19.3 | CHASSE | §19.4 |
| MUR | §13.6 | PLONGER/REMONTER | §13.7 |
| THEATRE | §19.5 | REGARD (Jade) | §19.6 |
| MEMOIRE | §19.7 | REVE/FEUAME | §19.8 |
| REGARD (âme) | §20 | PNJ / PNJLIEN | §1.3, §1.4 |
| NPC | §1.2, §8 (PLUGIN_LivingNPC) | CHRONIQUE | §12 |
| LIEN | §11 | QUEST | §8 |
| MAINQUEST | §8 (principale) | SUCCES | §9 |
| FACTION | §10 | DIFFICULTE | §15.1 |
| NGPLUS | §15.2 | DEBUT | §15.3 |
| TUTOS | §24 | TEMPS | §7.7 |
| ELEMENTS | §18.5 | CINE | §7.5 |
| PENSEE | §7.6 | GRIMOIRE/CODEX/BESTIAIRE/AME/GUIDEVP/MANA | §17 |
| ATELIER | §17 | MOG_* (HUD/visuel) | §16 |
| YEP_* (moteur) | FICHE §1.11 | signatures `<Gaster>`… | §25 |

Si une commande n'apparaît pas ici, c'est un **écran** : appelle-la telle quelle (voir §17).

---

> **Voir aussi :** `docs/INDEX.md` (le sommaire de toute la doc),
> `docs/FICHE_COMMANDES_COMPLETE.md` (le catalogue complet des commandes & notetags),
> `docs/PLUGIN_LivingNPC.md` (le plugin PNJ, à fond),
> `docs/GUIDE_DEVELOPPEUR.md` (les systèmes en profondeur, avec tous les chiffres),
> `docs/ORDRE_PLUGINS.md` (⚠️ l'ordre de chargement des plugins).
