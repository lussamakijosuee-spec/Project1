// node tools/publier_en_ligne.js — met le jeu en ligne depuis ce PC (lancé par PUBLIER_EN_LIGNE.bat)
// ⚠️ OUTIL DE TERMINAL — ne PAS l'ajouter au gestionnaire de plugins du jeu !
//
// JOKO, 2026-11-05, à « Je te fais un PUBLIER_EN_LIGNE.bat pour mettre à jour d'un double-clic, sans
// jeton ? » : « Oui, fais-le ». La publication de GitHub (.github/workflows/jeu-en-ligne.yml) demande le
// secret JETON_JEU ; celle-ci passe par l'accès git de ce PC, celui qui pousse déjà Project1 :
//   1. la version web des fichiers de ce PC, tels qu'ils sont (tools/version_web.js → dist/web) —
//      RPG Maker ouvert, enregistrer d'abord ;
//   2. dans le dépôt public Project1-jeu, une seule version, sans historique. Le dépôt git de la version
//      (dist/web.git) reste d'une fois sur l'autre : seul ce qui a changé repart sur internet ;
//   3. l'attente que GitHub Pages la serve (version.txt dit la date de construction).
// L'auteur des versions publiées est l'adresse « noreply » de GitHub, pas l'e-mail de JOKO : le dépôt
// est public.
if (typeof PluginManager !== 'undefined') {
    console.warn('publier_en_ligne.js est un outil de terminal, pas un plugin. Il ne fait rien en jeu.');
} else {
var cp = require('child_process'), path = require('path'), fs = require('fs');
var RACINE = path.join(__dirname, '..');
var WEB = path.join(RACINE, 'dist', 'web'), GIT = path.join(RACINE, 'dist', 'web.git');
var DEPOT = 'https://github.com/lussamakijosuee-spec/Project1-jeu.git';
var ADRESSE = 'https://lussamakijosuee-spec.github.io/Project1-jeu/';
var AUTEUR = { GIT_AUTHOR_NAME: 'lussamakijosuee-spec', GIT_AUTHOR_EMAIL: '293176437+lussamakijosuee-spec@users.noreply.github.com' };
AUTEUR.GIT_COMMITTER_NAME = AUTEUR.GIT_AUTHOR_NAME; AUTEUR.GIT_COMMITTER_EMAIL = AUTEUR.GIT_AUTHOR_EMAIL;

function git(args, montrer) {
    var r = cp.spawnSync('git', ['--git-dir=' + GIT, '--work-tree=' + WEB].concat(args), {
        cwd: RACINE, env: Object.assign({}, process.env, AUTEUR), encoding: 'utf8', stdio: montrer ? 'inherit' : 'pipe'
    });
    return { ok: r.status === 0, sortie: String(r.stdout || '').trim(), erreur: String(r.stderr || '').trim() };
}
function etape(t) { console.log('\n── ' + t); }
function arreter(t) { console.log('\n❌ ' + t); process.exit(1); }
function attendre(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

(async function () {
    etape('1/3 · La version web (environ 5 minutes)');
    var b = cp.spawnSync(process.execPath, [path.join(__dirname, 'version_web.js'), WEB], { cwd: RACINE, stdio: 'inherit' });
    if (b.status !== 0) { arreter('La version web n\'est pas complète : rien n\'est publié.'); }
    var construite = (fs.readFileSync(path.join(WEB, 'version.txt'), 'utf8').match(/construite le (\S+)/) || [])[1];

    etape('2/3 · L\'envoi dans Project1-jeu');
    if (!fs.existsSync(GIT)) {
        if (!git(['init', '-q']).ok) { arreter('git n\'a pas pu créer ' + GIT); }
    }
    // ce que le dépôt public a déjà : git n'enverra que la différence
    var avant = git(['fetch', '-q', '--depth=1', DEPOT, 'main']);
    if (!avant.ok && !/couldn't find remote ref|could not find remote ref/i.test(avant.erreur)) {
        console.log('   (le dépôt en ligne n\'a pas pu être lu : tout sera envoyé) ' + avant.erreur.split('\n')[0]);
    }
    if (!git(['add', '-A']).ok) { arreter('git add a échoué'); }
    var arbre = git(['write-tree']);
    var source = ''; try { source = cp.execSync('git rev-parse --short HEAD', { cwd: RACINE }).toString().trim(); } catch (e) { }
    var commit = git(['commit-tree', arbre.sortie, '-m', 'Le jeu, version ' + (source || '?') + ' de Project1, publiée depuis le PC']);
    if (!arbre.ok || !commit.ok) { arreter('git n\'a pas pu préparer la version : ' + (arbre.erreur || commit.erreur)); }
    git(['update-ref', 'refs/heads/publie', commit.sortie]);
    var envoi = git(['-c', 'http.postBuffer=1048576000', 'push', '--force', '--progress', DEPOT, commit.sortie + ':refs/heads/main'], true);
    if (!envoi.ok) { arreter('L\'envoi a échoué (connexion, ou accès à GitHub). Rien n\'a changé en ligne.'); }
    git(['gc', '--auto', '-q']);

    etape('3/3 · GitHub Pages met la version en ligne');
    for (var i = 0; i < 30; i++) {
        try {
            var r = await fetch(ADRESSE + 'version.txt?v=' + Date.now(), { cache: 'no-store' });
            if (r.ok && (await r.text()).indexOf(construite) >= 0) {
                console.log('\n✅ En ligne : ' + ADRESSE);
                return;
            }
        } catch (e) { }
        await attendre(10000);
    }
    console.log('\n✅ Envoyé. GitHub Pages la met en ligne dans quelques minutes : ' + ADRESSE);
})();
}
