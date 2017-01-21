var xml = new XMLHttpRequest();

function updateTime(){
  xml.onreadystatechange = function(){
  if(xml.status == 200 && xml.readyState == 4){
    document.getElementById("Time").innerHTML = xml.responseText;
    console.log(xml.responseText);
  }
};
  xml.open("GET", "/time", true);
  xml.send();
}

function sayHello(){
  console.log("Hello!");
}

document.addEventListener("onload", updateTime);
document.addEventListener("onload", sayHello);
document.addEventListener("onload", function(){
  console.log("SAY SOMTHING!!")
})

console.log("Hello!?");
