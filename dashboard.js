"use strict";

var express = require('express'); // Web framework
var fs = require("fs"); // File management
var bodyParser = require("body-parser");
var multer = require("multer"); // File upload management middleware
var Twitter = require("twitter"); // Allows access to Twitter API
var twitterAPI = require('node-twitter-api'); // Allows access to user login tokens
var func = require("./js/func"); // Collection of large functions that'd look messy here.
var upload = multer({dest: "./uploads/content/"});
var uploadPhoto = multer({dest: "./uploads/gallery/"});
var app = express();
const filePath = __dirname + "/uploads/content";
const galleryPath = __dirname + "/uploads/gallery/";

var tweets; // Updated via the function updateTweets(). Used by GET on /tweets to return tweets to client
var errCount // Keeps track of the number of error message sent to the user
/*
   reqToken & reqTokenSecret store tokens passed to the server from after login and
   are used in the authetication step of the login process.

   After the twitInterface will be initalized as a Twitter object allowing the server
   to peform calls on behalf of the user.
*/
var twitInterface;
var reqToken;
var reqTokenSecret;

app.use(bodyParser.json());

/*
 Create a new local storage instance if one doesn't already exist
*/
if(typeof localStorage === "undefined" || localStorage === null){
  var LocalStorage = require("node-localstorage").LocalStorage;
  var localStorage = new LocalStorage("./uploads/details");
}

/*
  Initalizes up twitter interface if creditentals already exist on the server.
  User tokens are generated from the "twitAuth" object.
*/
if(localStorage.getItem("twitterKey") || localStorage.getItem("twitterSecret") !== null){
  twitInterface = new Twitter({
  consumer_key: 'XzVtLi9PgF72L0NuoLunuF1eE',
  consumer_secret: 'j6PrOQ7kie2IUyyDEnb8bYC4yHBeMdvdouplm7UEpzcQ9R7kID',
  access_token_key: localStorage.getItem("twitterKey"),
  access_token_secret: localStorage.getItem("twitterSecret")
});
}

/*
  Gets the URL of the client from the client, so the twitter
  api knows to redirect us back after the user has logged in.
*/
var twitAuth
app.post("/url", function(req,res){
    twitAuth = new twitterAPI({
    consumerKey: "XzVtLi9PgF72L0NuoLunuF1eE",
    consumerSecret: "j6PrOQ7kie2IUyyDEnb8bYC4yHBeMdvdouplm7UEpzcQ9R7kID",
    callback: req.body.url + "tweets/auth"
  });
  res.status(200).send("Server URL Updated!");
})

/*---------------------------------------------------- REST Functions ---------------------------------------------------- */

/*
  Used to get current time from the servers location.
  Will use details from the twitInterface to get the time from the users location instead of just portsmouth time.
*/
app.get("/time", function (req,res){
  res.status(200).send(func.getTime());
  res.end();
});

/*
  Returns the contents of the todo list to the client.
  The client will use this to put together the todo-list so that users may add or remove further tasks
*/
app.get("/todo", function(req,res){
  // No items, nothing sent.
  if(localStorage.getItem("todoItems") === null){
    res.status(404).send();
  }
  // If we find the file locally, send to the client.
  else{
    res.status(200).send(localStorage.getItem("todoItems"));
  }
});

/*
  Allows users to post changes to the todo-list and update the todo-list server-side.
*/
app.post("/todo", function(req,res){
  localStorage.setItem("todoItems", req.body.list);
  res.status(200).send("POSTED!");
  res.end();
});

/*
  Returns a list of the five most recent tweets from twitInterface's active user.
*/
app.get("/tweets", function(req,res, next){
  var tweetList = [];
  if(twitInterface === undefined){
    return next();
  }
  else{
      res.status(200).send(JSON.stringify(tweets));
    };
});

/*
  Authorises the user attempting ot login in by obtaining tokens from twitter
*/
app.get("/tweets/login", function(req,res){
  twitAuth.getRequestToken(function(err, requestToken, requestTokenSecret, results){
    if(err){
      return err;
    }
    else{
      reqToken = requestToken;
      reqTokenSecret = requestTokenSecret;
      res.status(200).send(reqToken);
    }
  });
});

/*
  Intended to be called when a user has just been verified from twitter login page.
  Will assemble an interface of the Twitter api containing the details necessary to peform requests on their API.
*/
app.get("/tweets/auth", function(req,res){
  var oauth_verify = req.query.oauth_verifier;
  twitAuth.getAccessToken(reqToken, reqTokenSecret, oauth_verify, function(error, accessToken, accessTokenSecret, results){
    if(error){
      console.log(error);
      return error;
    }
    else{ // Create a new twitter instance, allowing access to the users details.
        twitInterface = new Twitter({
        consumer_key: 'XzVtLi9PgF72L0NuoLunuF1eE',
        consumer_secret: 'j6PrOQ7kie2IUyyDEnb8bYC4yHBeMdvdouplm7UEpzcQ9R7kID',
        access_token_key: accessToken,
        access_token_secret: accessTokenSecret
      });
      localStorage.setItem("twitterKey",accessToken);
      localStorage.setItem("twitterSecret", accessTokenSecret);
      updateTweets();
      res.status(200).send();
    }
  });
});

/*
  On call will logout any active twitter user on the server
*/
app.get("/tweets/logout", function(req,res){
  twitInterface = null;
  localStorage.setItem("twitterKey", "");
  localStorage.setItem("twitterSecret","");
  res.status(200).send("Login details cleared");
  tweets = [];
})

