var data = JSON.parse(document.getElementById("times").value); //times
var stns = ["GREENBORO", "CONFEDERATION", "CARLETON", "CARLING", "BAYVIEW"]; //station names
var stn; //station id
var stn_n; //current station name
var dir = 0; //current direction (0 or 1)
var loc; //current location
var dow; //day of the week (0 to 6)

function startTime() {
  getNextTime();
  setTimeout('startTime()', 500);
}

function setLocation(stn_i) {
  var day;
  
  if(!dow) dow = (new Date()).getDay();
  
  if(dow == 0) day = 2;
  else if(dow == 6) day = 1;
  else day = 0;
  
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
    var d = now.getDay();
    if(d != dow) {
      dow = d;
      setLocation(loc);
    }
    
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
    if(!best_match) console.log("best match not found!");
    document.getElementById('next').innerHTML = "Next "+"<i class='icon-time'></i>"+"Train at " + best_match.join(':');
    var message = '';
    var md = best_match[1] - m - 1;
    var hd = best_match[0] - h;
    var sd = 60 - s;
    if(sd == 60) {
      sd = 0;
      md++;
    }
    if(md < 0) {
      md += 60;
      hd--;
    }
    document.getElementById('next').innerHTML += " in " + hd + "h:" + md + "m:" + sd + "s";
  }
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