const xSymbol = `<svg class="x-symbol" viewBox="0 -960 960 960"><path d="M291-267.69 267.69-291l189-189-189-189L291-692.31l189 189 189-189L692.31-669l-189 189 189 189L669-267.69l-189-189-189 189Z"/></svg>`;

const oSymbol = `<svg class="circle-symbol"  viewBox="0 -960 960 960"><path d="M479.76-136q-70.79 0-133.45-27.04-62.66-27.04-109.45-73.82-46.78-46.79-73.82-109.45Q136-408.97 136-479.76q0-71.64 27.16-134.23 27.17-62.58 73.72-109.13t109.41-73.72Q409.14-824 479.75-824q71.47 0 134.15 27.16 62.67 27.17 109.22 73.72t73.72 109.13Q824-551.4 824-479.76q0 70.79-27.16 133.56-27.17 62.77-73.72 109.32-46.55 46.55-109.13 73.72Q551.4-136 479.76-136Zm.24-71.69q113.46 0 192.88-79.43 79.43-79.42 79.43-192.88t-79.43-192.88Q593.46-752.31 480-752.31t-192.88 79.43Q207.69-593.46 207.69-480t79.43 192.88q79.42 79.43 192.88 79.43Z"/></svg>`;

// RECREATED WITH MODULAR GAME ARCHITECTURE

const Player = (name, marker) => {
  return { name, marker };
};

const Gameboard = (() => {
  // internal logic and data
  let board = Array(9).fill(null);

  const getBoard = () => board; // The board can be looked-at, but no changed by external interferences

  const setCell = (index, marker) => {
    if (board[index] === null) {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const reset = () => {
    board = Array(9).fill(null);
  };

  return {
    reset,
    getBoard,
    setCell,
  }; //public methods
})();

const GameController = (() => {
  let player1, player2;
  let currentPlayer;
  let gameOver = false;
  let isLocked = false;

  const startGame = (userMarker) => {
    Gameboard.reset();
    gameOver = false;

    player1 = Player("User", userMarker);
    player2 = Player("Computer", userMarker === "X" ? "O" : "X");
    currentPlayer = player1;

    if (currentPlayer.marker === "O") {
      runComputerTurn();
    }
  };

  const userPlayTurn = (index) => {
  if (gameOver || isLocked) return;
  isLocked = true;
  playTurn(index);
};

  const playTurn = (index) => {
    if (gameOver) return;

    if (!Gameboard.setCell(index, currentPlayer.marker)) {
      if (currentPlayer.name === "Computer") {
        return runComputerTurn();
      } else {
        alert("Slot taken!");
        isLocked = false;
        return;
      }
    }

    renderBoard();

    if (checkWin()) return;

    if (checkTie()) return;


    switchTurn();
  };

  const checkWin = () => {
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

    const board = Gameboard.getBoard();
    for (let condition of winConditions) {
      const [a, b, c] = condition;
      if (
        board[a] === currentPlayer.marker &&
        board[b] === currentPlayer.marker &&
        board[c] === currentPlayer.marker
      ) {
        showWinner();
        gameOver = true;
        return true;
      }
    }
    return false;
  };

  const checkTie = () => {
    if (Gameboard.getBoard().every((cell) => cell !== null)) {
      showTie();
      gameOver = true;
      return true;
    }
    return false;
  };

  const showWinner = () => {
    document.querySelector(".winning-screen").classList.remove("hidden");

    if (currentPlayer.name === "Computer") {
      document.querySelector(".winning-text").innerHTML =
        "Not this time!<br>The computer wins!";
    } else {
      document.querySelector(".winning-text").innerHTML =
        "Congratulations!<br>You win!";
    }
  };

  const showTie = () => {
    document.querySelector(".winning-screen").classList.remove("hidden");

    document.querySelector(".winning-text").innerHTML = "It's a tie!";
  };

  const renderBoard = () => {
    const slots = document.querySelectorAll(".slot");
    const board = Gameboard.getBoard();

    slots.forEach((slot, index) => {
      const value = board[index];

      if (value === "X") {
        slot.innerHTML = xSymbol;
      } else if (value === "O") {
        slot.innerHTML = oSymbol;
      } else {
        slot.innerHTML = "";
      }
    });
  };

  const switchTurn = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;

    if (currentPlayer.name === "Computer") {
      runComputerTurn();
    }
  };

  const runComputerTurn = () => {
    if (gameOver) return;

    const randomIndex = getRandomAvailableIndex();
    if (randomIndex === null) return;

    currentPlayer = player2;
  
    setTimeout(() => {
      playTurn(randomIndex);
      isLocked = false;
    }, 300);
  };

  const getRandomAvailableIndex = () => {
    const board = Gameboard.getBoard();
    const available = [];

    board.forEach((cell, index) => {
      if (cell === null) available.push(index);
    });

    if (available.length === 0) return null;

    const random = Math.floor(Math.random() * available.length);
    return available[random];
  };

  const resetGame = () => {
    Gameboard.reset();
    gameOver = false;
    isLocked = false;
    renderBoard();
  };

  return {
    startGame,
    userPlayTurn,
    playTurn,
    checkWin,
    checkTie,
    showWinner,
    showTie,
    renderBoard,
    switchTurn,
    runComputerTurn,
    resetGame,
  };
})();

document.querySelectorAll(".slot").forEach((slot, index) => {
  slot.addEventListener("click", () => {
    GameController.userPlayTurn(index);
  });
});

document.querySelectorAll(".marker-btn").forEach((button) => {
  button.addEventListener("click", (e) => {
    let userMarker = e.currentTarget.dataset.marker; // "O"

    GameController.startGame(userMarker);
    document.querySelector(".game-start").classList.add("hidden");
  });
});

document.querySelector(".reset-btn").addEventListener("click", () => {
  document.querySelector(".winning-screen").classList.add("hidden");
  document.querySelector(".game-start").classList.remove("hidden");
  GameController.resetGame();
});
