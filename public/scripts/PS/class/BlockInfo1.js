PS.BlockInfo1 = (function () { 
    
    function BlockInfo1 (oSio) {        
        var self = this;
        
        this.oSio = oSio;
        this.oBlockInfo1 = $("#block-info1");
        
        //Receptions
        this.oSio.oSocket.on('sMessage', function (sMessage) {
            self.ecrireMessage(sMessage);           
        });    
  
    }
    BlockInfo1.prototype = {
        ecrireMessage : function (sMessage) {
            var oDateCourante = new Date();
            this.oBlockInfo1.append(oDateCourante.getHours() + ":" + oDateCourante.getMinutes() + " | " +sMessage + "\n");
        }        
    };
    return BlockInfo1;
}());