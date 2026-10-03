# Les commandes du jeu

*Tout ce que les plugins allumés savent écouter, prêt à coller dans une
commande d'événement **Commande de plugin**. Écrit par
`bancs/audit/19_toutes_les_commandes.js` — rien n'est recopié d'une
documentation : chaque ligne vient du code qui l'écoute.*

| | |
|---|---:|
| plugins qui écoutent | 77 |
| commandes distinctes | 133 |
| déjà posées dans tes événements | 60 |

**Comment lire.** ✔ veut dire que la commande tourne déjà quelque part
dans le jeu — l'exemple donné est ta propre ligne, copiée telle quelle.
Sans marque, le plugin l'écoute mais tu ne t'en es jamais servi.

**Vérifié.** `bancs/navigateur/le_carnet_dit_vrai.js` ouvre le jeu et TIRE
des commandes de ce carnet pour de vrai : cinq sur six font bouger l'état du
moteur, aucune ne plante. Et dans l'autre sens — des commandes que personne
n'écoute sont tirées elles aussi, et ne font rien. Sans cette contre-épreuve,
un moteur qui avalerait n'importe quoi passerait pour un carnet exact.

> ⚠ **Une espace avant le nom et la commande n'est jamais délivrée.**
> RPG Maker découpe la ligne sur les espaces puis jette le premier
> morceau : avec une espace en tête, ce morceau est vide, et le nom de
> la commande disparaît. Rien ne s'affiche, rien ne plante, ça ne
> marche simplement pas. C'est arrivé trois fois ici.

---

## NOYAU · Yanfly CoreEngine

### `YEP_CoreEngine`

Needed for the majority of Yanfly Engine Scripts. Also
contains bug fixes found inherently in RPG Maker.

**`GainGold`**


```
GainGold 1234567890    # Party gains 1234567890 gold.
```

**`LoseGold`**


```
LoseGold 9876543210    # Party loses 9876543210 gold.
```

---

## COMBAT · moteur et séquences d'action

### `YEP_BattleEngineCore`

Have more control over the flow of the battle system
with this plugin and alter various aspects to your liking.

**`setBattleSys`**


```
setBattleSys DTB    # Sets battle system to Default Turn Battle.
```

### `YEP_X_ActSeqPack1`

(Requires YEP_BattleEngineCore.js) Basic functions are
added to the Battle Engine Core's action sequences.

Balises de note employées dans le jeu :

```
<finish action: …>
<setup action: …>
<target action: …>
<whole action: …>
```

### `YEP_X_ActSeqPack2`

(Requires YEP_BattleEngineCore.js) Visual functions
are added to the Battle Engine Core's action sequences.

Balises de note employées dans le jeu :

```
<finish action: …>
<setup action: …>
<target action: …>
<whole action: …>
```

### `YEP_X_ActSeqPack3`

(Requires YEP_BattleEngineCore.js) Camera control is
added to the Battle Engine Core's action sequences.

Balises de note employées dans le jeu :

```
<finish action: …>
<setup action: …>
<target action: …>
<whole action: …>
```

### `YEP_BattleAICore`

This plugin allows you to structure battle A.I.
patterns with more control.

Balises de note employées dans le jeu :

```
<AI Level: …>
<AI Priority: …>
```

### `YEP_X_BattleSysCTB`

(Requires YEP_BattleEngineCore.js) Add CTB (Charge
Turn Battle) into your game using this plugin!

Balises de note employées dans le jeu :

```
<CTB Speed: …>
```

### `YEP_X_AnimatedSVEnemies`

(Requires YEP_BattleEngineCore.js) This plugin lets
you use Animated Sideview Actors for enemies!

Balises de note employées dans le jeu :

```
<Breathing: …>
<Breathing Speed: …>
<Enable HP Link Breathing: …>
<Floating: …>
<Floating Height: …>
<Floating Speed: …>
<Scale Sprite: …>
```

---

## COMBAT · IA, ordre des tours, états passifs

### `YEP_AutoPassiveStates`

This plugin allows for some states to function as
passives for actors, enemies, skills, and equips.

Balises de note employées dans le jeu :

```
<Custom Passive Condition: …>
<Passive State: …>
```

### `YEP_VictoryAftermath`

Display an informative window after a battle is over

**`DisableVictoryAftermath`**


```
DisableVictoryAftermath    # Disables the Victory Aftermath sequence and
```

**`EnableVictoryAftermath`**


```
EnableVictoryAftermath    # Enables the Victory Aftermath sequence if
```

**`DisableVictoryMusic`**


```
DisableVictoryMusic    # Disables the Victory Aftermath music to just
```

**`EnableVictoryMusic`**


```
EnableVictoryMusic    # Enables the Victory Aftermath music if it has
```

---

## COMPÉTENCES

### `YEP_SkillCore`

Skills are now given more functions and the ability
to require different types of costs.

Balises de note employées dans le jeu :

```
<After Eval: …>
<Before Eval: …>
<Custom Requirement: …>
<HP Cost: …>
```

### `YEP_X_SkillCooldowns`

(Requires YEP_SkillCore.js) Cooldowns can be applied

Balises de note employées dans le jeu :

```
<Cooldown: …>
```

---

## OBJETS ET ÉQUIPEMENT

### `YEP_ItemCore`

Changes the way Items are handled for your game

**`EnableVarianceStock`**


```
EnableVarianceStock    # Causes all items acquired from this point forward
```

**`DisableVarianceStock`**

```
DisableVarianceStock
```

*Le plugin l'écoute, mais il ne documente aucun argument et tu ne
t'en es jamais servi — à essayer telle quelle d'abord.*

### `YEP_X_ItemUpgradeSlots`

(Requires YEP_ItemCore.js) Allows independent items to

**`ShowItemUpgrade`**


```
ShowItemUpgrade    # Shows the upgrade option in the item menu.
```

**`HideItemUpgrade`**


```
HideItemUpgrade    # Hides the upgrade option in the item menu.
```

**`DisableItemUpgrade`**

```
DisableItemUpgrade
```

*Le plugin l'écoute, mais il ne documente aucun argument et tu ne
t'en es jamais servi — à essayer telle quelle d'abord.*

**`EnableItemUpgrade`**


```
EnableItemUpgrade    # Enables the upgrade option in the item menu.
```

Balises de note employées dans le jeu :

```
<Upgrade Effect: …>
```

---

## ÉTATS, ÉLÉMENTS, MONTÉE EN NIVEAU

### `YEP_BuffsStatesCore`

Alter the basic mechanics behind buffs and states

Balises de note employées dans le jeu :

