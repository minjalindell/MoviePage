import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt'; 
import { pool } from '../helpers/db.js';
import pkg from 'jsonwebtoken';
const { sign } = pkg;

const __dirname = path.dirname(new URL(import.meta.url).pathname);


const initializeTestDb = async () => {
  try {
    const sqlPath = path.resolve('movie_test_db.sql');
    console.log(`Using SQL file at: ${sqlPath}`);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await pool.query(sql);
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

const insertTestUser = async (email, password) => {
  try {

    await pool.query('DELETE FROM users WHERE email = $1', [email]);
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
  } catch (error) {
    console.error("Error inserting test user:", error);
    throw error;
  }
};


const getToken = (email) => {
  try {
    return sign({ user: email }, process.env.JWT_SECRET_KEY);
  } catch (error) {
    console.error("Error generating token:", error);
    throw error;
  }
};

export { initializeTestDb, insertTestUser, getToken };
