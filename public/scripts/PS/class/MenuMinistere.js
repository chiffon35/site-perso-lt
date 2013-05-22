PS.MenuMinistere = (function () {
    //©2013 Loïc TRUCHOT
    
    function MenuMinistere (oSio) {
        
        var self = this;
        
        //Références à LT TOOLS
        this.oString = LTTOoLS.oStringHelper;
        this.oNumber = LTTOoLS.oNumberHelper
        this.bMinistereCree = false;
        
        this.oSio = oSio;
            
    
        //action sur les variables de classe
        MenuMinistere.nombre++; 
        
        //Reception
        this.oSio.oSocket.on('ES_Creer_Ministeres', function (oMinisteres) {
            self.creerMinisteres(oMinisteres);           
        });
        this.oSio.oSocket.on('ES_Rafraichir_Ministeres', function (oMinisteres) {
            if (self.bMinistereCree) {
                self.rafraichirMinisteres(oMinisteres); 
            }
        }); 
        this.oSio.oSocket.on('ES_Supprimer_Ministeres', function () {
            self.supprimerMinisteres();           
        }); 

        
        
    }    
    MenuMinistere.prototype = {   
        
        obtenirMinisterePopulation : function (oMinisteres) {
            return [
                {
                    sId : "MP-population-totale",
                    sTitre : "Population totale : ",
                    sContenu : this.oNumber.afficherMilliers((oMinisteres.oPopulation.iTotalEnK * 1000)) + ' habs'
                },
                {
                    sId : "MP-taux-natalite",
                    sTitre : "Taux de natalité annuel : ",
                    sContenu : oMinisteres.oPopulation.fTauxNatalite + ' / 1000 habs'
                }
            ];
        },
        creerMinisteres : function (oMinisteres) {
            var sMenuMinistere = '';
            var sNomMinistere = 'Population, Familles et Diversité';
            var oMinisterePopulation = this.obtenirMinisterePopulation(oMinisteres);
            var sHtmlMinisterePopulation = this.creerHtmlMinistere(oMinisterePopulation, sNomMinistere);
            sMenuMinistere += '<div class="btn300" id="btnMinisterePopulation">' + sNomMinistere + '</div>';     
            sMenuMinistere += sHtmlMinisterePopulation;
            $("#menu-gauche").html(sMenuMinistere);
            $("#btnMinisterePopulation").click(function () {
                $("#ecranMinisterePopulation").show();
            });
            $("#fermerMinisterePopulation").click(function () {
                $("#ecranMinisterePopulation").hide();
            });
            this.bMinistereCree = true;
        },
        creerHtmlMinistere : function (oMinistere, sNomMinistere) {
            var sMinistereCourant = '';
            sMinistereCourant += '<div id="ecranMinisterePopulation" class="ecranMinistere invisible">' + "\n";
            sMinistereCourant += "\t" + '<div class="titreMinistere">' + sNomMinistere + '</div>' + "\n";
            sMinistereCourant += "\t" + '<div id="fermerMinisterePopulation" class="fermerMinistere">X</div>' + "\n";
            sMinistereCourant += "\t" + '<div class="contenuMinistere">' + "\n";
            for (var iDonnees in oMinistere) {
                sMinistereCourant += "\t\t" + oMinistere[iDonnees].sTitre + '<span id="' + oMinistere[iDonnees].sId + '">' + oMinistere[iDonnees].sContenu +'</span><br />' + "\n";
            }
            sMinistereCourant += "\t" + '</div>' + "\n";
            sMinistereCourant += '</div>' + "\n";
            return sMinistereCourant;            
        },
        rafraichirMinisteres : function (oMinisteres) {
            var oMinistere = this.obtenirMinisterePopulation(oMinisteres);
            for (var iDonnees in oMinistere) {
                $("#"+ oMinistere[iDonnees].sId).text(oMinistere[iDonnees].sContenu);
            }
        },
        supprimerMinisteres : function () {
            $("#menu-gauche").empty();
        }
        
    }; 
    return MenuMinistere;
} ()); 