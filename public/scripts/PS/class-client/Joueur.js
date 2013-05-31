PS.Joueur = (function () {
    //©2013 Loïc TRUCHOT
    //NameSpace requis : LTTOoLS
        //Objets Requis : oDebugHelper, oErrorHelper
    //NameSpace requis : PS
        //Objets Requis :
    
    "use strict";
    
    //constantes de classe
    Joueur.NB_MAX = 4;
    
    //variables de classe
    Joueur.nombre = 0;
    
    function Joueur (sPays) {
        
        //Références à PS
        this.oError = LTTOoLS.oErrorHelper;
        this.oDebug = LTTOoLS.oDebugHelper;
        
        //gestion des erreurs
        this.tabMsgErreur = [];
        
        //elements obligatoires
        this.sPays = this.oError.confirmerTypePropriete(this.tabMsgErreur, sPays, "string", "un pays doit être choisi");
              
        //elements subsidiaires
        //this.tabEchelons = tabEchelons || [];        
                
        //construction du joueur
        this.oJoueur = this.creerJoueur();
        this.nodeGraphiqueSvg = this.oSvg.parser(this.sGraphiqueSvg);
        
        //rapport d'erreurs
        this.oError.enregistrerErreurs(this.tabMsgErreur, this.sNomObjet);
        
        //action sur les variables de classe
        Joueur.nombre++; 
        
    }    
    Joueur.prototype = {        
        creerJoueur: function () {
            var oJoueur = {};           
            return oJoueur;
        }       
    }; 
    return Joueur;
} ());