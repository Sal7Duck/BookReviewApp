import express from "express";
import cors from "cors";
import axios from "axios";
import pool from './db.js';

const PORT = 8000;
const app = express();

app.use(cors());

//get book list and book info if we don't already have it in db
app.get('/bookList/', async(req, res) => {
    const { query, startIndex, maxResults } = req.query;
    try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${maxResults}`);
        res.json(response.data.items);
    } catch (err) {
        console.error('Error fetching data from the API: ', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//just for testing
app.get('/test/', async(req, res) => {
    const id = 'TkGyzKt-l6cC';
    try {
        const response = await pool.query('SELECT * FROM bookinfo WHERE id = $1', [id]);
        res.json(response.rows);
    } catch (err) {
        console.log('WHY IS THIS HAPPENING?!');
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//check if reviews are stored in db or not
app.get('/checkIfReviews/:id', async (req, res) => {
    const { id }  = req.params;
    try {
        const response = await pool.query("SELECT * FROM bookinfo WHERE id = $1", [id]);
      if (response.rows.length > 0) {
        // Reviews for the book exist, and book info needs to be fetched from our database
        res.status(200).json({ message: 'Data exists', data: response.rows[0] });
      } else {
        // Reviews don't exist yet, fetch book information from the Google API
        res.status(200).json({ message: 'Data does not exist', data: response.rows[0] });
      }
    } catch (err) {
      console.error('Error fetching data from the database: ', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

//check if user has an account or not
app.get('/checkIfUser/:userName', async(req, res) => {
    const { userName } = req.params;
    try {
        const response = await pool.query('SELECT * FROM users WHERE username = $1', [userName]);
        res.json(response.rows);
    } catch (err) {
        console.error('Error fetching data from the API: ', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//createUser -> POST API
app.post('/createUser', async(req, res) => {
    const {userName, password} = req.query;
    try {
        const response = await pool.query('INSERT INTO users (username, password, fav_books) VALUES ($1, $2, $3) RETURNING *', [userName, password, []]);
        res.status(200).json({ message: 'User created successfully', user: response.rows[0] });;
    } catch (err) {
        console.error('Error fetching data from the database: ', err.message);
        res.status(500).json({error: 'Internal Server Error' });
    }
});

app.post('/addReview', async (req, res) => {
    const { id, review } = req.query;
    try {
      // Existing book data
      const fetchResponse = await pool.query('SELECT * FROM bookinfo WHERE id = $1', [id]);
      const existingBook = fetchResponse.rows[0];
      // Append the new review to reviews array
      const updatedReviews = [...existingBook.reviews, review];
      const updateResponse = await pool.query('UPDATE bookinfo SET reviews = $1 WHERE id = $2', [updatedReviews, id]);
      res.status(200).json({ message: 'Review added successfully', book: updateResponse.rows[0] });
    } catch (err) {
      console.error('Error updating data in the database:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//populate bookinfo table with data
app.post('/insertBookInfo', async(req, res) => {
    const {id, data} = req.query;
    try {
        const response = await pool.query('INSERT INTO bookinfo (id, title, subtitle, authors, description, categories, avg_rating, ratings_count, small_thumbnail_url, reviews) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        [id, data.title, data.subtitle, data.authors, data.description, data.categories, data.avg_rating, data.ratings_count, data.imageLinks.smallThumbnail, []]);
        res.status(200).json({ message: 'Book info inserted successfully' });
    } catch (error) {
        console.error('Error saving data to the database: ', error.message);
        throw error;
    }
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})