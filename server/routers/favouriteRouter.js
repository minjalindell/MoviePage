import express from 'express';
import { pool } from '../helpers/db.js';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../helpers/auth.js';


const router = express.Router();


router.post("/favorites", authenticateToken, async (req, res) => {
  const { movie_id } = req.body; 
  const user_id = req.user.userId;

  console.log("User ID:", user_id);  

  if (!movie_id) {
    return res.status(400).json({ error: "movie_id is required" });
  }

  try {
    const query = `
      INSERT INTO favorite_movies (user_id, movie_id)
      VALUES ($1, $2) RETURNING *;
    `;
    const result = await pool.query(query, [user_id, movie_id]);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(400).json({ error: "Failed to add movie to favorites" });
    }
  } catch (error) {
    console.error("Error adding to favorites:", error);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/favorites", async (req, res) => {
  const user_id = req.query.user_id;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM favorite_movies WHERE user_id = $1 ORDER BY added_date DESC",
      [user_id]
    );
    res.status(200).json(result.rows); 
  } catch (error) {
    console.error("Error fetching favorite movies:", error);
    res.status(500).json({ message: "Failed to fetch favorite movies" });
  }
});


export default router;
