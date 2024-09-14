document.addEventListener('DOMContentLoaded', () => {
    const battleButton = document.getElementById('battleButton');
    const battleMessage = document.getElementById('battleMessage');
    const battleResults = document.getElementById('battleResults');
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        handleUnauthorized();
        return; 
    }
    battleButton.addEventListener('click', async () => {
        const userId1 = document.getElementById('userId1').value;
        const userId2 = document.getElementById('userId2').value;

        if (userId1 && userId2) {
            await startBattle(userId1, userId2);
        } else {
            battleMessage.textContent = 'Please enter both User IDs.';
            battleMessage.className = 'message warning';
        }
    });

    async function startBattle(userId1, userId2) {
        try {
            const response = await fetch('/api/battle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}` 
                },
                body: JSON.stringify({ user_id_1: userId1, user_id_2: userId2 })
            });

            if (response.status == 401) {
                handleUnauthorized();
                return; 
            }
            const result = await response.json();

            if (response.ok) {
                battleMessage.textContent = 'Battle completed successfully.';
                battleMessage.className = 'message success';
                displayResults(result);
            } else {
                battleMessage.textContent = `Error: ${result.message}`;
                battleMessage.className = 'message error';
            }
        } catch (error) {
            console.error('Error starting battle:', error);
            battleMessage.textContent = 'Failed to start battle.';
            battleMessage.className = 'message error';
        }
    }

    function displayResults(result) {
        battleResults.innerHTML = `
            <h3>Results</h3>
            <p><strong>Winner:</strong> User ID ${result.winner}</p>
            <p><strong>Points Awarded:</strong> ${result.pointsAwarded}</p>
            <p><strong>Power User 1:</strong> ${result.powerUser1}</p>
            <p><strong>Power User 2:</strong> ${result.powerUser2}</p>
        `;
    }

    function handleUnauthorized() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user_id');
        window.location.href = 'login.html';
    }
});
