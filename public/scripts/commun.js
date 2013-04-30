//Namespace client
var SPLT_CLIENT = SPLT_CLIENT || {};  

//Chemins
SPLT_CLIENT.PATH = {
    cheminCourant : window.location.pathname   
};

//Rendu client
//SP_LT_CLIENT.SCREEN = (function () {
   
//})();
    
$(document).ready(function () {      
    
    //Boutons de menu pressé ou non
    $("nav.menu a").each(function () {
        if ($(this).attr("href") === SPLT_CLIENT.PATH.cheminCourant) {
            $(this).addClass("elt-menu-pressed");
        }
    });
});