"use strict";

var express    = require("express");
var bodyParser = require("body-parser");
var Storage = require('MongoDB');
var aiInterface = require("./aiInterface");
var game = require('./game');
var app = express();
var db = new Storage(null, null, 'group7');
// use the parse to get JSON objects out of the request. 
app.use(bodyParser.json());
// server static files from the public/ directory.
app.use(express.static('public'));


var board = {
    size:null,
    color:null,
    handicap: null,//always 4 tokens set to player 1 or 2
    mode: null // 2 is hot seat, 1 is play agianst AI
}
var player1 = {username : null,  type : null};//type could be guest/ai
var player2 = {username : null,  type : null};
var count = 0;
var pass = 0;
var boardState = generateBoard(); 
var oldBoard1 = [];
var oldBoard2 = [];
var lastMove = {x : 0, y : 0, c : 0, pass:false}; 
var islegal = null;
var turn = 1;// start with player 1, alternative change between 1 and 2
function generateBoard(){

    var state = {
        size : 0, 
        board  : [],
    }
    state.size = board.size;

    var tmp = []; 
    for(var i = 0; i < state.size; i++){
        tmp = []; 
        for(var j = 0; j < state.size; j++){
            tmp.push(Math.floor(Math.random()*(2 - 0 + 1))); 
        }
        state.board.push(tmp)
        oldBoard2.push(tmp);
        oldBoard1.push(tmp);
    }
    if(board.handicap == 1 ){
        if(board.size == 9){
            boardState.board[2][2] = 1;
            boardState.board[2][6] = 1;
            boardState.board[6][2] = 1;
            boardState.board[6][6] = 1;
        }
        if(board.size == 13){
            boardState.board[3][3] = 1;
            boardState.board[3][9] = 1;
            boardState.board[9][3] = 1;
            boardState.board[6][6] = 1;
        }
        if(board.size == 19){
            boardState.board[3][3] = 1;
            boardState.board[3][15] = 1;
            boardState.board[15][3] = 1;
            boardState.board[15][15] = 1;
        }

    }
     if(board.handicap == 2 ){
        if(board.size == 9){
            boardState.board[2][2] = 2;
            boardState.board[2][6] = 2;
            boardState.board[6][2] = 2;
            boardState.board[6][6] = 2;
        }
        if(board.size == 13){
            boardState.board[3][3] = 2;
            boardState.board[3][9] = 2;
            boardState.board[9][3] = 2;
            boardState.board[6][6] = 2;
        }
        if(board.size == 19){
            boardState.board[3][3] = 2;
            boardState.board[3][15] = 2;
            boardState.board[15][3] = 2;
            boardState.board[15][15] = 2;
        }

    }
    return state; 

}



/**
 * Handle a request for task data.
 */
app.get("/initBoard", function (req, res) {
    console.log("GET Request to: /initBoard");
    res.json(boardState); 
});
app.get("/accounts", function (req, res) {
    console.log("GET Request to: /accounts");
    
     db.getAllAccounts(function(err, data){
         if(err){
            res.status(500).send();
        }else{
            res.status(200).json(data);
        } 
     });   
});
app.get("/isLegal", function (req, res) {
    console.log("GET Request to: /isLegal");
    res.json(islegal); 
});
app.get("/move", function (req, res) {
    console.log("GET Request to: /move");
    res.json(boardState);
});

app.get("/aiMove", function (req, res) {
    console.log("GET Request to: /aiMove");
    getAiMove();
    res.json(boardState);
});

app.get("/turn", function (req, res) {
    console.log("GET Request to: /turn");
    res.json(turn);
});
app.get("/finish", function (req, res) {
    console.log("GET Request to: /finish");
    res.json(pass);
});
app.get("/score", function (req, res) {
    console.log("GET Request to: /score");
    var score  = game.countScore(boardState.board);
    res.json(score);
});
app.post("/mode", function (req, res) {
    console.log("Post Request to: /mode");
    console.log(typeof(req.body));
    console.log(req.body);
    board.mode = req.body;
    console.log(board.mode);
    res.status(200).send();
});
app.post("/initBoard", function (req, res) {
    console.log("Post Request to: /initBoard");
    var tempBoard = req.body;
    board.size = tempBoard.size;
    board.color = tempBoard.color;
    board.handicap = tempBoard.handicap;
    console.log(board);
    res.status(200).send();
});
app.post("/addAccount", function (req, res) {

    console.log("POST Request to: /addAccount");
    
    db.addAcccount(req.body, function(err){
        if(err){
            res.status(500).send();
        }else{
            res.status(200).send();
        }
    });
    
    res.status(200).send();
});
app.post("/checkMove", function (req, res) {

    console.log("POST Request to: /checkMove");
    var tempMove = JSON.parse(req.body);
    if(tempMove.pass == true){
        pass++;
    }else if(pass<2){
        pass = 0;
        isLegal = checkLegal(tempMove);
    }
    res.status(200).send();
});


app.post("/placeMove", function (req, res) {
    console.log("POST Request to: /placeMove");
    var tempMove = req.body;
    oldBoard1 = oldBoard2;
    oldBoard2 = boardState.board;
    console.log("aaaaaaaaa");
    console.log(toldBoard2);
    console.log(tempMove);
    if(tempMove.pass == true){
           console.log("bbbbbbbbbbb");
        pass++;
        if(turn == 1){
                turn ==2;
        }else{
                 turn = 1;
        }

    }else if(pass<2){
           console.log("ccccccc");
        pass = 0;
        var newBoard = game.PlayMove(oldBoard1,oldBoard2,tempMove.x,tempMove.y,tempMove.c);
        if(newBoard.played == true){
               console.log("dddddddd");
            lastmove.x = tempMove.x;
            lastmove.y = tempMove.y;
            lastmove.c = tempMove.c;
            boardState.board = newBoard.board;
            if(turn == 1){
                turn ==2;
            }else{
                 turn = 1;
            }
            count++;
            res.status(200).send();    
        }
        res.status(403).send();
    }
});
app.post("/players", function (req, res) {

    console.log("POST Request to: /players");
    var temp = req.body;
    console.log(temp);
    console.log(typeof(temp));
    player1.username = temp[0].username;
    player1.type = temp[0].type;
    player2.username = temp[1].username;
    player2.type = temp[1].type;
    console.log(player1);
    console.log(player2);
    res.status(200).send();
});
app.post("/account", function (req, res){
     db.updateAccount(req.body, function(err){
        if(err){
            res.status(500).send();
        }else{
            res.status(200).send();
        }
    });
});
app.listen(process.env.PORT || 3000, function () {
    console.log("Listening on port 3000");
});

function getAiMove(){
    aiInterface.getRandomMove(boardState.size, boardState.board, lastMove, function(move){
        if(move.pass == true){
            pass++;
            if(turn == 1){
             turn ==2;
            }else{
                turn = 1;
            }
        }else if(pass<2){
            pass = 0;
            var newBoard = game.PlayMove(oldBoard1,oldBoard2,move.x,move.y,move.c);
            if(newBoard.played == true){
                lastmove.x = move.x;
                lastmove.y = move.y;
                lastmove.c = move.c;
                boardState.board = newBoard.board;
                if(turn == 1){
                    turn ==2;
                }else{
                     turn = 1;
                }
            count++;       
            }
        getAiMove();
        }
    });
}
