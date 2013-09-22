/*
 * GET home page.
 */
var s = ['Greenboro', 'Confederation', 'Carleton', 'Carling', 'Bayview'];

exports.index = function (req, res) {
  res.render('index', { title: 'Next OTrain' });
};

exports.times = function (req, res) {
  res.send(getStations());
};
