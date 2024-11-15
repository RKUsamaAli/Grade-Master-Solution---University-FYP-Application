import {
  setData,
  updateData,
  removeData,
  randomID,
  queryByKeyValue,
} from "./firebaseConfig.js";

import { delSemester } from "./semester.js";
import { COLLECTIONS, getCourses, getCookie } from "./common.js";

let courses = [];
let courseTable = null;
let isTabInitialized = false;

// Fetch user information
const user = JSON.parse(await getCookie("user"));

document.addEventListener("DOMContentLoaded", () => {
  displayUserInfo(user);
  if (isAdmin(user.role)) {
    showAdminTranscriptOption();
  }
});

// Display user information in the UI
function displayUserInfo(user) {
  document.getElementById("username").textContent = user.name;
  document.getElementById("username1").textContent = user.name;
  document.getElementById("role").textContent = user.role;
}

// Check if the user is an admin
function isAdmin(role) {
  return role === "Admin" || role === "Super Admin";
}

// Show admin transcript option in the navigation
function showAdminTranscriptOption() {
  document.getElementById("showTranscript").innerHTML = `
    <li class="nav-item">
      <a class="nav-link collapsed" href="admin-transcript.html">
        <i class="fa-regular fa-file"></i><span>Transcript</span>
      </a>
    </li>`;
}

// Initialize data and UI components
async function initialize() {
  toggleLoader(true);
  try {
    courses = await getCourses();
    if (!isTabInitialized) {
      initializeDataTable();
      isTabInitialized = true;
    }
    updateCourseTable();
  } catch (error) {
    console.error("Error initializing data:", error);
  } finally {
    toggleLoader(false);
  }
}

// Toggle loader visibility
function toggleLoader(isLoading) {
  document.getElementById("loader").style.display = isLoading ? "block" : "none";
  document.getElementById("contentSection").style.display = isLoading
    ? "none"
    : "block";
}

// Initialize DataTable for courses
function initializeDataTable() {
  courseTable = $("#courseTable").DataTable({
    columns: [
      { data: "name" },
      {
        data: null,
        orderable: false,
        searchable: false,
        render: (data, type, row, meta) => renderCourseActions(row, meta.row),
      },
    ],
  });
}

// Update DataTable with current course data
function updateCourseTable() {
  courseTable.clear().rows.add(courses).draw();
}

// Render action buttons (edit, toggle status, delete)
function renderCourseActions(row, rowIndex) {
  return `
    <div class="text-end">
      <a href="#" data-bs-toggle="modal" data-bs-target="#updateCourseModal${rowIndex}">
        <i class="fa-solid fa-pencil fa-lg" style="color: #0f54ae;"></i>
      </a>
      <span class="form-switch mx-2">
        <input type="checkbox" class="form-check-input" id="${row.id}" ${row.status ? "checked" : ""} 
        onchange="changestatus('${row.id}')">
      </span>
      <a href="#" data-bs-toggle="modal" data-bs-target="#deleteCourseModal${rowIndex}">
        <i class="fa-solid fa-trash fa-lg" style="color: #f00000;"></i>
      </a>
    </div>`;
}

// Validate and add a new course
function validateAndAdd() {
  const courseName = document.getElementById("courseName").value.trim().toUpperCase();
  const errorMsg = document.getElementById("error-msg");

  if (!courseName) {
    errorMsg.style.display = "block";
    return;
  }

  errorMsg.style.display = "none";
  addCourse(courseName);
}

// Add a new course to the database
async function addCourse(name) {
  if (courses.some(course => course.name === name)) {
    alert("This course already exists!");
    return;
  }

  try {
    await setData(`${COLLECTIONS.courses}/${randomID()}`, { name, status: true });
    await initialize();
  } catch (error) {
    console.error("Error adding course:", error);
  }
}

// Change course status
async function changestatus(courseId) {
  const status = document.getElementById(courseId).checked;
  try {
    await updateData(`${COLLECTIONS.courses}/${courseId}`, { status });
  } catch (error) {
    console.error("Error updating course status:", error);
  }
}

// Delete a course along with its related data
async function delCourse(courseId) {
  try {
    const semesters = await queryByKeyValue(COLLECTIONS.semesters, "courseId", courseId);
    for (const semester of semesters) {
      await delSemester(semester.id);
    }
    await removeData(`${COLLECTIONS.courses}/${courseId}`);
    await initialize();
  } catch (error) {
    console.error("Error deleting course:", error);
  }
}

// Update course name
async function updateCourse(rowIndex) {
  const newName = document.getElementById(`updateCoursename${rowIndex}`).value.trim().toUpperCase();
  const currentName = courses[rowIndex]?.name;

  if (!newName || newName === currentName) {
    alert("Course name cannot be empty or the same as the current name!");
    return;
  }

  if (courses.some(course => course.name === newName)) {
    alert("Course with this name already exists!");
    return;
  }

  try {
    const courseId = courses[rowIndex].id;
    await updateData(`${COLLECTIONS.courses}/${courseId}`, { name: newName });
    await initialize();
  } catch (error) {
    console.error("Error updating course:", error);
  }
}

// Expose functions to global scope
window.validateAndAdd = validateAndAdd;
window.delCourse = delCourse;
window.updateCourse = updateCourse;
window.changestatus = changestatus;

initialize();
