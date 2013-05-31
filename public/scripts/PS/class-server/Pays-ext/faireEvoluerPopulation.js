module.exports = function (oPSGenres) {
    var iAgeMax = 150;
    var oPopulationResume = this.oMinisteres.oPopulation.oResume;
    //faire evoluer age
    for (var iCohorte in this.tabCohortes) {
        this.tabCohortes[iCohorte].iAge++;                
    } 
    
    //supprimer décès
    var idAleatoire = 0;
    var iNbDeMort = parseInt(oPopulationResume.iTotalEnK * (oPopulationResume.fTauxMortalite/1000), 10);
    var tabTrancheAvant50 = this.obtenirTabCohortesParTrancheDAge(0, 49);
    var tabTrancheApres50 = this.obtenirTabCohortesParTrancheDAge(49, 74);
    var tabTrancheApres75 = this.obtenirTabCohortesParTrancheDAge(75, iAgeMax);
    //console.log("faireEvoluerPopulation.js--> Pop de plus de 75 ans de " + this.sNomAvecDetMin + " : " + tabTrancheApres75.length);
    for(var i = 0; i < iNbDeMort; i++) {  
        
        //65% de mort ont plus de 75 ans
        if (i < iNbDeMort * 0.65 && tabTrancheApres75.length > 0) {
            idAleatoire = tabTrancheApres75[Math.floor(Math.random() * tabTrancheApres75.length)];  
            tabTrancheApres75.splice(idAleatoire, 1);
        }
        //15% de mort entre 49 et 74 ans
        else if (i < iNbDeMort * 0.15 && tabTrancheApres50.length > 0) {
            idAleatoire = tabTrancheApres50[Math.floor(Math.random() * tabTrancheApres50.length)];  
            tabTrancheApres50.splice(idAleatoire, 1);
        } 
        else {
            idAleatoire = tabTrancheAvant50[Math.floor(Math.random() * tabTrancheAvant50.length)];  
            tabTrancheAvant50.splice(idAleatoire, 1);
        }              
        this.supprimerCohorte(idAleatoire);
    }    

    //creer nouvelle génération
    var iNbNaissance = parseInt(oPopulationResume.iTotalEnK * (oPopulationResume.fTauxNatalite/1000), 10);
    for (var j=0; j < iNbNaissance; j++) {
        var sGenreAleatoire = oPSGenres.homme;
        if (Math.random() < 0.49) {
            sGenreAleatoire = oPSGenres.femme;
        }        
        this.creerCohorte(sGenreAleatoire, 0);
    }
    this.recalculerNatalite();
    this.oMinisteres.oPopulation.oResume.iTotalEnK = this.tabCohortes.length;
};