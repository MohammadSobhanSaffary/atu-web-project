"use strict";
const BASE_URL =
  "https://6663f754932baf9032a97f8a.mockapi.io/api/atu/web-project/";
const submitBtn = document.querySelector(".submit-btn");
submitBtn.addEventListener("click", () => {
  window.location.href = "../index.html";
});
let users = [];




(() => {
  fetch(`${BASE_URL}users`, {})
    .then((res) => res.json())
    .then((res) => {
      users = res;
    })
    .catch((err) => console.error(err));
})();