/*
  Returns a list of files available to the user to download.
  or downloads a file if given a valid file name
  from the /uploads/content directory
*/
app.get("/file", function(req,res){
  if(req.query.file === undefined){
    fs.readdir(filePath, function(err,items){
      res.status(200).send(items);
    });
  }
  else{ //TODO add validation to file GET
    res.download(__dirname + "/uploads/content/" + req.query.file);
  }
});

/*
  Posting a file here will check for the file and return it
  from the /uploads/content directory
*/
app.post("/file", function(req,res){
  fs.readdir(filePath, function(err, items){
    for(var i = 0; items.length > i; i++){
      if(items[i] == req.body.filename){
        res.status(200).send("FOUND IT!");
      }
    }
    res.status(404).send("File not found");
  });
});

/*
  Allows clients to rename already existing files on the system.
  Will check to make sure that file exists and also prevent duplicates of files
*/
app.patch("/file", function(req,res,next){
  fs.readdir(filePath, function(err,items){
    // Check to see if new name is already present in directory
    for(var i = 0; items.length > i; i++){
      if(items[i] == req.body.newName){
        res.status(409).send("File alredy exists!");
        return next();
      }
    }
    // Check to see if file exists an updates
    for(var i = 0; items.length > i; i++){
      if(items[i] == req.body.currentName){
        fs.rename(filePath + "/" + req.body.currentName, filePath + "/" + req.body.newName);
        res.status(200).send("File updated");
        return next();
      }
    }
    // If no file found, return 404
    res.status(404).send("File not found");
    return next();
  });
});

/*
  Allows users to request a file to be deleted by supplying
  a location
*/
app.delete("/file", function(req,res,next){
  var file = req.query.file;
  if(file === undefined){
    res.status(404).send("No file selected.");
    return next();
  }
  else{
    fs.readdir(filePath, function(err, items){
      for(var i = 0; items.length > i; i++){
        if(items[i] == file){
          fs.unlink(filePath + "/" + file);
          res.status(200).send("File " + file + " deleted!");//TODO use err call instead of for loop
          return next();
        }
      }
      res.status(404).send("File not found.");
      return next();
    });
  }
});

/*
  Allows upload to the server under the /uploads/content folder
*/
app.post("/file/upload", upload.single("uploadFile"), function(req,res, next){
  if(!req.file){
    res.status(400).send("No file uploaded, please upload a file to use /file/upload");
    return next();
  }
  else if(req.file.originalname.length > 50){
    res.status(414).send("File name too long! 40 characters or less");
    fs.unlink("./uploads/content/" + req.file.filename);
    return next();
  }
  //res.status(201).redirect("/");
  res.status(200).send();
  fs.rename("./uploads/content/" + req.file.filename, "./uploads/content/" + req.file.originalname);
});


/*
  Deletes a photo stored on in the gallery folder.
*/
app.delete("/gallery", function(req,res,next){
  var item = req.query.photo
  if(item === undefined){
    res.status(200).send("No query found");
    return next();
  }
  else{
    fs.readdir(galleryPath, function(err, items){
      for(var i = 0; items.length > i; i++){
        if(items[i] == item){
          fs.unlink(galleryPath + "/" + item);
          res.status(200).send("Photo " + item + " deleted!");
          return next();
        }
      }
      res.status(404).send("File not found");
      return next();
    });
  }
});


/*
  Allows upload to the server under the /uploads/content folder
*/
app.post("/gallery", uploadPhoto.single("uploadPhoto"), function(req,res, next){
  if(!req.file){
    res.status(400).send("No file uploaded, please upload a file to use /file/upload");
    return next();
  }
  if(fs.readdir)
  //res.status(201).redirect("/");
  res.status(200).send();
  fs.rename("./uploads/gallery/" + req.file.filename, "./uploads/gallery/" + req.file.originalname);
});

/*
  Returns images found in the gallery folder
  set "q" to be the id of the image to retreve.
  Set no query parameter to retreve all images
*/
app.get("/gallery", function(req,res){
  var imgs;
  fs.readdir(galleryPath, function(err, items){
    if(err){
      res.status(400).send("No images available");
      return next();
    }
    if(req.query.q != undefined){
      res.sendFile(galleryPath + items[req.query.q]);
    }
    else if (req.query.name != undefined) {
      res.sendFile(galleryPath + req.query.name);
    }
    else{
      res.send(items);
    }
  });
});

app.use(express.static(__dirname + "/webpage"));

/* ---------------------------------------------------- Non-REST functions ---------------------------------------------------- */

/*
  Updates tweets from the Twitter API periodically as to not overuse my
  limited amount of requests per hour.
*/
function updateTweets(){
  if(twitInterface != null){
    twitInterface.get("statuses/home_timeline", {"count": 5}, function(error,newTweets,response){
        if(error){ // Status Code 88: Ran out of twitter API requests
          console.log("Ran out of twitter API requests. This was likely due to restarting the server too often.");
          console.log("The server will run as usual but expect twitter feed to update at a lower rate");
          console.log(error);
          errCount++;
          if(errCount > 2){
            console.log("The server seems to be struggling to connect to twitter. Check to see if twitters services are running");
            console.log("It may also be a case of restarting the server too often as well, or logging in and out repeatedly.");
            console.log(error);
          }
        }
      else{
        tweets = newTweets; //Update the known tweets with the new tweets from our request;
      }
    });
  }
}

function initalizeServer(){
  setInterval(updateTweets, 60050);
  updateTweets();
}

initalizeServer();

app.listen(80, function(){
  console.log("Started on port 80");
});
