
/*
 * GET home page.
 */
function PremiereLettreMaj(chaine){
    return chaine.substr(0,1).toUpperCase() + chaine.substr(1,chaine.length);		
}
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

exports.index = function(req, res){    
    var langue = "fr";
    // if (req.query.lang === 'en') {
    //     langue = req.query.lang;
    // }
    // else {
    //     langue = "fr";
    // }
    
    var oEntites = {
        titre : voc.loic_truchot[langue],
        sousTitre : voc.parcours_et_actualites_d_un_developpeur_web[langue],
        accueil: voc.accueil[langue],
        cv: voc.cv[langue],
        blog: voc.blog[langue],
        lttools: voc.lttools[langue]
    };
    for (var sCle in oEntites) {
        oEntites[sCle] = PremiereLettreMaj(oEntites[sCle]);
    }
    
    res.render('index', oEntites);
};