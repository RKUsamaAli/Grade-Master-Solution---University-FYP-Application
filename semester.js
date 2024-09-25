import {
  setData,
  removeData,
  randomID,
  queryByKeyValue
} from "./firebaseConfig.js";
import {
  getSem,
  varSem,
  dropdownOptions,
  varStd,
  varSub
} from "./main.js";
import {delSTD} from './student.js';
import {delSub} from './subject.js';
var semesters = [];
let flagTab = false;
async function initializtion() {
  try {
    document.getElementById('loader').style.display = 'block';
    document.getElementById('contentSection').style.display = 'none';
    semesters.length = 0;
    semesters = await getSem();
    if (!flagTab) {
      tab();
      flagTab = true;
    }
    dataTable.clear().rows.add(semesters).draw();
    document.getElementById('contentSection').style.display = 'block';
    document.getElementById('loader').style.display = 'none';
    // Populate dropdown options
    dropdownOptions("course");
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
            <a href="#" data-bs-toggle="modal" data-bs-target="#${modalId}" style="margin-right: 10px;">
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

// validation
function validateAndAdd() {
  var name = document.getElementById("semesterName").value.trim();
  var course = document.getElementById("course").value;

  const errormsgname = document.getElementById("error-msg-name");
  const errormsgcourse = document.getElementById("error-msg-course");

  let flag = true;
  
  if (name === "") {
    errormsgname.style.display = "block";
    flag = false;
  } 

  if (course === "") {
    errormsgcourse.style.display = "block";
    flag = false;
  }

  if (flag) {
    errormsgname.style.display = "none";
    errormsgcourse.style.display = "none";

    AddSemester();

    document.getElementById("semesterName").value = "";
    document.getElementById("course").value = "";
    
    bootstrap.Modal.getInstance(document.getElementById('basicModal')).hide();
  }
}

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
    setData(`${varSem}/${randomID()}`, { name: name, courseId: course })
      .then(() => {
        initializtion();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

// Delete Semester

async function delSemester(id) {
  var std = await queryByKeyValue(varStd,"semesterId",id);
  std.forEach(async (mark) => {
    delSTD(mark.id);
  });
  var sub = await queryByKeyValue(varSub,"semesterId",id);
  sub.forEach(async (mark) => {
    delSub(mark.id);
  });
  removeData(`${varSem}/${id}`)
    .then(() => {
      initializtion();
    })
    .catch((error) => console.error("Error deleting semester:", error));
}

// Course selection in addition

window.validateAndAdd = validateAndAdd;
window.delSemester = delSemester;
window.dropdownOptions = dropdownOptions;

initializtion();

export {delSemester}