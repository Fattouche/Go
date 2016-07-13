module.exports = {
    PlayMove:PlayMove,
	countScore:countScore
}

function PlayMove(prevBoard,board,x,y,color){
	var played=false;
	if(checkMove(prevBoard,board,x,y,color)){
		board[x][y]=color;
		board=cleanBoard(board);
		var played=true;
	}
	var state={
		Board:board,
		Played:played,
	}
	return state;
}


function countScore(board) {
  //for every empty spot on the board, search for white/black tokens and change accordingly
  var player1score=0;
  var player2score=0;
  for (i = 0; i < board.length; i++) {
    for (j = 0; j < board.length; j++) {
		lastEncountered=0;
		sameEncountered=true;
	  if(board[i][j]==0){
		board[i][j]=checkTerritory(board,i,j);
	  }
	}
  }
	for (i = 0; i < board.length; i++) {
		for (j = 0; j < board.length; j++) {
			if(board[i][j]==99){
				board[i][j]=0;
			}
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
	  Playe2score:player2score,
	  Winner:winner
  }
  return EndGame;
}

//previousboard and newboard are the arrays, move is an object
//Previous board is the board state from before your opponents last turn
function checkMove(PreviousBoard, NewBoard, x, y, color) {
  //check that the spot is open
  console.log(typeof(NewBoard));
  console.log(NewBoard);
  console.log(NewBoard[0][0]);
  if (NewBoard[x][y]!== 0) {
    return false;
  }
  
  //check that the KO rule hasnt been broken
  NewBoard[x][y]=color;
  if (PreviousBoard.toString() === NewBoard.toString()) {
		return false;
  }
  NewBoard[x][y]=0;
  //check that the token isnt suiciding
  if (isSurrounded(NewBoard, x, y, color)) {
    return false;
  }
  return true;
}

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
			board[i][j] = enemy;
		  }
	  }
    }
  }
  return board;
}

lastEncountered=0;
sameEncountered=true;
function checkTerritory(board,x,y){
	if(sameEncountered==false){
		return 0;
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
		if(board[x][y+1]==0){
			board[x][y]=99;
			lastEncountered=checkTerritory(board,x,y+1);
			if(lastEncountered==0){
				return 0;
			}
			board[x][y]=0;
		}
	}
	if(x+1<board.length&&sameEncountered==true){
		if(board[x+1][y]==0){
			board[x][y]=99;
			lastEncountered=checkTerritory(board,x+1,y);
			if(lastEncountered==0){
				return 0;
			}
			board[x][y]=0;
		}
	}
	
	if(y-1>=0&&sameEncountered==true){
		if(board[x][y-1]==0){
			board[x][y]=99;
			lastEncountered=checkTerritory(board,x,y-1);
			if(lastEncountered==0){
				return 0;
			}
			board[x][y]=0;
		}
	}
	
	if(x-1>=0&&sameEncountered==true){
		if(board[x-1][y]==0){
			board[x][y]=99;
			lastEncountered=checkTerritory(board,x-1,y);
			if(lastEncountered==0){
				return 0;
			}
			board[x][y]=0;
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
  if (y - 1 > 0) {
    if (board[x][y - 1] === 0) {
      return false;
    }
  }
  if (x - 1 > 0) {
    if (board[x - 1][y] === 0) {
      return false;
    }
  }

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


/*var assert = require('assert');

describe('EndGame',function(){
	
	var arr = new Array(9);
	for(i=0;i<9;i++){
		arr[i]=new Array(9);
	}
		for(i=0;i<9;i++){
			for(j=0;j<9;j++){
				arr[i][j]=0;
			}
		}
	var arr1 = new Array(9);
	for(i=0;i<9;i++){
		arr1[i]=new Array(9);
	}
		for(i=0;i<9;i++){
			for(j=0;j<9;j++){
				arr1[i][j]=0;
			}
		}
		arr1[1][3]=1;
		
	arr[0][5]=1;
	arr[1][5]=1;
	arr[2][5]=1;
	arr[3][5]=1;
	arr[3][4]=1;
	arr[2][3]=1;
	arr[2][2]=1;
	arr[2][1]=1;
	arr[3][1]=2;
	arr[3][0]=1;
	arr[4][0]=1;
	arr[5][0]=1;
	arr[6][0]=1;
	arr[6][1]=1;
	arr[6][2]=1;
	arr[3][4]=1;
	arr[3][5]=1;
	arr[3][6]=1;
	arr[3][7]=1;
	arr[3][8]=1;
	arr[4][6]=1;
	arr[4][7]=1;
	arr[5][7]=1;
	arr[5][8]=1;
	arr[6][8]=1;
	arr[6][4]=1;
	
	
	
	
	arr[0][6]=2;
	arr[1][6]=2;
	arr[2][6]=2;
	arr[2][7]=2;
	arr[2][8]=2;
	arr[7][0]=2;
	arr[7][1]=2;
	arr[7][2]=2;
	arr[7][3]=2;
	arr[6][3]=2;
	arr[5][2]=2;
	arr[5][1]=2;
	arr[4][1]=2;
	arr[3][2]=2;
	arr[3][3]=2;
	arr[4][3]=2;
	arr[4][4]=2;
	arr[4][5]=2;
	arr[5][6]=2;
	arr[6][6]=2;
	arr[6][7]=2;
	arr[7][7]=2;
	arr[7][8]=2;
	arr[2][0]=2;
	arr[1][8]=2;
	
	/*
	//console.log(isSurrounded(arr,3,5,1));
	//console.log(arr);
	//console.log(checkTerritory(arr,1,0));
	//console.log(arr[1][0]);
	//console.log(checkTerritory(arr,1,0));
	//console.log(countScore(arr));
	//console.log(checkMove(arr1,arr,1,7,1));
	arr[1][7]=1;
	arr[0][5]=2;
	arr[8][4]=2;
	arr=cleanBoard(arr);
	console.log(arr);
	state=PlayMove(arr1,arr,4,2,1);
	console.log(state.Board);
	console.log(arr);
	if(checkMove(arr1,arr,0,7,1)){
		arr[0][7]=1;
		arr[0][8]=1;
	}
	console.log(arr);
	console.log("\n");
	//console.log(checkTerritory(arr,8,0));
	arr=cleanBoard(arr);
	console.log(arr);
	console.log(countScore(arr));
	console.log(arr);
	
});*/

