// reviewRouter.js
import express from 'express';
import { pool } from '../helpers/db.js';

const router = express.Router();

router.get('/reviews/:movieId', async (req, res) => {
  const movieId = req.params.movieId;

  try {
      
      const result = await pool.query('SELECT * FROM reviews WHERE movie_id = $1', [movieId]);

      if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Arvosteluja ei löytynyt.' });
      }

      res.status(200).json(result.rows);
  } catch (error) {
      console.error('Virhe tietokantakyselyssä:', error);
      res.status(500).json({ message: 'Jotain meni pieleen.' });
  }
});

export default router;



