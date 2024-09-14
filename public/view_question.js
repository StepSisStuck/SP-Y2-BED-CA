document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const updateButton = document.getElementById('updateButton');
    const questionTableBody = document.getElementById('questionTableBody');
    const searchQuestionId = document.getElementById('searchQuestionId');
    const updateQuestionId = document.getElementById('updateQuestionId');
    const updateQuestionText = document.getElementById('updateQuestionText');
    const updateMessage = document.getElementById('updateMessage');

    searchButton.addEventListener('click', searchQuestionById);
    updateButton.addEventListener('click', updateQuestion);
    const authToken = localStorage.getItem('authToken'); // Get the authToken
    if (!authToken) {
        window.location.href = 'login.html';
        return; 
    }
    // Fetch all questions on page load
    fetchAllQuestions();

    async function fetchAllQuestions() {
        try {
            const response = await fetch('/api/questions', {
                headers: {
                    'Authorization': `Bearer ${authToken}` // Include auth token in headers
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch questions.');
            }
            const questions = await response.json();
            displayQuestions(questions);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    }

    async function searchQuestionById() {
        const questionId = searchQuestionId.value.trim();
        if (!questionId) {
            alert('Please enter a Question ID.');
            return;
        }

        try {
            const response = await fetch(`/api/questions/${questionId}`,{
                headers: {
                    'Authorization': `Bearer ${authToken}` 
                }
            });
            if (response.status === 404) {
                alert('Question not found.');
                displayQuestions([]);
                return;
            }
            if (!response.ok) {
                throw new Error('Failed to fetch question.');
            }
            const question = await response.json();
            displayQuestions([question]);
        } catch (error) {
            console.error('Error searching for question:', error);
        }
    }

    async function updateQuestion() {
        const questionId = updateQuestionId.value.trim();
        const newQuestionText = updateQuestionText.value.trim();

        if (!questionId || !newQuestionText) {
            alert('Please enter both Question ID and new Question Text.');
            return;
        }

        try {
            const response = await fetch(`/api/questions/${questionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}` // Include auth token in headers
                   
                },
                body: JSON.stringify({ question: newQuestionText }),
            });

            if (!response.ok) {
                throw new Error('Failed to update question.');
            }
            updateMessage.textContent = 'Question updated successfully.';
            updateMessage.className = 'message success';
            fetchAllQuestions(); // Refresh the list
        } catch (error) {
            console.error('Error updating question:', error);
            updateMessage.textContent = 'Failed to update question.';
            updateMessage.className = 'message error';
        }
    }

    // Define deleteQuestion as a global function
    window.deleteQuestion = async function(questionId) {
        if (!confirm('Are you sure you want to delete this question?')) {
            return;
        }

        try {
            const response = await fetch(`/api/questions/${questionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}` 
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete question.');
            }
            alert('Question deleted successfully.');
            fetchAllQuestions(); // Refresh the list
        } catch (error) {
            console.error('Error deleting question:', error);
            alert('Failed to delete question.');
        }
    };

    function displayQuestions(questions) {
        questionTableBody.innerHTML = '';
        questions.forEach(question => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${question.id}</td>
                <td>${question.question}</td>
                <td>${question.user_id}</td>
                <td>
                    <button onclick="deleteQuestion(${question.id})">Delete</button>
                </td>
            `;
            questionTableBody.appendChild(row);
        });
    }
});
