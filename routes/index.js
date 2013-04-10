
/*
 * GET home page.
 */
var langue = "fr";
var voc = {
    et : {
        fr : "et",
        en : "and",
    },
    parcours : {
        fr : "Parcours",
        en: "Parcours"
    },
    actualite : {
        fr : "actualit&eacute;s",
        en: "actualit&eacute;s"
    }
};

exports.index = function(req, res){
  res.render('index', { title: "Loic TRUCHOT : " + voc.parcours.fr + " " + voc.et.fr + " " + voc.actualite.fr + " d'un d&eacute;veloppeur web" });
};