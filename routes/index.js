/*
 * GET home page.
 */

var https = require('https');
var s = ['Greenboro', 'Confederation', 'Carleton', 'Carling', 'Bayview'];

exports.index = function(req, res) {
  res.render('index', { title: 'Next OTrain' });
};

exports.times = function(req, res) {
  res.send(getStations());
};

exports.time = function(req, res) {
  var id = req.query.s || 0; //station
  var d = req.query.d || 0; //direction
  res.render('time', { title: 'Next OTrain', id: id, d : d, station: s[id] });
};

exports.login = function(req, res) {
  console.log(req);
  var options = {
    hostname: 'verifier.login.persona.org',
    port: 80,
    path: '/verify',
    method: 'POST'
  };

  var request = https.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
  });

  request.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  data = {'assertion': req.body.assertion, 'audience': 'https://otrain.herokuapp.com:443'}

  // write data to request body
  request.write(JSON.stringify(data));
  request.end();
}
