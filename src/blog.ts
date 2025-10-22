import express from 'express';
import db from './database';
import { authenticateJWT, AuthenticatedRequest } from './middleware';

const router = express.Router();

// Create a new blog post
router.post('/', authenticateJWT, async (req: AuthenticatedRequest, res) => {
    const authorId = req.user?.id;
    const { title, content, tags } = req.body;

    if (!authorId) {
        return res.status(401).send('Unauthorized');
    }

    if (!title || !content) {
        return res.status(400).send('Title and content are required.');
    }

    const query = 'INSERT INTO blog_posts (author_id, title, content, tags) VALUES ($1, $2, $3, $4) RETURNING id';
    try {
        const result = await db.query(query, [authorId, title, content, tags]);
        res.status(201).json({ id: result.rows[0].id });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating blog post.');
    }
});

// Get all blog posts
router.get('/', async (req, res) => {
    const query = 'SELECT * FROM blog_posts ORDER BY created_at DESC';
    try {
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving blog posts.');
    }
});

// Get a specific blog post
router.get('/:id', async (req, res) => {
    const postId = req.params.id;
    const query = 'SELECT * FROM blog_posts WHERE id = $1';
    try {
        const result = await db.query(query, [postId]);
        if (result.rows.length === 0) {
            return res.status(404).send('Blog post not found.');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving blog post.');
    }
});

// Update a blog post
router.put('/:id', authenticateJWT, async (req: AuthenticatedRequest, res) => {
    const authorId = req.user?.id;
    const postId = req.params.id;
    const { title, content, tags } = req.body;

    if (!authorId) {
        return res.status(401).send('Unauthorized');
    }

    if (!title || !content) {
        return res.status(400).send('Title and content are required.');
    }

    try {
        const verifyQuery = 'SELECT author_id FROM blog_posts WHERE id = $1';
        const verifyResult = await db.query(verifyQuery, [postId]);
        const post = verifyResult.rows[0];

        if (!post) {
            return res.status(404).send('Blog post not found.');
        }
        if (post.author_id !== authorId) {
            return res.status(403).send('You do not have permission to edit this post.');
        }

        const updateQuery = 'UPDATE blog_posts SET title = $1, content = $2, tags = $3 WHERE id = $4';
        await db.query(updateQuery, [title, content, tags, postId]);
        res.status(200).send('Blog post updated.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating blog post.');
    }
});

// Delete a blog post
router.delete('/:id', authenticateJWT, async (req: AuthenticatedRequest, res) => {
    const authorId = req.user?.id;
    const postId = req.params.id;

    if (!authorId) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const verifyQuery = 'SELECT author_id FROM blog_posts WHERE id = $1';
        const verifyResult = await db.query(verifyQuery, [postId]);
        const post = verifyResult.rows[0];

        if (!post) {
            return res.status(404).send('Blog post not found.');
        }
        if (post.author_id !== authorId) {
            return res.status(403).send('You do not have permission to delete this post.');
        }

        const deleteQuery = 'DELETE FROM blog_posts WHERE id = $1';
        await db.query(deleteQuery, [postId]);
        res.status(200).send('Blog post deleted.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting blog post.');
    }
});


export default router;
