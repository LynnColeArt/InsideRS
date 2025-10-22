import express from 'express';
import db from './database';
import { authenticateJWT, AuthenticatedRequest } from './middleware';

const router = express.Router();

// Get all users (excluding the current user)
router.get('/', authenticateJWT, async (req: AuthenticatedRequest, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).send('Unauthorized');
    }

    const query = 'SELECT id, username FROM users WHERE id != $1';

    try {
        const result = await db.query(query, [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving users.');
    }
});

export default router;
