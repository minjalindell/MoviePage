import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../helpers/db.js';

const router = express.Router();


//rekisteröityminen
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Salasanan vahvuusvaatimukset
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long, include at least one uppercase letter and one number.',
      });
    }

    // Salasanan hashoaminen
    const hashedPassword = await bcrypt.hash(password, 10);

    // SQL-kysely käyttäjän lisäämiseksi
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );
    console.log("Received email:", email);

    // Onnistunut rekisteröinti
    res.status(201).json({
      id: result.rows[0].id,
      email: result.rows[0].email,
    });
  } catch (error) {
    console.error('Error in registration:', error);


    if (error.code === '23505') {
      return res.status(409).json({ message: 'Email already exists' });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
});


// Kirjautuminen
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Käyttäjä tietokannasta
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Käyttäjää ei löydy' });
    }

    const user = result.rows[0];

    // Salasanan vertailu
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Virheellinen salasana' });
    }

    // JWT-token luodaan
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    return res.status(200).json({
      id: user.id,
      email: user.email,
      token: token,
    });

  } catch (error) {
    console.error('Error in login:', error);  
    return res.status(500).json({ message: 'Sisäinen virhe palvelimella' });
  }
});



export default router;
