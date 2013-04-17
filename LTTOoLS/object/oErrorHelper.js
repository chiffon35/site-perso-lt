LTTOoLS.oErrorHelper =  {
    confirmerTypePropriete : function (tabMsgErreur, elt, sType, sMsgErreur, eltDeSubstitution) {        
        var nouvelElt;
        if ((typeof(elt) !== sType && sType !== "array") || (sType === "array" && !(elt instanceof Array))) {            
            tabMsgErreur.push(sMsgErreur);            
            if (eltDeSubstitution) {
                nouvelElt = eltDeSubstitution;
            }
            else {
                if (sType === "object") {                
                    nouvelElt = {};
                }
                else if (sType === "string") {
                    nouvelElt = "";
                }
                else if (sType === "number") {
                    nouvelElt = 0;
                }
                else if (sType === "array") {
                    nouvelElt = [];
                }
                else {
                    return;
                }
            }
            return nouvelElt;            
        }
        else {            
            return elt;
        }        
    },
    ecrireErreurs : function (tabMsgErreur) {
        var sErreur = "";
        for (var cptErreur = 0; cptErreur < tabMsgErreur.length; cptErreur++) {
            sErreur = '<span class="erreur_js">' + tabMsgErreur[cptErreur] + '</span>';
        }
        return sErreur;
    },
    alerterErreurs : function (tabMsgErreur) {
        var sErreur = "";
        var iNbErreur = tabMsgErreur.length;
        if (iNbErreur > 0) {
            sErreur += 'Erreur(s) JavaScript :' + "\n";      
            for (var cptErreur = 0; cptErreur < iNbErreur; cptErreur++) {
                sErreur += "\t" + tabMsgErreur[cptErreur] + "\n";
            }
            alert(sErreur);
        }
    },
    enregistrerErreurs : function (tabMsgErreur, sNomObjet) {
        var iNbErreur = tabMsgErreur.length;
        if (iNbErreur > 0) {
            console.log('Erreur(s) JavaScript sur ' + sNomObjet + ' :');      
            for (var cptErreur = 0; cptErreur < iNbErreur; cptErreur++) {
                console.log("\t" + tabMsgErreur[cptErreur]);
            }
            return true;
        }
        return false;
    }
};
