var LTTOoLS = LTTOoLS || {};
LTTOoLS.oStringHelper =  {
    decouperMotsParLongueur : function (sLigne, iLongueur, sScission) {
        var tabLigneDecoupe = [];
        var tabPlusieursMots = [];
         if (sLigne.length > iLongueur) {
            tabLigneDecoupe = sLigne.split(sScission);
            sLigne = tabLigneDecoupe[0];
        }
        tabPlusieursMots[0] = sLigne;
        
        if (tabLigneDecoupe.length > 0) {
            for (var iMot = 1; iMot < tabLigneDecoupe.length; iMot++) {
                if (tabLigneDecoupe[iMot + 1]) {
                    if (tabLigneDecoupe[iMot].length + tabLigneDecoupe[iMot + 1].length < iLongueur) {
                        tabPlusieursMots.push(tabLigneDecoupe[iMot] + " " + tabLigneDecoupe[iMot + 1]);
                        iMot++;
                    }
                    else {                                
                        tabPlusieursMots.push(tabLigneDecoupe[iMot]);
                    }
                }
                else {
                    tabPlusieursMots.push(tabLigneDecoupe[iMot]);
                }
            }
        }
        return tabPlusieursMots;
    },
    passerPremiereLettreEnMaj : function (chaine) {
        return chaine.substr(0,1).toUpperCase() + chaine.substr(1,chaine.length);        
    }    
};

if (typeof module !== "undefined") {
    module.exports = LTTOoLS.oStringHelper;
}
