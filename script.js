const loginForm = document.querySelector("#loginForm");
const loginView = document.querySelector("#loginView");
const resultView = document.querySelector("#resultView");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const loginError = document.querySelector("#loginError");
const typedMessage = document.querySelector("#typedMessage");
const journeyTrack = document.querySelector("#journeyTrack");
const gameBoard = document.querySelector("#gameBoard");
const gameStatus = document.querySelector("#gameStatus");
const gameReset = document.querySelector("#gameReset");
const gameCells = [...gameBoard.querySelectorAll("[data-cell]")];

const message =
  "Hallo Alina,\nmir war langweilig und ich wollte ein bisschen testen/üben, daher dieses Projekt. Mit KI hättest du das auch hinbekommen (bitte klaue nicht meinen Job).";

function showMessage() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    typedMessage.textContent = message;
    typedMessage.classList.add("is-complete");
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
    }
  };

  window.setTimeout(typeNextCharacter, 500);
}

showMessage();

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const isValid =
    usernameInput.value === "alina" &&
    passwordInput.value === "tillIstLustigerAlsIch";

  if (isValid) {
    loginView.hidden = true;
    resultView.hidden = false;
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

resultView.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    return;
  }

  if (journeyStep === 0) {
    journeyTrack.classList.add("is-in-hokkaido");
    journeyStep = 1;
    return;
  }

  if (journeyStep === 1) {
    journeyTrack.classList.remove("is-in-hokkaido");
    journeyTrack.classList.add("is-at-pumpkin-story");
    journeyStep = 2;
    return;
  }

  if (journeyStep === 2) {
    journeyTrack.classList.remove("is-at-pumpkin-story");
    journeyTrack.classList.add("is-at-game");
    journeyStep = 3;
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

function hasWon(mark) {
  return winningLines.some((line) => line.every((index) => gameState[index] === mark));
}

function finishGame(message) {
  gameIsOver = true;
  gameStatus.textContent = message;
  gameReset.hidden = false;
  gameCells.forEach((cell) => { cell.disabled = true; });
}

function makeComputerMove() {
  const emptyCells = gameState
    .map((value, index) => value === "" ? index : null)
    .filter((index) => index !== null);
  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  gameState[randomIndex] = "O";
  gameCells[randomIndex].textContent = "O";
  gameCells[randomIndex].setAttribute("aria-label", `Feld ${randomIndex + 1}, O`);

  computerIsThinking = false;
  gameBoard.classList.remove("is-waiting");

  if (hasWon("O")) {
    finishGame("Okay … der Zufall hatte leider Glück.");
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
    finishGame("Gewonnen. Die Einreise ist genehmigt. 🎉");
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
  gameState = Array(9).fill("");
  gameIsOver = false;
  computerIsThinking = false;
  gameStatus.textContent = "Du bist dran.";
  gameReset.hidden = true;
  gameBoard.classList.remove("is-waiting");
  gameCells.forEach((cell, index) => {
    cell.textContent = "";
    cell.disabled = false;
    cell.setAttribute("aria-label", `Feld ${index + 1}`);
  });
});
