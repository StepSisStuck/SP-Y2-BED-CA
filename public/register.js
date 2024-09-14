document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    const message = document.getElementById('message');
    message.style.display = 'block';
    message.classList.remove('success', 'error');

    if (response.ok) {
        message.textContent = result.message;
        message.classList.add('success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } else {
        message.textContent = result.message;
        message.classList.add('error');
    }
});
