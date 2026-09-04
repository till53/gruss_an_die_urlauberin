const loginForm = document.querySelector("#loginForm");
const loginView = document.querySelector("#loginView");
const resultView = document.querySelector("#resultView");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const loginError = document.querySelector("#loginError");
const typedMessage = document.querySelector("#typedMessage");
const introHint = document.querySelector("#introHint");
const journeyTrack = document.querySelector("#journeyTrack");
const gameBoard = document.querySelector("#gameBoard");
const gameStatus = document.querySelector("#gameStatus");
const gameIntro = document.querySelector("#gameIntro");
const gameReset = document.querySelector("#gameReset");
const gameActions = document.querySelector("#gameActions");
const gameContinue = document.querySelector("#gameContinue");
const gameCells = [...gameBoard.querySelectorAll("[data-cell]")];
const reelMessage = document.querySelector("#reelMessage");
const reelHint = document.querySelector("#reelHint");
const flowerScene = document.querySelector("#flowerScene");
const flowerPage = document.querySelector(".place--flowers");
const flowerHint = document.querySelector("#flowerHint");

const message =
  "Hallo Alina,\nmir war langweilig und ich wollte etwas testen/üben, daher dieses kleine Projekt.\n\nMit KI hättest du das vermutlich auch hinbekommen (bitte klaue nicht meinen Job).";

function showMessage() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    typedMessage.textContent = message;
    typedMessage.classList.add("is-complete");
    introHint.hidden = false;
    return;
  }

  let characterIndex = 0;

  const typeNextCharacter = () => {
    typedMessage.textContent += message[characterIndex];
    characterIndex += 1;

    if (characterIndex < message.length) {
      window.setTimeout(typeNextCharacter, 45);
    } else {
      typedMessage.classList.add("is-complete");
      introHint.hidden = false;
    }
  };

  window.setTimeout(typeNextCharacter, 500);
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const isValid =
    usernameInput.value === "alina" &&
    passwordInput.value === "tillIstLustigerAlsIch";

  if (isValid) {
    loginView.hidden = true;
    resultView.hidden = false;
    showMessage();
    return;
  }

  loginError.hidden = false;
  passwordInput.value = "";
  passwordInput.focus();
});

loginForm.addEventListener("input", () => {
  loginError.hidden = true;
});

let journeyStep = 0;
let flowersAreReady = false;

resultView.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    return;
  }

  if (journeyStep === 0) {
    if (!typedMessage.classList.contains("is-complete")) {
      return;
    }

    journeyTrack.classList.add("is-in-germany");
    journeyStep = 1;
    return;
  }

  if (journeyStep === 1) {
    journeyTrack.classList.remove("is-in-germany");
    journeyTrack.classList.add("is-in-hokkaido");
    journeyStep = 2;
    return;
  }

  if (journeyStep === 2) {
    journeyTrack.classList.remove("is-in-hokkaido");
    journeyTrack.classList.add("is-at-pumpkin-story");
    journeyStep = 3;
    return;
  }

  if (journeyStep === 3) {
    journeyTrack.classList.remove("is-at-pumpkin-story");
    journeyTrack.classList.add("is-at-game");
    journeyStep = 4;
    return;
  }

  if (journeyStep === 5 && reelMessage.classList.contains("is-complete")) {
    journeyTrack.classList.remove("is-at-reel");
    journeyTrack.classList.add("is-at-flowers");
    journeyStep = 6;
    window.setTimeout(() => {
      flowerScene.classList.add("is-blooming");
      flowerPage.classList.add("is-blooming");
    }, 700);
    window.setTimeout(() => {
      flowersAreReady = true;
      flowerHint.hidden = false;
    }, 5900);
    return;
  }

  if (journeyStep === 6 && flowersAreReady) {
    journeyTrack.classList.remove("is-at-flowers");
    journeyTrack.classList.add("is-at-farewell");
    journeyStep = 7;
  }
});

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

let gameState = Array(9).fill("");
let gameIsOver = false;
let computerIsThinking = false;
let gameAttempt = 1;

function hasWon(mark) {
  return winningLines.some((line) => line.every((index) => gameState[index] === mark));
}

function evaluateBoard(board) {
  const lineBelongsTo = (mark) =>
    winningLines.some((line) => line.every((index) => board[index] === mark));

  if (lineBelongsTo("O")) return 10;
  if (lineBelongsTo("X")) return -10;
  return 0;
}

function minimax(board, isComputerTurn, depth = 0) {
  const score = evaluateBoard(board);
  if (score !== 0) return score > 0 ? score - depth : score + depth;
  if (board.every(Boolean)) return 0;

  const scores = [];
  board.forEach((value, index) => {
    if (value) return;
    board[index] = isComputerTurn ? "O" : "X";
    scores.push(minimax(board, !isComputerTurn, depth + 1));
    board[index] = "";
  });

  return isComputerTurn ? Math.max(...scores) : Math.min(...scores);
}

