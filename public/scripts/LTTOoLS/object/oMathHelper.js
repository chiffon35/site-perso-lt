LTTOoLS.oMathHelper =  {
    pi180 : Math.PI/180,
    arrondir : function(iNombre, iNbApresVirgule) {
        var iNombreArrondi;
        iNbApresVirgule = iNbApresVirgule || 0;
        var iArrondisseur = Math.pow(10, iNbApresVirgule);
        iNombreArrondi = Math.round(iNombre * iArrondisseur) / iArrondisseur;
        return iNombreArrondi;
    },
    cosinus : function(iNombre) {
        var iCosinus;
        iCosinus = Math.cos(this.convertirDegresEnRadial(iNombre));
        return iCosinus;
    },
    sinus : function(iNombre) {
        var iSinus;
        iSinus = Math.sin(this.convertirDegresEnRadial(iNombre));
        return iSinus;
    },
    convertirDegresEnRadial : function(iDegres) {
        var iRadial = iDegres * this.pi180;
        return iRadial;
    }
};
