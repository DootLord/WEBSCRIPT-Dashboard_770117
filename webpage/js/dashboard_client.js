/* This document consists of regular JavaScript */

/*
  Called once DOMis loaded.
  Runs core functions to start loops and to initilize varables
*/
function initalizePage(){
  updateTime();
  getWeather();
  getToDo();
}

/*
  Gets the inital time and then will call "getTime" to refresh the time every second
*/

function updateTime(){
  getTime();
  window.setInterval(getTime,1000);
}

/*
  Calls to the Weather api to get local weather details for the current location and time of the dashboards location.
  Calls a GET to the OpenWeatherMap API to receve details and then displays them on the dashboard
  TODO: Send dashboard location for more speisifc weather
*/
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

/*
  Gets the local time from the server.
  TODO: Send dashboard location to allow speisifc time
*/
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


/*
  Grabs the current todo list and displays it on the dashboard_client
  Does so by performing a GET on /todo of the server
  TODO: Have server store todo on database instead of tempory storage
*/
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

/*
 Allows users to post new items to the todo by adding it to the list after existing elements
 Also adds function to each new element for the element to be removed on click
 Calls a function to update the todo list servers
 TODO: Implement a clear all button
*/

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

/*
  Updates the servers current todo list with newly edited todo list
  Done so via post on /todo
  TODO: Have todo-list stored via a database server-side
*/
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

/*
 Gets a set of tweets from the server and displays it appopreately
 Uses GET on /tweet
 TODO: Add twitter login to allow any user to see their tweets
*/

function getTweet(){
  var xml = new XMLHttpRequest();
  xml.open("GET", "/tweets");
  xml.setRequestHeader("Content-type", "application/json");
  xml.onreadystatechange = function(){
    if(xml.status == 200 && xml.readyState == 4){
      console.log(xml.responseText);
    }
  }
  xml.send();
}

// function getTwitterUser(){
//   var xml = new XMLHttpRequest();
//   xml.onreadystatechange = function(){
//     if(xml.status == 200 && xml.readyState == 4){
//       console.log(xml.responseText.token);
//     }
//   }
//   xml.open("GET", "/tweet/user");
//   xml.setRequestHeader("Content-type", "application/json");
//   xml.send();
// }
// Event Listeners
document.getElementById("todo-button").addEventListener("click", newToDoItem);
document.getElementById("tweet-helloworld").addEventListener("click", getTweet);
document.addEventListener("load", initalizePage());