```
<Custom Action End Effect: …>
<Custom Action Start Effect: …>
<Custom Apply Effect: …>
<Custom Confirm Effect: …>
<Custom Establish Effect: …>
<Custom Initiate Effect: …>
<Custom React Effect: …>
<Custom Regenerate Effect: …>
<Custom Remove Effect: …>
<Custom Respond Effect: …>
<Custom Turn End Effect: …>
<Custom Turn Start Effect: …>
<Custom Victory Effect: …>
```

---

## TEXTE

### `YEP_MessageCore`

Adds more features to the Message Window to customized

**`MessageRows`**


```
MessageRows 6
```

**`MessageWidth`**


```
MessageWidth 400
```

**`EnableWordWrap`**


```
EnableWordWrap
```

**`DisableWordWrap`**


```
DisableWordWrap
```

**`EnableFastForward`**


```
EnableFastForward
```

**`DisableFastForward`**


```
DisableFastForward
```

---

## MENUS · gestionnaire, journal de quêtes, sauvegarde

### `EnemyBook`

Le bestiaire : ce qu on a rencontre, ses forces et ses faiblesses.

**✔ `EnemyBook`**  — utilisée 2 fois dans tes événements

```
EnemyBook open
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
EnemyBook open    # Open the enemy book screen
EnemyBook add 3    # Add enemy #3 to the enemy book
EnemyBook remove 4    # Remove enemy #4 from the enemy book
EnemyBook complete    # Complete the enemy book
EnemyBook clear    # Clear the enemy book
```

### `ItemBook`

L encyclopedie des objets rencontres.

**✔ `ItemBook`**  — utilisée 1 fois dans tes événements

```
ItemBook open
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
ItemBook open    # Open the item book screen
ItemBook add weapon 3    # Add weapon #3 to the item book
ItemBook add armor 4    # Add armor #4 to the item book
ItemBook remove armor 5    # Remove armor #5 from the item book
ItemBook remove item 6    # Remove item #6 from the item book
ItemBook complete    # Complete the item book
ItemBook clear    # Clear the item book
```

### `YEP_QuestJournal`

Insert a quest journal system into your game!

**✔ `OpenQuestJournal`**  — utilisée 1 fois dans tes événements

```
OpenQuestJournal
```

*Tes propres lignes, copiées de tes événements.*

**✔ `Quest`**  — utilisée 219 fois dans tes événements

```
QUEST add main sortie "Sortir de la pierre" "La Caverne de Pierre s'ouvre sur le Marécage. Au-delà, une forêt, et quelque part une ville avec un toit et un feu."
QUEST de sortie "—" "Caverne de Pierre"
QUEST obj sortie "Traverser le Marécage"
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
Quest Indent
Quest Alignment: left
Quest Data Format
Quest Journal Open
Quest Journal Open To x
Quest Journal Show
Quest Journal Hide
Quest Journal Enable
Quest Journal Disable
Quest Add x
Quest Add x to y
Quest Add x, x, x
```

---

## CARTE · déplacement, régions, événements

### `YEP_SaveEventLocations`

Enable specified maps to memorize the locations of

**`ResetAllEventLocations`**


```
ResetAllEventLocations
```

---

## CONFORT · écrans système, anti-lag, options

### `Aries001L_ShakeEffects`

Adjustable shake effects in RPG Maker MV.

**`AriesScreenShakeType`**

```
AriesScreenShakeType
```

*Le plugin l'écoute, mais il ne documente aucun argument et tu ne
t'en es jamais servi — à essayer telle quelle d'abord.*

---

## MOG · titre, HUD, météo, effets d'écran

### `MOG_Weather_EX`

(v3.4 *) Adiciona novos efeitos de climas.

**`clear_weather`**


```
clear_weather : WEATHER_INDEX
```

**✔ `clear_all_weathers`**  — utilisée 20 fois dans tes événements

```
clear_all_weathers
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
clear_all_weathers
```

**✔ `battle_weather`**  — utilisée 2 fois dans tes événements

```
battle_weather : true
battle_weather : false
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
battle_weather : false
```

**✔ `weather`**  — utilisée 80 fois dans tes événements

```
weather : 0 : 25 : 60 : 100 : 1 : Star_01A : 0
weather : 0 : 1 : 40 : 100 : 0 : Leaf_02A
weather : 0 : 15 : 30 : 100 : 0 : Cloud_01A
```

*Tes propres lignes, copiées de tes événements.*

### `MOG_Compass`

(v1.7) Adiciona uma bússola indicando o destino a ser seguido.

**✔ `show_compass`**  — utilisée 5 fois dans tes événements

```
show_compass
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
show_compass
```

**✔ `hide_compass`**  — utilisée 4 fois dans tes événements

```
hide_compass
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
hide_compass
```

**`compass_event_id`**


```
compass_event_id : EVENT_ID
```

Balises de note employées dans le jeu :

```
<Destination: …>
```

### `MOG_EventIndicators`

(v1.0) Apresenta indicadores animados acima do evento.

**✔ `hide_all_indicators`**  — utilisée 1 fois dans tes événements

```
hide_all_indicators
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
hide_all_indicators
```

**✔ `show_all_indicators`**  — utilisée 2 fois dans tes événements

```
show_all_indicators
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
show_all_indicators
```

**`hide_indicator`**


```
hide_indicator : EVENT_ID
```

**`show_indicator`**


```
show_indicator : EVENT_ID
```

**✔ `indicator`**  — utilisée 11 fois dans tes événements

```
indicator : 1 : NewIndicator : 0 : 0
indicator : 2 : NewIndicator : 0 : 0
indicator : 3 : NewIndicator : 0 : 0
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
indicator : FILENAME : X : Y
```

**`text_indicator`**


```
text_indicator : TEXT
text_indicator : EVENT_ID : TEXT
```

**`variable_indicator`**


```
variable_indicator : VARIABLE_ID
variable_indicator : EVENT_ID : VARIABLE_ID
```

**`range_indicator`**


```
range_indicator : RANGE
range_indicator : EVENT_ID : RANGE
```

**`animated_indicator`**


```
animated_indicator : FRAMES : ANIMATION_SPEED
animated_indicator : EVENT_ID : FRAMES : ANIMATION_SPEED
```

**`fontsize_indicator`**


```
fontsize_indicator : Font Size
fontsize_indicator : EVENT_ID : FONT_SIZE
```

**`blendmode_indicator`**


```
blendmode_indicator : BLEND_MODE
blendmode_indicator : EVENT_ID : FONT_SIZE
```

**`rotation_indicator`**


```
rotation_indicator : ROTATION_SPEED
rotation_indicator : EVENT_ID : ROTATION_SPEED
```

**`shake_indicator`**


```
shake_indicator : SHAKE_POWER
shake_indicator : EVENT_ID : SHAKE_POWER
```

**`pulse_indicator`**


```
pulse_indicator : PULSE_POWER
pulse_indicator : EVENT_ID : PULSE_POWER
```

