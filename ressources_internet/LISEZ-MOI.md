# Ressources d'internet — triées pour RPG Maker MV

Rassemblées le 2026-10-04 pour JOKO, puis triées **strictement MV** à sa demande : « vraiment
MV, pas autre chose […] des trucs qui ressemblent à ce que j'ai dans mon jeu ».
**Rien de tout ça n'est dans le jeu.** Tu copies ce que tu veux.

## Ce qui sert : `PRET_POUR_MV/`

Les mêmes dossiers que ton projet, déjà au bon format, triés par famille :

| Dossier | Ce qu'il contient |
|---|---|
| `PRET_POUR_MV/img/faces/` | feuilles de visages 576 × 288 (8 visages de 144) |
| `PRET_POUR_MV/img/pictures/` | grands portraits (bustes) pour « Afficher une image » |
| `PRET_POUR_MV/img/characters/` | personnages de carte MV (48 px), seuls (« $ ») ou par 8 |
| `PRET_POUR_MV/img/sv_actors/` | battlers vue de côté 576 × 384 |
| `PRET_POUR_MV/img/sv_enemies/` | monstres dessinés, un par image, triés (morts-vivants, dragons, bêtes…) |
| `PRET_POUR_MV/img/animations/` | effets en cases de 192, triés (feu, foudre, ténèbres…) |
| `PRET_POUR_MV/img/windows/` | habillages de fenêtres 192 × 192 |
| `PRET_POUR_MV/audio/bgm, bgs, me, se/` | musiques et bruitages en **.ogg ET .m4a** (MV a besoin des deux), triés (combat, boss, ville…) |

**Pour utiliser un fichier :** copie le FICHIER (pas le sous-dossier : l'éditeur de MV ne lit pas
les sous-dossiers) dans le dossier du même nom de ton jeu. Pour un son, copie les deux
(.ogg et .m4a). Tout commence par **Z_Net_** : une fois copié, c'est en bas des listes.
Un monstre devient un ennemi, un effet devient une animation, dans la base de données : c'est toi.

**Gardé** : formats MV d'origine (le MZ a les mêmes), dessin façon MV, en couleur.
**Écarté** : pixel art agrandi, 16/32 px, VX Ace, LPC, 1-bit, vieilles photos, dessins au
trait sans couleur, science-fiction, moderne, robots, personnages de licences connues.

## Les licences

`INSTALLES.md` (images) et `INSTALLES_SONS.md` (sons) disent, fichier par fichier, d'où il
vient, son auteur et sa licence. **CC0** : libre. **CC-BY / OGA-BY / CC-BY-SA** : cite l'auteur
dans tes crédits. **itch.io** : chaque auteur a ses conditions, recopiées dans le SOURCE.txt du
pack (crédit demandé, pas de revente…).

## Les originaux

Les dossiers `visages/`, `personnages/`, `ennemis/`, `effets_et_sorts/`, `autres/` gardent
les packs d'origine **seulement de ceux qui ont donné quelque chose** dans PRET_POUR_MV
(797 packs inutiles en MV ont été retirés), avec leur SOURCE.txt.

### Visages et portraits — 56 packs

