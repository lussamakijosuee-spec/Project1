# 💀 Kit de combat — le Dément tombé (Vesper démente)
### Prêt à saisir dans l'éditeur RPG Maker MV

> Le Dément tombé canonique = **Vesper** (l'héroïne de l'Esprit) qui a touché le
> Fond. Emplacements **déjà réservés** par la matrice des Chutes :
> **Ennemi 404** · **Troupe 507**. IDs de compétence **libres : 461-467**.
>
> Rappel : une grande partie du comportement est **injectée par les plugins**
> (tu n'as pas à la recréer) — voir « Ce que les plugins ajoutent » plus bas.

---

## 1) Les compétences à créer (Base de données ▸ Compétences)

> Utilise les **IDs libres 461-465**. Vesper est une manieuse de la **Parole**
> (magie, à base de **a.mat**). Elle est folle : **coût en PM = 0** partout.

### 461 — Verbe Brisé  *(attaque de base)*
| Champ | Valeur |
|---|---|
| Type de compétence | Magie |
| Coût PM | 0 |
| Portée | 1 ennemi |
| Occasion | Toujours |
| Formule de dégâts | `a.mat * 4 - b.mdf * 2` |
| Type de dégâts | Dégât PV · Élément **Esprit/Positif** (id 3) |
| Animation | **413** (Cercle de runes) |
| Message | `%1 récite un mot qui n'existe pas.` |

### 462 — « Reste. »  *(le Verbe qui enchaîne)*
| Champ | Valeur |
|---|---|
| Type / Coût / Portée | Magie · 0 · 1 ennemi |
| Formule | `a.mat * 2` |
| Effet | **+État « Immobilisé/Paralysie »** (ton state existant), durée 1-2 tours, ~70 % |
| Animation | **417** (L'Œil) |
| Message | `« Reste. » La voix de %1 cloue sur place.` |

### 463 — Murmure du Fond  *(AoE + ronge la raison)*
| Champ | Valeur |
|---|---|
| Type / Coût / Portée | Magie · 0 · **tous les ennemis** |
| Formule | `a.mat * 3 - b.mdf` |
| Animation | **445** (Étoiles noires, plein écran) |
| Note *(optionnel, YEP_SkillCore actif)* | ↓ ronge la santé mentale des cibles |

```
<Post-Damage Eval>
if (window.Ame && target.isActor()) Ame.mauvais(target.actorId(), 1);
</Post-Damage Eval>
```

### 464 — Fausse Guérison  *(le mensonge)*
| Champ | Valeur |
|---|---|
| Type / Coût / Portée | Magie · 0 · 1 ennemi |
| Formule | `a.mat * 3` |
| Type de dégâts | **Dégât PV** *(mais animation de soin — c'est le piège)* |
| Animation | **449** (Volutes d'âme — ressemble à un soin) |
| Message | `%1 te « soigne ». Ça brûle.` |

### 465 — Regard du Fond  *(finish, à bas PV)*
| Champ | Valeur |
|---|---|
| Type / Coût / Portée | Magie · 0 · **tous les ennemis** |
| Formule | `a.mat * 5 - b.mdf * 2` |
| Animation | **453** (Corruption / glitch, plein écran) |
| Occasion | réservée (déclenchée par le pattern à PV < 40 %) |
| Message | `%1 te regarde comme on regarde un personnage.` |

---

## 2) L'ennemi à créer (Base de données ▸ Ennemis ▸ **404**)

**Nom** : `Vesper, le Reflet du Fond`  *(ou « Vesper démente »)*

**Image** : un portrait glitché de Vesper (ex. `portrait_glitch1-4` fournis).

**Paramètres** *(base autonome ; si tu déclenches la chute via le système, `ChutesDefinitives` REMPLACE ces stats par les vraies de Vesper : PV ×7, MAT ×1.6)* :
| PV | PM | ATK | DEF | MAT | MDF | AGI | LUK |
|---|---|---|---|---|---|---|---|
| 6500 | 999 | 90 | 70 | **210** | 120 | **160** | 90 |

**Or / EXP / Butin** : au choix *(0 si tu veux insister sur « il n'y avait rien »)*.

**Traits** (Base de données ▸ onglet Traits) :
- Résistance élémentaire : **Esprit/Positif** faible ×0.5 *(elle EST l'Esprit)* ;
- Vulnérabilité : **Négatif/Sombre** ×1.25 *(le corps la ramène au réel)* ;
- **Immunité** aux états de peur/confusion *(elle est déjà au Fond)* ;
- Type d'action : « + AGI élevé » (elle passe souvent en premier — réflexes).

**Schéma d'action** (onglet Actions) :
| Compétence | Condition | Priorité |
|---|---|---|
| Verbe Brisé (461) | toujours | 5 |
| « Reste. » (462) | Tour ≥ 2 | 4 |
| Murmure du Fond (463) | Tour % 3 = 0 | 4 |
| Fausse Guérison (464) | toujours | 3 |
| Regard du Fond (465) | **PV < 40 %** | 6 |

**Note de l'ennemi** *(la case Note, en bas)* :
```
<DementTombe>
<Ame: curiosite>
<Marque: felee>
<Verite: elle t'a vu, toi. Pas le héros. Toi.>
```

---

## 3) La troupe (Base de données ▸ Groupes ▸ **507**)

- **Membre** : Ennemi **404** (Vesper, le Reflet du Fond), centré.
- *(Option « hallucination »)* ajoute **2 échos** (le même 404, ou un ennemi
  faible « Écho ») **en semi-transparence** — que tu fais disparaître au tour 1
  par un événement de combat : « lesquels étaient réels ? »
- **Événement de combat** (page 1, condition *Tour 0*), pour l'entrée :

```
◆ Texte : \C[8]Elle est toujours là, à sa place dans la rangée.
◆ Texte : \C[8]Elle sourit. « Enfin. On peut finir, tous les deux. »
```

> `Codex_Chutes` ajoutera **tout seul**, au 1er tour, la réplique qui lit tes
> Reprises (« Il t'a regardé remonter N fois. Moi aussi maintenant. »).

---

## 4) Déclencher la chute (dans ton scénario)

- **Automatique** : les rencontres **201-204** branchent déjà sur le type de
  Chute (`Destins.chute(n)`) et lancent la bonne troupe — pose le PNJ, appelle
  l'événement commun. Rien d'autre à faire.
- **Manuel / mise en scène** : quand Vesper doit sombrer en cours de route,
  `DEMENT chute 4`. Au bout de 2-3 combats, la trahison se déclenche seule
  (elle quitte le groupe et devient l'ennemi). Avant la bascule, `DEMENT ancrage 4`
  tente le sauvetage par les alliés lucides.
- **Combat direct** (test) : lance la **troupe 507**.

---

## 5) Ce que les plugins AJOUTENT (ne le recrée pas)

Sur un ennemi noté `<DementTombe>`, tu obtiens gratuitement :
- **Codex_Chutes** : il **copie une compétence du groupe** (~35 %/tour) ; au 1er
  tour, il **lit ton nombre de Reprises**.
- **DementInterne** : il **parle avec vos répliques** recyclées ; son Verbe se
  tord — **« Viens »** attire un allié au hasard dans sa ligne.
- **TheatreDement** (si le chef est encore phase ≤ 3) : les **PV/noms affichés
  mentent** pendant le combat.
- **LeMur** (au Fond) : distorsion de l'écran, manifestations méta.

Donc ton kit de base peut rester **sobre** : les plugins font le sel.

---

## 6) Animations utiles (catalogue 361-460)
413 Runes (Paroles) · 417 L'Œil (lucidité) · 445 Étoiles noires · 449 Volutes
d'âme · 453 Corruption/glitch (méta) · 457 Mains de l'ombre (peur).
Chaque effet a 4 teintes (base/Violet/Rose/Or) → prends la **·Violet** pour le
Fond si tu veux la couleur du Dément.
