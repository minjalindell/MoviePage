import { insertUser, selectUserByEmail } from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const secretKey = process.env.JWT_SECRET_KEY

const postRegistration = async (req, res, next) => {
    try {
        console.log(req.body); // Tämä näyttää, mitä dataa lähetetään
        const { email, password } = req.body;
    
        if (!email || email.length === 0) {
          return res.status(400).json({ error: 'Invalid email for user' });
        }
        if (!password || password.length < 8) {
          return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }

    // Tarkistetaan, onko käyttäjä jo olemassa
    const existingUser = await selectUserByEmail(email)
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already in use' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const userFromDb = await insertUser(email, hashedPassword)

    const user = userFromDb.rows[0]

    // Luo JWT token
    const token = jwt.sign({ userId: user.user_id, email: user.email }, secretKey, { expiresIn: '1h' })

    res.status(201).json({
      user: { email: user.email, userId: user.user_id },
      token,
    })
  } catch (err) {
    console.error(err)
    next(err)
  }
}

const postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const userFromDb = await selectUserByEmail(email)
    if (userFromDb.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const user = userFromDb.rows[0]

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    // Luo JWT token
    const token = jwt.sign({ userId: user.user_id, email: user.email }, secretKey, { expiresIn: '1h' })

    res.status(200).json({
      user: { email: user.email, userId: user.user_id },
      token,
    })
  } catch (err) {
    console.error(err)
    next(err)
  }
}

export { postRegistration, postLogin }
