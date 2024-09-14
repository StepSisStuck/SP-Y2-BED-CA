document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = '/api/classes'; // Ensure this is the correct endpoint
    const classTable = document.getElementById('class-table').getElementsByTagName('tbody')[0];
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('user_id');

    // Ensure token exists
    if (!authToken) {
        throw new Error('No authentication token found.');
    }
    async function fetchClasses() {
        try {
            const response = await fetch(apiUrl, {
                method: 'GET', // Adjust method if necessary (GET, POST, etc.)
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}` // Include auth token in headers
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch classes');
            }
            const classes = await response.json();
            classTable.innerHTML = '';
            classes.forEach(cls => {
                const row = classTable.insertRow();
                row.insertCell(0).textContent = cls.class_id; // Ensure 'class_id' matches the response
                row.insertCell(1).textContent = cls.name;
                row.insertCell(2).textContent = cls.description;
                row.insertCell(3).textContent = cls.required_points;
                row.insertCell(4).textContent = cls.date;
                row.insertCell(5).textContent = cls.time;
                if(userId==cls.user_id){
                   const actionsCell = row.insertCell(6);
                   actionsCell.innerHTML = `
                        <button class="edit" data-id="${cls.class_id}">Edit</button>
                        <button class="delete" data-id="${cls.class_id}">Delete</button>
                       `;
                   }
                   else if(cls?.users.some(user => user.user_id == userId)){
                    const actionsCell = row.insertCell(6);
                  actionsCell.innerHTML = `
                        <button">Joined</button>
                       `;
                   }
                   else {
                    const actionsCell = row.insertCell(6);
                    actionsCell.innerHTML = `
                        <button class="join" data-id="${cls.class_id}">Join</button>
                       `;
                   }
                   
            });
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    }

    async function handleAction(event) {
        if (event.target.classList.contains('edit')) {
            const classId = event.target.dataset.id;
            const name = prompt('Enter new class name:');
            const description = prompt('Enter new class description:');
            const requiredPoints = prompt('Enter new required points:');
            const date = prompt('Enter new class date (YYYY-MM-DD):');
            const time = prompt('Enter new class time (HH:MM):');
            if (name && description && requiredPoints && date && time) {
                try {
                    const response = await fetch(`${apiUrl}/${classId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken}`
                        },
                        body: JSON.stringify({
                            name,
                            description,
                            required_points: parseInt(requiredPoints, 10),
                            date,
                            time
                        })
                    });

                    if (!response.ok) {
                        throw new Error('Failed to update class');
                    }

                    alert('Class updated successfully!');
                    fetchClasses(); // Refresh the list
                } catch (error) {
                    console.error('Error updating class:', error);
                    alert('Error updating class. Please try again.');
                }
            }
        } else if (event.target.classList.contains('delete')) {
            const classId = event.target.dataset.id;
            try {
                const response = await fetch(`${apiUrl}/${classId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to delete class');
                }
                alert('Class deleted successfully!');
                fetchClasses(); // Refresh the list
            } catch (error) {
                console.error('Error deleting class:', error);
                alert('Error deleting class. Please try again.');
            }
        } else if (event.target.classList.contains('join')) {
            const classId = event.target.dataset.id;
            try {
                const response = await fetch(`${apiUrl}/${classId}/join`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to join class');
                }
    
                alert('Successfully joined the class!');
                fetchClasses(); // Refresh the list
            } catch (error) {
                console.error('Error joining class:', error);
                alert(`Error joining class: ${error.message}`);
            }
        }
        
    }

    classTable.addEventListener('click', handleAction);

    fetchClasses(); // Initial fetch to populate the table
});
