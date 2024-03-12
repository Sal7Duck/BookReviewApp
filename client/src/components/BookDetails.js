import React, { useState, useEffect } from 'react';
import Review from './Review.js';

function BookDetails({ book, onCloseDetails }) {
    const [isReviews, setIsReviews] = useState(false);
    const [bookInfo, setBookInfo] = useState(null);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8000/checkIfReviews/${book.id}`);
                const bookDetails = await response.json();
                setBookInfo(bookDetails);

                // Update isReviews based on the API response
                setIsReviews(response.status === 200 && bookDetails?.data?.message === 'Data exists');
            } catch (error) {
                console.error('Error fetching book details:', error.message);
            }
        };

        if (book && book.id) {
            fetchBookDetails();
        }
    }, [book]);

    if (!bookInfo || !bookInfo.data || !bookInfo.data.message) {
        return <div className='loading'>Loading...</div>;
    }

    const { title, subtitle, imageLinks, authors, description } = bookInfo.data.volumeInfo;

    return (
        <div className="book-details-overlay">
            <div className="book-details">
                <button className="close-button" onClick={onCloseDetails}>
                    Close
                </button>
                <div className='book-cover'>
                    <img src={imageLinks?.smallThumbnail} alt={title} />
                </div>
                <div className='book-content'>
                    <h2>{title}</h2>
                    <h3>{subtitle}</h3>
                    <p>Authors: {Array.isArray(authors) ? authors.join(', ') : 'N/A'}</p>
                    <p>{description ? description : 'No description available'}</p>
                </div>
                <div className='review-container'>
                    <Review reviews={isReviews ? bookInfo.data.reviews : null} />
                </div>
            </div>
        </div>
    );
}

export default BookDetails;
