import express from 'express';
import db from './database';
import { authenticateJWT, AuthenticatedRequest } from './middleware';

const router = express.Router();

// Send a friend request
router.post('/request/:id', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id;
  const friendId = req.params.id;

  if (!userId) {
    return res.status(401).send('Unauthorized');
  }

  if (userId.toString() === friendId) {
    return res.status(400).send('You cannot send a friend request to yourself.');
  }

  const [user_id_1, user_id_2] = [userId, parseInt(friendId)].sort((a, b) => a - b);

  try {
    await db.query(
      'INSERT INTO friends (user_id_1, user_id_2, status) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
      [user_id_1, user_id_2, 'pending']
    );
    res.status(201).send('Friend request sent.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error sending friend request.');
  }
});

// Accept a friend request
router.post('/accept/:id', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id;
  const friendId = req.params.id;

  if (!userId) {
    return res.status(401).send('Unauthorized');
  }

  const [user_id_1, user_id_2] = [userId, parseInt(friendId)].sort((a, b) => a - b);

  try {
    const result = await db.query(
      "UPDATE friends SET status = 'accepted' WHERE user_id_1 = $1 AND user_id_2 = $2 AND status = 'pending'",
      [user_id_1, user_id_2]
    );
    if (result.rowCount === 0) {
      return res.status(404).send('Friend request not found or already accepted.');
    }
    res.status(200).send('Friend request accepted.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error accepting friend request.');
  }
});

// Get all friends
router.get('/', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).send('Unauthorized');
  }

  const query = `
      SELECT u.id, u.username
      FROM users u
      JOIN friends f ON (u.id = f.user_id_1 OR u.id = f.user_id_2)
      WHERE (f.user_id_1 = $1 OR f.user_id_2 = $1) AND f.status = 'accepted' AND u.id != $1
    `;

  try {
    const result = await db.query(query, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving friends.');
  }
});

// Get pending friend requests
router.get('/requests', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).send('Unauthorized');
  }

  const query = `
        SELECT u.id, u.username
        FROM users u
        JOIN friends f ON u.id = f.user_id_1
        WHERE f.user_id_2 = $1 AND f.status = 'pending'
    `;

  try {
    const result = await db.query(query, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving friend requests.');
  }
});

// Remove a friend
router.delete('/:id', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id;
  const friendId = req.params.id;

  if (!userId) {
    return res.status(401).send('Unauthorized');
  }

  const [user_id_1, user_id_2] = [userId, parseInt(friendId)].sort((a, b) => a - b);

  try {
    const result = await db.query(
      "DELETE FROM friends WHERE user_id_1 = $1 AND user_id_2 = $2 AND status = 'accepted'",
      [user_id_1, user_id_2]
    );
    if (result.rowCount === 0) {
      return res.status(404).send('Friend not found.');
    }
    res.status(200).send('Friend removed.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error removing friend.');
  }
});

export default router;
