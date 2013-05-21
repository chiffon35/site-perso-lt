PS.MenuMinistere = (function () {
    //©2013 Loïc TRUCHOT
    
    function MenuMinistere (oSio) {
        
        var self = this;
        
        //Références à LT TOOLS
        this.oString = LTTOoLS.oStringHelper;
        
        this.oSio = oSio;
            
    
        //action sur les variables de classe
        MenuMinistere.nombre++; 
        
        //Reception
        this.oSio.oSocket.on('ES_Afficher_Menu_Ministere', function () {
            self.afficherMenuMinistere();           
        }); 
        this.oSio.oSocket.on('ES_Supprimer_Menu_Ministere', function () {
            self.supprimerMenuMinistere();           
        }); 
        
        
    }    
    MenuMinistere.prototype = {        
        creerHtmlMenuMinistere : function () {
            var sMenuMinistere = '';
            sMenuMinistere += '<div class="btn300">Population, Familles et Diversité</div>';            
            return sMenuMinistere;
        },
        afficherMenuMinistere : function () {
            $("#menu-gauche").html(this.creerHtmlMenuMinistere);
        },
        supprimerMenuMinistere : function () {
            $("#menu-gauche").empty();
        }
        
    }; 
    return MenuMinistere;
} ()); 