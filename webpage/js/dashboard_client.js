/* This document consists of regular JavaScript */
var tweets = []; // Used to store data about the five current active tweets on the page.
var tweetItems // List of current tweet items shown on the page
var oauthToken // Token used to implement the Twitter API

/*
  Calls to the Weather api to get local weather details for the current location and time of the dashboards location.
  Calls a GET to the OpenWeatherMap API to receve details and then displays them on the dashboard
  TODO: Send dashboard location for more speisifc weather
*/
function getWeather(){
  var xml = new XMLHttpRequest();

  xml.onreadystatechange = function(){
    if(xml.status == 200 && xml.readyState == 4){
      var weather = xml.responseText;
      weather = JSON.parse(weather);
      document.getElementById("weather-type").innerText =  weather.weather[0].main
      document.getElementById("weather-detail").innerText = weather.weather[0].description
      document.getElementById("weather-degree").innerHTML = Math.floor(weather.main.temp - 273) +  "c";
    }
  }
  xml.open("GET", "http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=268c7be320d0fb2272cc7c417ad9ed95")
  xml.send();
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
  Gets the inital time and then will call "getTime" to refresh the time every second
*/

function updateTime(){
  getTime();
  window.setInterval(getTime,1000);
}

/*
  Grabs the current todo list and displays it on the dashboard_client
  Does so by performing a GET on /todo of the server
*/
function getToDoItems(){
  var xml = new XMLHttpRequest();
  var list = document.getElementById("todo-list");
  xml.onreadystatechange = function(){
    if(xml.status == 200 && xml.readyState == 4){
      list.innerHTML = xml.responseText;
      console.log(list.childNodes[0]);
      for(var i = 0; list.childNodes.length>i; i++){
        list.childNodes[i].onclick = function(){
          this.parentNode.removeChild(this);
          postToDo(list);
        }
        console.log("added onclick");
      }
    }
  }
  xml.open("GET", "/todo", true);
  xml.send();
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
      postToDo(list);
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
  Done so via POSt on /todo
  TODO: Have todo-list stored via a database server-side
*/
function postToDo(list){
  var xml = new XMLHttpRequest();
  xml.open("POST", "/todo");
  xml.setRequestHeader("Content-type", "application/json");
  xml.onreadystatechange = function(){
    if(xml.status == 200 && xml.readyState == 4){
      //console.log(xml.responseText);
    }
  }
  var listJSON = {list: list.innerHTML};
  xml.send(JSON.stringify(listJSON), true);
}

/*
 Gets a set of tweets from the server and displays it appopreately
 Uses GET on /tweet
 TODO: Add twitter login to allow any user to see their tweets
*/
function getTweets(){
  document.getElementById("tweet-list").innerHTML = "";
  var xml = new XMLHttpRequest();
  xml.open("GET", "/tweets");
  xml.setRequestHeader("Content-type", "application/json");
  xml.onreadystatechange = function(){
    if(xml.status == 200 && xml.readyState == 4){
      tweets = JSON.parse(xml.responseText);
      //console.log(tweets[0]);
      displayTweets();
    }
    else if(xml.status == 204 && xml.readyState == XMLHttpRequest.DONE){
        console.log("No tweets available!, please try again later");
      }
  }
  xml.send();
  //TODO Implement this section of code properly
  if(tweets != []){
    setInterval(getTweets, 25000);
  }
}
/*
  TODO Finish and cleanup. This is a mess!
  TODO: Move to own js file as will likely be large function
*/

function showTweetOverlay(tweetIndex){
  var tweet = tweets[0];
  var tweetBox = document.getElementsByClassName("fade-box")[0];
  document.getElementsByClassName("fade-button")[0].onclick = function(){
    tweetBox.style.display = "none";
  }
  var tweetText = document.getElementsByClassName("fade-content")[0];
  var tweetTitle = document.getElementsByClassName("fade-title")[0];
  tweetTitle.innerText = tweets[tweetIndex].user.name;
  tweetText.innerText = tweets[tweetIndex].text;
  tweetBox.style.display = "block";

}

/*
  Starts the login process for getting the required tokens to peform requests on twitters API on the user's behalf
  TODO Implement a less crude login button
*/
function loginTwitter(){
  var xml = new XMLHttpRequest();
  xml.open("GET", "/tweets/login");
  xml.onreadystatechange = function(){
    if(xml.status == 200 && xml.readyState == 4){
      oauthToken = xml.responseText
      window.location = "https://twitter.com/oauth/authenticate?oauth_token=" + oauthToken;
    }
  }
  xml.send();
}

/*
  Assmbles the most recent tweets from the user onto the webpage and assigns each with function
  for an onclick redirect to the tweet
*/
function displayTweets(){
  var ele = document.getElementById("tweet-list");
  for(var i = 0; tweets.length > i; i++){
      var li = document.createElement("li");
      li.innerText = tweets[i].text;
      li.setAttribute("tweet-item",i);
      li.setAttribute("class","tweet-item");
      li.onclick = function(){
        showTweetOverlay(this.getAttribute("tweet-item"));
      }
      ele.appendChild(li);
  }
  tweetItems = document.getElementsByClassName("tweet-item");
}
/*
  Peforms a GET on /file to populate the file list on the
  web page.
*/
function getFiles(){
  var xml = new XMLHttpRequest();
  xml.open("GET", "/file");
  xml.onreadystatechange = function(){
    if(xml.status === 200 && xml.readyState === 4){
      var files = JSON.parse(xml.responseText);
      var fileEle = document.getElementsByClassName("file-viewer")[0];
      fileEle.innerHTML = "";

      for(var i = 0;files.length > i; i++){
        var li = document.createElement("li");
        li.innerText = files[i];
        li.onclick = function(){
          selectFile(this);
        }
        fileEle.appendChild(li);
      }
    }
  }
  xml.send();
}
/*
  Highlights a file via a CSS and gives it an Id tag
  for it to be used on further operations such as file download
*/
function selectFile(file){
  var fileList = document.getElementsByClassName("file-viewer")[0].childNodes;
  for(var i = 1;fileList.length > i;i++){
    fileList[i].setAttribute("id","");
  }
  file.setAttribute("id","file-selected");
}

function downloadFile(){
  var selFile = document.getElementById("file-selected");
  if(selFile == undefined){
    alert("Select a file first!")
  }
  else{ //TODO add validation!!
    window.location="/file?file=" + selFile.innerText;
   }
}
//TODO implement text field to allow for custom file names
function modifyFile(newName){
  var selFile = document.getElementById("file-selected");
    if(selFile == undefined){
      alert("Please select a file to modify!");
    }
    else{
      var xml = new XMLHttpRequest();
      var pathRequest = {"currentName": selFile.innerText, "newName": newName}
      xml.open("PATCH", "/file");
      xml.setRequestHeader("Content-type", "application/json");
      xml.onreadystatechange = function(){
        if(xml.readyState === 4){
          if(xml.status === 200){
            getFiles();
          }
          else if (xml.status === 409){
            alert("File name already exists, please pick another");
          }
        }
      }
      xml.send(JSON.stringify(pathRequest));

  }
}

function deleteFile(){
  var selFile = document.getElementById("file-selected");
  if(selFile == undefined){
    alert("Please select a file to modify");
  }
  else{
    var xml = new XMLHttpRequest();
    xml.open("DELETE", "/file?file="+selFile.innerText);
    console.log("/file?file="+selFile.innerText);
    xml.onreadystatechange = function(){
      if(xml.readyState === 4 && xml.status === 200){
        getFiles();
        console.log(xml.responseText);
      }
    }
    xml.send();
  }
}

/*
  Called once DOM is loaded.
  Runs core functions to start core processes and to initilize varables
*/
function initalizePage(){
  updateTime();
  getWeather();
  getToDoItems();
  getFiles();
  //getTweets();
}



// Event Listeners
document.getElementById("todo-button").addEventListener("click", newToDoItem);
document.getElementById("tweet-login").addEventListener("click", loginTwitter);
document.getElementsByClassName("file-delete")[0].addEventListener("click", deleteFile);
document.getElementsByClassName("file-download")[0].addEventListener("click", downloadFile);
document.addEventListener("load", initalizePage());
