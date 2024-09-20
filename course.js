import { setData, updateData, removeData, randomID } from "./firebaseConfig.js";

import { getCourses, varCour } from "./main.js";
var courses = [];
let flagTab = false;
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
            <div class="modal fade" id="${updateMID}" tabindex="-1">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Update Course</h5>
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
                    <h5 class="modal-title">Delete Course</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body text-start">
                    <p>Are you sure you want to delete course "${row.name}"?</p>
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
    setData(`${varCour}/${randomID()}`, { name: name })
      .then(() => {
        initializtion();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

// Delete Course
function delCourse(id) {
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
window.AddCourse = AddCourse;
window.delCourse = delCourse;
window.updateCourse = updateCourse;

initializtion();
