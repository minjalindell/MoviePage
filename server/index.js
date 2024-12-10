import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { login, register, deleteUser } from './helpers/auth.js';
import userRouter from './routers/userRouter.js';
import reviewRouter from './routers/reviewRouter.js';
 
dotenv.config();
 
const port = 3001;
 
const app = express();
app.use('/user', userRouter);
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST','DELETE'],
  credentials: true,
}));
 
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
 
app.get('/',(req,res)=> {
  return res.status(200).json({test: "test"})
})
 
app.post('/login', login);  
app.post('/register', register);


app.delete('/user/delete', deleteUser);


app.use('/reviews', reviewRouter);

 
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error('Error details:', err);  
  res.status(statusCode).json({ error: err.message });
});
 
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
 
export default app;
 