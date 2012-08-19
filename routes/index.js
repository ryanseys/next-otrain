/*
 * GET home page.
 */
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