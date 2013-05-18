//Modules node
var express = require('express')
  , routes = require('./routes')
  //, user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , i18n = require('i18next')
  , stylus = require('stylus');

//Modules perso
//var LTTOoLS = require('./LTTOoLS');

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
app.get('/test', routes.test);
//app.get('/users', user.list);

app.use(require("stylus").middleware(__dirname + '/public'));


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
