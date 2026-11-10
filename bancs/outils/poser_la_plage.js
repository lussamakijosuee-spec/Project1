/*
 * LA PLAGE — pose ce que la plage du Village de Pêche (carte 33) a de neuf
 * ---------------------------------------------------------------------------
 * JOKO, 2026-11-09, sur l'analyse (docs/LA_PLAGE.md) : « Mer plutôt, oui »,
 * « le ponton c'est juste un teaser de Dono et de lore, il connaît des choses
 * qu'il devrait pas connaître, tu le vois que le soir », « bible, tout et
 * développe au maximum ».
 *
 * Ce que l'outil écrit (et lui seul, pour que ce soit refaisable) :
 *   ① les objets 117-131 : les poissons de mer (<Poisson>), le Patriarche
 *     (<Poisson: trophée>), les coquillages, le verre poli, le bois flotté, la
 *     bouteille d'Élise, la lettre de Sora — seulement dans une case VIDE ou
 *     déjà à lui (<Plage>) ;
 *   ② GALV_Fishing : les poissons 4-13 du gestionnaire (les 1-3 de JOKO ne
 *     bougent pas), « Pris : », « Longueur (cm) », « Poids (kg) » ;
 *     LaPlage dans la liste des plugins, après Habitants ;
 *   ③ les variables 890-898 « ◆ Plage · … » ;
 *   ④ la carte 33 :
 *     · le masqué du ponton (év. 20, l'image « dono mmasque » de JOKO) : le
 *       jour, personne ; le soir (variable 200, l'heure, à partir de 18), une
 *       chose neuve par soir — ce qu'il ne devrait pas savoir, tiré de la Bible
 *       et des fiches des villageois. Sa première phrase reste celle de JOKO.
 *       Ses commentaires (l'indicateur « ... ») restent sur sa page du soir ;
 *     · onze endroits du sable « 🌊 Ce que la mer ramène » (<Trouvaille>) ;
 *     · le Pêcheur (év. 31) : sa page 2, vide, n'avait pas sa condition
 *       cochée (l'interrupteur 105, écrit, jamais coché) : elle passait devant
 *       sa page 1, et le pêcheur n'a jamais été visible. La case est cochée ;
 *     · les quêtes des ✎ « Fille du pêcheur » et « Vieux pêcheur » passent à
 *       Sora et à Orin (refonte/peche.js) : leurs ✎ quittent la carte ; la rive
 *       (✎ Rive du lac) parle de la mer. La « Femme du pêcheur » (la chaîne
 *       des échanges, qui passe par le Village Montagnard retiré) reste où JOKO
 *       l'a rangée : à lui.
 *
 *   node bancs/outils/poser_la_plage.js            → contrôle
 *   node bancs/outils/poser_la_plage.js --ecrire   → écrit
 *   … --ecrire --sortie <dossier>                   → écrit ailleurs (bancs)
 * Jamais tant que RPGMV.exe est ouvert (l'éditeur réécrit tout à sa sauvegarde).
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RACINE = path.join(__dirname, '..', '..');
var DATA = path.join(RACINE, 'data');
var ECRIRE = process.argv.indexOf('--ecrire') >= 0;
var iSo = process.argv.indexOf('--sortie'), SORTIE = iSo >= 0 ? path.resolve(process.argv[iSo + 1]) : null;
var D = require('./recettes/dsl.js');
var H = require('./habitants/moteur.js');
var A = D.A, C = D.C, si = D.si, cat = D.cat;
var CARTE = 33;
var defauts = [], fait = [];

/* ── ① les objets ─────────────────────────────────────────────────────── */
var OBJETS = [
    [117, 'Sardine', 260, 12, '<Poisson>', 'Petite, argentée, et il y en a toujours une de plus.\nAnnick l\'achète.'],
    [118, 'Maquereau', 260, 20, '<Poisson>', 'Rayé de bleu. Au printemps et l\'été, il mord à tout.\nAnnick l\'achète.'],
    [119, 'Hareng', 260, 15, '<Poisson>', 'Le poisson du froid, le matin, en automne et en hiver.\nAnnick l\'achète.'],
    [120, 'Rouget', 260, 35, '<Poisson>', 'Rouge comme le soir, en été et à l\'automne.\nAnnick l\'achète.'],
    [121, 'Dorade', 260, 40, '<Poisson>', 'Un trait d\'or entre les yeux. Le printemps, l\'été.\nAnnick l\'achète.'],
    [122, 'Bar', 260, 45, '<Poisson>', 'Le soir et à l\'aube. Il se bat jusqu\'au bout.\nAnnick l\'achète.'],
    [123, 'Sole', 260, 50, '<Poisson>', 'Plate, au fond, les deux yeux du même côté.\nAnnick l\'achète.'],
    [124, 'Congre', 260, 55, '<Poisson>', 'Long, gris, et il mord. La nuit seulement.\nAnnick l\'achète.'],
    [125, 'Le Patriarche', 2721, 400, '<Poisson: trophée>', 'Un bar si vieux que ses écailles ont blanchi. Régis jure\nl\'avoir vu. Maintenant, toi aussi. Il ne se vend pas.'],
    [126, 'Coquillage', 315, 5, '<Trouvaille>', 'À moitié dans le sable. Sora en a sûrement un pareil.\nSûrement pas.'],
    [127, 'Coquillage violet', 2724, 30, '<Trouvaille>', 'Vraiment violet. Ça, Sora ne l\'a pas.'],
    [128, 'Verre poli', 2727, 8, '<Trouvaille>', 'Un éclat de bouteille que la mer a usé jusqu\'à le rendre\ndoux. Il ne coupe plus.'],
    [129, 'Bois flotté', 295, 6, '<Trouvaille>', 'Blanchi par le sel, léger comme rien.'],
    [130, 'Bouteille à la mer', 275, 0, '<Bouteille>', 'Bouchée à la cire. Un papier roulé dedans, une écriture\nd\'enfant. Sora saura quoi en faire.'],
    [131, 'Lettre de Sora', 192, 0, '<Bouteille>', 'Écrite au crayon, un coquillage dessiné dans le coin.\nPour Élise, à la Ville Forestière.']
];
function poserObjets(items) {
    var modele = JSON.parse(JSON.stringify(items[103]));
    OBJETS.forEach(function (o) {
        var id = o[0], cur = items[id];
        if (cur && cur.name && !/<Plage>/.test(cur.note || '')) { defauts.push('objet ' + id + ' : la case porte déjà « ' + cur.name + ' »'); return; }
        var it = JSON.parse(JSON.stringify(modele));
        it.id = id; it.name = o[1]; it.iconIndex = o[2]; it.price = o[3];
        it.note = '<Plage>\n' + o[4]; it.description = o[5];
        it.itypeId = /<Bouteille>/.test(o[4]) ? 2 : 1;          // la bouteille et la lettre : des objets clés
        it.consumable = false; it.occasion = 3; it.scope = 0; it.effects = [];
        it.damage = { critical: false, elementId: 0, formula: '0', type: 0, variance: 20 };
        items[id] = it;
    });
    fait.push('objets 117-131 (' + OBJETS.length + ')');
}

