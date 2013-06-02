 module.exports = function (oPSMinisteres, oPSGenres) {
    //console.log("--> Calculer indice fecondité");
    var oNatalite = this.oMinisteres.oPopulation.oNatalite;
    var fIndiceFecondite = 0;
    var oPSGenerique = oPSMinisteres.generique;
    var oPSPrestationsFamiliales = oPSMinisteres.population.prestations_familiales;
    var oPSPlacesEnCreches = oPSMinisteres.population.places_en_creches;
    var oPSProgrammeScolaire = oPSMinisteres.population.programme_scolaire;
    
    //-------- DEBUT OPINION NATALITE ---------
    fIndiceFecondite +=  oNatalite.iOpinionNatalite * 0.75;
    if (oNatalite.iOpinionNatalite < 2) {
        fIndiceFecondite += -0.25;
    }
    //-------- FIN OPINION NATALITE ---------
    
    //-------- DEBUT RATIO H/F ---------
    //Un ratio homme/femme inégal de plus d'1/3 fait baisser la fecondite
    var iBonusRatioHommeFemme = 1;
    var iNbFemme = this.obtenirNbParGenre(oPSGenres.femme);
    var iNbHomme = this.obtenirNbParGenre(oPSGenres.homme);
    var iTierDifferentiel = 0.3 * iNbFemme;
    if (iNbFemme > (iNbHomme + iTierDifferentiel) || iNbFemme < (iNbHomme - iTierDifferentiel)) {
        iBonusRatioHommeFemme = 0;
    }
    fIndiceFecondite += iBonusRatioHommeFemme;
    //-------- FIN RATIO H/F ---------
    

    //-------- DEBUT PRESTATIONS FAMILIALES ---------
    //console.log("---- Prestation familiale = " + oNatalite.iPrestationFamiliale);
    //console.log("-->Value politique enfant unique = " + oPSPrestationsFamiliales.politique_enfant_unique);
    switch (oNatalite.iPrestationFamiliale) {
        case(oPSPrestationsFamiliales.aucune) :
        break;
        case(oPSPrestationsFamiliales.politique_enfant_unique) :
            //console.log("-->Politique enfant unique");
            fIndiceFecondite = 1 + ((0.25 * oNatalite.iOpinionNatalite) + (0.25 * oNatalite.iSalaireParental) - (0.1 * oNatalite.iAvortement) - (0.1 * oNatalite.iContraception));
            //console.log("0.75 + ((0.1 * " + oNatalite.iOpinionNatalite + ") + (0.25 * " + oNatalite.iPrestationFamiliale + ") + (0.25 * " + oNatalite.iSalaireParental + ") - (0.1 * " + oNatalite.iAvortement + ") - (0.1 * " + oNatalite.iContraception+"))");            return this.oMath.arrondir(fIndiceFecondite, 2);
            return fIndiceFecondite;
        case(oPSPrestationsFamiliales.allocations_familiales) :
            fIndiceFecondite += 0.75;
        break;
        default:
        break;
    }
    //-------- FIN PRESTATIONS FAMILIALES ---------
    
    //-------- DEBUT CONTRACEPTION ---------
    switch (oNatalite.iContraception) {
        case(oPSGenerique.iaa.illegal) :
            fIndiceFecondite += 1.5;
        break;
        case(oPSGenerique.iaa.autorise) :
            fIndiceFecondite -= 0.5;
        break;
        case(oPSGenerique.iaa.autorise_et_gratuit) :
            fIndiceFecondite -= 0.75;
        break;
        default:
        break;
    }
    //-------- FIN CONTRACEPTION ---------
    
    //-------- DEBUT AVORTEMENT --------- 
    switch (oNatalite.iAvortement) {
        case(oPSGenerique.iaa.illegal) :
            fIndiceFecondite += 1.25;
        break;
        case(oPSGenerique.iaa.autorise) :
            fIndiceFecondite -= 0.25;
        break;
        case(oPSGenerique.iaa.autorise_et_gratuit) :
            fIndiceFecondite -= 0.5;
        break;
        default:
        break;
    }
    //-------- FIN AVORTEMENT ---------
    
    //-------- DEBUT SALAIRE PARENTAL ---------  
    //console.log(oNatalite.iSalaireParental + " : oui -> " + oPSGenerique.on.oui);
    switch (oNatalite.iSalaireParental) {        
        case(oPSGenerique.on.non) :
        break;
        case(oPSGenerique.on.oui) :
            fIndiceFecondite += 0.25;
        break;
        default:
        break;
    }
    //-------- FIN SALAIRE PARENTAL  ---------
    
    //-------- DEBUT PLACES EN CRECHES --------- 
    switch (oNatalite.iPlacesEnCreches) {
        case(oPSPlacesEnCreches.privees) :
        break;
        case(oPSPlacesEnCreches.remboursees_pour_les_bas_salaires) :
            fIndiceFecondite += 0.25;
        break;
        case(oPSPlacesEnCreches.remboursees_pour_tous) :
            fIndiceFecondite += 0.5;
        break;
        default:
        break;
    }
    //-------- FIN PLACES EN CRECHES ---------
    
    
    //-------- DEBUT PROGRAMME SCOLAIRE ---------   
    switch (oNatalite.iProgrammeScolaire) {
        case(oPSProgrammeScolaire.anti_nataliste) :
            fIndiceFecondite -= 0.25;
        break;
        case(oPSProgrammeScolaire.neutre) :
        break;
        case(oPSProgrammeScolaire.pro_nataliste) :
            fIndiceFecondite += 0.25;
        break;
        default:
        break;
    }
    //-------- FIN PROGRAMME SCOLAIRE ---------
    

    return this.oMath.arrondir(fIndiceFecondite, 2);
};


