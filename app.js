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

var gTimer = false;

function initGame() {
  gBoard = buildBoard();
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
        isMarked: false,
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
      strHTML += `<td onclick="getCellLocation(this)" oncontextmenu="cellMarked(this)" class="cellId-${i}-${j}">${currCell}</td>`;
    }
    strHTML += "</tr>";
    document.addEventListener("contextmenu", (event) => event.preventDefault());
  }

  elBoard.innerHTML = strHTML;
}

function getCellLocation(ev) {
  var rowIdx = +ev.className.charAt("7");
  var colIdx = +ev.className.charAt("9");
  var elCell = document.querySelector(`.cellId-${rowIdx}-${colIdx}`);
  cellClicked(elCell, rowIdx, colIdx);
}

function cellClicked(elCell, i, j) {
  var clickedCell = elCell;
  if (gBoard[i][j].isShown === false && gBoard[i][j].isMarked === false) {
    gBoard[i][j].isShown = true;
    gGame.shownCount++;
    clickedCell.style.opacity = "100%";
    checkGameOver(clickedCell, gBoard[i][j]);
    checkGameWon();
    console.log(gBoard);
  }
}

function cellMarked(ev) {
  var i = +ev.className.charAt("7");
  var j = +ev.className.charAt("9");
  var elCell = document.querySelector(`.cellId-${i}-${j}`);
  if (gBoard[i][j].isMarked === false) {
    gBoard[i][j].isMarked = true;
    gGame.markedCount++;
    elCell.innerText = FLAG;
    elCell.style.opacity = "100%";
    return;
  }
  if (gBoard[i][j].isMarked === true) {
    gBoard[i][j].isMarked = false;
    gGame.markedCount--;
    if (gBoard[i][j].isMine) {
      elCell.innerText = MINE;
      elCell.style.opacity = "0%";
    } else if (
      gBoard[i][j].isMine === false &&
      gBoard[i][j].minesAroundCount > 0
    ) {
      elCell.innerText = gBoard[i][j].minesAroundCount;
      elCell.style.opacity = "0%";
    } else {
      elCell.innerText = "";
    }
  }
}

function checkGameOver(elCell, cell) {
  console.log(cell);
  console.log(elCell);
  if (cell.isMine && elCell.innerText === MINE) {
    gGame.isOn = false;
    gGame.secsPassed = 0;
    elCell.style.backgroundColor = "red";
    revealMines();
    openModal("Game Over");
  }
}

function revealMines() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMine === true) {
        var elCell = document.querySelector(`.cellId-${i}-${j}`);
        elCell.style.opacity = "100%";
      }
    }
  }
}

function checkGameWon() {
  console.log(gGame.shownCount);
  if (gLevel.SIZE ** 2 - gGame.shownCount - gLevel.MINES === 0) {
    openModal("You have Won!");
    gGame.isOn = false;
  }
}

function openModal(msg) {
  var elModalHeader = document.querySelector(".modal h1");
  var elModal = document.querySelector(".modal");
  elModal.style.display = 'block'
  elModalHeader.innerText = msg;
  clearInterval(myTimer)
}

function playAgain() {
    var elModal = document.querySelector(".modal");
    elModal.style.display = 'none'
    gTimer = false
    gGame.isOn = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    
    initGame()
}

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

function myTimer() {
  var elTimer = document.querySelector(".timer span");
  var secsPassed = elTimer.innerText;
  secsPassed++;
  elTimer.innerText = secsPassed;
}

function gameStart() {
  gGame.isOn = true;
  startTimer();
  gTimer = true;
}

function startTimer() {
  if (gTimer) return;
  if (gGame.isOn) setInterval(myTimer, 1000);
  else clearInterval;
}

function disableRightClick(e) {
  e.preventDefault();
}
