
/**
 * Module dependencies.
 */


var express = require('express'),
    routes = require('./routes'),
    //gzip = require('connect-gzip'),
    crypto = require('crypto'),
    compressor = require('node-minify'),
    http = require('http'),
    util = require('util'),
    htmlparser = require("htmlparser"),
    fs = require('fs'),
    passport = require('passport'),
    BrowserIDStrategy = require('passport-browserid').Strategy,
    /*
    privateKey = fs.readFileSync('privatekey.pem').toString(),
    certificate = fs.readFileSync('certificate.pem').toString(),
    */
    app = module.exports = express.createServer(/*{key: privateKey, cert: certificate}*/);


passport.serializeUser(function(user, done) {
  done(null, user.email);
});

passport.deserializeUser(function(email, done) {
  done(null, { email: email });
});

persona_audience = "https://otrain.herokuapp.com";

passport.use(new BrowserIDStrategy({
    audience: persona_audience
  },
  function(email, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's email address is returned to
      // represent the logged-in user. In a typical application, you would want
      // to associate the email address with a user record in your database, and
      // return that user instead.

      return done(null, { email: email });
    });
  }
));

// Configuration
var store = new express.session.MemoryStore;

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  //app.use(gzip.gzip());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'keyboard cat', store: store }));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

/*new compressor.minify({
    type: 'uglifyjs',
    fileIn: 'assets/js/next-otrain.js',
    fileOut: 'public/js/next-otrain.min.js',
    callback: function(err) {
      if(err) console.log(err);
    }
});*/


new compressor.minify({
    type: 'uglifyjs',
    fileIn: 'assets/js/time.js',
    fileOut: 'public/js/time.min.js',
    callback: function(err) {
      if(err) console.log(err);
    }
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes


app.get('/', routes.index);
app.get('/times.json', routes.times);
app.get('/time.html*', routes.time);
app.post('/login', passport.authenticate('browserid', { /*failureRedirect: '/login'*/ }), routes.login);
app.get('/logout', routes.logout);
var stations = [];

getStations = function() {
  return stations;
};

// direction is an integer (1 or 2)

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

function createFile(filename, dow) {
  var array = [];
  downloadStations(1, dow, function(times) {
    if(times) {
      console.log("times: " + times.toString());
      array.push(times);
      downloadStations(2, dow, function(times2) {
        if(times2) {
          if(times == times2) {
            console.log("EQUAL!!!");
          }
          console.log("times2: " +times2.toString());
          array.push(times2);
          array = JSON.stringify(array);
          //save the times to a file
          fs.writeFile(filename, array, function(err) {
              if(err) {
                  console.log(err);
              } else {
                  console.log("The times were saved to " + filename);
              }
          });
        }
      });
    }
  });
}

// Re-download all the files
// *** Be careful because sometimes the 
// octranspo server returns the same 
// time for different directions ***

//createFile('./times-sunday', 3);
//createFile('./times-saturday', 2);
//createFile('./times-weekday', 1);

//build stations as [weekday, saturday, sunday]
var port = process.env.PORT || 5000;

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
            app.listen(port, function() {
              console.log("Listening on " + port);
            });
          }
        });
      }
    });
  }
});
