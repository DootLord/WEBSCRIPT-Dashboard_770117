"use strict";

var express = require('express');
var bodyParser = require("body-parser");
var app = express();
var Twitter = require("twitter"); // Allows access to Twitter API
var twitterAPI = require('node-twitter-api'); // Allows access to user login tokens
var func = require("./js/func"); // Collection of large functions that'd look messy here.

app.use(bodyParser.json());

var twitToken = "827132427642482688-ypUlU5Ac0Awt9Gvl5UmGM2zo3umQ6Fr"
var twitSecret = "6eMdK1TkUZcMYQUIE6sWHYAH5tIHP9HA0hZMkbeTVsZpX"

var client = new Twitter({
  consumer_key: 'XzVtLi9PgF72L0NuoLunuF1eE',
  consumer_secret: 'j6PrOQ7kie2IUyyDEnb8bYC4yHBeMdvdouplm7UEpzcQ9R7kID',
  access_token_key: twitToken,
  access_token_secret: twitSecret
});

var twitAuth = new twitterAPI({
  consumerKey: "XzVtLi9PgF72L0NuoLunuF1eE",
  consumerSecret: "j6PrOQ7kie2IUyyDEnb8bYC4yHBeMdvdouplm7UEpzcQ9R7kID",
  callback: "192.168.0.35:8080"
});

// app.all('*', function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'accept, content-type, x-parse-application-id, x-parse-rest-api-key, x-parse-session-token');
//      // intercept OPTIONS method
//     if ('OPTIONS' == req.method) {
//       res.send(200);
//     }
//     else {
//       next();
//     }
// });

var todo = "";
/*
  Used to get current time from the servers location.
  Will use details from the client to get the time from the users location instead of just portsmouth time.
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
  res.status(200).send(todo);
  res.end();
})

/*
  Allows users to post changes to the todo-list and update the todo-list server-side.
*/
app.post("/todo", function(req,res){
  todo = req.body.list;
  res.status(200).send("POSTED!");
  res.end();
})

app.get("/tweets", function(req,res){
  var tweetList = [];
  client.get("statuses/home_timeline", {"count": 5}, function(error,tweets,response){
    for(var i = 0;tweets.length > i;i++){
      tweetList[i] = tweets[i].text;
    }
    res.status(200).send(JSON.stringify(tweetList));
  });
});

var tok;
var tokSec;

app.get("/tweets/login", function(req,res){
  twitAuth.getRequestToken(function(err, requestToken, requestTokenSecret, results){
    if(err){
      console.log(err);
    }
    else{
      tok = requestToken;
      tokSec = requestTokenSecret;
      res.status(200).send(tok);
    }
  });
});



app.use(express.static(__dirname + "/webpage"));
// Set to 8080 for developmennt purposes
// Will be set to 80 for release
app.listen(8080, function(){
  console.log("Started on port 8080");
});
