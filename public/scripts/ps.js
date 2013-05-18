var annee_courante = 2013;
var oPays1 = {
    population: {
        total : 65000,
        pct_homme : 48/100,
        tn : 12.6
    },
    groupes : []
};

//repartition de départ
var nb_homme = oPays1.population.pct_homme * oPays1.population.total;
var tabAllFemmes = [];
var tabAllHommes = [];
for (var i=0; i < oPays1.population.total; i++) {    
    if (i < nb_homme) {
        oPays1.groupes[i] = {
            genre : "homme"
        };
        tabAllHommes.push(i);
    }
    else {
        oPays1.groupes[i] = {
            genre : "femme"
        };
        tabAllFemmes.push(i);
    }
}
var repartirAge = function (tabPop) {
    var nbPop = tabPop.length; 
    var pct = parseInt((nbPop / 100), 10);
    for (var i=0; i < 100; i++) {
        var cohorte = i * pct;
        var cohorteSuivante = (i + 1) * pct;
        for (var id in tabPop) {
            if (id >= cohorte && id < cohorteSuivante) {
                oPays1.groupes[tabPop[id]].age = i;
            }
        }
    }
};
repartirAge(tabAllFemmes);
repartirAge(tabAllHommes);

//lancement du temps.
var passerAnnee = function () {
    annee_courante++;
    for (var groupe in oPays1.groupes) {
        oPays1.groupes[groupe].age++;
    }
    var nb_naissance = parseInt(oPays1.population.total * oPays1.population.tn/1000, 10);
    oPays1.population.total = oPays1.population.total + nb_naissance;
    for (var i=0; i < nb_naissance; i++) {
        oPays1.groupes.push({genre:"femme", age:0});
    }
    $("#flux").empty().append("Année courante : " + annee_courante + "<br />" +
        "Population totale : " + lisibilite_nombre(oPays1.population.total * 1000) + " hab" + "<br />" +
        "Nb de naissances en " + (annee_courante - 1) + " : " + lisibilite_nombre(nb_naissance * 1000) + "<br />" +
        "Nombre de cohortes réelles : " + lisibilite_nombre(oPays1.groupes.length) + "<br />" +
        "Deux exemples de cohortes : " +
        "<ul>" +
        "   <li>N°5212 - genre : " + oPays1.groupes[5212].genre + " / age : " + oPays1.groupes[5212].age + "</li>" +
        "   <li>N°49 525 - genre : " + oPays1.groupes[49525].genre + " / age : " + oPays1.groupes[49525].age + "</li>" +
        "</ul>"
    );
    //alert(oPays1.population.total);
};
$(document).ready(function () {
    var tabPaysJouables = ["fr", "es", "uk", "de"];
    for (var idPays in tabPaysJouables) {
        $("#svg2 #" + tabPaysJouables[idPays])
        .css({"fill" : "green", "cursor" : "pointer"})
        .attr("class", "paysJouable");
    }
    $(".paysJouable").mouseover(function () {
        $(this).css({"fill" : "blue"});
    });
    $(".paysJouable").mouseout(function () {
        $(this).css({"fill" : "green"});
    });
    
    
    
    $("body").append('<div id="donnee_fixe">Taux de natalité : <span id="tn">12.6</span> enfants/an pour 1000 habs<input id="aug_alloc" type="button" value="augmenter les allocations familiales" /></div><div id="flux">Démarrage en cours...</div>');
    setInterval(function () {passerAnnee()}, 12000);
    $("#aug_alloc").click(function () {
        oPays1.population.tn = Math.round((oPays1.population.tn + 0.1)*10)/10;
        $("#tn").empty().append(oPays1.population.tn);
    });
    init();
    
});

function lisibilite_nombre(nbr)
{
    var nombre = '' + nbr;
    var retour = '';
    var count=0;
    for(var i=nombre.length-1 ; i>=0 ; i--)
    {
        if(count!==0 && count % 3 === 0)
            retour = nombre[i]+' '+retour ;
        else
            retour = nombre[i]+retour ;
        count++;
    }
    return retour;
}
function init () {
    var socket = io.connect(window.location.origin);
    socket.on('donnees_serveur', function (data) {
        $("#annee-courante").empty().text(data.annee_courante);
        console.log(data.annee_courante);
    });
    $("#button-restart").click(function () {
        socket.emit('relancer');
        console.log("relancer decompte");
    });
}
// alert("Groupe : 4799\n" + 
//  "genre : " + oPays1.groupes[4799].genre + "\n" +
//  "age : " + oPays1.groupes[4799].age);
// alert("Groupe 5000\n" + 
//  "genre : " + oPays1.groupes[5000].genre + "\n" +
//  "age : " + oPays1.groupes[5000].age);
