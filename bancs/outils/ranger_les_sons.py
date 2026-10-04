"""
LES SONS ET MUSIQUES D'INTERNET — au format RPG Maker MV (.ogg + .m4a)
---------------------------------------------------------------------------
JOKO, le 2026-10-04 : « si tu peux installer des sons aussi […] musique du jeu
vidéo […] sur RPG Maker MV, oublie pas ».

Prend une liste de pages OpenGameArt (licences libres, notées), télécharge,
et prépare dans ressources_internet/PRET_POUR_MV/audio/ la MÊME arborescence
que le jeu (bgm, bgs, me, se), triée en sous-dossiers (combat, boss, ville…).
MV a besoin des DEUX formats : chaque son existe en .ogg et en .m4a.
Rien n'est posé dans audio/ du jeu : JOKO copie les fichiers qu'il veut.
Tout commence par « Z_Net_ » ; INSTALLES_SONS.md donne source et licence.

  python3 bancs/outils/ranger_les_sons.py <tri.json>
    tri.json = {"musique": [{s, titre, lic, files:[{url}]}…], "sons": […]}
"""
import io
import json
import os
import re
import subprocess
import sys
import tempfile
import urllib.request
import zipfile

import imageio_ffmpeg

FF = imageio_ffmpeg.get_ffmpeg_exe()
RACINE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = os.path.join(RACINE, 'ressources_internet', 'PRET_POUR_MV', 'audio')
PREFIXE = 'Z_Net_'
AUDIO = re.compile(r'\.(ogg|wav|mp3|flac)$', re.I)
MAX_MUSIQUE, MAX_SONS_PAR_PACK, MAX_PISTES_PAR_PACK = 220, 25, 4


def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read()


def duree(chemin):
    p = subprocess.run([FF, '-hide_banner', '-i', chemin], capture_output=True, text=True)
    m = re.search(r'Duration: (\d+):(\d+):([\d.]+)', p.stderr)
    return int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3)) if m else 0


def convertir(src, dest_sans_ext, musique):
    os.makedirs(os.path.dirname(dest_sans_ext), exist_ok=True)
    q = ['-q:a', '4'] if musique else ['-q:a', '3']
    a = subprocess.run([FF, '-y', '-loglevel', 'error', '-i', src, '-vn', '-ar', '44100', '-c:a', 'libvorbis'] + q + [dest_sans_ext + '.ogg'])
    b = subprocess.run([FF, '-y', '-loglevel', 'error', '-i', src, '-vn', '-ar', '44100', '-c:a', 'aac', '-b:a', '128k' if musique else '96k', dest_sans_ext + '.m4a'])
    ok = a.returncode == 0 and b.returncode == 0 and os.path.getsize(dest_sans_ext + '.ogg') > 1000
    if not ok:
        for e in ('.ogg', '.m4a'):
            if os.path.exists(dest_sans_ext + e):
                os.remove(dest_sans_ext + e)
    return ok


def theme(genre, t):
    t = t.lower()
    TABLE = {
        'bgm': (('boss', r'boss|final battle|showdown|villain'), ('combat', r'battle|fight|combat|war|action|clash'),
                ('ville_et_village', r'town|village|city|market|peaceful|home'), ('taverne', r'tavern|inn|pub|bar\b'),
                ('donjon_et_grotte', r'dungeon|cave|crypt|catacomb|underground|labyrinth'), ('chateau_et_royaume', r'castle|king|royal|throne|kingdom|palace'),
                ('foret_et_nature', r'forest|wood|nature|field|meadow|grass'), ('triste_et_emotion', r'sad|sorrow|emotional|tragic|melanchol|loss|farewell|lament'),
                ('mystere_et_tension', r'myster|tension|suspense|dark|ominous|creepy|eerie'), ('aventure_et_carte', r'adventure|journey|overworld|travel|explor|epic|hero|theme')),
        'me': (('victoire', r'victory|win|fanfare|triumph|success'), ('defaite', r'game ?over|lose|defeat|death|fail'),
               ('niveau_et_objet', r'level|item|fanfare|get|jingle|chest|reward')),
        'bgs': (('pluie_et_orage', r'rain|storm|thunder'), ('vent', r'wind|blizzard|breeze'), ('feu', r'fire|campfire|crackl|torch'),
                ('eau', r'river|water|stream|ocean|sea|wave|waterfall|drip'), ('foule_et_ville', r'crowd|market|tavern|people|town'),
                ('foret_et_nuit', r'forest|night|bird|cricket|insect|swamp'), ('donjon', r'cave|dungeon|drone|ambien')),
        'se': (('armes_et_coups', r'sword|blade|slash|hit|punch|impact|swing|metal|clash|arrow|bow|axe|dagger|whoosh|swish'),
               ('magie', r'magic|spell|heal|cast|fire|ice|thunder|lightning|holy|curse|buff|power|charge|teleport|portal'),
               ('monstres_et_voix', r'monster|growl|roar|creature|scream|grunt|voice|beast|goblin|orc|dragon|zombie|ghost'),
                ('pas', r'step|footstep|walk|run'), ('portes_et_coffres', r'door|chest|lock|key|gate|open|close'),
               ('menu_et_interface', r'menu|ui|interface|click|select|cursor|confirm|cancel|button|beep'),
               ('objets_et_or', r'coin|gold|item|pickup|potion|bottle|jewel|gem|cash|money|inventory'),
               ('explosions', r'explos|bomb|boom|blast'), ('nature_et_ambiance', r'water|splash|wind|fire|rain|thunder|bird|leaf')),
    }
    for nom, r in TABLE[genre]:
        if re.search(r, t):
            return nom
    return 'divers'