| Titre | Auteur | Licence | Source | Dossier |
|---|---|---|---|---|
| 16 Emotions | melaniko | CC0 | [opengameart](https://opengameart.org/content/16-emotions) | `visages/opengameart/16-emotions` |
| Adonthell Portraits | bart | GPL 2.0 / GPL 3.0 / CC-BY-SA 3.0 | [opengameart](https://opengameart.org/content/adonthell-portraits) | `visages/opengameart/adonthell-portraits` |
| Animated Nordic Warrior Sprite + Bust | Sevarihk | CC-BY 4.0 | [opengameart](https://opengameart.org/content/animated-nordic-warrior-sprite-bust) | `visages/opengameart/animated-nordic-warrior-sprite-bust` |
| Animated Shield Maiden Sprite + Busts | Sevarihk | CC-BY 4.0 | [opengameart](https://opengameart.org/content/animated-shield-maiden-sprite-busts) | `visages/opengameart/animated-shield-maiden-sprite-busts` |
| Anime Martial arts | Ironthunder | CC-BY 3.0 | [opengameart](https://opengameart.org/content/anime-martial-arts) | `visages/opengameart/anime-martial-arts` |
| Anime Martial arts 2 | Ironthunder | CC-BY 3.0 | [opengameart](https://opengameart.org/content/anime-martial-arts-2) | `visages/opengameart/anime-martial-arts-2` |
| Anime Portrait for LPC characters | ZaPaper | CC-BY-SA 3.0 | [opengameart](https://opengameart.org/content/anime-portrait-for-lpc-characters) | `visages/opengameart/anime-portrait-for-lpc-characters` |
| Anime Samurai Swordsman | Ironthunder | CC-BY 3.0 | [opengameart](https://opengameart.org/content/anime-samurai-swordsman) | `visages/opengameart/anime-samurai-swordsman` |
| Ascension 2 Galaxy: Portraits | XCVG | CC-BY-SA 3.0 | [opengameart](https://opengameart.org/content/ascension-2-galaxy-portraits) | `visages/opengameart/ascension-2-galaxy-portraits` |
| Avatar pack by Bullseye | ? | CC-BY-SA 3.0 | [opengameart](https://opengameart.org/content/avatar-pack-by-bullseye) | `visages/opengameart/avatar-pack-by-bullseye` |
| boy | Aeihu | CC-BY 3.0 | [opengameart](https://opengameart.org/content/boy) | `visages/opengameart/boy` |
| Casual Avatars | Kitsuge Apps | CC0 | [opengameart](https://opengameart.org/content/casual-avatars) | `visages/opengameart/casual-avatars` |
| Character graphics Cardboard style | Sevarihk | CC-BY 4.0 | [opengameart](https://opengameart.org/content/character-graphics-cardboard-style) | `visages/opengameart/character-graphics-cardboard-style` |
| Character Portrait ~ Bandit | jupitersdaughter | CC-BY 3.0 | [opengameart](https://opengameart.org/content/character-portrait-bandit) | `visages/opengameart/character-portrait-bandit` |
| Character Portrait ~ Maid | jupitersdaughter | CC-BY 3.0 | [opengameart](https://opengameart.org/content/character-portrait-maid) | `visages/opengameart/character-portrait-maid` |
| JS Actor - Brynhildr | JosephSeraph | CC-BY 3.0 | [opengameart](https://opengameart.org/content/js-actor-brynhildr) | `visages/opengameart/js-actor-brynhildr` |
| JS Actor - Innkeeper | JosephSeraph | CC-BY 3.0 | [opengameart](https://opengameart.org/content/js-actor-innkeeper) | `visages/opengameart/js-actor-innkeeper` |
| JS Actor - Lifa | JosephSeraph | CC-BY 3.0 | [opengameart](https://opengameart.org/content/js-actor-lifa) | `visages/opengameart/js-actor-lifa` |
| Knight | centrix | CC-BY 3.0 | [opengameart](https://opengameart.org/content/knight-1) | `visages/opengameart/knight-1` |
| LPC Anime Portrait #2 | ZaPaper | CC-BY 3.0 | [opengameart](https://opengameart.org/content/lpc-anime-portrait-2) | `visages/opengameart/lpc-anime-portrait-2` |
| manga girl | mcproject | CC0 | [opengameart](https://opengameart.org/content/manga-girl) | `visages/opengameart/manga-girl` |
| Maru - Art Challenge | TAD | CC-BY 4.0 | [opengameart](https://opengameart.org/content/maru-art-challenge) | `visages/opengameart/maru-art-challenge` |
| mermaid | Aeihu | CC-BY 3.0 | [opengameart](https://opengameart.org/content/mermaid) | `visages/opengameart/mermaid` |
| Miscelaneous Wesnoth Portraits | fmunoz.geo | GPL 3.0 / GPL 2.0 / CC0 | [opengameart](https://opengameart.org/content/miscelaneous-wesnoth-portraits) | `visages/opengameart/miscelaneous-wesnoth-portraits` |
| Mouse-Drawn Characters | XCVG | CC-BY 4.0 / CC-BY 3.0 / OGA-BY 3.0 | [opengameart](https://opengameart.org/content/mouse-drawn-characters) | `visages/opengameart/mouse-drawn-characters` |
| Ogre | Justin Nichol | CC-BY-SA 3.0 | [opengameart](https://opengameart.org/content/ogre-2) | `visages/opengameart/ogre-2` |
| Oracle Portrait | Justin Nichol | GPL 2.0 / GPL 3.0 / CC-BY-SA 3.0 | [opengameart](https://opengameart.org/content/oracle-portrait) | `visages/opengameart/oracle-portrait` |
| Portrait | Unnamed | CC-BY 4.0 | [opengameart](https://opengameart.org/content/portrait-2) | `visages/opengameart/portrait-2` |
| Portrait: Female Fighter | bart | GPL 2.0 / GPL 3.0 / CC-BY-SA 3.0 | [opengameart](https://opengameart.org/content/portrait-female-fighter) | `visages/opengameart/portrait-female-fighter` |
| Portrait: Male Fighter | bart | GPL 2.0 / GPL 3.0 / CC-BY-SA 3.0 | [opengameart](https://opengameart.org/content/portrait-male-fighter) | `visages/opengameart/portrait-male-fighter` |
| Priest portrait - Female | bart | GPL 2.0 / GPL 3.0 / CC-BY 3.0 / CC-BY-SA 3.0 | [opengameart](https://opengameart.org/content/priest-portrait-female) | `visages/opengameart/priest-portrait-female` |
| Priest portrait - Male | bart | GPL 2.0 / GPL 3.0 / CC-BY 3.0 / CC-BY-SA 3.0 | [opengameart](https://opengameart.org/content/priest-portrait-male) | `visages/opengameart/priest-portrait-male` |
| Red Haired Chick | Ironthunder | CC-BY 3.0 | [opengameart](https://opengameart.org/content/red-haired-chick) | `visages/opengameart/red-haired-chick` |
| Sara OGA | TAD | CC-BY 3.0 | [opengameart](https://opengameart.org/content/sara-oga) | `visages/opengameart/sara-oga` |
| Sara, Trevor, Puck Anime Portrait and Expressions | ZaPaper | CC-BY 3.0 | [opengameart](https://opengameart.org/content/sara-trevor-puck-anime-portrait-and-expressions) | `visages/opengameart/sara-trevor-puck-anime-portrait-and-` |
| Shieldmaiden Character Sprite and Busts | Sevarihk | CC-BY 4.0 | [opengameart](https://opengameart.org/content/shieldmaiden-character-sprite-and-busts) | `visages/opengameart/shieldmaiden-character-sprite-and-bu` |
| Soulless mage | Buch | GPL 2.0 / GPL 3.0 / CC-BY 3.0 | [opengameart](https://opengameart.org/content/soulless-mage) | `visages/opengameart/soulless-mage` |
| Thief portrait - Female | bart | GPL 2.0 / GPL 3.0 / CC-BY 3.0 / CC-BY-SA 3.0 | [opengameart](https://opengameart.org/content/thief-portrait-female) | `visages/opengameart/thief-portrait-female` |
| Thief portrait - Male | bart | GPL 2.0 / GPL 3.0 / CC-BY 3.0 / CC-BY-SA 3.0 | [opengameart](https://opengameart.org/content/thief-portrait-male) | `visages/opengameart/thief-portrait-male` |
| Ugly pixel art faces | killerfishred | CC0 | [opengameart](https://opengameart.org/content/ugly-pixel-art-faces) | `visages/opengameart/ugly-pixel-art-faces` |
| Whisp Portrait | FruitDragon | CC-BY 3.0 / CC-BY-SA 3.0 / GPL 3.0 / GPL 2.0 / CC0 | [opengameart](https://opengameart.org/content/whisp-portrait) | `visages/opengameart/whisp-portrait` |
| Young knight portrait | Deevad | CC-BY 3.0 | [opengameart](https://opengameart.org/content/young-knight-portrait) | `visages/opengameart/young-knight-portrait` |
| Game Faces | 23 | conditions de l'auteur (SOURCE.txt) | [itch](https://23.itch.io/game-faces) | `visages/itch/23__game-faces` |
| Raccoon's Portrait Pack for RPG Maker MV & SRPG Studio | false-ages | conditions de l'auteur (SOURCE.txt) | [itch](https://false-ages.itch.io/srpg-studio-portrait-pack) | `visages/itch/false-ages__srpg-studio-portrait-pac` |
| Characters Pixel Art: 001-012 | gurigraphics | conditions de l'auteur (SOURCE.txt) | [itch](https://gurigraphics.itch.io/characters-pixel-art-001-012) | `visages/itch/gurigraphics__characters-pixel-art-0` |
| 50 Male Portraits | jazzzo | conditions de l'auteur (SOURCE.txt) | [itch](https://jazzzo.itch.io/50-male-portraits) | `visages/itch/jazzzo__50-male-portraits` |
| Pixel Avatars - Standart | lmaomonkey | conditions de l'auteur (SOURCE.txt) | [itch](https://lmaomonkey.itch.io/pixel-avatars) | `visages/itch/lmaomonkey__pixel-avatars` |
| Goblin Portrait Pack — 119 Full-Body Characters | lovelyassets | conditions de l'auteur (SOURCE.txt) | [itch](https://lovelyassets.itch.io/goblin-portrait-pack) | `visages/itch/lovelyassets__goblin-portrait-pack` |
| FR14 — 50 Face Graphics (PNG) | pixelartmaterial | conditions de l'auteur (SOURCE.txt) | [itch](https://pixelartmaterial.itch.io/fr14-50-face-graphics-png) | `visages/itch/pixelartmaterial__fr14-50-face-graph` |
| FR16 — 50 Free Anime Fantasy Face Graphics (PNG) | pixelartmaterial | conditions de l'auteur (SOURCE.txt) | [itch](https://pixelartmaterial.itch.io/fr16-50-free-anime-fantasy) | `visages/itch/pixelartmaterial__fr16-50-free-anime` |
| FR23 — Free Harbor Town NPC Face Graphics x50 (PNG) | pixelartmaterial | conditions de l'auteur (SOURCE.txt) | [itch](https://pixelartmaterial.itch.io/fr23-free-harbor-town-npc-face-graphics-x50-png) | `visages/itch/pixelartmaterial__fr23-free-harbor-t` |
| FREE RPG Portraits | pixelsos | conditions de l'auteur (SOURCE.txt) | [itch](https://pixelsos.itch.io/free-rpg-portraits) | `visages/itch/pixelsos__free-rpg-portraits` |
| Character Portraits | v-ktor | conditions de l'auteur (SOURCE.txt) | [itch](https://v-ktor.itch.io/character-portraits) | `visages/itch/v-ktor__character-portraits` |
| Dreadful Bosses — Free 3-Portrait Demo | waveex | conditions de l'auteur (SOURCE.txt) | [itch](https://waveex.itch.io/dreadful-bosses-free-3-portrait-demo) | `visages/itch/waveex__dreadful-bosses-free-3-portr` |
| Faces of HOME — Free Visual Novel Character Pack | wonderweave | conditions de l'auteur (SOURCE.txt) | [itch](https://wonderweave.itch.io/faces-of-home-free-visual-novel-character-pack) | `visages/itch/wonderweave__faces-of-home-free-visu` |
| Village Elders — Visual Novel Character Pack (Vol. 1) | wonderweave | conditions de l'auteur (SOURCE.txt) | [itch](https://wonderweave.itch.io/village-elders-painted-visual-novel-character-pack-vol-1) | `visages/itch/wonderweave__village-elders-painted-` |

### Personnages — 17 packs

| Titre | Auteur | Licence | Source | Dossier |
|---|---|---|---|---|
| Wizard | lylfDW | CC0 | [opengameart](https://opengameart.org/content/wizard-7) | `personnages/opengameart/wizard-7` |
| Librarium Megapack III | aekashics | conditions de l'auteur (SOURCE.txt) | [itch](https://aekashics.itch.io/librarium-megapack-iii) | `personnages/itch/aekashics__librarium-megapack-iii` |
| Super Retro World • Free Characters Pack | farm-animal | conditions de l'auteur (SOURCE.txt) | [itch](https://farm-animal.itch.io/character-pack) | `personnages/itch/farm-animal__character-pack` |
| Halloween2021 Collab Assets | finnuval | conditions de l'auteur (SOURCE.txt) | [itch](https://finnuval.itch.io/halloween2021-collab-assets) | `personnages/itch/finnuval__halloween2021-collab-asset` |
| RPG Maker MZ Free Material 05 | galacticgod | conditions de l'auteur (SOURCE.txt) | [itch](https://galacticgod.itch.io/rpg-maker-mz-free-material-05) | `personnages/itch/galacticgod__rpg-maker-mz-free-ma_2` |
| RPG Maker MZ Free Material 06 | galacticgod | conditions de l'auteur (SOURCE.txt) | [itch](https://galacticgod.itch.io/rpg-maker-mz-free-material-06) | `personnages/itch/galacticgod__rpg-maker-mz-free-ma_3` |
| RPG Maker MZ Free Material 02 | galacticgod | conditions de l'auteur (SOURCE.txt) | [itch](https://galacticgod.itch.io/rpg-maker-mz-free-material-02) | `personnages/itch/galacticgod__rpg-maker-mz-free-mater` |
| RPG Maker NPC Character Set - Elderly Inn Keeper | galacticgod | conditions de l'auteur (SOURCE.txt) | [itch](https://galacticgod.itch.io/rpg-maker-npc-character-set-elderlyinnkeeper) | `personnages/itch/galacticgod__rpg-maker-npc-charac_2` |
| RPG Maker NPC Character Set - Mad Scientist | galacticgod | conditions de l'auteur (SOURCE.txt) | [itch](https://galacticgod.itch.io/rpg-maker-npc-character-set-mad-scientist) | `personnages/itch/galacticgod__rpg-maker-npc-charac_3` |
| RPG Maker NPC Character Set - Meat Butcher | galacticgod | conditions de l'auteur (SOURCE.txt) | [itch](https://galacticgod.itch.io/rpg-maker-npc-character-set-meat-butcher) | `personnages/itch/galacticgod__rpg-maker-npc-charac_4` |
| RPG Maker NPC Character Set - Demon | galacticgod | conditions de l'auteur (SOURCE.txt) | [itch](https://galacticgod.itch.io/rpg-maker-npc-character-set-demon) | `personnages/itch/galacticgod__rpg-maker-npc-character` |
| RPG Maker MV Crusades characters | happyfox123 | conditions de l'auteur (SOURCE.txt) | [itch](https://happyfox123.itch.io/crusades-characters) | `personnages/itch/happyfox123__crusades-characters` |
| High Fantasy Heroes! | haydeos | conditions de l'auteur (SOURCE.txt) | [itch](https://haydeos.itch.io/high-fantasy-heroes) | `personnages/itch/haydeos__high-fantasy-heroes` |
| RPG Maker MV Free Characters | lanto | conditions de l'auteur (SOURCE.txt) | [itch](https://lanto.itch.io/rpg-maker-mv-free-characters) | `personnages/itch/lanto__rpg-maker-mv-free-characters` |
| Anthropomorphic NPCs – Free Sample Pack (RPG Maker MZ) | splitwing77 | conditions de l'auteur (SOURCE.txt) | [itch](https://splitwing77.itch.io/anthropomorphic-npcs-free-sample-pack-rpg-maker-mz) | `personnages/itch/splitwing77__anthropomorphic-npcs-fr` |
| Walk Sprite Base Pack | stormofsunbeams | conditions de l'auteur (SOURCE.txt) | [itch](https://stormofsunbeams.itch.io/walk-sprite-base-pack) | `personnages/itch/stormofsunbeams__walk-sprite-base-pa` |
| Multiple Boats in RPG Maker MZ: No Plugins | tomazellagames | conditions de l'auteur (SOURCE.txt) | [itch](https://tomazellagames.itch.io/two-boats) | `personnages/itch/tomazellagames__two-boats` |

### Ennemis et monstres — 29 packs

| Titre | Auteur | Licence | Source | Dossier |
|---|---|---|---|---|
| 12 Public Domain Boss Sprites! | titleknown | CC0 | [opengameart](https://opengameart.org/content/12-public-domain-boss-sprites) | `ennemis/opengameart/12-public-domain-boss-sprites` |
| 2d Monster Teeth | osanimate | CC0 | [opengameart](https://opengameart.org/content/2d-monster-teeth) | `ennemis/opengameart/2d-monster-teeth` |
| 2D Orcs for Rpg Maker | Chibizilla | CC-BY 4.0 | [opengameart](https://opengameart.org/content/2d-orcs-for-rpg-maker) | `ennemis/opengameart/2d-orcs-for-rpg-maker` |
| Baby dragon | Madjestiko | CC-BY-SA 3.0 | [opengameart](https://opengameart.org/content/baby-dragon) | `ennemis/opengameart/baby-dragon` |
| Cartoon Enemies | VanillaBrocker | CC0 | [opengameart](https://opengameart.org/content/cartoon-enemies) | `ennemis/opengameart/cartoon-enemies` |
| cool Monster pack | RamenKing_Assets | CC0 | [opengameart](https://opengameart.org/content/cool-monster-pack) | `ennemis/opengameart/cool-monster-pack` |
| Food Monsters Pack | AhNinniah | CC-BY 3.0 | [opengameart](https://opengameart.org/content/food-monsters-pack) | `ennemis/opengameart/food-monsters-pack` |
| HQ Complete sprite set for a light-based enemy | el-corleo | CC-BY 3.0 | [opengameart](https://opengameart.org/content/hq-complete-sprite-set-for-a-light-based-enemy) | `ennemis/opengameart/hq-complete-sprite-set-for-a-light-b` |
| Kica's Enemy Pack | Fava Beans | CC0 | [opengameart](https://opengameart.org/content/kicas-enemy-pack) | `ennemis/opengameart/kicas-enemy-pack` |
| Monster | usama73041 | CC-BY 4.0 / CC-BY 3.0 / CC-BY-SA 4.0 / CC-BY-SA 3.0 / GPL 3.0 / GPL 2.0 / OGA-BY 3.0 | [opengameart](https://opengameart.org/content/monster-7) | `ennemis/opengameart/monster-7` |
| Monsters 2D Pack No 2. | Alucard | CC-BY 3.0 | [opengameart](https://opengameart.org/content/monsters-2d-pack-no-2) | `ennemis/opengameart/monsters-2d-pack-no-2` |
| Nighthawking 2 Battlers | benamas | CC-BY-SA 4.0 | [opengameart](https://opengameart.org/content/nighthawking-2-battlers) | `ennemis/opengameart/nighthawking-2-battlers` |
| Ogre | Julien Brightside | GPL 2.0 | [opengameart](https://opengameart.org/content/ogre-0) | `ennemis/opengameart/ogre-0` |
| Painted battlers pack | gilgaphoenixignis | CC-BY 3.0 / CC-BY 4.0 | [opengameart](https://opengameart.org/content/painted-battlers-pack) | `ennemis/opengameart/painted-battlers-pack` |
| Plant and Mushroom Enemies charset and battlers | NettySvit | CC0 | [opengameart](https://opengameart.org/content/plant-and-mushroom-enemies-charset-and-battlers) | `ennemis/opengameart/plant-and-mushroom-enemies-charset-a` |
| Singular Direction Monsters + Battlers | Some Weirdo | CC0 | [opengameart](https://opengameart.org/content/singular-direction-monsters-battlers) | `ennemis/opengameart/singular-direction-monsters-battlers` |
| Skeleton animations | irmirx | CC-BY 3.0 | [opengameart](https://opengameart.org/content/skeleton-animations) | `ennemis/opengameart/skeleton-animations` |
| Slime | Madjestiko | CC-BY-SA 3.0 | [opengameart](https://opengameart.org/content/slime-2) | `ennemis/opengameart/slime-2` |
| The Knight - Free Sprite | pzUH | CC0 | [opengameart](https://opengameart.org/content/the-knight-free-sprite) | `ennemis/opengameart/the-knight-free-sprite` |
| RPG Enemy Character Assets — Free Sample Pack (Rotating) | ainero | conditions de l'auteur (SOURCE.txt) | [itch](https://ainero.itch.io/rpg-enemy-assets-sample) | `ennemis/itch/ainero__rpg-enemy-assets-sample` |
| RPG Maker MZ Free Orc Character Sprites & Faceset | galacticgod | conditions de l'auteur (SOURCE.txt) | [itch](https://galacticgod.itch.io/rpg-maker-mz-free-orc-character-sprites-faceset) | `ennemis/itch/galacticgod__rpg-maker-mz-free-orc-c` |
| RPG Maker NPC Character Set - Orc | galacticgod | conditions de l'auteur (SOURCE.txt) | [itch](https://galacticgod.itch.io/rpg-maker-npc-character-set-orc) | `ennemis/itch/galacticgod__rpg-maker-npc-character` |
| Free Pixel Art Monster Portraits: 35 Portraits, 136 px | gegx | conditions de l'auteur (SOURCE.txt) | [itch](https://gegx.itch.io/monster-portraits-free) | `ennemis/itch/gegx__monster-portraits-free` |
| Cats and Only Cats! | marquise-2d | conditions de l'auteur (SOURCE.txt) | [itch](https://marquise-2d.itch.io/cats-and-only-cats) | `ennemis/itch/marquise-2d__cats-and-only-cats` |
| Mega Elementals and Wisps 2D Battlers Package | ministerjay | conditions de l'auteur (SOURCE.txt) | [itch](https://ministerjay.itch.io/mega-elemental-and-wisps-2d-battlers-package) | `ennemis/itch/ministerjay__mega-elemental-and-wisp` |
| Free Fantasy Enemy Monster Asset Pack: Boss Expansion Vol.09 | miraeru | conditions de l'auteur (SOURCE.txt) | [itch](https://miraeru.itch.io/free-fantasy-enemy-monster-asset-pack-boss-expansion-vol09) | `ennemis/itch/miraeru__free-fantasy-enemy-monst_2` |
| Free Fantasy Enemy Monster Asset Pack: Boss Expansion Vol.06 | miraeru | conditions de l'auteur (SOURCE.txt) | [itch](https://miraeru.itch.io/free-fantasy-enemy-monster-asset-pack-boss-expansion-vol06) | `ennemis/itch/miraeru__free-fantasy-enemy-monster-` |
| FREE RPG Monster Pack | pipoya | conditions de l'auteur (SOURCE.txt) | [itch](https://pipoya.itch.io/free-rpg-monster-pack) | `ennemis/itch/pipoya__free-rpg-monster-pack` |
| Spring Monster Pack | tiopalada | conditions de l'auteur (SOURCE.txt) | [itch](https://tiopalada.itch.io/spring-monster-pack) | `ennemis/itch/tiopalada__spring-monster-pack` |

### Effets de sorts — 8 packs

| Titre | Auteur | Licence | Source | Dossier |
|---|---|---|---|---|
| Gothicvania Magic Pack 9 | ansimuz | CC0 | [opengameart](https://opengameart.org/content/gothicvania-magic-pack-9) | `effets_et_sorts/opengameart/gothicvania-magic-pack-9` |
| Pixel Art VFX - Halloween | frostwindz | conditions de l'auteur (SOURCE.txt) | [itch](https://frostwindz.itch.io/pixel-art-animations-halloween) | `effets_et_sorts/itch/frostwindz__pixel-art-animations-hal` |
| Pixel Art VFX - Lightning | frostwindz | conditions de l'auteur (SOURCE.txt) | [itch](https://frostwindz.itch.io/pixel-art-skill-animations-lightning) | `effets_et_sorts/itch/frostwindz__pixel-art-skill-animatio` |
| Hitspark FX | jasontomlee | conditions de l'auteur (SOURCE.txt) | [itch](https://jasontomlee.itch.io/hitspark-fx) | `effets_et_sorts/itch/jasontomlee__hitspark-fx` |
| Fantasy Warrior | luizmelo | conditions de l'auteur (SOURCE.txt) | [itch](https://luizmelo.itch.io/fantasy-warrior) | `effets_et_sorts/itch/luizmelo__fantasy-warrior` |
| Super Pixel Effects Gigapack | untiedgames | conditions de l'auteur (SOURCE.txt) | [itch](https://untiedgames.itch.io/super-pixel-effects-gigapack) | `effets_et_sorts/itch/untiedgames__super-pixel-effects-gig` |
| Super Pixel Fantasy FX Pack 3 | untiedgames | conditions de l'auteur (SOURCE.txt) | [itch](https://untiedgames.itch.io/super-pixel-fantasy-fx-pack-3) | `effets_et_sorts/itch/untiedgames__super-pixel-fantasy-fx-` |
| Vivid Motion: Combat Arcana Vol. 1 | vivid-motion-assets | conditions de l'auteur (SOURCE.txt) | [itch](https://vivid-motion-assets.itch.io/vivid-motion-combat-arcana-vol-1) | `effets_et_sorts/itch/vivid-motion-assets__vivid-motion-co` |

### Habillages de fenêtres — 2 packs

| Titre | Auteur | Licence | Source | Dossier |
|---|---|---|---|---|
| Casper Gaming Windowskins for RPG Maker MZ | casper-gaming | conditions de l'auteur (SOURCE.txt) | [itch](https://casper-gaming.itch.io/casper-gaming-windowskins) | `autres/itch/casper-gaming__casper-gaming-windows` |
| 8 Windowskins, 49 Colors - RPG Maker MV | theunpropro | conditions de l'auteur (SOURCE.txt) | [itch](https://theunpropro.itch.io/rmmv-windowskinpack-2) | `autres/itch/theunpropro__rmmv-windowskinpack-2` |
