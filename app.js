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
var LTTOoLS = require('./public/scripts/LTTOoLS');

//**********************************************
//**************** DEBUT IO ********************
//**********************************************
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
  io.set("close timeout", 12);
});


//---------------- DEBUT ANNEE COURANTE ---------------
var iAnneeCourante = 2013;
setInterval(function () {
        iAnneeCourante++;
        io.sockets.emit('iAnneeCourante', iAnneeCourante);
    }, 12000);

//---------------- FIN ANNEE COURANTE ---------------


//---------------- DEBUT PAYS ---------------
var oPays = {
    "fr" : {
        bDisponible : true,
        sNomAvecDetMin : "la France"
    }, 
    "es" : {
        bDisponible : true,
        sNomAvecDetMin : "l'Espagne"
    }, 
    "de" : {
        bDisponible : true,
        sNomAvecDetMin : "l'Allemagne"
    },  
    "uk" : {
        bDisponible : true,
        sNomAvecDetMin : "le Royaume Uni"
    },  
    "it" : {
        bDisponible : true,
        sNomAvecDetMin : "l'Italie"
    }
};  
//---------------- FIN PAYS ----------------


//--------------- DEBUT DONNEES CONNEXION-------------
io.sockets.on('connection', function (socket) {     
    socket.emit('iAnneeCourante', iAnneeCourante);
    socket.emit('oPays', oPays);
    
    socket.on('E_relancer', function () {
        iAnneeCourante = 2013;
        io.sockets.emit('iAnneeCourante', iAnneeCourante);
    });
    
    socket.on('oChoixPays', function (oChoixPays, callback) {
        callback({ bEstDisponible: oPays[oChoixPays.sPaysChoisi].bDisponible });  
        if (oPays[oChoixPays.sPaysChoisi].bDisponible === true) {
            oPays[oChoixPays.sPaysChoisi].bDisponible = false;
            socket.set('sMonPays', oChoixPays.sPaysChoisi);
        }              
    }); 
    
    socket.on('E_rafraichir_pays', function () {
        io.sockets.emit('oPays', oPays);  
        console.log("-> E_rafraichir_pays")
    });
    
    socket.on('B_ecrire_message', function (sMessage) {
        socket.broadcast.emit('sMessage', sMessage); 
        console.log("-> B_ecrire_message : " + sMessage);
    });
    
    
    
    socket.on('disconnect', function () {
        socket.get('sMonPays', function (error, sMonPays) {
            if (sMonPays !== null) {
                oPays[sMonPays].bDisponible = true;
                io.sockets.emit('oPays', oPays);
                socket.broadcast.emit('sMessage', LTTOoLS.oStringHelper.passerPremiereLettreEnMaj(oPays[sMonPays].sNomAvecDetMin) + " est de nouveau Disponible"); 
            }
       });        
    });
});

//--------------- FIN DONNEES CONNEXION-------------
//**********************************************
//***************** FIN IO *********************
//**********************************************






