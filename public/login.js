document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (response.ok) {
      // Store user details in localStorage
      localStorage.setItem("user_id", result.user_id);
      localStorage.setItem("username", result.username);
      localStorage.setItem("points", result.points);
      localStorage.setItem("authToken", result.token);
      // Redirect to main.html or user.html depending on your flow
      window.location.href = "main.html";
    } else {
      alert(result.message); // Display the error message
    }
  });
