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

function createTable() {
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
}

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
      addToSelectedCourseTable();
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
    selectedCourses.find(
      (course) => course.lessonId === selectedCourse.lessonId
    )
  ) {
    notify.textContent = "شما این درس را قبلا انتخاب کرده اید";
    notify.classList.add("show-notification");
    notify.classList.add("error");
    setTimeout(() => {
      notify.innerHTML = "";
      notify.classList.remove("show-notification");
      notify.classList.remove("error");
    }, 1000);
    return;
  } else if (
    selectedCourses.find(
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
    }, 1000);
    return;
  } else if (selectedCourses.length > 5) {
    notify.textContent = "تعداد واحد های انتخاب شده شما حداکثر مقدار می باشد.";
    notify.classList.add("show-notification");
    notify.classList.add("error");
    setTimeout(() => {
      notify.innerHTML = "";
      notify.classList.remove("show-notification");
      notify.classList.remove("error");
    }, 1000);
    return;
  }
  selectedCourses.push(selectedCourse);
  addToSelectedCourseTable();
  userInfo = { ...userInfo, pickedLessons: selectedCourses };
  fetch(BASE_URL + "users/" + userInfo.userId, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userInfo),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      notify.textContent = "درس انتخاب شده با موفقیت اضافه شد.";
      notify.classList.add("show-notification");
      notify.classList.add("success");

      setTimeout(() => {
        notify.innerHTML = "";
        notify.classList.remove("show-notification");
        notify.classList.remove("success");
      }, 1000);
    })
    .catch((err) => console.error(err));
}

const addToSelectedCourseTable = () => {
  selectedCourseTable.innerHTML = "";
  selectedCourses.forEach((course) => {
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
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "حذف";
    removeBtn.classList.add("remove");
    removeBtn.classList.add("btn");
    removeBtn.addEventListener("click", () => {
      removeRow(course);
    });
    actionTd.appendChild(removeBtn);
    tr.appendChild(lessonNameTd);
    tr.appendChild(professorName);
    tr.appendChild(days);
    tr.appendChild(timeFrom);
    tr.appendChild(end);
    tr.appendChild(actionTd);
    selectedCourseTable.appendChild(tr);
  });
};
addToSelectedCourseTable();

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
    .then((res) => {
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

  localStorage.setItem("userInfo", JSON.stringify(userInfo));
  addToSelectedCourseTable();
}

logout.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login/index.html";
});
