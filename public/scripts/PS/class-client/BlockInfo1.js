PS.BlockInfo1 = (function () { 
    
    function BlockInfo1 (oSio) {        
        var self = this;
        
        this.oSio = oSio;
        this.oBlockInfo1 = $("#block-info1");
        this.oDate = LTTOoLS.oDateHelper;
        
        //Receptions
        this.oSio.oSocket.on('sMessage', function (sMessage) {
            self.ecrireMessage(sMessage);           
        });    
  
    }
    BlockInfo1.prototype = {
        ecrireMessage : function (sMessage) {
            var sDateCourante = this.oDate.obtenirHeureEtMinuteCourante();
            this.oBlockInfo1.append(sDateCourante + " | " +sMessage + "\n");
            this.scrollerBas();
        },
        scrollerBas : function () {
            this.oBlockInfo1.scrollTop(this.oBlockInfo1[0].scrollHeight);
        }
    };
    return BlockInfo1;
}());