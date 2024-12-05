import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../helpers/db.js';

const router = express.Router();


router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;


    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long, include at least one uppercase letter and one number.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );
    console.log("Received email:", email);


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


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Käyttäjä tietokannasta
    console.log('Received login request...');
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log('Query result:', result);

    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Käyttäjää ei löydy' });
    }

    const user = result.rows[0];

    console.log('User fetched from database:', user);

    // Salasanan vertailu
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Virheellinen salasana' });
    }

    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    
    return res.status(200).json({
      id: user.user_id, 
      email: user.email,
      token: token,
    });

  } catch (error) {
    console.error('Error in login:', error);
    return res.status(500).json({ message: 'Sisäinen virhe palvelimella' });
  }
});




export default router;
