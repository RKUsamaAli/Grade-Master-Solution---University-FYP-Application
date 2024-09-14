import {
  getData,
  fetchDataAndConvert,
  checkUserAuthentication,
  signOutUser,
  queryByKeyValue
} from "./firebaseConfig.js";

const varCour = "courses";
const varSem = "semesters";
const varSub = "subjects";
const varStd = "students";

// Check user authentication on page load
document.addEventListener("DOMContentLoaded", () => {
  checkUserAuthentication((isAuthenticated, user) => {
    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      window.location.href = "login.html";
    } else {
      console.log("User is signed in");
      // You can proceed with your page logic
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
  return await fetchDataAndConvert(varCour);
}

// get semesters
async function getSem() {
  const array = [];
  try {
    const snapshot = await getData(varSem);
    if (snapshot.exists()) {
      const promises = [];
      snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        item.id = childSnapshot.key;
        // Create a promise for fetching course data
        const coursePromise = getData(`${varCour}/${item.courseId}`).then((courseSnapshot) => {
          if (courseSnapshot.exists()) {
            const cour = courseSnapshot.val();
            item.course = cour.name;
          } else {
            item.course = 'Unknown'; // Handle case where course data is not available
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

  console.log(JSON.stringify(array, null, 2));
  return array;
}


// get semesters
async function getSub() {
  const array = [];
  try {
    const snapshot = await getData(varSub);
    if (snapshot.exists()) {
      const promises = [];
      snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        item.id = childSnapshot.key;
        // Create a promise for fetching course data
        const coursePromise = getData(`${varCour}/${item.courseId}`).then((courseSnapshot) => {
          if (courseSnapshot.exists()) {
            const cour = courseSnapshot.val();
            item.course = cour.name;
          } else {
            item.course = 'Unknown'; // Handle case where course data is not available
          }
        });

        // Create a promise for fetching semester data
        const semPromise = getData(`${varSem}/${item.semesterId}`).then((semSnapshot) => {
          if (semSnapshot.exists()) {
            const sem = semSnapshot.val();
            item.semester = sem.name;
          } else {
            item.semester = 'Unknown'; // Handle case where semester data is not available
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

  console.log(JSON.stringify(array, null, 2));
  return array;
}
// get students
async function getStd() {
  const array = [];
  try {
    const snapshot = await getData(varStd);
    if (snapshot.exists()) {
      const promises = [];
      snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        item.id = childSnapshot.key;
        // Create a promise for fetching course data
        const coursePromise = getData(`${varCour}/${item.courseId}`).then((courseSnapshot) => {
          if (courseSnapshot.exists()) {
            const cour = courseSnapshot.val();
            item.course = cour.name;
          } else {
            item.course = 'Unknown'; // Handle case where course data is not available
          }
        });

        // Create a promise for fetching semester data
        const semPromise = getData(`${varSem}/${item.semesterId}`).then((semSnapshot) => {
          if (semSnapshot.exists()) {
            const sem = semSnapshot.val();
            item.semester = sem.name;
          } else {
            item.semester = 'Unknown'; // Handle case where semester data is not available
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

  console.log(JSON.stringify(array, null, 2));
  return array;
}

export { getCourses, getSem, getSub, getStd, varCour, varSem, varSub, varStd };