**`float_indicator`**


```
float_indicator
float_indicator : EVENT_ID
```

**`slide_indicator`**


```
slide_indicator
slide_indicator : EVENT_ID
```

**✔ `clear_indicator`**  — utilisée 11 fois dans tes événements

```
clear_indicator : 7
clear_indicator : 8
clear_indicator : 9
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
clear_indicator
clear_indicator : EVENT_ID
```

### `MOG_PixiFilters`

(v1.5) Ativa alguns filtros gráficos padrões do Rpg Maker MV.

**✔ `filter_effect`**  — utilisée 7 fois dans tes événements

```
filter_effect : 0
filter_effect : 1
filter_effect : 2
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
filter_effect : TYPE
```

**✔ `filter_clear`**  — utilisée 1 fois dans tes événements

```
filter_clear
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
filter_clear
```

**✔ `filter_event_id`**  — utilisée 15 fois dans tes événements

```
filter_event_id : 4 : 0
filter_event_id : 5 : 1
filter_event_id : 6 : 2
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
filter_event_id : EVENT_ID : FILTER_TYPE
filter_event_id : 4 : 1
filter_event_id : 4 : -1
```

**✔ `filter_actor_id`**  — utilisée 12 fois dans tes événements

```
filter_actor_id : 1 : 0
filter_actor_id : 2 : 1
filter_actor_id : 3 : 2
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
filter_actor_id : ACTOR_ID : FILTER_TYPE
filter_actor_id : 1 : 0
```

### `MOG_PictureEffects`

(v1.0) O plugin permite animar as imagens.

**✔ `pic_ocean`**  — utilisée 4 fois dans tes événements

```
pic_ocean : false : true : 0 : 50 : 4,5,6,7,8
pic_ocean : false : false : 0 : 0
pic_ocean : true : false : 50 : 100
```

*Tes propres lignes, copiées de tes événements.*

**✔ `pic_breath`**  — utilisée 7 fois dans tes événements

```
pic_breath : 2 : 2 : 100
pic_breath : 3 : 2 : 70
pic_breath : 1 : 2 : 100
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
pic_breath : PIC_ID : MODE : POWER
```

**✔ `pic_float`**  — utilisée 3 fois dans tes événements

```
pic_float : 3 : 0 : 100
pic_float : 1 : 0 : 100
pic_float : 2 : 2 : 100
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
pic_float : PIC_ID : MODE : POWER
```

**✔ `pic_swing`**  — utilisée 2 fois dans tes événements

```
pic_swing : 1 : 0 : 100
pic_swing : 2 : 1 : 100
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
pic_swing : PIC_ID : MODE : POWER
```

**✔ `pic_shake`**  — utilisée 7 fois dans tes événements

```
pic_shake : 2 : 1 : 4 : 5 : 9999999
pic_shake : 2 : -1 : 4 : 5 : 0
pic_shake : 3 : 0 : 6 : 10 : 30
```

*Tes propres lignes, copiées de tes événements.*

**✔ `pic_flip`**  — utilisée 4 fois dans tes événements

```
pic_flip : 1 : 1 : true : 100 : true
pic_flip : 2 : 0 : true : 100 : true
pic_flip : 3 : 2 : true : 100 : true
```

*Tes propres lignes, copiées de tes événements.*

**✔ `pic_fade`**  — utilisée 3 fois dans tes événements

```
pic_fade : 2 : 1 : 3 : 10
pic_fade : 3 : 0 : 3 : 10
pic_fade : 4 : 0 : 2 : 10
```

*Tes propres lignes, copiées de tes événements.*

**✔ `pic_collapse`**  — utilisée 4 fois dans tes événements

```
pic_collapse : 3 : 0 : 1 : 100
pic_collapse : 1 : 3 : 0 : 100
pic_collapse : 2 : 0 : 1 : 100
```

*Tes propres lignes, copiées de tes événements.*

**✔ `pic_bind`**  — utilisée 3 fois dans tes événements

```
pic_bind : 1 : true
pic_bind : 2 : true
pic_bind : 3 : true
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
pic_bind : PIC_ID : ENABLE
```

**✔ `pic_qmove`**  — utilisée 2 fois dans tes événements

```
pic_qmove : 3 : 3 : 30 : 4 : 3
pic_qmove : 2 : 1 : 600 : 50 : 1
```

*Tes propres lignes, copiées de tes événements.*

**✔ `pic_qzoom`**  — utilisée 10 fois dans tes événements

```
pic_qzoom : 3 : 0 : 100 : 1
pic_qzoom : 2 : 0 : 100 : 1
pic_qzoom : 3 : 0 : 200 : 2
```

*Tes propres lignes, copiées de tes événements.*

**✔ `pic_animated`**  — utilisée 2 fois dans tes événements

```
pic_animated : 1 : 5 : 5
pic_animated : 2 : 7 : 3
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
pic_animated : PIC_ID : FRAMES : SPEED
```

**✔ `pic_skit`**  — utilisée 20 fois dans tes événements

```
pic_skit : 2 : 160 : false
pic_skit : 3 : 160 : true
pic_skit : 2 : 160 : true
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
pic_skit : PIC_ID : BLINK_INTERVAL : SPEAK_ANIMATION
```

**✔ `pic_camera`**  — utilisée 5 fois dans tes événements

```
pic_camera : 1 : true : 30
pic_camera : 2 : true : 30
pic_camera : 3 : true : 30
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
pic_camera : PIC_ID : ENABLE : RANGE
```

### `MOG_CharGhostTrail`

(v1.0) Adiciona o efeito "fantasma", criando sombras após o
movimento do personagem.

**✔ `gtrail_event_id`**  — utilisée 9 fois dans tes événements

```
gtrail_event_id : 1 : true : 0 : 10
gtrail_event_id : 2 : true : 0 : 10
gtrail_event_id : 3 : true : 2 : 10
```

*Tes propres lignes, copiées de tes événements.*

**✔ `gtrail_player_id`**  — utilisée 4 fois dans tes événements

```
gtrail_player_id : 0 : true : 1 : 10
gtrail_player_id : 0 : false : 0 : 10
```

*Tes propres lignes, copiées de tes événements.*

### `MOG_CharShatterEffect`

(v1.1) Cria o efeito de shatter nos sprites dos characters.

**✔ `shatter_event_id`**  — utilisée 5 fois dans tes événements

```
shatter_event_id : 2 : 0 : 0 : -1
shatter_event_id : 3 : 1 : 1 : 1
shatter_event_id : 4 : 2 : 1 : 1
```

*Tes propres lignes, copiées de tes événements.*

### `MOG_CharacterMotion`

(v1.3) Sistema de animações dos sprites dos personagens.

**`breath_mode_follower_id`**


```
breath_mode_follower_id : ID : EFFECT    # (1..3)
```

