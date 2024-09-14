import {
  setData,
  updateData,
  removeData,
  randomID,
  queryByKeyValue,
} from "./firebaseConfig.js";
import { getSem, getCourses, getSub, varSem, varSub } from "./main.js";
var subjects = [];
var courses = [];
var semesters = [];
let flagTab = false;
async function initializtion() {
  // await queryDb('semesters','course','BSCS')
  try {
    subjects.length = 0;
    subjects = await getSub();
    courses.length = 0;
    courses = await getCourses();
    semesters.length = 0;
    semesters = await getSem();
    if (!flagTab) {
      tab();
      flagTab = true;
    }
    dataTable.clear().rows.add(subjects).draw();
    updateSubjectList();
  } catch (error) {
    console.error("Error initializing data:", error);
  }
}

async function updateModalSemesters(index) {
  const course = document.getElementById(`UCourse${index}`).value;
  const semesterSelect = document.getElementById(`USem${index}`);

  let sText = '<option value="">Select Semester</option>';

  if (course) {
    try {
      const allSem = await queryByKeyValue(varSem, "courseId", course);
      for (let k = 0; k < allSem.length; k++) {
        sText += `<option value="${allSem[k].id}">${allSem[k].name}</option>`;
      }
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  }

  semesterSelect.innerHTML = sText;
}

async function x(a, b, c) {
  return await queryByKeyValue(a, b, c);
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
          <a href="#" class="btn btn-no-animation" data-bs-toggle="modal" data-bs-target="#${updateMID}">
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
                  <div class="row mb-3">
                    <label for="inputText" class="col-sm-3 col-form-label">Name</label>
                    <div class="col-sm-9">
                      <input type="text" class="form-control" id="UName${meta.row}" value="${data.name}" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="inputText" class="col-sm-3 col-form-label">Marks</label>
                    <div class="col-sm-9">
                      <input type="number" class="form-control" id="UMarks${meta.row}" value="${data.marks}" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label class="col-sm-3 col-form-label">Course</label>
                    <div class="col-sm-9">
                      <select class="form-select" id="UCourse${meta.row}" onchange="updateModalSemesters(${meta.row})">
                        <option value="">Select Course</option>`;
          for (let j = 0; j < courses.length; j++) {
            txt += `<option value="${courses[j].id}" ${courses[j].name === data.course ? "selected" : ""
              }>${courses[j].name}</option>`;
          }

          txt += `</select>
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label class="col-sm-3 col-form-label">Semester</label>
                    <div class="col-sm-9">
                      <select class="form-select" id="USem${meta.row}">`;

          // Populate the semesters based on the selected course
          if (data.course) {
            // Fetch semesters and populate options
            (async () => {
              try {
                const allSem = await x(varSem, "courseId", data.courseId);
                let sText = '<option value="">Select Semester</option>';
                for (let k = 0; k < allSem.length; k++) {
                  sText += `<option value="${allSem[k].name}" ${allSem[k].name === data.semester ? "selected" : ""
                    }>${allSem[k].name}</option>`;
                }
                document.getElementById(`USem${meta.row}`).innerHTML = sText;
              } catch (error) {
                console.error("Error fetching semesters:", error);
              }
            })();
          } else {
            txt += '<option value="">Select Semester</option>';
          }

          txt += `</select>
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
          <a href="#" class="btn btn-no-animation" data-bs-toggle="modal" data-bs-target="#${modalId}">
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

// Function to populate semester options based on selected course
async function populateSemesterOptions(course) {
  let sText = `<label class="col-sm-3 col-form-label">Semester</label>
               <div class="col-sm-9">
                 <select class="form-select" aria-label="Default select example" id="semester">
                   <option selected>Select Semester</option>`;
  if (course !== "Select Course") {
    const allSem = await queryByKeyValue(varSem, "courseId", course);
    for (let i = 0; i < allSem.length; i++) {
      sText += `<option value="${allSem[i].id}">${allSem[i].name}</option>`;
    }
  }
  document.getElementById("semesterSelection").innerHTML =
    sText + `</select></div>`;
}

async function updateSubjectList() {
  let text = "";
  for (let i = 0; i < subjects.length; i++) {
    const modalId = `delSem${i}`;
    const updateMID = `updateSub${i}`;

    text += `<tr><td>${subjects[i].name}</td>
      <td>${subjects[i].marks}</td>
      <td>${subjects[i].course}</td>
      <td>${subjects[i].semester}</td>
      <td class="text-end">
        <a href="#" class="btn btn-no-animation" data-bs-toggle="modal" data-bs-target="#${updateMID}">
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
                <div class="row mb-3">
                  <label for="inputText" class="col-sm-3 col-form-label">Name</label>
                  <div class="col-sm-9">
                    <input type="text" class="form-control" id="UName${i}" value="${subjects[i].name}" />
                  </div>
                </div>
                <div class="row mb-3">
                  <label for="inputText" class="col-sm-3 col-form-label">Marks</label>
                  <div class="col-sm-9">
                    <input type="number" class="form-control" id="UMarks${i}" value="${subjects[i].marks}" />
                  </div>
                </div>
                <div class="row mb-3">
                  <label class="col-sm-3 col-form-label">Course</label>
                  <div class="col-sm-9">
                    <select class="form-select" id="UCourse${i}" onchange="updateModalSemesters(${i})">
                      <option value="">Select Course</option>`;

    for (let j = 0; j < courses.length; j++) {
      text += `<option value="${courses[j].id}" ${courses[j].name === subjects[i].course ? "selected" : ""
        }>${courses[j].name}</option>`;
    }

    text += `</select>
                  </div>
                </div>
                <div class="row mb-3">
                  <label class="col-sm-3 col-form-label">Semester</label>
                  <div class="col-sm-9">
                    <select class="form-select" id="USem${i}">
                      <option value="">Select Semester</option>`;

    // Populate the semesters based on the selected course
    if (subjects[i].course) {
      const allSem = await queryByKeyValue(
        varSem,
        "courseId",
        subjects[i].courseId
      );
      for (let k = 0; k < allSem.length; k++) {
        text += `<option value="${allSem[k].name}" ${allSem[k].name === subjects[i].semester ? "selected" : ""
          }>${allSem[k].name}</option>`;
      }
    }

    text += `</select>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onclick="updateSub('${i}')" data-bs-dismiss="modal">Update</button>
              </div>
            </div>
          </div>
        </div>
        <a href="#" class="btn btn-no-animation" data-bs-toggle="modal" data-bs-target="#${modalId}">
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
                <button type="button" class="btn btn-danger" onclick="delSub('${subjects[i].id}')" data-bs-dismiss="modal">Yes</button>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>`;
  }

  if (subjects.length !== 0) {
    $("#tBody").html(text);
  }

  // Populate course dropdown
  let courseOptions = `<select class="form-select" aria-label="Default select example" id="course">
                        <option selected>Select Course</option>`;
  for (let i = 0; i < courses.length; i++) {
    courseOptions += `<option value="${courses[i].id}">${courses[i].name}</option>`;
  }
  document.getElementById("courseSelection").innerHTML =
    courseOptions + `</select>`;

  // Add event listener for course selection change
  document
    .getElementById("course")
    .addEventListener("change", async (event) => {
      const selectedCourse = event.target.value;
      await populateSemesterOptions(selectedCourse);
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
  var name = document.getElementById(`UName${index}`).value.trim();
  var marks = document.getElementById(`UMarks${index}`).value.trim();
  var course = document.getElementById(`UCourse${index}`).value.trim();
  var courseSelect = $(`#UCourse${index} option:selected`).text();
  var semester = document.getElementById(`USem${index}`).value.trim();
  var semesterSelect = $(`#USem${index} option:selected`).text();

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
window.updateModalSemesters = updateModalSemesters;

// Initial call
initializtion();
