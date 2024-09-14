document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const updateButton = document.getElementById('updateButton');
    const updateMessage = document.getElementById('updateMessage');
    const userTableBody = document.getElementById('userTableBody');
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        handleUnauthorized();
        return; // Ensure no further code runs if no auth token
    }
    // Fetch and display users when the page loads
    fetchUsers();

    searchButton.addEventListener('click', () => {
        const userId = document.getElementById('searchId').value;
        if (userId) {
            fetchUserById(userId);
        } else {
            alert('Please enter a user ID');
        }
    });

    updateButton.addEventListener('click', async () => {
        const newUsername = document.getElementById('newUsername').value;
        if (newUsername) {
            await updateUsername(newUsername);
        } else {
            alert('Please enter both User ID and new username');
        }
    });

    async function fetchUsers() {
        try {
            const response = await fetch('/api/users', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            const users = await response.json();
            console.log('Fetched users:', users); // Log fetched users

            if (Array.isArray(users) && users.length > 0) {
                userTableBody.innerHTML = users.map(user => 
                    `<tr>
                        <td>${user.user_id}</td>
                        <td>${user.username}</td>
                        <td>${user.points}</td>
                    </tr>`
                ).join('');
            } else {
                userTableBody.innerHTML = '<tr><td colspan="3">No users found</td></tr>';
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            userTableBody.innerHTML = '<tr><td colspan="3">Error fetching users</td></tr>';
        }
    }

    async function fetchUserById(userId) {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}` // Include auth token in headers
                }
            });
            if (!response.ok) {
                throw new Error('User not found');
            }
            const user = await response.json();
            console.log('Fetched user by ID:', user); // Log fetched user

            userTableBody.innerHTML = 
                `<tr>
                    <td>${user.user_id}</td>
                    <td>${user.username}</td>
                    <td>${user.points}</td>
                </tr>`;
        } catch (error) {
            userTableBody.innerHTML = '<tr><td colspan="3">User not found</td></tr>';
            console.error('Error fetching user by ID:', error);
        }
    }

    async function updateUsername(newUsername) {
        try {
            const response = await fetch(`/api/users`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}` // Include auth token in headers
                
                },
                body: JSON.stringify({ username: newUsername })
            });
            const result = await response.json();
            console.log('Update response:', result); // Log update response

            if (response.ok) {
                updateMessage.textContent = 'Username updated successfully.';
                updateMessage.className = 'message success';
                fetchUsers();
            } else {
                updateMessage.textContent = `Error: ${result.message}`;
                updateMessage.className = 'message error';
            }
        } catch (error) {
            console.error('Error updating username:', error);
            updateMessage.textContent = 'Failed to update username.';
            updateMessage.className = 'message error';
        }
    }

    function handleUnauthorized() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user_id');
        window.location.href = 'login.html';
    }
});
