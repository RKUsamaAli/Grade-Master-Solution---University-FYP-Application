import {
  setData,
  getAuth,
  createUserWithEmailAndPassword,
} from "./firebaseConfig.js";

const auth = getAuth();

document.getElementById("submitForm").addEventListener('submit', (e) => {
  e.preventDefault();
  var username = document.getElementById("username").value.trim();
  var password = document.getElementById("password").value.trim();
  var name = document.getElementById("name").value.trim();
  var email = document.getElementById("email").value.trim();

  // Clear previous error messages
  document.getElementById('emailError').textContent = '';
  document.getElementById('passwordError').textContent = '';
  document.getElementById('usernameError').textContent = '';
  document.getElementById('nameError').textContent = '';
  document.getElementById('nouserError').textContent = '';

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
  // name validation
  if (name.trim() === '') {
    document.getElementById('nameError').textContent = 'Name cannot be empty.';
    valid = false;
  }
  // Password validation
  if (password.length < 8) {
    document.getElementById('passwordError').textContent = 'Password must be at least 8 characters long.';
    valid = false;
  }

  if (!valid) return;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("In signup Authentication")
      // Signed up
      const user = userCredential.user;

      setData('users/' + user.uid, { username: username, email: email, password: password, name: name })
        .then(() => {
          alert("User Created!");
          window.open("./login.html", "_self");
        })
        .catch((error) => {
          console.error("Error adding user: ", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/email-already-in-use') {
        document.getElementById('nouserError').textContent = 'User with this email already exist';
      } else {
        alert('An error occurred: ' + errorMessage);
      }
    });
})

