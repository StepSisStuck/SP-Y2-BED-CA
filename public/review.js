document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('reviewForm');
    const reviewsTableBody = document.getElementById('reviewsTableBody');
    const messageDiv = document.getElementById('message');
    const userId = localStorage.getItem('user_id');

    let reviews = [];
    let editingIndex = null; // Track which review is being edited

    const authToken = localStorage.getItem('authToken');

    // Function to handle 401 Unauthorized
    function handleUnauthorized() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user_id');
        window.location.href = 'login.html';
    }

    // Function to fetch reviews from the API
    async function fetchReviews() {
        try {
            const response = await fetch('/api/reviews', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.status === 401) {
                handleUnauthorized();
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch reviews');
            }

            reviews = await response.json();
            renderReviews();
        } catch (error) {
            console.error('Error fetching reviews:', error);
            messageDiv.textContent = 'Failed to fetch reviews';
            messageDiv.style.color = 'red';
        }
    }

    // Function to submit a new or updated review
    async function submitReview(name, rating, review) {
        try {
            const method = editingIndex !== null ? 'PUT' : 'POST';
            const reviewId = editingIndex !== null ? reviews[editingIndex].id : null;
            const response = await fetch('/api/review', {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ name, rating, review, id: reviewId })
            });

            if (response.status === 401) {
                handleUnauthorized();
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to submit review');
            }

            if (editingIndex !== null) {
                reviews[editingIndex] = { name, rating, review, id: reviewId };
                editingIndex = null;
                messageDiv.textContent = 'Review updated successfully!';
            } else {
                const newReview = await response.json();
                fetchReviews()
                messageDiv.textContent = 'Review submitted successfully!';
            }

            messageDiv.style.color = 'green';
            renderReviews();
        } catch (error) {
            console.error('Error submitting review:', error);
            messageDiv.textContent = `Failed to submit review: ${error.message}`;
            messageDiv.style.color = 'red';
        }
    }

    // Function to delete a review
    async function deleteReview(index) {
        try {
            const reviewId = reviews[index].id;
            if (!reviewId) {
                throw new Error('Review ID is missing');
            }
            
            const response = await fetch(`/api/review/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.status === 401) {
                handleUnauthorized();
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to delete review');
            }

            reviews.splice(index, 1);
            renderReviews();
            messageDiv.textContent = 'Review deleted successfully!';
            messageDiv.style.color = 'red';
        } catch (error) {
            console.error('Error deleting review:', error);
            messageDiv.textContent = `Failed to delete review: ${error.message}`;
            messageDiv.style.color = 'red';
        }
    }

    function renderReviews() {
        reviewsTableBody.innerHTML = '';
        reviews.forEach((review, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${review.name}</td>
                <td>${review.rating}</td>
                <td>${review.review}</td>
                <td>
                ${userId == review.user_id ? `
                    <button class="edit-button" data-index="${index}">Edit</button>
                    <button class="delete-button" data-index="${index}">Delete</button>
                </td>`:''}
            `;

            reviewsTableBody.appendChild(row);
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                deleteReview(index);
            });
        });

        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                populateFormForEdit(index);
            });
        });
    }

    function populateFormForEdit(index) {
        const review = reviews[index];
        document.getElementById('name').value = review.name;
        document.getElementById('rating').value = review.rating;
        document.getElementById('review').value = review.review;
        editingIndex = index;
        document.querySelector('button[type="submit"]').textContent = 'Update';
    }

    reviewForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const rating = document.getElementById('rating').value;
        const review = document.getElementById('review').value;

        submitReview(name, rating, review);
        reviewForm.reset();
    });

    // Fetch reviews on page load
    fetchReviews();
});
