var data, times, dow, len, day, loc, dir;
var stns = ["GREENBORO", "CONFEDERATION", "CARLETON", "CARLING", "BAYVIEW"];

function setDOW(now) {
  dow = now;
  if(dow == 0) day = 2; //sunday
  else if(dow == 6) day = 1; //saturday
  else day = 0; // monday to friday
}

$.get(
    "times.json",
    function(json) {
       data = JSON.parse(json);
       info = document.getElementById('sid');
       loc = parseInt(info.getAttribute('s'),10);
       dir = parseInt(info.getAttribute('d'),10);
       setDOW((new Date()).getDay());
       times = dir == 0 ? data[day][1-dir][loc] : data[day][1-dir][4-loc];
       len = times.length;
       for(i = 0; i < len; i++) {
         $("#timestations").append('<li><a class="tab-pane pull-center" data-toggle="button" style="font-weight:bold; font-size: 140%; cursor: pointer;">'+times[i]+'</a></li>');
       }
    }
);



