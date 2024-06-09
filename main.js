"use strict";
const BASE_URL =
  "https://6663f754932baf9032a97f8a.mockapi.io/api/atu/web-project/";
const courseTable = document.querySelector(".course-table");
const selectedCourseTable = document.querySelector(".selected-courses-table");
const notify = document.querySelector(".notify");
const logout = document.querySelector(".logout");
const userType = document.querySelector(".usertype");
const usernameSpan = document.querySelector(".username");

let userInfo = JSON.parse(localStorage.getItem("userInfo"));
let courses = [];
let selectedCourses = [];

if ([null, undefined, ""].includes(userInfo)) {
  window.location.href = "login/index.html";
}

userType.textContent = userInfo.isAdmin ? "مدیر سامانه" : "دانشجو";
usernameSpan.textContent = userInfo.username ? userInfo.username : "";

(() => {
  fetch(`${BASE_URL}users`, {})
    .then((res) => res.json())
    .then((res) => {
      let userPickedLessons = res?.find(
        (el) => el.username === userInfo?.username
      )?.pickedLessons;
      selectedCourses = userPickedLessons;
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ ...userInfo, pickedLessons: userPickedLessons })
      );
      addToSelectedCourse();
    })
    .catch((err) => console.error(err));

  fetch(`${BASE_URL}lessons`, {})
    .then((res) => res.json())
    .then((res) => {
      courses = res;
      courses.forEach((course) => {
        const tr = document.createElement("tr");
        tr.classList.add("table-row");
        const lessonNameTd = document.createElement("td");
        lessonNameTd.textContent = course.lessonName;
        const professorName = document.createElement("td");
        professorName.textContent = course.professorName;
        const days = document.createElement("td");
        days.textContent = course.days.join(" , ");
        const timeFrom = document.createElement("td");
        timeFrom.textContent = course.timeFrom;
        const end = document.createElement("td");
        end.textContent = course.timeTo;
        const actionTd = document.createElement("td");
        const addBtn = document.createElement("button");
        addBtn.textContent = "افزودن";
        addBtn.classList.add("btn");
        addBtn.addEventListener("click", () => {
          addCourse(course);
        });
        actionTd.appendChild(addBtn);
        tr.appendChild(lessonNameTd);
        tr.appendChild(professorName);
        tr.appendChild(days);
        tr.appendChild(timeFrom);
        tr.appendChild(end);
        tr.appendChild(actionTd);
        courseTable.appendChild(tr);
      });
    })
    .catch((err) => console.error(err));
})();

function convertTimeToNumber(time) {
  const splitTime = time.split(":");
  return parseInt(splitTime[0] * 3600 + splitTime[1] * 60);
}

function addCourse(e) {
  e.preventDefault();

  fetch(BASE_URL + "lessons", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(),
  })
    .then((res) => res.json())
    .then((res) => console.log(res))
    .catch((err) => console.error(err));


  notify.textContent = "درس انتخاب شده با موفقیت اضافه شد.";
  notify.classList.add("show-notification");
  notify.classList.add("success");
  
  setTimeout(() => {
    notify.innerHTML = "";
    notify.classList.remove("show-notification");
    notify.classList.remove("success");
  }, 3000);
}

function removeRow(course) {
  selectedCourses = selectedCourses.filter(
    (el) => el.lessonId !== course.lessonId
  );
  userInfo = { ...userInfo, pickedLessons: selectedCourses };
  fetch(BASE_URL + "users/" + userInfo.userId, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userInfo),
  })
    .then((res) => res.json())
    .then((res) => console.log(res))
    .catch((err) => console.error(err));

  localStorage.setItem("userInfo", JSON.stringify(userInfo));
  addToSelectedCourse();
}

logout.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login/index.html";
});
