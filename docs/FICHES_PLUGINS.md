# FICHES PAR PLUGIN — TOUT, POUR POSER VITE

> **Une mini-fiche pour chaque plugin qui a une commande ou un notetag** (167 plugins sur 279).
> Extrait automatiquement du code. Pour aller vite : repère le plugin, lis la ligne **⚡ pose vite**, copie.
>
> **Comment lire une fiche :**
> - **✅** activé · **⬜** désactivé · **❔** non listé dans `plugins.js` (dépend de ton gestionnaire).
> - **Cmd** = commande(s) de plugin (+ leurs sous-commandes). Se tape dans `Commandes avancées ▸ Commande de plugin`.
> - **Notes** = notetags. Se met dans la case **Note** d'un skill / acteur / classe / ennemi / arme / armure / objet, ou en **Commentaire** d'événement.
> - **⚡** = l'action la plus utile pour poser vite.
>
> Détail complet des arguments : `docs/FICHE_COMMANDES_COMPLETE.md`. Recettes montées : `docs/RECETTES.md`.

---

## 🚀 DÉMARRAGE ÉCLAIR — les commandes que tu poseras le plus
> À coller dans un événement (`Commande de plugin`). Héros = ID 1-4.

```
GRIMOIRE                 → le menu qui regroupe TOUS les écrans
CODEX                    → le livre du lore & des règles (en jeu)
FICHE                    → la fiche complète d'un marqué
FEU repos                → checkpoint souls (repos + sauvegarde)
CORRUPTION purge 1 20    → soigner la corruption   (ERRANCE purge 1 20 pour l'errance)
DIFFICULTE normal        → régler la difficulté (histoire|normal|elden|cauchemar)
QUEST add main q1 Titre  → inscrire une quête      (QUEST ecran pour l'ouvrir)
NPC talk mira            → faire parler un PNJ vivant (voir docs/RECETTES_LivingNPC.md)
REGARD                   → lire l'âme du PNJ en face
TEMPS nuit               → basculer en nuit
```

## 🏷️ LES NOTETAGS QUE TU POSERAS LE PLUS
> À mettre dans la case **Note** de l'objet concerné.

```
Skill   : <Voie: forge>  <Parole>  <FrappeAme>  <Interdit: 1.8>  <Invocation: 3>  <Ultime: convergence>
Acteur  : <Mana: positif>  <Camp: lumiere>  <VoieDefaut: source>  <Trait: verbe>  <Passive State: 40>
Ennemi  : <Rang: S>  <Aura: 4>  <TraitBoss: Nom|faim>  <Chase: 4>
Armure  : <Relic: antirot>  <Relic: lifesteal>
Événement : <NPC: mira>  <Envers>  <SafeZone>
```

---


# 🟣 SYSTÈMES CANON (combat, âmes, progression, écrans)  (64)

### ✅ AlchimieAmes
Alchimie : combine des objets pour en créer de meilleurs.
**Cmd** `ALCHIMIE`  
⚡ `ALCHIMIE`

### ✅ AmbianceCanon
Battement de cœur à Corruption 70+, musique de combat du
**Notes** `<Regard>` `<TraitBoss>`  
⚡ Note : <Regard>

### ✅ AmeSouls
Souls-like : Feu d'Âme (repos + checkpoint) ; la mort
**Cmd** `FEU`  ·  sous-cmd : `repos` `set`  
⚡ `FEU repos|set`

### ✅ AmeStatusScene
Écran/Page visuelle de Santé Mentale (jauges des 4 âmes)
**Cmd** `AME`  
**Notes** `<Mana>` `<Mana2>`  
⚡ `AME`

### ⬜ AtelierTest
Menu de test (playtest seulement) : régler toutes les
**Cmd** `ATELIER`  
⚡ `ATELIER`

### ✅ AuraPaliers
En combat, une AURA visible enveloppe chaque combattant :
**Notes** `<Mana: positif>` `<Mana: negatif>` `<Mana: spirituelle>` `<Mana: pur>` `<Mana:>` `<Mana2:>`  
⚡ Note : <Mana: positif>

### ✅ BestiaireAmes
Bestiaire qui se remplit au combat : stats, affinité de
**Cmd** `BESTIAIRE`  
⚡ `BESTIAIRE`

### ✅ CanonPlus
5 systèmes canon : PURGE (transvaser, jamais effacer),
**Cmd** `PURGE` `GRAVER` `FICHE`  ·  sous-cmd : `bete` `errant` `dement`  
**Notes** `<TraitBoss: Nom|type>`  
⚡ `PURGE bete|errant|dement`

### ✅ ChaseEnemies
Mobs visibles sur la carte : ils errent, te repèrent à vue,
**Notes** `<Chase: 3>` `<Chase:\s*(\d+)>`  
⚡ Note : <Chase: 3>

### ✅ ChroniqueMonde
Le monde SE SOUVIENT : états des nations, réputations de
**Cmd** `CHRONIQUE`  ·  sous-cmd : `region` `faction` `pnj` `flag` `note` `fin` `ecran` `écran`  
⚡ `CHRONIQUE region|faction|pnj`

### ❔ Cinematiques
Joue des séquences d'images (img/pictures) comme des
**Cmd** `CINE`  ·  sous-cmd : `duel` `jouer`  
⚡ `CINE duel|jouer`

### ✅ CodexSources
L'écran CODEX : le lore et les règles expliqués hors
**Cmd** `CODEX`  
⚡ `CODEX`

### ✅ ComboLiens
Combos d'équipe : des compétences spéciales (duo/trio/
**Notes** `<Combo: 1,3>` `<ComboLien: 3>`  
⚡ Note : <Combo: 1,3>

### ❔ CTB_Timers
CT_Bolt's Timer System v1.1
**Notes** `<CTBTimer>`  
⚡ Note : <CTBTimer>

