let board = Array(9).fill(null);
let playerChoice;
let computerChoice;
let gameOver = false;

const xSymbol = `<svg class="x-symbol" viewBox="0 -960 960 960"><path d="M291-267.69 267.69-291l189-189-189-189L291-692.31l189 189 189-189L692.31-669l-189 189 189 189L669-267.69l-189-189-189 189Z"/></svg>`;

const oSymbol = `<svg class="circle-symbol"  viewBox="0 -960 960 960"><path d="M479.76-136q-70.79 0-133.45-27.04-62.66-27.04-109.45-73.82-46.78-46.79-73.82-109.45Q136-408.97 136-479.76q0-71.64 27.16-134.23 27.17-62.58 73.72-109.13t109.41-73.72Q409.14-824 479.75-824q71.47 0 134.15 27.16 62.67 27.17 109.22 73.72t73.72 109.13Q824-551.4 824-479.76q0 70.79-27.16 133.56-27.17 62.77-73.72 109.32-46.55 46.55-109.13 73.72Q551.4-136 479.76-136Zm.24-71.69q113.46 0 192.88-79.43 79.43-79.42 79.43-192.88t-79.43-192.88Q593.46-752.31 480-752.31t-192.88 79.43Q207.69-593.46 207.69-480t79.43 192.88q79.42 79.43 192.88 79.43Z"/></svg>`;

const slots = document.querySelectorAll(".slot");

// Recognizes the user action and calls the functions
slots.forEach((slot, index) => {
  slot.addEventListener("click", () => {
    if (gameOver) return;

    if (board[index] !== null) {
      alert("Slot already played!");
      return;
    }

    userTurn(slot, index);

    setTimeout(() => {
      if (gameOver) return;
      computerTurn(index);
    }, 400);
  });
});

// The user's turn
function userTurn(slot, index) {
  board[index] = playerChoice;
  if (playerChoice == "O") {
    slot.innerHTML = oSymbol;
  } else {
    slot.innerHTML = xSymbol;
  }
  if (checkWinner(playerChoice)) {
    gameOver = true;
    return;
  }

  if (isBoardFull()) {
    showTie();
    gameOver = true;
  }
}

// The computer's turn
function computerTurn() {
  const computerIndex = Math.floor(Math.random() * 9);

  console.log(computerIndex);

  if (board[computerIndex] !== null) {
    return computerTurn();
  } else {
  }

  board[computerIndex] = computerChoice;

  if (computerChoice == "O") {
    slots[computerIndex].innerHTML = oSymbol;
  } else {
    slots[computerIndex].innerHTML = xSymbol;
  }

  if (checkWinner(computerChoice)) {
    gameOver = true;
    return;
  }

  if (isBoardFull()) {
    showTie();
    gameOver = true;
  }
}

// Adds an eventListener to both initial buttons
const markerBtns = document.querySelectorAll("[data-marker]");
markerBtns.forEach((button) => {
  button.addEventListener("click", handleMarkerChoice);
});

// Gets the input of what marker the user chose
function handleMarkerChoice(event) {
  playerChoice = event.currentTarget.dataset.marker; // "O"
  computerChoice = playerChoice === "X" ? "O" : "X";

  document.querySelector(".game-start").classList.add("hidden");

  if (playerChoice === "O") {
    setTimeout(() => {
      computerTurn();
    }, 400);
  }

  console.log("Player:", playerChoice);
  console.log("Computer:", computerChoice);
}

function checkWinner(player) {
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] === player && board[b] === player && board[c] === player) {
      showWinner(player);
      gameOver = true;
      return true;
    }
  }
  return false;
}

const winConditions = [
  [0, 1, 2], // line 1
  [3, 4, 5], // line 2
  [6, 7, 8], // line 3
  [0, 3, 6], // column 1
  [1, 4, 7], // column 2
  [2, 5, 8], // column 3
  [0, 4, 8], // diagonal \
  [2, 4, 6], // diagonal /
];

function showWinner(player) {
  document.querySelector(".winning-screen").classList.remove("hidden");
  if (player === playerChoice) {
    document.querySelector(".winning-text").innerHTML =
      "Congratulations!<br>You win!";
  } else {
    document.querySelector(".winning-text").innerHTML =
      "Not this time!<br>The computer wins!";
  }
}

function playAgain() {
  board = Array(9).fill(null);
  playerChoice = null;
  computerChoice = null;
  gameOver = false;

  document.querySelector(".game-start").classList.remove("hidden");
  document.querySelector(".winning-screen").classList.add("hidden");
  document.querySelector(".winning-text").textContent = "";

  slots.forEach((slot) => {
    slot.innerHTML = "";
  });
}

function isBoardFull() {
  return board.every((cell) => cell !== null);
}

function showTie() {
  document.querySelector(".winning-screen").classList.remove("hidden");
  document.querySelector(".winning-text").textContent = "It's a tie!";
}
