import {

  updateData,
  getAuth,
  signInWithEmailAndPassword,
} from "./firebaseConfig.js";

const auth = getAuth();

document.getElementById("submitForm").addEventListener("submit", (e) => {
  e.preventDefault();
  var email = document.getElementById("email").value.trim();
  var password = document.getElementById("password").value.trim();
  console.log(email + " " + password);

  // Clear previous error messages
  document.getElementById("emailError").textContent = "";
  document.getElementById("passwordError").textContent = "";
  document.getElementById("nouserError").textContent = "";
  let valid = true;

  // Email validation
  if (!email.endsWith("@gmail.com")) {
    document.getElementById("emailError").textContent =
      "Please use a Gmail address.";
    valid = false;
  }
  // Password validation
  if (password.length < 8) {
    document.getElementById("passwordError").textContent =
      "Password must be at least 8 characters long.";
    valid = false;
  }
  if (!valid) return;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("In sign in authentication");
      // Signed in
      const user = userCredential.user;
      const dt = new Date();
      updateData("users/" + user.uid, {
        last_login: dt,
      }).then(() => {
        window.open("./course.html", "_self");
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === "auth/invalid-credential") {
        document.getElementById("nouserError").textContent =
          "Invalid email or password";
      } else {
        alert("An error occurred: " + errorMessage);
      }
    });
});
