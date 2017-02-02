var express = require('express');
var bodyParser = require("body-parser");
var app = express();
var func = require("./js/func")

app.use(bodyParser.json());

var todo = "";

app.get("/time", function (req,res){
  res.status(200).send(func.getTime());
  res.end();
});

app.get("/todo", function(req,res){
  res.status(200).send(todo);
  res.end();
})

app.post("/todo", function(req,res){
  todo = req.body.list;
  res.status(200).send("POSTED!");
  res.end();
})

app.use(express.static(__dirname + "/webpage"));

app.listen(8080, function(){
  console.log("Started on port 8080");
});
