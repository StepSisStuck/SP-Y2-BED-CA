document.addEventListener("DOMContentLoaded", () => {
  // Check for authToken
  const authToken = localStorage.getItem("authToken"); // Or use sessionStorage, or wherever you store it

  if (!authToken) {
    // Redirect to login.html if authToken is not present
    window.location.href = "login.html";
    return; // Exit to prevent further execution
  }

  const form = document.getElementById("create-class-form");
  const apiUrl = "/api/classes"; // Ensure the endpoint is correct

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      required_points: parseInt(formData.get("required_points"), 10),
      date: formData.get("date"),
      time: formData.get("time"),
    };

    console.log("Data to be sent:", data); // Debugging line

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}` // Add the authToken to the headers
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user_id');
                window.location.href = 'login.html';
            } else {
                const errorText = await response.text();
                throw new Error(`Failed to create class: ${errorText}`);
            }
        } else {
            alert('Class created successfully!');
            form.reset();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error creating class. Please try again.');
    }
});
});
