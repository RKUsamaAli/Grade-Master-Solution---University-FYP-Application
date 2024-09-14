import {
  setData,
  updateData,
  removeData,
  randomID,
  queryByKeyValue,
} from "./firebaseConfig.js";
import {
  getSem,
  getCourses,
  getStd,
  varCour,
  varSem,
  varStd,
  varSub,
} from "./main.js";

var students = [];
var courses = [];
var semesters = [];
let flagTab = false;
async function initializtion() {
  try {
    students.length = 0;
    students = await getStd();
    courses.length = 0;
    courses = await getCourses();
    semesters.length = 0;
    semesters = await getSem();
    if (!flagTab) {
      tab();
      flagTab = true;
    }
    dataTable.clear().rows.add(students).draw();
    updateSTDList();
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
  dataTable = $("#stdTable").DataTable({
    columns: [
      { title: "First Name", data: "firstName" },
      { title: "Last Name", data: "lastName" },
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
                
                <!-- edit course -->
       
                <a href="#" class="btn btn-no-animation" data-bs-toggle="modal" data-bs-target="#${updateMID}"><i class="fa-solid fa-pencil fa-lg" style="color: #0f54ae;"></i></a>
                <div class="modal fade" id="${updateMID}" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Update Student</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                            <!-- First Name -->
                            <div class="row mb-3">
                              <label
                                for="inputText"
                                class="col-sm-3 col-form-label"
                                >First Name</label
                              >
                              <div class="col-sm-9">
                                <input
                                  type="text"
                                  class="form-control"
                                  id="UfName${meta.row}"
                                  value="${students[meta.row].firstName}"
                                />
                              </div>
                            </div>
                            <!-- lname -->
                            <div class="row mb-3">
                              <label
                                for="inputText"
                                class="col-sm-3 col-form-label"
                                >Last Name</label
                              >
                              <div class="col-sm-9">
                                <input
                                  type="text"
                                  class="form-control"
                                  id="UlName${meta.row}"
                                  value="${students[meta.row].lastName}"
                                />
                              </div>
                            </div>
                            <div class="row mb-3">
                    <label class="col-sm-3 col-form-label">Course</label>
                    <div class="col-sm-9">
                      <select class="form-select" id="UCourse${meta.row
            }" onchange="updateModalSemesters(${meta.row})">
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
                      <select class="form-select" id="USem${meta.row}">
                        <option value="">Select Semester</option>`;

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
                            <!-- cgpa -->
                            <div class="row mb-3">
                              <label
                                for="inputText"
                                class="col-sm-3 col-form-label"
                                >CGPA</label
                              >
                              <div class="col-sm-9">
                                <input
                                  type="number"
                                  class="form-control"
                                  id="Ucgpa${meta.row}"
                                  value="${students[meta.row].cgpa}"
                                />
                              </div>
                            </div>
                            <div class="row mb-3">
                              <label for="inputDate" class="col-sm-3 col-form-label">DOB</label>
                              <div class="col-sm-9">
                                <input type="date" id="Udob${meta.row
            }" value="${students[meta.row].dob
            }" class="form-control">
                              </div>
                            </div>
                  </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary" onclick="updateSTD('${meta.row
            }')" data-bs-dismiss="modal">Update</button>
                </div>
              </div>
            </div>
          </div><!-- End Basic Modal-->

                <!-- Delete Student -->
                <a href="#" class="btn btn-no-animation" data-bs-toggle="modal" data-bs-target="#${modalId}">
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
                      <p>Are you sure you want to delete this course?</p>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                      <button type="button" class="btn btn-danger" onclick="delSTD('${students[meta.row].id
            }')" data-bs-dismiss="modal">Yes</button>
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

async function updateSTDList() {
  var text = ``;
  for (var i = 0; i < students.length; i++) {
    const modalId = `delSem${i}`;
    const updateMID = `updateSub${i}`;
    text += `<tr>
                        <td>${students[i].firstName}</td>
                        <td>${students[i].lastName}</td>
                        <td>${students[i].course}</td>
                        <td>${students[i].semester}</td>
                        <td>${students[i].cgpa}</td>
                        <td>${students[i].dob}</td>
                        <td class="text-end">
        <!-- edit course -->
       
                <a href="#" class="btn btn-no-animation" data-bs-toggle="modal" data-bs-target="#${updateMID}"><i class="fa-solid fa-pencil fa-lg" style="color: #0f54ae;"></i></a>
                <div class="modal fade" id="${updateMID}" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Update Student</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                            <!-- First Name -->
                            <div class="row mb-3">
                              <label
                                for="inputText"
                                class="col-sm-3 col-form-label"
                                >First Name</label
                              >
                              <div class="col-sm-9">
                                <input
                                  type="text"
                                  class="form-control"
                                  id="UfName${i}"
                                  value="${students[i].firstName}"
                                />
                              </div>
                            </div>
                            <!-- lname -->
                            <div class="row mb-3">
                              <label
                                for="inputText"
                                class="col-sm-3 col-form-label"
                                >Last Name</label
                              >
                              <div class="col-sm-9">
                                <input
                                  type="text"
                                  class="form-control"
                                  id="UlName${i}"
                                  value="${students[i].lastName}"
                                />
                              </div>
                            </div>
                            <div class="row mb-3">
                  <label class="col-sm-3 col-form-label">Course</label>
                  <div class="col-sm-9">
                    <select class="form-select" id="UCourse${i}" onchange="updateModalSemesters(${i})">
                      <option value="">Select Course</option>`;

    for (let j = 0; j < courses.length; j++) {
      text += `<option value="${courses[j].id}" ${courses[j].name === students[i].course ? "selected" : ""
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
    if (students[i].course) {
      const allSem = await queryByKeyValue(
        varSem,
        "courseId",
        students[i].courseId
      );
      for (let k = 0; k < allSem.length; k++) {
        text += `<option value="${allSem[k].name}" ${allSem[k].name === students[i].semester ? "selected" : ""
          }>${allSem[k].name}</option>`;
      }
    }

    text += `</select>
                  </div>
                </div>
                            <!-- cgpa -->
                            <div class="row mb-3">
                              <label
                                for="inputText"
                                class="col-sm-3 col-form-label"
                                >CGPA</label
                              >
                              <div class="col-sm-9">
                                <input
                                  type="number"
                                  class="form-control"
                                  id="Ucgpa${i}"
                                  value="${students[i].cgpa}"
                                />
                              </div>
                            </div>
                            <div class="row mb-3">
                              <label for="inputDate" class="col-sm-3 col-form-label">DOB</label>
                              <div class="col-sm-9">
                                <input type="date" id="Udob${i}" value="${students[i].dob}" class="form-control">
                              </div>
                            </div>
                  </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary" onclick="updateSTD('${i}')" data-bs-dismiss="modal">Update</button>
                </div>
              </div>
            </div>
          </div><!-- End Basic Modal-->
        
                <!-- delete Student -->
          <a href="#" class="btn btn-no-animation" data-bs-toggle="modal" data-bs-target="#${modalId}"><i class="fa-solid fa-trash fa-lg" style="color: #f00000;"></i></a>
          <div class="modal fade" id="${modalId}" tabindex="-1">
              <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                  <h5 class="modal-title">Delete Course</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body text-start">
                  <p>Are you sure you want to delete this student?</p>
                  </div>
                  <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                  <button type="button" class="btn btn-danger" onclick="delSTD('${students[i].id}')" data-bs-dismiss="modal">Yes</button>
                  </div>
              </div>
              </div>
          </div><!-- End Basic Modal-->
                
                    </td></tr>`;
  }
  if (students.length != 0) document.getElementById("tBody").innerHTML = text;

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

// CRUD Operation

// Add Student
function Addstd() {
  console.log("In add function");
  var std = {};
  std.firstName = document.getElementById("fName").value.toUpperCase();
  std.lastName = document.getElementById("lName").value.toUpperCase();
  std.courseId = document.getElementById("course").value;
  var courseSelect = $("#course option:selected").text();
  std.semesterId = document.getElementById("semester").value;
  var semesterSelect = $("#semester option:selected").text();
  std.cgpa = parseFloat(document.getElementById("cgpa").value);
  std.dob = document.getElementById("dob").value;

  var duplicate = students.some(function (object) {
    return (
      object.firstName.toUpperCase() === std.firstName.toUpperCase() &&
      object.lastName.toUpperCase() === std.lastName.toUpperCase() &&
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

  document.getElementById("fName").value = "";
  document.getElementById("lName").value = "";
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
  std.firstName = document.getElementById(`UfName${index}`).value.toUpperCase();
  std.lastName = document.getElementById(`UlName${index}`).value.toUpperCase();
  std.course = document.getElementById(`UCourse${index}`).value.toUpperCase();
  let courseSelect = $(`#UCourse${index} option:selected`).text();
  std.semester = document.getElementById(`USem${index}`).value;
  let semesterSelect = $(`#USem${index} option:selected`).text();
  std.cgpa = parseFloat(document.getElementById(`Ucgpa${index}`).value);
  std.dob = document.getElementById(`Udob${index}`).value;

  var duplicate = students.some(function (object) {
    return (
      object.firstName.toUpperCase() === std.firstName.toUpperCase() &&
      object.lastName.toUpperCase() === std.lastName.toUpperCase() &&
      object.course.toUpperCase() === courseSelect.toUpperCase() &&
      object.semester === semesterSelect &&
      object.dob === std.dob
    );
  });
  if (duplicate) alert("Student already exists!");
  else {
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
window.updateModalSemesters = updateModalSemesters;
// Initial call
initializtion();
