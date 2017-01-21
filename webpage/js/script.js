

var xml = new XMLHttpRequest();

function getTime(){
  xml.onreadystatechange = function(){
  if(xml.status == 200 && xml.readyState == 4){
    var ele = document.getElementsByClassName("time");
    var curTime = xml.responseText;
    for(var i = 0; i < ele.length;i++){
      ele[i].innerHTML = curTime;
    }
  }
};
  xml.open("GET", "/time", true);
  xml.send();
}

function sayHello(){
  console.log("Hello!");
}

function updateTime(){
  getTime();
  window.setInterval(getTime,1000);
}

updateTime();
