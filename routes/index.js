
/*
 * GET home page.
 */
function PremiereLettreMaj(chaine){
    return chaine.substr(0,1).toUpperCase() + chaine.substr(1,chaine.length);		
}
var langue = "fr";
var voc = {
    loic_truchot : {
        fr: "Lo&iuml;c TRUCHOT",
        en: "Lo&iuml;c TRUCHOT"
    },
    parcours_et_actualites_d_un_developpeur_web : {
        fr : "parcours et actualit&eacute;s d'un d&eacute;veloppeur web",
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
    title : voc.loic_truchot[langue] + " : " + voc.parcours_et_actualites_d_un_developpeur_web[langue],
    accueil: voc.accueil[langue],
    cv: voc.cv[langue],
    blog: voc.blog[langue],
    lttools: voc.lttools[langue],
    requete: "" 
};
for (var sCle in oEntites) {
    oEntites[sCle] = PremiereLettreMaj(oEntites[sCle]);
}


exports.index = function(req, res){
    if (req.query["lang"]) {
        oEntite["requete"] = req.query["lang"];
    }
    res.render('index', oEntites);
};