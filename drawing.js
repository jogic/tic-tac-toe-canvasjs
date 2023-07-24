'use strict';

/**
 * Draw
 * @param {CanvasRenderingContext2D} ctx - CanvasRenderingContext2D
 * @param {number[][]} board - 3x3 tictactoe board
 */
function draw_board(ctx, board) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  let width = ctx.canvas.width;
  let height =  ctx.canvas.height;
  let stroke = "#000000";
  let i = 0;
  ctx.lineWidth = 5;
  ctx.strokeStyle = stroke;
  ctx.beginPath();
  ctx.moveTo(width/3, 0);
  ctx.lineTo(width/3, height);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo((width/3)*2, 0);
  ctx.lineTo((width/3)*2, height);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, height/3);
  ctx.lineTo(width, height/3);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, (height/3)*2);
  ctx.lineTo(width, (height/3)*2);
  ctx.stroke();
  // Draw x's and o's
  board.forEach(row => {
    row.forEach(node => {
      if(node === 1) {
        draw_x(ctx, i);
      }
      if (node === 2) {
        draw_o(ctx, i);
      }
      i++;
    });
  });
  ctx.restore();
}

/**
 * Draw
 * @param {CanvasRenderingContext2D} ctx - CanvasRenderingContext2D
 * @param {number} position - position on the tictactoe board
 */
function draw_x(ctx, position) {
  let padding = 20;
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#000000";
  let cors = get_positions(ctx.canvas.width, ctx.canvas.height, position);
  ctx.beginPath();
  ctx.moveTo(cors.x+padding, cors.y+padding);
  ctx.lineTo(cors.x+(ctx.canvas.width/3)-padding, cors.y+(ctx.canvas.height/3)-padding);
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  ctx.moveTo(cors.x+(ctx.canvas.width/3)-padding, cors.y+padding);
  ctx.lineTo(cors.x+padding, cors.y+(ctx.canvas.height/3)-padding);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}

/**
 * Draw O's on the tictactoe board
 * @param {CanvasRenderingContext2D} ctx - CanvasRenderingContext2D
 * @param {number} position - position on the tictactoe board
 */
function draw_o(ctx, position) {  
  let padding = 20;
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#000000";
  let cors = get_positions(ctx.canvas.width, ctx.canvas.height, position);
  ctx.beginPath();
  ctx.ellipse(cors.x+((ctx.canvas.width/3)/2), cors.y+((ctx.canvas.height/3)/2), ctx.canvas.width/6-padding, ctx.canvas.height/6-padding, Math.PI , 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}

/**
 * Get the mouse position and returns the x and y coordinates
 * @param {width} width - tictactoe board width
 * @param {height} height - tictactoe board height
 * @param {number} position - position on the tictactoe board
 * @returns {Object} coordinates - x and y of 3x3 tictactoe board
 * @returns {number} coordinates.x - x = row
 * @returns {number} coordinates.y - y = column
 */
function get_positions(width, height, position) {
  let coordinates = {x:0, y:0};
  switch(position) {
    case 0:
      //code block, top left
      coordinates = {x:0, y:0};
      break;
    case 1:
      //code block, top middle
      coordinates = {x:(width/3), y:0};
      break;
    case 2:
      //code block, top right
      coordinates = {x:(width/3)*2, y:0};
      break;
    case 3:
      //code block, middle left
      coordinates = {x:0, y:(height/3)};
      break;
    case 4:
      //code block, middle middle
      coordinates = {x:(width/3), y:(height/3)};
      break;
    case 5:
      //code block, middle right
      coordinates = {x:(width/3)*2, y:(height/3)};
      break;
    case 6:
        //code block, bottom left
        coordinates = {x:0, y:(height/3)*2};
      break;
    case 7:
      //code block, bottom middle
      coordinates = {x:(width/3), y:(height/3)*2};
      break;
    case 8:
      //code block, bottom right
      coordinates = {x:(width/3)*2, y:(height/3)*2};
      break;
    default:
      // code block, unknown position
      console.error("ERROR: Unknown position");
  } 
  return coordinates
}

/**
 * Draw win on the board width
 * @param {CanvasRenderingContext2D} ctx - CanvasRenderingContext2D
 * @param {number} number - number [0-7] of the draw win line
 */
function draw_win(ctx, number) {
  let padding = -10;
  let rowMid = (ctx.canvas.width/3)*0.5;
  let columnMid = (ctx.canvas.height/3)*0.5;
  ctx.lineWidth = 20;
  ctx.strokeStyle = "#008030;"; //Green
  //0,1,2 row win
  if(number < 3) {
    ctx.beginPath();
    ctx.moveTo(padding, ((ctx.canvas.height/3)*number)+columnMid);
    ctx.lineTo(ctx.canvas.width-padding, ((ctx.canvas.height/3)*number)+columnMid);
    ctx.stroke();
    ctx.closePath();
  }
  //3,4,5 column win
  if(number < 6 && number > 2) {
    ctx.beginPath();
    ctx.moveTo(((ctx.canvas.width/3)*(number-3))+rowMid, padding);
    ctx.lineTo(((ctx.canvas.width/3)*(number-3))+rowMid, ctx.canvas.height-padding);
    ctx.stroke();
    ctx.closePath();
  }
  //6, diagonal win
  if(number === 6) {
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(ctx.canvas.width-padding, ctx.canvas.height-padding);
    ctx.stroke();
    ctx.closePath();
  }
  //7, diagonal win
  if(number === 7) {
    ctx.beginPath();
    ctx.moveTo(ctx.canvas.width-padding, padding);
    ctx.lineTo(padding, ctx.canvas.height-padding);
    ctx.stroke();
    ctx.closePath();
  }
}