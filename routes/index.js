
/*
 * GET home page.
 */

exports.index = function(req, res) {
  res.render('index', { title: 'Next O-Train', stations: getStations(), location: 1 });
};