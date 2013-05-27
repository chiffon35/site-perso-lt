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
                            sValeur : 2,
                            sComplementLabel : " enfants par femmes entre 15 et 49 ans"
                        },
                        {
                            sLabel : "Mortalité infantile : ",
                            sValeur: oNatalite.fTauxMortaliteInfantile,
                            sComplementLabel : " décès pour 1000 naissances"
                        }
                    ],
                    tabAstuces : [
                        "Les groupes d'intérêts médiatique et réligieux pourront vous aider à faire passer certaines idées pro ou anti natalistes",
                        "L'immigration récente en provenance de pays au taux de natalité élevé peut faire grimper votre taux de natalité",
                        "Autoriser le travail et la formation des femmes sans soutenir la parentalité peut faire chuter votre taux de natalité",
                        "Améliorer votre système de santé et vos objectifs de recherche peut faire baisser la mortalité infantile",
                        "Un encadrement cohérent de la natalité fera augmenter le bonheur de votre population"
                    ],
                    sOpinionNatalite : oNatalite.iOpinionNatalite,
                    oCommandes : [ 
                        {
                            sNomCommande : "Prestations familiales :",
                            sIdCommande : "MP-prestations-familiales",
                            sType : "radio",
                            iValeurChecked : oNatalite.iPrestationFamiliale,
                            tabRadios : [
                                { 
                                    sLabel : "Aucune",
                                    iValeur: 0
                                },
                                { 
                                    sLabel : "Politique de l'enfant unique",
                                    iValeur: 1
                                },
                                { 
                                    sLabel : "Allocations Familiales",
                                    iValeur: 2
                                }
                            ]
                        },
                        {
                            sNomCommande : "Contraception : ",
                            sIdCommande : "MP-contraception",
                            sType : "radio",
                            iValeurChecked : oNatalite.iContraception,
                            tabRadios : [
                                {
                                    sLabel : "Illégale",
                                    iValeur: 0
                                },
                                {
                                    sLabel : "Autorisée",
                                    iValeur: 1
                                },
                                {
                                    sLabel : "Autorisée et gratuite",
                                    iValeur: 2
                                }
                            ]
                        },
                        {
                            sNomCommande : "Avortement : ",
                            sIdCommande : "MP-avortement",
                            sType : "radio",
                            iValeurChecked : oNatalite.iAvortement,
                            tabRadios : [
                                {
                                    sLabel : "Illégal",
                                    iValeur: 0
                                },
                                {
                                    sLabel : "Autorisé",
                                    iValeur: 1
                                },
                                {
                                    sLabel : "Autorisé et gratuit",
                                    iValeur: 2
                                }
                            ]
                        },
                        {
                            sNomCommande : "Salaire parental : ",
                            sIdCommande : "MP-salaire-parental",
                            sType : "radio",
                            iValeurChecked : oNatalite.iSalaireParental,
                            tabRadios : [
                                {
                                    sLabel : "Oui",
                                    iValeur: 0
                                },
                                {
                                    sLabel : "Non",
                                    iValeur: 1
                                }
                            ]
                        },
                        {
                            sNomCommande : "Places en crèches : ",
                            sIdCommande : "MP-places-en-creches",
                            sType : "radio",
                            iValeurChecked : oNatalite.iPlacesEnCreches,
                            tabRadios : [
                                {
                                    sLabel : "Privées",
                                    iValeur: 0
                                },
                                {
                                    sLabel : "Remboursées pour les bas salaires",
                                    iValeur: 1
                                },
                                {
                                    sLabel : "Remboursées pour tous",
                                    iValeur: 2
                                }
                            ]
                        },
                        {
                            sNomCommande : "Programmes scolaires : ",
                            sIdCommande : "MP-programmes-scolaires",
                            sType : "radio",
                            iValeurChecked : oNatalite.iProgrammeScolaire,
                            tabRadios : [
                                
                                {
                                    sLabel : "Anti-nataliste",
                                    iValeur: 0
                                },
                                {
                                    sLabel : "Neutre",
                                    iValeur: 1
                                },
                                {
                                    sLabel : "Pro-nataliste",
                                    iValeur: 2
                                }
                            ]
                        },
                        {
                            sNomCommande : "Eugénisme d'état par critères : ",
                            sIdCommande : "MP-eugenisme",
                            sType : "checkbox",
                            tabCheckboxes : [
                                {
                                    sLabel : "éthnique",
                                    sChecked : false,
                                    iValeur: 0
                                },
                                {
                                    sLabel : "économique",
                                    sChecked : false,
                                    iValeur: 1
                                },
                                {
                                    sLabel : "religieux",
                                    sChecked : false,
                                    iValeur: 2
                                },
                                {
                                    sLabel : "de handicap léger",
                                    sChecked : false,
                                    iValeur: 2
                                },
                                {
                                    sLabel : "de handicap lourd",
                                    sChecked : true,
                                    iValeur: 2
                                }  
                            ]
                        },
                        {
                            sNomCommande : "Divers : ",
                            sIdCommande : "MP-divers",
                            sType : "checkbox",
                            tabCheckboxes : [
                                {
                                    sLabel : "Subventions aux crèches d'entreprise",
                                    sChecked : true,
                                    iValeur: 0
                                },
                                {
                                    sLabel : "Autoriser l'eugénisme privé",
                                    sChecked : false,
                                    iValeur: 0
                                },
                                {
                                    sLabel : "Autoriser la marchandisation de la reproduction",
                                    sChecked : false,
                                    iValeur: 0
                                }, 
                            ]
                        }
                    ]
                },
                "mortalite" : {
                    sId : "MP-taux-mortalite",
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
            var sCommandesMinistere = "";
            var oCommandes = oSousMinistere.oCommandes;
            
            //Resume natalité
            sCommandesMinistere += "\t\t" + "<strong>" + oSousMinistere.sTitre + '</strong><span class="' + oSousMinistere.sId + '">' + oSousMinistere.sContenu +'</span><br /><br />' + "\n";
            for (var iIdValeur in oSousMinistere.tabValeurs) {
                 sCommandesMinistere += "\t\t" + "<strong>" + oSousMinistere.tabValeurs[iIdValeur].sLabel + '</strong><span class="' + "" + '">' + oSousMinistere.tabValeurs[iIdValeur].sValeur +'</span>' + oSousMinistere.tabValeurs[iIdValeur].sComplementLabel + '<br /><br />' + "\n";
            }
                        
            //Opinion natalité
            var sOpinionNatalite = "";
            switch (oSousMinistere.sOpinionNatalite) {
                case 0 :
                break;
                case 2 :
                    sOpinionNatalite = "La plupart des hommes et femmes de votre nation aimeraient avoir 2 enfants.";
                break;
                case 3 : 
                    sOpinionNatalite =  "Les hommes et femmes de votre nation projetent généralement d'avoir entre 2 à 3 enfants.";
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
                            sCommandesMinistere += "\t\t" + '<input type="radio" name="' + oCommandes[iCommande].sIdCommande + '" ' + sRadChecked + '" value="' + tabRadios[iIdRad].sValeur +'" /> ' + tabRadios[iIdRad].sLabel + '<br />' + "\n";
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
            }
        },
        supprimerMinisteres : function () {
            $("#menu-gauche").empty();
        }
        
    }; 
    return MenuMinistere;
} ()); 