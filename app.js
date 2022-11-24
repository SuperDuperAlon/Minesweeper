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
  gMinesSet = true;
  gClickedCell = 0;
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
  getRandomMineLocation();
  setMinesNegsCount(gBoard);
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
  console.log(elBoard);
}

function getCellLocation(ev) {
  gClickedCell++;
  var idx = ev.classList[0].split("-");
  var rowIdx = +idx[1];
  var colIdx = +idx[2];
  var elCell = document.querySelector(`.cellId-${rowIdx}-${colIdx}`);
//   if (gClickedCell === 1) {
//   }
  console.log(gBoard[0][0]);
  //   else if (gClickedCell > 1) {
  //     console.log('');
  //   }
  cellClicked(elCell, rowIdx, colIdx);
}

function cellClicked(elCell, i, j) {
  console.log(gBoard[0][0]);
  if (gBoard[i][j].isShown === false && gBoard[i][j].isMarked === false) {
    gBoard[i][j].isShown = true;
    gGame.shownCount++;
    console.log(elCell);
    elCell.classList.remove("hidden");
    elCell.classList.add("shown");
    console.log(gBoard[i][j].minesAroundCount);
    gBoard[i][j].minesAroundCount;
    if (gBoard[i][j].isMine === true) {
      elCell.innerText = MINE;
    } else if (gBoard[i][j].minesAroundCount === 0 && !gBoard[i][j].isMine) {
      elCell.innerText = gBoard[i][j].minesAroundCount;
    } else if (gBoard[i][j].minesAroundCount > 0) {
      elCell.innerText = gBoard[i][j].minesAroundCount;
    }

    // expandShown(gBoard, clickedCell, i, j);
    checkGameOver(elCell, gBoard[i][j]);
    checkGameWon();
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
    elCell.classList.remove("hidden");
    elCell.classList.add("shown");
    return;
  }
  if (gBoard[i][j].isMarked === true) {
    gBoard[i][j].isMarked = false;
    gGame.markedCount--;
    if (gBoard[i][j].isMine) {
      elCell.classList.remove("shown");
      elCell.classList.add("hidden");
    } else if (
      gBoard[i][j].isMine === false &&
      gBoard[i][j].minesAroundCount > 0
    ) {
      elCell.innerText = gBoard[i][j].minesAroundCount;
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
  }
}

function revealMines() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMine === true) {
        var elCell = document.querySelector(`.cellId-${i}-${j}`);
        elCell.classList.remove("hidden");
        elCell.classList.add("shown");
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
  initGame();
}

function changeLevel(size, mines) {
  gLevel.SIZE = size;
  gLevel.MINES = mines;
  gClickedCell = 0;
  initGame();
}

// function expandShown(board, elCell, i, j) {
//   console.log(gBoard[i][j]);
//   console.log(elCell);
//   if (+elCell.innerText > 0) return;
//   if (+elCell.innerText === 0) {
//     for (var k = i - 1; k <= i; k++) {
//       if (k < 0 || k > board.length) continue;
//     }
//     for (var l = j - 1; l <= j; l++) {
//       if (k === i && l === j) continue;
//       if (l < 0 || l >= board[0].length) continue;

//       if (!board[k][l].isShown) {
//         var elCell = document.querySelector(`.cellId-${k}-${l}`);
//         board[k][l].isShown;
//         elCell.classList.remove("hidden");
//         elCell.classList.add("shown");
//       }
//     }
//     console.log(board, elCell, i, j);
//   }
// }

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

function getRandomMineLocation() {
  var numberOfMines = gLevel.MINES;
  var maxNum = gLevel.SIZE;
  var minesStorage;
  console.log(numberOfMines);
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

function startTimer() {
  if (gTimer) return;
  if (gGame.isOn) setInterval(myTimer, 1000);
  else clearInterval;
}

function disableRightClick(e) {
  e.preventDefault();
}
