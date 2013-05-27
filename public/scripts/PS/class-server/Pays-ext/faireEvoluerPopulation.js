module.exports = function (oPSGenres) {
    
    var oPopulationResume = this.oMinisteres.oPopulation.oResume;
    //faire evoluer age
    for (var iCohorte in this.tabCohortes) {
        this.tabCohortes[iCohorte].iAge++;                
    } 
    
    //supprimer décès
    var iNbDeMort = parseInt(oPopulationResume.iTotalEnK * (oPopulationResume.fTauxMortalite/1000), 10);  
    for(var i = 0; i < iNbDeMort; i++) {
        var idAleatoire = Math.floor(Math.random() * this.tabCohortes.length);
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
    console.log(iNbDeMort + " < " + iNbNaissance);
    
    this.oMinisteres.oPopulation.oResume.iTotalEnK = this.tabCohortes.length;
};