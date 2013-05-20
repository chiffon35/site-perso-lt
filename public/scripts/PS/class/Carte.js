PS.Carte = (function () { 
    
    function Carte (oSio) {
        
        var self = this;
        this.oSio = oSio;
        
        this.sIdCarte = "#svg2";
        
        this.sMonPays = "";
        
        this.oSio.oSocket.on('oPays', function (oPays) {            
            self.chargerPaysDisponible(oPays);           
        });    
    }
    Carte.prototype = {
        chargerPaysDisponible : function(oPays) {
            var self = this;
            for (var sPays in oPays) {
                
                //verifier disponibilite
                var bEstDisponible = true;                
                if (oPays[sPays] === 1) {
                    bEstDisponible = false;
                }                
                
                //appliquer disponibilité
                var sId = this.sIdCarte + " #" + sPays;
                if (sPays !== this.sMonPays) {
                    if (bEstDisponible){
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
            $(".carte-pays-disponible")
                .css({"fill" : "green", "cursor" : "pointer"})
                .mouseover(function () {
                    $(this).css({"fill" : "blue"});
                })
                .mouseout(function () {
                    $(this).css({"fill" : "green"});
                })
                .click(function () {
                    var oMonPays = this;
                    self.oSio.chargerPays($(this).attr('id'), function (error, bEstDisponible) { 
                        if (bEstDisponible) {
                            $(".carte-pays-disponible").unbind('click').unbind('mouseover').unbind('mouseout').css({"cursor" : "default"});
                            $(oMonPays).css({"fill" : "blue", "cursor" : "default"}).removeClass('carte-pays-disponible');
                            self.sMonPays = $(oMonPays).attr("id");   
                            self.oSio.rafraichirPaysPourTous();
                        }
                    });
                                   
                });
        }
    };
    return Carte;
}());