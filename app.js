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
  document.addEventListener('contextmenu', event => event.preventDefault());
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
      strHTML += `<td onmousedown="getCellLocation(this)" oncontextmenu="alert('test')" class="cellId-${i}-${j}">${currCell}</td>`;
    }
    strHTML += "</tr>";
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
  //for Right Click

//   if clicked with right side - add FLAG

//   if clicked with left side - add num / bomb
  console.log(elCell);
    // addFlag();
}

// function addFlag(e) {
//     if (gBoard[i][j].isMarked === false && gBoard[i][j].isshown === false) {
//         console.log(gBoard[i][j]);
//         gBoard[i][j].isMarked = true;
//         gGame.markedCount++
//         console.log(gGame);
//         elCell.innerText = FLAG
//         elCell.style.opacity = "100%";
//     }
// }


// function cellClicked(elCell, i, j) {
//     for left
//     function disableRightClick(e) {
//         e.preventDefault();
//         addFlag()
//       }
//   var elCell = document.querySelector(`.cellId-${i}-${j}`);
//   elCell.addeventListener('click', function(e)) {
//     click.elCell
//   }
//   console.log(elCell);
//     gBoard[i][j].isShown = true;
//     elCell.style.opacity = "100%";
//   console.log(gBoard);
// }

// function addFlag(elCell, i, j) {
//     var elCell = document.querySelector(`.cellId-${i}-${j}`);
//     if
// }

// function getCellLocationRight(ev) {
//     var rowIdx = +ev.className.charAt("7");
//     var colIdx = +ev.className.charAt("9");
//     var elCell = document.querySelector(`.cellId-${rowIdx}-${colIdx}`);
//     cellClickedRight(elCell, rowIdx, colIdx);
//   }

//   function cellClickedRight(elCell, i, j) {
//     var elCell = document.querySelector(`.cellId-${i}-${j}`);
//     if (gBoard[i][j].isShown === false && gBoard[i][j].isMarked === false) {
//        console.log(gBoard[i][j]);

//     }
//     console.log(gBoard);
//   }

function cellMarked(elCell) {
  var elCell = document.querySelector(".cellId");
  console.log(elCell);
  // if (!gBoard.isShown && isMine)
  //         isShown: false,
  //     isMine: false,
  //     isMarked: true,
}

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

function myTimer() {
  var elTimer = document.querySelector(".timer span");
  var time = elTimer.innerText;
  time++;
  elTimer.innerText = time;
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

// function disableRightClick(e) {
//   e.preventDefault();
// }
