$(document).ready(function () {
    
    var INTERFACE = INTERFACE || {};
    INTERFACE.oSio = new PS.Sio();
    INTERFACE.oBlockInfo1 = new PS.BlockInfo1(INTERFACE.oSio);
    INTERFACE.oCarte = new PS.Carte(INTERFACE.oSio, INTERFACE.oBlockInfo1);
    INTERFACE.oMenuMinistere = new PS.MenuMinistere(INTERFACE.oSio);
    
    //Procédure de départ
    INTERFACE.oBlockInfo1.ecrireMessage("Choisissez un Pays...")
    $("#button-restart").click(function () {
        INTERFACE.oSio.relancerPartie();
    });   
    
    
    
    
    
    
    // $("body").append('<div id="donnee_fixe">Taux de natalité : <span id="tn">12.6</span> enfants/an pour 1000 habs<input id="aug_alloc" type="button" value="augmenter les allocations familiales" /></div><div id="flux">Démarrage en cours...</div>');
    // setInterval(function () {passerAnnee()}, 12000);
    // $("#aug_alloc").click(function () {
    //     oPays1.population.tn = Math.round((oPays1.population.tn + 0.1)*10)/10;
    //     $("#tn").empty().append(oPays1.population.tn);
    // });
    
});



// alert("Groupe : 4799\n" + 
//  "genre : " + oPays1.groupes[4799].genre + "\n" +
//  "age : " + oPays1.groupes[4799].age);
// alert("Groupe 5000\n" + 
//  "genre : " + oPays1.groupes[5000].genre + "\n" +
//  "age : " + oPays1.groupes[5000].age);
