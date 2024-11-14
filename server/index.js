import express from 'express'
import cors from 'cors'

const port = 3001
const { pool } = pkg;

const app = express()
app.use(cors())

app.get('/',(req,res)=> {
    res.status(200).json({result: "Successs"})
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });