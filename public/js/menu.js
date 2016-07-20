function createAcc1(){
  div_hide();
  div_hide1();
  div_show3();
}

function createAcc2(){
  div_hide();
  div_hide1();
  div_show3();
}

function createLogin2(){
  div_hide3();
  div_show();
  $('#form3').find('#name4').val('');
}

function createLogin1(){
  div_hide3();
  div_show1();
  $('#form3').find('#name4').val('');
}

function playGuest(){
  window.location = 'boardmenu.html';
}

function check_empty() {
  if (document.getElementById('name1').value == "" || document.getElementById('name2').value == "") {
  alert("Fill All Fields !");
  } else {
      // document.getElementById('form').submit();
      window.location = 'boardmenu.html';
  }
}

//Function To Display Popup
function div_show3() {
  document.getElementById('create').style.display = "block";
}

//Function to Hide Popup
function div_hide3(){
  document.getElementById('create').style.display = "none";
}

// Validating Empty Field
function check_empty3() {
  if (document.getElementById('name4').value == "") {
  alert("Fill All Fields !");
  } else {
    postAccounts();
    getMainAccounts();
    $.get("/board", function(data, textStatus, xhr){
        if(data.mode == 2){
            createLogin2();
        }
        if(data.mode == 1){
            createLogin1();
        }

    });

  }
}

// Validating Empty Field
function check_empty4() {
  if (document.getElementById('name4').value == "") {
  alert("Fill All Fields !");
  } else {
      // document.getElementById('form1').submit();
      createLogin1();
  }
}

//Function To Display Popup
function div_show() {
  document.getElementById('abc').style.display = "block";
}

//Function to Hide Popup
function div_hide(){
  document.getElementById('abc').style.display = "none";
}

// Validating Empty Field
function check_empty1() {
  if (document.getElementById('name3').value == "") {
  alert("Fill All Fields !");
  } else {
      document.getElementById('form1').submit();
      window.location = 'boardmenu.html';
  }
}

//Function To Display Popup
function div_show1() {
  document.getElementById('abc1').style.display = "block";
}

//Function to Hide Popup
function div_hide1(){
  document.getElementById('abc1').style.display = "none";
}



$("#submit2").click(function () {
   var user1 = $('#name1').val();
   var user2 = $('#name2').val();
   var mode = {username1: user1, username2: user2, win1: 0, win2: 0}
   $.ajax({
      type: 'POST',
      url : '/addAccount',
      dataType: "json",
      data : JSON.stringify(mode),
      contentType : "application/json",
      success : function(){
          console.log("Response for /addAccount" +status);
      }
  });
      $('#form').find('#name1').val('');
      $('#form').find('#name2').val('');
});


$("#submit1").click(function () {
   var user = $('#name3').val();
   var mode = {username: user, win: 0}
   $.ajax({
      type: 'POST',
      url : '/addAccount',
      dataType: "json",
      data : JSON.stringify(mode),
      contentType : "application/json",
      success : function(){
          console.log("Response for /addAccount" +status);
      }
  });
      $('#form1').find('#name3').val('');
});