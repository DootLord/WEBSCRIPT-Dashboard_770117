/* GLOBALS */
var tweets = []; // Current tweets from twitter API.
var tweetItems; // List of current tweet items shown on the page
var galleryIndex = 0; // Used to know what the current photo of the gallery is.

/*
  Calls to the Weather api to get local weather details for the current location and time of the dashboards location.
  Calls a GET to the OpenWeatherMap API to receve details and then displays them on the dashboard
  TODO: Send dashboard location for more speisifc weather
*/
function getWeather(){
  var xml = new XMLHttpRequest();
  var county = document.getElementById("weather-location").value;
  xml.onreadystatechange = function(){
    //Get weather from the API and display to elements on the web page
    if(xml.status == 200 && xml.readyState == 4){
      var weather = xml.responseText;
      weather = JSON.parse(weather);
      //document.getElementById("weather-type").innerText =  weather.weather[0].main; Removed and replaced by location dropdown.
      document.getElementById("weather-detail").innerText = weather.weather[0].description;
      document.getElementById("weather-degree").innerText = Math.floor(weather.main.temp - 273) +  "c";
      document.getElementById("weather-degree-min").innerText = Math.floor(weather.main.temp_min - 273) + "c";
      document.getElementById("weather-degree-max").innerText = Math.floor(weather.main.temp_max - 273) + "c";
    }
    else if(xml.status == 400 && xml.readyState == 4){
      console.error("Somthing is wrong with the weather API, please try again later");
    }
  };
  xml.open("GET", "http://api.openweathermap.org/data/2.5/weather?q=" + county + ",uk&appid=268c7be320d0fb2272cc7c417ad9ed95");
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
};
  xml.open("GET", "/time", true);
  xml.send();
}

/*
  Gets the  time and then will call "getTime" to refresh the time every second
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
    //
    if(xml.status == 200 && xml.readyState == 4){
      list.innerHTML = xml.responseText;
      for(var i = 0; list.childNodes.length>i; i++){
        list.childNodes[i].onclick = function(){
          this.parentNode.removeChild(this);
          postToDo(list);
        };
      }
    }
    // If we don't get any items, inform the user.
    else if (xml.status == 404 && xml.readyState == 4) {
      console.error("No items found on server!");
    }
  };
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
  else if(textField.value !== ""){
    li.innerText = textField.value;
    li.onclick = function(){
      this.parentNode.removeChild(this);
      postToDo(list);
    };
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
  };
  var listJSON = {list: list.innerHTML};
  xml.send(JSON.stringify(listJSON), true);
}

/*
 Gets a set of tweets from the server and displays it appopreately
 Uses GET on /tweet
 TODO: Add twitter login to allow any user to see their tweets
*/
function getTweets(){
  var xml = new XMLHttpRequest();
  xml.open("GET", "/tweets");
  xml.setRequestHeader("Content-type", "application/json");
  xml.onreadystatechange = function(){
    if(xml.status == 200 && xml.readyState == 4){
      if(xml.responseText == ""){ // If no active user, then log it and skip.
        console.log("No current twitter user.");
      }
      else{
        tweets = JSON.parse(xml.responseText);
        displayTweets();
      }
    }
    else if(xml.status == 204 && xml.readyState == 4){
        console.log("No tweets available!, please try again later");
      }
  };
  xml.send();
}

/*
  TODO Finish and cleanup. This is a mess!
  TODO: Move to own js file as will likely be large function
*/
function showTweetOverlay(tweetIndex){
  var tweetBox = document.getElementsByClassName("fade-box")[0];
  var fade = document.getElementsByClassName("fade")[0];
  document.getElementsByClassName("fade-button")[0].onclick = function(){
    tweetBox.style.display = "none";
    fade.style.display = "none";
  };
  var tweetText = document.getElementsByClassName("fade-content")[0];
  var tweetTitle = document.getElementsByClassName("fade-title")[0];
  console.log(tweets[tweetIndex]);
  console.log(tweetIndex);
  tweetTitle.innerText = tweets[tweetIndex].user.name;
  tweetText.innerText = tweets[tweetIndex].text;
  tweetBox.style.display = "block";
  fade.style.display = "block";
}

function showOptionOverlay(){
  var fade = document.getElementsByClassName("fade")[0];
  var box = document.getElementById("option-box");
  fade.style.display = "block";
  box.style.display = "block";
}

