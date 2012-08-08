
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');
  
var http = require('http');
var util = require('util');
var htmlparser = require("htmlparser");
var app = module.exports = express.createServer();
var fs = require('fs');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express['static'](__dirname + '/public'));
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
};

// direction is an integer (1 or 2)
// 1 :: Greenboro ---> Bayview
// 2 :: Greenboro <--- Bayview

// dow (day of week) is an integer (1, 2 or 3)
// 1 :: Weekday
// 2 :: Saturday
// 3 :: Sunday
var downloadStations = function(direction, dow, callback) {
  var options = {
    host: 'www.octranspo1.com',
    port: 80,
    path: '/route/printRoute?selectRoute=750&from_site=yes&direction='+direction+'&dow='+dow
  };
  var doc = [];
  var temp_stations = [];
  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      doc.push(chunk);
    });
    res.on('end', function() {
      var rawHTML = doc.join('');
      var handler = new htmlparser.DefaultHandler(function (error, dom) {
          if (error) console.log("ERROR!");
      });
      var parser = new htmlparser.Parser(handler);
      parser.parseComplete(rawHTML);
      try {
        var times = handler.dom[2].children[3].children[8].children[1].children;
        var num_rows = times.length;
        var num_cols = times[0].children.length - 1;
        for(var j = 0; j < num_cols; j++) {
          for(var i = 0; i < num_rows; i++) {
            if(temp_stations[j]) temp_stations[j].push(times[i].children[j].children[0].data);
            else temp_stations[j] = [times[i].children[j].children[0].data];
          }
        }
        callback(temp_stations);
      }
      catch(err) {
        console.log('An error occurred. Could not process! ERROR: ' + err);
        callback(null);
      }
    });
  });
  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });
  // write data to request body
  req.write('data\n');
  req.end();
};

/*
var filename = "./times-sunday";

downloadStations(1, 3, function(times) {
  if(times) {
    stations.push(times);
    downloadStations(2, 3, function(times) {
      if(times) {
        stations.push(times);
        stations = JSON.stringify(stations);
        //save the times to a file
        fs.writeFile(filename, stations, function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("The times were saved to " + filename);
            }
        });
        app.listen(3001, function() {
          console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
        });
      }
    });
  }
});

*/

//build stations as [weekday, saturday, sunday]

fs.readFile('./times-weekday', 'utf8', function (err, data) {
  if (err) throw err;
  else {
    stations.push(JSON.parse(data));
    fs.readFile('./times-saturday', 'utf8', function (err, data) {
      if (err) throw err;
      else {
        stations.push(JSON.parse(data));
        fs.readFile('./times-sunday', 'utf8', function (err, data) {
          if (err) throw err;
          else {
            stations.push(JSON.parse(data));
            stations = JSON.stringify(stations);
            app.listen(3001, function() {
              console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
            });
          }
        });
      }
    });
  }
});