def court(s, n=22):
    return re.sub(r'[^A-Za-z0-9]+', ' ', s).title().replace(' ', '')[:n] or 'Son'


def fichiers_audio(item, tmp):
    """(nom d'origine, chemin local) de chaque fichier audio du pack."""
    out = []
    for f in item['files']:
        nom = os.path.basename(f['url'])
        try:
            data = get(f['url'])
        except Exception as e:
            print('  raté', nom, e)
            continue
        if nom.lower().endswith('.zip'):
            try:
                z = zipfile.ZipFile(io.BytesIO(data))
            except Exception:
                continue
            for zi in z.infolist():
                if AUDIO.search(zi.filename) and '__MACOSX' not in zi.filename and zi.file_size < 60e6:
                    p = os.path.join(tmp, '%d_%s' % (len(out), re.sub(r'[^\w.]+', '_', os.path.basename(zi.filename))))
                    open(p, 'wb').write(z.read(zi))
                    out.append((zi.filename, p))
        elif AUDIO.search(nom):
            p = os.path.join(tmp, '%d_%s' % (len(out), re.sub(r'[^\w.]+', '_', nom)))
            open(p, 'wb').write(data)
            out.append((nom, p))
    return out


def main():
    tri = json.load(open(sys.argv[1]))
    poses = []
    etat = os.path.join(OUT, '.fait.json')
    fait = json.load(open(etat)) if os.path.exists(etat) else {}
    nb_musique = sum(1 for v in fait.values() for g in v if g[0] in ('bgm', 'me'))
    for genre_liste in ('musique', 'sons'):
        for item in tri[genre_liste]:
            if item['s'] in fait:
                poses += [tuple(x) + (item,) for x in fait[item['s']]]
                continue
            if genre_liste == 'musique' and nb_musique >= MAX_MUSIQUE:
                continue
            texte_pack = item['titre'] + ' ' + ' '.join(item.get('tags', []))
            faits = []
            with tempfile.TemporaryDirectory() as tmp:
                pistes = fichiers_audio(item, tmp)
                # un même son en .wav ET .ogg : on garde un seul exemplaire
                vus, uniques = set(), []
                for nom, p in pistes:
                    cle = re.sub(r'\.(ogg|wav|mp3|flac)$', '', os.path.basename(nom).lower())
                    if cle not in vus:
                        vus.add(cle)
                        uniques.append((nom, p))
                n = 0
                for nom, p in uniques:
                    d = duree(p)
                    t = texte_pack + ' ' + nom
                    if genre_liste == 'musique':
                        if d < 3 or d > 480:
                            continue
                        genre = 'me' if d < 25 else 'bgm'
                        if n >= MAX_PISTES_PAR_PACK:
                            break
                    else:
                        if d <= 0 or d > 120:
                            continue
                        genre = 'bgs' if d > 12 and re.search(r'ambien|loop|rain|wind|fire|river|water|crowd|forest|night|storm|ocean|cave', t, re.I) else ('se' if d <= 12 else None)
                        if genre is None or n >= MAX_SONS_PAR_PACK:
                            continue
                    th = theme(genre, t)
                    n += 1
                    base = PREFIXE + court(item['titre']) + '_%d' % n
                    dest = os.path.join(OUT, genre, th, base)
                    if convertir(p, dest, genre in ('bgm', 'bgs', 'me')):
                        faits.append((genre + '/' + th, base, round(d, 1)))
                        if genre in ('bgm', 'me'):
                            nb_musique += 1
            fait[item['s']] = faits
            poses += [x + (item,) for x in faits]
            json.dump(fait, open(etat, 'w'))
            print('%-4d %s  (%s)' % (len(faits), item['titre'][:60], ', '.join(sorted(set(x[0].split('/')[0] for x in faits)))), flush=True)
    # la liste des crédits
    lignes = ['# Sons et musiques — `PRET_POUR_MV/audio/` (préfixe « Z_Net_ »)', '',
              'Préparé par `bancs/outils/ranger_les_sons.py` (OpenGameArt, licences libres).',
              '**Rien n\'est dans le jeu.** Chaque son existe en **.ogg ET .m4a** (RPG Maker MV a besoin des deux) :',
              'copie les DEUX fichiers dans le dossier du même nom du jeu (`audio/bgm`, `bgs`, `me`, `se`).',
              'CC-BY / OGA-BY / CC-BY-SA : citer l\'auteur dans les crédits ; CC0 : libre.', '',
              '| Dossier | Fichiers | Durée | Pack | Licence | Page |', '|---|---|---|---|---|---|']
    groupes = {}
    for dossier, base, d, item in poses:
        groupes.setdefault((dossier, item['titre'], ' / '.join(item['lic']), item['s']), []).append((base, d))
    for (dossier, titre, lic, s), l in sorted(groupes.items()):
        lignes.append('| audio/%s | %d — `%s`%s | %s | %s | %s | https://opengameart.org/content/%s |' % (
            dossier, len(l), l[0][0], (' … `%s`' % l[-1][0]) if len(l) > 1 else '', ', '.join('%gs' % x[1] for x in l[:4]) + (' …' if len(l) > 4 else ''),
            titre.replace('|', '/'), lic, s))
    open(os.path.join(RACINE, 'ressources_internet', 'INSTALLES_SONS.md'), 'w', encoding='utf8').write('\n'.join(lignes) + '\n')
    compte = {}
    for dossier, *_ in poses:
        compte[dossier.split('/')[0]] = compte.get(dossier.split('/')[0], 0) + 1
    print('posés :', compte)


if __name__ == '__main__':
    main()
