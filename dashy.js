var express = require('express');
var app = express();

app.use(express.static(__dirname + "/webpage"),function(req,res,next){
  console.log("Time:", Date.now());
  next();
})

app.listen(8080, function(){
  console.log("Dashboard started on 8080");
})
