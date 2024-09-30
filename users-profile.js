import { getData, updateData } from "./firebaseConfig.js";

import { getCookie, varUser, calculateGPA, varStd, varCour, varSem } from "./main.js";
document.getElementById('loader').style.display = 'block';
document.getElementById('contentSection').style.display = 'none';
let user = JSON.parse(getCookie("user"));
document.addEventListener("DOMContentLoaded", async () => {
  await getData(`${varUser}/${user.id}`).then((snap) => {
    document.getElementById("username").innerHTML = snap.val().name;
    document.getElementById("username1").innerHTML = snap.val().name;
    document.getElementById("username2").innerHTML = snap.val().name;
    document.getElementById("username3").innerHTML = snap.val().name;
    document.getElementById("role").innerHTML = snap.val().role;
    document.getElementById("role1").innerHTML = snap.val().role;
    document.getElementById("role2").innerHTML = snap.val().role;
    document.getElementById("useremail").innerHTML = snap.val().email;
  })
});

// users-separation based on role

let content = ``;
if (user.role === "Admin" || user.role === "Supreme Admin") {
  content += `
    <li class="nav-item">
        <a class="nav-link collapsed" href="user.html">
          <i class="bi bi-person-circle"></i>
          <span>Users</span>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link collapsed" href="course.html">
          <i class="fa-solid fa-graduation-cap"></i>
          <span>Courses</span>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link collapsed" href="semester.html">
          <i class="bi bi-calendar3"></i>
          <span>Semesters</span>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link collapsed" href="subject.html">
          <i class="bi bi-book"></i>
          <span>Subjects</span>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link collapsed" href="students.html">
          <i class="bi bi-people"></i>
          <span>Students</span>
        </a>
      </li>`
}

if (user.role === "Admin" || user.role === "Supreme Admin" || user.role === "Teacher") {
  content += `<li class="nav-item">
        <a class="nav-link collapsed" href="marks.html">
          <i class="fa-solid fa-check"></i>
          <span>Marks</span>
        </a>
      </li>`
}
if (user.role === "Student") {
  content += `<li class="nav-item">
      <a class="nav-link collapsed" href="transcript.html">
        <i class="fa-regular fa-file"></i>
        <span>Transcript</span>
      </a>
    </li>`
}

content += `
<li class="nav-item">
  <a class="nav-link collapsed" href="users-profile.html">
    <i class="bi bi-person"></i>
    <span>Profile</span>
  </a>
</li>`

document.getElementById("sidebar-nav").innerHTML = content;

async function changePassword() {
  let newpwd = document.getElementById("newPassword").value.trim();
  let flag = true;
  if (newpwd === "") {
    document.getElementById("pwderror").innerHTML = "Please enter password";
    flag = false;
  }
  if (flag) {
    newpwd = CryptoJS.SHA256(newpwd).toString();
    await updateData(`${varUser}/${user.id}`, { password: newpwd }).then(() => {
      document.getElementById("pwderror").innerHTML = "";
      document.getElementById("newPassword").value = "";
      alert("Password changed successfully!");
    });
  }
}

// edit profile

if (user.role === "Admin" || user.role === "Supreme Admin" || user.role === "Teacher") {
  document.getElementById("editprofile").style.display = "block";
  document.getElementById("UfullName").value = user.name;
  document.getElementById("UEmail").value = user.email;
}
function editProfile() {
  let fullName = document.getElementById("UfullName").value.trim();
  let email = document.getElementById("UEmail").value.trim();
  let flag = true;
  if (fullName === "") {
    document.getElementById("fullNameError").innerHTML = "Please enter full name";
    flag = false;
  }
  if (email === "") {
    document.getElementById("emailError").innerHTML = "Please enter email";
    flag = false;
  } else if (!email.endsWith("@gmail.com")) {
    document.getElementById("emailError").innerHTML = "Please enter a valid email address";
    flag = false;
  }
  if (flag) {
    console.log(fullName + " " + email)
    updateData(`${varUser}/${user.id}`, { name: fullName, email: email }).then(() => {
      document.getElementById("fullNameError").innerHTML = "";
      document.getElementById("emailError").innerHTML = "";
      alert("Profile updated successfully!");
    });
  }
}

if (user.role === "Student") {
  let cgpa = await calculateGPA(user.id);
  var RollNo = "";
  var course = "";
  var semester = "";
  var dob = "";
  await getData(`${varStd}/${user.id}`).then((snap) => {
    if (snap.exists()) {
      RollNo = snap.val().rollNo;
      course = snap.val().courseId;
      semester = snap.val().semesterId;
      dob = snap.val().dob;
    }
  });
  await getData(`${varCour}/${course}`).then((snap) => {
    if (snap.exists()) {
      course = snap.val().name;
    }
  });
  await getData(`${varSem}/${semester}`).then((snap) => {
    if (snap.exists()) {
      semester = snap.val().name;
    }
  });
  console.log("CGPA: " + cgpa)
  document.getElementById("cgpa").innerHTML = `<div class="row">
                    <div class="col-lg-3 col-md-4 label">CGPA</div>
                    <div class="col-lg-9 col-md-8" id="role2">${cgpa}</div>
                  </div>
                  <div class="row">
                    <div class="col-lg-3 col-md-4 label">Roll No</div>
                    <div class="col-lg-9 col-md-8" id="role2">${RollNo}</div>
                  </div><div class="row">
                    <div class="col-lg-3 col-md-4 label">Course</div>
                    <div class="col-lg-9 col-md-8" id="role2">${course}</div>
                  </div>
                  </div><div class="row">
                    <div class="col-lg-3 col-md-4 label">Semester</div>
                    <div class="col-lg-9 col-md-8" id="role2">${semester}</div>
                  </div>
                  </div><div class="row">
                    <div class="col-lg-3 col-md-4 label">Date of Birth</div>
                    <div class="col-lg-9 col-md-8" id="role2">${dob}</div>
                  </div>
                  `
}
document.getElementById('contentSection').style.display = 'block';
document.getElementById('loader').style.display = 'none';
window.editProfile = editProfile;
window.changePassword = changePassword;
