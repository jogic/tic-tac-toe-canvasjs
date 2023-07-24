"use strict";

/**
 * Class representing a TicTacToe Game.
 */
class TicTacToeGame {
  /**
   * Constructor to create the TicTacToe game
   * @constructor
   * @param {string} id - #id of HTML <canvas> element
   */
  constructor(id) {
    this.canvas = document.querySelector(id);
    this.ctx = this.canvas.getContext("2d");
    this.board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    this.currentPlayer = 1;
    this.gameOver = false;
    this.player1Wins=0;
    this.player2Wins=0;
    this.catGames=0;
    this.totalGames=0;
    this.canvas.addEventListener('mouseup', (e) => { this.human_turn(e) });
    this.cpuTimeout=10;
    this.winTimeout=10;
  }
  
  /**
   * Resets the game
   */
  resetGame() {
    this.board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    this.currentPlayer = 1;
    this.gameOver = false;
    draw_board(this.ctx, this.board);
    // cpu does the first turn
    if(player1setting.value != "human") {
      let position = this.cpu_turn(this.board, player1setting.value, this.currentPlayer);
      this.updateBoard(position.row, position.column);
    } 
  }

  /**
   * Checks the tictactoe board for any wins or ties, return which player and what line to draw for the win.
   * @param {number[][]} board -  3x3 tictactoe board
   * @returns {Object} winner - details of the game winner or tie
   * @returns {number} Object.player - 0=tie, 1=player 1 win, 2=player2 win
   * @returns {number} Object.drawNumber - 0-2=row win, 3-5=column win, 6-7=diagonal win, 8 = draw nothing
   */
  checkForWin(board) {
    let winner = {
      player: null,
      drawNumber: null
    }
    for (let playerTurn = 1; playerTurn < 3; playerTurn++) {
      //row win
      for (let row = 0; row < 3; row++) {
        if(board[row][0] === playerTurn && board[row][1]===playerTurn && board[row][2]===playerTurn) {
          winner.player = playerTurn;
          winner.drawNumber = row;
          return winner;
        }
      }
      //column win
      for (let column = 0; column < 3; column++) {
        if(board[0][column] === playerTurn && board[1][column]===playerTurn && board[2][column]===playerTurn) {
          winner.player = playerTurn;
          winner.drawNumber = column+3;
          return winner;
        }
      }
      //diagonal win
      if(board[0][0] === playerTurn && board[1][1]===playerTurn && board[2][2]===playerTurn) {
        winner.player = playerTurn;
        winner.drawNumber = 6;
        return winner;
      }
      //diagonal win
      if(board[0][2] === playerTurn && board[1][1]===playerTurn && board[2][0]===playerTurn) {
        winner.player = playerTurn;
        winner.drawNumber = 7;
        return winner;
      }
    }
    //cat's game
    let total = 0;
    for (var row = 0; row < 3; row++) {
      for (var column = 0; column < 3; column++) {
        total += board[row][column];
        if(total===13) {
          winner.player = 0;
          winner.drawNumber = 8;
          return winner;
        }
      }
    }
    return winner;
  };
  
  /**
   * Updates the game, parameter is the player's move on the board.
   * @param {number} row 
   * @param {number} column
   */
  updateBoard(row, column) {
    if(!this.gameOver) {
      this.board[row][column] = this.currentPlayer;
      draw_board(this.ctx, this.board);
      if(this.checkForWin(this.board).player != null) {
        this.gameOver = true;
        this.updatestats(this.checkForWin(this.board));
        if(autoreset.checked && this.totalGames % 100 != 0) {
          setTimeout(() => {
            this.resetGame();
          }, this.winTimeout);
          if(this.winTimeout>10) {
            this.winTimeout = this.winTimeout - 10;
          }
        } else if (autoreset.checked) {
          console.log("only move is not to play");
        } 
      } else {
        this.switchTurn();
      }
    }
  }

  /**
   * Change the turn, switch to Human/CPU player
  */
  switchTurn() {
    //Change player turn
    if(this.currentPlayer === 1 ){
      this.currentPlayer = 2;
    } else {
      this.currentPlayer = 1; 
    }
    //get current player is human or cpu
    let mode;
    if(this.currentPlayer === 1) {
      mode = player1setting.value;
    } else {
      mode = player2setting.value;
    }
    //CPU VS CPU slow down CPU moves
    if (mode!="human" && !this.gameOver) {
      setTimeout(() => {
        let position = this.cpu_turn(this.board, mode, this.currentPlayer);
        this.updateBoard(position.row, position.column);
      }, this.cpuTimeout); 
      if(this.cpuTimeout>10) {
        this.cpuTimeout = this.cpuTimeout - 10;
      }
    }
  }

  /**
   * Gets the x,y postion of the mouseup on the HTML canvas
   * @param {EventListener} event - mouseup event
   * @returns {Object} MousePosition - mouse x and y postion; 
   * @returns {number} MousePosition.mousex - x
   * @returns {number} MousePosition.mousey - y
   */
  getCursorPosition(event) {
    const x = event.offsetX
    const y = event.offsetY
    let mousePosition = {
       mousex: x,
       mousey: y
    }
    return mousePosition;
  };

