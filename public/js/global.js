function startTime(){getNextTime(),setTimeout("startTime()",500)}function setLocation(e){$(".alert-info").removeClass("alert-info"),$("#location"+e).addClass("alert-info");var t;dow||(dow=(new Date).getDay()),dow==0?t=2:dow==6?t=1:t=0,loc=e,dir==0?stn=data[t][dir][loc]:stn=data[t][dir][stns.length-1-loc],stn_n=stns[loc],getNextTime()}function getNextTime(){stn_n||(stn_n="Choose a station ");if(stn){var e=new Date,t=e.getDay();t!=dow&&(dow=t,setLocation(loc));var n=e.getHours(),r=e.getMinutes(),i=e.getSeconds(),s=stn,o=s.length,u;for(var a=0;a<o;a++){var f=s[a].split(":"),l=parseInt(f[0],10),c=parseInt(f[1],10);u=f;if(l>n)break;if(l==n&&c>r)break}u||console.log("best match not found!"),document.getElementById("next").innerHTML="Next <i class='icon-time'></i>Train at "+u.join(":");var h="",p=u[1]-r-1,d=u[0]-n,v=60-i;v==60&&(v=0,p++),p<0&&(p+=60,d--),document.getElementById("next").innerHTML+=" in "+d+"h:"+p+"m:"+v+"s"}}function toggleDirection(){dir==0?(dir=1,$(".arrows").removeClass("icon-arrow-down").addClass("icon-arrow-up")):(dir=0,$(".arrows").removeClass("icon-arrow-up").addClass("icon-arrow-down")),setLocation(loc),$("#location"+loc).select()}var data=JSON.parse(document.getElementById("times").value),stns=["GREENBORO","CONFEDERATION","CARLETON","CARLING","BAYVIEW"],stn,stn_n,dir=0,loc,dow