/* GLOBALS */
var tweets = []; // Current tweets from twitter API.
var tweetItems; // List of current tweet items shown on the page
var galleryIndex = 0; // Used to know what the current photo of the gallery is.
var galleryLength // The current amount of photos the client can request from the server
var newsSource = "bbc-news"; // Default News source.

/*
  ---------------------------------------------------- Weather Functionality ----------------------------------------------------
*/

/*
  Event: DOM Load, Weather Location Update
  Function: Peforms a GET request to the OpenWeatherMap API to receve details and then displays them on the dashboard

*/
function getWeather(){
  var xml = new XMLHttpRequest();
  var county = document.getElementById("weather-location").value;
  xml.onreadystatechange = function(){
    //Get weather from the API and display to elements on the web page
    if(xml.status == 200 && xml.readyState == 4){
      var weather = xml.responseText;
      weather = JSON.parse(weather);
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
  ---------------------------------------------------- Clock Functionality ----------------------------------------------------
*/

/*
  Event: DOM load, every second.
  Displays value in the "Weather & Time" pannel using data from server location
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
  ---------------------------------------------------- Todo-list Functionality ----------------------------------------------------
*/

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
*/
function postToDo(list){
  var xml = new XMLHttpRequest();
  xml.open("POST", "/todo");
  xml.setRequestHeader("Content-type", "application/json");
  var listJSON = {list: list.innerHTML};
  xml.send(JSON.stringify(listJSON), true);
}


/*
  ---------------------------------------------------- Twitter Functionality ----------------------------------------------------
*/


/*
 Gets a set of tweets from the server and displays it appopreately
 Uses GET on /tweet
*/
function getTweets(){
  var xml = new XMLHttpRequest();
  var tweetBox = document.getElementById("box-tweet");
  xml.open("GET", "/tweets");
  xml.setRequestHeader("Content-type", "application/json");
  xml.onreadystatechange = function(){
    if(xml.status == 200 && xml.readyState == 4){
      if(xml.responseText == ""){ // If no active user, then log it and skip.
        console.log("No current twitter user.");
        tweetBox.setAttribute("style", "display:none");
      }
      else{
        tweets = JSON.parse(xml.responseText);
        if(tweets.length != 0){
          displayTweets();
          tweetBox.setAttribute("style","display:inline-block");
        }
        else{
          tweetBox.setAttribute("style","display:none");
        }
      }
    }
    else if(xml.status == 204 && xml.readyState == 4){
        console.log("No tweets available!, please try again later");
      }
  };
  xml.send();
}

/*
  Draws a tweet viewer box over the dashboard to view details about tweets
  Users can click on the tweet text to be directed to the twitter page.
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
  tweetText.onclick = function(){
     window.open("https://twitter.com/" +  tweets[tweetIndex].user.screen_name + "/status/" + tweets[tweetIndex].id_str);
   }
  tweetTitle.innerText = tweets[tweetIndex].user.name;
  tweetText.innerText = tweets[tweetIndex].text;
  tweetBox.style.display = "block";
  fade.style.display = "block";
}


/*
  Sets up tweets to be updated every 60 seconds.
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
  Requests server to wipe tweets from serverside and refreshes page
*/
function logoutTwitter(){
  var xml = new XMLHttpRequest();
  xml.open("GET", "/tweets/logout");
  xml.onreadystatechange = function(){
    if(xml.status == 200 && xml.readyState == 4){
      tweets = [];
      window.location = "/"
    }
  }
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
    list[i].setAttribute("style","display:block");
    list[i].onclick = function(){
      showTweetOverlay(this.getAttribute("tweetID")); // On click, call a function that will show the tweet associated with tweetID
    }
  }

}


/*
  ---------------------------------------------------- File Functionality ----------------------------------------------------
*/

/*
  Peforms a GET on /file to populate the file list on the
  web page.
*/
function getFiles(){
  var xml = new XMLHttpRequest();
  var fileViewer = document.getElementById("file-form")[0];
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
  //fileViewer.value = ""
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

/*
  Peforms a GET request to download the selected file from server.
*/
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
  Removes a file from the fileserver.
  File must be selected by user first.
  A selected element will have the id of "file-selected" applied it.
  A file can be selected by clicking on it.
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
  var fileEle = document.getElementById("file-input");
  if(fileEle.value.length > 60){
    fileEle.value = "";
    alert("File name too long, please select a file with 60 or less characters");
  }
  else{
    getFiles();
  }
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
  ---------------------------------------------------- Gallery Functionality ----------------------------------------------------
*/

/*
  Pulls the names of photos stored for gallery usage from server
  Creates list of file names inside options pane
*/
function generateGalleryList(){
  var xml = new XMLHttpRequest();
  var galleryList = document.getElementById("gallery-list");
  xml.open("GET", "/gallery");
  xml.onreadystatechange = function(){
    if(xml.status === 200 && xml.readyState === 4){
      galleryList.innerHTML = "";
      var items = JSON.parse(xml.responseText);
      for(var i = 0;items.length > i;i++){
        var li = document.createElement("li");
        li.innerText = items[i]
        li.onclick = function(){
          removeGalleryItem(this.innerText);
        }
        galleryList.appendChild(li);
      }
    }
  }
  xml.send();
}


/*
  Deletes a gallery photo from server.
  Updates gallery varables after deletion
*/
function removeGalleryItem(itemName){
 var xml = new XMLHttpRequest();
 xml.open("DELETE", "/gallery?photo=" + itemName);
 xml.onreadystatechange = function(){
   if(xml.status === 200 && xml.readyState === 4){
     updateGalleryLength();
     generateGalleryList();
   }
 }
 xml.send();
}

/*
  Changes the Photo gallery image to the next image.
  @Params: Boolean
    True: Sets photo to next image
    False: Sets photo to previous image
*/
function nextGalleryImg(next){
  var xml = new XMLHttpRequest();
  var galleryImg = document.getElementById("gallery");
  var gallery = document.getElementById("box-gallery");

  xml.open("GET", "/gallery?q=0");
  xml.onreadystatechange = function(){
    if(xml.readyState === 4){
      if(xml.status === 200){ // if outside of index, set to minimum index
        if(next == true){
          if(galleryIndex + 1 > galleryLength){
            galleryIndex = 0;
          }
          else{
            galleryIndex += 1; // else increment index
          }
        }
        else if (next == false) { // if going into minus index, set to maximum index
          if(galleryIndex - 1 < 0){
            galleryIndex = galleryLength;
          }
          else{
            galleryIndex -= 1; // else decrement index
          }
        } // Set the "src" of gallery image to the location of an image on the server
        galleryImg.setAttribute("src", window.location.href + "gallery?q=" + galleryIndex);
      }
    }
    }
    xml.send();
  }

  /*
    Updates the client with details about the photos stored on the server.
  */
  function updateGalleryLength(){
    var gallery = document.getElementById("box-gallery");
    var galleryImg = document.getElementById("gallery");
    var xml = new XMLHttpRequest;
    xml.open("GET", "/gallery");
    xml.onreadystatechange = function(){
      if(xml.status === 200 && xml.readyState === 4){
        galleryLength = (JSON.parse(xml.responseText).length) - 1;
        if(galleryLength == -1){
          gallery.setAttribute("style", "display:none");
        }
        else{
          gallery.setAttribute("style", "display:inline-block");
          galleryImg.setAttribute("src","http://localhost/gallery?q=0")
        }
      }
    }
    xml.send();
  }

/*
  ---------------------------------------------------- Option Pane Functionality ----------------------------------------------------
*/
/*
  Shows option overlay to the user.
*/
function showOptionOverlay(){
  var fade = document.getElementsByClassName("fade")[0];
  var box = document.getElementById("option-box");
  fade.style.display = "block";
  box.style.display = "block";
  box.setAttribute("class","slide-in");
}

/*
  Removes Option overlay and updates gallery details from server.
*/
function closeOptionOverlay(){
  var fade = document.getElementsByClassName("fade")[0];
  var box = document.getElementById("option-box");
  fade.style.display = "none";
  box.style.display = "none";
  updateGalleryLength();
  generateGalleryList();
}

/*
  ---------------------------------------------------- News Functionality ----------------------------------------------------
*/

/*
  Gets a news source from the API I'm using. Uses the global var "newsSource" as a part of the
  query to determine what news feed to get infomation from.
*/
function getNews(){
  var newsList = document.getElementsByClassName("news-item");
  var miniNewsList = document.getElementsByClassName("news-item-mini");
  var xml = new XMLHttpRequest();
  xml.open("GET", "https://newsapi.org/v1/articles?source=" + newsSource + "&sortBy=top&apiKey=b19b2460826248cf94d2e38de763aa65")
  xml.onreadystatechange = function(){
    if(xml.readyState === 4 && xml.status === 200){
      var news = JSON.parse(xml.responseText);
      // Update News Pannels
      for(var i = 0;newsList.length > i;i++){
        newsList[i].setAttribute("newssource",news.articles[i].url);
        newsList[i].onclick = function(){ // Assign the news url to a unique attrabute so that it may be referenced for redirects
          window.open(this.getAttribute("newssource"));
        }
        newsList[i].children[0].innerText = news.articles[i].title;
        newsList[i].children[1].innerText = news.articles[i].description;
        newsList[i].children[2].setAttribute("src", news.articles[i].urlToImage);
      }
      // Update Smaller News Pannels
      for(var i = 0; miniNewsList.length > i; i++){
        miniNewsList[i].setAttribute("newssource",news.articles[i+3].url);
        miniNewsList[i].onclick = function(){
          window.open(this.getAttribute("newssource"));
        }
        miniNewsList[i].children[0].innerText = news.articles[i+3].title;
        miniNewsList[i].children[1].innerText = news.articles[i+3].description;
      }
    }
  }
  xml.send();
}

/*
  Updates the global varable with whatever is stored in the drop downbox.
  Then calls getNews() to get and display the new source to the dashboard
*/
function updateNewsSource(){
  var newsDropdown = document.getElementById("news-source");
  newsSource = newsDropdown.value;
  getNews();
}

/*
  ---------------------------------------------------- Pane Positioning Functionality ----------------------------------------------------
*/

/*
  Allows users to move around the pannels. First click will select the
  box, second click will peform the swap.
*/
var eleOne = null; //Storage for what the first element clicked was
function switchToggle(){
var mainEle = document.getElementsByTagName("main")[0];
  this.setAttribute("class", "move-toggle-click");
  // On first call store element to eleOne (element-one)
  if(eleOne === null){
    // From the button element, get the actual box element that'll be switched
    eleOne = this;
  }
  // On second call store second element and switch
  else{
    swapElements(this.parentElement.parentElement, eleOne.parentElement.parentElement);
    eleOne.setAttribute("class","move-toggle");
    this.setAttribute("class", "move-toggle");
    eleOne = null;
    // Set back to previous Styling
  }
}

/*
   Replaces the location of one element with another. Effectively swapping them.
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
  Provides a function to all swap elements to allow them to swap
  around the dashboard
*/
function initalizeSwapButtons(){
  var buttons = document.getElementsByClassName("move-toggle");
  for(var i = 0;buttons.length > i;i++){
    buttons[i].addEventListener("click",switchToggle);
  }
}

/*
  Sends the current URL of the dashboard to the server-side
  so that functions know the address of the server and client.
*/
function sendURL(){
  var xml = new XMLHttpRequest();
  xml.open("POST", "/url");
  xml.setRequestHeader("Content-Type", "application/json");
  xml.send(JSON.stringify({"url": window.location.href}));
}

/*
  Called once DOM is loaded.
  Runs core functions to start core processes and to initilize varables
*/
function initalizePage(){
  sendURL(); // Update server with URL
  updateTime(); // Get the local time
  getWeather(); // Get the weather from API
  getToDoItems(); // Get the todo list items from server
  getFiles(); // Get filelist from server
  initalizeTweets(); // Check and get tweets
  updateGalleryLength(); // Check and update gallery boundry index
  generateGalleryList(); // Create a list of gallery items
  getNews(); // Get news from news api
  initalizeSwapButtons(); // Gives the swap buttons their code
}

/* ------------------------Listeners------------------------ */

document.getElementById("gallery-next").addEventListener("click", function(){
  nextGalleryImg(true); //Get next image
})
document.getElementById("gallery-previous").addEventListener("click", function(){
  nextGalleryImg(false); // Get previous image
})
document.getElementById("news-source").addEventListener("change", updateNewsSource);
document.getElementById("gallery-submit").addEventListener("click", generateGalleryList);
document.getElementById("tweet-logout").addEventListener("click", logoutTwitter);
document.getElementById("option-close").addEventListener("click",closeOptionOverlay);
document.getElementById("option").addEventListener("click", showOptionOverlay);
document.getElementById("file-refresh").addEventListener("click", getFiles);
document.getElementById("file-modify").addEventListener("click", renameFile);
document.getElementById("weather-location").addEventListener("change", getWeather);
document.getElementById("file-input").addEventListener("change", verifyFile);
document.getElementById("file-submit").addEventListener("click", getFiles);
document.getElementById("todo-button").addEventListener("click", newToDoItem);
document.getElementById("tweet-login").addEventListener("click", loginTwitter);
document.getElementById("file-delete").addEventListener("click", deleteFile);
document.getElementById("file-download").addEventListener("click", downloadFile);
document.addEventListener("load", initalizePage());
