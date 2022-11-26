"use strict";

const MINE = "💣";
const FLAG = "🚩";

var gBoard;
var gInterval;
var gTimer = false;
var gMinesSet = false;
var gClickedCell = 0;
var gOnMouseDown = 0;

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
        minesAroundCount: null,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
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

// Start the game - when clicked on the board
function startGame() {
  gGame.isOn = true;
  gOnMouseDown++;
  if (gOnMouseDown === 1) {
    gInterval = setInterval(myTimer, 1000);
  }
}

function myTimer() {
  var elTimer = document.querySelector(".timer span");
  gGame.secsPassed = elTimer.innerText;
  gGame.secsPassed++;
  elTimer.innerText = gGame.secsPassed;
}

function resetTimer() {
  var elTimer = document.querySelector(".timer span");
  gGame.secsPassed = 0;
  console.log(gGame.secsPassed);
  elTimer.innerText = gGame.secsPassed;
  gOnMouseDown = 0;
}

function setMinesNegsCount(board) {
  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {
      board[i][j].minesAroundCount = countNeighbors(i, j, board);
    }
  }
  return board;
}

function getCellLocation(ev) {
  gClickedCell++;
  gGame.isOn = true;

  var idx = ev.classList[0].split("-");
  var rowIdx = +idx[1];
  var colIdx = +idx[2];
  var elCell = document.querySelector(`.cellId-${rowIdx}-${colIdx}`);
  getRandomMineLocation(rowIdx, colIdx);
  setMinesNegsCount(gBoard);
  verifyEmptyCells();
  setColorToNums();
  cellClicked(elCell, rowIdx, colIdx);
  countMarked();
}

function cellClicked(elCell, i, j) {
  if (gBoard[i][j].isShown === false && gBoard[i][j].isMarked === false) {
    gBoard[i][j].isShown = true;
    gGame.shownCount = updateShownCount();
    elCell.classList.remove("hidden");
    elCell.classList.add("shown");
    // setMinesNegsCount(gBoard);

    if (gBoard[i][j].isMine === true) {
      elCell.innerText = MINE;
      gGame.lives--;
      console.log(gGame.lives);
    } else if (gBoard[i][j].minesAroundCount === 0) {
      //  && !gBoard[i][j].isMine
      elCell.innerText = "";
      expandShown(gBoard, i, j);
    } else if (gBoard[i][j].minesAroundCount > 0) {
      elCell.innerText = gBoard[i][j].minesAroundCount;
    }

    changeLivesColor();
    checkGameOver(elCell, gBoard[i][j]);
    checkGameWon();
  }
  console.log(gBoard);
}

function verifyEmptyCells() {
  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {
      var elCell = document.querySelector(`.cellId-${i}-${j}`);
      if (
        gBoard.isMine === false &&
        gBoard[i][j].isShown &&
        gBoard[i][j].minesAroundCount > 0
      ) {
        elCell.innerText = gBoard[i][j].minesAroundCount;
      }
    }
  }
}

function expandShown(board, rowIdx, colIdx) {
  // if (gClickedCell === 1) return;
  console.log(rowIdx, colIdx);
  for (var i = rowIdx - 1; i < rowIdx + 2; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = colIdx - 1; j < colIdx + 2; j++) {
      if (i === rowIdx && j === colIdx) continue;
      if (j < 0 || j >= board[i].length) continue;
      var elCell = document.querySelector(`.cellId-${i}-${j}`);
      if (board[i][j].isShown === false && gBoard[i][j].isMine === false) {
        board[i][j].isShown = true;
        elCell.classList.remove("hidden");
        elCell.classList.add("shown");
        if (gBoard[i][j].minesAroundCount === 0) {
          elCell.innerText = "";
          expandShown(board, i, j);
        } else if (gBoard[i][j].minesAroundCount > 0) {
          elCell.innerText = gBoard[i][j].minesAroundCount;
        }
      }
    }
  }
  return;
}

function updateShownCount() {
  var shownCount = 0;
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      if (gBoard[i][j].isShown === true) shownCount++;
    }
  }
  return shownCount;
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
  if (elCell.classList.contains("shown")) return;
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
      elCell.innerText = gBoard[rowIdx][colIdx].minesAroundCount;
      elCell.classList.add("shown");
    } else {
      elCell.innerText = "";
    }
  }

}

