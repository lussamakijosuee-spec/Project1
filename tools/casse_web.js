// La casse des fichiers, pour la version web seulement — tools/version_web.js copie ce script dans
// js/casse_web.js de la version web, avec la liste de ses fichiers, et le charge en premier dans
// index.html. ⚠️ Ce n'est PAS un plugin : ne pas l'ajouter au gestionnaire de plugins.
//
// Sous Windows, « img/eventindicators/flame_0.png » ouvre Flame_0.png ; sur un serveur web (GitHub
// Pages), non : le jeu plante (« Failed to load »). Un nom écrit dans les données se vérifie à la
// construction, mais un plugin en fabrique aussi (MOG_EventIndicators : « flame » + « _0 »). Ici,
// toute adresse demandée — image, son, vidéo, script, requête — qui n'existe pas telle quelle mais
// existe avec d'autres majuscules prend celle du vrai fichier. Au niveau du navigateur (src,
// XMLHttpRequest) : YEP_X_CoreUpdatesOpt remplace les chargeurs de MV, il ne passe pas à côté.
(function () {
    var LISTE = /*LISTE*/[];
    var exact = {}, min = {};
    LISTE.forEach(function (p) {
        exact[p] = true; min[p.toLowerCase()] = p;
        try { var d = decodeURIComponent(p); exact[d] = true; min[d.toLowerCase()] = d; } catch (e) { }
    });
    function vrai(url) {
        if (typeof url !== 'string' || /^[a-z][a-z0-9+.-]*:/i.test(url)) { return url; }
        var q = url.search(/[?#]/), p = q < 0 ? url : url.slice(0, q), suite = q < 0 ? '' : url.slice(q);
        if (p.indexOf('./') === 0) { p = p.slice(2); }
        if (exact[p]) { return url; }
        var v = min[p.toLowerCase()];
        return v ? v + suite : url;
    }
    window.cheminWeb = vrai;
    [window.HTMLImageElement, window.HTMLMediaElement, window.HTMLScriptElement].forEach(function (C) {
        var d = C && Object.getOwnPropertyDescriptor(C.prototype, 'src');
        if (!d || !d.set) { return; }
        Object.defineProperty(C.prototype, 'src', {
            get: d.get, set: function (v) { d.set.call(this, vrai(v)); }, configurable: true, enumerable: d.enumerable
        });
    });
    if (window.XMLHttpRequest) {
        var ouvrir = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (methode, url) {
            var a = Array.prototype.slice.call(arguments);
            a[1] = vrai(url);
            return ouvrir.apply(this, a);
        };
    }
})();
