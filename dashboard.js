var express = require('express');
var bodyParser = require("body-parser");
var app = express();
var Twitter = require("twitter");
var func = require("./js/func")

app.use(bodyParser.json());

var client = new Twitter({
  consumer_key: 'XzVtLi9PgF72L0NuoLunuF1eE',
  consumer_secret: 'j6PrOQ7kie2IUyyDEnb8bYC4yHBeMdvdouplm7UEpzcQ9R7kID',
  access_token_key: '827132427642482688-ypUlU5Ac0Awt9Gvl5UmGM2zo3umQ6Fr',
  access_token_secret: '6eMdK1TkUZcMYQUIE6sWHYAH5tIHP9HA0hZMkbeTVsZpX'
});

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
    res.status(200).send(tweetList);
  });

})


app.use(express.static(__dirname + "/webpage"));

app.listen(80, function(){
  console.log("Started on port 80");
});
