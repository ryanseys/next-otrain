var data = JSON.parse(document.getElementById("times").value);
var names = ["Greenboro", "Confederation", "Carleton", "Carling", "Bayview"];
var station;
var station_name;

function setLocation(i) {
  station = data[i];
  station_name = names[i];
  getNextTime();
}

function getNextTime() {
  if(!station_name) station_name = "Choose a station ";
  document.getElementById('station_btn').innerHTML = station_name + ' <span class="caret" />';
  if(station) {
    var now = new Date();
    var h_now = now.getHours();
    var m_now = now.getMinutes();
    var s_now = now.getSeconds();
    var times = station;
    var len = times.length;
    var best_match;
    for(var j = len - 1; j >= 0; j--) {
      var arrival_time = times[j].split(':');
      var arrival_h = parseInt(arrival_time[0], 10);
      var arrival_m = parseInt(arrival_time[1], 10);
      if(arrival_h > h_now) {
        best_match = arrival_time;
      }
      else if(arrival_h == h_now) {
        if(arrival_m > m_now) {
          best_match = arrival_time;
        }
        else if(arrival_m == m_now) {
          //arriving this minute
          best_match = arrival_time;
        }
        else break;
      }
      else break;
    }
    if(!best_match) best_match = times[0];
    document.getElementById('next').innerHTML = "Next arrival: " + best_match.join(':');
    var message = '';
    var min_diff = best_match[1] - m_now - 1;
    var hour_diff = best_match[0] - h_now;
    if (min_diff < 0) {
      min_diff= 60+min_diff;
      hour_diff -= 1;
    }
    var sec_diff = 60 - s_now;
    document.getElementById('next').innerHTML += " in " + hour_diff + " hr(s) & " + min_diff + " mins & " + sec_diff + " secs.";
  }
}