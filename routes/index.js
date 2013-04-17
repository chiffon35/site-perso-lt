/*
 * GET /fr/accueil
 * GET /en/home
 */
exports.index = function(req, res){  
    res.render('index', {langue : req.locale});
};