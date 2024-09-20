import {
  setData,
  removeData,
  randomID,
  queryByKeyValue
} from "./firebaseConfig.js";
import {
  getSem,
  varCour,
  varSem,
  dropdownOptions
} from "./main.js"
var semesters = [];
let flagTab = false;
async function initializtion() {
  try {
    semesters.length = 0;
    semesters = await getSem();
    if (!flagTab) {
      tab();
      flagTab = true;
    }
    dataTable.clear().rows.add(semesters).draw();
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

function delSemester(id) {
  removeData(`${varSem}/${id}`)
    .then(() => {
      initializtion();
    })
    .catch((error) => console.error("Error deleting semester:", error));
}

// Course selection in addition

window.AddSemester = AddSemester;
window.delSemester = delSemester;
window.dropdownOptions = dropdownOptions;

initializtion();
