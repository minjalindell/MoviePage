import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config();  

// Yhteyden avaus
const openDb = () => {
  return new Pool({
    user: process.env.DB_USER,               
    host: process.env.DB_HOST,               
    database: process.env.NODE_ENV === 'development' 
      ? process.env.DB_NAME                 
      : process.env.TEST_DB_NAME,            
    password: process.env.DB_PASSWORD,       
    port: process.env.DB_PORT,              
  });
};

const pool = openDb();

export { pool };

