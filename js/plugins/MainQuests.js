//=============================================================================
// MainQuests.js — v1.0  ·  Quête principale (colonne vertébrale)
// RPG Maker MV   ·   by JOKO   ·   nécessite QuestJournal
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Inscrit la quête principale (6 chapitres) dans le Journal
 * dès la nouvelle partie. Avance par événement : MAINQUEST <n>.
 * @author JOKO
 *
 * @help
 *  La quête principale apparaît automatiquement dans le Journal (suivie sur la
 *  carte). Pour faire progresser l'histoire depuis un événement :
 *      MAINQUEST 2        → termine le chap. 1 et démarre le chap. 2
 *      MAINQUEST step     → accomplit le prochain objectif du chapitre courant
 *  (Voir docs/game-design.md pour la structure narrative complète.)
 */
(function () {
    'use strict';

    var MAIN = [
        { id: 'q_main_1', title: 'I. L\'Invocation',
          desc: 'Un message t\'a tiré du monde réel jusqu\'ici. Comprends où tu es, et pourquoi on t\'a appelé.',
          objs: ['Explorer la cour du château', 'Parler au Roi et à la Reine', 'Écouter Dame Elara, la mage de la cour'] },
        { id: 'q_main_2', title: 'II. Le Dérèglement',
          desc: 'Le Mana se dérègle, les âmes s\'égarent. Enquête sur la source du mal depuis le monde des vivants.',
          objs: ['Rejoindre le Camps de Nomades', 'Allumer ton premier Feu d\'Âme', 'Recueillir les rumeurs du monde'] },
        { id: 'q_main_3', title: 'III. Les Quatre Mondes',
          desc: 'Les quatre Originels règnent sur leurs dimensions. Voyage vers chacune et affronte ce qu\'elles sont devenues.',
          objs: ['Pénétrer une dimension d\'Originel', 'Affronter son gardien', 'Comprendre sa corruption'] },
        { id: 'q_main_4', title: 'IV. Les Clés du Monde',
          desc: 'Une Clé permet de sortir ; un Masque réécrit le monde. Josu les a cachés. Retrouve-les.',
          objs: ['Trouver la trace de la Clé', 'Trouver le Masque du Créateur', 'Percer le secret de Jada'] },
        { id: 'q_main_5', title: 'V. L\'Allégeance',
          desc: 'Le monde se fracture en factions. Choisis ta voie — elle décidera de la fin.',
          objs: ['Connaître les buts de chaque faction', 'Rallier une cause (ou aucune)'] },
        { id: 'q_main_6', title: 'VI. Le Dieu Fou',
          desc: 'Josu, le Créateur, t\'attend au bout du monde. Il n\'y a pas de fin facile à ce qu\'il est devenu.',
          objs: ['Atteindre la dernière dimension', 'Faire face à Josu', 'Écrire la fin de cette histoire'] }
    ];

    function ensureStore() { if (!$gameSystem._quests) { $gameSystem._quests = {}; $gameSystem._questOrder = []; } }
    function addQuest(q) {
        ensureStore();
        if (!$gameSystem._quests[q.id]) $gameSystem._questOrder.push(q.id);
        $gameSystem._quests[q.id] = {
            id: q.id, type: 'main', title: q.title, desc: q.desc,
            objs: q.objs.map(function (t) { return { text: t, done: false }; }), status: 'active'
        };
        $gameSystem._track = q.id;
    }
    function chapter(n) {
        if (!$gameSystem) return;
        for (var i = 0; i < n - 1 && i < MAIN.length; i++) {
            var pq = $gameSystem._quests && $gameSystem._quests[MAIN[i].id];
            if (pq) { pq.status = 'done'; pq.objs.forEach(function (o) { o.done = true; }); }
        }
        if (MAIN[n - 1]) addQuest(MAIN[n - 1]);
    }
    function stepCurrent() {
        var cur = $gameSystem._track && $gameSystem._quests ? $gameSystem._quests[$gameSystem._track] : null;
        if (cur) for (var i = 0; i < cur.objs.length; i++) if (!cur.objs[i].done) { cur.objs[i].done = true; break; }
    }

    // Inscription automatique du chapitre I à la nouvelle partie
    var _setup = DataManager.setupNewGame;
    DataManager.setupNewGame = function () { _setup.call(this); chapter(1); };

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'MAINQUEST') return;
        var a = (args[0] || '').toLowerCase();
        if (a === 'step') stepCurrent();
        else { var n = parseInt(a); if (n >= 1 && n <= MAIN.length) chapter(n); }
    };
})();
