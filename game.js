/*
Made by: Alex Fattouche 
https://github.com/Fattouche/Go/
This File is responsible for all the game functionality.
The server will call specific functions like count score
and checkMove throughout the game.
*/


module.exports = {
    PlayMove:PlayMove,
	countScore:countScore
}

//This will check move and return a new board if valid move.
function PlayMove(prevBoard,board,x,y,color){
	var played=false;
	newboard = [];
	for(var i = 0; i < board.length; i++){
        newboard[i] = board[i].slice();
    }
	//check if the move is valid
	if(checkMove(prevBoard,newboard,x,y,color)){
		
		newboard[x][y]=color;
		newboard=cleanBoard(newboard);
		var played=true;
		console.log("played is true");
	}
	var state={
		Board:newboard,
		Played:played,
	}
	return state;
}

//Counts the score at the end of the game
function countScore(board) {
  //for every empty spot on the board, search for white/black tokens and change accordingly
  var player1score=0;
  var player2score=7.5;
  
  
   for (i = 0; i < board.length; i++) {
		for (j = 0; j < board.length; j++) {
			if(board[i][j]==99||board[i][j]==8){
					board[i][j]=0;
			}
		}
   }
   //We want to keep checking the territory on the original array and not the updated array
  var board2=JSON.parse(JSON.stringify(board));
  var boardTemp=JSON.parse(JSON.stringify(board));
  console.log(boardTemp);
  
  for (i = 0; i < board.length; i++) {
    for (j = 0; j < board.length; j++) {
		lastEncountered=0;
		sameEncountered=true;
	  if(board2[i][j]==0){
		board[i][j]=checkTerritory(board2,i,j);
		board2=JSON.parse(JSON.stringify(boardTemp));
	  }
	}
  }
	for (i = 0; i < board.length; i++) {
		for (j = 0; j < board.length; j++) {
			if (board[i][j] == 1) {
				player1score++;
			}
			if(board[i][j]==2){
				player2score++;
			}
		}
	}
  if(player1score>player2score){
	  var winner=1;
  }
  if(player2score>player1score){
	  var winner=2;
  }
  var EndGame={
	  Player1score:player1score,
	  Player2score:player2score,
	  Winner:winner
  }
  return EndGame;
}

//previousboard and newboard are the arrays, move is an object
//Previous board is the board state from before your opponents last turn
function checkMove(PreviousBoard, NewBoard, x, y, color) {
  //check that the spot is open
  console.log("inside checkMove");
  if (NewBoard[x][y]!== 0) {
  	  console.log(NewBoard[x][y]);
    return false;
  }
  
  //check that the KO rule hasnt been broken
  NewBoard[x][y]=color;
  if (PreviousBoard.toString() === NewBoard.toString()) {
	  console.log("KO KO KO!");
  		NewBoard[x][y] = 0;
		return false;
  }
  NewBoard[x][y]=0;
  //check that the token isnt suiciding
  if(color==1)
	  enemy=2
  if(color==2)
	  enemy=1
  board3=JSON.parse(JSON.stringify(NewBoard));
  if (isSurrounded(NewBoard, x, y, color)) {
	  console.log("Surrounded!");
		if(x-1>=0){
			board3[x][y]=color;
			if(isSurrounded(board3,x-1,y,enemy)){
				NewBoard[x-1][y]=0;
				return true;
				console.log("Surrounded1");
			}
			board3[x][y]=0;
		}
		if(7-1>=0){
			board3[x][y]=color;
			if(isSurrounded(board3,x,y-1,enemy)){
				NewBoard[x][y-1]=0;
				 console.log("Surrounded2");
				return true;
			}
			board3[x][y]=0;
		}
		if(y+1<board3.length){
			board3[x][y]=color;
			if(isSurrounded(board3,x,y+1,enemy)){
				NewBoard[x][y+1]=0;
				 console.log("Surrounded3");
				return true;
			}
			board3[x][y]=0;
		}
		if(x+1<board3.length){
			board3[x][y]=color;
			if(isSurrounded(board3,x+1,y,enemy)){
				NewBoard[x+1][y]=0;
				 console.log("Surrounded4");
				return true;
			}
			board3[x][y]=0;
		}
      return false;
  }
  console.log("inside 4");
  return true;
}

