import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from './db.js';

// Rekisteröinti
const register = async (req, res) => {
  const { email, password } = req.body;

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long, include at least one uppercase letter and one number.',
    });
  }
 
  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
 
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email is already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );
 
    res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Error while registering user', error: err.message });
  }
};

// Kirjautuminen
const login = async (req, res) => {
  const { email, password } = req.body;
 
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
 
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
 
    const user = userResult.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '10h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error while logging in:', err);
    res.status(500).json({ message: 'Error while logging in', error: err.message });
  }
};


export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }
  const tokenValue = token.replace('Bearer ', '');
  try {
    // Dekoodaataan token ja tallennetaan se req.user-objektiin
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET_KEY);
    req.user = { userId: decoded.user_id }; // userId req.useriin
    console.log("auth ok", req.user);
    next();
  } catch (error) {
    console.error('Invalid token:', error.message);
    return res.status(401).json({ message: 'Invalid Token' });
  }
};


export const deleteUser = async (req, res) => {
  const { user_id, email } = req.body;

  if (!user_id || !email) {
    return res.status(400).json({ message: 'User ID and Email are required' });
  }

  try {
    const query = 'DELETE FROM users WHERE user_id = $1 AND email = $2';
    const values = [user_id, email];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export { register, login };



