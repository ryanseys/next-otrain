/*
 * GET home page.
 */

exports.index = function(req, res) {
  res.render('index', { title: 'Next OTrain', stations: getStations() });
};

exports.times = function(req, res) {
  res.send(getStations());
};