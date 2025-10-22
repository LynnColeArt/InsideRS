import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from './database';

const router = express.Router();

// Using a salt round of 10 is a good balance between security and performance.
const saltRounds = 10;

// It's crucial to use a strong, unique secret for signing JWTs.
// We'll throw an error if it's not set in the environment variables.
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in the environment variables.');
}
const jwtSecret = process.env.JWT_SECRET;

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send('Please provide all required fields.');
  }

  try {
    const hash = await bcrypt.hash(password, saltRounds);
    const result = await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [username, email, hash]
    );
    res.status(201).send(`User created with ID: ${result.rows[0].id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating user.');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Please provide email and password.');
  }

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).send('Invalid email or password.');
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).send('Invalid email or password.');
    }

    const token = jwt.sign({ id: user.id }, jwtSecret, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error logging in.');
  }
});

export default router;
