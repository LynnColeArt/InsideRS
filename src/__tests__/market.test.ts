import request from 'supertest';
import express from 'express';
import marketRouter from '../market';
import db from '../database';
import { authenticateJWT } from '../middleware';

// Mock the database
jest.mock('../database', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.use(authenticateJWT); // Use the real middleware, which is mocked in the test env
app.use('/market', marketRouter);

describe('Market API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /market', () => {
    it('should return a list of products', async () => {
      const products = [{ id: 1, name: 'Test Product' }];
      (db.query as jest.Mock).mockResolvedValue({ rows: products });

      const response = await request(app).get('/market');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(products);
    });
  });

  describe('GET /market/:id', () => {
    it('should return a single product', async () => {
      const product = { id: 1, name: 'Test Product' };
      (db.query as jest.Mock).mockResolvedValue({ rows: [product] });

      const response = await request(app).get('/market/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(product);
    });
  });

  describe('POST /market', () => {
    it('should create a new product', async () => {
      const newProduct = { name: 'New Product', price: 10.99 };
      (db.query as jest.Mock).mockResolvedValue({ rows: [{ id: 2, ...newProduct }] });

      const response = await request(app).post('/market').send(newProduct);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });
  });

  describe('PUT /market/:id', () => {
    it('should update a product', async () => {
        const product = { seller_id: 1 };
        (db.query as jest.Mock).mockResolvedValue({ rows: [product] });

        const response = await request(app)
            .put('/market/1')
            .send({ name: 'Updated Product', price: 20.99 });

        expect(response.status).toBe(200);
        expect(response.text).toBe('Product updated.');
    });
  });

    describe('DELETE /market/:id', () => {
        it('should delete a product', async () => {
            const product = { seller_id: 1 };
            (db.query as jest.Mock).mockResolvedValue({ rows: [product] });

            const response = await request(app).delete('/market/1');
            expect(response.status).toBe(200);
            expect(response.text).toBe('Product deleted.');
        });
    });
});
