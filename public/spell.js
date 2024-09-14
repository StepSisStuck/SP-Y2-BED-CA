document.addEventListener('DOMContentLoaded', () => {
    const createSpellButton = document.getElementById('createSpellButton');
    const createSpellMessage = document.getElementById('createSpellMessage');
    const warningMessage = document.getElementById('warningMessage');
    const spellTableBody = document.getElementById('spellTableBody');
    const authToken = localStorage.getItem('authToken'); // Get the authToken
    const userId = localStorage.getItem('user_id');

    if (!authToken) {
        handleUnauthorized();
        return; // Ensure no further code runs if no auth token
    }

    // Fetch and display spells when the page loads
    fetchSpells();

    createSpellButton.addEventListener('click', async () => {
        const spellName = document.getElementById('spellName').value;
        const spellDescription = document.getElementById('spellDescription').value;
        const spellPower = document.getElementById('spellPower').value;

        if (spellName && spellDescription && spellPower) {
            await createSpell(spellName, spellDescription, spellPower);
        } else {
            warningMessage.textContent = 'Please enter Spell Name, Description, and Power';
            warningMessage.className = 'message warning';
        }
    });

    async function fetchSpells() {
        try {
            const response = await fetch('/api/spells', {
                headers: {
                    'Authorization': `Bearer ${authToken}` 
                }
            });

            if (response.status === 401) {
                handleUnauthorized();
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch spells');
            }

            const spells = await response.json();
            spellTableBody.innerHTML = spells.map(spell => `
                <tr>
                    <td>${spell.spell_id}</td>
                    <td>${spell.name}</td>
                    <td>${spell.description}</td>
                    <td>${spell.power}</td>
                    <td>${spell.user_id}</td>
                    <td>
                       ${userId == spell.user_id ? `
                        <button class="update-button" data-spell-id="${spell.spell_id}">Update</button>
                        <button class="delete-button" data-spell-id="${spell.spell_id}">Delete</button>
                      ` : ''}
                    </td>

                </tr>
            `).join('');

            attachEventListeners();  // Re-attach event listeners
        } catch (error) {
            console.error('Error fetching spells:', error);
        }
    }

    function attachEventListeners() {
        const updateButtons = document.querySelectorAll('.update-button');
        const deleteButtons = document.querySelectorAll('.delete-button');

        updateButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const spellId = event.target.getAttribute('data-spell-id');
                updateSpell(spellId);
            });
        });

        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const spellId = event.target.getAttribute('data-spell-id');
                deleteSpell(spellId);
            });
        });
    }

    async function createSpell(spellName, spellDescription, spellPower) {
        try {
            const response = await fetch('/api/spells', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}` // Include auth token in headers
                },
                body: JSON.stringify({ name: spellName, description: spellDescription, power: spellPower })
            });

            if (response.status === 401) {
                handleUnauthorized();
                return;
            }

            const result = await response.json();
            if (response.ok) {
                createSpellMessage.textContent = 'Spell created successfully.';
                createSpellMessage.className = 'message success';
                warningMessage.textContent = ''; // Clear warning message
                fetchSpells();  // Refresh the spell list after creation
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error creating spell:', error);
            createSpellMessage.textContent = `Failed to create spell: ${error.message}`;
            createSpellMessage.className = 'message error';
        }
    }

    function updateSpell(spellId) {
        const newName = prompt('Enter new spell name:');
        const newDescription = prompt('Enter new spell description:');
        const newPower = prompt('Enter new spell power:');

        if (newName && newDescription && newPower) {
            fetch(`/api/spells/${spellId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}` // Include auth token in headers
                },
                body: JSON.stringify({ name: newName, description: newDescription, power: newPower })
            })
            .then(response => {
                if (response.status === 401) {
                    handleUnauthorized();
                    return;
                }
                return response.json();
            })
            .then(data => {
                if (!data) return; // If data is not available, exit
                console.log('Spell updated:', data);
                fetchSpells();  // Refresh the list
            })
            .catch(error => {
                console.error('Error updating spell:', error);
                alert(`Error updating spell: ${error.message}`);
            });
        }
    }

    function deleteSpell(spellId) {
        if (confirm('Are you sure you want to delete this spell?')) {
            fetch(`/api/spells/${spellId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}` // Include auth token in headers
                }
            })
            .then(response => {
                if (response.status === 401) {
                    handleUnauthorized();
                    return;
                }
                return response.json();
            })
            .then(data => {
                if (!data) return; // If data is not available, exit
                console.log('Spell deleted:', data);
                fetchSpells();  // Refresh the list
            })
            .catch(error => {
                console.error('Error deleting spell:', error);
                alert(`Error deleting spell: ${error.message}`);
            });
        }
    }

    function handleUnauthorized() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user_id');
        window.location.href = 'login.html';
    }
});
