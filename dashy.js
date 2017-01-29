var express = require('express');
var app = express();
var func = require("./js/func")

app.get("/time", function (req,res){
  res.send(func.getTime());
});

app.use(express.static(__dirname + "/webpage"));

app.listen(8080, function(){
  console.log("Started on port 8080");
});
