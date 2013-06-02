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
app.use(require("stylus").middleware(__dirname + '/public'));
var server = http.createServer(app);

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


var io = require('socket.io').listen(server);
io.configure(function () { 
    io.set("transports", ["xhr-polling"]); 
    io.set("polling duration", 10);
    io.set("log level", 0);
});

server.listen(app.get('port'), function(){
  console.log('-------Express server listening on port ' + app.get('port') + '---------');
});

app.get('/interfaceps',  function(req, res){
    res.render('ps/interfaceps', {});
    //Modules perso
    var PS = require('./public/scripts/PS');
    var LTTOoLS = require('./public/scripts/LTTOoLS');
    
    //---------------- DEBUT PAYS ---------------    
    //base départ
    var oPays = {};
    var enregistrerPaysDeDepart = function () {
        var oPaysDepart = require("./public/scripts/PS/object/oPaysDepart.js");
        for (var sIdPaysDepart in oPaysDepart) {
            oPays[sIdPaysDepart] = new PS.Pays(oPaysDepart[sIdPaysDepart]);
        }
    };
    enregistrerPaysDeDepart();
    //---------------- FIN PAYS ----------------
    
    
    //---------------- DEBUT ANNEE COURANTE ---------------
    var iAnneeCourante = 2013;
    //---------------- FIN ANNEE COURANTE ---------------
    
    
    //--------------- DEBUT CHANGEMENT D'ANNEE-------------
    setInterval(function () { passerAnnee(oPays); }, 30000);
    var passerAnnee = function () {
        iAnneeCourante++;
        io.sockets.emit('iAnneeCourante', iAnneeCourante);    
        for (var sPays in oPays) {
            oPays[sPays].faireEvoluerPopulation(PS.Pays.oGenres);        
            if (typeof oPays[sPays].oPossesseur.id !== "undefined") {            
                oPays[sPays].oPossesseur.emit('ES_Rafraichir_Ministeres', oPays[sPays].oMinisteres);
            }
        }
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
        
        socket.on('E_modifier_MP_Natalite', function (oCommande) {
           socket.get('sMonPays', function (error, sMonPays) {
                //console.log("-->socket.get('monPays') = " + sMonPays);
                if (sMonPays !== null) {
                    oPays[sMonPays].oMinisteres.oPopulation.oNatalite[oCommande.sName] = parseInt(oCommande.iValeur, 10);
                    oPays[sMonPays].recalculerNatalite();
                    //console.log(oPays[sMonPays].oMinisteres);
                    //console.log(oPays[sMonPays].oMinisteres.oPopulation.oNatalite[oCommande.sName]);
                    socket.emit('ES_Rafraichir_Ministeres', oPays[sMonPays].oMinisteres);
                }
           });
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

});