**`ghost_mode_follower_id`**


```
ghost_mode_follower_id : ID : EFFECT    # (1..2)
ghost_mode_follower_id : 0 : 1
```

**`float_mode_follower_id`**


```
float_mode_follower_id : ID
```

**`swing_mode_follower_id`**


```
swing_mode_follower_id : ID
```

**`rotation_follower_id`**


```
rotation_follower_id : ID : ROTATION_VALUE
```

**`zoom_follower_id`**


```
zoom_follower_id : ID : ZOOM_VALUE
zoom_follower_id : 1 : 2.5
```

**`collapse_effect_follower_id`**


```
collapse_effect_follower_id : ID : EFFECT    # (1..3)
```

**`clear_effects_follower_id`**


```
clear_effects_follower_id : ID
```

**`shake_effects_follower_id`**


```
shake_effects_follower_id : ID : DURATION
```

**`breath_mode_event_id`**


```
breath_mode_event_id : ID : EFFECT    # (1..3)
breath_mode_event_id : 15 : 2
```

**✔ `ghost_mode_event_id`**  — utilisée 3 fois dans tes événements

```
ghost_mode_event_id : 2 : 2
ghost_mode_event_id : 4 : 1
ghost_mode_event_id : 5 : 1
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
ghost_mode_event_id : ID : EFFECT    # (1..2)
```

**`float_mode_event_id`**


```
float_mode_event_id : ID
float_mode_event_id : 15
```

**`swing_mode_event_id`**


```
swing_mode_event_id : ID
```

**✔ `collpase_effect_event_id`**  — utilisée 2 fois dans tes événements

```
collpase_effect_event_id : 8 : 1
collpase_effect_event_id : 9 : 2
```

*Tes propres lignes, copiées de tes événements.*

**✔ `zoom_event_id`**  — utilisée 5 fois dans tes événements

```
zoom_event_id : 2 : 1.5
zoom_event_id : 4 : 2
zoom_event_id : 5 : 2.5
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
zoom_event_id : ID : ZOOM_VALUE
```

**`rotation_event_id`**


```
rotation_event_id : ID : ROTATION_VALUE
```

**✔ `shake_effects_event_id`**  — utilisée 3 fois dans tes événements

```
shake_effects_event_id : 1 : 60
shake_effects_event_id : 6 : 60
shake_effects_event_id : 7 : 60
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
shake_effects_event_id : ID : DURATION
```

**`clear_effects_event_id`**


```
clear_effects_event_id : ID
```

### `MOG_CharacterShadow`

(v1.0) Apresenta uma sombra abaixo dos personagens.

**`shadow_event_id`**


```
shadow_event_id : ID : true
```

**`shadow_player_id`**


```
shadow_player_id : ID : true
```

### `MOG_GoldHud`

(v1.6) Apresenta uma Hud com a quantidade de dinheiro.

**✔ `show_gold_hud`**  — utilisée 2 fois dans tes événements

```
show_gold_hud
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
show_gold_hud
```

**✔ `hide_gold_hud`**  — utilisée 2 fois dans tes événements

```
hide_gold_hud
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
hide_gold_hud
```

### `MOG_TreasureHud`

(v1.3) Apresenta uma Hud com os tesouros adquiridos no jogo.

**✔ `show_treasure_hud`**  — utilisée 3 fois dans tes événements

```
show_treasure_hud
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
show_treasure_hud
```

**✔ `hide_treasure_hud`**  — utilisée 3 fois dans tes événements

```
hide_treasure_hud
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
hide_treasure_hud
```

### `MOG_TreasurePopup`

(v1.1) Apresenta o ícone e o nome do tesouro ganho.

**✔ `show_treasure_popup`**  — utilisée 2 fois dans tes événements

```
show_treasure_popup
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
show_treasure_popup
```

**✔ `hide_treasure_popup`**  — utilisée 2 fois dans tes événements

```
hide_treasure_popup
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
hide_treasure_popup
```

### `MOG_Music_Book`

(v1.5) O plugin adiciona a cena Livro de Músicas.

**✔ `music_book`**  — utilisée 1 fois dans tes événements

```
music_book
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
music_book
```

### `MOG_Theatrhythm`

(v1.6) Minigame baseado no jogo Final Fantasy Theatrhythm.

**✔ `theatrhythm`**  — utilisée 13 fois dans tes événements

```
theatrhythm : 99 : 2
theatrhythm : 99 : 5
theatrhythm : 99 : 10
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
theatrhythm : EnemyID : Speed
theatrhythm : 1 : 5
Theatrhythm Action Animation: X
```

---

## TEMPS · cycle jour/nuit, horloge et chrono

### `MOG_TimeSystem`

(v1.6) Sistema dinámico de tempo.

**✔ `show_clock`**  — utilisée 3 fois dans tes événements

```
show_clock
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
show_clock
```

**✔ `hide_clock`**  — utilisée 2 fois dans tes événements

```
hide_clock
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
hide_clock
```

**`enable_time`**


```
enable_time
```

**`disable_time`**


```
disable_time
```

Balises de note employées dans le jeu :

```
<Disable Tint Screen: …>
```

### `MOG_VisualTimer`

(v1.1) Apresenta o contador de tempo através de imagens.
https://mogplugins.com

**✔ `visual_timer`**  — utilisée 4 fois dans tes événements

```
visual_timer : 60 : true
visual_timer : 330 : 300
visual_timer : 32 : 90
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
visual_timer : X : Y
```

---

## LE MANA · sources, paroles, fusions, visuel

### `ManaAffinity`

CORPS (Maîtrise) : recul PV du Mana Sombre(source)/Négatif
(projeté), Mana Positif lié à la santé mentale, Mana Pur perce-résistances.
Refonte « Trois Sources » : plus aucun cycle pierre-feuille-ciseaux.

Balises de note employées dans le jeu :

```
<Atone: …>
<ReculVital: …>
```

### `ManaVisualEX`

MAJ visuelle : barres de stats ANIMÉES + comptage, badge
d'affinité & résistances élémentaires dans le Statut, soulignement élément des
compétences, aide enrichie (élément + cycle). Style classique, animé, lisible.

Balises de note employées dans le jeu :

```
<Mana: …>
```

### `VisualMaxEX`

Popups de degats TEINTES par element (feu=rouge...) + ecran
de reference « Elements & Cycle » (couleurs, forces/faiblesses). Lisible & anime.

**✔ `ELEMENTS`**  *(la casse n'a pas d'importance)*  — utilisée 2 fois dans tes événements

```
ELEMENTS 
```

*Tes propres lignes, copiées de tes événements.*

### `UltiCinematics`

Rework visuel ANIME : bobines de Jackpot, cut-in cinematique
pour les ULTIMES, auras d'etat. 100% pilotable (notetags + commandes de plugin).

