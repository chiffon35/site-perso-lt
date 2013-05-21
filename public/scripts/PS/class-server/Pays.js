var PS = PS || {};
PS.Pays = (function () {    
    //©2013 Loïc TRUCHOT
        
    function Pays (sId, bDisponible, sNomAvecDetMin, oPopulation) {
        
        var self = this;
        
        this.sId = sId;
        this.bDisponible = bDisponible;
        this.sNomAvecDetMin = sNomAvecDetMin;
        this.oPopulation = oPopulation;
        this.tabGroupes = [];
        
        //procédure
        //this.creerRepartitionDeDepart(this.oPopulation);

    }
    Pays.prototype = {       
        
        creerRepartitionDeDepart : function (oPopulation) {
            var nb_homme = oPopulation.fPctHomme * oPopulation.iTotalEnK;
            var tabAllFemmes = [];
            var tabAllHommes = [];
            for (var i=0; i < oPopulation.iTotalEnK; i++) {    
                if (i < nb_homme) {
                    this.tabGroupes[i] = {
                        genre : "homme"
                    };
                    tabAllHommes.push(i);
                }
                else {
                    this.tabGroupes[i] = {
                        genre : "femme"
                    };
                    tabAllFemmes.push(i);
                }
            }            
            this.repartirParAge(tabAllFemmes);
            this.repartirParAge(tabAllHommes);
        },
        
        repartirParAge : function (tabPop) {
            var nbPop = tabPop.length; 
            var pct = parseInt((nbPop / 100), 10);
            for (var i=0; i < 100; i++) {
                var iCohorte = i * pct;
                var iCohorteSuivante = (i + 1) * pct;
                for (var id in tabPop) {
                    if (id >= iCohorte && id < iCohorteSuivante) {
                        this.tabGroupes[tabPop[id]].age = i;
                    }
                }
            }
        },
        
        obtenirVersionLegere1 : function () {
            var oVersionLegere = {
                bDisponible : this.bDisponible,
                sNomAvecDetMin : this.sNomAvecDetMin
            };
            return oVersionLegere;
        }
    }; 
    
    return Pays;
    
}());

if (typeof module !== "undefined") {
    module.exports = PS.Pays;
}