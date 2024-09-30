import {

  updateData,
  queryByKeyValue,
  randomID,
} from "./firebaseConfig.js";
import { varUser } from "./main.js";

document.getElementById("submitForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  var email = document.getElementById("email").value.trim();
  var password = document.getElementById("password").value.trim();

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
  if (password === "") {
    document.getElementById("passwordError").textContent =
      "Password enter password";
    valid = false;
  }
  if (!valid) return;

  password = CryptoJS.SHA256(password).toString();

  // verify user
  let snap1 = await queryByKeyValue(varUser);
  let userFound = false; // Flag to indicate if the user was found

  for (let index = 0; index < snap1.length; index++) {
    const temp = snap1[index];
    if (temp.email === email && temp.password === password) {
      // Generate token and set in cookie
      let token = createJWT({ email: temp.email, password: password }, temp.secret);
      setCookie("token", `Bearer ${token}`, 2);
      setCookie("user", JSON.stringify({ name: temp.name, email: temp.email, role: temp.role, id: temp.id }, 2));
      const dt = new Date();

      await updateData(`${varUser}/${temp.id}`, {
        token: token,
        last_login: dt,
      }).then(() => {
        // Redirect to course.html if user is found
        window.open("./users-profile.html", "_self");
      });

      userFound = true;
      break;
    }
  }

  // Display error message if no user was found
  if (!userFound) {
    document.getElementById("nouserError").textContent =
      "No user found with this email and password.";
  }

});

function setCookie(name, value, hours) {
  const expires = new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; Secure; SameSite=Strict`;
}

// token generation 
// Helper function to base64 encode
function base64Encode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

// Function to create a JWT token
function createJWT(payload, secret) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  payload.iat = Date(); // Issued at time
  console.log(Date())

  // Create header, payload, and signature
  const encodedHeader = base64Encode(JSON.stringify(header));
  const encodedPayload = base64Encode(JSON.stringify(payload));

  const signature = base64Encode(encodedHeader + "." + encodedPayload + "." + secret);

  // Return the complete token
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}