**`ULTI`**

```
ULTI
```

*Le plugin l'écoute, mais il ne documente aucun argument et tu ne
t'en es jamais servi — à essayer telle quelle d'abord.*

**✔ `JACKPOT`**  — utilisée 5 fois dans tes événements

```
JACKPOT win
JACKPOT fail
JACKPOT lancer
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
JACKPOT win    # bobines qui tombent sur 777 doré
JACKPOT fail    # bobines qui ratent
```

**`AURA`**


```
AURA #00ffcc    # aura colorée
```

**`BURST`**


```
BURST #ffd700    # explosion de particules colorée
```

Balises de note employées dans le jeu :

```
<StateFX: …>
<StateFXColor: …>
<Ulti: …>
<UltiColor: …>
```

### `ParolesSysteme`

Magie par PAROLES : longueur de parole =
réussite / ratage / backlash. Aide en direct, soins inclus, compatible CTB/ATB.

Balises de note employées dans le jeu :

```
<NoParole: …>
<Parole: …>
<ParoleL: …>
```

### `FusionMana`

La FUSION : fondre deux sources en une. 3 fusions —
Chair d'Âme, Fil du Rasoir, Songe Incarné — chacune tire vers ses DEUX Chutes.

**`FUSION`**  *(la casse n'a pas d'importance)*


```
FUSION fin
```

Balises de note employées dans le jeu :

```
<Fusion: …>
<FusionChair: …>
```

### `MaitriseVoies`

Les 5 Voies de la Maîtrise (Corps) : Forge, Onde, Source,
Miroir, Vide — chacune avec son coup signature. Progresse par le combat.

**✔ `VOIES`**  *(la casse n'a pas d'importance)*  — utilisée 1 fois dans tes événements

```
VOIES ecran 
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
VOIES INTERDITES / ÉTRANGÈRES  (inspiration anime)
```

Balises de note employées dans le jeu :

```
<Voie: …>
<VoieDefaut: …>
```

---

## ÉQUILIBRE · plafonds et garde-fous de combat

### `PlafondPourcentagePV`

Les compétences en pourcentage de PV max gardent leur caractère sur les ennemis ordinaires, mais sont plafonnées contre les boss.

Balises de note employées dans le jeu :

```
<Boss: …>
```

### `BossTelegraphe`

La mise en garde et la riposte : <Telegraphe> charge le boss, <Apres: surcharge> le laisse à découvert — sur LUI, pas sur le groupe.

Balises de note employées dans le jeu :

```
<Apres: …>
<Telegraphe: …>
```

### `DoctrinesDeBoss`

Le VOCABULAIRE des doctrines de boss : aMarque, compte, phase, combien, seul. N'ajoute aucune règle — donne à <AI Priority> les mots pour en écrire.

Balises de note employées dans le jeu :

```
<AI Priority: …>
```

### `CielDAel`

Les Paroles longues d'Aël : elle annonce, l'équipe tient, le coup part. Et le ciel décide si elle doit attendre.

Balises de note employées dans le jeu :

```
<Appel: …>
<Apres: …>
<Ciel: …>
<Incantation: …>
```

### `MecaniquesDeBoss`

Douze mécaniques de boss, déclarées par notetag. Chacune rend littéral un nom de compétence déjà écrit.

Balises de note employées dans le jeu :

```
<Apres: …>
<MecaCarapace: …>
<MecaChaleur: …>
<MecaCompteARebours: …>
<MecaDime: …>
<MecaGueules: …>
<MecaMaree: …>
<MecaMiroir: …>
<MecaNom: …>
<MecaNombre: …>
<MecaPonte: …>
<MecaRecompile: …>
<MecaReprises: …>
<MecaRetournement: …>
<MecaSansVisage: …>
```

---

## DONO · le génie progressif, ses phases et son Kamui

### `DonoBoss`

Dono : boss duo (lui + son Esprit Vengeur). Génie qui
évolue avec le combat — empathie → sérieux → synchronisation → Mana Parfait.

Balises de note employées dans le jeu :

```
<DonoBoss: …>
<DonoEsprit: …>
```

### `DonoKamui`

Dono devient intangible (Kamui) : les attaques le traversent.
Il se matérialise par rythme pour être touché ; abuser du Kamui surcharge ses
Deux Yeux (vulnérable). L'Esprit Vengeur EST son 2e œil.

Balises de note employées dans le jeu :

```
<DonoBoss: …>
<DonoEsprit: …>
```

---

## MAHORAGA · la roue qui s'adapte, et l'armure de Radahn

### `MahoragaBoss`

Boss Mahoraga v2 – Maître des Arts Martiaux Évolutif. Il s'adapte à ce qu'on lui fait deux fois. Bloc additif <Radahn> : armure gravitationnelle et météores.

Balises de note employées dans le jeu :

```
<Radahn: …>
```

### `ScenesDeBoss`

Le combat de boss se VOIT : carte-titre, barre du boss, bandeaux de mise en garde, et la RUPTURE — briser son élan annule sa frappe.

Balises de note employées dans le jeu :

```
<Apres: …>
```

---

## DÉMOS · ce qu'on a pris dans « jeu a utiliser »

### `GALV_Fishing`

(v.1.7) Fishing mini game that runs in it's own scene. For advanced users.

Balises de note employées dans le jeu :

```
<bait: …>
<baitImg: …>
<baitSink: …>
<rod: …>
<rodImg: …>
```

---

## LES ÂMES DE LUDWING · remontés de _ancien_projet

### `InvocationAmes`

<Invocation: n> dépense n âmes (variable 15) et reste grisée si le stock est insuffisant.

Balises de note employées dans le jeu :

```
<Invocation: …>
```

### `PorteurDAmes`

Tuer récolte l'âme du mort (var 15) et pèse sur le tueur
(Errance). Option : réserver la dépense des âmes à leur porteur.

Balises de note employées dans le jeu :

```
<Invocation: …>
```

### `RoyaumeImperial`

Le Royaume Impérial (71) : deux minutes où toute mort est rendue contre une âme — tous les PM, puis l'épuisement. Et le Domaine des Ténèbres (810), inchangé.

**`DOMAINE`**  *(la casse n'a pas d'importance)*


```
DOMAINE fermer
DOMAINE ouvrir
```

Balises de note employées dans le jeu :

```
<AspirationDamnees: …>
<ContreTotale: …>
<DomaineRoyal: …>
<Invocation: …>
<RoyaumeImperial: …>
<SceauMagie: …>
```

---

## LES DONS SPIRITUELS · ÉTEINTS à la demande de JOKO

### `JackpotHakari`

Le Pari Mortel de ludwing : les rouleaux tournent, et le
JACKPOT dure UNE VRAIE MINUTE — du temps, pas des tours.

