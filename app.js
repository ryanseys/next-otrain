
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');
  
var http = require('http');
var util = require('util');
var htmlparser = require("htmlparser");
var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

var stations = [];

getStations = function() {
  return stations;
}

var today = new Date();
var options = {
  host: 'www.octranspo1.com',
  port: 80,
  path: '/route/printRoute?selectRoute=750&year='+today.getFullYear()+'&month='+today.getMonth()+'&day='+today.getDate()+'&from_site=yes&direction=1&dow=2'
};
var doc = [];

var req = http.request(options, function(res) {
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    doc.push(chunk);
  });
  res.on('end', function(){
    var rawHTML = doc.join('');
    var handler = new htmlparser.DefaultHandler(function (error, dom) {
        if (error) console.log("ERROR!");
    });
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(rawHTML);
    var times = handler.dom[2].children[3].children[8].children[1].children;
    var num_rows = times.length;
    var num_cols = times[0].children.length - 1;
    for(var j = 0; j < num_cols; j++) {
      for(var i = 0; i < num_rows; i++) {
        if(stations[j]) stations[j].push(times[i].children[j].children[0].data);
        else stations[j] = [times[i].children[j].children[0].data];
      }
    }
    stations = JSON.stringify(stations);
    app.listen(3000, function(){
      console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
    });
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body
req.write('data\n');
req.end();