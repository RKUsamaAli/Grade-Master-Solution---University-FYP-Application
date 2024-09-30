import {
  getData,
  updateData,
  queryByKeyValue
} from "./firebaseConfig.js";
import {
  getMarks,
  varMarks,
  dropdownOptions,
  varStd,
  convertMarksToGrade,
  getCookie
} from "./main.js"
var marks = [];

let user = JSON.parse(getCookie("user"));
document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("username").innerHTML = user.name;
  document.getElementById("username1").innerHTML = user.name;
  document.getElementById("role").innerHTML = user.role;
});

async function initializtion() {
  try {
    document.getElementById('loader').style.display = 'block';
    document.getElementById('AddMarksTable').style.display = 'none';
    marks.length = 0;
    marks = await getMarks();
    document.getElementById('AddMarksTable').style.display = 'block';
    document.getElementById('loader').style.display = 'none';
    // Populate dropdown options
    dropdownOptions("course").then(() => dropdownOptions("semester").then(() => dropdownOptions('subject').then(() => showTable())));


  } catch (error) {
    console.error("Error initializing data:", error);
  }
}

async function validateAndAdd() {
  var course = document.getElementById("course").value;
  var semester = document.getElementById("semester").value;
  var subject = document.getElementById("subject").value;

  const errormsgcourse = document.getElementById("errormsgcourse");
  const errormsgsem = document.getElementById("errormsgsem");
  const errormsgsubject = document.getElementById("errormsgsubject");
  const error = document.getElementById("error");

  let flag = true;

  if (course === "") {
    errormsgcourse.style.display = "block";
    flag = false;
  } else {
    errormsgcourse.style.display = "none";
  }

  if (semester === "") {
    errormsgsem.style.display = "block";
    flag = false;
  } else {
    errormsgsem.style.display = "none";
  }

  if (subject === "") {
    errormsgsubject.style.display = "block";
    flag = false;
  } else {
    errormsgsubject.style.display = "none";
  }
  let sem = document.getElementById("semester").value;
  let sub = document.getElementById("subject").value;
  const tableData = await queryByKeyValue(varMarks, "semesterId", sem, "subjectId", sub);
  for (let i = 0; i < tableData.length; i++) {
    let mark = parseFloat(document.getElementById(`${tableData[i].studentId}`).value);
    if (isNaN(mark) || mark < 0 || mark > tableData[i].totalMarks) {
      error.style.display = "block";
      flag = false;
    } else {
      error.style.display = "none";
    }
  }


  if (flag) {
    errormsgcourse.style.display = "none";
    errormsgsem.style.display = "none";
    errormsgsubject.style.display = "none";
    error.style.display = "none";

    AddMarks(); // Function to add marks

    document.getElementById("course").value = "";
    document.getElementById("semester").value = "";
    document.getElementById("subject").value = "";
  }
}

// show students marks table
async function showTable() {
  let sem = document.getElementById("semester").value;
  let sub = document.getElementById("subject").value;
  const tableData = await queryByKeyValue(varMarks, "semesterId", sem, "subjectId", sub, "status", true);
  let txt = ``;
  for (let i = 0; i < tableData.length; i++) {
    await getData(`${varStd}/${tableData[i].studentId}`).then((snap) => {
      if (snap.exists()) {
        const std = snap.val();
        tableData[i].student = std.name;
        tableData[i].studentRollNo = std.rollNo;
      }
    });
  }
  if (document.getElementById("subject").value != "" && tableData.length != 0) {
    txt += `
  <thead>
      <tr>
          <th scope="col">Roll No</th>
          <th scope="col">Name</th>
          <th scope="col">Total Marks</th>
          <th scope="col">Grade</th>
          <th scope="col">Marks</th>
      </tr>
  </thead>
  <tbody>`
    for (let i = 0; i < tableData.length; i++) {
      txt += `<tr>
          <td>${tableData[i].studentRollNo}</td>
          <td>${tableData[i].student}</td>
          <td>${tableData[i].totalMarks}</td>
          <td>${tableData[i].grade}</td>
          <td><input type="number" class="form-control" style="width: 50%; height: 30px;" value="${tableData[i].marks}" id="${tableData[i].studentId}"></td>
          </td>
      </tr>
    `}
    txt += `</tbody>
  </table>`;
  }
  else {
    txt = `<p>No student present</p>`;
    document.getElementById("error").style.display = "none";
  }
  document.getElementById("stdData").innerHTML = txt;
}


// CRUD Operations

// Add Semester

async function AddMarks() {
  let sem = document.getElementById("semester").value;
  let sub = document.getElementById("subject").value;
  const tableData = await queryByKeyValue(varMarks, "semesterId", sem, "subjectId", sub);

  for (let i = 0; i < tableData.length; i++) {
    let mark = parseFloat(document.getElementById(`${tableData[i].studentId}`).value);
    let grade = convertMarksToGrade(mark);
    updateData(`${varMarks}/${tableData[i].id}`, { marks: mark, grade: grade })
  }
  document.getElementById('AddMarksTable').style.display = 'none';
  initializtion();
}

// users-separation based on role

let content = ``;
if (user.role === "Admin" || user.role === "Supreme Admin") {
  content += `
    <li class="nav-item">
        <a class="nav-link collapsed" href="user.html">
          <i class="bi bi-person-circle"></i>
          <span>Users</span>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link collapsed" href="course.html">
          <i class="fa-solid fa-graduation-cap"></i>
          <span>Courses</span>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link collapsed" href="semester.html">
          <i class="bi bi-calendar3"></i>
          <span>Semesters</span>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link collapsed" href="subject.html">
          <i class="bi bi-book"></i>
          <span>Subjects</span>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link collapsed" href="students.html">
          <i class="bi bi-people"></i>
          <span>Students</span>
        </a>
      </li>`
}

if (user.role === "Admin" || user.role === "Supreme Admin" || user.role === "Teacher") {
  content += `<li class="nav-item">
        <a class="nav-link collapsed" href="marks.html">
          <i class="fa-solid fa-check"></i>
          <span>Marks</span>
        </a>
      </li>`
}

content += `
<li class="nav-item">
  <a class="nav-link collapsed" href="users-profile.html">
    <i class="bi bi-person"></i>
    <span>Profile</span>
  </a>
</li>`

document.getElementById("sidebar-nav").innerHTML = content;

// Course selection in addition
window.validateAndAdd = validateAndAdd;
window.dropdownOptions = dropdownOptions;
window.showTable = showTable;
initializtion();
