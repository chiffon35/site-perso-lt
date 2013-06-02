var LTTOoLS = LTTOoLS || {};
LTTOoLS.oDateHelper =  {
    obtenirHeureEtMinuteCourante : function () {
        var sHEtMCourante = "";
        var dDateCourante = new Date();
        sHEtMCourante = ('0' + dDateCourante.getHours()).slice(-2) + ':' + ('0' + (dDateCourante.getMinutes()+1)).slice(-2);
        return sHEtMCourante;
    }
};

if (typeof module !== "undefined") {
    module.exports = LTTOoLS.oDateHelper;
}