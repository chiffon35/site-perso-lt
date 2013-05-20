PS.MenuMinistere = (function () {
    //©2013 Loïc TRUCHOT
    //Outils requis : LT_TOOLS.oSvgHelper
    //Outils requis : LT_TOOLS.oMathHelper
    //Outils requis : LT_TOOLS.oStringHelper
    //Outils requis : LT_TOOLS.oErrorHelper
    
    "use strict";
    //constantes de classe
    MenuMinistere.NB_AXES_MIN = 3;
    
    //variables de classe
    MenuMinistere.nombre = 0;
    
    function MenuMinistere () {
        
        //Références à LT TOOLS
        this.oString = LTTOoLS.oStringHelper;
        this.oError = LTTOoLS.oErrorHelper;
        
        //gestion des erreurs
        this.tabMsgErreur = [];
        
        //elements obligatoires
        //this.iTailleCadreSvg = this.oError.confirmerTypePropriete(this.tabMsgErreur, iTailleCadreSvg, "number", "la taille du graphique doit être saisie");
               
        //elements subsidiaires
        //this.tabEchelons = tabEchelons || [];            
        
    
        
        //construction du menu
        this.sMenuMinistere = this.creerMenuMinistere();
        
        //rapport d'erreurs
        this.oError.enregistrerErreurs(this.tabMsgErreur, this.sNomObjet);
        
        //action sur les variables de classe
        MenuMinistere.nombre++; 
        
    }    
    MenuMinistere.prototype = {        
        creerMenuMinistere : function () {
            var sMenuMinistere = "";
            
            return MenuMinistere;
        }      
    }; 
    return MenuMinistere;
} ()); 