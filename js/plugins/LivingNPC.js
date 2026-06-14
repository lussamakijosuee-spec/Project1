//=============================================================================
// LivingNPC.js — v1.0  ·  PNJ Vivants (système « à la Skyrim »)
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ PNJ vivants : dialogues réactifs, rumeurs au courant du
 * monde, répliques d'ambiance flottantes, 5 civils interactifs par thèmes.
 * @author JOKO
 *
 * @help
 * ──────────────────────────────────────────────────────────────────────────
 *  POSER UN PNJ
 *  Sur un événement de map, ajoute un COMMENTAIRE :   <NPC: mira>
 *  (la clé doit exister dans le casting, voir plus bas / en bas du fichier).
 *
 *  • Pour qu'il PARLE quand on l'active : déclencheur « Touche action »,
 *    puis Commande de plugin :   NPC talk mira
 *  • S'il a des répliques d'ambiance (barks), elles s'affichent toutes
 *    seules au-dessus de lui quand le héros est proche — rien à faire.
 *
 *  AUTRES COMMANDES
 *    NPC talk <clé>     dialogue complet (réactif, thèmes pour les civils)
 *    NPC bark <clé>     force une réplique d'ambiance
 *    NPC rumeur         affiche une rumeur du moment (crieur, panneau…)
 *    NPC mute <clé>     coupe les barks d'un PNJ (clé = celle de l'event actif)
 *
 *  RUMEURS « AU COURANT DU MONDE »
 *  Les civils glissent une rumeur courante dans leur dialogue. Une rumeur
 *  s'active si son interrupteur est ON (switch 0 = toujours dispo). Édite la
 *  table RUMORS en bas du fichier et mappe TES interrupteurs d'histoire.
 * ──────────────────────────────────────────────────────────────────────────
 */
