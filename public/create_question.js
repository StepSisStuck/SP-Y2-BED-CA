document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        window.location.href = 'login.html';
        return; // Ensure no further code runs if no auth token
    }

    const form = document.getElementById("createQuestionForm");
    const apiUrl = "/api/questions"; // Ensure the endpoint is correct

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent the default form submission

        console.log("Form submission intercepted.");

        const authToken = localStorage.getItem('authToken'); // Get the authToken
        const question = document.getElementById('question').value;

        if (!authToken) {
            // Redirect to login if no authToken is found
            window.location.href = 'login.html';
            return;
        }

        try {
            // Create question
            const questionResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}` // Include auth token in headers
                },
                body: JSON.stringify({ question })
            });

            if (questionResponse.ok) {
                alert('Question created successfully!');
                form.reset();
            } else {
                alert('Question not created.');
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('responseMessage').textContent = 'An error occurred.';
        }
    });
});