function getSmartMove(emptyCells, preferDraw = false) {
  const scoredMoves = emptyCells.map((index) => {
    gameState[index] = "O";
    const score = minimax(gameState, false);
    gameState[index] = "";
    return { index, score };
  });

  if (preferDraw) {
    const drawingMoves = scoredMoves.filter((move) => move.score === 0);
    if (drawingMoves.length) {
      return drawingMoves[Math.floor(Math.random() * drawingMoves.length)].index;
    }
  }

  const bestScore = Math.max(...scoredMoves.map((move) => move.score));
  const bestMoves = scoredMoves.filter((move) => move.score === bestScore);
  return bestMoves[Math.floor(Math.random() * bestMoves.length)].index;
}

function finishGame(message, playerHasWon = false) {
  gameIsOver = true;
  gameStatus.textContent = message;
  gameActions.hidden = false;
  gameContinue.hidden = !playerHasWon;
  gameCells.forEach((cell) => { cell.disabled = true; });
}

function makeComputerMove() {
  const emptyCells = gameState
    .map((value, index) => value === "" ? index : null)
    .filter((index) => index !== null);
  const shouldPlaySmart = gameAttempt === 1 || Math.random() < 0.5;
  const computerMove = shouldPlaySmart
    ? getSmartMove(emptyCells, gameAttempt === 1)
    : emptyCells[Math.floor(Math.random() * emptyCells.length)];

  gameState[computerMove] = "O";
  gameCells[computerMove].textContent = "O";
  gameCells[computerMove].setAttribute("aria-label", `Feld ${computerMove + 1}, O`);

  computerIsThinking = false;
  gameBoard.classList.remove("is-waiting");

  if (hasWon("O")) {
    finishGame("Okay … ich habe gewonnen.");
  } else if (gameState.every(Boolean)) {
    finishGame("Unentschieden. Ihr seid wohl beide gleich schlau.");
  } else {
    gameStatus.textContent = "Du bist dran.";
  }
}

gameBoard.addEventListener("click", (event) => {
  const cell = event.target.closest("[data-cell]");

  if (!cell || gameIsOver || computerIsThinking) {
    return;
  }

  const index = Number(cell.dataset.cell);
  if (gameState[index]) {
    return;
  }

  gameState[index] = "X";
  cell.textContent = "X";
  cell.setAttribute("aria-label", `Feld ${index + 1}, X`);

  if (hasWon("X")) {
    finishGame("Du hast gewonnen! Besser als ich. 🎉", true);
  } else if (gameState.every(Boolean)) {
    finishGame("Unentschieden. Ihr seid wohl beide gleich schlau.");
  } else {
    computerIsThinking = true;
    gameBoard.classList.add("is-waiting");
    gameStatus.textContent = "Der Computer denkt sehr angestrengt …";
    window.setTimeout(makeComputerMove, 500);
  }
});

gameReset.addEventListener("click", () => {
  gameAttempt += 1;
  gameState = Array(9).fill("");
  gameIsOver = false;
  computerIsThinking = false;
  gameStatus.textContent = "Du bist dran.";
  gameIntro.textContent = "Zweiter Versuch: Jetzt bin ich zu 50 % clever und zu 50 % komplett planlos.";
  gameActions.hidden = true;
  gameContinue.hidden = true;
  gameBoard.classList.remove("is-waiting");
  gameCells.forEach((cell, index) => {
    cell.textContent = "";
    cell.disabled = false;
    cell.setAttribute("aria-label", `Feld ${index + 1}`);
  });
});

const reelText =
  "Die nächste Seite ist für mich.\n\nOffenbar muss ich jetzt gegen den Typen aus deinem Reel gewinnen und beweisen, dass ich das auch kann.\n\nKein Druck. Nur mein gesamter beruflicher Stolz hängt davon ab.";

function typeReelMessage() {
  let characterIndex = 0;

  const typeNextCharacter = () => {
    reelMessage.textContent += reelText[characterIndex];
    characterIndex += 1;

    if (characterIndex < reelText.length) {
      window.setTimeout(typeNextCharacter, 38);
    } else {
      reelMessage.classList.add("is-complete");
      reelHint.hidden = false;
    }
  };

  window.setTimeout(typeNextCharacter, 600);
}

gameContinue.addEventListener("click", (event) => {
  event.stopPropagation();
  document.body.classList.add("night-mode");
  journeyTrack.classList.remove("is-at-game");
  journeyTrack.classList.add("is-at-reel");
  journeyStep = 5;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    reelMessage.textContent = reelText;
    reelMessage.classList.add("is-complete");
    reelHint.hidden = false;
  } else {
    typeReelMessage();
  }
});
