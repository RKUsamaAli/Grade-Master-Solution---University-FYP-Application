import {
  setData,
  updateData,
  removeData,
  randomID,
} from "./firebaseConfig.js";
import {
  getStd,
  varStd,
  dropdownOptions
} from "./main.js";

var students = [];
let flagTab = false;
async function initializtion() {
  try {
    students.length = 0;
    students = await getStd();
    if (!flagTab) {
      tab();
      flagTab = true;
    }
    dataTable.clear().rows.add(students).draw();

    // Populate dropdown options
    dropdownOptions("course");
  } catch (error) {
    console.error("Error initializing data:", error);
  }
}

var dataTable;
function tab() {
  // Initialize DataTable
  dataTable = $("#stdTable").DataTable({
    columns: [
      { title: "Name", data: "name" },
      { title: "Course", data: "course" },
      { title: "Semester", data: "semester" },
      { title: "CGPA", data: "cgpa" },
      { title: "DOB", data: "dob" },
      {
        data: null,
        orderable: false,
        searchable: false,
        render: function (data, type, row, meta) {
          const modalId = `delSem${meta.row}`;
          const updateMID = `updateSem${meta.row}`;
          let txt = `
            <div class="text-end">
          <!-- Edit Student -->
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
                  <!-- First Name -->
                  <div class="row mb-3">
                    <label for="inputText" class="col-sm-3 col-form-label">Name</label>
                    <div class="col-sm-9">
                      <input type="text" class="form-control" id="name${meta.row}" value="${data.name}" />
                    </div>
                  </div>
                  <!-- cgpa -->
                  <div class="row mb-3">
                    <label for="inputText" class="col-sm-3 col-form-label">CGPA</label>
                    <div class="col-sm-9">
                      <input type="number" class="form-control" id="cgpa${meta.row}" value="${data.cgpa}" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="inputDate" class="col-sm-3 col-form-label">DOB</label>
                    <div class="col-sm-9">
                      <input type="date" id="dob${meta.row}" class="form-control" value="${data.dob}" />
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary" onclick="updateSTD('${meta.row}')" data-bs-dismiss="modal">Update</button>
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
                  <h5 class="modal-title">Delete Student</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-start">
                  <p>Are you sure you want to delete this Student?</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                  <button type="button" class="btn btn-danger" onclick="delSTD('${data.id}')" data-bs-dismiss="modal">Yes</button>
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

// CRUD Operation

// Add Student
function Addstd() {
  console.log("In add function");
  var std = {};
  std.name = document.getElementById("name").value.toUpperCase();
  std.courseId = document.getElementById("course").value;
  var courseSelect = $("#course option:selected").text();
  std.semesterId = document.getElementById("semester").value;
  var semesterSelect = $("#semester option:selected").text();
  std.cgpa = parseFloat(document.getElementById("cgpa").value);
  std.dob = document.getElementById("dob").value;

  var duplicate = students.some(function (object) {
    return (
      object.name.toUpperCase() === std.name.toUpperCase() &&
      object.course.toUpperCase() === courseSelect.toUpperCase() &&
      object.semester === semesterSelect &&
      object.dob === std.dob
    );
  });
  if (duplicate) alert("Student already exists!");
  else {
    setData(`${varStd}/${randomID()}`, std)
      .then(() => {
        initializtion();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  document.getElementById("name").value = "";
  document.getElementById("course").selectedIndex = 0;
  document.getElementById("semester").selectedIndex = 0;
  document.getElementById("cgpa").value = "";
  document.getElementById("dob").value = "";
}

function delSTD(index) {
  removeData(`${varStd}/${index}`)
    .then(() => {
      initializtion();
    })
    .catch((error) => console.error("Error deleting student:", error));
}

function updateSTD(index) {
  var std = {};
  std.name = document.getElementById(`name${index}`).value.toUpperCase();
  std.courseId = document.getElementById(`course${index}`).value;
  let courseSelect = $(`#course${index} option:selected`).text();
  std.semesterId = document.getElementById(`semester${index}`).value;
  let semesterSelect = $(`#semester${index} option:selected`).text();
  std.cgpa = parseFloat(document.getElementById(`cgpa${index}`).value);
  std.dob = document.getElementById(`dob${index}`).value;

  var duplicate = students.some(function (object) {
    return (
      object.name.toUpperCase() === std.name.toUpperCase() &&
      object.course.toUpperCase() === courseSelect.toUpperCase() &&
      object.semester === semesterSelect &&
      object.dob === std.dob &&
      object.cgpa === std.cgpa

    );
  });
  if (duplicate) alert("Student already exists!");
  else {
    console.log("Updated Data: " + JSON.stringify(std));

    updateData(`${varStd}/${students[index].id}`, std)
      .then(() => {
        initializtion();
      })
      .catch((error) => console.error("Error updating student:", error));
  }
}

window.Addstd = Addstd;
window.delSTD = delSTD;
window.updateSTD = updateSTD;
window.dropdownOptions = dropdownOptions;
// Initial call
initializtion();
