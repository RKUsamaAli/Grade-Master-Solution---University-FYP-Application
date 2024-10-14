import { getData, queryByKeyValue } from "./firebaseConfig.js";
import {
  calculateGPA,
  dropdownOptions,
  getCookie,
  varCour,
  varSem,
  varSub,
  varStd,
  varMarks
} from "./main.js"

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
    document.getElementById('footer').style.display = 'none';
    await dropdownOptions("course").then(() => dropdownOptions("semester").then(() => dropdownOptions('student').then(() => showTable())));
    document.getElementById('AddMarksTable').style.display = 'block';
    document.getElementById('footer').style.display = 'block';
    document.getElementById('loader').style.display = 'none';
  } catch (error) {
    console.error("Error initializing data:", error);
  }
}

// show students marks table
async function showTable() {
  document.getElementById('loader').style.display = 'block';
  document.getElementById('semeterLoader').style.display = 'none';
  document.getElementById('footer').style.display = 'none';
  document.getElementById("stdDetail").innerHTML = "";
  let stdID = document.getElementById("student").value;
  let stdDetailTxt = ``;
  let gpatxt = ``;
  if (stdID != "") {
    var std = "";
    await getData(`${varStd}/${stdID}`).then((data) => {
      std = data.val();
    });
    var course = "";
    await getData(`${varCour}/${std.courseId}`).then((data) => {
      course = data.val();
    });
    var semester = "";
    await getData(`${varSem}/${std.semesterId}`).then((data) => {
      semester = data.val();
    });
    var cgpa = await calculateGPA(stdID, false);
    stdDetailTxt += `<h5 class="card-title mt-3">Student Detail</h5><div class="row" style="font-weight: bold;">
            <div class="col-md-4 breadcrumb-item">
                Name: ${std.name}
            </div>
            <div class="col-md-4">
                Roll No: ${std.rollNo}
            </div>
            <div class="col-md-4">
                Course: ${course.name}
            </div>
            <div class="col-md-4">
                Semester: ${semester.name}
            </div>
            <div class="col-md-4">
                CGPA: ${cgpa}
            </div>
        </div>`
    let semesters = await queryByKeyValue(varSem, "courseId", std.courseId);
    for (let i = 0; i < semesters.length; i++) {
      var marks = [];
      marks = await queryByKeyValue(varMarks, "studentId", stdID, "semesterId", semesters[i].id);
      if (marks.length !== 0) {
        gpatxt += `
                <div class="col-lg-12">
                <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">Semester:  ${semesters[i].name}</h5>
                      <table class="table table-hover">
                        <thead>
                          <tr>
                            <th scope="col">Subjects</th>
                            <th scope="col">Cr Hr</th>
                            <th scope="col">Marks</th>
                            <th scope="col">Grade</th>
                          </tr>
                        </thead>
                        <tbody>`;
        for (let j = 0; j < marks.length; j++) {
          let subject;
          await getData(`${varSub}/${marks[j].subjectId}`).then((snap) => {
            subject = snap.val();
          });
          gpatxt += `
                                <tr>
                                    <td>${subject.name}</td>
                                    <td>${subject.credit}</td>
                                    <td>${marks[j].marks}</td>
                                    <td>${marks[j].grade}</td>
                                </tr>`;
        }
        gpatxt += `</tbody>
                      </table>`
        let gpa = await calculateGPA(stdID, false, semesters[i].id)
        gpatxt += `
                      <span class="card-title" style="color:black;">GPA:  ${gpa}</span>
                    </div>  
                    </div>
                  </div>`
      }
    }
    document.getElementById("stdDetail").innerHTML = stdDetailTxt;
    document.getElementById("semesterGPA").innerHTML = gpatxt;
  }
  else {
    document.getElementById("semesterGPA").innerHTML = gpatxt;
    document.getElementById("stdDetail").innerHTML = `<h5 class="card-title mt-3">Student Detail</h5> Select student to get Transcript`;
  }
  document.getElementById('loader').style.display = 'none';
  document.getElementById('semeterLoader').style.display = 'block';
  document.getElementById('footer').style.display = 'block';
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
if (user.role === "Admin" || user.role === "Supreme Admin") {
  content += `<li class="nav-item">
        <a class="nav-link collapsed" href="admin-transcript.html">
          <i class="fa-regular fa-file"></i>
          <span>Transcript</span>
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
window.dropdownOptions = dropdownOptions;
window.showTable = showTable;
initializtion();