/* ── ② GALV_Fishing et LaPlage ────────────────────────────────────────── */
// img,vitesse,force,mouvement,profondeur,x,objet,appât,portée,dans les records,longueur,poids,texte,év. commun,anim
var POISSONS = {
    4: 'green,14,0,2,6|10,-1,117,1,30|2,true,15|22,0.05|0.12,,0,',
    5: 'green,18,1,2,5|9,-1,118,1,30|2,true,25|40,0.3|0.8,,0,',
    6: 'green,12,1,1,4|8,-1,119,1,30|2,true,20|32,0.15|0.4,,0,',
    7: 'devil,10,2,1,1|4,-1,120,1,25|2,true,15|30,0.1|0.5,,0,',
    8: 'purple,12,3,1,3|6,-1,121,1,25|2,true,25|50,0.5|2.5,,0,',
    9: 'purple,15,5,2,3|8,-1,122,1,25|2,true,40|80,1|6,,0,',
    10: 'purple,6,3,1,0|1,-1,123,1,20|2,true,25|45,0.3|1.2,,0,',
    11: 'devil,9,6,2,0|3,-1,124,1,20|2,true,80|180,3|15,,0,',
    12: 'purple,20,9,2,2|9,-1,125,1,35|2,true,110|140,14|22,,0,',
    13: 'chest,0,4,-1,0|0,-1,108,1,15|2,false,0|0,0|0,Une caisse remonte du fond. Dedans : un fil qui ne vient pas d\'ici.,0,'
};
var LAPLAGE = { name: 'LaPlage', status: true,
    description: 'v1.0 ■ La plage : la pêche en mer selon l\'heure, la saison et le temps ; Annick qui achète ; le concours ; ce que la mer ramène ; les bouteilles d\'Élise et de Sora ; le masqué du ponton, le soir.',
    parameters: {
        carte: '33',
        etang: JSON.stringify('4 | 5-17 | tout | tout | 3-6     sardine\n5 | 6-17 | 1,2 | tout | 2-4     maquereau\n6 | 5-11 | 3,4 | tout | 2-4     hareng\n7 | 8-17 | 2,3 | tout | 1-3     rouget\n8 | 7-20 | 1,2 | tout | 1-2     dorade\n9 | 17-7 | tout | tout | 1-2    bar (le soir, l\'aube)\n10 | 0-23 | tout | tout | 0-2   sole\n11 | 21-5 | tout | tout | 1-2   congre (la nuit)\n12 | 4-7 | 3,4 | pluie | 1     le Patriarche (l\'aube, l\'automne et l\'hiver, sous la pluie)\n3 | 0-23 | tout | tout | 1     la pierre (celle de JOKO)'),
        caisse: '10', numeroCaisse: '13', prixAnnick: '100', concours: '2/15', concoursHeures: '8-17', concoursPrix: '300, 120, 40', rivaux: '1.5-5.5, 1.2-5.8',
        trouvailles: JSON.stringify('126 40   coquillage\n127 6    coquillage violet\n128 20   verre poli\n129 25   bois flotté'),
        trouvaillesParJour: '1-3', lettres: '5', ecartLettres: '1',
        varNombre: '890', varOr: '891', varPoids: '892', varRang: '893', varRoul: '894', varTobin: '895', varObjet: '896', varDono: '897', varLettre: '898', varSora: '899'
    } };
