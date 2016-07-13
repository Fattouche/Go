
/**
 * Requests a new board state from the server's /data route.
 * 
 * @param cb {function} callback to call when the request comes back from the server.
 */
 function getAccount(cb){
    $.get("/data", function(data, textStatus, xhr){
        console.log("Response for /data: "+textStatus);  

        // handle any errors here....

        // draw the board....
        cb(data);  

    }); 
}

var mode = 0;
var player1 = {username: null,type:null}; 
var player2 = {username: null,type:null}
function twoPlayer(){
   mode = 2;
    $.ajax({
        type: 'POST',
        url : '/mode',
        dataType: "json",
        data : JSON.stringify(mode), 
        contentType : "application/json",
        success : function(){
            console.log("Response for /move" +status);            
        }
    });
}
function onePlayer(){
   mode = 1;
    $.ajax({
        type: 'POST',
        url : '/mode',
        dataType: "json",
        data : JSON.stringify(mode), 
        contentType : "application/json",
        success : function(){
            console.log("Response for /move"+status);            
        }
    });
}
function aiGuest(){
    console.log("aaaaa ");  
    player1.type = "guest";
    player2.type = "ai";
    var players = [player1,player2];
    postPlayers(players);
}
function aiLogin(){
    player1.type = "login";
    player1.username = "";
    player2.type = "ai";
    var players = [player1,player2];
    postPlayers(players);
}
function logins(){
    player1.type = "login";
    play1.username = "";
    player2.type = "login";
    player2.username = "";
    var players = [player1,player2];
    postPlayers(players);
}
function guestes(){
    player1.type = "guest";
    player2.type = "guest";
    var players = [player1,player2];
    postPlayers(players);
}
function initBoard(){
    var color = "pink";
    var size = 9;
     $.ajax({
        type: 'POST',
        url : '/initBoard',
        dataType: "json",
        data : JSON.stringify({size:size,color:color}), 
        contentType : "application/json",
        success : function(){
            console.log("response for /players"+status);
             
        }
    });
}
function startGame(){
    $.get("/initBoard", function(data, textStatus, xhr){
        console.log("Response for /initBoard: "+textStatus);  
        drawBoard(data);  
    }); 
}
function play(){
    var move = {x:0,y:0,c:1, pass:false};
     $.get("/turn", function(data, textStatus, xhr){
        console.log("Response for /turn: "+textStatus);  
        turn = data;
    }); 
    $.ajax({
        type: 'POST',
        url : '/placeMove',
        dataType: "json",
        data : JSON.stringify(move), 
        contentType : "application/json",
        error : function(){
            //remind error ilegal move 
            play();
        },
        success : function(){
            console.log("response for /players"+status);
            $.get("/move", function(data, textStatus, xhr){
                console.log("Response for /data: "+textStatus);  
                drawBoard(data,turn);  
             }); 
        }
    });
    nextPlayer();

}
function pass(){
  var move = {x:0,y:0,c:0, pass:true};
    var turn = 0;
    $.get("/turn", function(data, textStatus, xhr){
        console.log("Response for /turn: "+textStatus);  
        turn = data;
    }); 
     $.ajax({
        type: 'POST',
        url : '/placeMove',
        dataType: "json",
        data : JSON.stringify(move), 
        contentType : "application/json",
        error : function(){
            //remind error ilegal move 
            play();
        },
        success : function(){
            console.log("response for /placeMove"+status);      
        }

    });
     nextPlayer();
}
/**
 * Draws the board to the #canvas element on the page. 
 *
 * You may find the following links helpful: 
 *  - https://api.jquery.com/
 *  - https://api.jquery.com/append/
 *  - http://www.tutorialspoint.com/jquery/
 *  - http://www.w3schools.com/jquery/ 
 *
 * @param state {object} - an object representing the state of the board.  
 */ 
function drawBoard(state,turn){

    var canvas = $("#canvas"); 
	
	$(document).ready(function(e) {
    $('#canvas').click(function(e) {
        //alert(e.pageX+ ' , ' + e.pageY);
		if(turn==1){
			 var posX = $(this).position().left,posY = $(this).position().top;
			 alert( (e.pageX - posX-254) + ' , ' + (e.pageY - posY-94));
			svg.append(makeCircle((e.pageX - posX-254),(e.pageY - posY-94),10,'blue'));
			return;
		}
		if(turn==2){
			var posX = $(this).position().left,posY = $(this).position().top;
			alert( (e.pageX - posX-254) + ' , ' + (e.pageY - posY-94));
			svg.append(makeCircle((e.pageX - posX-254),(e.pageY - posY-94),10,'red'));
			return;
		}
		
    });   
	});

    // Change the height and width of the board here...
    // everything else should adapt to an adjustable
    // height and width.
    var W = 600, H = 600; 
    canvas.css("height", H); 
    canvas.css("width", W);

    // The actual SVG element to add to. 
    // we make a jQuery object out of this, so that 
    // we can manipulate it via calls to the jQuery API. 
    var svg = $(makeSVG(W, H));
	var arr = state.board;
    var size = state.size;
    // TODO: Implement board drawing. 
    
    //  You will want to append elements to the 
    //  svg variable using the svg.append(....) 
    //  method. 
	var lines = (W/(size+1));
    var space = lines;
    svg.append(makeRectangle(lines, lines, W-2*lines, W-2*lines, 'lavender'));
    var i=1;
    while(i<=size){
        svg.append(makeLine(lines, space, W-lines, space, 'black', 'rgb(255,0,0)'));
        svg.append(makeLine(space, lines, space, W-lines, 'black', 'rgb(255,0,0'));
        space += lines;
        i++
    }
	
	
    for(var i=0; i<arr.length; i++){
        var len = arr[i].length;
        for(var j=0; j<len; j++){
            if(arr[i][j] == 1){
                svg.append(makeCircle(lines + lines*i, (lines+lines*j), 10, 'blue'));
            }
            if(arr[i][j] == 2){
                 svg.append(makeCircle(lines+lines*i, lines+lines*j, 10, 'red'));
            }

        }
    }
	
    // append the svg object to the canvas object.
    canvas.append(svg);

}
function postPlayers(players){

    console.log(players);  
    $.ajax({
        type: 'POST',
        url : '/players',
        dataType: "json",
        data : JSON.stringify(players), 
        contentType : "application/json",
        success : function(){
            console.log("response for /players"+status);
             
        }
    });
}
function nextPlayer(){
    $.get("/turn", function(data, textStatus, xhr){
        console.log("Response for /data: "+textStatus);  
        if(data == 2){
            if(player2.type == "ai"){
                $.get("/aimove", function(data, textStatus, xhr){
                console.log("Response for /aimove: "+textStatus);  
                drawBoard(data,2);  
                }); 
            }
        } 
    }); 
}
function init(){

    // do page load things here...

    console.log("Initalizing Page...."); 
    getData(drawBoard); 
}
