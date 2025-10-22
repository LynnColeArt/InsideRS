import express from 'express';
import db from './database';
import { authenticateJWT, AuthenticatedRequest } from './middleware';

const router = express.Router();

// List a new product for sale
router.post('/', authenticateJWT, async (req: AuthenticatedRequest, res) => {
    const sellerId = req.user?.id;
    const { name, description, price, imageUrl } = req.body;

    if (!sellerId) {
        return res.status(401).send('Unauthorized');
    }

    if (!name || !price) {
        return res.status(400).send('Product name and price are required.');
    }

    const query = 'INSERT INTO products (seller_id, name, description, price, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING id';
    try {
        const result = await db.query(query, [sellerId, name, description, price, imageUrl]);
        res.status(201).json({ id: result.rows[0].id });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error listing product.');
    }
});

// Get all product listings
router.get('/', async (req, res) => {
    const query = 'SELECT * FROM products ORDER BY created_at DESC';
    try {
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving products.');
    }
});

// Get a specific product listing
router.get('/:id', async (req, res) => {
    const productId = req.params.id;
    const query = 'SELECT * FROM products WHERE id = $1';
    try {
        const result = await db.query(query, [productId]);
        if (result.rows.length === 0) {
            return res.status(404).send('Product not found.');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving product.');
    }
});

// Update a product listing
router.put('/:id', authenticateJWT, async (req: AuthenticatedRequest, res) => {
    const sellerId = req.user?.id;
    const productId = req.params.id;
    const { name, description, price, imageUrl } = req.body;

    if (!sellerId) {
        return res.status(401).send('Unauthorized');
    }

    if (!name || !price) {
        return res.status(400).send('Product name and price are required.');
    }

    try {
        const verifyQuery = 'SELECT seller_id FROM products WHERE id = $1';
        const verifyResult = await db.query(verifyQuery, [productId]);
        const product = verifyResult.rows[0];

        if (!product) {
            return res.status(404).send('Product not found.');
        }
        if (product.seller_id !== sellerId) {
            return res.status(403).send('You do not have permission to edit this listing.');
        }

        const updateQuery = 'UPDATE products SET name = $1, description = $2, price = $3, image_url = $4 WHERE id = $5';
        await db.query(updateQuery, [name, description, price, imageUrl, productId]);
        res.status(200).send('Product updated.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating product.');
    }
});

// Delete a product listing
router.delete('/:id', authenticateJWT, async (req: AuthenticatedRequest, res) => {
    const sellerId = req.user?.id;
    const productId = req.params.id;

    if (!sellerId) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const verifyQuery = 'SELECT seller_id FROM products WHERE id = $1';
        const verifyResult = await db.query(verifyQuery, [productId]);
        const product = verifyResult.rows[0];

        if (!product) {
            return res.status(404).send('Product not found.');
        }
        if (product.seller_id !== sellerId) {
            return res.status(403).send('You do not have permission to delete this listing.');
        }

        const deleteQuery = 'DELETE FROM products WHERE id = $1';
        await db.query(deleteQuery, [productId]);
        res.status(200).send('Product deleted.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting product.');
    }
});

export default router;
