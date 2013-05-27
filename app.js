//debug version
//Modules node
var express = require('express')
  , routes = require('./routes')
  //, user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , i18n = require('i18next')
  , stylus = require('stylus');



//Configuration Express
var app = express();
i18n.init({ detectLngFromPath: 0 });
app.use(i18n.handle);
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
//app.use(express.cookieParser('your secret here'));
//app.use(express.session());
app.use(app.router);
i18n.registerAppHelper(app);
app.use(express.static(path.join(__dirname, 'public')));

//Erreurs
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Namespace
var SITEPERSO_LT = SITEPERSO_LT || {};

//Langue courante
SITEPERSO_LT.langue_courante = "fr";
app.get(/^\/en\/.*/, function (req, res, next) {
    if (req.locale) {
        SITEPERSO_LT.langue_courante = req.locale;        
    }
    next();
});

//ACCUEIL
app.get('/', function (req, res) {
    res.redirect('/fr/accueil');
});
app.get('/fr/accueil', routes.index);
app.get('/en/home', routes.index);
app.get('/fr/blog', routes.blog);
app.get('/en/blog', routes.blog);
app.get('/fr/cv', routes.cv);
app.get('/en/cv', routes.cv);
app.get('/interfaceps', routes.interfaceps);
//app.get('/users', user.list);

app.use(require("stylus").middleware(__dirname + '/public'));


var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(app.get('port'), function(){
  console.log('-------Express server listening on port ' + app.get('port') + '---------');
});

//Modules perso
var PS = require('./public/scripts/PS');
var LTTOoLS = require('./public/scripts/LTTOoLS');

//**********************************************
//**************** DEBUT IO ********************
//**********************************************
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
  io.set("close timeout", 12);
});


//---------------- DEBUT PAYS ---------------

//base départ
var oPays = {}; 
var enregistrerPaysDeDepart = function () {
    oPays = {};
    // oPays.es = new PS.Pays("es",
    //     true,
    //     "l'Espagne",
    //     [
    //         65000, 
    //         48/100,
    //         12.6, 
    //         8.5,
    //         3.7,
    //         {
    //             iNatalite : 3
    //         }
    //     ],
    //     300000
    // );
    // oPays.de = new PS.Pays("de",
    //     true,
    //     "l'Allemagne",
    //     [65000,48/100,12.6, 8.5],
    //     300000
    // );
    // oPays.uk = new PS.Pays("uk",
    //     true,
    //     "le Royaume-Uni",
    //     [65000,48/100,12.6, 8.5],
    //     300000
    // );
    // oPays.it = new PS.Pays("it",
    //     true,
    //     "l'Italie",
    //     [65000,48/100,12.6, 8.5],
    //     300000
    // );    
    
    oPays.fr = new PS.Pays(
        {
            sId : "fr", 
            bDisponible : true, 
            sNomAvecDetMin :"la France",
            oMinisteres : {
                oPopulation : 
                {
                    oResume : 
                    {
                        iTotalEnK :65000,
                        fPctHomme : 0.48,
                        fTauxMortalite : 8.5                        
                    },
                    oNatalite : 
                    {
                        fTauxMortaliteInfantile : 3.5,
                        iOpinionNatalite : 2,
                        iPrestationFamiliale : 2,
                        iContraception: 2,
                        iAvortement : 2,  
                        iSalaireParental: 0,
                        iPlacesEnCreches: 1,
                        iProgrammeScolaire :0
                    }
                }
            },
            iRecette : 300000
        }
    );
};
enregistrerPaysDeDepart();
//console.log("Nombre de femme en France :" + oPays.fr.obtenirNbParGenre("femme"));
//console.log("Nombre de personne de 80 ans en France :" + oPays.fr.obtenirNbParAge(80));

 
//---------------- FIN PAYS ----------------

//---------------- DEBUT ANNEE COURANTE ---------------
var iAnneeCourante = 2013;
//---------------- FIN ANNEE COURANTE ---------------

//--------------- DEBUT CHANGEMENT D'ANNEE-------------
setInterval(function () {
        passerAnnee(oPays)
    }, 60000);
    
