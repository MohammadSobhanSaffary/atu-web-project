"use strict";
const BASE_URL =
  "https://6663f754932baf9032a97f8a.mockapi.io/api/atu/web-project/";
const courseTable = document.querySelector(".course-table");
const selectedCourseTable = document.querySelector(".selected-courses-table");
const notify = document.querySelector(".notify");
const logout = document.querySelector(".logout");
const userType = document.querySelector(".usertype");
const usernameSpan = document.querySelector(".username");

const newLessonName = document.querySelector("#course-name");
const newLessonTeacher = document.querySelector("#instructor-name");
const newLessonDay1 = document.querySelector("#class-day-1");
const newLessonDay2 = document.querySelector("#class-day-2");
const newLessonTimeFrom = document.querySelector("#start-time");
const newLessonTimeTo = document.querySelector("#end-time");
const addNewLessonBtn = document.querySelector(".add-new-course");

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
      removeRow(course);
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
  fetch(`${BASE_URL}lessons`, {})
    .then((res) => res.json())
    .then((res) => {
      courses = res;
      createTable();
    })
    .catch((err) => console.error(err));
})();

function addCourse() {
  let newCourse = {
    isPresented: true,
    lessonName: newLessonName.value.trim(),
    professorName: newLessonTeacher.value.trim(),
    days: [newLessonDay1.value.trim(), newLessonDay2.value.trim()],
    timeFrom: newLessonTimeFrom.value.trim(),
    timeTo: newLessonTimeTo.value.trim(),
  };
  if (Object.values(newCourse).flat().includes("")) {
    notify.textContent = "پرکردن تمامی فیلدها الزامی است.";
    notify.classList.add("show-notification");
    notify.classList.add("error");
    setTimeout(() => {
      notify.innerHTML = "";
      notify.classList.remove("show-notification");
      notify.classList.remove("error");
    }, 3000);
    return;
  } else {
    fetch(BASE_URL + "lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCourse),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        courses = [...courses, res];
        createTable();
        newLessonName.value = "";
        newLessonTeacher.value = "";
        newLessonDay1.value = "";
        newLessonDay2.value = "";
        newLessonTimeFrom.value = "";
        newLessonTimeTo.value = "";
        notify.textContent = "درس انتخاب شده با موفقیت اضافه شد.";
        notify.classList.add("show-notification");
        notify.classList.add("success");
        setTimeout(() => {
          notify.innerHTML = "";
          notify.classList.remove("show-notification");
          notify.classList.remove("success");
        }, 3000);
      });
  }
}

function removeRow(selectedCourse) {
  fetch(BASE_URL + "lessons/" + selectedCourse.lessonId, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  })
    .then((res) => res.json())
    .then((res) => {
      courses = courses.filter(
        (course) => course.lessonId !== selectedCourse.lessonId
      );
      createTable();

      notify.textContent = "درس انتخاب شده با موفقیت حذف شد.";
      notify.classList.add("show-notification");
      notify.classList.add("success");
      setTimeout(() => {
        notify.innerHTML = "";
        notify.classList.remove("show-notification");
        notify.classList.remove("success");
      }, 3000);
    })
    .catch((err) => console.error(err));
}

logout.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login/index.html";
});


addNewLessonBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addCourse();
});
