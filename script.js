const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
let board = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;

const HUMAN = "X";
const AI = "O";

// Render the board
function drawBoard() {
  boardElement.innerHTML = "";
  board.forEach((cell, i) => {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");
    cellElement.textContent = cell;
    cellElement.addEventListener("click", () => handleMove(i));
    boardElement.appendChild(cellElement);
  });
}

function handleMove(index) {
  if (board[index] === "" && !gameOver) {
    board[index] = HUMAN;
    drawBoard();
    if (checkWinner(board, HUMAN)) {
      statusElement.textContent = "You win!";
      gameOver = true;
    } else if (isDraw(board)) {
      statusElement.textContent = "It's a draw!";
      gameOver = true;
    } else {
      aiMove();
    }
  }
}

function aiMove() {
  const best = minimax(board, 0, true);
  board[best.index] = AI;
  drawBoard();
  if (checkWinner(board, AI)) {
    statusElement.textContent = "AI wins!";
    gameOver = true;
  } else if (isDraw(board)) {
    statusElement.textContent = "It's a draw!";
    gameOver = true;
  }
}

function checkWinner(b, player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  return winPatterns.some(pattern =>
    pattern.every(i => b[i] === player)
  );
}

function isDraw(b) {
  return b.every(cell => cell !== "");
}

// Minimax Algorithm
function minimax(newBoard, depth, isMaximizing) {
  if (checkWinner(newBoard, HUMAN)) return { score: -10 };
  if (checkWinner(newBoard, AI)) return { score: 10 };
  if (isDraw(newBoard)) return { score: 0 };

  const scores = [];

  newBoard.forEach((cell, i) => {
    if (cell === "") {
      const move = {};
      move.index = i;
      newBoard[i] = isMaximizing ? AI : HUMAN;
      const result = minimax(newBoard, depth + 1, !isMaximizing);
      move.score = result.score;
      newBoard[i] = "";
      scores.push(move);
    }
  });

  return isMaximizing
    ? scores.reduce((best, move) => move.score > best.score ? move : best)
    : scores.reduce((best, move) => move.score < best.score ? move : best);
}

// Restart game
function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameOver = false;
  statusElement.textContent = "";
  drawBoard();
}

drawBoard();
