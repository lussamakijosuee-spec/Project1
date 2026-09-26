"""
TRIER LES SONS — convertir les MP3 en OGG (+ M4A), les ranger dans le bon
dossier, et classer les musiques selon ce qu'elles font entendre.

JOKO, le 2026-09-26 : « j'ai ajouté énormément de sons […] trier les sons en
fonction de comment ils sonnent, de s'ils doivent aller dans quelle option […]
c'est des sons MP3 mais ça passe pas en MP3, c'est mieux de les mettre en OGG ».

RPG Maker MV ne lit PAS le MP3 : il joue .ogg (ordinateur) et .m4a
(navigateurs Apple, téléphones). Chaque MP3 sans .ogg devient donc un .ogg ET
un .m4a, du même nom, dans le bon dossier :
  · bgm  musique qui boucle           · bgs  ambiance qui boucle (pluie…)
  · me   jingle joué une fois (auberge, fanfare)   · se  bruitage court
Le MP3 d'origine n'est pas supprimé : il part dans audio/_originaux_mp3/.
Un doublon exact (même contenu, nom en « (1) ») n'est pas reconverti.

Le classement se fait sur le NOM et sur l'ÉCOUTE mesurée (durée, volume,
dynamique, brillance, attaques par seconde, tempo) : voir docs/MUSIQUES.md.

  python3 bancs/outils/trier_les_sons.py            → montre ce qui serait fait
  python3 bancs/outils/trier_les_sons.py --ecrire   → le fait
Il faut ffmpeg :  pip install imageio-ffmpeg numpy
"""
import os, sys, json, shutil, hashlib, subprocess
from concurrent.futures import ThreadPoolExecutor
import numpy as np
import imageio_ffmpeg

FF = imageio_ffmpeg.get_ffmpeg_exe()
RACINE = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', '..'))
AUDIO = os.path.join(RACINE, 'audio')
ARCHIVE = os.path.join(AUDIO, '_originaux_mp3')
ECRIRE = '--ecrire' in sys.argv
SR = 11025