function lirePlugins() {
    var brut = fs.readFileSync(path.join(RACINE, 'js', 'plugins.js'), 'utf8');
    var debut = brut.indexOf('['), fin = brut.lastIndexOf(']');
    return { tete: brut.slice(0, debut), liste: JSON.parse(brut.slice(debut, fin + 1)), queue: brut.slice(fin + 1) };
}
function ecrirePlugins(p) { return p.tete + '[\n' + p.liste.map(function (x) { return JSON.stringify(x); }).join(',\n') + '\n]' + p.queue; }
function poserPlugins(p) {
    var g = p.liste.filter(function (x) { return x.name === 'GALV_Fishing'; })[0];
    if (!g) { defauts.push('GALV_Fishing absent de la liste'); return; }
    Object.keys(POISSONS).forEach(function (n) {
        var cur = g.parameters['Fish ' + n];
        if (cur && cur !== POISSONS[n] && !/,(11[7-9]|12[0-5]|108),/.test(cur)) { defauts.push('GALV_Fishing : « Fish ' + n + ' » est déjà rempli par JOKO'); return; }
        g.parameters['Fish ' + n] = POISSONS[n];
    });
    var vie = p.liste.filter(function (x) { return x.name === 'VieDuVillage'; })[0];
    if (vie && vie.parameters.repas === undefined) vie.parameters.repas = '33: 29,30';     // v2.5 : midi sur le sable
    g.parameters['Caught Text'] = 'Pris :';
    g.parameters['Length Text'] = 'Longueur (cm)';
    g.parameters['Weight Text'] = 'Poids (kg)';
    var i = p.liste.findIndex(function (x) { return x.name === 'LaPlage'; });
    if (i >= 0) { LAPLAGE.status = p.liste[i].status; p.liste[i] = LAPLAGE; }
    else {
        var apres = p.liste.findIndex(function (x) { return x.name === 'Habitants'; });
        p.liste.splice(apres + 1, 0, LAPLAGE);
    }
    fait.push('GALV_Fishing : poissons 4-13 ; LaPlage après Habitants');
}

