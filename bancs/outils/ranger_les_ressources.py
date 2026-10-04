"""
RANGER LES RESSOURCES D'INTERNET DANS LE JEU — au format RPG Maker MV
---------------------------------------------------------------------------
JOKO, le 2026-10-04 : « juste tout trier, ça serait vraiment parfait. Comme ça
j'ai juste à savoir ce que j'ai utilisé […] Si je ne veux pas utiliser, je
n'utiliserai pas. »

JOKO, ensuite : « fais des dossiers […] déplace pour que ce soit déjà préparé
en avance […] mais doucement quand même ».

Lit ressources_internet/ (chaque pack a son SOURCE.txt) et prépare, dans
ressources_internet/PRET_POUR_MV/, la MÊME arborescence que le jeu (img/faces,
img/sv_enemies…), triée en sous-dossiers par famille (morts-vivants, feu…).
RIEN n'est posé dans le jeu : JOKO copie ce qu'il veut dans img/ (l'éditeur de
MV ne lit pas les sous-dossiers : copier les FICHIERS). Tout commence par
« Z_Net_ » (en bas des listes de l'éditeur une fois copié), et
ressources_internet/INSTALLES.md dit d'où vient chaque fichier et sous quelle
licence (crédits à faire).

  img/faces       portraits carrés → visages 144 × 144, 8 par feuille (576 × 288)
  img/pictures    grands portraits (bustes, visual novel), hauteur ≤ 624
  img/characters  feuilles MV 576 × 384 et persos seuls 144 × 192 (« $ »),
                  et les feuilles 32 px (384 × 256 / 96 × 128) agrandies ×1,5
  img/sv_actors   feuilles 576 × 384 des packs de battlers vue de côté
  img/sv_enemies  un monstre par image (le jeu est en vue de côté)
  img/animations  bandes d'effets (cases carrées) → cases de 192, 5 par ligne
  img/windows     habillages de fenêtres 192 × 192

Rien n'est écrit dans data/ : pour qu'un effet devienne une animation, ou un
monstre un ennemi, c'est dans la base de données, par JOKO.
Relançable : il efface d'abord tous les « Z_Net_ » qu'il avait posés.

  python3 bancs/outils/ranger_les_ressources.py
"""
import json
import os
import re
import sys

from PIL import Image

RACINE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
RES = os.path.join(RACINE, 'ressources_internet')
IMG = os.path.join(RACINE, 'img')                       # le jeu : on n'y pose rien
OUT = os.path.join(RES, 'PRET_POUR_MV', 'img')
PREFIXE = 'Z_Net_'
LIMITE_PAR_PACK = {'faces': 64, 'pictures': 30, 'characters': 40, 'sv_actors': 30, 'sv_enemies': 60, 'animations': 40, 'windows': 20}
ANIM = re.compile(r'anim|frame|sheet|strip|walk|run|attack|idle|death|die|hurt|hit|jump|move|fly|cast|_\d{2,}\b|tile|icon|ui\b|gui|button|font|preview|example|cover|thumb|banner|promo|screenshot|mockup', re.I)


def source(pack):
    infos = {'titre': os.path.basename(pack), 'auteur': '?', 'licence': '?', 'page': ''}
    f = os.path.join(pack, 'SOURCE.txt')
    if os.path.exists(f):
        for ligne in open(f, encoding='utf8', errors='replace'):
            m = re.match(r'^(Titre|Auteur|Licence|Page)\s*:\s*(.*)$', ligne.strip())
            if m:
                infos[m.group(1).lower()] = m.group(2).replace('&#039;', "'").replace('&amp;', '&')
    return infos


def court(nom, n=24):
    nom = re.sub(r'^[a-z0-9-]+__', '', nom)              # « auteur__ » des packs itch
    nom = re.sub(r'[^A-Za-z0-9]+', ' ', nom).title().replace(' ', '')
    return nom[:n] or 'Pack'


def images(pack):
    for d, _, fs in os.walk(pack):
        for f in sorted(fs):
            if f.lower().endswith(('.png', '.gif', '.jpg', '.jpeg')):
                yield os.path.join(d, f)


def ouvrir(p):
    try:
        im = Image.open(p)
        im.load()
        return im.convert('RGBA')
    except Exception:
        return None


def mise_a_l_echelle(im, w, h):
    lisse = im.width > w or im.height > h
    return im.resize((w, h), Image.LANCZOS if lisse else Image.NEAREST)


