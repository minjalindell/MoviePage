import express from 'express';
import { pool } from '../helpers/db.js';

const router = express.Router();

// POST /reviews
router.post('/reviews', async (req, res, next) => {
  const { user_id, movie_id, movie_title, rating, review_text } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO reviews (user_id, movie_id, movie_title, rating, review_text, review_date)
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [user_id, movie_id, movie_title, rating, review_text]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: 'Failed to submit review' });
  }
});

// GET /reviews/:movieId
router.get('/reviews/:movieId', async (req, res, next) => {
  const { movieId } = req.params;

  try {
    const result = await pool.query(
      `SELECT r.review_id, r.user_id, u.email, r.movie_id, r.movie_title, r.rating, r.review_text, r.review_date
       FROM reviews r
       JOIN users u ON r.user_id = u.user_id
       WHERE r.movie_id = $1
       ORDER BY r.review_date DESC`,
      [movieId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this movie.' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    next(error);
  }
});



export default router;


