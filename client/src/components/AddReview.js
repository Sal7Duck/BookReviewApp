import React, { useState } from 'react';

function AddReview({ bookId }) {
  const [review, setReview] = useState('');

  const handleReviewSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:8000/addReview?id=${bookId}&review=${review}`, {
        method: 'POST',
      });
      if (response.ok) {
        console.log('Review added successfully');
        // You can add additional logic here, like refreshing the reviews.
      } else {
        console.error('Error adding review:', response.statusText);
      }
    } catch (err) {
      console.error('Error adding review:', err.message);
    }
  };

  return (
    <div>
      <h3>Add Review</h3>
      <textarea value={review} onChange={(e) => setReview(e.target.value)} />
      <button onClick={handleReviewSubmit}>Submit Review</button>
    </div>
  );
}

export default AddReview;
