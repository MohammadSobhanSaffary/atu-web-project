"use strict";
const BASE_URL =
  "https://6663f754932baf9032a97f8a.mockapi.io/api/atu/web-project/";
const courseTable = document.querySelector(".course-table");
const selectedCourseTable = document.querySelector(".selected-courses-table");
const notify = document.querySelector(".notify");
const logout = document.querySelector(".logout");
const userType = document.querySelector(".usertype");
const usernameSpan = document.querySelector(".username");

let userInfo =
  localStorage.getItem("userInfo") &&
  JSON.parse(localStorage.getItem("userInfo"));
let courses = [];


if ([null, undefined, ""].includes(userInfo)) {
  window.location.href = "login/index.html";
}

userType.textContent = userInfo.isAdmin ? "مدیر سامانه" : "دانشجو";
usernameSpan.textContent = userInfo.username ? userInfo.username : "";

const createTable = () => {
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
    addBtn.textContent = "حذف";
    addBtn.classList.add("btn");
    addBtn.classList.add("remove");
    addBtn.addEventListener("click", () => {
      addCourse(course);
    });
    actionTd.appendChild(addBtn);
    tr.appendChild(lessonNameTd);
    tr.appendChild(professorName);
    tr.appendChild(days);
    tr.appendChild(timeFrom);
    tr.appendChild(end);
    tr.appendChild(addBtn);
    courseTable.appendChild(tr);
  });
};

(() => {
  fetch(`${BASE_URL}users`, {})
    .then((res) => res.json())
    .then((res) => {
      let userPickedLessons = res?.find(
        (el) => el.username === userInfo?.username
      )?.pickedLessons;
      selectedCourses = userPickedLessons;
    })
    .catch((err) => console.error(err));

  fetch(`${BASE_URL}lessons`, {})
    .then((res) => res.json())
    .then((res) => {
      courses = res;
      createTable();
    })
    .catch((err) => console.error(err));
})();

function convertTimeToNumber(time) {
  const splitTime = time.split(":");
  return parseInt(splitTime[0] * 3600 + splitTime[1] * 60);
}

function addCourse(selectedCourse) {
  if (
    courses.find(
      (course) => course.lessonName === selectedCourse.lessonName
    )
  ) {
    notify.textContent = "شما این درس را قبلا انتخاب کرده اید";
    notify.classList.add("show-notification");
    notify.classList.add("error");
    setTimeout(() => {
      notify.innerHTML = "";
      notify.classList.remove("show-notification");
    }, 3000);
    return;
  } else if (
    courses.find(
      (course) =>
        (course.days.includes(selectedCourse.days[0]) ||
          course.days.includes(selectedCourse.days[1])) &&
        ((convertTimeToNumber(selectedCourse.timeFrom) <=
          convertTimeToNumber(course.timeTo) &&
          convertTimeToNumber(selectedCourse.timeFrom) >=
            convertTimeToNumber(course.timeFrom)) ||
          (convertTimeToNumber(selectedCourse.timeTo) <=
            convertTimeToNumber(course.timeTo) &&
            convertTimeToNumber(selectedCourse.timeTo) >=
              convertTimeToNumber(course.timeFrom)))
    )
  ) {
    notify.textContent =
      " درس انتخاب شده با سایر درس هایی که انتخاب کرده اید تداخل زمانی دارد";
    notify.classList.add("show-notification");
    notify.classList.add("error");
    setTimeout(() => {
      notify.innerHTML = "";
      notify.classList.remove("show-notification");
      notify.classList.remove("error");
    }, 3000);
    return;
  }
  courses.push(selectedCourse);
  addToSelectedCourse();
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
  courses = courses.filter(
    (el) => el.lessonName !== course.lessonName
  );
  addToSelectedCourse();
}

logout.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login/index.html";
});
