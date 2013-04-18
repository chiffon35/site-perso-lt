
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , i18n = require('i18next')
  , stylus = require('stylus');
  
var LTTOoLS = require('./LTTOoLS');

var app = express();
i18n.init({ detectLngFromPath: 0 });

// all environments
app.use(i18n.handle);
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

i18n.registerAppHelper(app);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


//LANGUE COURANTE
var langue = "fr";
app.get(/^\/en\/.*/, function (req, res, next) {
    if (req.locale) {
        langue = req.locale;
    }
    next();
});

//ACCUEIL
app.get('/', function (req, res) {
    res.redirect('/fr/accueil');
});
app.get('/fr/accueil', routes.index);
app.get('/en/home', routes.index);


app.get('/users', user.list);

app.use(stylus.middleware({
    src: __dirname + '/public',
    compile: function (str, path) {
        var mylib = function(style) {
            style.define('langueCourante', function () {
               return new stylus.nodes.Literal(langue);
            });
        };
        return stylus(str).use(mylib);
    }
}));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
