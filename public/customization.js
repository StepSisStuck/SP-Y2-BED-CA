document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('customization-form-element');
    const retrieveButton = document.getElementById('retrieve-button');
    const appearanceInput = document.getElementById('appearance');
    const abilitiesInput = document.getElementById('abilities');
    const retrieveUserIdInput = document.getElementById('retrieve-user-id');
    const customizationAppearance = document.getElementById('customization-appearance');
    const customizationAbilities = document.getElementById('customization-abilities');

    const authToken = localStorage.getItem('authToken');

    // Function to handle 401 Unauthorized
    function handleUnauthorized() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user_id');
        window.location.href = 'login.html';
    }

    // Function to handle API requests and check for 401 Unauthorized
    async function fetchWithAuth(url, options) {
        const response = await fetch(url, options);
        if (response.status === 401) {
            handleUnauthorized();
            return null; // Return null if unauthorized
        }
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const appearance = appearanceInput.value;
        const abilities = abilitiesInput.value;

        try {
            const data = await fetchWithAuth('/api/customization', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ appearance, abilities }),
            });

            if (data) {
                alert('Customization saved successfully!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to save customization.');
        }
    });

    retrieveButton.addEventListener('click', async () => {
        const userId = retrieveUserIdInput.value;

        try {
            const data = await fetchWithAuth(`/api/customization/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (data) {
                customizationAppearance.textContent = `Appearance: ${data.appearance}`;
                customizationAbilities.textContent = `Abilities: ${data.abilities}`;
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to retrieve customization.');
        }
    });
});
