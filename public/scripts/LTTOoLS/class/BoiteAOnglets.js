LTTOoLS.BoiteAOnglets = (function () {
    //©2013 Loïc TRUCHOT
    //Extension requise : JQuery 1.9+
    //Outils requis : LT_TOOLS.oErrorHelper
    //Outils requis : LT_TOOLS.oObjectHelper
    
    "use strict";
    //constantes de classe
    BoiteAOnglets.NOM = "LT_TOOLS.BoiteAOnglets";
    BoiteAOnglets.NB_ONGLET_MIN = 2;
    BoiteAOnglets.NB_ONGLET_MAX = 5;
    
    $(function(){
        $("head").append(
            $(document.createElement("link")).attr({rel:"stylesheet", type:"text/css", href:"/scripts/LTTOoLS/class/BoiteAOnglets.css"})
        );
    });

    
    //variables de classe
    BoiteAOnglets.nombre = 0;
    
    function BoiteAOnglets (oOnglets, sEltPere) {
        
        //Références à LT TOOLS
        this.oError = LTTOoLS.oErrorHelper;
        this.oObject = LTTOoLS.oObjectHelper;
        
        
        
        //gestion des erreurs
        this.tabMsgErreur = [];
        this.sNomObjet = BoiteAOnglets.NOM + ' n°' + BoiteAOnglets.nombre;
        
        //elements obligatoires      
        this.oOnglets = this.oError.confirmerTypePropriete(this.tabMsgErreur, oOnglets, "object", "il faut définir entre " + BoiteAOnglets.NB_ONGLET_MIN + " et " + BoiteAOnglets.NB_ONGLET_MAX + " onglets");
        this.sEltPere = this.oError.confirmerTypePropriete(this.tabMsgErreur, sEltPere, "string", "il faut définir un element père", "body");
        
        //donnée DOM
        this.sDivOngletId = "boite_a_onglet" + BoiteAOnglets.nombre;
        
        //construction des onglets        
        this.sBoiteAOnglet = this.creerBoiteAOnglet();
        this.appliquerOnglets();
        
        //rapport d'erreurs
        this.oError.enregistrerErreurs(this.tabMsgErreur, this.sNomObjet);
        
        //action sur les variables de classe
        BoiteAOnglets.nombre++; 
        
    }    
    BoiteAOnglets.prototype = {        
        creerBoiteAOnglet : function () {
            var sBoiteAOnglets = "";
            var iNbOnglets = this.oObject.calculerTaille(this.oOnglets);
            if (iNbOnglets >= BoiteAOnglets.NB_ONGLET_MIN && iNbOnglets <= BoiteAOnglets.NB_ONGLET_MAX) {
                sBoiteAOnglets += '<div id="' + this.sDivOngletId + '" class="boite_a_onglet" style="display:none">'; 
                sBoiteAOnglets += "\t" + '<ul>' + "\n"; 
                for (var sOnlget in this.oOnglets) {
                    var sClass12 = "";
                    if (sOnlget.length > 12) {
                        sClass12 = " onglet_text_12";
                    }
                    sBoiteAOnglets += "\t\t" + '<li class="bao_onglet_bouton' + sClass12 + '">' + sOnlget + '</li>' + "\n"; 
                }
                sBoiteAOnglets += "\t" + '</ul>' + "\n";   
                //sBoiteAOnglets += "\t" + '<div class="bao_onglet_entete"></div>' + "\n"; 
                for (var sOnglet2 in this.oOnglets) {
                    sBoiteAOnglets += "\t" + '<div class="bao_onglet_contenu">' + this.oOnglets[sOnglet2] + '</div>' + "\n"; 
                }
                //sBoiteAOnglets += "\t" + '<div class="bao_onglet_pied"></div>' + "\n"; 
                sBoiteAOnglets += '</div>'; 
            }
            return sBoiteAOnglets;
        },
        appliquerOnglets : function () {
            $(this.sEltPere).append(this.sBoiteAOnglet);
            $("#" + this.sDivOngletId + " > ul > li.bao_onglet_bouton").each(function () {
                $(this).click(function () {                
                    $(".selection_onglet").removeClass("selection_onglet");
                    $(this).addClass("selection_onglet");
                    $(".bao_onglet_contenu").hide();
                    $(".bao_onglet_contenu").eq($(this).index()).show();
                });
            });
            //$("#" + this.sDivOngletId).children(".bao_onglet_bouton").trigger("click");
            $("#" + this.sDivOngletId + " > ul > li.bao_onglet_bouton").eq(0).trigger("click");
            $("#" + this.sDivOngletId).show();
        }
    }; 
    return BoiteAOnglets;
} ()); 