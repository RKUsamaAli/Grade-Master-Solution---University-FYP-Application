import {
  setData,
  removeData,
  updateData,
  randomID,
} from "./firebaseConfig.js";
import {
  getMarks,
  varMarks,
  dropdownOptions
} from "./main.js"
var marks = [];
let flagTab = false;
async function initializtion() {
  try {
    marks.length = 0;
    marks = await getMarks();

    if (!flagTab) {
      tab();
      flagTab = true;
    }
    dataTable.clear().rows.add(marks).draw();
    // Populate dropdown options
    dropdownOptions("course");
  } catch (error) {
    console.error("Error initializing data:", error);
  }
}

var dataTable;
function tab() {
  // Initialize DataTable
  dataTable = $("#marksTable").DataTable({
    columns: [
      { data: "student" },
      { data: "course" },
      { data: "semester" },
      { data: "subject" },
      { data: "marks" },
      {
        data: null,
        orderable: false,
        searchable: false,
        render: function (data, type, row, meta) {
          const modalId = `delSem${meta.row}`;
          const updateMID = `updateSem${meta.row}`;
          let txt = `
         <div class="text-end">
          <!-- Edit Subject -->
          <a onclick="dropdownOptions('course','${meta.row}','${data.course}'); 
          dropdownOptions('semester','${meta.row}','${data.semester}');
          dropdownOptions('subject','${meta.row}','${data.subject}');
          dropdownOptions('student','${meta.row}','${data.student}');" 
          data-bs-toggle="modal" data-bs-target="#${updateMID}" style="margin-right: 10px;">
            <i class="fa-solid fa-pencil fa-lg" style="color: #0f54ae;"></i>
          </a>
          <div class="modal fade" id="${updateMID}" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Update Marks</h5>
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
                      <select class="form-select" id="semester${meta.row}" onchange="dropdownOptions('subject','${meta.row}');dropdownOptions('student','${meta.row}')">
                      </select>
                    </div>
                  </div>
                  <!-- Subject -->
                  <div class="row mb-3">
                    <label class="col-sm-3 col-form-label">Subject</label>
                    <div class="col-sm-9">
                      <select class="form-select" id="subject${meta.row}">
                      </select>
                    </div>
                  </div>
                  <!-- Student -->
                  <div class="row mb-3">
                    <label class="col-sm-3 col-form-label">Student</label>
                    <div class="col-sm-9">
                      <select class="form-select" id="student${meta.row}">
                      </select>
                    </div>
                  </div>
                  <!-- marks -->
                  <div class="row mb-3">
                      <label for="inputText"
                          class="col-sm-3 col-form-label">Marks</label>
                      <div class="col-sm-9">
                          <input type="number" class="form-control" id="marks${meta.row}" value="${data.marks}" />
                      </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary" onclick="updateMarks('${meta.row}')" data-bs-dismiss="modal">Update</button>
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
                  <button type="button" class="btn btn-danger" onclick="delMarks('${data.id}')" data-bs-dismiss="modal">Yes</button>
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

// Add Semester

function AddMarks() {
  var course = document.getElementById("course").value;
  var courseSelect = $('#course option:selected').text();
  var semester = document.getElementById("semester").value;
  var semesterSelect = $('#semester option:selected').text();
  var subject = document.getElementById("subject").value;
  var subjectSelect = $('#subject option:selected').text();
  var student = document.getElementById("student").value;
  var studentSelect = $('#student option:selected').text();
  var mark = document.getElementById("marks").value.trim();

  var exists = marks.some(function (mark_) {
    return mark_.course.toUpperCase() === courseSelect.toUpperCase() &&
      mark_.semester.toUpperCase() === semesterSelect.toUpperCase() &&
      mark_.student.toUpperCase() === studentSelect.toUpperCase() &&
      mark_.subject.toUpperCase() === subjectSelect.toUpperCase()
  });

  if (exists) {
    alert("This marks already exists!");
  } else {
    setData(`${varMarks}/${randomID()}`, { courseId: course, semesterId: semester, subjectId: subject, studentId: student, marks: mark })
      .then(() => {
        initializtion();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

// Delete Semester

function delMarks(id) {
  removeData(`${varMarks}/${id}`)
    .then(() => {
      initializtion();
    })
    .catch((error) => console.error("Error deleting semester:", error));
}

function updateMarks(index) {
  var std = {};
  std.courseId = document.getElementById(`course${index}`).value;
  let courseSelect = $(`#course${index} option:selected`).text();
  std.semesterId = document.getElementById(`semester${index}`).value;
  let semesterSelect = $(`#semester${index} option:selected`).text();
  std.subjectId = document.getElementById(`subject${index}`).value;
  let subjectSelect = $(`#subject${index} option:selected`).text();
  std.studentId = document.getElementById(`student${index}`).value;
  let studentSelect = $(`#student${index} option:selected`).text();
  std.marks = parseFloat(document.getElementById(`marks${index}`).value);

  var duplicate = marks.some(function (object) {
    return (
      object.course.toUpperCase() === courseSelect.toUpperCase() &&
      object.semester.toUpperCase() === semesterSelect.toUpperCase() &&
      object.subject.toUpperCase() === subjectSelect.toUpperCase() &&
      object.student.toUpperCase() === studentSelect.toUpperCase() &&
      object.marks.toUpperCase() === std.marks.toUpperCase()
    );
  });
  if (duplicate) alert("Marks already exists!");
  else {
    console.log("Updated Data: " + JSON.stringify(std));

    updateData(`${varMarks}/${marks[index].id}`, std)
      .then(() => {
        initializtion();
      })
      .catch((error) => console.error("Error updating student:", error));
  }
}

// Course selection in addition

window.AddMarks = AddMarks;
window.delMarks = delMarks;
window.updateMarks = updateMarks;
window.dropdownOptions = dropdownOptions;
initializtion();
