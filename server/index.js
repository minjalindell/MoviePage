import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { login, register, deleteUser } from './helpers/auth.js';
import userRouter from './routers/userRouter.js'; 
import reviewRouter from './routers/reviewRouter.js';
import groupsRouter from './routers/groupsRouter.js';

dotenv.config();

const port = 3001;

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true
}));

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  return res.status(200).json({ test: "test" });
});

app.post('/login', login);
app.post('/register', register);

// Päivitetty DELETE-reitti
app.delete('/delete', (req, res) => {
  console.log('Request body:', req.body);
  deleteUser(req, res);
});
app.use('/reviews', reviewRouter);
app.use('/user', userRouter);
app.use('/groups', groupsRouter);

// Virheidenkäsittely
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  res.status(err.status || 500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
