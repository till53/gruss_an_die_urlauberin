const loginForm = document.querySelector("#loginForm");
const loginView = document.querySelector("#loginView");
const resultView = document.querySelector("#resultView");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const loginError = document.querySelector("#loginError");
const typedMessage = document.querySelector("#typedMessage");
const journeyTrack = document.querySelector("#journeyTrack");

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
  }
});