/* ── ③ les variables ──────────────────────────────────────────────────── */
var NOMS_VAR = { 890: '◆ Plage · poissons vendus', 891: '◆ Plage · or de la vente', 892: '◆ Plage · ta prise (g)', 893: '◆ Plage · rang au concours',
    894: '◆ Plage · Roul (g)', 895: '◆ Plage · Tobin (g)', 896: '◆ Plage · ce que la mer ramène', 897: '◆ Plage · ce que dit le masqué', 898: '◆ Plage · la lettre', 899: '◆ Plage · coquillages de Sora' };

/* ── ④ la carte ───────────────────────────────────────────────────────── */
function page(o) {
    return {
        conditions: Object.assign({ actorId: 1, actorValid: false, itemId: 1, itemValid: false, selfSwitchCh: 'A', selfSwitchValid: false,
            switch1Id: 1, switch1Valid: false, switch2Id: 1, switch2Valid: false, variableId: 1, variableValid: false, variableValue: 0 }, o.cond || {}),
        directionFix: !!o.fixe, image: Object.assign({ tileId: 0, characterName: '', direction: 2, pattern: 0, characterIndex: 0 }, o.image || {}),
        list: o.list.map(function (c) { return { code: c[0], indent: c[1], parameters: c[2] }; }).concat([{ code: 0, indent: 0, parameters: [] }]),
        moveFrequency: 3, moveRoute: { list: [{ code: 0, parameters: [] }], repeat: true, skippable: false, wait: false }, moveSpeed: 3, moveType: 0,
        priorityType: o.priorite === undefined ? 1 : o.priorite, stepAnime: !!o.pasAnime, through: !!o.traverse, trigger: o.declencheur || 0, walkAnime: o.marche !== false
    };
}
function texte(t) { return H.parle('', t); }          // une boîte sans nom ; « ~ » : une didascalie

