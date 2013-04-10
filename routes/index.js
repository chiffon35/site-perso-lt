
/*
 * GET home page.
 */
function PremiereLettreMaj(chaine){
    return chaine.substr(0,1).toUpperCase()+	chaine.substr(1,chaine.length);		
}
var langue = "fr";
var voc = {
    parcours_et_actualites_d_un_developpeur_web : {
        fr : "parcours et actualités d'un développeur web",
        en : "professional path and agenda of a web developer"
    },
    accueil : {
        fr : "accueil",
        en : "home"
    },
    cv : {
        fr : "CV",
        en : "CV"
    },
    blog : {
        fr : "blog",
        en : "blog"
    },
    lttools : {
        fr : "LTTOoLS",
        en : "LTTOoLS"
    }
};

var oEntites = {
    title : voc.parcours_et_actualites_d_un_developpeur_web.fr,
    accueil: voc.accueil.fr,
    cv: voc.cv.fr,
    blog: voc.cv.fr,
    lttools: voc.lttools.fr
};
for (var sCle in oEntites) {
    oEntites[sCle] = PremiereLettreMaj(oEntites[sCle]);
}


exports.index = function(req, res){
  res.render('index', oEntites);
};