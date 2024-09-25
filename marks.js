import {
  getData,
  updateData,
  queryByKeyValue
} from "./firebaseConfig.js";
import {
  getMarks,
  varMarks,
  dropdownOptions,
  varStd,
} from "./main.js"
var marks = [];
let flagTab = false;
async function initializtion() {
  try {
    document.getElementById('loader').style.display = 'block';
    document.getElementById('contentSection').style.display = 'none';
    marks.length = 0;
    marks = await getMarks();

    if (!flagTab) {
      tab();
      flagTab = true;
    }
    dataTable.clear().rows.add(marks).draw();
    document.getElementById('contentSection').style.display = 'block';
    document.getElementById('loader').style.display = 'none';
    // Populate dropdown options
    dropdownOptions("course").then(() => dropdownOptions("semester").then(() => dropdownOptions('subject').then(() => showTable())));


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
    ],
  });
}

function AddMarkSection() {
  document.getElementById('contentSection').style.display = 'none';
  document.getElementById('AddMarksTable').style.display = 'block';
}

async function validateAndAdd() {
  var course = document.getElementById("course").value;
  var semester = document.getElementById("semester").value;
  var subject = document.getElementById("subject").value;

  const errormsgcourse = document.getElementById("errormsgcourse");
  const errormsgsem = document.getElementById("errormsgsem");
  const errormsgsubject = document.getElementById("errormsgsubject");
  const error = document.getElementById("error");

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

  if (subject === "") {
    errormsgsubject.style.display = "block";
    flag = false;
  } else {
    errormsgsubject.style.display = "none";
  }
  let sem = document.getElementById("semester").value;
  let sub = document.getElementById("subject").value;
  const tableData = await queryByKeyValue(varMarks, "semesterId", sem, "subjectId", sub);
  for (let i = 0; i < tableData.length; i++) {
    let mark = parseFloat(document.getElementById(`${tableData[i].studentId}`).value);
    if (isNaN(mark) || mark < 0 || mark > tableData[i].totalMarks) {
      error.style.display = "block";
      flag = false;
    } else {
      error.style.display = "none";
    }
  }


  if (flag) {
    errormsgcourse.style.display = "none";
    errormsgsem.style.display = "none";
    errormsgsubject.style.display = "none";
    error.style.display = "none";

    AddMarks(); // Function to add marks

    document.getElementById("course").value = "";
    document.getElementById("semester").value = "";
    document.getElementById("subject").value = "";
  }
}

// show students marks table
async function showTable() {
  let sem = document.getElementById("semester").value;
  let sub = document.getElementById("subject").value;
  const tableData = await queryByKeyValue(varMarks, "semesterId", sem, "subjectId", sub);
  let txt = ``;
  for (let i = 0; i < tableData.length; i++) {
    await getData(`${varStd}/${tableData[i].studentId}`).then((snap) => {
      if (snap.exists()) {
        console.log(snap);
        const std = snap.val();
        tableData[i].student = std.name;
        tableData[i].studentRollNo = std.rollNo;
      }
    });
  }
  if (document.getElementById("subject").value != "" && tableData.length != 0) {
    txt += `
  <thead>
      <tr>
          <th scope="col">Roll No</th>
          <th scope="col">Name</th>
          <th scope="col">Total Marks</th>
          <th scope="col">Marks</th>
      </tr>
  </thead>
  <tbody>`
    for (let i = 0; i < tableData.length; i++) {
      txt += `<tr>
          <td>${tableData[i].studentRollNo}</td>
          <td>${tableData[i].student}</td>
          <td>${tableData[i].totalMarks}</td>
          <td><input type="number" class="form-control" style="width: 50%;" value="${tableData[i].marks}" id="${tableData[i].studentId}"></td>
          </td>
      </tr>
    `}
    txt += `</tbody>
  </table>`;
  }
  else {
    txt = `<p>No student present</p>`;
    document.getElementById("error").style.display = "none";
  }
  document.getElementById("stdData").innerHTML = txt;
}


// CRUD Operations

// Add Semester

async function AddMarks() {
  let sem = document.getElementById("semester").value;
  let sub = document.getElementById("subject").value;
  const tableData = await queryByKeyValue(varMarks, "semesterId", sem, "subjectId", sub);

  for (let i = 0; i < tableData.length; i++) {
    let mark = parseFloat(document.getElementById(`${tableData[i].studentId}`).value);
    console.log(`Mark student${tableData[i].student}: ` + mark);
    updateData(`${varMarks}/${tableData[i].id}`, { marks: mark })
  }
  document.getElementById('AddMarksTable').style.display = 'none';
  initializtion();
}

// Course selection in addition
window.AddMarkSection = AddMarkSection;
window.validateAndAdd = validateAndAdd;
window.dropdownOptions = dropdownOptions;
window.showTable = showTable;
initializtion();
