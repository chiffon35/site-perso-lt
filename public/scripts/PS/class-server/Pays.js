module.exports =
(function () {    
    //©2013 Loïc TRUCHOT
    Pays.oPaysVersionLegere = {};
    Pays.oGenres = {
        "homme" : 0,
        "femme" : 1
    };
    Pays.oMinisteres =  {
        "generique" : {
            "iaa" : {
                "illegal" : 0,
                "autorise" : 1,
                "autorise_et_gratuit" : 2                
            },
            "on" : {
                "non" : 0,
                "oui" : 1
            }
        },
        "population" : {
            "prestations_familiales" : {
                "aucune" : 0,
                "politique_enfant_unique" : 1,
                "allocations_familiales" : 2
            },
            "places_en_creches" : {
                "privees" : 0,
                "remboursees_pour_les_bas_salaires" : 1,
                "remboursees_pour_tous" : 2
            },
            "programme_scolaire" : {
                "anti_nataliste" : 0,
                "neutre" : 1,
                "pro_nataliste" : 2                
            }
        }  
    };
        
    function Pays (oValeursDeparts) {
        
        var self = this;

        //Extensions :
        this.oMath = require("./../../LTTOoLS/object/oMathHelper.js");
        
        //variables construites
        this.sId = oValeursDeparts.sId;
        this.bDisponible = oValeursDeparts.bDisponible;
        this.sNomAvecDetMin = oValeursDeparts.sNomAvecDetMin;
        this.oMinisteres = oValeursDeparts.oMinisteres;        
        this.iRecette = oValeursDeparts.iRecette;
        
        //variables déduites
        this.iDepense = 0;        
        this.oMinisteres.oPopulation.oResume.fIndiceFecondite = 0;
        this.oMinisteres.oPopulation.oResume.fTauxNatalite = 0;
        
        
        
        this.tabCohortes = [];
        this.oPossesseur = {};
        
        //procédures
        this.creerRepartitionDeDepart(this.oMinisteres.oPopulation.oResume);
        this.oMinisteres.oPopulation.oResume.fIndiceFecondite = this.calculerIndiceDeFecondite(Pays.oMinisteres, Pays.oGenres);
        this.oMinisteres.oPopulation.oResume.fTauxNatalite = this.calculerTauxDeNatalite();        
        
        //version légère
        this.modifierVersionLegere();
        
    
    }
    Pays.prototype = {    
        

        //------- DEBUT GETTERS--------
        estDisponible : function () {
            return this.bDisponible;
        },
        obtenirNbParGenre : function (sGenre) {
            var iNbParGenre = 0;
            for (var iId in this.tabCohortes) {
                if (this.tabCohortes[iId].sGenre === sGenre) {
                    iNbParGenre++;
                }
            }
            return iNbParGenre;
        },
        obtenirNbParAge : function (iAge) {
            var iNbParAge = 0;
            for (var iId in this.tabCohortes) {
                if (this.tabCohortes[iId].iAge === iAge) {
                    iNbParAge++;
                }
            }
            return iNbParAge;
        },     
        obtenirNbParTrancheDAge : function (iAgeDepart, iAgeFin) {
            var iNbParTrancheDAge = 0;
            for (var iId in this.tabCohortes) {
                if (this.tabCohortes[iId].iAge >= iAgeDepart && this.tabCohortes[iId].iAge <= iAgeFin) {
                    iNbParTrancheDAge++;
                }
            }
            return iNbParTrancheDAge;
        }, 
        obtenirTabCohortesParTrancheDAge : function (iAgeDepart, iAgeFin) {
            var tabCohortesParTrancheDAge = [];
            for (var iId in this.tabCohortes) {
                if (this.tabCohortes[iId].iAge >= iAgeDepart && this.tabCohortes[iId].iAge <= iAgeFin) {
                    tabCohortesParTrancheDAge.push(iId);
                }
            }
            return tabCohortesParTrancheDAge;
        }, 
        obtenirNbParTrancheDAgeEtGenre : function (iAgeDepart, iAgeFin, iGenre) {
            var iNbParTrancheDAgeEtSexe = 0;
            for (var iId in this.tabCohortes) {
                if ((this.tabCohortes[iId].iAge  >= iAgeDepart && this.tabCohortes[iId].iAge <= iAgeFin)  && this.tabCohortes[iId].iGenre === iGenre) {
                    iNbParTrancheDAgeEtSexe++;
                }
            }
            return iNbParTrancheDAgeEtSexe;
        }, 
        //--------FIN GETTERS----------
        
        //------- DEBUT SETTERS--------        
        modifierDisponibilite : function (bDisponible) {
            this.bDisponible = bDisponible;
            this.modifierVersionLegere();
        },
        modifierValeurParID : function(oObjet, sId, iValeur) {
            var oNataliteValId = {
                "test" : this.oMinisteres.oPopulation.oNatalite.iOpinionNatalite
            };
            oNataliteValId[sId] = iValeur;
        },
        
        //--------FIN SETTERS----------
        
        
        
        // CALCULER INDICE DE FECONDITE
        //Arguments : Pays.oMinisteres, Pays.oGenres
        calculerIndiceDeFecondite : require("./Pays-ext/calculerIndiceDeFecondite.js"),
        
        //CALCULER TAUX DE NATALITE
        calculerTauxDeNatalite : function () {
            var iTauxNatalite = 0;
            var oResume = this.oMinisteres.oPopulation.oResume;
            var oNatalite = this.oMinisteres.oPopulation.oNatalite;
             var iPctFemmeFeconde = this.oMath.arrondir(((this.obtenirNbParTrancheDAgeEtGenre(15, 49, Pays.oGenres.femme) * 100) /this.tabCohortes.length),0);
            
            //formule taux natalité
            iTauxNatalite = ((4 * ((oNatalite.iOpinionNatalite * 0.5) + 1) * (oResume.fIndiceFecondite * 0.65)) - (0.7 * oNatalite.fTauxMortaliteInfantile)) + iPctFemmeFeconde/5;            
   
            
            if (iTauxNatalite < 0) {
                iTauxNatalite = 0;
            }
            
            iTauxNatalite = this.oMath.arrondir(iTauxNatalite, 2);
            //console.log("Pays.js--> " + "Taux de natalité de " + this.sNomAvecDetMin + " : " + iTauxNatalite);
            return iTauxNatalite;
        },
        
        //RECALCULER NATALITE
        recalculerNatalite: function () {
            this.oMinisteres.oPopulation.oResume.fIndiceFecondite =  this.calculerIndiceDeFecondite(Pays.oMinisteres, Pays.oGenres);
            this.oMinisteres.oPopulation.oResume.fTauxNatalite = this.calculerTauxDeNatalite();
        },
        
        creerCohorte : function (iGenre, iAge) {
            this.tabCohortes.push({iGenre: iGenre, iAge : iAge});
        },
        supprimerCohorte : function (iCohorteId) {
            this.tabCohortes.splice(iCohorteId, 1);
        }, 
        supprimerCohortesParTanche : function (iCohorteIdDebut, iNombre) {
            this.tabCohortes.splice(iCohorteIdDebut, iNombre);
        }, 
        
        // ----------------- DEBUT CREER REPARTITION DE DEPART ------------------
        creerRepartitionDeDepart : function (oResumePopulation) {
            var iNbHomme = oResumePopulation.fPctHomme * oResumePopulation.iTotalEnK;
            var iNbFemme = (1- oResumePopulation.fPctHomme) * oResumePopulation.iTotalEnK;
            this.repartirParSexeEtAge(iNbHomme, Pays.oGenres.homme);
            this.repartirParSexeEtAge(iNbFemme, Pays.oGenres.femme);
        },        
        repartirParSexeEtAge : function (iNbPop, iGenre) {
            var tabPctAge25 = this.oMinisteres.oPopulation.oResume.tabPctAge25;
            
            //Pour chaque tranche de 25 ans
            for (var idPct in tabPctAge25) {
                var iNbPopDansTrancheCourante = this.oMath.arrondir((iNbPop * tabPctAge25[idPct]), 1);
                var i25EmeDeTranche = this.oMath.arrondir((iNbPopDansTrancheCourante / 25), 1);
                
                //Preparation de l'âge courant
                for (var iAge = (25 * idPct); iAge < (25 * (1 + parseInt(idPct, 10))); iAge++) {
                    
                    //Répartition
                    for (var iCpt = 0; iCpt < i25EmeDeTranche; iCpt++) {
                        this.creerCohorte(iGenre, iAge);
                    }
                }        
            }           
        }, 
        // ----------------- FIN CREER REPARTITION DE DEPART ------------------
        
        // FAIRE EVOLUER LA POPULATION AU CHANGEMENT D'ANNEE
        //Arguments : PS.Pays.oGenres
        faireEvoluerPopulation: require("./Pays-ext/faireEvoluerPopulation.js"),
        
        //MODIFIER LA VERSION LEGERE
        modifierVersionLegere : function () {
            Pays.oPaysVersionLegere[this.sId] = {
                bDisponible : this.bDisponible,
                sNomAvecDetMin : this.sNomAvecDetMin
            };
        }        
    }; 
    
    return Pays;
    
}());

