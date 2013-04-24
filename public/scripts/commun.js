$(document).ready(function () {    
    
    //Namespace client
    var SP_LT_CLIENT = SP_LT_CLIENT || {};  
    
    //Chemins
    SP_LT_CLIENT.PATH = {
        
    };
    
    //Rendu client
    SP_LT_CLIENT.SCREEN = (function () {
        var tabImagesHover = ["../images/bg/bg-elt-menu-hover.png"];
        LTTOoLS.oScreenHelper.prechargerImages(tabImagesHover);
    })();
    
});