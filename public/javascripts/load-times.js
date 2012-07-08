var data = JSON.parse(document.getElementById("times").value);
var names = ["Greenboro", "Confederation", "Carleton", "Carling", "Bayview"];
var station;
var station_name;
var current_direction = 1;
var current_location;

function startTime() {
  var today=new Date();
  var h=today.getHours();
  var m=today.getMinutes();
  var s=today.getSeconds();
  // add a zero in front of numbers<10
  m=checkTime(m);
  s=checkTime(s);
  document.getElementById('time').innerHTML="It's currently "+h+":"+m+":"+s;
  getNextTime();
  t=setTimeout('startTime()', 500);
}

function checkTime(i) {
  if (i<10) {
    i="0" + i;
  }
  return i;
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
      if(arrival_h < h_now) {
        best_match = arrival_time;
      }
      else if(arrival_h == h_now) {
        if(arrival_m < m_now) {
          best_match = arrival_time;
        }
        else if(arrival_m == m_now) {
          best_match = arrival_time;
        }
        else {
          best_match = arrival_time;
          break;
        }
      }
      else {
        best_match = arrival_time;
        break;
      }
    }
    if(!best_match) console.log("best match not found!");
    document.getElementById('next').innerHTML = "Next departure from "+ station_name + " is at " + best_match.join(':');
    var message = '';
    var min_diff;
    var hour_diff;
    var sec_diff;
    
    if(s_now == 0) {
      sec_diff = 0;
      min_diff = best_match[1] - m_now;
      hour_diff = best_match[0] - h_now;
    }
    else {
      sec_diff = 60 - s_now;
      min_diff = best_match[1] - m_now - 1;
      hour_diff = best_match[0] - h_now;
      if(min_diff < 0) {
        min_diff = 60 + min_diff;
        hour_diff = best_match[0] - h_now - 1;
      }
    }
    document.getElementById('next').innerHTML += " in " + hour_diff + "h:" + min_diff + "m:" + sec_diff+"s";
  }
  else console.log("No station found");
}

function toggleDirection() {
  if(current_direction == 1) {
    current_direction = 2;
    $(".arrows").removeClass('icon-arrow-down').addClass('icon-arrow-up');
    //$("#bottom-icon").removeClass('icon-minus-sign');
    //$("#top-icon").addClass('icon-minus-sign');
  }
  else {
    current_direction = 1;
    $(".arrows").removeClass('icon-arrow-up').addClass('icon-arrow-down');
    //$("#top-icon").removeClass('icon-minus-sign');
    //$("#bottom-icon").addClass('icon-minus-sign');
  }
  setLocation(current_location);
}