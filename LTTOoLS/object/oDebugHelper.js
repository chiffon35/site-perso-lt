LTTOoLS.oDebugHelper =  {
    ecrireObjet : function (oObjet) {
        if (oObjet) {      
            for (var cle in oObjet) {
                if (typeof oObjet[cle] == "object" || typeof oObjet[cle] == "array") {
                    console.log(cle + " : ");
                    this.ecrireObjet(oObjet[cle]);
                }
                else if (typeof oObjet[cle] != "function") {
                    console.log(cle + " : " + oObjet[cle]);
                }
            }
        }
        return;
    }
};