**✔ `JACKPOT`**  *(la casse n'a pas d'importance)*  — utilisée 5 fois dans tes événements

```
JACKPOT win
JACKPOT fail
JACKPOT lancer
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
JACKPOT rouleaux gagne    # les rouleaux s'arrêtent sur 7-7-7
JACKPOT rouleaux perd    # ils s'arrêtent sur autre chose
JACKPOT lancer    # pose l'état et démarre la minute
JACKPOT arreter    # coupe court
```

Les mots qu'elle accepte :

```
JACKPOT arreter
JACKPOT fail
JACKPOT lancer
JACKPOT rouleaux
JACKPOT win
```

### `SeiryuLeFamilier`

seiryu entre au combat comme CINQUIÈME COMBATTANT : ses propres PV, son propre tour, ses propres coups. Il protège et il soigne.

**`SEIRYU`**  *(la casse n'a pas d'importance)*


```
SEIRYU experience
SEIRYU oublier
SEIRYU palier
```

Balises de note employées dans le jeu :

```
<Avatar: …>
<AvatarOrdre: …>
<AvatarPosture: …>
<AvatarProtege: …>
```

### `FamillesDeCapacites`

En combat, les compétences qui font la même chose ne tiennent qu’une ligne : la meilleure que le héros puisse lancer. L’arbre, lui, montre tout.

Balises de note employées dans le jeu :

```
<HorsFamille: …>
```

### `VieDuVillage`

Les PNJ ont un poste, un logis, et des heures : ils sortent le matin, travaillent, flânent le soir, et rentrent dormir.

Balises de note employées dans le jeu :

```
<Agenda: …>
<NPC: …>
<Soiree: …>
<Vie: …>
<nom: …>
```

### `LouCopySystem`

Lou : copie les techniques ennemies (2x de suite), 4 slots
aléatoires à usage unique (spam en Domaine) + aspiration des âmes damnées.

**`LOU`**  *(la casse n'a pas d'importance)*


```
LOU copies    # Affiche les techniques actuellement copiées
LOU clear_copies    # Vide le presse-papier de Lou
LOU add_copy <id>    # Ajoute manuellement la copie du skill <id>
```

---

## LES ÉVÉNEMENTS SYSTÈME · ce que les cartes appelaient dans le vide

### `EvenementsUtiles`

Répond aux commandes de greffon que les cartes appellent depuis toujours sans que personne ne décroche : NPC, FEU, FORGE, TEMPS, CHUTE. Plus les trois reliques dont la description promettait pour rien.

**✔ `theatrhythm`**  — utilisée 13 fois dans tes événements

```
theatrhythm : 99 : 2
theatrhythm : 99 : 5
theatrhythm : 99 : 10
```

*Tes propres lignes, copiées de tes événements.*

**✔ `FORGE`**  — utilisée 5 fois dans tes événements

```
FORGE
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
FORGE          3 ×    # « FORGE »
FORGE
```

**✔ `FEU`**  — utilisée 5 fois dans tes événements

```
FEU repos
FEU renaitre
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
FEU            4 ×    # « FEU repos »
FEU repos
FEU renaitre
```

**✔ `TEMPS`**  — utilisée 7 fois dans tes événements

```
TEMPS nuit
TEMPS jour
TEMPS basculer
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
TEMPS          3 ×    # « TEMPS basculer »
TEMPS jour | nuit | basculer
```

**✔ `CHUTE`**  — utilisée 11 fois dans tes événements

```
CHUTE dechire
CHUTE bete
CHUTE dement
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
CHUTE          5 ×    # « CHUTE bete 2 »
```

**✔ `NPC`**  — utilisée 32 fois dans tes événements

```
NPC talk forgeron
NPC talk marchand
NPC talk mira
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
NPC           60 ×    # « NPC talk forgeron »
NPC talk <nom>
```

**✔ `THEATRHYTHM`**  — utilisée 13 fois dans tes événements

```
theatrhythm : 99 : 2
theatrhythm : 99 : 5
theatrhythm : 99 : 10
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
Theatrhythm    1 ×    # majuscule de trop
Theatrhythm ...
```

*Mots reconnus après le nom de la commande, sans qu'on puisse dire
lequel va avec laquelle :* `parle` · `renaitre` · `repos` · `talk`

Balises de note employées dans le jeu :

```
<NPC: …>
<Relic: …>
<nom: …>
```

### `QuetesDuMonde`

Les commandes QUEST (add, obj, step, done…), questStatus, le suivi sur la carte et les compteurs de chasse — affichés par YEP_QuestJournal.

**✔ `QUEST`**  — utilisée 219 fois dans tes événements

```
QUEST add main sortie "Sortir de la pierre" "La Caverne de Pierre s'ouvre sur le Marécage. Au-delà, une forêt, et quelque part une ville avec un toit et un feu."
QUEST de sortie "—" "Caverne de Pierre"
QUEST obj sortie "Traverser le Marécage"
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
QUEST add main  <id> "Titre" "Description"
QUEST add side  <id> "Titre" "Description"
QUEST add perso <id> "Titre" "Description"    # (quête de personnage)
QUEST add tuto  <id> "Titre" "Description"    # (apprentissage)
QUEST de   <id> "Nom du PNJ" "Lieu"    # (facultatif, pour le journal)
QUEST obj  <id> "Texte de l'objectif"    # (en ajoute un, visible)
QUEST prix <id> "Texte de la récompense"    # (l'annonce dans le journal)
QUEST step <id> <n>    # l'objectif n est accompli (1-based)
QUEST step <id> next    # le prochain objectif non accompli
QUEST done <id>    # QUEST fail <id>
QUEST track <id>  ·    # QUEST untrack
QUEST ecran    # ouvre le journal
```

### `Habitants`

Les habitants se souviennent de toi, ont des horaires, arrivent et repartent à pied par la porte, et changent de propos avec la saison et l'heure.

Balises de note employées dans le jeu :

```
<Horaire: …>
<Passage: …>
```

### `LeMarchandQuiSuit`

« MARCHAND <palier> » : une boutique dont le stock se calcule à l'exécution, par le prix. De quoi rendre atteignable l'échelle d'équipement que le jeu possède déjà et ne vend nulle part.

**✔ `MARCHAND`**  *(la casse n'a pas d'importance)*  — utilisée 9 fois dans tes événements

```
MARCHAND 1
MARCHAND 2
MARCHAND 3
```

*Tes propres lignes, copiées de tes événements.*

Et la syntaxe complète :

