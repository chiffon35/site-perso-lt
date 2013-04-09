
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: "Loic TRUCHOT : Parcours et actualit&eacute;s d'un d&eacute;veloppeur web" });
};