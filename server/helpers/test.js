import express from 'express';
import { pool } from '../helpers/db.js';
 
const router = express.Router();
 
// Lisää uusi arvostelu ja tarvittaessa elokuvan tiedot
router.post('/', async (req, res, next) => {
  const { user_id, movie_id, movie_title, rating, review_text, user_email } = req.body;
 
  if (!user_id || !movie_id || !movie_title || !rating || !review_text || !user_email) {
    return res.status(400).json({ error: "All fields are required" });
  }
 
  try {
    // Tarkista, onko elokuva jo tallennettu tietokantaan
    const movieCheck = await pool.query(
      "SELECT * FROM movies WHERE movie_id = $1",
      [movie_id]
    );
 
    // Jos elokuvaa ei löydy, lisää se tietokantaan
    if (movieCheck.rows.length === 0) {
      await pool.query(
        `INSERT INTO movies (movie_id, title) VALUES ($1, $2)`,
        [movie_id, movie_title]
      );
      console.log(`Movie ${movie_title} added to database.`);
    }
 
    // Lisää arvostelu tietokantaan
    const result = await pool.query(
      `INSERT INTO reviews (user_id, movie_id, rating, review_text, review_date, user_email)
       VALUES ($1, $2, $3, $4, NOW(), $5) RETURNING *`,
      [user_id, movie_id, rating, review_text, user_email]
    );
 
    res.status(201).json({ message: "Review added successfully", review: result.rows[0] });
  } catch (error) {
    console.error("Error adding review or movie:", error);
    next(error); // Lähetä virhe ylemmälle virheenkäsittelijälle
  }
});
 
// Hae kaikki arvostelut tietokannasta
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT r.*, m.title AS movie_title
       FROM reviews r
       JOIN movies m ON r.movie_id = m.movie_id
       ORDER BY r.review_date DESC`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    next(error);
  }
});
 
export default router;
 
 