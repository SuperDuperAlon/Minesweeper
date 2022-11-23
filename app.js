"use strict";

const MINE = "MINE";
const FLAG = "FLAG";

var gBoard;

var gLevel = {
  SIZE: 4,
  MINES: 2,
};

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

function initGame() {
  gBoard = buildBoard();
  console.log(gBoard);
  renderBoard(gBoard);
}

function buildBoard() {
  var board = [];
  for (var i = 0; i < gLevel.SIZE; i++) {
    board[i] = [];
    for (var j = 0; j < gLevel.SIZE; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: true,
      };
    }
  }

  return board;
}

function setMinesNegsCount(board) {
  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {
      board[i][j].minesAroundCount = countNeighbors(i, j, board);
    }
  }
  return board;
}

function renderBoard(board) {
  const elBoard = document.querySelector(".board");
  getRandomMineLocation();
  setMinesNegsCount(board);
  var strHTML = "";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>\n";
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];
      if (currCell.isMine) {
        currCell = MINE;
      } else if (currCell.minesAroundCount > 0) {
        currCell = currCell.minesAroundCount;
      } else {
        currCell = "";
      }
      strHTML += `<td onClick="getCellLocation(this)" class="cellId-${i}-${j}">${currCell}</td>`;
    }
    strHTML += "</tr>";
  }

  elBoard.innerHTML = strHTML;
}

function getCellLocation(ev) {
  console.log(ev.classList);
  var rowIdx = +ev.classList[0].charAt("7");
  var colIdx = +ev.classList[0].charAt("9");
  var elCell = document.querySelector(`.cellId-${rowIdx}-${colIdx}`);
  cellClicked(elCell, rowIdx, colIdx);
}

function cellClicked(elCell, i, j) {
  var elCell = document.querySelector(`.cellId-${i}-${j}`);
  console.log(elCell, +i, +j);
  if (elCell.innerText > 0) {
    gBoard[i][j].isShown = true;
    elCell.style.opacity = "100%";
  }
  console.log(gBoard);
}

function cellMarked(elCell) {}

function checkGameOver() {}

function expandShown(board, elCell, i, j) {}

function countNeighbors(cellI, cellJ, mat) {
  var neighborsCount = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= mat[i].length) continue;
      if (mat[i][j].isMine === true) neighborsCount++; // Check condition and add
    }
  }
  return neighborsCount;
}

function getRandomMineLocation() {
  var numberOfMines = gLevel.MINES;
  var maxNum = gLevel.SIZE;
  var minesStorage;
  for (var k = 0; k < numberOfMines; k++) {
    var i = getRandomInt(0, maxNum);
    var j = getRandomInt(0, maxNum);
    gBoard[i][j].isMine = true;
  }
  return minesStorage;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
