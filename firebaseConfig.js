// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getDatabase,
  set,
  get,
  update,
  remove,
  query,
  orderByChild,
  equalTo,
  ref,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyBM1iccG2c8-yl5BrLpkhx_tl8UFLnkzYc",
  authDomain: "grade-master-riu-fyp.firebaseapp.com",
  databaseURL: "https://grade-master-riu-fyp-default-rtdb.firebaseio.com",
  projectId: "grade-master-riu-fyp",
  storageBucket: "grade-master-riu-fyp.appspot.com",
  messagingSenderId: "389633784942",
  appId: "1:389633784942:web:f3112504d1bd3a2623fa7f",
  measurementId: "G-V19XYLXY32",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Function to set data in Firebase
const setData = (path, data) => {
  return set(ref(db, path), data);
};

// Function to get data from Firebase
const getData = (path) => {
  return get(ref(db, path));
};

// Function to update data in Firebase
const updateData = (path, data) => {
  return update(ref(db, path), data);
};

// Function to remove data from Firebase
const removeData = (path) => {
  return remove(ref(db, path));
};
function randomID(length = 10) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

async function fetchDataAndConvert(path) {
  var array = [];
  try {
    const snapshot = await getData(path);
    if (snapshot.exists()) {
      array.length = 0;
      snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        item.id = childSnapshot.key;
        array.push(item);
      });
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  return array;
}

// Get data (key,value) and include IDs
async function queryByKeyValue(nodePath, key, value) {
  try {
    const dbRef = ref(db, nodePath);
    const queryRef = query(dbRef, orderByChild(key), equalTo(value));
    const snapshot = await get(queryRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const rows = [];

      // Iterate over each child snapshot and convert to row format
      for (const [id, item] of Object.entries(data)) {
        item.id = id; // Append ID to item
        rows.push(item); // Convert each item into a row
      }
      return rows;
    } else {
      console.log("No data available for the given query.");
      return []; // Return empty array if no data found
    }
  } catch (error) {
    console.error("Error querying data:", error);
    throw error;
  }
}


function checkUserAuthentication(callback) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(true, user);
    } else {
      callback(false);
    }
  });
}

function signOutUser() {
  return signOut(auth);
}

export {
  setData,
  getData,
  updateData,
  removeData,
  randomID,
  fetchDataAndConvert,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  checkUserAuthentication,
  signOutUser,
  queryByKeyValue
};
