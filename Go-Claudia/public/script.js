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
function play(loc){
    var move = {x:loc.x,y:loc.y,c:loc.color, pass:false};
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
            $('.fade_div').finish().show().delay(1000).fadeOut("slow"); 
            play();
        },
        success : function(){
            changeTurnText(counter);
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
    size=state.size;
    canvas = $("#canvas"); 
    
    

    // Change the height and width of the board here...
    // everything else should adapt to an adjustable
    // height and width.
     W = 600, H = 600; 
    canvas.css("height", H); 
    canvas.css("width", W);

    // The actual SVG element to add to. 
    // we make a jQuery object out of this, so that 
    // we can manipulate it via calls to the jQuery API. 
     svg = $(makeSVG(W, H));
     arr = state.board;
    size = state.size;
    // TODO: Implement board drawing. 
    
    //  You will want to append elements to the 
    //  svg variable using the svg.append(....) 
    //  method. 
     lines = (W/(size+1));
     space = lines;
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

function changeTurnText(counter)
{
    if(counter==2){
        document.getElementById('Turn').innerHTML = 'Player 1 Turn!';
    }
    else
    if(counter==1){
        document.getElementById('Turn').innerHTML = 'Player 2 Turn!';
    }
}


//function click(){
counter=1;
move={
        x:0,
        y:0,
        color:0
    }
    
$(document).ready(function(e) {
    $('#canvas').click(function(e) {
    console.log("hhhhh");
    if(size== 9){
        console.log("099");
        if(counter==1){
            console.log("aa");
            var posX = $(this).offset().left,posY = $(this).offset().top;
            ax =(e.pageX-posX)%60;
            ay = (e.pageY-posY)%60;
            if(ax<30){
            nposX = Math.floor((e.pageX-posX)/60)*60;
            }
            if(ay<30){
            nposY = Math.floor((e.pageY-posY)/60)*60;
            }
            if(ax>30){
                nposX = Math.ceil((e.pageX-posX)/60)*60;
            }
            if(ay>30){
                nposY = Math.ceil((e.pageY-posY)/60)*60;
            }
            if(nposY == 0){
                nposY = nposY+60;
            }
            if(nposX == 0){
                nposX = nposX+60;
            }
            if(nposY > 540){
                nposY = 540;
            }
            if(nposX > 540){
                nposX = 540;
            }
            move.x=(nposY/60)-1;
            console.log(move.x);
            move.y=(nposX/60)-1;
            move.color=counter;
            //alert(((nposY/60)-1) + ' , ' + ((nposX/60)-1));
            svg.append(makeCircle((nposX), (nposY), 10, 'blue'));
            arr[((nposY/60)-1)][((nposX/60)-1)]= 1;
            counter =2;
            return move;
        }
        if(counter==2){
            var posX = $(this).offset().left,posY = $(this).offset().top;
            ax =(e.pageX-posX)%60;
            ay = (e.pageY-posY)%60;
            if(ax<30){
            nposX = Math.floor((e.pageX-posX)/60)*60;
            }
            if(ay<30){
            nposY = Math.floor((e.pageY-posY)/60)*60;
            }
            if(ax>30){
                nposX = Math.ceil((e.pageX-posX)/60)*60;
            }
            if(ay>30){
                nposY = Math.ceil((e.pageY-posY)/60)*60;
            }
            if(nposY == 0){
                nposY = nposY+60;
            }
            if(nposX == 0){
                nposX = nposX+60;
            }
            if(nposY > 540){
                nposY = 540;
            }
            if(nposX > 540){
                nposX = 540;
            }
            //alert(((nposY/60)-1) + ' , ' + ((nposX/60)-1));
            //svg.append(makeCircle((nposX), (nposY), 10, 'red'));
            move.x=((nposY/60)-1);
            move.y=((nposX/60)-1);
            move.color=counter;
            arr[((nposY/60)-1)][((nposX/60)-1)]= 2;
            counter=1;
            return move;;
        }
    }
    if(size == 13){
        if(counter==1){
            var posX = $(this).offset().left,posY = $(this).offset().top;
            ax =(e.pageX-posX)%43;
            ay = (e.pageY-posY)%43;
            if(ax<21){
            nposX = Math.floor((e.pageX-posX)/43)*43;
            }
            if(ay<21){
            nposY = Math.floor((e.pageY-posY)/43)*43;
            }
            if(ax>21){
                nposX = Math.ceil((e.pageX-posX)/43)*43;
            }
            if(ay>21){
                nposY = Math.ceil((e.pageY-posY)/43)*43;
            }
            if(nposY == 0){
                nposY = nposY+43;
            }
            if(nposX == 0){
                nposX = nposX+43;
            }
            if(nposY > 558){
                nposY = 558;
            }
            if(nposX > 558){
                nposX = 558;
            }
            alert(((nposY/43)-1) + ' , ' + ((nposX/43)-1));
            svg.append(makeCircle((nposX), (nposY), 10, 'blue'));
            move.x=((nposY/60)-1);
            move.y=((nposX/60)-1);
            move.color=counter;
            arr[((nposY/43)-1)][((nposX/43)-1)]= 1;
            counter =2;
            return move;
        }
        if(counter==2){
            var posX = $(this).offset().left,posY = $(this).offset().top;
            ax =(e.pageX-posX)%43;
            ay = (e.pageY-posY)%43;
            if(ax<21){
            nposX = Math.floor((e.pageX-posX)/43)*43;
            }
            if(ay<21){
            nposY = Math.floor((e.pageY-posY)/43)*43;
            }
            if(ax>21){
                nposX = Math.ceil((e.pageX-posX)/43)*43;
            }
            if(ay>21){
                nposY = Math.ceil((e.pageY-posY)/43)*43;
            }
            if(nposY == 0){
                nposY = nposY+43;
            }
            if(nposX == 0){
                nposX = nposX+43;
            }
            if(nposY > 558){
                nposY = 558;
            }
            if(nposX > 558){
                nposX = 558;
            }
            //alert(((nposY/43)-1) + ' , ' + ((nposX/43)-1));
            //svg.append(makeCircle((nposX), (nposY), 10, 'red'));
            arr[((nposY/43)-1)][((nposX/43)-1)]= 2;
            move.counter=1;
            move.x=(nposY/43)-1;
            move.y=(nposX/43)-1;
            color=counter;
            return move;
        }
    }
    if(size==19){
        if(counter==1){
            var posX = $(this).offset().left,posY = $(this).offset().top;
            ax =(e.pageX-posX)%30;
            ay = (e.pageY-posY)%30;
            if(ax<15){
            nposX = Math.floor((e.pageX-posX)/30)*30;
            }
            if(ay<15){
            nposY = Math.floor((e.pageY-posY)/30)*30;
            }
            if(ax>15){
                nposX = Math.ceil((e.pageX-posX)/30)*30;
            }
            if(ay>15){
                nposY = Math.ceil((e.pageY-posY)/30)*30;
            }
            if(nposY == 0){
                nposY = nposY+30;
            }
            if(nposX == 0){
                nposX = nposX+30;
            }
            if(nposY > 569){
                nposY = 569;
            }
            if(nposX > 569){
                nposX = 569;
            }
            move.x=(nposY/30)-1;
            move.y=(nposX/30)-1;
            move.color=counter;
            arr[((nposY/30)-1)][((nposX/30)-1)]= 1;
            counter =2;
            return move;
        }
        if(counter==2){
            var posX = $(this).offset().left,posY = $(this).offset().top;
            ax =(e.pageX-posX)%30;
            ay = (e.pageY-posY)%30;
            if(ax<15){
            nposX = Math.floor((e.pageX-posX)/30)*30;
            }
            if(ay<15){
            nposY = Math.floor((e.pageY-posY)/30)*30;
            }
            if(ax>15){
                nposX = Math.ceil((e.pageX-posX)/30)*30;
            }
            if(ay>15){
                nposY = Math.ceil((e.pageY-posY)/30)*30;
            }
            if(nposY == 0){
                nposY = nposY+30;
            }
            if(nposX == 0){
                nposX = nposX+30;
            }
            if(nposY > 569){
                nposY = 569;
            }
            if(nposX > 569){
                nposX = 569;
            }
            move.x=((nposY/30)-1);
            move.y=((nposX/30)-1);
            move.color=counter;
            arr[((nposY/30)-1)][((nposX/30)-1)]= 2;
            counter=1;
            return move;
        }
        console.log(move);
    play(move);
    }
    
    });   
    
});
    
//}


function init(){

    // do page load things here...

    console.log("Initalizing Page...."); 
    //getData(drawBoard); 
    startGame();
}