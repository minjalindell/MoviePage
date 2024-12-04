import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from './db.js';
 
const register = async (req, res) => {
  const { email, password } = req.body;
 
 
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
 
  console.log('Regex test result:', passwordRegex.test(password));
 
  if (!passwordRegex.test(password)) {
    console.log('Password does not meet the requirements');
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
 
 
const login = async (req, res) => {
  const { email, password } = req.body;
 
  try {
 
    console.log('Login attempt:', email);
 
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
 
    if (userResult.rows.length === 0) {
      console.log("No user found with this email");
      return res.status(401).json({ message: 'Invalid email or password' });
    }
 
    const user = userResult.rows[0];
 
    console.log('User found:', user.email);
 
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Password does not match");
      return res.status(401).json({ message: 'Invalid email or password' });
    }
 
 
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    console.log("Login successful for user:", user.email);
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error while logging in:', err);
    res.status(500).json({ message: 'Error while logging in', error: err.message });
  }
};
 
export { register, login };
 
 