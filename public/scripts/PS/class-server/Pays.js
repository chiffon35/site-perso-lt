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
        //--------FIN GETTERS----------
        
        //------- DEBUT SETTERS--------        
        modifierDisponibilite : function (bDisponible) {
            this.bDisponible = bDisponible;
            this.modifierVersionLegere();
        },
        
        //--------FIN SETTERS----------
        
        
        
        // CALCULER INDICE DE FECONDITE
        //Arguments : PS.Pays.oGenres, PS.Pays.oMinisteres
        calculerIndiceDeFecondite : require("./Pays-ext/calculerIndiceDeFecondite.js"),
        
        //CALCULER TAUX DE NATALITE
        calculerTauxDeNatalite : function () {
            var iTauxNatalite = 0;
            var oResume = this.oMinisteres.oPopulation.oResume;
            var oNatalite = this.oMinisteres.oPopulation.oNatalite;            
            iTauxNatalite = (3.8 * oNatalite.iOpinionNatalite * oResume.fIndiceFecondite) - (0.8 * oNatalite.fTauxMortaliteInfantile);
            return this.oMath.arrondir(iTauxNatalite, 2);
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
            var iPct = parseInt((iNbPop / 100), 10);
            for (var iAge=0; iAge < 100; iAge++) {
                var iCohorte = iAge * iPct;
                var iCohorteSuivante = (iAge + 1) * iPct;
                for (var iCpt=0; iCpt < iNbPop; iCpt++) {
                    if (iCpt >= iCohorte && iCpt < iCohorteSuivante) {
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

