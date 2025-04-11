// Handle Sign In
document.getElementById("signin-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const identifier = document.getElementById("signin-identifier").value.trim().toLowerCase();
  const password = document.getElementById("signin-password").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const matchedUser = users.find(user =>
    (user.username.toLowerCase() === identifier || user.email.toLowerCase() === identifier) &&
    user.password === password
  );

  if (!matchedUser) {
    alert("Invalid username/email or password.");
    return;
  }

  localStorage.setItem("username", matchedUser.username);
  localStorage.setItem("gamesPlayed", matchedUser.gamesPlayed || 0);
  localStorage.setItem("highScore", matchedUser.highScore || 0);

  window.location.href = "index.html";
});

// Handle Sign Up
document.getElementById("signup-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim().toLowerCase();
  const password = document.getElementById("signup-password").value;
  const confirm = document.getElementById("signup-confirm").value;

  if (!username || !email || !password || !confirm) {
    alert("Please fill out all fields.");
    return;
  }

  if (password !== confirm) {
    alert("Passwords do not match.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.some(u => u.username === username || u.email === email)) {
    alert("An account with that username or email already exists.");
    return;
  }

  const newUser = {
    username,
    email,
    password,
    gamesPlayed: 0,
    highScore: 0
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("username", username);
  localStorage.setItem("gamesPlayed", 0);
  localStorage.setItem("highScore", 0);

  window.location.href = "index.html";
});