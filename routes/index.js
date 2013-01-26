/*
 * GET home page.
 */

var https = require('https');
var s = ['Greenboro', 'Confederation', 'Carleton', 'Carling', 'Bayview'];

exports.index = function (req, res) {
  res.render('index', { title: 'Next OTrain', user: req.session.email, fav : req.cookies['fav'] || null});
};

exports.times = function (req, res) {
  res.send(getStations());
};

exports.time = function (req, res) {
  var id = req.query.s || 0; //station
  var d = req.query.d || 0; //direction
  res.render('time', { title: 'Next OTrain', id: id, d : d, station: s[id] });
};

exports.logout = function (req, res) {
  req.session.destroy();
  req.logout();
  res.redirect('/');
};

exports.login = function (req, res) {
  req.session.email = req.user.email;
  res.redirect('/');
};

exports.fav = function (req, res) {
  res.cookie('fav', req.body.fav);
  res.send('good');
};