// ── le masqué du ponton : ce qu'il dit, un soir après l'autre ──
// Les sources : la Bible (« Le niveau indique le Chapitre » ; « Edwin part pour sa première faille […] dans le
// groupe A, avec Vesper et Ludwig ; Aël est dans le groupe B » ; « Le sang de Vesper se manie par les voies d'art ;
// les âmes de Ludwig, gravées dans les runes de son collier […] ; la glace de Korrah passe par la Parole. Même
// Donovano respecte la règle » ; « absorber d'autres âmes le rend plus puissant, mais leurs traumas viennent
// avec » ; Aël, « en ultime, elle est la meilleure, et la plus rapide à le sortir » ; Korrah, « elle doit apprendre
// à se concentrer » ; le Quartier Noyé, son enceinte, le Héros ; « pourquoi une faille de niveau 3, venue du
// Chapitre de la Chair, s'est-elle ouverte sous la capitale ? Et d'où vient Donovano ? » — que la Bible laisse
// ouverte, et lui aussi ; les vérités cachées : les courtiers du Marché d'Ombre, la Communion des Cendres ;
// Isembre : « Tous lui en veulent d'avoir ouvert le Livre ; tous profitent de ce qu'elle a ouvert ») ; Notion (les
// Larmiers : la pluie presque tous les jours) ; et les secrets des fiches des villageois (personne ne les connaît).
var MASQUE = [
    [['tu la vois toi aussi ? '], ['~Il ne te regarde pas. Il regarde le bout du ponton, où il n\'y a que l\'eau.']],
    ['Votre grotte. Niveau un. Le niveau dit le Chapitre. Personne ici ne le sait, et c\'est mieux comme ça.|Derrière, il pleut. Presque tous les jours.'],
    ['Un étang où le ciel est par terre. Ceux qui y entreront lui trouveront un nom. Ils ne savent pas encore lequel.|Moi, si.'],
    'chef',
    ['Le groupe A partira le premier. Edwin Bramble en sera. Avec \\N[1] et \\N[3].|\\N[4], groupe B.|… Ils ne l\'ont pas encore annoncé.'],
    ['La petite aux coquillages en a un qu\'elle appelle « Papa ». Elle ne l\'a montré à personne. Pas même à lui.'],
    ['Une faille de niveau trois. Venue du Chapitre de la Chair. Sous la capitale, sous les bas quartiers.|… Personne ne s\'est demandé pourquoi là ?'],
    ['Le Quartier Noyé. Ils ont mis une enceinte autour, et un titre sur quelqu\'un.|Les deux tiennent. Pour l\'instant.'],
    ['La marchande de poisson a appris à lire, seule, la nuit. Pour les carnets de son fils. Elle n\'y comprend rien. Elle les lit quand même.|C\'est ce que ce village a de plus beau.'],
    ['À la capitale, il y a un marché où les courtiers ne savent pas pour qui ils travaillent. Ne leur pose pas la question.|Eux ne savent pas. Moi, si.'],
    ['Ceux de la Communion des Cendres prient pour un royaume plus juste. Certains y croient vraiment.|Demande-leur d\'où vient leur feu. Ils ne sauront pas répondre.'],
    ['Le père du jeune garde vient le regarder chaque matin, de loin. Le garçon ne l\'a jamais vu. Tout le village le sait. Sauf lui.'],
    ['Une reine a ouvert un Livre. Tout le monde lui en veut. Tout le monde vit de ce qu\'elle a ouvert.|Toi aussi, bientôt.'],
    ['D\'où je viens ? … Tout le monde finit par le demander.|Ceux qui demandent ont presque toujours déjà décidé de la réponse.'],
    ['Les dons n\'exemptent de rien. Le sang se manie, les âmes s\'écrivent, la glace se dit. Chacun suit la règle.|… Même moi.', '~Il redresse son masque, et se tait.']
];
var CHEF = {
    1: 'Ton sang se manie par les voies d\'art. Comme une lame, comme un pas. Tu l\'as compris seule, et tu ne l\'as dit à personne.',
    2: 'La glace se dit. Elle passe par la Parole, la tienne aussi.|Ce qui te manque, ce n\'est pas la force. C\'est de rester là, au moment de viser.',
    3: 'Les runes de ton collier. Chaque âme que tu gardes te rend plus fort.|Et chacune vient avec ce qu\'elle a vécu. Tu le sens déjà, la nuit.',
    4: 'Quand tu iras au bout de ce que tu sais dire, tu seras la meilleure. Et la plus rapide.|… Ne me demande pas comment je le sais.'
};
var MASQUE_ENCORE = ['~Il regarde l\'eau. Il ne répond pas.', 'Il est tard. Rentre.', 'J\'ai dit ce que j\'avais à dire, ce soir.', 'Demain soir. Peut-être.'];
var MASQUE_PRISE = 'Ton plus lourd, aujourd\'hui : \\V[892] grammes.|Je ne t\'ai pas regardé pêcher. Je n\'en ai pas besoin.';
function pagesDuMasque(e) {
    var orig = e.pages.filter(function (p) { return p.image.characterName === 'dono mmasque'; })[0] || e.pages[0];
    var garder = orig.list.filter(function (c) { return (c.code === 108 || c.code === 408) && !/^◆ PONTON/.test(String(c.parameters[0])); }).map(function (c) { return [c.code, 0, c.parameters]; });
    var N = MASQUE.length;
    function dire(k) {
        var x = MASQUE[k];
        if (x === 'chef') {
            function chaine(ids) {
                if (!ids.length) return texte('Tu n\'es pas d\'ici. Moi non plus. C\'est tout ce qu\'on a en commun. Pour l\'instant.');
                return si(C.js('$gameParty.leader() && $gameParty.leader().actorId() === ' + ids[0]), texte(CHEF[ids[0]]), chaine(ids.slice(1)));
            }
            return chaine([1, 2, 3, 4]);
        }
        return cat.apply(null, x.map(function (t) { return texte(Array.isArray(t) ? t[0] : t); }));
    }
    function selonN(k) { return k >= N ? [] : si(C.vr(897, '=', k + 1), dire(k), selonN(k + 1)); }
    var corps = cat(
        D.note('◆ PONTON · le masqué — un teaser de Dono et du lore (JOKO, 2026-11-09 : « il connaît des choses qu\'il devrait pas connaître, tu le vois que le soir »).'),
        D.note('Une chose neuve par soir (' + N + ' en tout), tirée de la Bible et des fiches des villageois ; ensuite, il se tait. Sa première phrase est celle de JOKO. Généré par bancs/outils/poser_la_plage.js.'),
        si(C.js('Plage.donoNeuf(' + N + ')'),
            cat(A.js('Plage.donoSuivant();'), selonN(0)),
            si(C.js('Plage.prise() > 0 && Math.random() < 0.4'),
                cat(A.js('$gameVariables.setValue(892, Plage.prise());'), texte(MASQUE_PRISE)),
                H.unParmi('', MASQUE_ENCORE)))
    );
    var jour = page({ list: D.note('◆ PONTON · le jour, le bout du ponton est vide : le masqué ne vient que le soir (page 2, l\'heure ≥ 18).'), priorite: 1 });
    var soirP = page({ cond: { variableId: 200, variableValid: true, variableValue: 18 }, image: JSON.parse(JSON.stringify(orig.image)), list: garder.concat(corps),
        fixe: orig.directionFix, priorite: orig.priorityType, declencheur: orig.trigger });
    soirP.moveType = orig.moveType; soirP.moveSpeed = orig.moveSpeed; soirP.moveFrequency = orig.moveFrequency; soirP.stepAnime = orig.stepAnime; soirP.walkAnime = orig.walkAnime;
    return [jour, soirP];
}