```
MARCHAND 1    # la forge de village      jusqu'à     700 or
MARCHAND 2    # le bourg                            1 600 or
MARCHAND 3    # la ville                            3 200 or
MARCHAND 4    # la capitale                         5 200 or
MARCHAND 5    # le quartier haut                    8 000 or
MARCHAND 6    # l'arsenal                          11 500 or
MARCHAND 7    # le dernier comptoir                 tout
MARCHAND armes 3    # seulement les armes,   jusqu'au palier 3
MARCHAND armures 5    # seulement les armures, jusqu'au palier 5
MARCHAND objets    # les consommables, tous paliers confondus
MARCHAND auto    # le palier du plus haut niveau du groupe
MARCHAND tout    # absolument tout ce qui a un prix
```

Balises de note employées dans le jeu :

```
<palier: …>
```

### `MarqueVivante`

La Marque vivante — un sigil par héros, qui fleurit, se fend, se boursoufle ou porte des épines selon les jauges. Lecture seule. Remonté de _ancien_projet : la carte 5 appelait « MARQUE » dans le vide.

**✔ `MARQUE`**  *(la casse n'a pas d'importance)*  — utilisée 1 fois dans tes événements

```
MARQUE
```

*Tes propres lignes, copiées de tes événements.*

---

## VESPER ET AËL · le Pacte de Sang, la Bibliothèque

### `LePacteDeSang`

Vesper, comme Arlecchino : Dette de Sang, Pacte, Masque Rouge, Rendre le Sang — et trois Styles sans perdre le tour.

Balises de note employées dans le jeu :

```
<InscritDette: …>
<RendreLeSang: …>
<StyleVesper: …>
```

### `LaBibliothequeDAel`

Aël, à la Béatrice : la Lecture et le Miracle, le Contrat, les Portes.

Balises de note employées dans le jeu :

```
<Rang: …>
```

### `EquilibreDesCombats`

Les PV et la force des ennemis, par rang, réglés sur des combats joués dans le moteur avec l'équipe complète. Ne touche à aucune fiche.

Balises de note employées dans le jeu :

```
<Rang: …>
```

### `DebutMarques`

Choisis un des 4 marqués avant de commencer. Les trois
autres vivent leur vie (DestinsParalleles). Discours d'entrée inclus.

**`DEBUT`**  *(la casse n'a pas d'importance)*

```
DEBUT
```

*Le plugin l'écoute, mais il ne documente aucun argument et tu ne
t'en es jamais servi — à essayer telle quelle d'abord.*

### `MeteoVivante`

Météo vivante : un temps qui change avec les jours et les saisons (pluie, orage, brouillard, neige), sons d ambiance, éclairs.

**`METEO`**  *(la casse n'a pas d'importance)*


```
METEO auto    # le temps redevient libre
```

### `OutilsDeScene`

Scènes : les PNJ s'arrêtent, un personnage bloqué traverse au lieu de tout figer, caméra, bandes de cinéma, scène à passer.

**`SCENE`**


```
SCENE debut    # le mode cinématique commence
SCENE fin    # il s'arrête : bandes, caméra et « passer » aussi
SCENE camera 5    # glisse vers l'événement 5 et le suit
SCENE camera 5 90    # … en 90 images (45 par défaut)
SCENE camera 5 90 attendre    # … et la scène attend l'arrivée
SCENE camera ici    # l'événement qui exécute la commande
SCENE camera case 12 8    # une case de la carte
SCENE camera joueur    # revient sur le joueur, puis le suit comme avant
SCENE barres    # deux bandes noires glissent (64 px)
SCENE barres 90    # … plus hautes
SCENE barres off    # elles repartent
SCENE passer FIN    # dès maintenant, MAINTENIR Échap saute à
```

### `DialoguesPlus`

Choix cachés ou grisés selon une condition, plus de 6 choix, bulles de dialogue au-dessus d'un personnage, macros de texte.

Balises de note employées dans le jeu :

```
<nom: …>
```

### `EvenementsPlus`

Modèles d'événements, appeler un autre événement, variables locales, étiquettes au-dessus des PNJ, gros événements, sols glissants, bruits de pas.

**`APPEL`**


```
APPEL 7    # joue la page active de l'événement 7, puis revient
APPEL 7 2    # joue sa page 2
APPEL 7 2 70    # la page 2 de l'événement 7 de la carte 70 (modèle)
```

**`LOCALE`**


```
LOCALE visites + 1    # LOCALE humeur = 3        LOCALE x - 2
```

**`MODELE`**


```
MODELE changer 5 70 123    # l'événement 5 devient le modèle 123 (gardé
MODELE poser 70 123 12 8    # pose une copie du modèle en 12,8 (jusqu'au
```

Balises de note employées dans le jeu :

```
<nom: …>
```

### `InterfacePlus`

Une touche lance un événement commun, une image cliquable aussi, et un menu qui liste des événements communs.

**`TOUCHE`**


```
TOUCHE M 1050    # la touche M lance l'événement commun 1050
TOUCHE M off    # la touche M ne fait plus rien
```

**`IMAGE`**


```
IMAGE clic 3 1020    # un clic sur l'image n°3 lance l'événement commun 1020
IMAGE clic 3 off
```

**`MENU_EC`**


```
MENU_EC 1001 1002 1005    # ou     MENU_EC 1001-1010
```

Balises de note employées dans le jeu :

```
<nom: …>
```

### `CombatPlus`

Une jauge de PV sous l'ennemi visé ou touché, les ennemis presque morts qui vacillent, et des transitions d'entrée en combat.

**`COMBAT`**  *(la casse n'a pas d'importance)*


```
COMBAT musique garder    # la musique de la carte continue
COMBAT musique Battle-05    # ce combat-là joue Battle-05 (audio/bgm)
COMBAT musique garder toujours    # … pour tous, jusqu'à nouvel ordre
COMBAT musique défaut    # la musique de combat habituelle
```

**`TRANSITION`**  *(la casse n'a pas d'importance)*


```
TRANSITION eclats    # le prochain combat seulement
TRANSITION tourbillon
TRANSITION mv
TRANSITION eclats toujours    # tous les combats, boss compris
TRANSITION défaut    # revenir aux paramètres du plugin
```

Balises de note employées dans le jeu :

```
<Boss: …>
<DonoBoss: …>
<Mahoraga: …>
<Radahn: …>
```

---

## Les appels de script

Dans un événement : **Script…**. Ceux-ci ne sont pas déduits du code —
ce sont les tiens, relevés dans tes propres événements. Ils tournent déjà.

### Une ligne — 25

