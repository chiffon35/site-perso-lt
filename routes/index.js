/*
 * GET /fr/accueil
 * GET /en/home
 */
function PremiereLettreMaj(chaine){
    return chaine.substr(0,1).toUpperCase() + chaine.substr(1,chaine.length);		
}

exports.index = function(req, res){  
    res.render('index', {});
};