import {
  setData,
  updateData,
  removeData,
  randomID,
  queryByKeyValue,
} from "./firebaseConfig.js";
import {
  getStd,
  getSub,
  varStd,
  varSub,
  varMarks,
  dropdownOptions
} from "./main.js";

var students = [];
var subjects = [];
let flagTab = false;
async function initializtion() {
  try {
    document.getElementById('loader').style.display = 'block';
    document.getElementById('contentSection').style.display = 'none';
    students.length = 0;
    students = await getStd();
    
    if (!flagTab) {
      tab();
      flagTab = true;
    }
    dataTable.clear().rows.add(students).draw();
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
                  <!-- Roll No -->
                  <div class="row mb-3">
                    <label for="inputText" class="col-sm-3 col-form-label">Roll No</label>
                    <div class="col-sm-9">
                      <input type="text" class="form-control" id="rollNo${meta.row}" value="${data.rollNo}" />
                    </div>
                  </div>
                  <!-- Name -->
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

function validateAndAdd() {
  var course = document.getElementById("course").value;
  var semester = document.getElementById("semester").value;
  var name = document.getElementById("name").value.trim();
  var cgpa = document.getElementById("cgpa").value.trim();
  var dob = document.getElementById("dob").value.trim();
  var rollNo = document.getElementById("rollNo").value.trim();

  const errormsgcourse = document.getElementById("errormsgcourse");
  const errormsgsem = document.getElementById("errormsgsem");
  const errormsgname = document.getElementById("errormsgname");
  const errormsgcgpa = document.getElementById("errormsgcgpa");
  const errormsgdob = document.getElementById("errormsgdob");
  const errormsgrollno = document.getElementById("errormsgrollno");

  let flag = true;

  if (course === "") {
    errormsgcourse.style.display = "block";
    flag = false;
  } else {
    errormsgcourse.style.display = "none";
  }

  if (semester === "") {
    errormsgsem.style.display = "block";
    flag = false;
  } else {
    errormsgsem.style.display = "none";
  }

  if (rollNo === "") {
    errormsgrollno.style.display = "block";
    flag = false;
  } else {
    errormsgrollno.style.display = "none";
  }
  if (name === "") {
    errormsgname.style.display = "block";
    flag = false;
  } else {
    errormsgname.style.display = "none";
  }

  if (cgpa === "" || isNaN(cgpa) || cgpa < 0 || cgpa > 4) {
    errormsgcgpa.style.display = "block";
    flag = false;
  } else {
    errormsgcgpa.style.display = "none";
  }

  if (dob === "") {
    errormsgdob.style.display = "block";
    flag = false;
  } else {
    errormsgdob.style.display = "none";
  }

  if (flag) {
    errormsgcourse.style.display = "none";
    errormsgsem.style.display = "none";
    errormsgname.style.display = "none";
    errormsgcgpa.style.display = "none";
    errormsgdob.style.display = "none";

    Addstd();

    document.getElementById("course").value = "";
    document.getElementById("semester").value = "";
    document.getElementById("name").value = "";
    document.getElementById("cgpa").value = "";
    document.getElementById("dob").value = "";
    document.getElementById("rollNo").value = "";

    bootstrap.Modal.getInstance(document.getElementById('basicModal')).hide();
  }
}


// CRUD Operation

// Add Student
async function Addstd() {
  console.log("In add function");
  var std = {};
  std.name = document.getElementById("name").value.toUpperCase();
  std.courseId = document.getElementById("course").value;
  std.semesterId = document.getElementById("semester").value;
  std.cgpa = parseFloat(document.getElementById("cgpa").value);
  std.dob = document.getElementById("dob").value;
  std.rollNo = document.getElementById("rollNo").value;

  var duplicate = students.some(function (object) {
    return (
      object.rollNo === std.rollNo
    );
  });
  if (duplicate) alert("Student already exists!");
  else {
    var stdID = randomID();
    subjects.length = 0;
    subjects = await queryByKeyValue(varSub,"semesterId",std.semesterId);
    for (let i = 0; i < subjects.length; i++) {
      var mark = {}
      mark.courseId = std.courseId;
      mark.semesterId = std.semesterId;
      mark.subjectId = subjects[i].id;
      mark.studentId = stdID;
      mark.marks = 0;
      mark.totalMarks = subjects[i].marks;
      setData(`${varMarks}/${randomID()}`, mark);
    }
    setData(`${varStd}/${stdID}`, std)
      .then(() => {
        initializtion();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

async function delSTD(index) {
  var markData = await queryByKeyValue(varMarks,"studentId",index);
  markData.forEach(async (mark) => {
    await removeData(`${varMarks}/${mark.id}`);
  });
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
  std.semesterId = document.getElementById(`semester${index}`).value;
  std.cgpa = parseFloat(document.getElementById(`cgpa${index}`).value);
  std.dob = document.getElementById(`dob${index}`).value;
  std.rollNo = document.getElementById(`rollNo${index}`).value;

  var duplicate = students.some(function (object) {
    return (
      object.rollNo === std.rollNo
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

window.validateAndAdd = validateAndAdd;
window.delSTD = delSTD;
window.updateSTD = updateSTD;
window.dropdownOptions = dropdownOptions;
// Initial call
initializtion();

export {delSTD}
