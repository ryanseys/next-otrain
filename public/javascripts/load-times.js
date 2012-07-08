var data = JSON.parse(document.getElementById("times").value);
var names = ["GREENBORO", "CONFEDERATION", "CARLETON", "CARLING", "BAYVIEW"];
var station;
var station_name;
var current_direction = 1; //default
var current_location;

function startTime() {
  getNextTime();
  t=setTimeout('startTime()', 500);
}

function setLocation(station_index) {
  current_location = parseInt(station_index, 10);
  if(current_direction == 1) {
    station = data[current_direction-1][current_location];
    station_name = names[current_location];
  }
  else {
    station = data[current_direction-1][names.length-1-current_location];
    station_name = names[current_location];
  }
  getNextTime();
}

function getNextTime() {
  if(!station_name) station_name = "Choose a station ";
  if(station) {
    var now = new Date();
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
    
    document.getElementById('next').innerHTML += " in " + hour_diff + "h:" + min_diff + "m:" + sec_diff+"s";
  }
  else console.log("No station found");
}

function toggleDirection() {
  if(current_direction == 1) {
    current_direction = 2;
    $(".arrows").removeClass('icon-arrow-down').addClass('icon-arrow-up');
  }
  else {
    current_direction = 1;
    $(".arrows").removeClass('icon-arrow-up').addClass('icon-arrow-down');
  }
  setLocation(current_location);
  $("#location" + current_location).select();
}