# ── l'écoute mesurée ────────────────────────────────────────────────────────
def ecouter(p):
    raw = subprocess.run([FF, '-v', 'quiet', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True).stdout
    x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
    if len(x) < SR:
        return dict(duree=len(x) / SR, db=-60, dynamique=0, brillance=0, attaques=0, tempo=0)
    b = int(SR * 0.5)
    blocs = np.array([np.sqrt(np.mean(x[i:i + b] ** 2)) for i in range(0, len(x) - b, b)]) + 1e-9
    n, cents, flux, prev = 2048, [], [], None
    win = np.hanning(n)
    fr = np.fft.rfftfreq(n, 1 / SR)
    for i in range(0, min(len(x), SR * 90) - n, n // 2):
        s = np.abs(np.fft.rfft(x[i:i + n] * win))
        cents.append(float((s * fr).sum() / (s.sum() + 1e-9)))
        if prev is not None:
            flux.append(float(np.maximum(s - prev, 0).sum()))
        prev = s
    flux = np.array(flux)
    hop = (n // 2) / SR
    seuil = np.median(flux) + 1.5 * np.std(flux)
    pics = int(((flux[1:-1] > flux[:-2]) & (flux[1:-1] > flux[2:]) & (flux[1:-1] > seuil)).sum())
    tempo = 0
    if len(flux) > 200:
        f0 = flux - flux.mean()
        ac = np.correlate(f0, f0, 'full')[len(f0) - 1:]
        lags = np.arange(len(ac)) * hop
        ok = (lags > 60 / 200) & (lags < 60 / 60)
        tempo = int(round(60 / lags[ok][np.argmax(ac[ok])]))
    return dict(duree=round(len(x) / SR, 1), db=round(float(20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)), 1),
                dynamique=round(float(20 * np.log10(np.percentile(blocs, 95) / np.percentile(blocs, 10))), 1),
                brillance=int(np.mean(cents)), attaques=round(pics / (len(flux) * hop), 2), tempo=tempo)

# ── le classement ───────────────────────────────────────────────────────────
CATEGORIES = [
    # (clé, titre, mots du nom, emploi conseillé)
    ('jingle', 'Jingles (ME)', r'^(inn|jingle|fanfare|victory|gameover)', 'Auberge, objet reçu, victoire : joué une fois, sans boucle.'),
    ('boss', 'Boss et combats finaux', r'boss|lastboss|final|darklord|judgement|legendary|beast-from-hell|beast of blood|over-the-blood|fatalblood|demonic', 'Troupes de boss : « Changer la musique de combat » juste avant le combat.'),
    ('combat', 'Combats', r'batt?[le][le]|battel|conflict|encounter|crasher|conquest|arms|rapier|memoria|nemesis|sword-of-bravery|never-surrender|set-ablaze|integral|yu-fulca|es-stage|ariadne|the-ancient-cry|burning', 'Combat ordinaire : Base de données ▸ Système ▸ Musique de combat, ou par troupe.'),
    ('horreur', 'Horreur et malaise', r'horror|cursed|ghost|halloween|graveyard|sealed|juki|ginen|crimson|dark-theme', 'Maisons hantées, cimetières, scènes de Chute.'),
    ('tension', 'Tension, danger, infiltration', r'sneaking|intrusion|agitating|desperate|face-the-fear|danger|two-sides|caos|chaos|frozen-air|lunatic', 'Poursuites, infiltration, compte à rebours, avant un boss.'),
    ('donjon', 'Donjons, grottes, ruines', r'dungeon|cave|cavern|tower|labyrinth|ruin|rlyeh|forgotten|moon-ruins|undersea|castle', 'Cartes de donjon (musique de la carte, ou « Jouer la musique » à l\'entrée).'),
    ('ville', 'Villes, villages, marchés', r'town|village|city|shopping|magic-shop|wanderers|far-east|royal-road', 'Cartes de ville et de village.'),
    ('voyage', 'Terrain, voyage, aventure', r'field|road|voyage|airship|valley|illusion|wild|everlasting-snow|winter-snow|summer', 'Cartes du monde, routes, forêts.'),
    ('sacre', 'Sacré, mystère, magie', r'sanctuary|sacred|church|prayer|elven|lib|primal|silent-avalon|lilac|starry', 'Temples, sanctuaires, bibliothèques, scènes de lore.'),
    ('emotion', 'Émotion, tristesse, souvenirs', r'sorrow|farewell|last-wish|reminiscence|nostalgia|lost-emotion|epilogue|rest-in-peace|regret|saikai|childhood|ma.cherie|ruined|new-paradise', 'Scènes tristes, adieux, flashbacks.'),
    ('calme', 'Calme, repos, douceur', r'rest|tea-time|sunbeams|hotaru|jazzy|tropical|apres|under-the-moonlight|shiroi', 'Auberge, maison, feu de camp, moments paisibles.'),
    ('comique', 'Comique, léger', r'gag|guutara|kidding|ojyosama|little-arch|myuu-pop|caketown|weasel', 'Scènes drôles, PNJ farfelus, mini-jeux.'),
    ('theme', 'Thèmes et titre', r'main-theme|prologue|theme\d|^theme|princessknight', 'Écran titre, prologue, grandes scènes.'),
]
import re

def classer(nom, e):
    n = nom.lower()
    for cle, titre, mots, emploi in CATEGORIES:
        if re.search(mots, n):
            # l'écoute corrige le nom quand elle le contredit nettement
            if cle == 'horreur' and e['db'] > -14.5 and e['attaques'] >= 1.0:
                return 'tension', 'nom + écoute (fort et rythmé)'
            if cle == 'calme' and e['db'] > -12.5 and e['dynamique'] < 3:
                return 'voyage', 'nom + écoute (fort, peu de nuances)'
            return cle, 'nom'
    # rien dans le nom : l'écoute décide
    if e['duree'] < 20:
        return 'jingle', 'écoute'
    if e['db'] > -14 and e['attaques'] >= 1.0 and e['dynamique'] < 6:
        return 'combat', 'écoute'
    if e['db'] < -19 and e['brillance'] < 1000:
        return 'horreur', 'écoute'
    if e['db'] < -16 and e['dynamique'] > 8:
        return 'emotion', 'écoute'
    if e['attaques'] < 0.8:
        return 'calme', 'écoute'
    return 'voyage', 'écoute'

def dossier_cible(dossier, nom, e):
    base = nom.lower()
    if dossier == 'bgm' and e['duree'] < 20:
        return 'me'          # un jingle ne doit pas boucler
    if dossier == 'se' and e['duree'] >= 20:
        return 'bgs'         # une ambiance d'une minute doit boucler
    return dossier

def md5(p):
    return hashlib.md5(open(p, 'rb').read()).hexdigest()

# ── inventaire ──────────────────────────────────────────────────────────────
a_faire, doublons = [], []
vus = {}
for dossier in ['bgm', 'bgs', 'me', 'se']:
    d = os.path.join(AUDIO, dossier)
    for f in sorted(os.listdir(d)):
        if not f.lower().endswith('.mp3'):
            continue
        base = f[:-4]
        p = os.path.join(d, f)
        h = md5(p)
        a_faire.append(dict(dossier=dossier, fichier=f, base=base, chemin=p, md5=h, deja_ogg=os.path.exists(os.path.join(d, base + '.ogg'))))

if not a_faire and os.path.exists(os.path.join(ARCHIVE, 'ecoute.json')):
    a_faire = json.load(open(os.path.join(ARCHIVE, 'ecoute.json')))
    for x in a_faire:
        if x['cible'] in ('bgm',) :
            x['categorie'], x['par'] = classer(x['base'], x)
    CATALOGUE_SEUL = True
else:
    CATALOGUE_SEUL = False
print('  ' + str(len(a_faire)) + ' MP3 trouvés · ' + str(sum(1 for x in a_faire if not x['deja_ogg'])) + ' sans .ogg')
with ThreadPoolExecutor(4) as ex:
    ecoutes = [dict((k, x[k]) for k in ('duree', 'db', 'dynamique', 'brillance', 'attaques', 'tempo')) for x in a_faire] if CATALOGUE_SEUL else list(ex.map(lambda x: ecouter(x['chemin']), a_faire))
for x, e in zip(a_faire, ecoutes):
    x.update(e)
    x['cible'] = dossier_cible(x['dossier'], x['base'], e)
    x['categorie'], x['par'] = classer(x['base'], e) if x['cible'] in ('bgm', 'me') else (('ambiance', 'dossier') if x['cible'] == 'bgs' else ('bruitage', 'dossier'))
    if x['cible'] == 'me':
        x['categorie'] = 'jingle'
    # doublon exact d'un fichier sans « (1) »
    twin = [y for y in a_faire if y is not x and y['md5'] == x['md5']]
    x['doublon_de'] = twin[0]['fichier'] if twin and re.search(r'\(\d\)', x['base']) else None

conv = [x for x in a_faire if not x['deja_ogg'] and not x['doublon_de']]
deplaces = [x for x in a_faire if x['cible'] != x['dossier']]
print('  à convertir : ' + str(len(conv)) + '  ·  changent de dossier : ' + ', '.join(x['fichier'] + ' → ' + x['cible'] for x in deplaces))
print('  doublons exacts (non reconvertis) : ' + ', '.join(x['fichier'] for x in a_faire if x['doublon_de']))

if not ECRIRE:
    sys.exit(0)
if CATALOGUE_SEUL:
    conv, deplaces = [], []

# ── conversion ─────────────────────────────────────────────────────────────
def convertir(x):
    dest = os.path.join(AUDIO, x['cible'])
    ogg, m4a = os.path.join(dest, x['base'] + '.ogg'), os.path.join(dest, x['base'] + '.m4a')
    r1 = subprocess.run([FF, '-v', 'error', '-y', '-i', x['chemin'], '-map', '0:a', '-map_metadata', '-1', '-ar', '44100', '-c:a', 'libvorbis', '-q:a', '5', ogg], capture_output=True)
    r2 = subprocess.run([FF, '-v', 'error', '-y', '-i', x['chemin'], '-map', '0:a', '-map_metadata', '-1', '-ar', '44100', '-c:a', 'aac', '-b:a', '160k', m4a], capture_output=True)
    return x['fichier'], r1.returncode == 0 and os.path.getsize(ogg) > 1000, r2.returncode == 0 and os.path.getsize(m4a) > 1000
with ThreadPoolExecutor(4) as ex:
    res = list(ex.map(convertir, conv)) if conv else []
rates = [r for r in res if not (r[1] and r[2])]
print('  converties : ' + str(len(res) - len(rates)) + ' / ' + str(len(res)) + (('  ✗ ' + ', '.join(r[0] for r in rates)) if rates else ''))
if rates:
    sys.exit(1)

# les .ogg / .m4a déjà présents d'un fichier qui change de dossier suivent
for x in deplaces:
    if x['deja_ogg']:
        for ext in ('.ogg', '.m4a'):
            s = os.path.join(AUDIO, x['dossier'], x['base'] + ext)
            if os.path.exists(s):
                shutil.move(s, os.path.join(AUDIO, x['cible'], x['base'] + ext))

# les MP3 d'origine vont aux archives (rien n'est supprimé)
for x in ([] if CATALOGUE_SEUL else a_faire):
    d = os.path.join(ARCHIVE, x['dossier'])
    os.makedirs(d, exist_ok=True)
    shutil.move(x['chemin'], os.path.join(d, x['fichier']))

json.dump([{k: v for k, v in x.items() if k not in ('chemin',)} for x in a_faire], open(os.path.join(ARCHIVE, 'ecoute.json'), 'w'), ensure_ascii=False, indent=1)

# ── le catalogue ────────────────────────────────────────────────────────────
titres = {c[0]: (c[1], c[3]) for c in CATEGORIES}
titres['ambiance'] = ('Ambiances qui bouclent (BGS)', 'Pluie, ruisseau, train : « Jouer un fond sonore » (BGS).')
titres['bruitage'] = ('Bruitages (SE)', '')
ordre = [c[0] for c in CATEGORIES if c[0] != 'jingle'] + ['jingle', 'ambiance', 'bruitage']
L = ['# Les musiques et les sons', '',
     'Classés par ce qu\'ils font entendre : le **nom** d\'abord, et quand le nom ne dit rien, l\'**écoute mesurée**. '
     'Écrit par `bancs/outils/trier_les_sons.py`. Les MP3 d\'origine sont gardés dans `audio/_originaux_mp3/`.', '',
     'Colonnes : durée · volume moyen (dB, plus c\'est bas, plus c\'est doux) · dynamique (écart fort/doux, grand = nuances) · '
     'tempo estimé · attaques par seconde (grand = rythmé, chargé).', '',
     '| Sommaire | |', '|---|---:|']
for c in ordre:
    n = sum(1 for x in a_faire if x['categorie'] == c and not x['doublon_de'])
    if n:
        L.append('| ' + titres[c][0] + ' | ' + str(n) + ' |')
for c in ordre:
    lot = sorted([x for x in a_faire if x['categorie'] == c and not x['doublon_de']], key=lambda x: x['base'].lower())
    if not lot:
        continue
    L += ['', '## ' + titres[c][0], '']
    if titres[c][1]:
        L += ['*' + titres[c][1] + '*', '']
    L += ['| Fichier | Dossier | Durée | Volume | Dynamique | Tempo | Attaques/s | Classé par |', '|---|---|---:|---:|---:|---:|---:|---|']
    for x in lot:
        m, s = divmod(int(x['duree']), 60)
        L.append('| `' + x['base'] + '` | ' + x['cible'] + ' | ' + str(m) + ':' + str(s).zfill(2) + ' | ' + str(x['db']) + ' | ' + str(x['dynamique']) + ' | '
                 + (str(x['tempo']) if x['tempo'] else '—') + ' | ' + str(x['attaques']) + ' | ' + x['par'] + ' |')
dbl = [x for x in a_faire if x['doublon_de']]
if dbl:
    L += ['', '## Doublons exacts', '', 'Même contenu qu\'un autre fichier : pas reconvertis (l\'original l\'est). Le MP3 est aux archives.', '']
    for x in dbl:
        L.append('- `' + x['fichier'] + '` = `' + x['doublon_de'] + '`')
open(os.path.join(RACINE, 'docs', 'MUSIQUES.md'), 'w').write('\n'.join(L) + '\n')
print('  écrit docs/MUSIQUES.md · archives : audio/_originaux_mp3/')