// ── ce que la mer ramène : les endroits du sable ──
var SABLE = [[35, 21], [33, 24], [31, 26], [34, 28], [30, 30], [26, 31], [22, 33], [27, 34], [18, 34], [12, 36], [6, 35]];
var DITS = {
    126: ['~Un coquillage, à moitié dans le sable. Sora en a sûrement un pareil. Sûrement pas.', '~Un coquillage, rose à l\'intérieur, comme une oreille.', '~Un coquillage. Il y a encore du sable dedans, et un peu de bruit de mer.'],
    127: ['~Un coquillage violet. Vraiment violet. Ça, Sora ne l\'a pas.'],
    128: ['~Du verre poli par la mer, vert comme un fond de bouteille. Il ne coupe plus.', '~Un éclat de verre bleu, tout doux. La mer a mis des années à le faire.'],
    129: ['~Du bois flotté, blanchi par le sel. Léger comme rien.', '~Une branche que la mer a rapportée. Elle a dû venir de loin : il n\'y a pas cet arbre-là ici.'],
    130: ['~Une bouteille, bouchée à la cire. Dedans, un papier roulé. Dehors, au charbon : « POUR QUI TROUVE (SI C\'EST UNE FILLE C\'EST MIEUX) ».|~Une écriture d\'enfant. Sora saura quoi en faire.']
};
function pagesDuSable(n) {
    var trouver = cat.apply(null, Object.keys(DITS).map(function (k) { return si(C.vr(896, '=', Number(k)), H.unParmi('', DITS[k])); }));
    var p1 = page({ list: cat(D.note('<Trouvaille>'), D.note('◆ PLAGE · ce que la mer ramène (' + n + ') — chaque matin, LaPlage pose une chose sur quelques-uns de ces endroits (auto-interrupteur A). Généré par bancs/outils/poser_la_plage.js.')), priorite: 0 });
    var p2 = page({ cond: { selfSwitchValid: true, selfSwitchCh: 'A' }, image: { characterName: 'sparkles', characterIndex: 5, direction: 2, pattern: 1 }, priorite: 1, traverse: true, pasAnime: true,
        list: cat(A.js('Plage.ramasser(this);'), si(C.vr(896, '>', 0), cat(A.se('Item1', 80, 110), trouver))) });
    return [p1, p2];
}

