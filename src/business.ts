import express from 'express';
import db from './database';
import { authenticateJWT, AuthenticatedRequest } from './middleware';

const router = express.Router();

// Create a new business page
router.post('/', authenticateJWT, async (req: AuthenticatedRequest, res) => {
    const ownerId = req.user?.id;
    const { name, description, address } = req.body;

    if (!ownerId) {
        return res.status(401).send('Unauthorized');
    }

    if (!name) {
        return res.status(400).send('Business name is required.');
    }

    const query = 'INSERT INTO business_pages (owner_id, name, description, address) VALUES ($1, $2, $3, $4) RETURNING id';
    try {
        const result = await db.query(query, [ownerId, name, description, address]);
        res.status(201).json({ id: result.rows[0].id });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating business page.');
    }
});

// Get all business pages
router.get('/', async (req, res) => {
    const query = 'SELECT * FROM business_pages';
    try {
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving business pages.');
    }
});

// Get a specific business page
router.get('/:id', async (req, res) => {
    const pageId = req.params.id;
    const query = 'SELECT * FROM business_pages WHERE id = $1';
    try {
        const result = await db.query(query, [pageId]);
        if (result.rows.length === 0) {
            return res.status(404).send('Business page not found.');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving business page.');
    }
});


// Update a business page
router.put('/:id', authenticateJWT, async (req: AuthenticatedRequest, res) => {
    const ownerId = req.user?.id;
    const pageId = req.params.id;
    const { name, description, address } = req.body;

    if (!ownerId) {
        return res.status(401).send('Unauthorized');
    }

    if (!name) {
        return res.status(400).send('Business name is required.');
    }

    try {
        const verifyQuery = 'SELECT owner_id FROM business_pages WHERE id = $1';
        const verifyResult = await db.query(verifyQuery, [pageId]);
        const page = verifyResult.rows[0];

        if (!page) {
            return res.status(404).send('Business page not found.');
        }
        if (page.owner_id !== ownerId) {
            return res.status(403).send('You do not have permission to edit this page.');
        }

        const updateQuery = 'UPDATE business_pages SET name = $1, description = $2, address = $3 WHERE id = $4';
        await db.query(updateQuery, [name, description, address, pageId]);
        res.status(200).send('Business page updated.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating business page.');
    }
});

// Delete a business page
router.delete('/:id', authenticateJWT, async (req: AuthenticatedRequest, res) => {
    const ownerId = req.user?.id;
    const pageId = req.params.id;

    if (!ownerId) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const verifyQuery = 'SELECT owner_id FROM business_pages WHERE id = $1';
        const verifyResult = await db.query(verifyQuery, [pageId]);
        const page = verifyResult.rows[0];

        if (!page) {
            return res.status(404).send('Business page not found.');
        }
        if (page.owner_id !== ownerId) {
            return res.status(403).send('You do not have permission to delete this page.');
        }

        const deleteQuery = 'DELETE FROM business_pages WHERE id = $1';
        await db.query(deleteQuery, [pageId]);
        res.status(200).send('Business page deleted.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting business page.');
    }
});


export default router;
