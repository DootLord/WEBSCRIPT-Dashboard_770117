/* This document consists of JQuery JavaScript */

$(document).ready(function(){
  dragFunc();
});


/*
  Allows elements to become draggable by clicking a button
*/



function dragFunc(){
  var isDraggable = false;
  $(".draggable").draggable();
  $(".draggable").draggable("disable");

  $("#dragButton").click(function(){
    if(isDraggable){
      $(".draggable").draggable("disable");
      isDraggable = false;
    }
    else{
      $(".draggable").draggable("enable");
      isDraggable = true;
    }
  });
}