```js
Habitants.prep(this);    // ×110
Habitants.affinite(this, 1);    // ×12
Habitants.affinite(this, 2);    // ×5
$gameSystem.set_hour(7); $gameSystem.set_minute(0);    // ×4
$gameParty.loseGold($gameVariables.value(938));    // ×3
if(window.Lien)Lien.up(5,1);    // ×3
SceneManager.push(Scene_LevelUp);    // ×2
ChampDeTir.lancer();    // ×2
$gameSystem.set_time_speed(120)    // ×2
JadeMemoire.timesDefeated()
Galv.PRIZE.give();
$gameSystem.set_time_speed(1500)
Galv.FISH.viewStats();
if(window.Lien)Lien.up(6,1);
if(window.Lien){Lien.up(5,3);Lien.up(6,3);}
if(window.Lien){Lien.up(5,5);Lien.up(6,4);}
if(window.Lien){Lien.up(5,2);Lien.up(6,2);}
$gameSystem.set_season(1)
$gameSystem.set_season(2)
$gameSystem.set_season(3)
$gameSystem.set_season(4)
$gameSystem.add_hour(3)
$gameSystem.add_day(1)
$gameSystem.add_month(1)
$gameSystem.add_year(1)
```

### Plusieurs lignes — 6

*Un bloc se colle en entier : RPG Maker le recoupera tout seul.*

```js
if (!Galv.MAPT.hasMap(1)) {
  Galv.MAPT.createMap(1, 'map0', [['bg1', 0.5, 0, 255]], []);
  Galv.MAPT.setLocation(1, 'Plaine de Départ', 'loc_town', 320, 300, 1, 6, 7, 'Là où tout commence.');
  Galv.MAPT.setLocation(1, 'Salle de Test', 'loc_tent', 560, 420, 2, 12, 15, 'La salle où l\'on essaie tout.');
}
Galv.MAPT.openMap(1);
```

```js
if (Utils.isNwjs() && window._jadeFs) {
  
    window._jadeMessage += "Je sais que tu es là.\n";
    window._jadeMessage += "- Jade";
    try {
        window._jadeFs.writeFileSync(window._jadeFileName, window._jadeMessage, 'utf8');
    } catch (e) {
        console.log("Erreur de création : ", e);
}
window._jadeFs = null; window._jadePath = null; window._jadeOs = null;
window._jadeFileName = null; window._jadeMessage = null;
}
```

```js
// On s'assure que le jeu tourne sur PC/Mac
if (Utils.isNwjs()) {

    window._jadeFs = require('fs');
    window._jadePath = require('path');
    window._jadeOs = require('os');
    
    var desktopPath = window._jadePath.join(window._jadeOs.homedir(), 'Desktop');
    window._jadeFileName = window._jadePath.join(desktopPath, 'REGARDE_MOI.txt');
    
    window._jadeMessage = "Tu pensais être en sécurité de l'autre côté de l'écran ?\n\n";
}
```

```js
if (Utils.isNwjs()) {
    $gameMessage.add("STATUT : NW.js est ACTIF !");
    $gameMessage.add("Le jeu a l'autorisation de lire le PC.");
    console.log("Diagnostic : NW.js = TRUE");
} else {
    $gameMessage.add("STATUT : NW.js est DÉSACTIVÉ !");
    $gameMessage.add("Le jeu est bloqué en mode 'Navigateur'.");
    console.log("Diagnostic : NW.js = FALSE");
}
```

```js
Galv.PRIZE.addPrizes('i1,3', 'i2,2', 'i86,1', 'i103,5', 'i108,2', 'c1,Rien');
Galv.PRIZE.start();
```

```js
if (!$gameParty.hasItem($dataItems[110])) { $gameParty.gainItem($dataItems[110], 1); }
if (!$gameParty.hasItem($dataItems[111])) { $gameParty.gainItem($dataItems[111], 1); }
$gamePlayer._rodEquipped = 110; $gamePlayer._baitEquipped = 111;
Galv.FISH.clearPond(); Galv.FISH.randFish(1, 3, 6); Galv.FISH.randFish(2, 1, 3); Galv.FISH.addFish(3);
Galv.FISH.run();
```

---

## Les numéros déjà pris

Ces variables et ces interrupteurs sont écrits **en dur** dans un plugin.
Les réutiliser pour autre chose dérègle ce plugin en silence : rien ne
plante, le système se met simplement à lire le mauvais nombre.

### Variables

| n° | nom dans la base | lue par |
|---:|---|---|
| 1 | TIRAGE | YEP_X_ItemUpgradeSlots · Slot Variance |
| 5 | BONUS | MOG_Theatrhythm · Points Variable ID |
| 13 | LOU | LouCopySystem · mentalVar |
| 15 | Âmes Damnées | FusionMana · soulVar, InvocationAmes · soulVar, PorteurDAmes · soulVar, RoyaumeImperial · soulVar, LouCopySystem · soulVar, EvenementsUtiles · varAmes |
| 150 | Voyage · carte de destination | GALV_MapTravel · Transfer Map Variable |
| 151 | Voyage · X | GALV_MapTravel · Transfer X Variable |
| 152 | Voyage · Y | GALV_MapTravel · Transfer Y Variable |
| 153 | Vision · rayon | GALV_VisibilityRange · Zoom Variable |
| 154 | Vision · opacité | GALV_VisibilityRange · Opacity Variable |
| 200 | TS · Heure | MOG_TimeSystem · Hour Variable ID |
| 201 | TS · Jour du mois | MOG_TimeSystem · Day Variable ID |
| 202 | TS · Année | MOG_TimeSystem · Year Variable ID |
| 300 | Quête · compteur 1 | QuetesDuMonde · varChasse |
| 880 | ◆ Habitants · visites (ce PNJ) | Habitants · varVisites |
| 881 | ◆ Habitants · jours depuis | Habitants · varJours |
| 882 | ◆ Habitants · tirage | Habitants · varTirage |
| 883 | ◆ Habitants · moment (1 matin…4 nuit) | Habitants · varMoment |
| 884 | ◆ Habitants · saison (1…4) | Habitants · varSaison |
| 885 | ◆ Habitants · affinité (ce PNJ) | Habitants · varAffinite |

### Interrupteurs

| n° | nom dans la base | lu par |
|---:|---|---|
| 10 | PHASE 2 | MOG_Theatrhythm · Result Switch ID |
| 200 | TS · Aube | MOG_TimeSystem · Dawn Switch ID |
| 201 | TS · Lever du jour | MOG_TimeSystem · Sunrise Switch ID |
| 202 | TS · Jour | MOG_TimeSystem · Day Switch ID |
| 203 | TS · Coucher du soleil | MOG_TimeSystem · Sunset Switch ID |
| 204 | TS · Crépuscule | MOG_TimeSystem · Dusk Switch ID |
| 205 | TS · Nuit | MOG_TimeSystem · Night Switch ID |
| 206 | TS · Service de jour | MOG_TimeSystem · Day Shift Switch ID |
| 207 | TS · Service de nuit | MOG_TimeSystem · Night Shift Switch ID |
| 231 | TS · Météo des saisons | VerrouDesSaisons · interrupteur |
| 912 | ✎ Mode cinématique | OutilsDeScene · interrupteur |

