/*
 * reglages_yep.js — lire les réglages par défaut d'un plugin dans son en-tête
 * ---------------------------------------------------------------------------
 * Pourquoi ça existe : une entrée de `js/plugins.js` avec `"parameters":{}` ne
 * donne PAS ses valeurs par défaut au plugin. MOG écrit
 *
 *     Moghunter.x = Number(Moghunter.parameters['X'] || 633);
 *
 * — il a un repli. Yanfly, lui, écrit
 *
 *     Yanfly.Param.X = String(Yanfly.Parameters['X']);
 *
 * — sans repli. Un paramètre absent devient la **chaîne « undefined »**, et le
 * plugin s'exécute avec, sans se plaindre. D'où cet extracteur : il relit le
 * bloc d'aide du fichier et reconstruit l'objet que l'éditeur MV aurait écrit.
 *
 * Utilisé par `bancs/outils/` et par la passe de branchement des YEP.
 */

'use strict';
var fs = require('fs');

/**
 * Lit les couples @param / @default de l'en-tête d'un plugin.
 * @param {string} chemin  le .js du plugin
 * @return {Object} { nomDuParametre: valeurParDefaut }
 */
function reglagesParDefaut(chemin) {
    var texte = fs.readFileSync(chemin, 'utf8');
    // On ne lit que le commentaire d'en-tête : au-delà, @param n'est plus une
    // déclaration mais du texte d'aide ou du code.
    var fin = texte.indexOf('*/');
    var entete = fin > 0 ? texte.slice(0, fin) : texte;

    var out = {};
    var courant = null;
    var enDefaut = false;
    entete.split('\n').forEach(function (ligne) {
        // « * @param Nom Du Paramètre » — l'étoile et l'indentation sautent
        var l = ligne.replace(/^\s*\*ic?\s?/, '').replace(/^\s*\*\s?/, '');
        var m = l.match(/^\s*@param\s+(.*)$/);
        if (m) { courant = m[1].trim(); if (!(courant in out)) { out[courant] = ''; } enDefaut = false; return; }
        var d = l.match(/^\s*@default\s?(.*)$/);
        if (d) { if (courant !== null) { out[courant] = d[1]; enDefaut = true; } return; }
        if (/^\s*@/.test(l)) { enDefaut = false; return; }   // @desc, @type, @option…
        // Une valeur par défaut peut tenir sur plusieurs lignes — mais une ligne
        // VIDE la termine. Sans ça, le « * » nu qui suit « @default Ship3 » ajoute
        // un saut de ligne à la valeur, MV demande « audio/bgm/Ship3\n.ogg », et
        // le fichier n'existe pas. C'est un 404 muet : le son ne sort jamais.
        if (enDefaut && courant !== null) {
            if (l.trim() === '') { enDefaut = false; return; }
            out[courant] += '\n' + l;
        }
    });
    // MV n'écrit jamais d'espace ni de saut de ligne en fin de valeur.
    Object.keys(out).forEach(function (k) { out[k] = String(out[k]).replace(/\s+$/, ''); });
    return out;
}

/**
 * Les plugins dont celui-ci a VRAIMENT besoin.
 *
 * On ne lit que la parenthèse « (Requires X.js) » du `@plugindesc` : c'est la
 * seule déclaration d'exigence de Yanfly. Balayer tout l'en-tête à la recherche
 * de `YEP_*.js` ramasse aussi les plugins simplement cités comme compatibles —
 * `YEP_MoveRouteCore` mentionne `YEP_SelfSwVar` sans en dépendre.
 */
function dependances(chemin) {
    var texte = fs.readFileSync(chemin, 'utf8');
    var desc = (texte.match(/@plugindesc\s+([^\n]*(?:\n\s*\*\s*[^@\n][^\n]*)*)/) || ['', ''])[1];
    var req = (desc.match(/\(Requires?\s+([^)]+)\)/i) || ['', ''])[1];
    var noms = {}, m, re = /\b(YEP_[A-Za-z0-9_]+)\.js/g;
    while ((m = re.exec(req))) { noms[m[1]] = 1; }
    delete noms[require('path').basename(chemin, '.js')];
    return Object.keys(noms);
}

module.exports = { reglagesParDefaut: reglagesParDefaut, dependances: dependances };