function passable(m, T, x, y) {
    var W = m.width, Hh = m.height;
    for (var z = 3; z >= 0; z--) { var f = T.flags[m.data[(z * Hh + y) * W + x] || 0]; if (f & 0x10) continue; if ((f & 0x0f) === 0) return true; if ((f & 0x0f) === 0x0f) return false; }
    return false;
}
var RIVE_MER = ['Une note. Une seule, très basse, venue', 'de sous la mer. Elle tient plus longtemps', 'qu\'un souffle. Puis plus rien.'];
function poserCarte(m, T) {
    // le masqué
    var e20 = m.events[20];
    if (!e20 || !e20.pages.some(function (p) { return p.image.characterName === 'dono mmasque'; })) defauts.push('carte 33 év. 20 : le masqué n\'y est plus (« dono mmasque ») : pas réécrit');
    else { e20.pages = pagesDuMasque(e20); if (/^EV\d+$/.test(e20.name)) e20.name = 'Le masqué du ponton'; fait.push('le masqué du ponton (' + MASQUE.length + ' soirs)'); }
    // le pêcheur : la case de sa page 2
    var e31 = m.events[31];
    if (e31 && e31.pages[1] && e31.pages[1].conditions.switch1Id === 105 && !e31.pages[1].conditions.switch1Valid && !e31.pages[1].image.characterName && e31.pages[1].list.length <= 1) {
        e31.pages[1].conditions.switch1Valid = true; fait.push('le Pêcheur (31) : la condition de sa page 2 cochée — il est enfin visible');
    }
    // les quêtes des ✎ passent à Sora et à Orin
    ['✎ Fille du pêcheur', '✎ Vieux pêcheur'].forEach(function (nom) {
        var i = m.events.findIndex(function (e) { return e && e.name === nom; });
        if (i > 0) { m.events[i] = null; fait.push('« ' + nom + ' » retiré : sa quête est à ' + (/Fille/.test(nom) ? 'Sora' : 'Orin')); }
    });
    var rive = m.events.filter(function (e) { return e && e.name === '✎ Rive du lac'; })[0];
    if (rive) {
        rive.name = '✎ Rive';
        rive.pages.forEach(function (p) {
            var k = 0;
            p.list.forEach(function (c) {
                if (c.code !== 401) return;
                var t = String(c.parameters[0]);
                if (/Une note\. Une seule/.test(t)) k = 1;
                if (k >= 1 && k <= 3 && /^(Une note|de sous l'eau|qu'un souffle)/.test(t)) { c.parameters[0] = RIVE_MER[k - 1]; k++; }
                else if (t === 'L\'eau est noire et ne dit rien.') c.parameters[0] = 'La mer est noire et ne dit rien.';
                else if (t === 'L\'eau est noire ici.') c.parameters[0] = 'La mer est noire, ici.';
            });
        });
        fait.push('la rive : « la mer »');
    }
    // les endroits du sable (refaits à chaque passage)
    m.events = m.events.map(function (e) { return e && /^🌊 Ce que la mer ramène/.test(e.name) ? null : e; });
    var occupe = {}; m.events.forEach(function (e) { if (e) occupe[e.x + ',' + e.y] = 1; });
    // des numéros neufs, à la fin : jamais celui d'un habitant que JOKO a retiré (sa mémoire, ses scènes le nomment encore)
    while (m.events.length > 1 && m.events[m.events.length - 1] === null) m.events.pop();
    var prochain = m.events.length, n = 0;
    SABLE.forEach(function (c) {
        if (occupe[c[0] + ',' + c[1]] || !passable(m, T, c[0], c[1])) { defauts.push('sable ' + c[0] + ',' + c[1] + ' : occupé ou pas praticable'); return; }
        var id = prochain++;
        n++;
        m.events[id] = { id: id, name: '🌊 Ce que la mer ramène · ' + n, note: '', pages: pagesDuSable(n), x: c[0], y: c[1] };
        occupe[c[0] + ',' + c[1]] = 1;
    });
    while (m.events.length > 1 && m.events[m.events.length - 1] === null) m.events.pop();
    fait.push(n + ' endroits du sable');
}

