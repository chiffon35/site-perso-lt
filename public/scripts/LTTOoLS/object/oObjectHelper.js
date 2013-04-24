LTTOoLS.oObjectHelper =  {
    calculerTaille : function (oObjet) {
        var iTaille = 0, cle;
        for (cle in oObjet) {
            if (oObjet.hasOwnProperty(cle)) iTaille++;
        }
        return iTaille;
    }    
};
