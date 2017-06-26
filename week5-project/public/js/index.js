const submitBtn = document.querySelector("button");

const error = document.querySelector(".error");
const input = document.querySelector("input");
const guessForm = document.querySelector("form");

submitBtn.addEventListener("click", function(e) {

  e.preventDefault();
  if (input.value.length === 1) {
    error.innerText = "";
    guessForm.submit();
    input.value="";
  } else {
    error.innerText = "Please enter a single character";
  }
});

window.addEventListener("beforeunload", function (event) {
  input.value = "";
  guessForm.submit();
});
