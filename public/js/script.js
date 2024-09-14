document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form-container form');
    const message = document.querySelector('.message');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Assuming validation and AJAX call here
        // On success:
        showMessage('Registration successful! Redirecting to login...', 'success');
        // Redirect after a delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);

        // On error:
        // showMessage('An error occurred. Please try again.', 'error');
    });

    function showMessage(text, type) {
        message.textContent = text;
        message.className = `message ${type} show`;
        setTimeout(() => {
            message.classList.remove('show');
        }, 3000);
    }
});
