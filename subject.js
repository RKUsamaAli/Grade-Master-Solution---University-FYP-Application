import {
  setData,
  updateData,
  removeData,
  randomID,
} from "./firebaseConfig.js";
import { getSub, varSub, dropdownOptions } from "./main.js";
var subjects = [];
let flagTab = false;
async function initializtion() {
  try {
    subjects.length = 0;
    subjects = await getSub();
    if (!flagTab) {
      tab();
      flagTab = true;
    }
    dataTable.clear().rows.add(subjects).draw();

    // Populate dropdown options
    dropdownOptions("course");

  } catch (error) {
    console.error("Error initializing data:", error);
  }
}

var dataTable;
function tab() {
  // Initialize DataTable
  dataTable = $("#subTable").DataTable({
    columns: [
      { data: "name" },
      { data: "marks" },
      { data: "course" },
      { data: "semester" },
      {
        data: null,
        orderable: false,
        searchable: false,
        render: function (data, type, row, meta) {
          const modalId = `delSem${meta.row}`;
          const updateMID = `updateSub${meta.row}`;
          let txt = `
        <div class="text-end">
          <!-- Edit Subject -->
          <a onclick="dropdownOptions('course','${meta.row}','${data.course}'); dropdownOptions('semester','${meta.row}','${data.semester}')" data-bs-toggle="modal" data-bs-target="#${updateMID}" style="margin-right: 10px;">
            <i class="fa-solid fa-pencil fa-lg" style="color: #0f54ae;"></i>
          </a>
          <div class="modal fade" id="${updateMID}" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Update Subject</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <!-- course -->
                  <div class="row mb-3">
                    <label class="col-sm-3 col-form-label">Course</label>
                    <div class="col-sm-9">
                      <select class="form-select" id="course${meta.row}" onchange="dropdownOptions('semester','${meta.row}')">
                      </select>
                    </div>
                  </div>
                  <!-- Semester -->
                  <div class="row mb-3">
                    <label class="col-sm-3 col-form-label">Semester</label>
                    <div class="col-sm-9">
                      <select class="form-select" id="semester${meta.row}">
                      </select>
                    </div>
                  </div>
                  <!-- Name -->
                  <div class="row mb-3">
                    <label for="inputText" class="col-sm-3 col-form-label">Name</label>
                    <div class="col-sm-9">
                      <input type="text" class="form-control" id="name${meta.row}" value="${data.name}" />
                    </div>
                  </div>
                  <!-- Total Marks -->
                  <div class="row mb-3">
                    <label for="inputText" class="col-sm-3 col-form-label">Marks</label>
                    <div class="col-sm-9">
                      <input type="number" class="form-control" id="marks${meta.row}" value="${data.marks}" />
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary" onclick="updateSub('${meta.row}')" data-bs-dismiss="modal">Update</button>
                </div>
              </div>
            </div>
          </div>
          <!-- Delete Subject -->
          <a href="#" data-bs-toggle="modal" data-bs-target="#${modalId}">
            <i class="fa-solid fa-trash fa-lg" style="color: #f00000;"></i>
          </a>
          <div class="modal fade" id="${modalId}" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Delete Subject</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-start">
                  <p>Are you sure you want to delete this subject?</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                  <button type="button" class="btn btn-danger" onclick="delSub('${data.id}')" data-bs-dismiss="modal">Yes</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        `;
          return txt;
        },
      },
    ],
  });
}


// CRUD Operations

// Add Subject
function AddSub() {
  var name = document.getElementById("subject").value;
  var marks = document.getElementById("marks").value;
  var course = document.getElementById("course").value;
  var courseSelect = $("#course option:selected").text();
  var semester = document.getElementById("semester").value;
  var semesterSelect = $("#semester option:selected").text();
  // Check for duplicates
  var duplicate = subjects.some(function (subject) {
    return (
      subject.name.toUpperCase() === name.toUpperCase() &&
      subject.course.toUpperCase() === courseSelect.toUpperCase() &&
      subject.semester.toUpperCase() === semesterSelect.toUpperCase()
    );
  });
  if (duplicate) {
    alert("The subject already exists in the same course and semester.");
  } else {
    setData(`${varSub}/${randomID()}`, {
      name: name.toUpperCase(),
      marks: marks,
      courseId: course,
      semesterId: semester,
    })
      .then(() => {
        initializtion();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  document.getElementById("subject").value = "";
  document.getElementById("marks").value = "";
  document.getElementById("course").selectedIndex = 0;
  document.getElementById("semester").selectedIndex = 0;
}

// Delete Subject
function delSub(id) {
  removeData(`${varSub}/${id}`)
    .then(() => {
      initializtion();
    })
    .catch((error) => console.error("Error deleting subject:", error));
}

//Update Subject
function updateSub(index) {
  var name = document.getElementById(`name${index}`).value.trim();
  var marks = document.getElementById(`marks${index}`).value.trim();
  var course = document.getElementById(`course${index}`).value.trim();
  var courseSelect = $(`#course${index} option:selected`).text();
  var semester = document.getElementById(`semester${index}`).value.trim();
  var semesterSelect = $(`#semester${index} option:selected`).text();

  // Check for duplicates
  var duplicate = subjects.some(function (subject) {
    return (
      subject.name.toUpperCase() === name.toUpperCase() &&
      subject.course.toUpperCase() === courseSelect.toUpperCase() &&
      subject.semester.toUpperCase() === semesterSelect.toUpperCase()
    );
  });
  if (duplicate) {
    alert("The subject already exists in the same course and semester.");
  } else {
    updateData(`${varSub}/${subjects[index].id}`, {
      name: name.toUpperCase(),
      marks: marks,
      courseId: course,
      semesterId: semester,
    })
      .then(() => {
        initializtion();
      })
      .catch((error) => console.error("Error updating course:", error));
  }
}

window.delSub = delSub;
window.updateSub = updateSub;
window.AddSub = AddSub;
window.dropdownOptions = dropdownOptions;

// Initial call
initializtion();
