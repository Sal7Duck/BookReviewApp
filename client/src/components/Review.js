import React, { useState } from 'react';
import Auth from './Auth.js';
import AddReview from './AddReview.js';

function Review({ reviews, bookId }) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAddReview = () => {
    setShowAuthModal(true);
  };

  return (
    <div>
      {reviews?.length > 0 ? (
        <div className="review-container">
          {reviews.map((review, index) => (
            <div key={index} className="review-tile">
              <p>{review}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No Reviews Yet! Add one?</h2>
        </div>
      )}
      <div className="button-container">
        <button className="create" onClick={handleAddReview}>
          ADD REVIEW
        </button>
      </div>
      {showAuthModal && <Auth bookId={bookId} />}
    </div>
  );
}

export default Review;
