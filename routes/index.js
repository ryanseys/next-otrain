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

exports.fav = function (req, res) {
  res.cookie('fav', req.body.fav);
  res.send('good');
};