//lancement du temps.
var passerAnnee = function () {
    iAnneeCourante++;
    io.sockets.emit('iAnneeCourante', iAnneeCourante);
    
    for (var sPays in oPays) {
        oPays[sPays].faireEvoluerPopulation(PS.Pays.oGenres);
        if (typeof oPays[sPays].oPossesseur.id !== "undefined") {
            oPays[sPays].oPossesseur.emit('ES_Rafraichir_Ministeres', oPays[sPays].oMinisteres);
        }
        //console.log(sPays + " a évolué");
    }
    
   
    // $("#flux").empty().append("Année courante : " + annee_courante + "<br />" +
    //     "Population totale : " + LTTOoLS.oNumberHelper.afficherMilliers(oPays1.population.total * 1000) + " hab" + "<br />" +
    //     "Nb de naissances en " + (annee_courante - 1) + " : " + LTTOoLS.oNumberHelper.afficherMilliers(nb_naissance * 1000) + "<br />" +
    //     "Nombre de cohortes réelles : " + LTTOoLS.oNumberHelper.afficherMilliers(oPays1.groupes.length) + "<br />" +
    //     "Deux exemples de cohortes : " +
    //     "<ul>" +
    //     "   <li>N°5212 - genre : " + oPays1.groupes[5212].genre + " / age : " + oPays1.groupes[5212].age + "</li>" +
    //     "   <li>N°49 525 - genre : " + oPays1.groupes[49525].genre + " / age : " + oPays1.groupes[49525].age + "</li>" +
    //     "</ul>"
    // );
    //alert(oPays1.population.total);

};   
    
    
//--------------- FIN CHANGEMENT D'ANNEE-------------



//--------------- DEBUT DONNEES CONNEXION-------------
io.sockets.on('connection', function (socket) {     
    socket.emit('iAnneeCourante', iAnneeCourante); 
    
    //Emit Pays light
    socket.emit('oPays', PS.Pays.oPaysVersionLegere);
    
    socket.on('E_relancer', function () {
        iAnneeCourante = 2013;
        enregistrerPaysDeDepart();
        io.sockets.emit('iAnneeCourante', iAnneeCourante);
        io.sockets.emit('oPays', PS.Pays.oPaysVersionLegere);        
        socket.emit('sMessage', "Vous avez relancé la partie");
        socket.broadcast.emit('sMessage', "Un joueur a relancé la partie"); 
        io.sockets.emit('ES_Supprimer_Ministeres');
    });
    
    socket.on('oChoixPays', function (oChoixPays, callback) {
        callback({ bEstDisponible: oPays[oChoixPays.sPaysChoisi].bDisponible });  
        if (oPays[oChoixPays.sPaysChoisi].estDisponible) {
            oPays[oChoixPays.sPaysChoisi].modifierDisponibilite(false);
            socket.set('sMonPays', oChoixPays.sPaysChoisi);
            oPays[oChoixPays.sPaysChoisi].oPossesseur = socket;
            socket.emit('ES_Creer_Ministeres', oPays[oChoixPays.sPaysChoisi].oMinisteres);
        }              
    }); 
    
    socket.on('E_rafraichir_pays', function () {        
        io.sockets.emit('oPays', PS.Pays.oPaysVersionLegere);        
        //console.log("-> E_rafraichir_pays");
    });
    
    socket.on('B_ecrire_message', function (sMessage) {
        socket.broadcast.emit('sMessage', sMessage); 
        //console.log("-> B_ecrire_message : " + sMessage);
    });
    
    socket.on('disconnect', function () {
        socket.get('sMonPays', function (error, sMonPays) {
            if (sMonPays !== null) {
                oPays[sMonPays].modifierDisponibilite(true);
                io.sockets.emit('oPays', PS.Pays.oPaysVersionLegere);                
                socket.broadcast.emit('sMessage', LTTOoLS.oStringHelper.passerPremiereLettreEnMaj(oPays[sMonPays].sNomAvecDetMin) + " est de nouveau Disponible"); 
            }
       });        
    });
});

//--------------- FIN DONNEES CONNEXION-------------
//**********************************************
//***************** FIN IO *********************
//**********************************************






