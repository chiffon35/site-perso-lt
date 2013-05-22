var PS = PS || {};
PS.Pays = (function () {    
    //©2013 Loïc TRUCHOT
    Pays.oPaysVersionLegere = {};
        
    function Pays (sId, bDisponible, sNomAvecDetMin, tabPopulation) {
        
        var self = this;
        
        this.sId = sId;
        this.bDisponible = bDisponible;
        this.sNomAvecDetMin = sNomAvecDetMin;
        this.oPopulation = {
            iTotalEnK : tabPopulation[0],
            fPctHomme : tabPopulation[1],
            fTauxNatalite : tabPopulation[2]
        };
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
        obtenirMinisteres : function () {
            var oMinisteres = {
                oPopulation : this.obtenirInfoMinisterePopulation()
            };            
            return oMinisteres;
        },
        obtenirInfoMinisterePopulation : function () {
            var oPopulation = {
                iTotalEnK : this.tabCohortes.length,
                fTauxNatalite : this.oPopulation.fTauxNatalite
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
        
        creerRepartitionDeDepart : function (oPopulation) {
            var iNbHomme = oPopulation.fPctHomme * oPopulation.iTotalEnK;
            var iNbFemme = (1- oPopulation.fPctHomme) * oPopulation.iTotalEnK;
            this.repartirParSexeEtAge(iNbHomme, "homme");
            this.repartirParSexeEtAge(iNbFemme, "femme");
        },
        
        repartirParSexeEtAge : function (iNbPop, sSexe) {
            var iPct = parseInt((iNbPop / 100), 10);
            for (var iAge=0; iAge < 100; iAge++) {
                var iCohorte = iAge * iPct;
                var iCohorteSuivante = (iAge + 1) * iPct;
                for (var iCpt=0; iCpt < iNbPop; iCpt++) {
                    if (iCpt >= iCohorte && iCpt < iCohorteSuivante) {
                        this.tabCohortes.push({sGenre: sSexe, iAge : iAge});
                    }
                }
            }
            //console.log("------------" + this.tabCohortes.length + "----------------");
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
                this.tabCohortes.push({sGenre:"femme", iAge:0});
            }
            
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