/*
  Sets up tweets to be updated every 25 seconds.
  Enough time to not time out the amount requests I'm allowed from the twitter API
*/
function initalizeTweets(){
  if(tweets != []){
    setInterval(getTweets, 60100);
    getTweets();
  }
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
      window.location = "https://twitter.com/oauth/authenticate?oauth_token=" + xml.responseText;
    }
  };
  xml.send();
}

/*
  Assmbles the most recent tweets from the user onto the webpage and assigns each with function
  for an onclick redirect to the tweet
*/
function displayTweets(){
  var list = document.getElementsByClassName("tweet-item");
  for(var i = 0;list.length > i; i++){
    list[i].children[0].setAttribute("src", tweets[i].user.profile_image_url)
    list[i].children[1].innerText = tweets[i].user.name;
    list[i].children[2].innerText = tweets[i].text;
    list[i].setAttribute("tweetID", i);
    list[i].onclick = function(){
      showTweetOverlay(this.getAttribute("tweetID")); // On click, call a function that will show the tweet associated with tweetID
    }
  }

}

/*
  Peforms a GET on /file to populate the file list on the
  web page.
*/
function getFiles(){
  var xml = new XMLHttpRequest();
  var fileViewer = document.getElementById("file-form")[0];
  console.log(fileViewer);
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
          selectFile(this); // Have list items highlighted on click.
        };
        fileEle.appendChild(li);
      }
    }
  };
  xml.send();
  fileViewer.value = ""
}

/*
  Highlights a file via a CSS and gives it an Id tag
  for it to be used on further operations such as file download
*/
function selectFile(file){
  var fileList = document.getElementsByClassName("file-viewer")[0].childNodes;
  for(var i = 0;fileList.length > i;i++){
    fileList[i].setAttribute("id","");
  }
  file.setAttribute("id","file-selected");
}

function downloadFile(){
  var selFile = document.getElementById("file-selected");
  if(selFile === undefined){
    alert("Select a file first!");
  }
  else{ //TODO add validation!!
    window.location="/file?file=" + selFile.innerText;
   }
}

/*
  Spawns a text form inside the currently active file management element
  for the user to fill a new name for a file.
  Calls modifyFile with old and new titles to update the server with new name.
*/
function renameFile(){
  var selFile = document.getElementById("file-selected");
  var oldText = selFile.innerText;
  selFile.innerHTML = "";

  var input = document.createElement("input");
  input.setAttribute("type", "text");
  input.addEventListener("keyup", function(event){
    event.preventDefault();
    if(event.keyCode == 13){
      modifyFile(oldText,this.value);
    }
  });
  selFile.appendChild(input);
}

/*
  Renames a file located on the serverside.
  @Params
    oldName: The current name of the file
    newName: The new name that you wish to rename the file.
*/
function modifyFile(oldName,newName){
  var selFile = document.getElementById("file-selected");
    if(selFile === undefined){
      alert("Please select a file to modify!");
    }
    else{
      var xml = new XMLHttpRequest();
      var pathRequest = {"currentName": oldName, "newName": newName};
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
      };
      xml.send(JSON.stringify(pathRequest));

  }
}

/*
  Removes a file from the fileserver.
  File must be selected first.
*/
function deleteFile(){
  var selFile = document.getElementById("file-selected");
  if(selFile === undefined){
    alert("Please select a file to modify");
  }
  else{
    var xml = new XMLHttpRequest();
    xml.open("DELETE", "/file?file="+selFile.innerText);
    xml.onreadystatechange = function(){
      if(xml.readyState === 4 && xml.status === 200){
        getFiles();
        console.log(xml.responseText);
      }
    };
    xml.send();
  }
}

/*
  Triggered on selecting a file for upload.
  Checks to see if the file uploaded does not have too many characters.
  Too many characters causes the filename to trail off when displaying in file list.
*/
function verifyFile(){
  var fileEle = document.getElementsByClassName("file-input")[0];
  if(fileEle.value.length > 60){
    fileEle.value = "";
    alert("File name too long, please select a file with 60 or less characters");
  }
  else{
    getFiles();
  }
}

