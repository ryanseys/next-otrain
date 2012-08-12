var data;

//get times
$.get(
    "times.json",
    function(json) {
       data = JSON.parse(json);
    }
);

var stns = ["GREENBORO", "CONFEDERATION", "CARLETON", "CARLING", "BAYVIEW"]; //station names
var stn; //station id
var stn_n; //current station name
var dir = 0; //current direction (0 or 1)
var loc; //current location
var dow; //day of the week (0 to 6)
var day;

function startTime() {
  setLocation(loc);
  setTimeout('startTime()', 500);
}

function setDOW(now) {
  dow = now;
  if(dow == 0) day = 2; //sunday
  else if(dow == 6) day = 1; //saturday
  else day = 0; // monday to friday
}

function setLocation(stn_i) {
  $('.alert-info').removeClass('alert-info');
  $("#location" + stn_i).addClass('alert-info');
  //change dow
  setDOW((new Date()).getDay());
  
  loc = stn_i;
  if(dir == 0) { //first direction
    stn = data[day][dir][loc];
  }
  else { //second direction
    stn = data[day][dir][stns.length-1-loc];
  }
  stn_n = stns[loc];
  getNextTime();
}

function getNextTime() {
  if(!stn_n) stn_n = "Choose a station ";
  if(stn) {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var s = now.getSeconds();
    
    var times = stn;
    var len = times.length;
    var best_match;
    for(var j = 0; j < len; j++) {
      var arrival_time = times[j].split(':');
      var arrival_h = parseInt(arrival_time[0], 10);
      var arrival_m = parseInt(arrival_time[1], 10);
      best_match = arrival_time;
      if(arrival_h > h) break; //if the hour is later than the current hour
      //if the minute is later than the current minute in the current hour
      else if((arrival_h == h) && (arrival_m > m)) break;
    }
    if(((best_match[0] == h) && (best_match[1] <= m)) || (best_match[0] < h)) {
      //end of day
      var day;
      if(dow == 6) day = 2; //its saturday, next day is sunday (2)
      else if (dow == 5) day = 1; //its friday, next day is sat (1)
      else day = 0; //its sunday thru thursday (0)
      
      if(dir == 0) { //first direction
        best_match = data[day][dir][loc][0].split(':');
      }
      else { //second direction
        best_match = data[day][dir][stns.length-1-loc][0].split(':');
      }
    }
    document.getElementById('next').innerHTML = "Next "+"<i class='icon-time'></i>"+"Train at " + best_match.join(':');
    var diff = getTimeDifference(h, m, s, best_match[0], best_match[1], 0);
    document.getElementById('next').innerHTML += " in " + diff[0] + "h:" + diff[1] + "m:" + diff[2] + "s";
  }
}

function getTimeDifference(hi, mi, si, hf, mf, sf) {
  var hd, md, sd;
  //set up
  hf = hf==0 ? 24 : hf; // 00:00 becomes 24:00
  hi = hi==0 ? 24 : hi; // ""
  
  hd = hf-hi;
  md = mf-mi;
  sd = sf-si;
  
  //adjust minute
  md = sd<0 ? md-1 : md;
  sd = mf-mi-1 == md ? 60+sd : sd; //reset second
  
  //adjust hour
  hd = md<0 ? hd-1 : hd;
  md = hf-hi-1 == hd ? 60+md : md;
  hd = hd<0 ? 24+hd : hd;
  return [hd, md, sd];
}

function toggleDirection() {
  if(dir == 0) {
    dir = 1;
    $(".arrows").removeClass('icon-arrow-down').addClass('icon-arrow-up');
  }
  else {
    dir = 0;
    $(".arrows").removeClass('icon-arrow-up').addClass('icon-arrow-down');
  }
  setLocation(loc);
  $("#location" + loc).select();
}

//uservoice feedback
var uvOptions = {};
(function() {
  var uv = document.createElement('script'); uv.type = 'text/javascript'; uv.async = true;
  uv.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'widget.uservoice.com/9XBoblHGevZr739GvY1dPQ.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(uv, s);
})();

//google analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-33989135-1']);
_gaq.push(['_trackPageview']);
(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

// When ready...
window.addEventListener("load", function() {
  // Set a timeout...
  setTimeout(function() {
    // Hide the address bar!
    window.scrollTo(0, 1);
  }, 0);
});