def opaque(im):
    a = im.getchannel('A')
    return a.getbbox() is not None and sum(a.histogram()[200:]) > 0.05 * im.width * im.height


def transparence(im):
    a = im.getchannel('A')
    return sum(a.histogram()[:20]) / float(im.width * im.height)


def morceaux(im, seuil=0.02):
    """Combien de silhouettes séparées (une planche de 4 visages, une grille de
    monstres, une ligne de chiffres en a plusieurs ; un monstre seul, une)."""
    a = im.getchannel('A')
    k = 64.0 / max(im.size)
    if k < 1:
        a = a.resize((max(1, int(im.width * k)), max(1, int(im.height * k))), Image.BOX)
    w, h = a.size
    px = a.load()
    vu = [[False] * h for _ in range(w)]
    n = 0
    for x in range(w):
        for y in range(h):
            if vu[x][y] or px[x, y] < 60:
                continue
            pile, taille = [(x, y)], 0
            vu[x][y] = True
            while pile:
                cx, cy = pile.pop()
                taille += 1
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if 0 <= nx < w and 0 <= ny < h and not vu[nx][ny] and px[nx, ny] >= 60:
                        vu[nx][ny] = True
                        pile.append((nx, ny))
            if taille >= seuil * w * h:
                n += 1
    return n


poses = []      # (dossier, fichier, infos)


def theme(dossier, texte):
    t = texte.lower()
    if dossier == 'sv_enemies':
        for nom, r in (('slimes', r'slime|jelly|blob|ooze'), ('dragons_et_wyvernes', r'dragon|wyvern|drake|hydra'),
                       ('morts-vivants', r'skelet|zombie|undead|ghost|ghoul|lich|vampire|mummy|wraith|spirit|skull|bone|reaper|death'),
                       ('demons', r'demon|devil|imp\b|hell|succub|fiend'), ('elementaires', r'element|flame|fire|ice|frost|wisp|golem|rock|stone|lava|water|wind|thunder'),
                       ('humanoides', r'orc|goblin|troll|ogre|kobold|bandit|knight|soldier|warrior|mage|wizard|witch|cultist|lizard|minotaur|centaur|dwar|gnome|elf'),
                       ('insectes_et_araignees', r'spider|insect|bug|bee|wasp|ant\b|beetle|scorpion|worm|larva|fly'),
                       ('plantes_et_champignons', r'plant|mushroom|tree|flower|fung|vine|mandrake'),
                       ('betes', r'wolf|bear|bat|rat|boar|snake|fox|cat|dog|bird|deer|frog|crab|fish|shark|beast|tiger|lion|horse|elephant'),
                       ('boss', r'boss')):
            if re.search(r, t):
                return nom
        return 'divers'
    if dossier == 'animations':
        for nom, r in (('feu', r'fire|flame|burn|lava|explos|fireball|blaze'), ('glace', r'ice|frost|snow|freez|cold'),
                       ('foudre', r'thunder|lightning|electr|spark|shock'), ('eau', r'water|bubble|splash|wave|aqua'),
                       ('vent', r'wind|tornado|air|gust|cyclone'), ('terre', r'earth|rock|stone|ground|quake|sand'),
                       ('lumiere_et_soins', r'heal|holy|light|cure|buff|shine|star|angel|bless'),
                       ('tenebres', r'dark|shadow|curse|void|death|poison|necro|blood'),
                       ('coups_et_impacts', r'slash|hit|impact|claw|sword|strike|punch|blood|cut'), ('magie', r'magic|spell|arcane|circle|aura|rune|portal')):
            if re.search(r, t):
                return nom
        return 'divers'
    if re.search(r'monster|demon|orc|goblin|undead|skelet|creature|beast', t):
        return 'monstres'
    if re.search(r'villag|npc|town|merchant|elder|peasant|farmer|innkeeper|butcher|civil|citizen|shop', t):
        return 'pnj'
    if re.search(r'knight|warrior|hero|adventur|mage|wizard|witch|archer|samurai|ninja|paladin|rogue|thief|fighter|priest|cleric', t):
        return 'heros_et_classes'
    return 'divers'


def poser(dossier, nom, im, infos, texte=''):
    th = theme(dossier, texte + ' ' + infos['titre'])
    os.makedirs(os.path.join(OUT, dossier, th), exist_ok=True)
    im.save(os.path.join(OUT, dossier, th, nom + '.png'), optimize=True)
    poses.append((dossier + '/' + th, nom, infos))