  /**
   * Human turn
   * @param {EventListener} event - mouseup event
   * @returns {Object} boardPostion - x and y position of the mouseup event
   * @returns {number} boardPostion.row
   * @returns {number} boardPostion.column
   */
  human_turn(event) {
    let boardPostion = {row:undefined,column:undefined};
    let mousePosition = this.getCursorPosition(event);
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        let xCordinate = column * this.canvas.width/3;
        let yCordinate = row * this.canvas.height/3;
        if(
          mousePosition.mousex >= xCordinate && mousePosition.mousex <= xCordinate + this.canvas.width/3 &&
          mousePosition.mousey >= yCordinate && mousePosition.mousey <= yCordinate + this.canvas.height/3 &&
          this.board[row][column] === 0
        )
        {
          boardPostion.row = row;
          boardPostion.column = column;
          this.updateBoard(boardPostion.row, boardPostion.column);
        }
      }
    }
    return boardPostion;
  };
  
  /**
   * CPU turn
   * @param {number[][]} board - 3x3 tictactoe board
   * @param {string} mode - ['easy'|'hard']
   * @param {number} playerTurn - current player's turn (1 or 2)
   * @returns {object} boardPostion - row and column of CPU play 
   * @returns {number} boardPostion.row
   * @returns {number} boardPostion.column
   */
  cpu_turn(board, mode, playerTurn) {
    let boardPostion = {row:undefined,column:undefined};
    // Easy mode: Select a random position
    if(mode==="easy") {
      let positionTaken=true;
      let attempts = 0;
      do {
        boardPostion.row = Math.floor(Math.random() * 3);
        boardPostion.column = Math.floor(Math.random() * 3);
        if(board[boardPostion.row][boardPostion.column] === 0) {
          positionTaken = false;
        }
        attempts++;
      } while(positionTaken && attempts < 100);
      // Hard mode: Minimax algorithm to pick the best move
    } else if(mode==="hard") {
      let bestScore = -100;
      let boardSum = 0 
      for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
          boardSum += board[row][column];
          // Check if the spot taken
          if(board[row][column] === 0) {
            board[row][column] = playerTurn;
            let score = this.minimax(board, playerTurn, false, 0);
            board[row][column] = 0;
            if(score > bestScore) {
              bestScore = score;
              boardPostion.row = row;
              boardPostion.column = column;
            }
          }
        }
      }
      // If the Board is empty (turn 1) pick a random spot. Makes the Hard CPU more dynamic
      // Could put this before the Minimax algorithm in another for loop.
      if (boardSum === 0 && playerTurn == 1) {
        return this.cpu_turn(board, 'easy', playerTurn);
      }
    }
    return boardPostion;
  }

  /**
   * CPU turn
   * @param {number[][]} board - 3x3 tictactoe board
   * @param {number} playerTurn - current player's turn
   * @param {boolean} isMax - CPU turn or opponent turn
   * @param {number} depth - current depth of the recursive 
   * @returns {number} score - best score of the postion 
   */
  minimax(board, playerTurn, isMax, depth) {
  let result = this.checkForWin(board);
  let opponent;
  if(playerTurn === 1 ) { opponent = 2; } else { opponent = 1; };
  if(result.player != null) {
    if(playerTurn === result.player) {
      return 10;
    } else if(opponent === result.player) {
      return -10;
    } else {
      return 0; //cats game
    }
  }
  if(isMax) {
    let bestScore = -100;
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        if(board[row][column] === 0) {
          board[row][column] = playerTurn;
          let score = this.minimax(board, playerTurn, false, depth+1);
          board[row][column] = 0;
          bestScore = Math.max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = 100;
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        if(board[row][column] === 0) {
          board[row][column] = opponent;
          let score = this.minimax(board, playerTurn, true, depth+1);
          board[row][column] = 0;
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}

  /**
   * Updates HTML with the game stats and draw winning line
   * @param {Object} winner
   * @param {number} winner.drawNumber - 0-2=row win, 3-5=column win, 6-7=diagonal win, 8 = draw nothing
   * @param {number} winner.currentPlayer - 0=tie, 1=player 1 win, 2=player2 win
   */
  updatestats(winner) {
    this.totalGames++;
    draw_win(this.ctx, winner.drawNumber);
    if(winner.player===0) {
      this.catGames++;
    } else if(this.currentPlayer === 1 ) {
      this.player1Wins++; 
    } else { 
      this.player2Wins++; 
    }
    totalgames.innerHTML = this.totalGames;
    player1stat.innerHTML = this.player1Wins;
    player2stat.innerHTML = this.player2Wins;
    catgamestat.innerHTML = this.catGames;
  }
}

//HTML control and information (scores, etc.)
var autoreset = document.querySelector("#autoreset");
var resetGamebtn = document.querySelector("#resetbtn");
var player1setting = document.querySelector("#player1");
var player2setting = document.querySelector("#player2");
var totalgames = document.querySelector("#totalGames");
var player1stat = document.querySelector("#player1wins");
var player2stat = document.querySelector("#player2wins");
var catgamestat = document.querySelector("#catgamewins");

