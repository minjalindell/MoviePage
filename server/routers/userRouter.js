import { pool } from '../helpers/db.js';
import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

// Salasanan validointi regexin avulla
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Tarkistetaan, täyttääkö salasana vaatimukset
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long, contain at least one uppercase letter and one number.'
      });
    }

    // Tarkistetaan, että sähköpostiosoite on jo olemassa
    const emailExists = await pool.query('SELECT * FROM account WHERE email = $1', [email]);
    if (emailExists.rowCount > 0) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Hashataan salasana ennen tallentamista
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lisätään uusi käyttäjä tietokantaan
    const result = await pool.query(
      'INSERT INTO account (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );

    // Palautetaan onnistunut viesti
    return res.status(201).json({
      id: result.rows[0].id,
      email: result.rows[0].email,
    });
  } catch (error) {
    console.error('Error in registration process:', error);
    next(error);  // Virheen käsittely
  }
});

// Kirjautumisreitti
router.post('/login', async (req, res, next) => {
  const invalid_message = 'Invalid credentials.';
  try {
    // Haetaan käyttäjä tietokannasta
    const result = await pool.query('SELECT * FROM account WHERE email = $1', [req.body.email]);

    if (result.rowCount === 0) {
      return res.status(401).json({ message: invalid_message });  // Palautetaan virhe, jos ei löydy
    }

    const user = result.rows[0];

    // Vertaillaan salasanoja
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(401).json({ message: invalid_message });  // Virheellinen salasana
    }

    // Luodaan JWT-token
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',  // Token vanhenee tunnin päästä
    });

    // Palautetaan token kirjautumisen yhteydessä
    return res.status(200).json({
      id: user.id,
      email: user.email,
      token: token,
    });
  } catch (error) {
    console.error('Error during login process:', error);
    next(error);  // Virheen käsittely
  }
});

export default router;
