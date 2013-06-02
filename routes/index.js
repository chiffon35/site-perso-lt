/*
 * GET /fr/accueil
 * GET /en/home
 */
var SPLT_SERVEUR = SPLT_SERVEUR || {};
SPLT_SERVEUR.setVarJade = function (req) {
    var jade = {};
    jade.langue_courante = req.locale;
    jade.chemin_courant = req.url;
    return jade;
};
exports.index = function(req, res){  
    res.render('index', SPLT_SERVEUR.setVarJade(req));
};

exports.blog = function(req, res){
    res.render('blog', SPLT_SERVEUR.setVarJade(req));
};

exports.cv = function(req, res){
    res.render('cv', SPLT_SERVEUR.setVarJade(req));
};