### ❔ CTB_TimersMZ
[RPG Maker MZ] [Tier 1] [Version 1.30] [CT_Bolt - Timer System]
**Notes** `<CTBTimer>`  
⚡ Note : <CTBTimer>

### ✅ DebutMarques
Choisis un des 4 marqués avant de commencer. Les trois
**Cmd** `DEBUT`  
⚡ `DEBUT`

### ✅ DestinsParalleles
Les héros non recrutés CONTINUENT LEUR VIE : leurs jauges
**Cmd** `DESTINS`  ·  sous-cmd : `ecran` `écran` `tick` `pause`  
⚡ `DESTINS ecran|écran|tick`

### ❔ EnemyBook
Displays detailed statuses of enemies.
**Cmd** `EnemyBook`  ·  sous-cmd : `open` `add` `remove` `complete` `clear`  
⚡ `EnemyBook open|add|remove`

### ⬜ FactionsAmes
Rallie une faction (Royaume des Étoiles/Jada · Empire
**Cmd** `FACTION`  ·  sous-cmd : `join` `quit` `ecran`  
⚡ `FACTION join|quit|ecran`

### ✅ ForgeAmes
Forge d'Âmes : dépense tes âmes (var 15) pour renforcer
**Cmd** `FORGE`  
⚡ `FORGE`

### ✅ FrappeAme
<FrappeAme> : le coup traverse chair, armure et mana
**Notes** `<FrappeAme>` `<FrappeAmeEtat: id>`  
⚡ Note : <FrappeAme>

### ✅ FusionMana
La FUSION : fondre deux sources en une. 3 fusions —
**Cmd** `FUSION`  ·  sous-cmd : `fin`  
**Notes** `<FusionChair>` `<Fusion: X>`  
⚡ `FUSION fin`

### ✅ FusionsEtendues
La FUSION est un principe, pas un sort : fondre deux
**Notes** `<Rune>`  
⚡ Note : <Rune>

### ✅ GrimoireHub
UNE entrée de menu « Grimoire » qui regroupe tous les
**Cmd** `GRIMOIRE`  
⚡ `GRIMOIRE`

### ✅ GuideVoiesParoles
Un écran clair qui EXPLIQUE les Voies (ta façon de te
**Cmd** `GUIDEVP`  
⚡ `GUIDEVP`

### ❔ ItemBook
Displays detailed statuses of items.
**Cmd** `ItemBook`  ·  sous-cmd : `open` `add` `remove` `complete` `clear` `item` `weapon` `armor`  
⚡ `ItemBook open|add|remove`

### ✅ JourNuit
Jour/Nuit : teinte l'écran et module le Mana — Positif
**Cmd** `TEMPS`  ·  sous-cmd : `jour` `nuit` `basculer`  
⚡ `TEMPS jour|nuit|basculer`

### ⬜ KevSignature
Kev (<Radahn>) : sa fureur enfle à chaque tour (ATK qui
**Notes** `<Radahn>`  
⚡ Note : <Radahn>

### ✅ LiensSocial
Les Liens : approfondis tes liens avec les 4 héros via
**Cmd** `LIEN`  ·  sous-cmd : `up` `set` `ecran`  
⚡ `LIEN up|set|ecran`

### ✅ LivingNPC
PNJ vivants : dialogues réactifs, rumeurs au courant du
**Cmd** `NPC`  ·  sous-cmd : `talk` `rumeur` `bark` `mute`  
⚡ `NPC talk|rumeur|bark`

### ⬜ LOU_HakariJackpot
Système de Jackpot "Pari Mortel" optimisé pour Lou (Compatible YEP_X_BattleSysCTB).
**Cmd** `HakariJackpot`  ·  sous-cmd : `Start`  
⚡ `HakariJackpot Start`

### ✅ LouCopySystem
Lou : copie les techniques ennemies (2x de suite), 4 slots
**Cmd** `LOU`  ·  sous-cmd : `copies` `clear_copies` `add_copy`  
⚡ `LOU copies|clear_copies|add_copy`

### ✅ MahoragaBoss
Boss Mahoraga v2 – Maître des Arts Martiaux Évolutif
**Notes** `<Radahn>`  
⚡ Note : <Radahn>

### ✅ MainQuests
Inscrit la quête principale (6 chapitres) dans le Journal
**Cmd** `MAINQUEST`  
⚡ `MAINQUEST`

### ✅ MaitriseVoies
Les 5 Voies de la Maîtrise (Corps) : Forge, Onde, Source,
**Cmd** `VOIES`  
⚡ `VOIES`

### ✅ ManaAffinity
CORPS (Maîtrise) : recul PV du Mana Sombre(source)/Négatif
**Notes** `<ReculVital: 20>` `<ReculVital: N>`  
⚡ Note : <ReculVital: 20>

### ⬜ ManaCodex
Codex du Système de Mana (lisible en jeu, multi-pages)
**Cmd** `MANA`  
**Notes** `<FrappeAme>`  
⚡ `MANA`

### ✅ ManaVisualEX
MAJ visuelle : barres de stats ANIMÉES + comptage, badge
**Notes** `<Mana: ...>`  
⚡ Note : <Mana: ...>

### ✅ MarqueVivante
« Lire une marque, c'est lire où en est une âme » : un
**Cmd** `MARQUE`  
⚡ `MARQUE`

### ✅ MueMaitrisee
Maîtriser la Mue : transforme-toi en Bête à volonté en
**Cmd** `MUE`  ·  sous-cmd : `forcer` `fin`  
**Notes** `<Mue>` `<MueFin>` `<MueSkill>`  
⚡ `MUE forcer|fin`

### ✅ NewGamePlus
New Game + : recommence l'aventure en gardant niveaux,
**Cmd** `NGPLUS`  
⚡ `NGPLUS`

### ✅ Neyssa_Concentration
Système de Concentration de Korrah
**Cmd** `NEYSSA_CONC`  ·  sous-cmd : `reset_counters` `set_evasion` `set_shockwave`  
⚡ `NEYSSA_CONC reset_counters|set_evasion|set_shockwave`

### ✅ ObjetEveille
L'Objet Spirituel prend une voix : il commente en combat,
**Notes** `<Eveil>`  
⚡ Note : <Eveil>

### ✅ ObjetSpirituel
L'Objet Spirituel : l'arme de départ de chaque héros évolue
**Cmd** `OBJET`  
⚡ `OBJET`

### ⬜ Pensees
Affiche une « Pensée » : une question morale/introspective
**Cmd** `PENSEE`  
⚡ `PENSEE`

### ✅ PNJVivantsPlus
8 outils PNJ : réactions aux jauges, rumeurs des vies
**Cmd** `PNJ` `PNJLIEN`  ·  sous-cmd : `react` `rumeur` `fond` `graveur` `destin` `soigner` `lire`  
**Notes** `<Envers>`  
⚡ `PNJ react|rumeur|fond`

### ✅ PortesProgression
« Le secret n'est pas de maxer une voie, mais d'entraîner
**Cmd** `PORTES`  ·  sous-cmd : `ecran` `écran` `xp`  
**Notes** `<FrappeAme>`  
⚡ `PORTES ecran|écran|xp`

### ✅ PremiersPas
La PREMIÈRE fois qu'un système se déclenche (corruption,
**Cmd** `TUTOS`  ·  sous-cmd : `reset` `off`  
⚡ `TUTOS reset|off`

### ✅ QuestJournal
Journal de quêtes (principale & secondaires) : objectifs,
**Cmd** `QUEST`  ·  sous-cmd : `add` `obj` `step` `done` `fail` `track` `untrack` `ecran`  
⚡ `QUEST add|obj|step`

### ✅ RangsPuissance
L'échelle de l'Ordre d'Or : rang D→S calculé sur les
**Cmd** `RANGS`  
**Notes** `<Rang: X>` `<Rang: astre>` `<Rang: D|C|B|A|S|astre>`  
⚡ `RANGS`

### ✅ RelicPassifs
Passifs uniques des reliques équipées (notetag <Relic: x>) :
**Notes** `<Relic: x>` `<Relic: lifesteal>` `<Relic: lowhp>` `<Relic: thorns>` `<Relic: soulgain>` `<Relic: firstaid>`  
⚡ Note : <Relic: x>

### ✅ Resonance
La Résonance : deux héros à Lien élevé se synchronisent en
**Notes** `<Resonance>` `<ResonanceUlt>` `<ResonanceFin>`  
⚡ Note : <Resonance>

### ✅ RevesFeuAme
Au repos, tu rêves. Le héros dont la Chute est la plus
**Cmd** `REVE` `FEUAME` `FEU`  
⚡ `FEU`

### ✅ RoyaumeImperial
Le Domaine de ludwing : toutes les âmes reviennent, toutes
**Cmd** `DOMAINE`  ·  sous-cmd : `ouvrir` `fermer`  
**Notes** `<SceauMagie>` `<ContreTotale>` `<RoyaumeImperial>`  
⚡ `DOMAINE ouvrir|fermer`

### ✅ SanctuaireAmes
Sanctuaire d'Âmes : dépense tes âmes (var 15) pour
**Cmd** `SANCTUAIRE`  
⚡ `SANCTUAIRE`

### ✅ SoulsDifficulty
Difficulté souls (Histoire/Normal/Elden/Cauchemar) : ennemis
**Cmd** `DIFFICULTE`  
⚡ `DIFFICULTE`

### ✅ SuccesTitres
Succès débloquables avec écran dédié + entrée menu.
**Cmd** `SUCCES`  ·  sous-cmd : `unlock` `ecran`  
⚡ `SUCCES unlock|ecran`

### ✅ TraitsAme
Le TRAIT : le don unique que l'âme offre à la naissance.
**Notes** `<Trait: rupture>` `<Trait: gel>` `<Trait: porte>` `<Trait: verbe>`  
⚡ Note : <Trait: rupture>

### ✅ TriangleAffinites
Écran-triangle Esprit/Corps/Âme : montre où chaque héros
**Cmd** `TRIANGLE`  ·  sous-cmd : `hud`  
⚡ `TRIANGLE hud`

### ✅ UltiCinematics
Rework visuel ANIME : bobines de Jackpot, cut-in cinematique
**Cmd** `ULTI` `JACKPOT` `AURA` `BURST`  
**Notes** `<Ulti>` `<Ulti: Domaine Infini>` `<UltiColor: #ff3366>` `<StateFX>` `<StateFX: burst>` `<StateFXColor: #0ff>`  
⚡ `ULTI`

### ✅ UltimesSources
Les ultimes d'Aël (la Convergence), Korrah (la Mue
**Cmd** `ULTIME`  ·  sous-cmd : `fin`  
**Notes** `<Ultime: convergence>` `<Ultime: mue>` `<Ultime: parole>`  
⚡ `ULTIME fin`

### ✅ ViesParalleles
Chaque héros absent agit selon SA personnalité (IA à
**Cmd** `VIES`  
⚡ `VIES`

### ✅ VisualMaxEX
Popups de degats TEINTES par element (feu=rouge...) + ecran
**Cmd** `ELEMENTS`  
⚡ `ELEMENTS`

### ❔ WeaponSkill
Change skill id of attack for each weapon.
**Notes** `<skill_id:3>`  
⚡ Note : <skill_id:3>


# 👁 CHUTES, CORRUPTION & HORREUR  (24)

### ✅ ChasseursAme
La suite du « Monde te Lit » : à corruption/errance hautes,
**Cmd** `CHASSE`  ·  sous-cmd : `off` `force`  
**Notes** `<SafeZone>`  
⚡ `CHASSE off|force`

### ⬜ ChutesAnalogHorror
Esthétique ANALOG HORROR : l'écran devient une vieille
**Cmd** `CHUTEVHS`  ·  sous-cmd : `off` `burst` `niveau`  
⚡ `CHUTEVHS off|burst|niveau`

### ✅ ChutesCinematiques
Les Chutes deviennent VISIBLES : l'Errant englouti par sa
**Cmd** `CHUTE`  ·  sous-cmd : `errant` `bete` `fond` `calme` `reprendre`  
⚡ `CHUTE errant|bete|fond`

### ✅ ChutesDefinitives
Les Chutes sont DÉFINITIVES : la Bête et le Dément
**Cmd** `CHUTEDEF`  ·  sous-cmd : `off` `forcer`  
⚡ `CHUTEDEF off|forcer`

### ✅ ChutesHallucinations
Avant la Chute, on hallucine — de plus en plus. L'ERRANT
**Cmd** `CHUTEHALL`  ·  sous-cmd : `off`  
⚡ `CHUTEHALL off`

### ⬜ ChutesLacMusique
30 mélodies GÉNÉRÉES en direct, une horreur par Chute :
**Cmd** `CHUTELAC`  ·  sous-cmd : `play` `voie` `theme` `intensite` `stop` `auto`  
⚡ `CHUTELAC play|voie|theme`

### ✅ ChutesProgression
Les changements d'écran des Chutes sont PROGRESSIFS : au
**Cmd** `CHUTEPROG`  ·  sous-cmd : `off`  
⚡ `CHUTEPROG off`

### ✅ Codex_Chutes
Les 4 chutes en UN plugin : Dément (il croit rester),
**Cmd** `DEMENT` `BETE` `ERRANT`  ·  sous-cmd : `chute` `ancrage`  
**Notes** `<ErrantTombe>`  
⚡ `BETE chute|ancrage`

### ✅ ContagionAme
La Chute est contagieuse : un héros enfoncé dans sa
**Cmd** `CONTAGION`  ·  sous-cmd : `off`  
⚡ `CONTAGION off`

### ✅ CorruptionAme
Abuser du Mana Sombre/Négatif corrompt l'âme : jauge de
**Cmd** `CORRUPTION`  ·  sous-cmd : `purge` `add` `ecran`  
**Notes** `<Relic: antirot>`  
⚡ `CORRUPTION purge|add|ecran`

### ✅ DementInterne
Complète le Dément : combats-hallucinations sans butin ni
**Cmd** `HALLUCO` `DEMENTINT`  ·  sous-cmd : `off`  
⚡ `HALLUCO off`

### ✅ Errance
Consommer/ACCUMULER des âmes fait enfler la jauge d'ERRANCE :
**Cmd** `ERRANCE`  ·  sous-cmd : `ecran` `écran` `purge` `add`  
**Notes** `<Mana: ame>`  
⚡ `ERRANCE ecran|écran|purge`

### ✅ JadeEntitePlunging
Santé Mentale de l'Âme — Jauge de Maîtrise (5 phases)
**Cmd** `AME`  ·  sous-cmd : `bon` `mauvais` `gain` `set` `absorber` `absorb` `reset_coups` `fin` `ending`  
⚡ `AME bon|mauvais|gain`

### ⬜ JadeGaster
Boss secret "style Gaster" : entrée glitchée, Gaster Blasters,
**Notes** `<Gaster>`  
⚡ Note : <Gaster>

### ✅ JadeMemoire
Jade se SOUVIENT de tes parties precedentes (hors sauvegarde) :
**Cmd** `MEMOIRE`  ·  sous-cmd : `greet` `record_ending` `defeat_jade` `flag` `store_runs` `store_kills` `forget`  
**Notes** `<JadeMemoire>`  
⚡ `MEMOIRE greet|record_ending|defeat_jade`

### ✅ JadeObsession
Boss IA ENDGAME (Niv 80) : L'Obsession de Jade avec Plunging Méta, IA Mentale et Screamers Visuels.
**Notes** `<Malenia>`  
⚡ Note : <Malenia>

### ❔ JadeObsession (1)
Boss IA ENDGAME (Niv 80) : L'Obsession de Jade avec Plunging Méta, IA Mentale et Screamers Visuels.
**Notes** `<Malenia>`  
⚡ Note : <Malenia>

### ✅ JadeRegard
Quand l'esprit d'un heros s'effondre, Jade exploite la faille
**Cmd** `REGARD`  ·  sous-cmd : `whisper` `glitch` `error` `title` `hp`  
⚡ `REGARD whisper|glitch|error`

### ✅ JadeRework
Boss secret le plus dur : à sa "mort", Jade Primordiale
**Notes** `<JadePrime>` `<JadeSecond>`  
⚡ Note : <JadePrime>

### ✅ LeMur
Aux profondeurs du Lac (le Mur, le Fond), la réalité se
**Cmd** `MUR`  ·  sous-cmd : `off` `forcer`  
⚡ `MUR off|forcer`

### ✅ LeRegard
Le Regard : lis l'âme de tout PNJ/ennemi — sa nature, sa
**Cmd** `REGARD`  
**Notes** `<Marque: fêlée>` `<Menteur>` `<Marque: x>` `<Marque:\s*([^>` `<Mur:\s*([^>`  
⚡ `REGARD`

### ✅ PactesAldebaran
Prie la Reine Oubliée à ses sanctuaires : un pouvoir
**Cmd** `PACTE`  ·  sous-cmd : `oubli`  
⚡ `PACTE oubli`

### ✅ PlongerLac
Plonge volontairement dans le Lac : descends d'un palier de
**Cmd** `PLONGER` `REMONTER`  ·  sous-cmd : `off`  
**Notes** `<Cache>`  
⚡ `PLONGER off`

### ✅ TheatreDement
Quand l'esprit sombre, l'interface MENT : faux PV, faux
**Cmd** `THEATRE`  ·  sous-cmd : `off`  
⚡ `THEATRE off`


# 📖 LORE (affinités, camps, signatures, miroirs)  (24)

### ✅ Lore_AffiniteAlignes
[Lore 08/50] Acteur <Mana: x> SANS <Mana2> et SANS <Atone> : +20% degats dans sa source, -20% dans les autres sources (hors physiq
**Notes** `<Mana: x>` `<Mana2>`  
⚡ Note : <Mana: x>

### ✅ Lore_AffiniteDuaux
[Lore 09/50] Acteur avec <Mana: x> ET <Mana2: y> : +10% degats dans ses deux sources, neutre ailleurs.
**Notes** `<Mana: x>` `<Mana2: y>` `<Mana:\s*([a-zA-Zàé]+)>` `<Mana2:\s*([a-zA-Zàé]+)>`  
⚡ Note : <Mana: x>

### ✅ Lore_AldebaranAppel
[Lore] Les Errants entendent Aldébaran (murmures sur la carte) ;
**Cmd** `REINE`  ·  sous-cmd : `pacte` `oubli`  
⚡ `REINE pacte|oubli`

### ✅ Lore_ArcCreatif
[Lore 17/50] <Signature: arc> : chaque lancer choisit librement une forme -> effet bonus aleatoire (2e frappe, paralysie, ou crit 
**Notes** `<Signature: arc>`  
⚡ Note : <Signature: arc>

### ✅ Lore_AuraSource
[Lore 50/50] Aura douce sous chaque acteur, couleur = sa source (Corps=violet, Ame=cramoisi, Esprit=cyan, Pur=blanc). Sprite dedie
**Notes** `<Mana:>` `<Mana:\s*([a-zA-Zàé]+)>`  
⚡ Note : <Mana:>

### ✅ Lore_CampsLumiereOmbre
[Lore] <Camp: lumiere|ombre> sur un acteur/classe/ennemi : la
**Notes** `<Camp: lumiere|ombre>` `<Camp: lumiere>` `<Camp: ombre>`  
⚡ Note : <Camp: lumiere|ombre>

### ✅ Lore_FactionCouleur
[Lore 35/50] Ennemi <Faction: x> : teinte legere + libelle de faction dans le journal au debut du combat. Lisibilite/lore.
**Notes** `<Faction: x>` `<Faction:\s*([a-z]+)>`  
⚡ Note : <Faction: x>

### ✅ Lore_FactionRepute
[Lore 34/50] Reputation multi-factions stockee dans la sauvegarde. Commandes : REPUTE add <faction> <n> · REPUTE ecran. Scripts : 
**Notes** `<faction>`  
⚡ Note : <faction>

### ✅ Lore_FlammesMaudites
[Lore 13/50] <Signature: flammes> : +50% degats et applique une Brulure (state) qui ignore la resistance au feu.
**Notes** `<Signature: flammes>`  
⚡ Note : <Signature: flammes>

### ✅ Lore_ForteresseAme
[Lore 18/50] <Signature: forteresse> : donne a tous les allies DEF++ (3 tours) et un renfort de PV egal a 12% des PV max du lanceu
**Notes** `<Signature: forteresse>`  
⚡ Note : <Signature: forteresse>

### ✅ Lore_JoueurPNJ
[Lore 44/50] API joueurs/PNJ. Un boss <AmeBoss> vaincu ne libere son ame que si un <Joueur> est dans l'equipe (sinon message : un 
**Notes** `<Joueur>`  
⚡ Note : <Joueur>

### ✅ Lore_LoiNoyade
[Lore] Loi de la Noyade : chaque Effondrement (phase 1) laisse une
**Cmd** `NOYADE`  
⚡ `NOYADE`

### ✅ Lore_ManaReculVital
[Lore 02/50] (CONSOLIDÉ) Le recul PV du Mana Sombre/Négatif est géré par ManaAffinity. Ce plugin ne fait plus rien : gardé pour co
**Notes** `<ReculVital: N>`  
⚡ Note : <ReculVital: N>

### ✅ Lore_ManaSourceTag
[Lore 01/50] Journal de combat : nomme la Source (Corps/Ame/Esprit/Pur) et son role dans le cycle.
**Notes** `<Mana: ...>`  
⚡ Note : <Mana: ...>

### ⬜ Lore_MiroirDono
[Lore 40/50] Ennemi <MiroirDono> : se fixe sur un heros (degats x1.5 contre lui, x0.6 contre les autres). Korrah concentree (phase
**Notes** `<MiroirDono>`  
⚡ Note : <MiroirDono>

### ⬜ Lore_MiroirJadeExces
[Lore 42/50] Ennemi <MiroirJade> : en fin de tour, vole un buff a un heros (le retire et se l'octroie). Lou en retenue (phase>=4) 
**Notes** `<MiroirJade>`  
⚡ Note : <MiroirJade>

### ⬜ Lore_MiroirJosu
[Lore 39/50] Ennemi <MiroirJosu> : chaque coup encaisse le rend plus fort (ATK+). Si Aël est SEREINE (phase>=4), sa colere maitris
**Notes** `<MiroirJosu>`  
⚡ Note : <MiroirJosu>

### ⬜ Lore_MiroirKev
[Lore 41/50] Ennemi <MiroirKev> : degats x1.4 contre un heros a faible SAN (doute), mais PREND x1.3 des heros a haute confiance (p
**Notes** `<MiroirKev>`  
⚡ Note : <MiroirKev>

### ✅ Lore_NovaSainte
[Lore 16/50] <Signature: nova> : +40% degats non-elementaux, purge les etats negatifs des allies et REDUIT la corruption du lanceu
**Notes** `<Signature: nova>`  
⚡ Note : <Signature: nova>

### ✅ Lore_PuitsAbime
[Lore 15/50] <Signature: abime> : applique un fort malus de Defense Magique (MDF--) 2 tours a la cible. Les desirs qu'on n'ose pas
**Notes** `<Signature: abime>`  
⚡ Note : <Signature: abime>

### ✅ Lore_Reprises
[Lore] Le jeu compte tes game over À TRAVERS les parties
**Cmd** `REPRISES`  
⚡ `REPRISES`

### ✅ Lore_RoueElements
[Lore 07/50] Annonce « FAIBLESSE ! » quand l'element de l'attaque bat celui de l'ennemi selon la Roue. Purement narratif/visuel.
**Notes** `<RoueElem: 8>` `<RoueElem:\s*(\d+)>`  
⚡ Note : <RoueElem: 8>

### ✅ Lore_SANReposMarche
[Lore 29/50] Sur une carte notee <SafeZone>, chaque N pas restaure +1 SAN a tout le groupe. Le repos guerit l'esprit.
**Notes** `<SafeZone>`  
⚡ Note : <SafeZone>

### ✅ Lore_VagueSacree
[Lore 14/50] <Signature: vague> : apres le sort, soigne 20% PV a tous les allies et leur donne DEF+ (bouclier cosmique, 2 tours).
**Notes** `<Signature: vague>`  
⚡ Note : <Signature: vague>


# 🎨 MOG — HUD & EFFETS VISUELS  (25)

### ❔ MOG_ActorHud
Adiciona uma Hud com os parâmetros do personagem.
**Cmd** `show_actor_hud` `hide_actor_hud`  
⚡ `show_actor_hud`

### ✅ MOG_CharacterMotion
Sistema de animações dos sprites dos personagens.
**Cmd** `breath_mode_follower_id` `ghost_mode_follower_id` `float_mode_follower_id` `swing_mode_follower_id` `rotation_follower_id` `zoom_follower_id` `collapse_effect_follower_id` `clear_effects_follower_id` `shake_effects_follower_id` `breath_mode_event_id` `ghost_mode_event_id` `float_mode_event_id` `swing_mode_event_id` `collpase_effect_event_id` `zoom_event_id` `rotation_event_id` `shake_effects_event_id` `clear_effects_event_id`  
⚡ `zoom_event_id`

### ✅ MOG_CharacterShadow
Apresenta uma sombra abaixo dos personagens.
**Cmd** `shadow_event_id` `shadow_player_id`  
⚡ `shadow_event_id`

### ✅ MOG_CharGhostTrail
Adiciona o efeito "fantasma", criando sombras após o
**Cmd** `gtrail_event_id` `gtrail_player_id`  
⚡ `gtrail_event_id`

### ⬜ MOG_CharParticles
Adiciona o sistema de partículas nos characters.
**Cmd** `particles_event_id`  
⚡ `particles_event_id`

### ⬜ MOG_CharPoses
Ativa poses de movimento no character.
**Cmd** `enable_charposes` `disable_charposes`  
⚡ `enable_charposes`

### ✅ MOG_CharShatterEffect
Cria o efeito de shatter nos sprites dos characters.
**Cmd** `shatter_event_id`  
⚡ `shatter_event_id`

### ✅ MOG_Compass
Adiciona uma bússola indicando o destino a ser seguido.
**Cmd** `show_compass` `hide_compass` `compass_event_id`  
⚡ `show_compass`

### ✅ MOG_EventIndicators
Apresenta indicadores animados acima do evento.
**Cmd** `hide_all_indicators` `show_all_indicators` `hide_indicator` `show_indicator` `indicator` `text_indicator` `variable_indicator` `range_indicator` `animated_indicator` `fontsize_indicator` `blendmode_indicator` `rotation_indicator` `shake_indicator` `pulse_indicator` `float_indicator` `slide_indicator` `clear_indicator`  
⚡ `indicator`

### ⬜ MOG_Footsteps
Apresenta as pegadas do character em determinadas regiões.
**Cmd** `disable_footsteps` `enable_footsteps`  
⚡ `enable_footsteps`

### ✅ MOG_GoldHud
Apresenta uma Hud com a quantidade de dinheiro.
**Cmd** `show_gold_hud` `hide_gold_hud`  
⚡ `show_gold_hud`

### ⬜ MOG_MenuBackground
O plugin permite mudar a imagem de fundo do menu.
**Cmd** `backgroundName`  
⚡ `backgroundName`

### ❔ MOG_Music_Book
O plugin adiciona a cena Livro de Músicas.
**Cmd** `music_book`  
⚡ `music_book`

### ⬜ MOG_PartyHud
Apresenta Huds com as condições básicas do grupo.
**Cmd** `hide_party_hud` `show_party_hud`  
⚡ `hide_party_hud`

### ⬜ MOG_PickupThrow
Sistema de arremessar os eventos.
**Cmd** `pickup_enable` `pickup_disable`  
⚡ `pickup_enable`

### ✅ MOG_PictureEffects
O plugin permite animar as imagens.
**Cmd** `pic_ocean` `pic_breath` `pic_float` `pic_swing` `pic_shake` `pic_flip` `pic_fade` `pic_collapse` `pic_bind` `pic_qmove` `pic_qzoom` `pic_animated` `pic_skit` `pic_camera`  
⚡ `pic_flip`

### ⬜ MOG_PictureGallery
O plugin adiciona uma cena de galeria de imagens.
**Cmd** `picture_gallery` `enable_picture` `disable_picture`  
⚡ `enable_picture`

### ✅ MOG_PixiFilters
Ativa alguns filtros gráficos padrões do Rpg Maker MV.
**Cmd** `filter_effect` `filter_clear` `filter_event_id` `filter_actor_id`  
⚡ `filter_clear`

### ❔ MOG_SHud
Apresenta uma Hud com a quantidade hp em cima do personagem.
**Cmd** `show_s_hud` `hide_s_hud`  
⚡ `show_s_hud`

### ❔ MOG_Theatrhythm
Minigame baseado no jogo Final Fantasy Theatrhythm.
**Cmd** `theatrhythm`  
⚡ `theatrhythm`

### ✅ MOG_TreasureHud
Apresenta uma Hud com os tesouros adquiridos no jogo.
**Cmd** `show_treasure_hud` `hide_treasure_hud`  
⚡ `show_treasure_hud`

### ✅ MOG_TreasurePopup
Apresenta o ícone e o nome do tesouro ganho.
**Cmd** `show_treasure_popup` `hide_treasure_popup`  
⚡ `show_treasure_popup`

### ⬜ MOG_VariableHud
Apresenta as variáveis através de Huds.
**Cmd** `hide_variable_hud` `show_variable_hud` `set_variable_max`  
⚡ `set_variable_max`

### ❔ MOG_VisualTimer
Apresenta o contador de tempo através de imagens.
**Cmd** `visual_timer`  
⚡ `visual_timer`

### ✅ MOG_Weather_EX
Adiciona novos efeitos de climas.
**Cmd** `clear_weather` `clear_all_weathers` `battle_weather` `weather`  
⚡ `weather`


# ⚙️ YEP — MOTEUR (Yanfly)  (26)

### ✅ YEP_AutoPassiveStates
This plugin allows for some states to function as
**Notes** `<Custom Passive Condition>`  
⚡ Note : <Custom Passive Condition>

### ✅ YEP_BattleEngineCore
Have more control over the flow of the battle system
**Cmd** `setBattleSys`  
**Notes** `<speed: +x>` `<speed: -x>` `<Cast Animation: x>` `<Reflect Animation ID: x>` `<Sprite Cannot Move>` `<Turn Start: x>` `<Turn Start: x to y>` `<SIMPLE>`  
⚡ `setBattleSys`

### ❔ YEP_BuffsStatesCore
Alter the basic mechanics behind buffs and states
**Notes** `<Max stat Buff: +x>` `<Max stat Buff: -x>` `<Max stat Debuff: +x>` `<Max stat Debuff: -x>` `<stat Buff Turns: +x>` `<stat Buff Turns: -x>` `<stat Debuff Turns: +x>` `<stat Debuff Turns: -x>` `<Show Turns>` `<Hide Turns>`  
⚡ Note : <Max stat Buff: +x>

### ✅ YEP_CoreEngine
Needed for the majority of Yanfly Engine Scripts. Also
**Cmd** `GainGold` `LoseGold`  
**Notes** `<Gold: x>` `<Max Item: x>` `<Max Level: x>` `<Learn at Level: x>` `<stat: +x>` `<stat: -x>` `<stat: x>` `<exp: x>` `<Learn Level: x>`  
⚡ `GainGold`

### ❔ YEP_ElementCore
Manage the way elements work in this game from
**Notes** `<Multiple Elements: x>` `<Multiple Elements: x to y>` `<Element Absorb: x>` `<Element Absorb: x, x, x>` `<Element Absorb: name>` `<Element Reflect x: +y%>` `<Element Reflect x: -y%>` `<Element Reflect name: +y%>` `<Element Reflect name: -y%>` `<Element Magnify x: +y%>`  
⚡ Note : <Multiple Elements: x>

### ❔ YEP_EquipCore
Allows for the equipment system to be more flexible to
**Notes** `<Empty>` `<Equip Slot: x>` `<Equip Slot: x, x, x>` `<Equip Slot>` `<stat: +x>` `<stat: -x>` `<Custom Parameters>`  
⚡ Note : <Empty>

### ❔ YEP_ItemCore
Changes the way Items are handled for your game
**Cmd** `EnableVarianceStock` `DisableVarianceStock`  
**Notes** `<Random Variance: x>` `<Text Color: x>` `<On Creation Eval>`  
⚡ `EnableVarianceStock`

### ❔ YEP_KeyboardConfig
Allows players to adjust their button configuration
**Notes** `<Config Key: text>` `<Config Text: text>` `<Config Required>`  
⚡ Note : <Config Key: text>

### ❔ YEP_LevelUpGrowthEffects
Equip an item that upon leveling up will raise stats?
**Notes** `<Level Up stat Growth: +x>` `<Level Up stat Growth: -x>` `<Level Up Learn Skill: x>` `<Level Up Switch On: x>` `<Level Up Switch Off: x>` `<Level Up Recover All>` `<Custom Level Up Effect>`  
⚡ Note : <Level Up Learn Skill: x>

### ❔ YEP_MessageCore
Adds more features to the Message Window to customized
**Cmd** `MessageRows` `MessageWidth` `EnableWordWrap` `DisableWordWrap` `EnableFastForward` `DisableFastForward`  
**Notes** `<line break>` `<x>`  
⚡ `MessageRows`

### ❔ YEP_PatchNotes
Add the ability to read Patch Notes from inside your game.
**Cmd** `OpenPatchNotes` `ShowMenuPatchNotesCommand` `HideMenuPatcNoteshCommand`  
⚡ `OpenPatchNotes`

### ❔ YEP_QuestJournal
Insert a quest journal system into your game!
**Cmd** `OpenQuestJournal` `Quest`  
**Notes** `<CategoryWindow>` `<ListWindow>` `<TitleWindow>` `<LunaticMode>` `<Quest>`  
⚡ `Quest`

### ❔ YEP_RegionEvents
Make it so that whenever players step on certain
**Notes** `<Region x Event: y>`  
⚡ Note : <Region x Event: y>

### ❔ YEP_RegionRestrictions
Use regions to block out Events and/or the player from
**Notes** `<Event Restrict Region: x>` `<Event Allow Region: x>`  
⚡ Note : <Event Allow Region: x>

### ❔ YEP_SaveEventLocations
Enable specified maps to memorize the locations of
**Cmd** `ResetAllEventLocations`  
**Notes** `<Save Event Locations>` `<Save Event Location>`  
⚡ `ResetAllEventLocations`

### ✅ YEP_SkillCore
Skills are now given more functions and the ability
**Notes** `<HP Cost: x>` `<HP Cost: x%>` `<MP Cost: x>` `<MP Cost: x%>` `<TP Cost: x>` `<TP Cost: x%>` `<Hide in Battle>` `<Hide in Field>` `<Hide if Learned Skill: x>` `<Swap Gauge x: y>`  
⚡ Note : <HP Cost: x>

### ❔ YEP_VictoryAftermath
Display an informative window after a battle is over
**Cmd** `DisableVictoryAftermath` `EnableVictoryAftermath` `DisableVictoryMusic` `EnableVictoryMusic`  
⚡ `EnableVictoryMusic`

### ✅ YEP_X_ActSeqPack1
(Requires YEP_BattleEngineCore.js) Basic functions are
**Notes** `<setup action>` `<finish action>` `<whole action>` `<target action>` `<follow action>`  
⚡ Note : <setup action>

### ✅ YEP_X_ActSeqPack2
(Requires YEP_BattleEngineCore.js) Visual functions
**Notes** `<setup action>` `<finish action>` `<whole action>` `<target action>` `<follow action>`  
⚡ Note : <setup action>

### ✅ YEP_X_ActSeqPack3
(Requires YEP_BattleEngineCore.js) Camera control is
**Notes** `<setup action>` `<finish action>` `<whole action>` `<target action>` `<follow action>`  
⚡ Note : <setup action>

### ✅ YEP_X_AnimatedSVEnemies
(Requires YEP_BattleEngineCore.js) This plugin lets
**Notes** `<Enable HP Link Breathing>` `<Floating>` `<Floating Speed: x>` `<Floating Rate: x.y>` `<Floating Height: x>` `<Floating Death>` `<Scale Sprite: x%>` `<Scale Sprite Width: x%>` `<Scale Sprite Height: x%>` `<Sideview Anchor X: y.z>`  
⚡ Note : <Floating>

### ❔ YEP_X_BattleSysATB
(Requires YEP_BattleEngineCore.js) Add ATB (Active
**Notes** `<Cannot ATB Interrupt>` `<Target ATB Eval>`  
⚡ Note : <Cannot ATB Interrupt>

### ✅ YEP_X_BattleSysCTB
(Requires YEP_BattleEngineCore.js) Add CTB (Charge
**Notes** `<CTB Icon: x>` `<CTB Border Color: x>` `<CTB Background Color: x>` `<Class x CTB Icon: y>` `<Hero CTB Icon: x>` `<Warrior CTB Icon: x>` `<Mage CTB Icon: x>` `<CTB Help>` `<CTB Speed: x>` `<CTB Speed: x%>`  
⚡ Note : <CTB Icon: x>

### ❔ YEP_X_BattleSysSTB
(Requires YEP_BattleEngineCore.js) Add STB (Standard
**Notes** `<STB Help>`  
⚡ Note : <STB Help>

### ❔ YEP_X_ItemUpgradeSlots
(Requires YEP_ItemCore.js) Allows independent items to
**Cmd** `ShowItemUpgrade` `HideItemUpgrade` `DisableItemUpgrade` `EnableItemUpgrade`  
**Notes** `<Upgrade Slots: x>` `<Slot Variance: x>` `<Upgrade Sound: filename>` `<Upgrade Effect>` `<Upgrade Item Type: All>` `<Upgrade Item Type: Key>` `<Upgrade Item Type: Always>` `<Upgrade Item Type: Battle>` `<Upgrade Item Type: Menu>` `<Upgrade Item Type: Never>`  
⚡ `ShowItemUpgrade`

### ❔ YEP_X_SkillCooldowns
(Requires YEP_SkillCore.js) Cooldowns can be applied
**Notes** `<Cooldown: x>` `<Warmup: x>` `<Cooldown Steps: x>` `<Skill x Cooldown: y>` `<Skill name Cooldown: y>` `<SType x Cooldown: y>` `<Global Cooldown: x>` `<Skill x Cooldown: +y>` `<Skill x Cooldown: -y>` `<Skill name Cooldown: +y>`  
⚡ Note : <Cooldown: x>


# 🔧 AUTRES PLUGINS TIERS / UTILITAIRES  (4)

### ✅ Aries001L_ShakeEffects
Adjustable shake effects in RPG Maker MV.
**Cmd** `AriesScreenShakeType`  
⚡ `AriesScreenShakeType`

### ❔ GALV_TimedMessagePopups
Display popup message boxes on screen that do not stop gameplay and auto close after a set time.
**Notes** `<c:4,160,0>` `<c:-1,60,10>` `<c:-3,80,20>` `<c:a7,60,0>` `<c:0,100,0>` `<c:100|100,80,5>` `<c:0|0,90,0,Window2>` `<c:4,160,0,,-40>` `<c:(.*)>`  
⚡ Note : <c:4,160,0>

### ✅ Olivia_MapDisplayNameCore
<MapDisplayNameCore> for RPG Maker MV version 1.6.1.
**Notes** `<MapDisplayNameCore>`  
⚡ Note : <MapDisplayNameCore>

### ✅ Olivia_MetaControls
<MetaControls> for RPG Maker MV version 1.6.1.
**Notes** `<MetaControls>` `<Global Meta>` `<Local Meta>`  
⚡ Note : <MetaControls>


---

> **Note sur l'extraction :** commandes, sous-commandes et notetags sont lus **directement dans le code**
> de chaque plugin. Quelques sous-commandes rares ou notetags dynamiques peuvent manquer — en cas de doute,
> le détail des arguments est dans `docs/FICHE_COMMANDES_COMPLETE.md`, et les recettes montées dans `docs/RECETTES.md`.
>
> **Voir aussi :** `docs/INDEX.md` (sommaire), `docs/RECETTES.md` (recettes copier-coller),
> `docs/RECETTES_LivingNPC.md` (les 52 PNJ), `docs/PLUGIN_LivingNPC.md` (un plugin à fond),
> `docs/GUIDE_DEVELOPPEUR.md` (les systèmes en profondeur), `docs/ORDRE_PLUGINS.md` (⚠️ ordre de chargement).
