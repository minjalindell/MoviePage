import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from './db.js'; 

// Rekisteröinti
const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tarkistetaan, onko käyttäjä jo olemassa
    const existingUser = await pool.query('SELECT * FROM account WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email is already taken' });
    }

    // Salataan salasana
    const hashedPassword = await bcrypt.hash(password, 10);

    // Rekisteröidään uusi käyttäjä
    const newUser = await pool.query(
      'INSERT INTO account (email, password) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );

    // Palautetaan käyttäjän tiedot ja onnistumisviesti
    res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
  } catch (err) {
    console.error('Registration error:', err);  // Parempi virheiden lokitus
    res.status(500).json({ message: 'Error while registering user', error: err.message });
  }
};

// Kirjautuminen
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Haetaan käyttäjä sähköpostin perusteella
    const userResult = await pool.query('SELECT * FROM account WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    // Verrataan salasanaa tietokannassa olevaan hashattuun salasanaan
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Luodaan JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    // Palautetaan token ja onnistumisviesti
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);  // Parempi virheiden lokitus
    res.status(500).json({ message: 'Error while logging in', error: err.message });
  }
};

export { register, login };






