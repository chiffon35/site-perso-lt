module.exports = {
    "fr" : {
        sId : "fr", 
        bDisponible : true, 
        sNomAvecDetMin :"la France",
        oMinisteres : {
            oPopulation : 
            {
                oResume : 
                {
                    iTotalEnK :65000,
                    fPctHomme : 0.48,
                    tabPctAge25 : [0.31, 0.33, 0.28, 0.08],
                    fTauxMortalite : 8.5                        
                },
                oNatalite : 
                {
                    fTauxMortaliteInfantile : 3.5,
                    iOpinionNatalite : 2,
                    iPrestationFamiliale : 2,
                    iContraception: 2,
                    iAvortement : 2,  
                    iSalaireParental: 0,
                    iPlacesEnCreches: 1,
                    iProgrammeScolaire :0
                }
            }
        },
        iRecette : 300000
    },
    "de" : {        
        sId : "de", 
        bDisponible : true, 
        sNomAvecDetMin :"l'Allemagne",
        oMinisteres : {
            oPopulation : 
            {
                oResume : 
                {
                    iTotalEnK :82000,
                    fPctHomme : 0.48,
                    tabPctAge25 : [0.19, 0.35, 0.31, 0.15],
                    fTauxMortalite :11.4                        
                },
                oNatalite : 
                {
                    fTauxMortaliteInfantile : 3.5,
                    iOpinionNatalite : 1,
                    iPrestationFamiliale : 2,
                    iContraception: 1,
                    iAvortement : 1,  
                    iSalaireParental: 1,
                    iPlacesEnCreches: 0,
                    iProgrammeScolaire :0
                }
            }
        },
        iRecette : 300000        
    }
};