/*
  Bound to the circles in the top right of every box.
  Allows users to move around the boxs client-side.
*/
var eleOne = null;
var eleTwo = null;
function switchToggle(){
var mainEle = document.getElementsByTagName("main")[0];
  this.setAttribute("class", "move-toggle-click");
  // On first call store element to eleOne (element-one)
  if(eleOne === null){
    // From the button element, get the actual box element that'll be switched
    eleOne = this;
  }
  // On second call store second element and switch
  else if (eleTwo === null){
    eleTwo = this;
    swapElements(eleTwo.parentElement.parentElement, eleOne.parentElement.parentElement);
    eleOne.setAttribute("class","move-toggle");
    eleTwo.setAttribute("class", "move-toggle");
    eleOne = eleTwo = null;
    // Set back to previous Styling
  }
}
/*
  Changes the Photo gallery image to the next image.
  @Params: Boolean
    True: Sets photo to next image
    False: Sets photo to previous image
*/
function nextGalleryImg(next){
  var galleryImg = document.getElementById("gallery");
  if(next == true){
    if(galleryIndex + 1 > galleryLength){
      galleryIndex = 0;
    }
    else{
      galleryIndex += 1;
    }
  }
  else if (next == false) {
    if(galleryIndex - 1 < 0){
      galleryIndex = galleryLength;
    }
    else{
      galleryIndex -= 1;
    }
  }

  galleryImg.setAttribute("src", window.location.href + "gallery?q=" + galleryIndex);
}
/*
  Function used by switchToggle() to ensure that
  box elements are swapped properly.
*/
function swapElements(eleOne,eleTwo){
  var parentTwo = eleTwo.parentNode;
  var eleTwoNext = eleTwo.nextSibling;
  // Swapping the first element
  if(eleTwoNext === eleOne){
    parentTwo.insertBefore(eleOne, eleTwo);
  }
  else{
    eleOne.parentNode.insertBefore(eleTwo, eleOne);
  }
  // Swapping the second element
  if(eleTwoNext){
    parentTwo.insertBefore(eleOne, eleTwoNext);
  }
  else{
    parentTwo.appendChild(eleOne);
  }
}
/*
  Sends the current URL of the dashboard to the server-side
  so that services know the address of the client.
  This infomation is used twitter redirects currently.
  //TODO Set the server to get its own URL. Dummy...
*/
function sendURL(){
  var xml = new XMLHttpRequest();
  xml.open("POST", "/url");
  xml.setRequestHeader("Content-Type", "application/json");
  xml.onreadystatechange = function(){
    if(xml.status === 200 && xml.readyState === 4){
      console.log(xml.responseText);
    }
  }
  xml.send(JSON.stringify({"url": window.location.href}));
}

// Returns the current amount of images stored for use on the Photo Gallery object
var galleryLength
function updateGalleryLength(){
  var xml = new XMLHttpRequest;
  xml.open("GET", "/gallery");
  xml.onreadystatechange = function(){
    if(xml.status === 200 && xml.readyState === 4){
      galleryLength =  (JSON.parse(xml.responseText).length) - 1;
    }
  }
  xml.send();
}


/*
  Called once DOM is loaded.
  Runs core functions to start core processes and to initilize varables
*/
function initalizePage(){
  sendURL();
  updateTime();
  getWeather();
  getToDoItems();
  getFiles();
  initalizeTweets();
  updateGalleryLength();
  var buttons = document.getElementsByClassName("move-toggle");
  for(var i = 0;buttons.length > i;i++){
    buttons[i].addEventListener("click",switchToggle);
  }
  setInterval(function (){
    nextGalleryImg(true);
  }, 6000)
}


/* ------------------------Listeners------------------------ */
document.getElementById("gallery-next").addEventListener("click", function(){
  nextGalleryImg(true);
})
document.getElementById("gallery-previous").addEventListener("click", function(){
  nextGalleryImg(false);
})
document.getElementById("option").addEventListener("click", showOptionOverlay);
document.getElementsByClassName("file-refresh")[0].addEventListener("click", getFiles);
document.getElementsByClassName("file-modify")[0].addEventListener("click", renameFile);
document.getElementById("weather-location").addEventListener("change", getWeather);
document.getElementsByClassName("file-input")[0].addEventListener("change", verifyFile);
document.getElementById("file-submit").addEventListener("click", getFiles);
document.getElementById("todo-button").addEventListener("click", newToDoItem);
document.getElementById("tweet-login").addEventListener("click", loginTwitter);
document.getElementsByClassName("file-delete")[0].addEventListener("click", deleteFile);
document.getElementsByClassName("file-download")[0].addEventListener("click", downloadFile);
document.addEventListener("load", initalizePage());
