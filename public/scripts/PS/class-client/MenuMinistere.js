PS.MenuMinistere = (function () {
    //©2013 Loïc TRUCHOT
    
    function MenuMinistere (oSio) {
        
        var self = this;
        
        //Références à LT TOOLS
        this.oString = LTTOoLS.oStringHelper;
        this.oNumber = LTTOoLS.oNumberHelper
        this.bMinisteresCrees = false;
        
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
            var oResume = oMinisteres.oPopulation.oResume;
            var oNatalite = oMinisteres.oPopulation.oNatalite;
            var oPopulation = {
                "total" : {
                    sId : "MP-population-totale",
                    sTitre : "Population totale : ",
                    sContenu : this.oNumber.afficherMilliers((oResume.iTotalEnK * 1000)) + ' habs'
                },
                "natalite" : {
                    sId : "MP-taux-natalite",
                    sTitre : "Taux de natalité annuel : ",
                    sContenu : oResume.fTauxNatalite + ' / 1000 habs',
                    tabValeurs : [
                        {
                            sLabel : "Indice de fécondité : ",
                            sId : "MP_indice_de_fecondite",
                            sValeur : oResume.fIndiceFecondite,
                            sComplementLabel : " enfants par femmes entre 15 et 49 ans"
                        },
                        {
                            sLabel : "Mortalité infantile : ",
                            sId : "MP_mortalite_infantile",
                            sValeur: oNatalite.fTauxMortaliteInfantile,
                            sComplementLabel : " décès pour 1000 naissances"
                        }
                    ],
                    tabAstuces : [
                        "Un repartition équitable homme/femme et un age médian bas des femmes augmenteront la natalité",
                        "Les groupes d'intérêts médiatique et réligieux pourront vous aider à faire passer certaines idées pro ou anti natalistes",
                        "L'immigration récente en provenance de pays au taux de natalité élevé peut faire grimper votre taux de natalité",
                        "Autoriser le travail et la formation des femmes sans soutenir la parentalité peut faire chuter votre taux de natalité",
                        "Améliorer votre système de santé et vos objectifs de recherche peut faire baisser la mortalité infantile",
                        "Un encadrement cohérent de la natalité fera augmenter le bonheur de votre population"
                    ],
                    sOpinionNatalite : oNatalite.iOpinionNatalite,
                    oCommandes : PS.creerCommandesNatalite(oNatalite)
                },
                "mortalite" : {
                    sId : "E_MP_taux_mortalite",
                    sTitre : "Taux de mortalité annuel : ",
                    sContenu : oResume.fTauxMortalite + ' / 1000 habs'
                }
            };
            return oPopulation;
        },
        creerMinisteres : function (oMinisteres) {
            var sMenuMinistere = '';
            
            //---------------- DEBUT POPULATION ---------------
            var sNomMinistere = 'Population, Familles et Diversité';
            var sIdBtnMinistere = 'btnMinisterePopulation';
            var oMinisterePopulation = this.obtenirMinisterePopulation(oMinisteres);
            sMenuMinistere += this.creerHtmlBoutonMinistere(sIdBtnMinistere, sNomMinistere)
            sMenuMinistere += this.creerHtmlFenetreMinistere(oMinisterePopulation, sNomMinistere);
            $("#menu-gauche").html(sMenuMinistere);
            $("#"+ sIdBtnMinistere).click(function () {
                $("#ecranMinisterePopulation").show();
            });
            $("#fermerMinisterePopulation").click(function () {
                $("#ecranMinisterePopulation").hide();
            });
            var sHtmlBoiteAOnglets = new LTTOoLS.BoiteAOnglets(
                {
                    "Résumé" : this.creerMinistereResume(oMinisterePopulation),
                    "Natalité" : this.creerMinistereCommandes(oMinisterePopulation["natalite"])
                }, 
                ".contenuMinistere");
            //---------------- FIN POPULATION ---------------
            
            
            this.bMinistereCree = true;           
            
        },
        creerHtmlBoutonMinistere : function (sIdBtnMinistere, sNomMinistere) {
            var sBoutonCourant = '';
            sBoutonCourant += '<div class="btn300" id="' + sIdBtnMinistere + '">' + sNomMinistere + '</div>' + "\n";
            return sBoutonCourant;            
        },
        creerHtmlFenetreMinistere : function (oMinistere, sNomMinistere) {
            var sMinistereCourant = '';
            sMinistereCourant += '<div id="ecranMinisterePopulation" class="ecranMinistere invisible">' + "\n";
            sMinistereCourant += "\t" + '<div class="titreMinistere">' + sNomMinistere + '</div>' + "\n";
            sMinistereCourant += "\t" + '<div id="fermerMinisterePopulation" class="fermerMinistere">X</div>' + "\n";
            sMinistereCourant += "\t" + '<div class="contenuMinistere">' + "\n";
            sMinistereCourant += "\t" + '</div>' + "\n";
            sMinistereCourant += '</div>' + "\n";
            return sMinistereCourant;            
        },
        creerMinistereCommandes : function (oSousMinistere) {
            var self = this;
            var sCommandesMinistere = "";
            var oCommandes = oSousMinistere.oCommandes;
            
            //Resume natalité
            sCommandesMinistere += "\t\t" + "<strong>" + oSousMinistere.sTitre + '</strong><span class="' + oSousMinistere.sId + '">' + oSousMinistere.sContenu +'</span><br /><br />' + "\n";
            for (var iIdValeur in oSousMinistere.tabValeurs) {
                 sCommandesMinistere += "\t\t" + "<strong>" + oSousMinistere.tabValeurs[iIdValeur].sLabel + '</strong><span class="' + oSousMinistere.tabValeurs[iIdValeur].sId + '">' + oSousMinistere.tabValeurs[iIdValeur].sValeur +'</span>' + oSousMinistere.tabValeurs[iIdValeur].sComplementLabel + '<br /><br />' + "\n";
            }
                        
            //Opinion natalité
            var sOpinionNatalite = "";
            switch (oSousMinistere.sOpinionNatalite) {
                case 0 :
                    sOpinionNatalite = "La pluspart des hommes et femmes de votre nation ne souhaitent pas faire d'enfant";
                break;
                case 1 :
                    sOpinionNatalite = "Les hommes et femmes de votre nation pense qu'il est difficle d'avoir plus d'1 enfant";
                break;
                case 2 :
                    sOpinionNatalite = "La plupart des hommes et femmes de votre nation aimeraient avoir 2 enfants.";
                break;
                case 3 : 
                    sOpinionNatalite =  "Les hommes et femmes de votre nation projetent généralement d'avoir entre 2 à 3 enfants.";
                break;
                case 4 : 
                    sOpinionNatalite =  "Les hommes et femmes espèrent avoir de nombreux enfants, 3 à 4 en moyenne.";
                break;
                case 5 : 
                    sOpinionNatalite =  "Les hommes et femmes auront autant d'enfants qu'ils le pourront : au moins 4 si possible.";
                break;
            }
            sCommandesMinistere += "\t\t" + "<strong>Opinion populaire : </strong>" + '<span class="' + "" + '">' + sOpinionNatalite +'</span><br /><br />' + "\n";
            
            for (var iCommande in oCommandes) {
                sCommandesMinistere += '<div class="commande">' + "\n";
                sCommandesMinistere += "<strong>" + oCommandes[iCommande].sNomCommande + "</strong><br />" + "\n";
                switch (oCommandes[iCommande].sType) {
                    case "radio":
                        var tabRadios = oCommandes[iCommande].tabRadios;
                        for (var iIdRad in tabRadios) {
                            var sRadChecked = "";                            
                            if (oCommandes[iCommande].iValeurChecked === tabRadios[iIdRad].iValeur) {
                                sRadChecked = "checked ";                                
                            }
                            sCommandesMinistere += "\t\t" + '<input type="radio" name="' + oCommandes[iCommande].sIdCommande + '" ' + sRadChecked + '" value="' + tabRadios[iIdRad].iValeur +'" /> ' + tabRadios[iIdRad].sLabel + '<br />' + "\n";
                        }
                    break;
                    case "checkbox" :
                        var tabCheckboxes = oCommandes[iCommande].tabCheckboxes;
                        for (var iIdCb in tabCheckboxes) {
                            var sCbChecked = "";
                            if (tabCheckboxes[iIdCb].sChecked) {
                                sCbChecked = "checked ";
                            }
                            sCommandesMinistere += "\t\t" + '<input type="checkbox" name="' + oCommandes[iCommande].sIdCommande + '" ' + sCbChecked + '"value="' + tabCheckboxes[iIdCb].sValeur +'" /> ' + tabCheckboxes[iIdCb].sLabel + '<br />' + "\n";
                        }
                    break;
                    default: 
                        //Liste d'instructions;
                    break;
                } 
                sCommandesMinistere += "</div>" + "\n";
                
            }  
            $(".contenuMinistere").delegate("input:radio", "change", function(event) {
                var sRadioName = $(this).attr("name");
                self.oSio.oSocket.emit("E_modifier_MP_Natalite", { 
                    sName : sRadioName,
                    iValeur : $("input[name=" + sRadioName + "]:checked").val()                 
                });
                console.log("input:radio-->change");
                console.log("iValeur : " + $("input[name=" + sRadioName + "]:checked").val());
                
            });
            if (oSousMinistere.tabAstuces.length > 0) {
                sCommandesMinistere += '<div class="astuces">' + "\n";
                sCommandesMinistere += "<strong>Astuces : </strong><br />";
                sCommandesMinistere += "<ul>";
                var tabAstuces = oSousMinistere.tabAstuces;
                for (var iIdAstuce in tabAstuces) {
                    sCommandesMinistere += "<li>" + tabAstuces[iIdAstuce] + "</li>";
                }
                sCommandesMinistere += "</ul>";
                sCommandesMinistere += "</div>" + "\n";
            }
       
            return sCommandesMinistere;
        },
        creerMinistereResume : function (oMinistere) {
            var sContenuMinistere = "";
            for (var sDonnees in oMinistere) {
                sContenuMinistere += "\t\t" + "<strong>" +  oMinistere[sDonnees].sTitre + '</strong><span class="' + oMinistere[sDonnees].sId + '">' + oMinistere[sDonnees].sContenu +'</span><br /><br />' + "\n";
            }
            return sContenuMinistere;
        },
        rafraichirMinisteres : function (oMinisteres) {
            var oMinistere = this.obtenirMinisterePopulation(oMinisteres);
            for (var iDonnees in oMinistere) {
                $("."+ oMinistere[iDonnees].sId).text(oMinistere[iDonnees].sContenu);
                for (var iValeur in oMinistere[iDonnees].tabValeurs) {
                    $("."+ oMinistere[iDonnees].tabValeurs[iValeur].sId).text(oMinistere[iDonnees].tabValeurs[iValeur].sValeur);
                }
            }
        },
        supprimerMinisteres : function () {
            $("#menu-gauche").empty();
        }
        
    }; 
    return MenuMinistere;
} ()); 