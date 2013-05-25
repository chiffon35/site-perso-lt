var PS = PS || {};
PS.Pays = (function () {    
    //©2013 Loïc TRUCHOT
    Pays.oPaysVersionLegere = {};
    Pays.oGenres = {
        "homme" : 0,
        "femme" : 1
    };
    Pays.oDepenses = {
        oNatalite : {
            oPolitiqueNataliste : {
                "aucune" : 0,
                "allocations_familiales" : 1,
                "enfant_unique" : 2
            },
            oContraception : {
                "contraception_prohibee" : 0,
                "contraception_autorisee" : 1,
                "contraception_gratuite" : 2
            } ,
            oPedagogie : {
                "anti_nataliste" : 0,
                "aucune" : 1,
                "pro_nataliste" : 2
            },
            oAvortement : {
                "avortement_prohibe" : 0,
                "avortement_autorise" : 1,
                "avortement_gratuit" : 2                
            },
            oEugenisme : {
                "eugenisme_prohibe" : 0,
                "eugenisme_prive" : 1,
                "eugenisme_d_etat" : 2,
                oCriteres : {
                    "genre" : 0,
                    "ethnie" : 1,
                    "richesse" : 2,
                    "sante" : 3,
                    "religion" : 4
                }
            }
        }
    }
        
    function Pays (sId, bDisponible, sNomAvecDetMin, tabPopulation, iRecette) {
        
        var self = this;
        
        //variables construites
        this.sId = sId;
        this.bDisponible = bDisponible;
        this.sNomAvecDetMin = sNomAvecDetMin;
        this.oPopulation = {
            iTotalEnK : tabPopulation[0],
            fPctHomme : tabPopulation[1],
            fTauxNatalite : tabPopulation[2],
            fTauxMortalite : tabPopulation[3]
        };
        this.iRecette = iRecette;
        
        //variables déduites
        this.iDepense = 0;
        this.tabCohortes = [];
        this.oPossesseur = {};
        
        //procédure
        this.creerRepartitionDeDepart(this.oPopulation);
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
        obtenirMinisteres : function () {
            var oMinisteres = {
                oPopulation : this.obtenirInfoMinisterePopulation()
            };            
            return oMinisteres;
        },
        obtenirInfoMinisterePopulation : function () {
            var oPopulation = {
                iTotalEnK : this.tabCohortes.length,
                fTauxNatalite : this.oPopulation.fTauxNatalite,
                fTauxMortalite  : this.oPopulation.fTauxMortalite
            };            
            return oPopulation;
        },
        //--------FIN GETTERS----------
        
        //------- DEBUT SETTERS--------
        modifierDisponibilite : function (bDisponible) {
            this.bDisponible = bDisponible;
            this.modifierVersionLegere();
        },
        
        //--------FIN SETTERS----------
        
        //--------- DEBUT CHANGEMENT D'ANNEE----------
        faireEvoluerPopulation: function () {
            this.faireEvoluerAge();            
            this.supprimerDeces();
            this.creerNouvelleGeneration();
        },
        
        faireEvoluerAge : function () {
            for (var iCohorte in this.tabCohortes) {
                this.tabCohortes[iCohorte].iAge++;                
            }  
        },
        
        creerNouvelleGeneration : function () {
            var iNbNaissance = parseInt(this.oPopulation.iTotalEnK * (this.oPopulation.fTauxNatalite/1000), 10);
            this.oPopulation.iTotalEnK = this.oPopulation.iTotalEnK + iNbNaissance;
            for (var i=0; i < iNbNaissance; i++) {
                var sGenreAleatoire = Pays.oGenres.homme
                if (Math.random() < 0.49) {
                    sGenreAleatoire = Pays.oGenres.femme
                }        
                //console.log(sGenreAleatoire);
                this.creerCohorte(sGenreAleatoire, 0);
            }    
            //console.log("Nombre de naissance : " + iNbNaissance);
        }, 
        supprimerDeces : function () {
            var iNbDeMort = parseInt(this.oPopulation.iTotalEnK * (this.oPopulation.fTauxMortalite/1000), 10);  
            var iCohorteMax = this.tabCohortes.length - 1;
            for(var i = 0; i < iNbDeMort; i++) {
                var idAleatoire = Math.floor(Math.random() * this.tabCohortes.length);
                this.supprimerCohorte(idAleatoire);
            }
            
            //var iCohorteDebut = iCohorteMax - iNbDeMort; 
            //this.supprimerCohortesParTanche(iCohorteDebut, iNbDeMort);
            
            this.oPopulation.iTotalEnK = this.oPopulation.iTotalEnK - iNbDeMort;
        },
        //--------- FIN CHANGEMENT D'ANNEE----------
        
        creerCohorte : function (iGenre, iAge) {
            this.tabCohortes.push({iGenre: iGenre, iAge : iAge});
        },
        supprimerCohorte : function (iCohorteId) {
            this.tabCohortes.splice(iCohorteId, 1);
        }, 
        supprimerCohortesParTanche : function (iCohorteIdDebut, iNombre) {
            this.tabCohortes.splice(iCohorteIdDebut, iNombre);
        }, 
        
        creerRepartitionDeDepart : function (oPopulation) {
            var iNbHomme = oPopulation.fPctHomme * oPopulation.iTotalEnK;
            var iNbFemme = (1- oPopulation.fPctHomme) * oPopulation.iTotalEnK;
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
            //console.log("------------" + this.tabCohortes.length + "----------------");
        },  
     
        modifierVersionLegere : function () {
            PS.Pays.oPaysVersionLegere[this.sId] = {
                bDisponible : this.bDisponible,
                sNomAvecDetMin : this.sNomAvecDetMin
            };
        }        
    }; 
    
    return Pays;
    
}());

if (typeof module !== "undefined") {
    module.exports = PS.Pays;
}