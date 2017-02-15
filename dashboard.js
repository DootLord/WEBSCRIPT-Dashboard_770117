"use strict"

var express = require('express');
var bodyParser = require("body-parser");
var app = express();
var Twitter = require("twitter"); // Allows access to Twitter API
var twitterAPI = require('node-twitter-api'); // Allows access to user login tokens
var func = require("./js/func"); // Collection of large functions that'd look messy here.


/*
   reqToken & reqTokenSecret store tokens passed to the server from after login and
   are used in the authetication step of the login process
*/
var reqToken;
var reqTokenSecret;

app.use(bodyParser.json());

if(typeof localStorage === "undefined" || localStorage === null){
  var LocalStorage = require("node-localstorage").LocalStorage;
  var localStorage = new LocalStorage("./storage");
}

var twitAuth = new twitterAPI({
  consumerKey: "XzVtLi9PgF72L0NuoLunuF1eE",
  consumerSecret: "j6PrOQ7kie2IUyyDEnb8bYC4yHBeMdvdouplm7UEpzcQ9R7kID",
  callback: "http://127.0.0.1:8080/tweets/auth"
});
// twitInterface is used for calling REST calls on the twitter API
var twitInterface;

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
  res.status(200).send(localStorage.getItem("todoItems"));
  res.end();
})

/*
  Allows users to post changes to the todo-list and update the todo-list server-side.
*/
app.post("/todo", function(req,res){
  localStorage.setItem("todoItems", req.body.list);
  res.status(200).send("POSTED!");
  res.end();
})

/*
  Returns a list of the five most recent tweets from twitInterface's active user.
*/
app.get("/tweets", function(req,res){
  var tweetList = [];
  if(twitInterface == undefined){
    console.log("Need to login to twitter!");
  }
  else{
    twitInterface.get("statuses/home_timeline", {"count": 5}, function(error,tweets,response){
      if(error){
        res.status(204).send("ERROR! Login or tweets have expired");
      }
      //console.log(tweets[0]);
      res.status(200).send(JSON.stringify(tweets));
    });
  }

});

/*
  Authorises the user attempting ot login in by obtaining tokens from twitter
*/
app.get("/tweets/login", function(req,res){
  twitAuth.getRequestToken(function(err, requestToken, requestTokenSecret, results){
    if(err){
      console.error(err);
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
      throw err;
    }
    else{
        twitInterface = new Twitter({
        consumer_key: 'XzVtLi9PgF72L0NuoLunuF1eE',
        consumer_secret: 'j6PrOQ7kie2IUyyDEnb8bYC4yHBeMdvdouplm7UEpzcQ9R7kID',
        access_token_key: accessToken,
        access_token_secret: accessTokenSecret
      });
      res.redirect("/");
    }
  });
});

app.use(express.static(__dirname + "/webpage"));
// Set to 8080 for developmennt purposes
// Will be set to 80 for release
app.listen(8080, function(){
  console.log("Started on port 8080");
});