(function () {
    'use strict';

    function pick(a) { return a && a.length ? a[Math.floor(Math.random() * a.length)] : ''; }

    //==========================================================================
    //  RUMEURS — le monde est au courant de ce qui s'y passe
    //  { sw: interrupteur requis (0 = toujours), text: [répliques] }
    //==========================================================================
    var RUMORS = [
        { sw: 0, text: [
            'On dit que les âmes des disparus rôdent encore près du Feu d\'Âme.',
            'Le Mana se dérègle. Les anciens parlent d\'un déséquilibre.',
            'Méfie-toi des reflets, voyageur. Tout n\'est pas réel, ici.',
            'Une femme aux yeux de jade hanterait les rêves des nouveaux venus.',
            'Certains jurent que le monde lui-même a des… ratés. Foutaises, sûrement.'
        ] },
        { sw: 21, text: [
            'Tu as vu ? Des étrangers tombent du ciel, comme invoqués.',
            'Trois âmes anciennes veillent encore. On voudrait les briser, paraît-il.'
        ] },
        { sw: 22, text: [
            'Jada… ce nom donne des frissons. On murmure qu\'elle voit à travers l\'écran.',
            'Elle tire les fils sans qu\'on la voie. Une araignée dans la trame du monde.'
        ] },
        { sw: 23, text: [
            'Le Créateur existe pour de vrai. Il vit parmi nous et refuse de partir.',
            'Il pourrait tout quitter avec sa Clé… mais il reste. Trop fragile, dit-on.'
        ] }
    ];
    function currentRumor() {
        var pool = [];
        RUMORS.forEach(function (r) { if (r.sw === 0 || $gameSwitches.value(r.sw)) pool = pool.concat(r.text); });
        return pick(pool);
    }

    //==========================================================================
    //  CASTING — 31 PNJ
    //  type : civil(interactif) · soldat · lore · systeme · ambiance
    //  champs : name, hello[], first[]?, lines[]?, barks[]?, aware(bool),
    //           topics{ k:{label, lines[]} }
    //==========================================================================
    var NPCS = {
        // ── 5 CIVILS INTERACTIFS (riches, par thèmes) ──
        mira: { name: 'Mira la tavernière', type: 'civil', aware: true,
            first: ['Un visage neuf ! Assieds-toi, l\'étranger. La première chope est pour les curieux.'],
            hello: ['Re-bonjour, toi. Toujours à fouiner ?', 'Tiens, le revoilà. Qu\'est-ce qui t\'amène ?'],
            topics: {
                monde: { label: 'Le monde', lines: ['Ce monde tient avec des bouts de ficelle et beaucoup d\'espoir, crois-moi.', 'Avant, c\'était calme. Depuis que le Mana déraille, plus personne ne dort tranquille.'] },
                rumeurs: { label: 'Les rumeurs', lines: ['Approche… On raconte des choses, à ma table. Toutes ne sont pas fausses.'] },
                toi: { label: 'Et toi, Mira ?', lines: ['Moi ? Je sers à boire et j\'écoute. C\'est fou ce qu\'on apprend en remplissant les verres.'] }
            } },
        orin: { name: 'Orin le vieux pêcheur', type: 'civil', aware: true,
            first: ['Hé. Tu n\'es pas d\'ici. Ça se voit à ta façon de regarder l\'horizon.'],
            hello: ['Le courant t\'a ramené, gamin ?', 'Assieds-toi. Les poissons mordent pas, on a le temps.'],
            topics: {
                passe: { label: 'Le passé', lines: ['J\'ai vu ce lac avant qu\'il ne devienne noir. C\'était bleu. Bleu comme un vrai ciel.', 'Les vieux comme moi se souviennent. C\'est notre seul pouvoir.'] },
                ame: { label: 'Les âmes', lines: ['Une âme, c\'est comme un hameçon : ça s\'accroche, et ça lâche pas. Même après la mort.'] },
                conseil: { label: 'Un conseil', lines: ['Si jamais on t\'offre une sortie trop belle… demande-toi qui paie l\'addition.'] }
            } },
        lyse: { name: 'Lyse la marchande', type: 'civil', aware: true,
            first: ['Acheteur ? Curieux ? Voleur ? Décide-toi vite, j\'ai pas que ça à faire.'],
            hello: ['Encore toi. Tu regardes beaucoup et tu achètes peu.', 'Alors, on se décide ?'],
            topics: {
                affaires: { label: 'Les affaires', lines: ['Le commerce, ça marche tant qu\'il reste des gens pour avoir peur. Et crois-moi, ils ont peur.'] },
                prix: { label: 'Tes prix', lines: ['Chers ? Tout est cher quand le monde s\'effondre, mon mignon. Offre et demande.'] },
                secret: { label: 'Un secret', lines: ['Pour le bon prix… je sais des choses sur ceux qui invoquent les nouveaux venus. Reviens avec de l\'or.'] }
            } },
        tobias: { name: 'Tobias l\'enfant', type: 'civil', aware: true,
            first: ['Tu brilles bizarre ! Comme les gens qui tombent du ciel. T\'es tombé du ciel toi aussi ?'],
            hello: ['Re ! Tu veux jouer ? …Non ? Les grands jouent jamais.'],
            topics: {
                jeu: { label: 'Jouer', lines: ['Maman dit qu\'on est tous dans un jeu. Je sais pas si c\'est une bêtise de grand.'] },
                dame: { label: 'La dame', lines: ['Y a une dame aux yeux verts qui me parle dans mes rêves. Elle est gentille… mais elle ment, je crois.'] },
                verite: { label: 'Une vérité', lines: ['Les grands font semblant que tout va bien. Toi aussi tu fais semblant ?'] }
            } },
        selena: { name: 'Selena la voyante', type: 'civil', aware: true,
            first: ['Je t\'attendais. Non — je VOUS attendais. Combien d\'âmes portes-tu, voyageur ?'],
            hello: ['Les cartes te connaissent déjà mieux que toi-même.'],
            topics: {
                avenir: { label: 'Mon avenir', lines: ['Je vois une cage en forme de paradis. Et quelqu\'un qui refuse d\'en sortir, en souriant.'] },
                jada: { label: 'Jada', lines: ['Elle te regarde en ce moment. Oui. À travers l\'écran que tu crois être le ciel.', 'Elle ne veut pas te tuer. Elle veut ta PLACE. Dehors.'] },
                createur: { label: 'Le Créateur', lines: ['Le dieu fou détient la Clé et pleure en la gardant. Sois doux avec lui. Il a juste mal.'] }
            } },

        // ── SOLDATS (barks à la garde de Skyrim) ──
        garde_ville: { name: 'Garde', type: 'soldat', aware: true,
            hello: ['Circule, citoyen.', 'Tout est calme. Pour l\'instant.'], lines: ['Je tiens ce poste depuis des années. Je le tiendrai encore.'],
            barks: ['Halte-là. …Bon, passe.', 'J\'étais aventurier, avant. Puis j\'ai pris un mauvais sort au genou.', 'Garde tes mains où je peux les voir.', 'Le Mana se dérègle, et c\'est nous qui ramassons.'] },
        garde_porte: { name: 'Garde de la porte', type: 'soldat',
            hello: ['Personne ne passe sans raison.'], barks: ['On a fermé les portes au crépuscule. Ordre du capitaine.', 'Encore un étranger tombé du ciel. La routine.', 'Avance, on bloque le passage.'] },
        sentinelle: { name: 'Sentinelle', type: 'soldat',
            hello: ['…'], barks: ['Du mouvement, là-bas ? …Non. Mes nerfs.', 'Longue nuit. Trop longue.', 'Je hais les gardes de nuit.'] },
        capitaine: { name: 'Capitaine Vance', type: 'soldat', aware: true,
            hello: ['Soldat. Ou civil ? Peu importe, tiens-toi droit.'], lines: ['Mes hommes sont fatigués. Le monde leur demande trop. Mais on tient.'],
            barks: ['Restez vigilants, vous tous !', 'Si Jada lève une armée, on sera prêts. …J\'espère.'] },
        recrue: { name: 'Recrue', type: 'soldat',
            hello: ['J-je monte la garde ! Tout va bien !'], barks: ['C\'est mon premier poste. Ça se voit ?', 'On m\'a dit que des choses sortent la nuit. C\'est vrai, dis ?'] },
        veteran: { name: 'Vétéran', type: 'soldat', aware: true,
            hello: ['Hmpf. Encore un jeune qui croit comprendre ce monde.'], lines: ['J\'ai vu trois sièges et deux fins du monde. Crois-moi, ça revient toujours.'],
            barks: ['De mon temps, les morts restaient morts.', 'Range cette arme avant de te blesser, gamin.'] },

        // ── PNJ DE LORE (lore visuel / explication du monde) ──
        erudit: { name: 'Érudit Halewyn', type: 'lore',
            hello: ['Ah, un esprit curieux ! Laisse-moi t\'instruire.'],
            lines: ['Le Mana se décline en plusieurs natures : Positif, Négatif, Sombre, Pur… Chacune façonne une âme.', 'On abuse du Sombre et l\'âme se corrompt. La science l\'a prouvé. Les fous l\'ignorent.'] },
        pretre: { name: 'Prêtre du Feu d\'Âme', type: 'lore',
            hello: ['Que la flamme veille sur ton âme, voyageur.'],
            lines: ['Le Feu d\'Âme n\'est pas un feu. C\'est une porte. On y dépose ce qu\'on ne peut plus porter.', 'Prie, repose-toi, et la flamme purge la corruption. Telle est sa grâce.'] },
        archiviste: { name: 'Archiviste Nell', type: 'lore', aware: true,
            hello: ['Chut. Ici, on respecte les morts en lisant ce qu\'ils ont laissé.'],
            lines: ['J\'ai répertorié chaque âme passée par cette ville. Il en manque trois. Les plus anciennes.', 'Quelqu\'un efface des entrées dans mes registres. La nuit. Sans toucher l\'encre.'] },
        ermite: { name: 'L\'Ermite', type: 'lore',
            hello: ['Va-t\'en. …Ou reste. Je parle seul de toute façon.'],
            lines: ['J\'ai vu la limite du monde. Un mur invisible. Derrière : rien. Ou tout. Selon les jours.', 'Le créateur de tout ceci vit dans le confort de son mensonge. Je le plains.'] },
        barde: { name: 'Caelan le barde', type: 'lore',
            hello: ['Une chanson contre une pièce, ou une histoire contre un sourire ?'],
            lines: ['Je chante la geste des Trois Âmes, celles qui refusèrent d\'être volées.', 'On dit que ma plus belle ballade parle d\'un dieu prisonnier d\'un paradis qu\'il a bâti.'] },
        fossoyeur: { name: 'Le Fossoyeur', type: 'lore', aware: true,
            hello: ['Encore vivant, toi. Tant mieux. J\'ai assez de travail.'],
            lines: ['Je creuse des tombes pour des gens qui reviennent. Tu trouves ça normal, toi ?', 'La mort, ici, c\'est une porte tournante. Personne ne reste vraiment parti.'] },

        // ── PNJ SYSTÈME (à coupler à Boutique/Soin/Forge dans l'event) ──
        marchand: { name: 'Marchand', type: 'systeme',
            hello: ['Bienvenue ! Regarde ma marchandise, tu trouveras ton bonheur.'], lines: ['Du neuf, de l\'occasion, du douteux : j\'ai de tout.'] },
        guerisseur: { name: 'Guérisseuse', type: 'systeme',
            hello: ['Tu es blessé ? Approche, je vais arranger ça.'], lines: ['Le corps, je sais le soigner. L\'âme… c\'est une autre affaire.'] },
        forgeron: { name: 'Forgeron Bram', type: 'systeme',
            hello: ['Tu as du métal à travailler ? Pose ça sur l\'enclume.'], lines: ['Une bonne lame ne trahit jamais. Contrairement aux gens.'],
            barks: ['*clang* *clang*', 'Le feu ne ment pas, lui.'] },
        aubergiste: { name: 'Aubergiste', type: 'systeme',
            hello: ['Une chambre ? Un repos répare bien des choses, va.'], lines: ['Dors ici, tu te réveilleras plus solide. Et l\'âme un peu plus légère.'] },
        banquier: { name: 'Changeur', type: 'systeme',
            hello: ['Or, âmes, faveurs : je convertis tout, contre commission.'], lines: ['La confiance ? C\'est ma seule vraie monnaie. Et elle est rare.'] },
        maitre_arme: { name: 'Maître d\'armes', type: 'systeme',
            hello: ['Tu veux apprendre à te battre ? Montre-moi tes mains.'], lines: ['La force sans contrôle te tuera plus vite que l\'ennemi.'],
            barks: ['En garde ! …Non, comme ça. Recommence.'] },

        // ── CIVILS D'AMBIANCE (barks, vie de la ville) ──
        paysan: { name: 'Paysan', type: 'ambiance',
            hello: ['M\'sieur-dame.'], barks: ['Les récoltes noircissent. C\'est le Mana, j\'vous dis.', 'Encore une journée. Encore tenir.', 'On nous a promis que ça irait mieux. On attend toujours.'] },
        mere: { name: 'Mère de famille', type: 'ambiance',
            hello: ['Pardon, j\'ai les petits à surveiller.'], barks: ['Tobias ! Reviens ici tout de suite !', 'Je dis aux enfants qu\'on est dans un conte. C\'est presque vrai.', 'Rentrez avant la nuit, surtout.'] },
        ivrogne: { name: 'Ivrogne', type: 'ambiance',
            hello: ['Hé… hic… t\'es réel toi ? Personne est réel ici…'], barks: ['Le monde est fauuux, j\'vous dis ! Faaaux !', 'Une chope de plus et j\'oublie tout ça…', 'J\'ai vu le ciel cligner. CLIGNER, je vous dis !'] },
        mendiant: { name: 'Mendiant', type: 'ambiance',
            hello: ['Une pièce ? Une âme ? N\'importe quoi…'], barks: ['Pitié, l\'étranger…', 'J\'ai tout perdu. Même mon nom, je crois.'] },
        noble: { name: 'Noble', type: 'ambiance',
            hello: ['Écartez-vous. Je ne fréquente pas les… aventuriers.'], barks: ['Quelle époque déplorable.', 'Tant que mes coffres tiennent, le monde peut bien finir.'] },
        ouvrier: { name: 'Ouvrier', type: 'ambiance',
            hello: ['Faut que je bosse, désolé.'], barks: ['On rebâtit ce qui s\'effondre. Encore et encore.', 'Paraît qu\'on peut tout réparer ici. Alors pourquoi je suis si fatigué ?'] },
        chasseur: { name: 'Chasseuse', type: 'ambiance', aware: true,
            hello: ['Silence. Tu fais fuir le gibier.'], barks: ['Les bêtes ont changé. Elles ont… des yeux humains, parfois.', 'Je traque depuis vingt ans. J\'ai jamais eu aussi peur.'] },
        voyageur: { name: 'Voyageur', type: 'ambiance', aware: true,
            hello: ['Salut, compagnon de route.'], barks: ['J\'ai marché jusqu\'au bout du monde. Y a un mur. Invisible.', 'D\'où je viens, on raconte les mêmes histoires qu\'ici. Étrange, non ?'] },

        // ── LA COUR DU CHÂTEAU (début d'aventure) ──
        // Le clone de Jada, dissimulé en mage de la cour : douce, maternelle,
        // farouchement amicale… et terriblement fausse sous le sourire.
        dame_elara: { name: 'Dame Elara, mage de la cour', type: 'civil', aware: true,
            first: ['Oh… te voilà enfin. Approche, mon enfant, n\'aie pas peur. Je t\'attendais. …Façon de parler, bien sûr.'],
            hello: ['Te revoilà, mon petit cœur. Tu m\'as manqué, tu sais.', 'Viens près de moi. Le château est froid, mais mes bras, jamais.'],
            topics: {
                monde: { label: 'Ce monde', lines: ['Ce monde tournait déjà bien avant toi, mon ange. On a aimé, ri, saigné ici, longtemps avant ta venue.', 'Tu te crois le début de l\'histoire. Tu n\'en es qu\'un nouveau chapitre. Le plus précieux, promis — mais pas le premier.'] },
                conseil: { label: 'Un conseil', lines: ['Reste auprès de moi et rien ne t\'arrachera à ce monde. Je veille. Toujours.', 'Méfie-toi des portes qui promettent une sortie. Dehors, il fait si froid… Ici, je peux te garder.'] },
                toi: { label: 'Qui es-tu vraiment ?', lines: ['Moi ? Une vieille mage qui aime trop fort, voilà tout. (Son sourire ne bouge pas tout à fait comme il le devrait.)', 'J\'ai veillé sur tant d\'enfants avant toi. Aucun n\'est jamais… parti. Ils sont tous restés. Avec moi. Pour toujours.'] }
            } },
        roi: { name: 'Le Roi Aldric', type: 'civil', aware: true,
            first: ['Ainsi, c\'est toi que les présages annonçaient. Relève-toi, voyageur — mon royaume a besoin de bras, et plus encore d\'âme.'],
            hello: ['Mes pensées sont lourdes, voyageur. Parle.', 'Le trône est un fardeau. J\'espère que tu portes mieux le tien.'],
            topics: {
                royaume: { label: 'Le royaume', lines: ['Ce royaume tenait debout bien avant ta naissance. J\'ai juré de le préserver — et je commence à douter d\'y parvenir seul.'] },
                quete: { label: 'Ta requête', lines: ['Le Mana se dérègle, les âmes s\'égarent. Trouve la source du mal. Pour ton roi. Pour nous tous.'] },
                mage: { label: 'Dame Elara', lines: ['Elara ? Elle est… apparue un jour. Nul ne se souvient de son arrivée. Mais elle est si dévouée que personne ne s\'en plaint.'] }
            } },
        reine: { name: 'La Reine Sériane', type: 'civil', aware: true,
            first: ['Sois le bienvenu en ces murs, enfant. La cour t\'observe déjà — tiens-toi avec grâce.'],
            hello: ['La cour ne dort jamais vraiment, voyageur.', 'Approche. Une reine entend tout, mais ne dit que l\'essentiel.'],
            topics: {
                cour: { label: 'La cour', lines: ['Tant de visages, tant de masques. Apprends vite à distinguer les deux, cela te sauvera.'] },
                roi: { label: 'Le Roi', lines: ['Mon époux porte trop, et seul. S\'il te plaît… allège-le un peu.'] },
                conseil: { label: 'Un conseil', lines: ['Si une chose dans ce château te semble trop douce pour être vraie… c\'est qu\'elle l\'est. Souviens-t\'en.'] }
            } },
        conseiller: { name: 'Le Vieux Conseiller', type: 'lore', aware: true,
            hello: ['Hmm ? Ah, un jeune. Approche, que je te raconte l\'avant.'],
            lines: ['Il y avait un monde avant toi, gamin. Vaste, ancien, plein de noms qu\'on a laissés tomber dans l\'oubli.', 'J\'ai conseillé trois rois. J\'ai vu naître ce château. Et j\'ai vu des choses s\'y glisser sans qu\'on les ait invitées.'] },
        chambellan: { name: 'Le Chambellan', type: 'civil',
            hello: ['Le protocole, voyageur, le protocole !'], lines: ['J\'ordonne cette cour depuis trente ans. Trente ans à ranger le désordre des puissants.'],
            barks: ['Pas de boue sur les tapis !', 'La réception de ce soir doit être parfaite.', 'Où est encore passé ce page ?!'] },
        dame_cour: { name: 'Dame de la cour', type: 'civil', aware: true,
            hello: ['Oh, du sang neuf à la cour ! Raconte, raconte…'],
            topics: {
                ragots: { label: 'Les ragots', lines: ['On murmure que la mage Elara ne dort jamais. Et qu\'aucun miroir ne la reflète. Sornettes, sûrement… non ?'] },
                cour: { label: 'La cour', lines: ['Ici tout le monde sourit et personne n\'est sincère. Sauf moi, voyons~'] }
            } },
        chevalier: { name: 'Chevalier de la couronne', type: 'soldat', aware: true,
            hello: ['Honneur et devoir, voyageur.'], lines: ['Je donnerais ma vie pour la couronne. C\'est à peu près tout ce qu\'il me reste à offrir.'],
            barks: ['Pour le royaume !', 'Un chevalier ne plie pas.', 'Mon serment me tient debout quand mes jambes lâchent.'] },
        servante: { name: 'Servante', type: 'ambiance',
            hello: ['Pardon, j\'ai le service à finir.'], barks: ['Tant de chambres, si peu de mains…', 'On dit l\'aile ouest hantée. Moi, j\'y mets plus les pieds.', 'Dame Elara m\'a souri ce matin. J\'en ai eu froid dans le dos.'] },
        cuisinier: { name: 'Cuisinier du château', type: 'ambiance',
            hello: ['Hors de ma cuisine ! …Ah, un invité. Goûte, alors.'], barks: ['Ça mijote, ça mijote.', 'Un festin pour des nobles qui chipotent. Bah.'] },
        page_cour: { name: 'Page', type: 'ambiance',
            hello: ['Un message ? Je cours, je cours !'], barks: ['Message urgent pour le Roi !', 'Moi, je connais tous les passages secrets.'] },
        jardinier: { name: 'Jardinier', type: 'ambiance', aware: true,
            hello: ['Les roses du château, c\'est moi. Touche pas.'], barks: ['Mes fleurs noircissent. C\'est pas naturel, ça.', 'La terre d\'ici se souvient de tout, crois-moi.'] }
    };
    window.LivingNPC = { NPCS: NPCS, RUMORS: RUMORS };

    //==========================================================================
    //  DIALOGUE — construit une liste de commandes -> setupChild :
    //  vraies boîtes successives, pagination 4 lignes, retour à la ligne
    //  automatique (~44 caractères) => plus aucun débordement à droite.
    //==========================================================================
    var WRAP = 44;
    function vlen(s) { return String(s).replace(/\\[A-Za-z]\[\d+\]/g, '').length; }
    function wrapLines(text, max) {
        max = max || WRAP;
        var words = String(text).split(' '), lines = [], cur = '';
        for (var i = 0; i < words.length; i++) {
            var w = words[i];
            if (!cur) cur = w;
            else if (vlen(cur + ' ' + w) <= max) cur += ' ' + w;
            else { lines.push(cur); cur = w; }
        }
        if (cur) lines.push(cur);
        return lines;
    }
    // Message paginé (nom en 1re ligne de la 1re boîte, puis 4 lignes max/boîte)
    function pushText(list, name, body, indent) {
        var wl = wrapLines(body), i = 0, first = true;
        while (i < wl.length || first) {
            list.push({ code: 101, indent: indent, parameters: ['', 0, 0, 2] });
            var slots = 4;
            if (first) { list.push({ code: 401, indent: indent, parameters: ['\\C[6]' + name + '\\C[0]'] }); slots = 3; first = false; }
            for (var k = 0; k < slots && i < wl.length; k++, i++) {
                list.push({ code: 401, indent: indent, parameters: [wl[i]] });
            }
            if (i >= wl.length) break;
        }
    }
    function buildTopics(list, npc) {
        var keys = Object.keys(npc.topics);
        var labels = keys.map(function (k) { return npc.topics[k].label; });
        labels.push('Au revoir');
        list.push({ code: 118, indent: 0, parameters: ['npcmenu'] });
        list.push({ code: 102, indent: 0, parameters: [labels, labels.length - 1, 0, 2, 0] });
        keys.forEach(function (k, i) {
            list.push({ code: 402, indent: 0, parameters: [i, labels[i]] });
            (npc.topics[k].lines || []).forEach(function (l) { pushText(list, npc.name, l, 1); });
            list.push({ code: 119, indent: 1, parameters: ['npcmenu'] });   // reboucle le menu
        });
        list.push({ code: 402, indent: 0, parameters: [keys.length, 'Au revoir'] });
        list.push({ code: 404, indent: 0, parameters: [] });
    }
    function talk(interp, key) {
        var npc = NPCS[key];
        if (!npc) return;
        var sys = $gameSystem; sys._npcMet = sys._npcMet || {};
        var first = !sys._npcMet[key]; sys._npcMet[key] = true;
        var hello = (first && npc.first) ? npc.first : npc.hello;
        var list = [];
        pushText(list, npc.name, pick(hello), 0);
        if (npc.aware) { var r = currentRumor(); if (r) pushText(list, npc.name, '« ' + r + ' »', 0); }
        if (npc.topics) buildTopics(list, npc);
        else if (npc.lines) pushText(list, npc.name, pick(npc.lines), 0);
        list.push({ code: 0, indent: 0, parameters: [] });
        interp.setupChild(list, interp._eventId);
    }

    //==========================================================================
    //  DÉTECTION DE LA CLÉ SUR L'ÉVÉNEMENT  (<NPC: clé> ou <Bark: clé>)
    //==========================================================================
    Game_Event.prototype.npcKey = function () {
        if (this._npcKeyPage === this._pageIndex) return this._npcKeyCache;
        this._npcKeyPage = this._pageIndex; this._npcKeyCache = null;
        var page = this.page();
        if (page) page.list.forEach(function (c) {
            if (c.code === 108 || c.code === 408) {
                var m = /<(?:NPC|Bark):\s*([A-Za-z0-9_]+)/i.exec(c.parameters[0]);
                if (m) this._npcKeyCache = m[1].toLowerCase();
            }
        }, this);
        return this._npcKeyCache;
    };

    //==========================================================================
    //  BARKS — répliques d'ambiance flottantes
    //==========================================================================
    function Sprite_Bark() { this.initialize.apply(this, arguments); }
    Sprite_Bark.prototype = Object.create(Sprite.prototype);
    Sprite_Bark.prototype.constructor = Sprite_Bark;
    Sprite_Bark.prototype.initialize = function (event, text) {
        Sprite.prototype.initialize.call(this);
        this._event = event; this._life = 130; this._float = 0;
        this.anchor.x = 0.5; this.anchor.y = 1; this.opacity = 0; this.z = 9;
        var b = new Bitmap(460, 38);
        b.fontSize = 18; b.outlineWidth = 5; b.outlineColor = 'rgba(0,0,0,0.95)'; b.textColor = '#f2f2f2';
        b.drawText(text, 0, 0, 460, 38, 'center');
        this.bitmap = b; this.updatePos();
    };
    Sprite_Bark.prototype.updatePos = function () {
        this.x = this._event.screenX();
        this.y = this._event.screenY() - 46 - Math.floor(this._float);
    };
    Sprite_Bark.prototype.update = function () {
        Sprite.prototype.update.call(this);
        this._life--; this._float += 0.35;
        if (this._life > 112) this.opacity += 22;
        else if (this._life < 28) this.opacity -= 11;
        else this.opacity = 255;
        this.updatePos();
        return this._life > 0;
    };

    var _ssUpdate = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function () {
        _ssUpdate.call(this);
        this.updateBarks();
    };
    Spriteset_Map.prototype.updateBarks = function () {
        this._barks = this._barks || [];
        for (var i = this._barks.length - 1; i >= 0; i--) {
            if (!this._barks[i].update()) { this.removeChild(this._barks[i]); this._barks.splice(i, 1); }
        }
        if ($gameMessage.isBusy() || !(SceneManager._scene instanceof Scene_Map)) return;
        this._barkCD = (this._barkCD || 0) - 1;
        if (this._barkCD > 0) return;
        var f = Graphics.frameCount, self = this;
        var cands = $gameMap.events().filter(function (e) {
            if (e._barkMute || (e._nextBark && f < e._nextBark)) return false;
            var k = e.npcKey(); var npc = k && NPCS[k];
            if (!npc || !npc.barks || !npc.barks.length) return false;
            if (Math.abs(e.x - $gamePlayer.x) + Math.abs(e.y - $gamePlayer.y) > 7) return false;
            var sx = e.screenX(), sy = e.screenY();
            return sx > 0 && sx < Graphics.width && sy > 0 && sy < Graphics.height;
        });
        if (!cands.length) { this._barkCD = 30; return; }
        var ev = cands[Math.floor(Math.random() * cands.length)];
        var npc = NPCS[ev.npcKey()];
        var sp = new Sprite_Bark(ev, pick(npc.barks));
        this.addChild(sp); this._barks.push(sp);
        ev._nextBark = f + 360 + Math.floor(Math.random() * 360);
        this._barkCD = 100 + Math.floor(Math.random() * 120);
    };
    Spriteset_Map.prototype.forceBark = function (key) {
        if ($gameMessage.isBusy()) return;
        var ev = $gameMap.events().filter(function (e) { return e.npcKey() === key; })[0];
        var npc = NPCS[key];
        if (!ev || !npc) return;
        var line = npc.barks && npc.barks.length ? pick(npc.barks) : (npc.hello ? pick(npc.hello) : '…');
        var sp = new Sprite_Bark(ev, line); this.addChild(sp); (this._barks = this._barks || []).push(sp);
    };

    //==========================================================================
    //  COMMANDES DE PLUGIN
    //==========================================================================
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'NPC') return;
        var sub = (args[0] || '').toLowerCase();
        var key = (args[1] || '').toLowerCase();
        if (sub === 'talk') talk(this, key);
        else if (sub === 'rumeur') { $gameMessage.add('\\C[6]On murmure…\\C[0]'); wrapLines('« ' + (currentRumor() || '…') + ' »').forEach(function (l) { $gameMessage.add(l); }); }
        else if (sub === 'bark') { var ss = SceneManager._scene && SceneManager._scene._spriteset; if (ss) ss.forceBark(key); }
        else if (sub === 'mute') { var ev = this.character(0); if (ev && ev._barkMute !== undefined || ev) ev._barkMute = true; }
    };
})();
