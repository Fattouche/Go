
 function getAccount(cb){
    $.get("/data", function(data, textStatus, xhr){
        console.log("Response for /data : "+textStatus);  



    }); 
}
var mode = 0;//mode 1 == 1 player, mode 2 == 2 players
//post mode == 2
function twoPlayer(){
   mode = 2;
    $.ajax({
        type: 'POST',
        url : '/mode',
        data : JSON.stringify({mode : mode}), 
        contentType : "application/json",
        success : function(){
            console.log("Response for /mode : " +status);            
        }
    });
}
// post mode == 1
function onePlayer(){
   mode = 1;
    $.ajax({
        type: 'POST',
        url : '/mode',
        data : JSON.stringify({mode : mode}), 
        contentType : "application/json",
        success : function(){
            console.log("Response for /mode : "+status);            
        }
    });
}


 player1 = {username: null,type:null}; //type could be "guest"."ai"."login"
 player2 = {username: null,type:null};

// post player1 and player2 with their usename and type to server
function postPlayers(players){

    $.ajax({
        type: 'POST',
        url : '/players',
        data : JSON.stringify(players), 
        contentType : "application/json",
        success : function(textStatus){
            console.log("response for /players : "+textStatus);         
        }
    });
}
function aiGuest(){
    console.log("ai and guest ");  
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
function guests(){
    player1.type = "guest";
    player2.type = "guest";
    var players = [player1,player2];
    postPlayers(players);
}



function init(){
    var isPlayAgainstAi = false;
    $.get("/board", function(data, textStatus, xhr){
        console.log("Response for /board : "+textStatus);  
        $(document).ready(function(){
        if(data.color== "lightwood"){
            $("#canvas").css('background-image','url("../css/lightwood.png")');
        }
        if(data.color== "mediumwood"){
            $("#canvas").css('background-image','url("../css/mediumwood.png")');
        }
        if(data.color == "darkwood"){
            $("#canvas").css('background-image','url("../css/darkwood.png")');
        }
        });       
    }); 
    $.get("/initBoard", function(data, textStatus, xhr){
        console.log("Response for /initBoard : "+textStatus); 
        canvas = $("#canvas"); 
        W = 600, H = 600; 
        canvas.css("height", H); 
        canvas.css("width", W);
        svg = $(makeSVG(W, H));
        drawBoard(data,click);
    }); 
}


function play(loc){
    var move = {x : loc.x , y :  loc.y , c : 0 , pass : false};
    var play = null;
    console.log("play........");
   
     $.get("/turn", function(data, textStatus, xhr){
        console.log("Response for /turn: "+textStatus);
         console.log(data);

        if(data.c == 2 && data.type == "ai"){
            console.log("llllllllllllll");
            setTimeout(function() {
                $.get("/aimove", function(data, textStatus, xhr){
                    console.log("Response for /aimove: "+textStatus); 
                    console.log(data.board); 
                    $('svg').remove();
                    drawBoard(data,click);  
                }); 
            }, 1000); 
        }else{
            console.log("helloooooo"); 
            move.c = data.c;
            console.log(move);
            $.ajax({
                type: 'POST',
                url : '/placeMove',
                data : JSON.stringify(move), 
                contentType : "application/json",
                error : function(){
                        $('.fade_div').finish().show().delay(1000).fadeOut("slow");    
                },
                success : function(data, textStatus, xhr){
                    console.log("response for /placeMove:"+textStatus);
                    $.get("/move", function(data, textStatus, xhr){
                            console.log("Response for /move: "+textStatus);
                            temp = data;
                            $.get("/board", function(data, textStatus, xhr){
                                console.log("Response for /board : "+textStatus);  
                                if(data.mode == 1){
                                    console.log("eeeeee");
                                    $('svg').remove();
                                    console.log(temp.board);
                                    drawNewBoard(temp);
                                }
                                else{
                                    console.log("mmmmmm");
                                    $('svg').remove();
                                    drawBoard(temp,click);
                                }
                            });       
                    }); 
                }
            });
        }
    }); 
}

function pass(){
  var move = {x : 0,y : 0, c : 0, pass:true};
    $.get("/turn", function(data, textStatus, xhr){
        console.log("Response for /turn: "+textStatus);  
        move.c = data.c;
        var temp = data.type;
        $.ajax({
            type: 'POST',
            url : '/placeMove', 
            data : JSON.stringify(move), 
            contentType : "application/json",
            success : function(){
                console.log("response for /placeMove"+status);
                $.get("/finish", function(data, textStatus, xhr){
                    console.log("Response for /finish: "+textStatus); 
                    if(data.pass == 2){
                        $.get("/score", function(data, textStatus, xhr){
                            console.log("Response for /score: "+textStatus); 
                            console.log(data.score);
                         });  
                    }else{
                        $.get("/move", function(data, textStatus, xhr){
                            console.log("Response for /move: "+textStatus);
                            temp = data;
                            $.get("/board", function(data, textStatus, xhr){
                                console.log("Response for /board : "+textStatus);  
                                if(data.mode == 1 && temp != "ai"){
                                    console.log("wwwwww");
                                    $('svg').remove();
                                    drawNewBoard(temp);
                                }
                                else{
                                    console.log("yyyyyyyy");
                                    $('svg').remove();
                                    drawBoard(temp,click);
                                }
                            });       
                        });    
                    }     
                });     
            }
        });
    });    
}



function drawBoard(state,cb){
    console.log("drawBoarddddd");

    size=state.size;
    svg = $(makeSVG(W, H));
    arr =  [];
    for(var i = 0; i < state.size; i++){
        arr[i] =  state.board[i].slice();
    }
    lines = (W/(size+1));
    space = lines;
    //svg.append(makeRectangle(lines, lines, W-2*lines, W-2*lines,"lightwood"));
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
             svg.append(makeInvisCircle(lines+lines*i, lines+lines*j, 14, 'red'));
            if(arr[j][i] == 1){
                svg.append(makeCircle(lines + lines*i, (lines+lines*j), 14, 'white'));
            }
            if(arr[j][i] == 2){
                 svg.append(makeCircle(lines+lines*i, lines+lines*j, 14, 'black'));
            }
           
        }
    }
    
    // append the svg object to the canvas object.
    canvas.append(svg);   
    cb(play);

}

