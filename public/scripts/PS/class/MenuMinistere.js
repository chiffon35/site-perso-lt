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
        this.oSio.oSocket.on('ES_Creer_Ministeres', function (oMonPays) {
            self.creerMinisteres(oMonPays);           
        }); 
        this.oSio.oSocket.on('ES_Supprimer_Ministeres', function () {
            self.supprimerMinisteres();           
        }); 

        
        
    }    
    MenuMinistere.prototype = {        
        creerMinisteres : function (oMonPays) {
            var sMenuMinistere = '';
            var sNomMinistere = 'Population, Familles et Diversité';
            var sHtmlMinisterePopulation = this.creerHtmlMinistere(oMonPays, sNomMinistere);
            sMenuMinistere += '<div class="btn300" id="btnMinisterePopulation">' + sNomMinistere + '</div>';     
            sMenuMinistere += sHtmlMinisterePopulation;
            $("#menu-gauche").html(sMenuMinistere);
            $("#btnMinisterePopulation").click(function () {
                $("#ecranMinisterePopulation").show();
            });
            $("#fermerMinisterePopulation").click(function () {
                $("#ecranMinisterePopulation").hide();
            });
        },
        creerHtmlMinistere : function (oMonPays, sNomMinistere) {
            var sMinistereCourant = '';
            sMinistereCourant += '<div id="ecranMinisterePopulation" class="ecranMinistere invisible">' + "\n";
            sMinistereCourant += "\t" + '<div class="titreMinistere">' + sNomMinistere + '</div>' + "\n";
            sMinistereCourant += "\t" + '<div id="fermerMinisterePopulation" class="fermerMinistere">X</div>' + "\n";
            sMinistereCourant += "\t" + '<div class="contenuMinistere">' + "\n";
            sMinistereCourant += "\t\t" + oMonPays.sNomAvecDetMin + "\n";
            sMinistereCourant += "\t" + '</div>' + "\n";
            sMinistereCourant += '</div>' + "\n";
            return sMinistereCourant;
            
        },
        supprimerMinisteres : function () {
            $("#menu-gauche").empty();
        }
        
    }; 
    return MenuMinistere;
} ()); 