import React from 'react';
import { useEffect, useState } from 'react';
import BookTile from './components/BookTile.js';
import BookDetails from './components/BookDetails.js';
import Review from './components/Review.js';

function App() {
  const [bookList, setBookList] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [query, setQuery] = useState('pride');
  const [searchType, setSearchType] = useState('intitle');
  const [maxResults, setMaxResults] = useState(9); 
  const [startIndex, setStartIndex] = useState(0); 
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchBooks(query, searchType, startIndex, maxResults);
        setBookList(data);
      } catch (error) {
        console.error(error);
        setBookList([]);
      }
    };
    fetchData();
  }, [query, searchType, startIndex, maxResults]);

  const fetchBooks = async (searchQuery, searchType, startIndex, maxResults) => {
    const response = await fetch(`http://localhost:8000/bookList?query=${searchType}:${searchQuery}&startIndex=${startIndex}&maxResults=${maxResults}`);
    const bookData = await response.json();
    return bookData;
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleCloseDetails = () => {
    setSelectedBook(null);
  };

  const handleNextPage = () => {
    setStartIndex(startIndex + maxResults);
  };

  const handlePrevPage = () => {
    if (startIndex - maxResults >= 0) {
      setStartIndex(startIndex - maxResults);
    }
  };

  return (
    <div className='app'>
      <div className='app-title'>
        <h1>A Head full of Stories</h1>
        <h2>Book Review App</h2>
      </div>
      <div className='search-bar'>
        <select onChange={(e) => setSearchType(e.target.value)}>
          <option value="intitle">Title</option>
          <option value="inauthor">Author</option>
        </select>
        <input type="text" placeholder="Search by title or author" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
        {bookList?.length>0 ? (
          <div>
          <div className="tile-container">
            {bookList.map((book, index) => (
              <div key={index}>
              <BookTile
              key={index}
              book={book}
              onBookClick={handleBookClick}
            />
            <Review key={index} reviews={book.reviews} bookId={book.id} />
            </div>
            ))}
          </div>
          <div className="pagination">
          <button onClick={handlePrevPage} disabled={startIndex === 0}>Previous Page</button>
          <button onClick={handleNextPage}>Next Page</button>
        </div>
        </div>
        ) : (
          <div className="empty">
            <h2>No data found</h2>
          </div>
        )}
      {selectedBook && (
        <BookDetails
          key={selectedBook.id}
          book={selectedBook}
          onCloseDetails={handleCloseDetails}
        />
      )}
    </div>
  );
}

export default App;
