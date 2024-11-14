import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { login, register } from './helpers/auth.js';  // Tuodaan authenticateToken
import userRouter from './routers/userRouter.js';  // Tuodaan userRouter, joka on määritelty erikseen

dotenv.config();

const port = process.env.PORT || 3001; // Portti, joka voi olla ympäristömuuttujassa

const app = express();

app.use(cors());  // CORS-tuki
app.use(express.json());  // JSON-data tukeminen
app.use(express.urlencoded({ extended: false }));  // URL-koodatut muodot tuetaan

// Rekisteröinti ja kirjautuminen
app.post('/login', login);  
app.post('/register', register);  

// Käyttäjä-reitit (esim. käyttäjäprofiilit)
app.use('/user', userRouter); // Tämä on uusi reitti, joka ohjaa '/user' reitit userRouteriin

// Yleinen virheenkäsittely
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error('Error details:', err);  
  res.status(statusCode).json({ error: err.message });
});

// Käynnistetään serveri
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;


