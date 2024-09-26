import {
  getData,
  checkUserAuthentication,
  signOutUser,
  queryByKeyValue
} from "./firebaseConfig.js";

const varCour = "courses";
const varSem = "semesters";
const varSub = "subjects";
const varStd = "students";
const varMarks = "marks"

// Check user authentication on page load
document.addEventListener("DOMContentLoaded", () => {
  checkUserAuthentication((isAuthenticated, user) => {
    if (!isAuthenticated) {
      window.location.href = "login.html";
    } else {
      console.log("User is signed in");
    }
  });
});

// logout
document.getElementById("logout").addEventListener("click", () => {
  signOutUser()
    .then(() => {
      console.log("User signed out successfully.");
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
});

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
    const snapshot = await queryByKeyValue(varSem,"status",true);
    if (snapshot.length > 0) {
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
    const snapshot = await queryByKeyValue(varSub,"status",true);
    if (snapshot.length > 0) {
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
    const snapshot = await queryByKeyValue(varStd,"status",true);
    if (snapshot.length > 0) {
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
    const snapshot = await queryByKeyValue(varMarks,"status");
    if (snapshot.length > 0) {
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
      array = await queryByKeyValue(varCour,"status",true);
      break;

    case 'semester':
      const course = document.getElementById(`course${index}`).value;
      array = await queryByKeyValue(varSem, "courseId", course,"status",true);
      break;

    case 'subject':
      const semester = document.getElementById(`semester${index}`).value;
      if(semester != "")
        array = await queryByKeyValue(varSub, "semesterId", semester,"status",true);
      break;

    case 'student':
      const semester1 = document.getElementById(`semester${index}`).value;
      array = await queryByKeyValue(varStd, "semesterId", semester1,"status",true);
      break;

    default:
      console.error('Invalid id provided');
      break;
  }

  for (let i = 0; i < array.length; i++) {
    if(i == 0) {
      options += `<option value="${array[i].id}" selected>${array[i].name}</option>`;
    }
    else
      options += `<option value="${array[i].id}" ${array[i].name === selected ? "selected" : ""} >${array[i].name}</option>`;
    }
  if(array.length == 0)
  {
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
  switch(grade.toUpperCase()) {
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

export { getCourses, getSem, getSub, getStd, getMarks, varCour, varSem, varSub, varStd, varMarks, dropdownOptions,convertMarksToGrade,gradeToGPA };
