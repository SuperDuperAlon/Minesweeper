"use strict";

const MINE = "💣";
const FLAG = "🚩";

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
  lives: 3,
};

var gTimer = false;
var gMinesSet = false;
var gClickedCell = 0;

function initGame() {
  gBoard = buildBoard();
  renderBoard(gBoard);
  gGame.secsPassed = 0;
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
        isMarked: false,
      };
    }
  }

  return board;
}

function gameStart() {
  gGame.isOn = true;
  gTimer = false;
  startTimer();
  gTimer = true;
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
  var strHTML = "";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>\n";
    for (var j = 0; j < board[0].length; j++) {
      strHTML += `<td onclick="getCellLocation(this)" oncontextmenu="cellMarked(this)" class="cellId-${i}-${j} hidden"></td>`;
    }
    strHTML += "</tr>";
    document.addEventListener("contextmenu", (event) => event.preventDefault());
  }
  elBoard.innerHTML = strHTML;
}

function getCellLocation(ev) {
  gClickedCell++;
  gameStart();
  var idx = ev.classList[0].split("-");
  var rowIdx = +idx[1];
  var colIdx = +idx[2];
  var elCell = document.querySelector(`.cellId-${rowIdx}-${colIdx}`);
  cellClicked(elCell, rowIdx, colIdx);
  getRandomMineLocation(rowIdx, colIdx);
  setMinesNegsCount(gBoard);
  console.log(gGame.isOn);
  console.log(gTimer);
}

function cellClicked(elCell, i, j) {
  if (gBoard[i][j].isShown === false && gBoard[i][j].isMarked === false) {
    gBoard[i][j].isShown = true;
    gGame.shownCount++;
    elCell.classList.remove("hidden");
    elCell.classList.add("shown");
    gBoard[i][j].minesAroundCount;
    if (gBoard[i][j].isMine === true) {
      elCell.innerText = MINE;
    } else if (gBoard[i][j].minesAroundCount === 0 && !gBoard[i][j].isMine) {
      elCell.innerText = "";
      expandShown(gBoard, i, j);
    } else if (gBoard[i][j].minesAroundCount > 0) {
      elCell.innerText = gBoard[i][j].minesAroundCount;
    }
    checkGameOver(elCell, gBoard[i][j]);
    checkGameWon();
  }
}

function expandShown(board, rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === colIdx && j === colIdx) continue;
      if (j < 0 || j >= board[i].length) continue;
      var elCell = document.querySelector(`.cellId-${i}-${j}`);
      if (board[i][j].isShown === false && gBoard[i][j].isMine === false) {
        board[i][j].isShown = true;
        elCell.classList.remove("hidden");
        elCell.classList.add("shown");
        if (gBoard[i][j].minesAroundCount > 0) {
          elCell.innerText = gBoard[i][j].minesAroundCount;
        } else if (gBoard[i][j].minesAroundCount === 0) {
          elCell.innerText = "";
        }
      }
    }
    return;
  }
}

function revealTiles() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var elCell = document.querySelector(`.cellId-${i}-${j}`);
      if (
        gBoard[i][j].isShown === true &&
        elCell.classList.contains("hidden")
      ) {
        elCell.classList.remove("hidden");
        elCell.classList.add("shown");
      }
    }
  }
}

function cellMarked(ev) {
  var idx = ev.classList[0].split("-");
  var rowIdx = +idx[1];
  var colIdx = +idx[2];
  var elCell = document.querySelector(`.cellId-${rowIdx}-${colIdx}`);
  if (gBoard[rowIdx][colIdx].isMarked === false) {
    gBoard[rowIdx][colIdx].isMarked = true;
    gGame.markedCount++;
    elCell.innerText = FLAG;
    return;
  }
  if (gBoard[rowIdx][colIdx].isMarked === true) {
    gBoard[rowIdx][colIdx].isMarked = false;
    gGame.markedCount--;
    if (gBoard[rowIdx][colIdx].isMine) {
      elCell.classList.remove("shown");
      elCell.classList.add("hidden");
    } else if (
      gBoard[rowIdx][colIdx].isMine === false &&
      gBoard[rowIdx][colIdx].minesAroundCount > 0
    ) {
      elCell.innerText = gBoard[rowIdx][j].minesAroundCount;
      elCell.classList.add("shown");
    } else {
      elCell.innerText = "";
    }
  }
}

function checkGameOver(elCell, cell) {
  if (cell.isMine && elCell.innerText === MINE) {
    gGame.isOn = false;
    gGame.secsPassed = 0;
    elCell.style.backgroundColor = "red";
    revealMines();
    openModal("Game Over");
    var elEmoji = document.querySelector(".smiley");
    elEmoji.innerText = "💀";
  }
}

function revealMines() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMine === true) {
        gBoard[i][j].isShown = true;
        var elCell = document.querySelector(`.cellId-${i}-${j}`);
        elCell.innerText = MINE;
        elCell.classList.remove("hidden");
        elCell.classList.add("shown");
      }
    }
  }
}

function checkGameWon() {
  if (gLevel.SIZE ** 2 - gGame.shownCount - gLevel.MINES === 0) {
    openModal("You have Won!");
    gGame.isOn = false;
    var elEmoji = document.querySelector(".smiley");
    elEmoji.innerText = "😎";
  }
}

function openModal(msg) {
  var elModalHeader = document.querySelector(".modal h1");
  var elModal = document.querySelector(".modal");
  elModal.style.display = "block";
  elModalHeader.innerText = msg;
  clearInterval(myTimer);
}

function playAgain() {
  var elModal = document.querySelector(".modal");
  elModal.style.display = "none";
  gTimer = false;
  gGame.isOn = false;
  gGame.shownCount = 0;
  gGame.markedCount = 0;
  gGame.secsPassed = 0;
  gMinesSet = false;
  gClickedCell = 0;
  var elEmoji = document.querySelector(".smiley");
  elEmoji.innerText = "😀";
  initGame();
}

function changeLevel(size, mines) {
  gLevel.SIZE = size;
  gLevel.MINES = mines;
  gClickedCell = 0;
  playAgain();
  initGame();
}

function countNeighbors(cellI, cellJ, mat) {
  var neighborsCount = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= mat[i].length) continue;
      if (mat[i][j].isMine === true) neighborsCount++;
    }
  }
  return neighborsCount;
}

function getRandomMineLocation(rowIdx, colIdx) {
  if (gClickedCell !== 1) return;
  var numberOfMines = gLevel.MINES;
  var maxNum = gLevel.SIZE;
  var minesStorage;
  for (var k = 0; k < numberOfMines; k++) {
    var i = getRandomInt(0, maxNum);
    var j = getRandomInt(0, maxNum);
    if (i === rowIdx && j === colIdx) continue;
    gBoard[i][j].isMine = true;
  }
  return minesStorage;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function myTimer() {
  var elTimer = document.querySelector(".timer span");
  var secsPassed = elTimer.innerText;
  secsPassed++;
  elTimer.innerText = secsPassed;
}

function startTimer() {
  if (gTimer) return;
  if (gGame.isOn) setInterval(myTimer, 1000);
  if (gTimer === false && gGame.isOn === false) {
    clearInterval(myTimer);
  }
}

function disableRightClick(e) {
  e.preventDefault();
}
