import {
  setData,
  removeData,
  randomID,
  fetchDataAndConvert,
} from "./firebaseConfig.js";
import {
  getSem,
  getCourses
} from "./main.js"
var semesters = [];
var courses = [];
let flagTab = false;
async function initializtion() {
  try {
    semesters.length = 0;
    semesters = await getSem();
    console.log(semesters)
    courses.length = 0;
    courses = await getCourses();
    console.log(courses)
    if (!flagTab) {
      tab();
      flagTab = true;
    }
    dataTable.clear().rows.add(semesters).draw();
    updateSemesterList();
  } catch (error) {
    console.error("Error initializing data:", error);
  }
}
var dataTable;
function tab() {
  // Initialize DataTable
  dataTable = $("#semTable").DataTable({
    columns: [
      { data: "name" },
      { data: "course" },
      {
        data: null,
        orderable: false,
        searchable: false,
        render: function (data, type, row, meta) {
          const modalId = `delSem${meta.row}`;
          return `
          <div class="text-end">
            <a href="#" class="btn btn-no-animation" data-bs-toggle="modal" data-bs-target="#${modalId}">
              <i class="fa-solid fa-trash fa-lg" style="color: #f00000;"></i>
            </a>
            <div class="modal fade" id="${modalId}" tabindex="-1">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Delete Semester</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body text-start">
                    <p>Are you sure you want to delete Semester "${row.name}" of "${row.course}"?</p>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                    <button type="button" class="btn btn-danger" onclick="delSemester('${row.id}')" data-bs-dismiss="modal">Yes</button>
                  </div>
                </div>
              </div>
            </div><!-- End Basic Modal-->
          </div>
        `;
        },
      },
    ],
  });
}

// Function to update the displayed semester list
async function updateSemesterList() {
  var text = ``;
  for (let i = 0; i < semesters.length; i++) {
    var course = await fetchDataAndConvert(`courses/${semesters[i].course}`);
    const modalId = `delSem${i}`;
    text += `<tr><td>${semesters[i].name}</td>
      <td>${semesters[i].course}</td>
      <td class="text-end">
   <!-- delete semester -->
                <a href="#" class="btn btn-no-animation" data-bs-toggle="modal" data-bs-target="#${modalId}"><i class="fa-solid fa-trash fa-lg" style="color: #f00000;"></i></a>
                <div class="modal fade" id="${modalId}" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Delete Semester</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-start">
                  <p>Are you sure you want to delete Semester "${semesters[i].name}" of "${semesters[i].course}"?</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                  <button type="button" class="btn btn-danger" onclick="delSemester('${semesters[i].id}')" data-bs-dismiss="modal">Yes</button>
                </div>
              </div>
            </div>
          </div><!-- End Basic Modal-->
        </td>
      </tr>`;
  }
  if (semesters.length != 0) $("#taBody").html(text);

  var x = `<select
  class="form-select"
  aria-label="Default select example"
  id="course"
>
  <option selected>
    Select course
  </option>`;
  for (let i = 0; i < courses.length; i++) {
    x += `<option value= "${courses[i].id}">${courses[i].name}</option>`;
  }
  document.getElementById("courseShow").innerHTML = x + `</select>`;
}

// Add Courses code in selection of adding course

// CRUD Operations

// Add Semester

function AddSemester() {
  var name = document.getElementById("semesterName").value.trim();
  var course = document.getElementById("course").value;
  var courseSelect = $('#course option:selected').text();

  var exists = semesters.some(function (semester) {
    return semester.name === name && semester.course.toUpperCase() === courseSelect.toUpperCase();
  });

  if (exists) {
    alert("This semester already exists!");
  } else if (name !== "") {
    setData(`semesters/${randomID()}`, { name: name, courseId: course })
      .then(() => {
        initializtion();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

// Delete Semester

function delSemester(id) {
  removeData(`semesters/${id}`)
    .then(() => {
      initializtion();
    })
    .catch((error) => console.error("Error deleting semester:", error));
}

// Course selection in addition

window.AddSemester = AddSemester;
window.delSemester = delSemester;

initializtion();