def nettoyer():
    import shutil
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    n = 0
    for d in os.listdir(IMG):
        p = os.path.join(IMG, d)
        if not os.path.isdir(p):
            continue
        for f in os.listdir(p):
            if f.startswith(PREFIXE) or f.startswith('$' + PREFIXE):
                os.remove(os.path.join(p, f))
                n += 1
    return n


def packs(*categories):
    for c in categories:
        for src in ('opengameart', 'itch'):
            d = os.path.join(RES, c, src)
            if os.path.isdir(d):
                for p in sorted(os.listdir(d)):
                    yield c, os.path.join(d, p)


def visages_et_portraits():
    for _, pack in packs('visages'):
        infos, nom = source(pack), court(os.path.basename(pack))
        visages, portraits, feuilles = [], [], 0
        for f in images(pack):
            if ANIM.search(os.path.relpath(f, pack)):
                continue
            im = ouvrir(f)
            if im is None or not opaque(im):
                continue
            w, h = im.size
            if (w, h) == (576, 288) and feuilles < 8:
                feuilles += 1
                poser('faces', PREFIXE + nom + '_MV%d' % feuilles, im, infos)
            elif w == h and 48 <= w <= 1024 and len(visages) < LIMITE_PAR_PACK['faces'] and (transparence(im) < 0.05 or morceaux(im) <= 1):
                visages.append(mise_a_l_echelle(im, 144, 144))
            elif h >= 300 and 0.4 <= w / h <= 1.2 and len(portraits) < LIMITE_PAR_PACK['pictures'] and (transparence(im) < 0.05 or morceaux(im) <= 1):
                if h > 624:
                    im = im.resize((round(w * 624 / h), 624), Image.LANCZOS)
                portraits.append(im)
        for k in range(0, len(visages), 8):
            feuille = Image.new('RGBA', (576, 288), (0, 0, 0, 0))
            for i, v in enumerate(visages[k:k + 8]):
                feuille.paste(v, ((i % 4) * 144, (i // 4) * 144))
            poser('faces', PREFIXE + nom + '_%d' % (k // 8 + 1), feuille, infos)
        for i, im in enumerate(portraits):
            poser('pictures', PREFIXE + nom + '_%d' % (i + 1), im, infos)


def personnages_et_battlers():
    for cat, pack in packs('personnages', 'sv_battlers', 'ennemis'):
        infos, nom = source(pack), court(os.path.basename(pack))
        sv = cat == 'sv_battlers' or re.search(r'side ?view|\bsv\b|battler', (infos['titre'] + os.path.basename(pack)), re.I)
        n = {'characters': 0, 'sv_actors': 0}
        for f in images(pack):
            im = ouvrir(f)
            if im is None:
                continue
            w, h = im.size
            if (w, h) in ((384, 256), (96, 128)):            # feuilles 32 px → ×1,5
                im = im.resize((w * 3 // 2, h * 3 // 2), Image.NEAREST)
                w, h = im.size
            if transparence(im) < 0.3:                      # une planche sur fond plein n'est pas un perso
                continue
            if (w, h) == (576, 384):
                dossier = 'sv_actors' if sv else 'characters'
                if n[dossier] < LIMITE_PAR_PACK[dossier]:
                    n[dossier] += 1
                    poser(dossier, PREFIXE + nom + '_%d' % n[dossier], im, infos)
            elif (w, h) == (144, 192) and cat != 'ennemis' and n['characters'] < LIMITE_PAR_PACK['characters']:
                n['characters'] += 1
                poser('characters', '$' + PREFIXE + nom + '_%d' % n['characters'], im, infos)


def monstres():
    for _, pack in packs('ennemis'):
        infos, nom = source(pack), court(os.path.basename(pack))
        n = 0
        for f in images(pack):
            if n >= LIMITE_PAR_PACK['sv_enemies']:
                break
            if ANIM.search(os.path.relpath(f, pack)):
                continue
            im = ouvrir(f)
            if im is None or not opaque(im):
                continue
            b = im.getchannel('A').getbbox()
            im = im.crop(b)
            w, h = im.size
            if not (40 <= w <= 800 and 40 <= h <= 800 and 1 / 3 <= w / h <= 3):
                continue
            if w >= 3 * h or h >= 3 * w:                    # une bande d'images
                continue
            if transparence(im) < 0.15 or morceaux(im) != 1:   # portrait sur fond, planche, chiffres
                continue
            if max(w, h) < 120:                             # pixel art : ×2, sans flou
                im = im.resize((w * 2, h * 2), Image.NEAREST)
            n += 1
            poser('sv_enemies', PREFIXE + nom + '_%d' % n, im, infos, os.path.relpath(f, pack))


def effets():
    for _, pack in packs('effets_et_sorts'):
        infos, nom = source(pack), court(os.path.basename(pack))
        n = 0
        for f in images(pack):
            if n >= LIMITE_PAR_PACK['animations']:
                break
            im = ouvrir(f)
            if im is None:
                continue
            w, h = im.size
            if w > h and w % h == 0 and 3 <= w // h <= 30 and 24 <= h <= 256:
                cases = [im.crop((i * h, 0, (i + 1) * h, h)) for i in range(w // h)]
            elif h > w and h % w == 0 and 3 <= h // w <= 30 and 24 <= w <= 256:
                cases = [im.crop((0, i * w, w, (i + 1) * w)) for i in range(h // w)]
            else:
                continue
            cases = [c for c in cases if c.getchannel('A').getbbox()]
            if len(cases) < 3 or min(transparence(c) for c in cases) < 0.3:
                continue
            lignes = (len(cases) + 4) // 5
            feuille = Image.new('RGBA', (960, 192 * lignes), (0, 0, 0, 0))
            for i, c in enumerate(cases):
                feuille.paste(c.resize((192, 192), Image.NEAREST if c.width <= 192 else Image.LANCZOS), ((i % 5) * 192, (i // 5) * 192))
            n += 1
            poser('animations', PREFIXE + nom + '_%d' % n, feuille, infos, os.path.relpath(f, pack))


def fenetres():
    for _, pack in packs('autres'):
        if not re.search(r'window', pack, re.I):
            continue
        infos, nom = source(pack), court(os.path.basename(pack))
        n = 0
        for f in images(pack):
            im = ouvrir(f)
            if im is not None and im.size == (192, 192) and n < LIMITE_PAR_PACK['windows']:
                n += 1
                poser('windows', PREFIXE + nom + '_%d' % n, im, infos)


def main():
    print('effacés (ancienne pose) : %d' % nettoyer())
    visages_et_portraits()
    personnages_et_battlers()
    monstres()
    effets()
    fenetres()
    compte = {}
    for d, _, _ in poses:
        compte[d] = compte.get(d, 0) + 1
    print('posés :', json.dumps(compte, ensure_ascii=False))
    # la liste des crédits
    lignes = ['# Prêt pour RPG Maker MV — `PRET_POUR_MV/` (préfixe « Z_Net_ »)', '',
              'Préparé par `bancs/outils/ranger_les_ressources.py` à partir de `ressources_internet/`.',
              '**Rien n\'est dans le jeu.** `PRET_POUR_MV/img/` a les mêmes dossiers que `img/` du jeu,',
              'triés en sous-dossiers par famille. Pour utiliser un fichier : copie le FICHIER (pas le',
              'sous-dossier, l\'éditeur de MV ne les lit pas) dans le dossier du même nom du jeu.',
              'Tous les noms commencent par **Z_Net_** : une fois copiés, ils sont en bas des listes.',
              'Les packs **CC-BY / OGA-BY / CC-BY-SA** et beaucoup de packs itch demandent que l\'auteur',
              'soit cité dans les crédits du jeu : la colonne « Auteur » est là pour ça.', '',
              '| Dossier | Fichiers | Pack | Auteur | Licence | Page |', '|---|---|---|---|---|---|']
    groupes = {}
    for d, nom, infos in poses:
        groupes.setdefault((d, infos['titre'], infos['auteur'], infos['licence'], infos['page']), []).append(nom)
    for (d, t, a, l, p), noms in sorted(groupes.items()):
        ex = noms[0] + (' … ' + noms[-1] if len(noms) > 1 else '')
        lignes.append('| PRET_POUR_MV/img/%s | %d — `%s` | %s | %s | %s | %s |' % (d, len(noms), ex, t.replace('|', '/'), a.replace('|', '/'), l.replace('|', '/'), p))
    open(os.path.join(RES, 'INSTALLES.md'), 'w', encoding='utf8').write('\n'.join(lignes) + '\n')
    print('écrit ressources_internet/INSTALLES.md')


if __name__ == '__main__':
    sys.exit(main())
