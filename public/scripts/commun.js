// var tabImagesHover = ["http://site-perso-lt.chiffon35.c9.io/images/bg/bg-recherche-right-hover.png"
//     , "../images/bg/bg-recherche-right-hover.png"];

// for (var i = 0; i < tabImagesHover.length; i++) {
//     var image = new Image();
//     image.src = tabImagesHover[i];
// }    

//Namespace client
var SP_LT_CLIENT = SP_LT_CLIENT || {};  

//Chemins
SP_LT_CLIENT.PATH = {
    
};

//Rendu client
//SP_LT_CLIENT.SCREEN = (function () {
   
//})();
    
$(document).ready(function () {      
    preload([
        '../images/bg/bg-recherche-right-hover.png'
    ]);
});

function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
        // Alternatively you could use:
        // (new Image()).src = this;
    });
}

// Usage:

