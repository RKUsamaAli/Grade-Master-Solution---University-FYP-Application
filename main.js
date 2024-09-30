import {
  getData,
  queryByKeyValue
} from "./firebaseConfig.js";

const varCour = "courses";
const varSem = "semesters";
const varSub = "subjects";
const varStd = "students";
const varMarks = "marks";
const varUser = "users";

// Check user authentication on page load
document.addEventListener("DOMContentLoaded", async () => {
  const currentPage = window.location.pathname;
  if (currentPage.includes("login.html")) {
    return;
  }
  let token = getCookie("token");
  let user = getCookie("user");
  if (token && user) {
    user = JSON.parse(user);
    await getData(`${varUser}/${user.id}`).then((snapshot) => {
      if (snapshot.exists()) {
        if (snapshot.val().token !== token.split(" ")[1]) {
          window.location.href = "login.html";
        }
      } else {
        console.log("No user found");
        window.location.href = "login.html";
      }
    }).catch(error => {
      console.error("Error fetching user data:", error);
      window.location.href = "login.html";
    });
  } else {
    window.location.href = "login.html";
  }
});


// function to get cookie
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


// logout
const logoutButton = document.getElementById("logout");
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  });
}


// get users
async function getUsers() {
  const array = [];
  try {
    const snapshot = await getData(varUser);
    if (snapshot.exists()) {
      const promises = [];
      snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        item.id = childSnapshot.key;
        array.push(item); // Add item to array immediately
      });

      // Wait for all promises to complete
      await Promise.all(promises);
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return array;
}

// get courses
async function getCourses() {
  const array = [];
  try {
    const snapshot = await getData(varCour);
    if (snapshot.exists()) {
      const promises = [];
      snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        item.id = childSnapshot.key;
        array.push(item); // Add item to array immediately
      });

      // Wait for all promises to complete
      await Promise.all(promises);
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return array;
}


// get semesters
async function getSem() {
  const array = [];
  try {
    const sem = await queryByKeyValue(varSem, "status", true);
    if (sem.length > 0) {
      let snapshot = [];
      for (let i = 0; i < sem.length; i++) {
        await getData(`${varCour}/${sem[i].courseId}`).then((snap) => {
          if (snap.val().status == true) {
            snapshot.push(sem[i])
          }
        });
      }
      const promises = [];
      snapshot.forEach((childSnapshot) => {
        const item = childSnapshot;
        // Create a promise for fetching course data
        const coursePromise = getData(`${varCour}/${item.courseId}`).then((courseSnapshot) => {
          if (courseSnapshot.exists()) {
            const cour = courseSnapshot.val();
            item.course = cour.name;
          } else {
            item.course = 'Unknown';
          }
        });
        // Push promise to promises array and item to array
        promises.push(coursePromise);
        array.push(item); // Add item to array immediately
      });

      // Wait for all promises to complete
      await Promise.all(promises);
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return array;
}


// get semesters
async function getSub() {
  const array = [];
  try {
    const sub = await queryByKeyValue(varSub, "status", true);
    if (sub.length > 0) {
      let snapshot = [];
      for (let i = 0; i < sub.length; i++) {
        await getData(`${varCour}/${sub[i].courseId}`).then((snap) => {
          if (snap.val().status == true) {
            snapshot.push(sub[i])
          }
        });
      }
      const promises = [];
      snapshot.forEach((childSnapshot) => {
        const item = childSnapshot;
        // Create a promise for fetching course data
        const coursePromise = getData(`${varCour}/${item.courseId}`).then((courseSnapshot) => {
          if (courseSnapshot.exists()) {
            const cour = courseSnapshot.val();
            item.course = cour.name;
          } else {
            item.course = 'Unknown';
          }
        });

        // Create a promise for fetching semester data
        const semPromise = getData(`${varSem}/${item.semesterId}`).then((semSnapshot) => {
          if (semSnapshot.exists()) {
            const sem = semSnapshot.val();
            item.semester = sem.name;
          } else {
            item.semester = 'Unknown';
          }
        });
        // Push promise to promises array and item to array
        promises.push(semPromise);
        promises.push(coursePromise);
        array.push(item);
      });

      // Wait for all promises to complete
      await Promise.all(promises);
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return array;
}
// get students
async function getStd() {
  const array = [];
  try {
    const std = await queryByKeyValue(varStd, "status", true);
    if (std.length > 0) {
      let snapshot = [];
      for (let i = 0; i < std.length; i++) {
        await getData(`${varCour}/${std[i].courseId}`).then((snap) => {
          if (snap.val().status == true) {
            snapshot.push(std[i])
          }
        });
      }
      const promises = [];
      snapshot.forEach((childSnapshot) => {
        const item = childSnapshot;
        // Create a promise for fetching course data
        const coursePromise = getData(`${varCour}/${item.courseId}`).then((courseSnapshot) => {
          if (courseSnapshot.exists()) {
            const cour = courseSnapshot.val();
            item.course = cour.name;
          } else {
            item.course = 'Unknown';
          }
        });

        // Create a promise for fetching semester data
        const semPromise = getData(`${varSem}/${item.semesterId}`).then((semSnapshot) => {
          if (semSnapshot.exists()) {
            const sem = semSnapshot.val();
            item.semester = sem.name;
          } else {
            item.semester = 'Unknown';
          }
        });
        // Push promise to promises array and item to array
        promises.push(semPromise);
        promises.push(coursePromise);
        array.push(item); // Add item to array immediately
      });

      // Wait for all promises to complete
      await Promise.all(promises);
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return array;
}
// get marks
async function getMarks() {
  const array = [];
  try {
    const marks = await queryByKeyValue(varMarks, "status", true);
    if (marks.length > 0) {
      let snapshot = [];
      for (let i = 0; i < marks.length; i++) {
        await getData(`${varCour}/${marks[i].courseId}`).then((snap) => {
          if (snap.val().status == true) {
            snapshot.push(marks[i])
          }
        });
      }
      const promises = [];
      snapshot.forEach((childSnapshot) => {
        const item = childSnapshot;
        // Create a promise for fetching course data
        const coursePromise = getData(`${varCour}/${item.courseId}`).then((courseSnapshot) => {
          if (courseSnapshot.exists()) {
            const cour = courseSnapshot.val();
            item.course = cour.name;
          } else {
            item.course = 'Unknown';
          }
        });

        // Create a promise for fetching semester data
        const semPromise = getData(`${varSem}/${item.semesterId}`).then((semSnapshot) => {
          if (semSnapshot.exists()) {
            const sem = semSnapshot.val();
            item.semester = sem.name;
          } else {
            item.semester = 'Unknown';
          }
        });

        // Create a promise for fetching subject data
        const subPromise = getData(`${varSub}/${item.subjectId}`).then((subSnap) => {
          if (subSnap.exists()) {
            const sub = subSnap.val();
            item.subject = sub.name;
          } else {
            item.subject = 'Unknown';
          }
        });

        // Create a promise for fetching student data
        const stdPromise = getData(`${varStd}/${item.studentId}`).then((stdSnap) => {
          if (stdSnap.exists()) {
            const std = stdSnap.val();
            item.student = std.name;
          } else {
            item.student = 'Unknown';
          }
        });

        // Push promise to promises array and item to array
        promises.push(semPromise);
        promises.push(coursePromise);
        promises.push(subPromise);
        promises.push(stdPromise);
        array.push(item); // Add item to array immediately
      });

      // Wait for all promises to complete
      await Promise.all(promises);
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return array;
}

async function dropdownOptions(id, index = "", selected = "") {
  let options = ``;
  var array = [];
  let element = document.getElementById(id + index);

  if (!element) {
    return;
  }

  switch (id) {
    case 'course':
      array = await queryByKeyValue(varCour, "status", true);
      break;

    case 'semester':
      const course = document.getElementById(`course${index}`).value;
      array = await queryByKeyValue(varSem, "courseId", course, "status", true);
      break;

    case 'subject':
      const semester = document.getElementById(`semester${index}`).value;
      if (semester != "")
        array = await queryByKeyValue(varSub, "semesterId", semester, "status", true);
      break;

    case 'student':
      const semester1 = document.getElementById(`semester${index}`).value;
      array = await queryByKeyValue(varStd, "semesterId", semester1, "status", true);
      break;

    default:
      console.error('Invalid id provided');
      break;
  }

  for (let i = 0; i < array.length; i++) {
    if (i == 0) {
      options += `<option value="${array[i].id}" selected>${array[i].name}</option>`;
    }
    else
      options += `<option value="${array[i].id}" ${array[i].name === selected ? "selected" : ""} >${array[i].name}</option>`;
  }
  if (array.length == 0) {
    options += `<option value="" hidden disabled selected>No ${id} is present</option>`;
  }

  element.innerHTML = options;
}


function convertMarksToGrade(marks) {
  if (marks >= 90 && marks <= 100) {
    return 'A+';
  } else if (marks >= 85 && marks < 90) {
    return 'A';
  } else if (marks >= 80 && marks < 85) {
    return 'A-';
  } else if (marks >= 75 && marks < 80) {
    return 'B+';
  } else if (marks >= 70 && marks < 75) {
    return 'B';
  } else if (marks >= 65 && marks < 70) {
    return 'B-';
  } else if (marks >= 60 && marks < 65) {
    return 'C+';
  } else if (marks >= 55 && marks < 60) {
    return 'C';
  } else if (marks >= 50 && marks < 55) {
    return 'C-';
  } else if (marks >= 0 && marks < 50) {
    return 'F';
  } else {
    return 'Invalid Marks';
  }
}

function gradeToGPA(grade) {
  switch (grade.toUpperCase()) {
    case 'A+': return 4.0;
    case 'A': return 4.0;
    case 'A-': return 3.7;
    case 'B+': return 3.3;
    case 'B': return 3.0;
    case 'B-': return 2.7;
    case 'C+': return 2.3;
    case 'C': return 2.0;
    case 'C-': return 1.7;
    case 'D': return 1.0;
    case 'F': return 0.0;
    default: return null;
  }
}

async function calculateGPA(id, status = true, semesterId = "") {
  var STD_subject;
  if (status == true)
    STD_subject = await queryByKeyValue(varMarks, "studentId", id, "status", status);
  else if (semesterId != "" && status == false)
    STD_subject = await queryByKeyValue(varMarks, "studentId", id, "semesterId", semesterId);
  else
    STD_subject = await queryByKeyValue(varMarks, "studentId", id);

  // Add credit hour in subjects
  for (let i = 0; i < STD_subject.length; i++) {
    await getData(`${varSub}/${STD_subject[i].subjectId}`).then((subSnap) => {
      if (subSnap.exists()) {
        const sub = subSnap.val();
        STD_subject[i].credit = sub.credit;
      }
    });
  }

  let totalCredits = 0;
  let totalPoints = 0;

  for (let item of STD_subject) {
    const gpaValue = gradeToGPA(item.grade);
    totalCredits += parseFloat(item.credit);
    totalPoints += gpaValue * item.credit;
  }
  return (totalPoints / totalCredits).toFixed(2);
}

export { getUsers, getCourses, getSem, getSub, getStd, getMarks, calculateGPA, varUser, varCour, varSem, varSub, varStd, varMarks, getCookie, dropdownOptions, convertMarksToGrade, gradeToGPA };
