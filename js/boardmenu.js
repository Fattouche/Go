function playGo() {
    window.location = 'index.html'
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

}

function toggle13(sizename){
   var el = document.getElementById('sizename');
   if (el.firstChild.data == "Board Size" || el.firstChild.data == "9x9" || el.firstChild.data == "19x19") {
       el.firstChild.data = "13x13";
   }
}

function toggle19(sizename){
   var el = document.getElementById('sizename');
   if (el.firstChild.data == "Board Size" || el.firstChild.data == "9x9" || el.firstChild.data == "13x13") {
       el.firstChild.data = "19x19";
   }
}

function togglelight(colorname){
   var el = document.getElementById('colorname');
   if (el.firstChild.data == "Board Color" || el.firstChild.data == "Medium Wood" || el.firstChild.data == "Dark Wood"){
       el.firstChild.data = "Light Wood";
   }
}

function togglemedium(colorname){
   var el = document.getElementById('colorname');
   if (el.firstChild.data == "Board Color" || el.firstChild.data == "Light Wood" || el.firstChild.data == "Dark Wood") {
       el.firstChild.data = "Medium Wood";
   }
}

function toggledark(colorname){
   var el = document.getElementById('colorname');
   if (el.firstChild.data == "Board Color" || el.firstChild.data == "Light Wood" || el.firstChild.data == "Medium Wood") {
       el.firstChild.data = "Dark Wood";
   }
}

function toggleplay1(handiname){
   var el = document.getElementById('handiname');
   if (el.firstChild.data == "Handicap" || el.firstChild.data == "Player 2") {
       el.firstChild.data = "Player 1";
   }
}

function toggleplay2(handiname){
   var el = document.getElementById('handiname');
   if (el.firstChild.data == "Handicap" || el.firstChild.data == "Player 1") {
       el.firstChild.data = "Player 2";
   }
}
