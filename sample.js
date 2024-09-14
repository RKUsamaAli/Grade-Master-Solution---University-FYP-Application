// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getDatabase, set, get, update, remove, query, orderByChild, equalTo, ref } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfwcdEwtX2L3KdO9fGbRXh0Fw2qqKq2wQ",
  authDomain: "fir-a6c95.firebaseapp.com",
  databaseURL: "https://fir-a6c95-default-rtdb.firebaseio.com",
  projectId: "fir-a6c95",
  storageBucket: "fir-a6c95.appspot.com",
  messagingSenderId: "716368310266",
  appId: "1:716368310266:web:97d8f6f2c666d95440be43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();



// Query by username
document.getElementById('submitForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const email = document.getElementById('email').value;

  // Clear previous error messages
  document.getElementById('emailError').textContent = '';
  document.getElementById('passwordError').textContent = '';
  document.getElementById('usernameError').textContent = '';

  let valid = true;

  // Email validation
  if (!email.endsWith('@gmail.com')) {
    document.getElementById('emailError').textContent = 'Please use a Gmail address.';
    valid = false;
  }
  // Username validation
  if (username.trim() === '') {
    document.getElementById('usernameError').textContent = 'Username cannot be empty.';
    valid = false;
  }
  // Password validation
  if (password.length < 8) {
    document.getElementById('passwordError').textContent = 'Password must be at least 8 characters long.';
    valid = false;
  }

  if (!valid) return;

  console.log(username + " " + password + " " + email)
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("In signup Authentication")
      // Signed up
      const user = userCredential.user;

      set(ref(database, 'users/' + user.uid), { username: username, email: email, password: password })
        .then(() => {
          alert("User Created!");
          window.open("./course.html", "_blank");
        })
        .catch((error) => {
          console.error("Error adding user: ", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Error code: ${errorCode}, Error message: ${errorMessage}`);
    });

});




async function queryByKeyValue(nodePath, key, value) {
  try {
    const dbRef = ref(database, nodePath);
    const queryRef = query(dbRef, orderByChild(key), equalTo(value));
    const snapshot = await get(queryRef);

    if (snapshot.exists()) {
      return snapshot.val(); // Return the matched data
    } else {
      return {}; // No data found
    }
  } catch (error) {
    console.error('Error querying data:', error);
    throw error;
  }
}




