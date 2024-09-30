import { setData, updateData, removeData, randomID, queryByKeyValue } from "./firebaseConfig.js";

import { getCourses, varCour, varSem, getCookie } from "./main.js";

import { delSemester } from './semester.js'
var courses = [];
let flagTab = false;

document.addEventListener("DOMContentLoaded", async () => {
  let user = await JSON.parse(getCookie("user"));
  document.getElementById("username").innerHTML = user.name;
  document.getElementById("username1").innerHTML = user.name;
  document.getElementById("role").innerHTML = user.role;
});

async function initializtion() {
  try {
    document.getElementById('loader').style.display = 'block';
    document.getElementById('contentSection').style.display = 'none';
    courses.length = 0;
    courses = await getCourses();
    if (!flagTab) {
      tab();
      flagTab = true;
    }
    courseTable.clear().rows.add(courses).draw();
    document.getElementById('contentSection').style.display = 'block';
    document.getElementById('loader').style.display = 'none';
  } catch (error) {
    console.error("Error initializing data:", error);
  }
}

var courseTable = null;
function tab() {
  // Initialize DataTable
  courseTable = $("#courseTable").DataTable({
    columns: [
      { data: "name" },
      {
        data: null,
        orderable: false,
        searchable: false,
        render: function (data, type, row, meta) {
          const modalId = `delCourse${meta.row}`;
          const updateMID = `updateCourse${meta.row}`;
          return `
          <div class="text-end">
            <!-- Edit course -->
            <a href="#" data-bs-toggle="modal" data-bs-target="#${updateMID}" style="margin-right: 10px;">
              <i class="fa-solid fa-pencil fa-lg" style="color: #0f54ae;"></i>
            </a>
            <span class="form-switch" style="margin-right: 10px;">
              <input class="form-check-input" type="checkbox" id="${row.id}" ${row.status === true ? "checked" : ""} onchange="changestatus('${row.id}')">
            </span>          
            <div class="modal fade" id="${updateMID}" tabindex="-1">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" style="font-weight:bold;">Update Course</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <div class="row mb-3">
                      <label for="inputText" class="col-sm-2 col-form-label">Course</label>
                      <div class="col-sm-10">
                        <input type="text" class="form-control" id="updateCoursename${meta.row}" value="${row.name}" />
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="updateCourse('${meta.row}')" data-bs-dismiss="modal">Update</button>
                  </div>
                </div>
              </div>
            </div>
            <!-- Delete course -->
            <a href="#" data-bs-toggle="modal" data-bs-target="#${modalId}">
              <i class="fa-solid fa-trash fa-lg" style="color: #f00000;"></i>
            </a>
            <div class="modal fade" id="${modalId}" tabindex="-1">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" style="font-weight:bold;">Delete Course</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body text-start">
                    <p>Are you sure you want to delete course "${row.name}"?</p>
                    <p>If you delete this course then all its semester, subjects and students will be deleted</p>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                    <button type="button" class="btn btn-danger" onclick="delCourse('${row.id}')" data-bs-dismiss="modal">Yes</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        },
      },
    ],
  });
}

// validation
function validateAndAdd() {
  const courseName = document.getElementById("courseName").value.trim();
  const errorMsg = document.getElementById("error-msg");

  if (courseName === "") {
    errorMsg.style.display = "block";
  } else {
    errorMsg.style.display = "none";
    AddCourse();
    document.getElementById("courseName").value = "";
    bootstrap.Modal.getInstance(document.getElementById('basicModal')).hide();
  }
}

async function changestatus(id) {
  var status = document.getElementById(`${id}`).checked;
  updateData(`${varCour}/${id}`, { status: status });
}

// CRUD Operations

// Add Course
function AddCourse() {
  var name = document.getElementById("courseName").value.trim().toUpperCase();

  var exists = courses.some(function (course) {
    return course.name === name;
  });
  if (exists) {
    alert("This course already exists!");
  } else if (name !== "") {
    setData(`${varCour}/${randomID()}`, { name: name, status: true })
      .then(() => {
        initializtion();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

// Delete Course
async function delCourse(id) {
  var sem = await queryByKeyValue(varSem, "courseId", id);
  sem.forEach(async (temp) => {
    delSemester(temp.id);
  });
  removeData(`${varCour}/${id}`)
    .then(() => {
      initializtion();
    })
    .catch((error) => console.error("Error deleting course:", error));
}

// Update Course
function updateCourse(rowIndex) {
  var newName = document
    .getElementById(`updateCoursename${rowIndex}`)
    .value.trim()
    .toUpperCase();
  var oldName = courses[rowIndex].name;

  if (newName == "") {
    alert("Course name cannot be empty!");
    return;
  }
  if (newName !== oldName && newName !== "") {
    var index = courses.some(
      (course) => course.name.toUpperCase() === newName.toUpperCase()
    );
    if (!index) {
      updateData(`${varCour}/${courses[rowIndex].id}`, { name: newName })
        .then(() => {
          courses[rowIndex].name = newName;
          initializtion();
        })
        .catch((error) => console.error("Error updating course:", error));
    } else {
      alert("Course already exist");
    }
  }
}

// Expose functions to global scope
window.validateAndAdd = validateAndAdd;
window.delCourse = delCourse;
window.updateCourse = updateCourse;
window.changestatus = changestatus;
initializtion();
