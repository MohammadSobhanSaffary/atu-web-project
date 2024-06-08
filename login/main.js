"use strict";
const BASE_URL =
  "https://6663f754932baf9032a97f8a.mockapi.io/api/atu/web-project/";
let users = [];
const submitBtn = document.querySelector(".submit-btn");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const notify = document.querySelector(".notify");

(() => {
  fetch(`${BASE_URL}users`, {})
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      users = res;
    })
    .catch((err) => console.error(err));
})();

const notifLoginError = () => {
  notify.textContent = "نام کاربری یا رمزعبور اشتباه هست.";
  notify.classList.add("show-notification");
  notify.classList.add("error");
  setTimeout(() => {
    notify.innerHTML = "";
    notify.classList.remove("show-notification");
    notify.classList.remove("error");
  }, 3000);
};

const notifySuccessLogin = () => {
  notify.textContent ="با موفقیت وارد سامانه شدید.";
  notify.classList.add("show-notification");
  notify.classList.add("success");
  setTimeout(() => {
    notify.innerHTML = "";
    notify.classList.remove("show-notification");
    window.location.href = "../index.html";
    notify.classList.remove("success");
  }, 1000);
};

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  console.log(usernameInput.value);
  let userWithSameUsername = users?.find(
    (user) => user.username === usernameInput.value
  );
  if (!userWithSameUsername) {
    notifLoginError();
    return;
  } else if (userWithSameUsername.password !== passwordInput.value) {
    notifLoginError();
    return;
  }
  localStorage.setItem("userInfo", JSON.stringify(userWithSameUsername));
  notifySuccessLogin();
});
