/* This document consists of regular JavaScript */
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

function initalizePage(){
  updateTime();
  getWeather();
}

function updateTime(){
  getTime();
  window.setInterval(getTime,1000);
}

function getWeather(){
  xml.onreadystatechange = function(){
    if(xml.status == 200 && xml.readyState == 4){

      var weather = xml.responseText;
      weather = JSON.parse(weather);
      document.getElementById("weather-type").innerText =  weather.weather[0].main
      document.getElementById("weather-detail").innerText = weather.weather[0].description

    }
  }
  xml.open("GET", "http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=268c7be320d0fb2272cc7c417ad9ed95",true)
  xml.send();
}



document.addEventListener("load", initalizePage());