function checkGameOver(elCell, cell) {
  if (gGame.lives === 0) {
    // cell.isMine && elCell.innerText === MINE
    gGame.isOn = false;
    gGame.secsPassed = 0;
    elCell.style.backgroundColor = "red";
    revealMines();
    openModal("So Close...");
    var elEmoji = document.querySelector(".smiley button");
    clearInterval(gInterval);
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
  if (
    gLevel.SIZE ** 2 - gGame.shownCount - gLevel.MINES === 0 ||
    gLevel.SIZE ** 2 - gGame.shownCount === 0 ||
    gLevel.SIZE ** 2 - gGame.shownCount - gGame.markedCount === 0
  ) {
    openModal("You Won!");
    gGame.isOn = false;
    var elEmoji = document.querySelector(".smiley button");
    elEmoji.innerText = "😎";
    flagMinesWhenWinning();
  }
}

function flagMinesWhenWinning() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var elCell = document.querySelector(`.cellId-${i}-${j}`);
      if (gBoard[i][j].isMine === true) {
        elCell.innerText = FLAG;
      }
    }
  }
}

function openModal(msg) {
  var elModalHeader = document.querySelector(".modal h1");
  var elModal = document.querySelector(".modal");
  elModal.style.display = "block";
  elModalHeader.innerText = msg;
  clearInterval(gInterval);
  gOnMouseDown = 0;
}

function playAgain() {
  var elModal = document.querySelector(".modal");
  elModal.style.display = "none";
  gGame.isOn = false;
  gGame.shownCount = 0;
  gGame.markedCount = 0;
  gGame.secsPassed = 0;
  gGame.lives = 3;
  changeLivesColor();
  gMinesSet = false;
  gClickedCell = 0;
  clearInterval(gInterval);
  var elEmoji = document.querySelector(".smiley button");
  elEmoji.innerText = "😄";
  resetTimer();
  initGame();
}

function changeLevel(size, mines) {
  gLevel.SIZE = size;
  gLevel.MINES = mines;
  gClickedCell = 0;
  gOnMouseDown = 0;
  clearInterval(gInterval);
  playAgain();
  initGame();
  resetTimer();
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
  for (var k = 0; k < numberOfMines; k++) {
    var i = getRandomInt(0, maxNum);
    var j = getRandomInt(0, maxNum);
    if (gBoard[i][j].isMine === false && !(i === rowIdx && j === colIdx)) {
      gBoard[i][j].isMine = true;
    } else {
      numberOfMines++;
    }
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function disableRightClick(e) {
  e.preventDefault();
}

function changeLivesColor() {
  var elHeartOne = document.querySelector(".heartOne");
  var elHeartTwo = document.querySelector(".heartTwo");
  var elHeartThree = document.querySelector(".heartThree");

  if (gGame.lives === 3) {
    elHeartOne.style.color = "red";
    elHeartTwo.style.color = "red";
    elHeartThree.style.color = "red";
  }

  if (gGame.lives === 2) {
    elHeartOne.style.color = "gray";
    elHeartTwo.style.color = "red";
    elHeartThree.style.color = "red";
  }

  if (gGame.lives === 1) {
    elHeartOne.style.color = "gray";
    elHeartTwo.style.color = "gray";
    elHeartThree.style.color = "red";
  }

  if (gGame.lives === 0) {
    elHeartOne.style.color = "gray";
    elHeartTwo.style.color = "gray";
    elHeartThree.style.color = "gray";
  }
}

function setColorToNums() {
  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {
      var elCell = document.querySelector(`.cellId-${i}-${j}`);
      switch (gBoard[i][j].minesAroundCount) {
        case 1:
          elCell.classList.add("one");
          break;
        case 2:
          elCell.classList.add("two");
          break;
        case 3:
          elCell.classList.add("three");
          break;
        case 4:
          elCell.classList.add("four");
          break;
        case 5:
          elCell.classList.add("five");
          break;
        case 6:
          elCell.classList.add("six");
          break;
        case 7:
          elCell.classList.add("seven");
          break;
        case 8:
          elCell.classList.add("eight");
          break;
      }
    }
  }
}

function countMarked() {
  var flaggedCells = 0;
  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {
      if (gBoard[i][j].isMarked) {
        flaggedCells++;
      }
    }
  }
}