/* ── le contrôle ─────────────────────────────────────────────────────── */
function controle(m) {
    m.events.forEach(function (e) {
        if (!e) return;
        e.pages.forEach(function (p, k) {
            var pile = 0;
            p.list.forEach(function (c) {
                if (c.code === 401 && String(c.parameters[0]).replace(/\\[A-Za-z]+\[[^\]]*\]/g, 'XXXXXX').length > 58) defauts.push(e.name + ' p' + (k + 1) + ' : ligne trop longue « ' + c.parameters[0] + ' »');
                if ((c.code === 355 || c.code === 655 || c.code === 111 && c.parameters[0] === 12)) { try { new Function(c.code === 111 ? 'return (' + c.parameters[1] + ')' : c.parameters[0]); } catch (er) { defauts.push(e.name + ' : script invalide ' + er.message); } }
            });
        });
    });
}

var items = JSON.parse(fs.readFileSync(path.join(DATA, 'Items.json'), 'utf8'));
var plugins = lirePlugins();
var brutCarte = fs.readFileSync(path.join(DATA, 'Map033.json'), 'utf8'), carte = JSON.parse(brutCarte);
var T = JSON.parse(fs.readFileSync(path.join(DATA, 'Tilesets.json'), 'utf8'))[carte.tilesetId];
var SYS = JSON.parse(fs.readFileSync(path.join(DATA, 'System.json'), 'utf8'));
poserObjets(items); poserPlugins(plugins); poserCarte(carte, T); controle(carte);
Object.keys(NOMS_VAR).forEach(function (id) { if (SYS.variables[id] && SYS.variables[id] !== NOMS_VAR[id]) defauts.push('variable ' + id + ' : déjà « ' + SYS.variables[id] + ' »'); SYS.variables[id] = NOMS_VAR[id]; });
console.log('LA PLAGE');
fait.forEach(function (x) { console.log('   · ' + x); });
if (defauts.length) { console.log('   ✗ ' + defauts.length + ' défaut(s) :\n     ' + defauts.join('\n     ')); process.exit(1); }
console.log('   ✓ objets, poissons, carte : sans défaut');
if (!ECRIRE) process.exit(0);
function formatCarte(m) {
    var props = Object.keys(m).filter(function (k) { return k !== 'data' && k !== 'events'; }).map(function (k) { return JSON.stringify(k) + ':' + JSON.stringify(m[k]); }).join(',');
    return '{\n' + props + ',\n"data":' + JSON.stringify(m.data) + ',\n"events":[\n' + m.events.map(function (e) { return JSON.stringify(e); }).join(',\n') + '\n]\n}';
}
var DEST = SORTIE || DATA, DEST_JS = SORTIE || path.join(RACINE, 'js');
if (SORTIE && !fs.existsSync(SORTIE)) fs.mkdirSync(SORTIE, { recursive: true });
fs.writeFileSync(path.join(DEST, 'Map033.json'), formatCarte(carte));
fs.writeFileSync(path.join(DEST, 'Items.json'), '[\n' + items.map(function (x) { return JSON.stringify(x); }).join(',\n') + '\n]');   // le format de l'éditeur : un objet par ligne
var brutSys = fs.readFileSync(path.join(DATA, 'System.json'), 'utf8');
fs.writeFileSync(path.join(DEST, 'System.json'), JSON.stringify(SYS) + (brutSys.endsWith('\n') ? '\n' : ''));
fs.writeFileSync(path.join(DEST_JS, 'plugins.js'), ecrirePlugins(plugins));
console.log('   écrit' + (SORTIE ? ' dans ' + SORTIE : '') + ' : Map033, Items, System, plugins.js');
