

var xml = new XMLHttpRequest();

function getTime(){
  xml.onreadystatechange = function(){
  if(xml.status == 200 && xml.readyState == 4){
    document.getElementById("time").innerHTML = xml.responseText;
    console.log(xml.responseText);
  }
};
  xml.open("GET", "/time", true);
  xml.send();
}

function sayHello(){
  console.log("Hello!");
}

function updateTime(){
  getTime();
  window.setInterval(getTime,1000);
}

updateTime();
