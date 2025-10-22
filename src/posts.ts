import express from 'express';
import db from './database';
import { authenticateJWT, AuthenticatedRequest } from './middleware';

const router = express.Router();
const postMaxLength = process.env.POST_MAX_LENGTH || 300;

router.post('/', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  const { content } = req.body;
  const userId = req.user?.id;

  if (!content) {
    return res.status(400).send('Post content cannot be empty.');
  }

  if (content.length > postMaxLength) {
    return res.status(400).send(`Post content cannot exceed ${postMaxLength} characters.`);
  }

  if (!userId) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const result = await db.query(
      'INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING id',
      [userId, content]
    );
    res.status(201).send(`Post created with ID: ${result.rows[0].id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating post.');
  }
});

router.get('/', authenticateJWT, async (req, res) => {
  const query = `
    SELECT
      p.id,
      p.user_id,
      p.content,
      p.created_at,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes,
      (SELECT COUNT(*) FROM shares WHERE post_id = p.id) as shares
    FROM posts p
    ORDER BY p.created_at DESC
  `;
  try {
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving posts.');
  }
});

router.post('/:id/like', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  const postId = req.params.id;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).send('Unauthorized');
  }

  try {
    await db.query(
      'INSERT INTO likes (post_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [postId, userId]
    );
    res.status(201).send('Post liked.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error liking post.');
  }
});

router.post('/:id/share', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  const postId = req.params.id;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).send('Unauthorized');
  }

  try {
    await db.query(
      'INSERT INTO shares (post_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [postId, userId]
    );
    res.status(201).send('Post shared.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error sharing post.');
  }
});

export default router;
