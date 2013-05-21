PS.Sio = (function () {    
    //©2013 Loïc TRUCHOT
    //NameSpace requis : LTTOoLS
        //Objets Requis : oJqueryHelper
        
    function Sio () {
        
        var self = this;
        this.oJquery = LTTOoLS.oJqueryHelper;        
        
        //Connection
        this.oSocket = io.connect(window.location.origin);
        this.tabPaysJouables = [];
        //Emissions
        
        //Receptions
        this.oSocket.on('iAnneeCourante', function (iAnneeCourante) {
            self.chargerAnneeCourante(iAnneeCourante);           
        });    
    }
    Sio.prototype = {        
        chargerAnneeCourante: function (iAnneeCourante) {
            this.oJquery.remplacerContenuTextuel("#annee-courante", iAnneeCourante);
        },    
        
        
        chargerPays: function (sPays, rappel) { 
            this.oSocket.emit('oChoixPays', {sPaysChoisi : sPays}, function (reponse) {
                rappel(null, reponse.bEstDisponible);
            });

        },
        
        rafraichirPaysPourTous: function () {
            this.oSocket.emit('E_rafraichir_pays');
        }
    }; 
    
    return Sio;
    
}());