import React from "react";

function BookTile({ book, onBookClick }) {

  return (
      <div className="book-tile-content">
        <div className="book-cover">
          <img src={book.volumeInfo?.imageLinks?.smallThumbnail} alt={book.volumeInfo?.title} />
        </div>
        <div className="book-tile-info">
        <h4>{book.volumeInfo?.title}</h4>
        <h3>{book.volumeInfo?.subtitle}</h3>
        <p>Authors: {Array.isArray(book.volumeInfo?.authors) ? book.volumeInfo.authors.join(', ') : 'N/A'}</p>
        </div>
        <div className="button-container">
          <button className="details" onClick={() => onBookClick(book)}>DETAILS</button>
          <button className="create">ADD REVIEW</button>
        </div>
      </div>
  );
}

export default BookTile;