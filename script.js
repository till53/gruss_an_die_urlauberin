const loginForm = document.querySelector("#loginForm");
const loginView = document.querySelector("#loginView");
const resultView = document.querySelector("#resultView");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loginView.hidden = true;
  resultView.hidden = false;
});
