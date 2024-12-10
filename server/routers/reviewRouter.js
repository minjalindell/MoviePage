// reviewRouter.js
import express from 'express';
import { pool } from '../helpers/db.js'; // Käytetään tietokannan yhteyttä

const router = express.Router();

// Lisää uusi arvostelu
router.post("/reviews", async (req, res) => {
  const { user_id, movie_id, movie_title, rating, review_text, email } = req.body;
 
  try {
    const result = await pool.query(
      "INSERT INTO reviews (user_id, movie_id, movie_title, rating, review_text, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [user_id, movie_id, movie_title, rating, review_text, email]
    );
 
    res.status(201).json({ review: result.rows[0] });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).send("Failed to add the review.");
  }
});

// Hae kaikki arvostelut
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM reviews ORDER BY review_date DESC`
    );
    res.status(200).json(result.rows);

  } catch (error) {
      console.error('Virhe tietokantakyselyssä:', error);
      res.status(500).json({ message: 'Jotain meni pieleen.' });
  }
});

export default router;



