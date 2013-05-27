 module.exports = function (oPSMinisteres, oPSGenres) {
    var oNatalite = this.oMinisteres.oPopulation.oNatalite;
    var fIndiceFecondite = 0;
    var oPSGenerique = oPSMinisteres.generique;
    var oPSPrestationsFamiliales = oPSMinisteres.population.prestations_familiales;
    var oPSPlacesEnCreches = oPSMinisteres.population.places_en_creches;
    var oPSProgrammeScolaire = oPSMinisteres.population.programme_scolaire;
    
    //-------- DEBUT OPINION NATALITE ---------
    var iOpinionNatalite = oNatalite.iOpinionNatalite;
    fIndiceFecondite +=  iOpinionNatalite;
    //-------- FIN OPINION NATALITE ---------
    
    //-------- DEBUT RATIO H/F ---------
    //Un ratio homme/femme inégal de plus d'1/3 fait baisser la fecondite
    var iBonusRatioHommeFemme = 1;
    var iNbFemme = this.obtenirNbParGenre(oPSGenres.femme);
    var iNbHomme = this.obtenirNbParGenre(oPSGenres.homme);
    var iTierDifferentiel = 0.3*iNbFemme;
    if (iNbFemme > (iNbHomme + iTierDifferentiel) || iNbFemme < (iNbHomme - iTierDifferentiel)) {
        iBonusRatioHommeFemme = 0;
    }
    fIndiceFecondite += iBonusRatioHommeFemme;
    //-------- FIN RATIO H/F ---------
    
    //-------- DEBUT PRESTATIONS FAMILIALES ---------
    var iPrestationFamiliale = oNatalite.iPrestationFamiliale;            
    switch (iPrestationFamiliale) {
        case(oPSPrestationsFamiliales.aucune) :
        break;
        case(oPSPrestationsFamiliales.politique_enfant_unique) :
            fIndiceFecondite -= 1;
        break;
        case(oPSPrestationsFamiliales.allocations_familiales) :
            fIndiceFecondite += 2;
        break;
        default:
        break;
    }
    //-------- FIN PRESTATIONS FAMILIALES ---------
    
    //-------- DEBUT CONTRACEPTION ---------
    var iContraception = oNatalite.iContraception;
    switch (iContraception) {
        case(oPSGenerique.iaa.illegal) :
            fIndiceFecondite += 3;
        break;
        case(oPSGenerique.iaa.autorise) :
            fIndiceFecondite -= 0.5;
        break;
        case(oPSGenerique.iaa.autorise_et_gratuit) :
            fIndiceFecondite -= 1;
        break;
        default:
        break;
    }
    //-------- FIN CONTRACEPTION ---------
    
    //-------- DEBUT AVORTEMENT ---------
    var iAvortement = oNatalite.iAvortement;            
    switch (iAvortement) {
        case(oPSGenerique.iaa.illegal) :
            fIndiceFecondite += 3;
        break;
        case(oPSGenerique.iaa.autorise) :
            fIndiceFecondite -= 0.5;
        break;
        case(oPSGenerique.iaa.autorise_et_gratuit) :
            fIndiceFecondite -= 1;
        break;
        default:
        break;
    }
    //-------- FIN AVORTEMENT ---------
    
    //-------- DEBUT SALAIRE PARENTAL ---------
    var iSalaireParental = oNatalite.iSalaireParental;            
    switch (iSalaireParental) {
        case(oPSGenerique.on.non) :
            fIndiceFecondite -= 1;
        break;
        case(oPSGenerique.on.oui) :
            fIndiceFecondite += 1;
        break;
        default:
        break;
    }
    //-------- FIN SALAIRE PARENTAL  ---------
    
    //-------- DEBUT PLACES EN CRECHES ---------
    var iPlacesEnCreches = oNatalite.iPlacesEnCreches ;            
    switch (iPlacesEnCreches) {
        case(oPSPlacesEnCreches.privees) :
        break;
        case(oPSPlacesEnCreches.remboursees_pour_les_bas_salaires) :
            fIndiceFecondite += 0.5;
        break;
        case(oPSPlacesEnCreches.remboursees_pour_tous) :
            fIndiceFecondite += 1;
        break;
        default:
        break;
    }
    //-------- FIN PLACES EN CRECHES ---------
    
    
    //-------- DEBUT PROGRAMME SCOLAIRE ---------
    var iProgrammeScolaire = oNatalite.iProgrammeScolaire ;            
    switch (iProgrammeScolaire) {
        case(oPSProgrammeScolaire.anti_nataliste) :
            fIndiceFecondite -= 0.5;
        break;
        case(oPSProgrammeScolaire.neutre) :
        break;
        case(oPSProgrammeScolaire.pro_nataliste) :
            fIndiceFecondite += 0.5;
        break;
        default:
        break;
    }
    //-------- FIN PROGRAMME SCOLAIRE ---------
    

    return this.oMath.arrondir(fIndiceFecondite, 2);
};


