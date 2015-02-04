/**
 * Module dependencies.
 */

require('node-jsx').install()

var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var React = require('react');
var Router = require('react-router');
var request = require('request');
var API = require('../assets/js/API');
var Routes = require('../assets/js/Routes.jsx');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
//app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(bodyParser());
//app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, '../public')));

// development only
if ('development' == app.get('env')) {
  //app.use(express.errorHandler());
}

var API_URL = "http://localhost:5000/api";

// JSX components

//var Popular = React.createFactory(require('../assets/js/components/Popular.jsx'));
// latest, search, detail
// we also want to render to JSON

app.use("/api", function(req, res) {
  var url = API_URL + req.url;
  req.pipe(request(url)).pipe(res);
});


app.get("/", function(req, res){
    API.getPhotos("votes", 1, function(data){

        Router.run(Routes, req.url, function(Handler, state) {
            var markup = React.renderToString(Handler({photos: data}));
            res.render("index", {
              markup: markup,
              data: JSON.stringify(data)
            });
        });

    }, "http://localhost:5000");
});

//app.get('/', routes.index);
//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});