/* This document consists of regular JavaScript */


function initalizePage(){
  updateTime();
  getWeather();
  getToDo();
}

function updateTime(){
  getTime();
  window.setInterval(getTime,1000);
}

function getWeather(){
  var xml = new XMLHttpRequest();

  console.log("Weather: Start")
  xml.onreadystatechange = function(){
    if(xml.status == 200 && xml.readyState == 4){
      console.log("Weather: Main")
      var weather = xml.responseText;
      weather = JSON.parse(weather);
      document.getElementById("weather-type").innerText =  weather.weather[0].main
      document.getElementById("weather-detail").innerText = weather.weather[0].description
      document.getElementById("weather-degree").innerHTML = Math.floor(weather.main.temp - 273) +  "c";
    }
  }
  xml.open("GET", "http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=268c7be320d0fb2272cc7c417ad9ed95")
  xml.send();
  console.log("Weather: End");
}

function getTime(){
  var xml = new XMLHttpRequest();
  
  xml.onreadystatechange = function(){
  if(xml.status == 200 && xml.readyState == 4){
    var ele = document.getElementsByClassName("time");
    var curTime = xml.responseText;
    for(var i = 0; i < ele.length;i++){
      ele[i].innerHTML = curTime;
    }
  }
}
  xml.open("GET", "/time", true);
  xml.send();
}

function getToDo(){
  var xml = new XMLHttpRequest();
  console.log("ToDo: Start");
  var list = document.getElementById("todo-list");
  xml.onreadystatechange = function(){
    console.log("ToDo:Main");
    if(xml.status == 200 && xml.readyState == 4){
      list.innerHTML = xml.responseText;
    }
  }
  xml.open("GET", "/todo", true);
  xml.send();
  console.log("ToDo: Finish");
}

function newToDoItem(){
  var textField = document.getElementById("todo-input");
  var list = document.getElementById("todo-list");
  var li = document.createElement("li");
  if (textField.value == "CLEAR_ALL") {
    list.innerHTML = "";
  }
  else if(textField.value != ""){
    li.innerText = textField.value;
    li.onclick = function(){
      this.parentNode.removeChild(this);
    }
    list.appendChild(li);

    postToDo(list);
  }
  else{
    alert("Please enter a thing todo!");
  }
}

function postToDo(list){
  var xml = new XMLHttpRequest();
  xml.open("POST", "/todo");
  xml.setRequestHeader("Content-type", "application/json");
  xml.onreadystatechange = function(){
    if(xml.status == 200 && xml.readyState == 4){
      console.log(xml.responseText);
    }
  }
  var listJSON = {list:list.innerHTML};
  xml.send(JSON.stringify(listJSON), true);
}

document.getElementById("todo-button").addEventListener("click", newToDoItem);
document.addEventListener("load", initalizePage());
