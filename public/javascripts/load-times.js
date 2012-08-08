var data = JSON.parse(document.getElementById("times").value);
var names = ["GREENBORO", "CONFEDERATION", "CARLETON", "CARLING", "BAYVIEW"];
var station;
var station_name;
var current_direction = 0; //default
var current_location;
var dow;

function startTime() {
  getNextTime();
  setTimeout('startTime()', 500);
}

function setLocation(station_index) {
  var day;
  
  if(!dow) dow = (new Date()).getDay();
  
  if(dow == 0) day = 2;
  else if(dow == 6) day = 1;
  else day = 0;
  
  current_location = station_index;
  if(current_direction == 0) {
    station = data[day][current_direction][current_location];
    station_name = names[current_location];
  }
  else {
    station = data[day][current_direction][names.length-1-current_location];
    station_name = names[current_location];
  }
  getNextTime();
}

function getNextTime() {
  if(!station_name) station_name = "Choose a station ";
  if(station) {
    var now = new Date();
    var d = now.getDay();
    if(d != dow) {
      dow = d;
      setLocation(current_location);
    }
    
    var h_now = now.getHours();
    var m_now = now.getMinutes();
    var s_now = now.getSeconds();
    var times = station;
    var len = times.length;
    var best_match;
    for(var j = 0; j < len; j++) {
      var arrival_time = times[j].split(':');
      var arrival_h = parseInt(arrival_time[0], 10);
      var arrival_m = parseInt(arrival_time[1], 10);
      best_match = arrival_time;
      if(arrival_h > h_now) break; //if the hour is later than the current hour
      //if the minute is later than the current minute in the current hour
      else if((arrival_h == h_now) && (arrival_m > m_now)) break;
    }
    if(!best_match) console.log("best match not found!");
    document.getElementById('next').innerHTML = "Next "+"<i class='icon-time'></i>"+"Train at " + best_match.join(':');
    var message = '';
    var min_diff = best_match[1] - m_now - 1;
    var hour_diff = best_match[0] - h_now;
    var sec_diff = 60 - s_now;
    if(sec_diff == 60) {
      sec_diff = 0;
      min_diff++;
    }
    if(min_diff < 0) {
      min_diff += 60;
      hour_diff--;
    }
    document.getElementById('next').innerHTML += " in " + hour_diff + "h:" + min_diff + "m:" + sec_diff + "s";
  }
}

function toggleDirection() {
  if(current_direction == 0) {
    current_direction = 1;
    $(".arrows").removeClass('icon-arrow-down').addClass('icon-arrow-up');
  }
  else {
    current_direction = 0;
    $(".arrows").removeClass('icon-arrow-up').addClass('icon-arrow-down');
  }
  setLocation(current_location);
  $("#location" + current_location).select();
}