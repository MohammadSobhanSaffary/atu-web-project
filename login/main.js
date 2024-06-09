"use strict";
let isSignin = true;
let users = [];
const BASE_URL =
  "https://6663f754932baf9032a97f8a.mockapi.io/api/atu/web-project/";
const submitBtn = document.querySelector(".submit-btn");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const signinToggle = document.querySelector(".signin");
const signupToggle = document.querySelector(".signup");
const notify = document.querySelector(".notify");

if (isSignin) {
  signinToggle.classList.add("display-none");
}

signupToggle.addEventListener("click", () => {
  signupToggle.classList.add("display-none");
  signinToggle.classList.remove("display-none");
  isSignin = false;
  submitBtn.textContent = "ثبت نام";
});

signinToggle.addEventListener("click", () => {
  signinToggle.classList.add("display-none");
  signupToggle.classList.remove("display-none");
  isSignin = true;
  submitBtn.textContent = "ورود";
});

(() => {
  fetch(`${BASE_URL}users`, {})
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      users = res;
    })
    .catch((err) => console.error(err));
})();

const notifyLoginError = () => {
  notify.textContent = "نام کاربری یا رمزعبور اشتباه هست.";
  notify.classList.add("show-notification");
  notify.classList.add("error");
  setTimeout(() => {
    notify.innerHTML = "";
    notify.classList.remove("show-notification");
    notify.classList.remove("error");
  }, 3000);
};

const notifyEmptyError = () => {
  notify.textContent = "پرکردن هردو فیلد نام کاربری و رمزعبور الزامی است.";
  notify.classList.add("show-notification");
  notify.classList.add("error");
  setTimeout(() => {
    notify.innerHTML = "";
    notify.classList.remove("show-notification");
    notify.classList.remove("error");
  }, 3000);
};

const notifySuccessLogin = (inputUser) => {
  notify.textContent = isSignin
    ? "با موفقیت وارد سامانه شدید."
    : "حساب کاربری شما با موفقیت ساخته شد.";
  notify.classList.add("show-notification");
  notify.classList.add("success");
  setTimeout(() => {
    notify.innerHTML = "";
    notify.classList.remove("show-notification");
    window.location.href = inputUser.isAdmin
      ? "../admin-page/index.html"
      : "../index.html";
    notify.classList.remove("success");
  }, 1000);
};

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (isSignin) {
    let userWithSameUsername = users?.find(
      (user) => user.username === usernameInput.value
    );
    if (!userWithSameUsername) {
      notifyLoginError();
      return;
    } else if (userWithSameUsername.password !== passwordInput.value) {
      notifyLoginError();
      return;
    }
    localStorage.setItem("userInfo", JSON.stringify(userWithSameUsername));
    notifySuccessLogin(userWithSameUsername);
  } else {
    if (
      usernameInput.value.trim() === "" ||
      usernameInput.value.trim().length < 3 ||
      passwordInput.value.trim() === ""
    ) {
      notifyEmptyError();
      return;
    } else {
      fetch(BASE_URL + "users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usernameInput?.value,
          password: passwordInput?.value,
          isAdmin: false,
          pickedLessons: [],
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          localStorage.setItem("userInfo", JSON.stringify(res));
          notifySuccessLogin();
        })
        .catch((err) => console.log(err));
    }
  }
});
