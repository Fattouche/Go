function playGo() {
    window.location = 'GoBoard.html'
}

function myBoardSize() {
    document.getElementById("boardSize").classList.toggle("show");
}

function myBoardColor() {
    document.getElementById("boardColor").classList.toggle("show");
}

function myBoardHandi() {
    document.getElementById("boardHandi").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
      }
    }
  }
}

function toggle9(sizename){
   var el = document.getElementById('sizename');
   if (el.firstChild.data == "Board Size" || el.firstChild.data == "13x13" || el.firstChild.data == "19x19"){
       el.firstChild.data = "9x9";
   }
   console.log("999");
    $.ajax({
        type: 'POST',
        url : '/size',
        dataType: "json",
        data : JSON.stringify({size: 9}), 
        contentType : "application/json",
        success : function(){
            console.log("response for /size"+status);       
        }
    });

}

function toggle13(sizename){
   var el = document.getElementById('sizename');
   if (el.firstChild.data == "Board Size" || el.firstChild.data == "9x9" || el.firstChild.data == "19x19") {
       el.firstChild.data = "13x13";
   }
    $.ajax({
        type: 'POST',
        url : '/size',
        dataType: "json",
        data : JSON.stringify({size: 13}), 
        contentType : "application/json",
        success : function(){
            console.log("response for /size"+status);       
        }
    });

}

function toggle19(sizename){
   var el = document.getElementById('sizename');
   if (el.firstChild.data == "Board Size" || el.firstChild.data == "9x9" || el.firstChild.data == "13x13") {
       el.firstChild.data = "19x19";
   }
    $.ajax({
        type: 'POST',
        url : '/size',
        dataType: "json",
        data : JSON.stringify({size: 13}), 
        contentType : "application/json",
        success : function(){
            console.log("response for /size"+status);       
        }
    });

}

function togglelight(colorname){
   var el = document.getElementById('colorname');
   if (el.firstChild.data == "Board Color" || el.firstChild.data == "Medium Wood" || el.firstChild.data == "Dark Wood"){
       el.firstChild.data = "Light Wood";
   }
    $.ajax({
        type: 'POST',
        url : '/color',
        dataType: "json",
        data : JSON.stringify({color: "pink"}), 
        contentType : "application/json",
        success : function(){
            console.log("response for /color"+status);       
        }
    });

}

function togglemedium(colorname){
   var el = document.getElementById('colorname');
   if (el.firstChild.data == "Board Color" || el.firstChild.data == "Light Wood" || el.firstChild.data == "Dark Wood") {
       el.firstChild.data = "Medium Wood";
   }
    $.ajax({
        type: 'POST',
        url : '/color',
        dataType: "json",
        data : JSON.stringify({color: "blue"}), 
        contentType : "application/json",
        success : function(){
            console.log("response for /color"+status);       
        }
    });
}

function toggledark(colorname){
   var el = document.getElementById('colorname');
   if (el.firstChild.data == "Board Color" || el.firstChild.data == "Light Wood" || el.firstChild.data == "Medium Wood") {
       el.firstChild.data = "Dark Wood";
   }
    $.ajax({
        type: 'POST',
        url : '/color',
        dataType: "json",
        data : JSON.stringify({color: "purple"}), 
        contentType : "application/json",
        success : function(){
            console.log("response for /color"+status);       
        }
    });
}

function toggleplay1(handiname){
   var el = document.getElementById('handiname');
   if (el.firstChild.data == "Handicap" || el.firstChild.data == "Player 2") {
       el.firstChild.data = "Player 1";
   }
    $.ajax({
        type: 'POST',
        url : '/handi',
        dataType: "json",
        data : JSON.stringify({handi: 1}), 
        contentType : "application/json",
        success : function(){
            console.log("response for /handi"+status);       
        }
    });
}

function toggleplay2(handiname){
   var el = document.getElementById('handiname');
   if (el.firstChild.data == "Handicap" || el.firstChild.data == "Player 1") {
       el.firstChild.data = "Player 2";
   }
    $.ajax({
        type: 'POST',
        url : '/handi',
        dataType: "json",
        data : JSON.stringify({handi: 2}), 
        contentType : "application/json",
        success : function(){
            console.log("response for /handi"+status);       
        }
    });
}