//remove any tokens that are now killed
function cleanBoard(board) {
  for (i = 0; i < board.length; i++) {
    for (j = 0; j < board.length; j++) {
      color = board[i][j];
	  if(color!=0){
		  if(color==1)
			var enemy=2;
		  if(color==2)
			var enemy=1;
		  if (isSurrounded(board, i, j, color)) {
			board[i][j] = 7;
		  }
	  }
    }
  }
  for (i = 0; i < board.length; i++) {
    for (j = 0; j < board.length; j++) {
		if(board[i][j]==7){
			board[i][j]=0;
		}
	}
  }
  
  return board;
}
lastEncountered=0;
sameEncountered=true;
//The main count score function
function checkTerritory(board,x,y){
	if(sameEncountered==false){
		return 0;
	}
	if(x-1>=0){
		if(board[x-1][y]==1){
			if(lastEncountered==0){
				lastEncountered=1;
			}
			if(lastEncountered==2){
				sameEncountered=false;
				return 0;
			}
		}
		if(board[x-1][y]==2){
			if(lastEncountered==0){
				lastEncountered=2;
			}
			if(lastEncountered==1){
				sameEncountered=false;
				return 0;
			}
		}
	}
	if(y+1<board.length&&sameEncountered==true){
		if(board[x][y+1]==1){
			if(lastEncountered==0){
				lastEncountered=1;
			}
			if(lastEncountered==2){
				sameEncountered=false;
				return 0;
			}
		}
		if(board[x][y+1]==2){
			if(lastEncountered==0){
				lastEncountered=2;
			}
			if(lastEncountered==1){
				sameEncountered=false;
				return 0;
			}
		}
	}
	if(x+1<board.length){
		if(board[x+1][y]==1){
			if(lastEncountered==0){
				lastEncountered=1;
			}
			if(lastEncountered==2){
				sameEncountered=false;
				return 0;
			}
		}
		if(board[x+1][y]==2){
			if(lastEncountered==0){
				lastEncountered=2;
			}
			if(lastEncountered==1){
				sameEncountered=false;
				return 0;
			}
		}
	}
	if(y-1>=0){
		if(board[x][y-1]==1){
			if(lastEncountered==0){
				lastEncountered=1;
			}
			if(lastEncountered==2){
				sameEncountered=false;
				return 0;
			}
		}
		if(board[x][y-1]==2){
			if(lastEncountered==0){
				lastEncountered=2;
			}
			if(lastEncountered==1){
				sameEncountered=false;
				return 0;
			}
		}
		
	}
	
	if(x-1>=0&&sameEncountered==true){
		if(board[x-1][y]==0){
			board[x][y]=99;
			lastEncountered=checkTerritory(board,x-1,y);
			if(lastEncountered==0){
				board[x][y]=8;
				return 0;
			}
			board[x][y]=8;
		}
	}
	
	if(y+1<board.length&&sameEncountered==true){
		if(board[x][y+1]==0){
			board[x][y]=99;
			lastEncountered=checkTerritory(board,x,y+1);
			if(lastEncountered==0){
				board[x][y]=8;
				return 0;
			}
			board[x][y]=8;
		}
	}
	if(x+1<board.length&&sameEncountered==true){
		if(board[x+1][y]==0){
			board[x][y]=99;
			lastEncountered=checkTerritory(board,x+1,y);
			if(lastEncountered==0){
				board[x][y]=8;
				return 0;
			}
			board[x][y]=8;
		}
	}
	
	if(y-1>=0&&sameEncountered==true){
		if(board[x][y-1]==0){
			board[x][y]=99;
			lastEncountered=checkTerritory(board,x,y-1);
			if(lastEncountered==0){
				board[x][y]=8;
				return 0;
			}
			board[x][y]=8;
		}
	}
	
	return lastEncountered;
}

//color is the token that you want to place there, would it be surrounded?
function isSurrounded(board, x, y, color) {
  //if one of the moves is empty then its not surrounded.
  if (y + 1 < board.length) {
    if (board[x][y + 1] === 0) {
      return false;
    }
  }
  if (x + 1 < board.length) {
    if (board[x + 1][y] === 0) {
      return false;
    }
  }
  if (y - 1 >= 0) {
    if (board[x][y - 1] === 0) {
      return false;
    }
  }
  if (x - 1 >= 0) {
    if (board[x - 1][y] === 0) {
      return false;
    }
  }
	
//recursively check if all of your allies are surrounded
  if (x - 1 >= 0) {
    if (board[x - 1][y] == color) {
      board[x][y] = 99;
      Surrounded = isSurrounded(board, x - 1, y, color);
      board[x][y] = color;
      if (!Surrounded) {
        return false;
      }

    }
  }

  if (x + 1 < board.length) {
    if (board[x + 1][y] == color) {
      board[x][y] = 99;
      Surrounded = isSurrounded(board, x + 1, y, color);
      board[x][y] = color;
      if (!Surrounded) {
        return false;
      }
    }
  }
  if (y + 1 < board.length) {
    if (board[x][y + 1] == color) {
      board[x][y] = 99;
      Surrounded = isSurrounded(board, x, y + 1, color);
      board[x][y] = color;
      if (!Surrounded) {
        return false;
      }
    }
  }
  if (y - 1 >= 0) {
    if (board[x][y - 1] == color) {
      board[x][y] = 99;
      Surrounded = isSurrounded(board, x, y - 1, color);
      board[x][y] = color;
      if (!Surrounded) {
        return false;
      }
    }
  }
  return true;
}
