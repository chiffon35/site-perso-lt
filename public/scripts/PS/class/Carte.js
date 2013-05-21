PS.Carte = (function () { 
    
    function Carte (oSio, oBlockInfo1) {
        
        var self = this;
        this.oSio = oSio;
        this.oBlockInfo1 = oBlockInfo1;
        
        this.sIdCarte = "#svg2";
        
        this.sMonPays = "";
        
        //reception
        this.oSio.oSocket.on('oPays', function (oPays) {            
            self.chargerPaysDisponible(oPays); 
            console.log(oPays.fr);
        });   
        
    }
    Carte.prototype = {
        chargerPaysDisponible : function(oPays) {
            var self = this;            
            for (var sPays in oPays) {                
                
                //Nettoyer l'objet
                if (sPays === this.sMonPays && oPays[sPays].bDisponible) {
                    this.sMonPays = "";
                }
                
                //Appliquer disponibilité
                var sId = this.sIdCarte + " #" + sPays;
                if (sPays !== this.sMonPays) {                    
                    if (oPays[sPays].bDisponible){
                        $(sId)
                        .removeClass("carte-pays-indisponible")
                        .addClass("carte-pays-disponible");
                    }
                    else {
                        $(sId)
                        .removeClass("carte-pays-disponible")
                        .addClass("carte-pays-indisponible");
                    }
                }
            }
            
            //configurer indisponibles  
            $(".carte-pays-indisponible")
                .css({"fill" : "red", "cursor" : "default"})
                .unbind('click').unbind('mouseover').unbind('mouseout');
                
            //configurer disponibles
            $(".carte-pays-disponible").css({"fill" : "green"});
            if (this.sMonPays === "") {                
                $(".carte-pays-disponible").css({"cursor" : "pointer"})
                .mouseover(function () {
                    $(this).css({"fill" : "blue"});
                })
                .mouseout(function () {
                    $(this).css({"fill" : "green"});
                })
                .click(function () {
                    var oMonPays = this;
                    var sMonPaysId = $(oMonPays).attr('id');
                    self.oSio.chargerPays(sMonPaysId , function (error, bEstDisponible) { 
                        if (bEstDisponible) {
                            $(".carte-pays-disponible").unbind('click').unbind('mouseover').unbind('mouseout').css({"cursor" : "default"});
                            $(oMonPays).css({"fill" : "blue", "cursor" : "default"}).removeClass('carte-pays-disponible');
                            self.sMonPays = $(oMonPays).attr("id");   
                            self.oSio.rafraichirPaysPourTous();
                            self.oBlockInfo1.ecrireMessage("Vous jouez désormais " + oPays[sMonPaysId].sNomAvecDetMin + "");
                            self.oSio.oSocket.emit('B_ecrire_message', "Un joueur a pris le contrôle de " + oPays[sMonPaysId].sNomAvecDetMin);                            
                        }
                    });               
                });
            }
        }
    };
    return Carte;
}());