function drawNewBoard(state){
    console.log("drawNewBoarddddd");

    size=state.size;
    svg = $(makeSVG(W, H));
    arr =  [];
    for(var i = 0; i < state.size; i++){
        arr[i] =  state.board[i].slice();
    } 
    lines = (W/(size+1));
    space = lines;
    //svg.append(makeRectangle(lines, lines, W-2*lines, W-2*lines,"lightwood"));
    var i=1;
    while(i<=size){
        svg.append(makeLine(lines, space, W-lines, space, 'white', 'rgb(255,0,0)'));
        svg.append(makeLine(space, lines, space, W-lines, 'white', 'rgb(255,0,0'));
        space += lines;
        i++
    }
    
    
    for(var i=0; i<arr.length; i++){
        var len = arr[i].length;
        for(var j=0; j<len; j++){
             svg.append(makeInvisCircle(lines+lines*i, lines+lines*j, 14, 'red'));
            if(arr[j][i] == 1){
                svg.append(makeCircle(lines + lines*i, (lines+lines*j), 14, 'white'));
            }
            if(arr[j][i] == 2){
                 svg.append(makeCircle(lines+lines*i, lines+lines*j, 14, 'black'));
            }
           
        }
    }
    // append the svg object to the canvas object.
    canvas.append(svg);   
    play({x : 0, y : 0});

}



function click(cb){
    var move={x : 0, y : 0, c : 0};    
     console.log("click........");
    $(document).ready(function(e) {
        $('svg').click(function(e) {
            console.log("hhhhh");
            if(size== 9){
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
                move.y=(nposX/60)-1;
               // arr[((nposY/60)-1)][((nposX/60)-1)]= 1;
               console.log("call play1");
                cb(move);
            }
            if(size == 13){
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
                if(nposY > 565){
                    nposY = 558;
                }
                if(nposX > 565){
                    nposX = 558;
                }
                move.x=((nposY/43)-1);
                move.y=((nposX/43)-1);
				//arr[((nposY/43)-1)][((nposX/43)-1)]= 1;
				console.log("call play2");
                cb(move);
            }
            if(size==19){
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
                if(nposY > 575){
                    nposY = 569;
                }
                if(nposX > 575){
                    nposX = 569;
                }
				move.x=(nposY/30)-1;
				move.y=(nposX/30)-1;
                //arr[((nposY/30)-1)][((nposX/30)-1)]= 1;
                console.log("call play3");
                cb(move);
            }
        });   
    });
}
