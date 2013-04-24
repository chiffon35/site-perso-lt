/*
 * GET /fr/accueil
 * GET /en/home
 */
exports.index = function(req, res){  
    res.render('index', {langue_courante : req.locale});
};

exports.blog = function(req, res){
    res.render('blog', {langue_courante : req.locale})
};