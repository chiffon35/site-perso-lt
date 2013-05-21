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
var PS = require('./public/scripts/PS');

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
var oPaysLight = {};

oPays.es = new PS.Pays("es",
    true,
    "l'Espagne",
    {
        iTotalEnK : 65000,
        fPctHomme : 48/100,
        fTauxNatalite : 12.6
    }
);
oPays.de = new PS.Pays("de",
    true,
    "l'Allemagne",
    {
        iTotalEnK : 65000,
        fPctHomme : 48/100,
        fTauxNatalite : 12.6
    }
);
oPays.uk = new PS.Pays("uk",
    true,
    "le Royaume-Uni",
    {
        iTotalEnK : 65000,
        fPctHomme : 48/100,
        fTauxNatalite : 12.6
    }
);
oPays.it = new PS.Pays("it",
    true,
    "l'Italie",
    {
        iTotalEnK : 65000,
        fPctHomme : 48/100,
        fTauxNatalite : 12.6
    }
);    

oPays.fr = new PS.Pays("fr", 
    true, 
    "la France", 
    {
        iTotalEnK : 65000,
        fPctHomme : 48/100,
        fTauxNatalite : 12.6
    }
);

 
//---------------- FIN PAYS ----------------

//---------------- DEBUT ANNEE COURANTE ---------------
var iAnneeCourante = 2013;
//---------------- FIN ANNEE COURANTE ---------------

//--------------- DEBUT CHANGEMENT D'ANNEE-------------
setInterval(function () {
        iAnneeCourante++;        
        io.sockets.emit('iAnneeCourante', iAnneeCourante);
    }, 12000);
//--------------- FIN CHANGEMENT D'ANNEE-------------



//--------------- DEBUT DONNEES CONNEXION-------------
io.sockets.on('connection', function (socket) {     
    socket.emit('iAnneeCourante', iAnneeCourante); 
    
    //Emit Pays light
    for (var sPays in oPays) {
        oPaysLight[sPays] = oPays[sPays].obtenirVersionLegere1();       
    }
    socket.emit('oPays', oPaysLight);
    
    socket.on('E_relancer', function () {
        iAnneeCourante = 2013;
        for (var sPays in oPays) {
            oPays[sPays].bDisponible = true;
        }
        io.sockets.emit('iAnneeCourante', iAnneeCourante);
        
        //Emit Pays light
        for (var sPays in oPays) {
            oPaysLight[sPays] = oPays[sPays].obtenirVersionLegere1();       
        }
        io.sockets.emit('oPays', oPaysLight);
        
        socket.emit('sMessage', "Vous avez relancé la partie");
        socket.broadcast.emit('sMessage', "Un joueur a relancé la partie"); 
        io.sockets.emit('ES_Supprimer_Ministeres');
    });
    
    socket.on('oChoixPays', function (oChoixPays, callback) {
        callback({ bEstDisponible: oPays[oChoixPays.sPaysChoisi].bDisponible });  
        if (oPays[oChoixPays.sPaysChoisi].bDisponible === true) {
            oPays[oChoixPays.sPaysChoisi].bDisponible = false;
            socket.set('sMonPays', oChoixPays.sPaysChoisi);
            
            //Emit Pays light
            for (var sPays in oPays) {
                oPaysLight[sPays] = oPays[sPays].obtenirVersionLegere1();       
            }
            socket.emit('ES_Creer_Ministeres', oPaysLight[oChoixPays.sPaysChoisi]);
        }              
    }); 
    
    socket.on('E_rafraichir_pays', function () {
        
        //Emit Pays light
        for (var sPays in oPays) {
            oPaysLight[sPays] = oPays[sPays].obtenirVersionLegere1();       
        }
        io.sockets.emit('oPays', oPaysLight);  
        
        console.log("-> E_rafraichir_pays");
    });
    
    socket.on('B_ecrire_message', function (sMessage) {
        socket.broadcast.emit('sMessage', sMessage); 
        console.log("-> B_ecrire_message : " + sMessage);
    });
    
    
    
    socket.on('disconnect', function () {
        socket.get('sMonPays', function (error, sMonPays) {
            if (sMonPays !== null) {
                oPays[sMonPays].bDisponible = true;
                
                //Emit Pays light
                for (var sPays in oPays) {
                oPaysLight[sPays] = oPays[sPays].obtenirVersionLegere1();       
                }
                io.sockets.emit('oPays', oPaysLight);
                
                socket.broadcast.emit('sMessage', LTTOoLS.oStringHelper.passerPremiereLettreEnMaj(oPays[sMonPays].sNomAvecDetMin) + " est de nouveau Disponible"); 
            }
       });        
    });
});

//--------------- FIN DONNEES CONNEXION-------------
//**********************************************
//***************** FIN IO *********************
//**********************************************






