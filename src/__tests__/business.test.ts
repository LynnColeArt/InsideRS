import request from 'supertest';
import express from 'express';
import businessRouter from '../business';
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
app.use('/business', businessRouter);

describe('Business API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /business', () => {
    it('should return a list of business pages', async () => {
      const pages = [{ id: 1, name: 'Test Business' }];
      (db.query as jest.Mock).mockResolvedValue({ rows: pages });

      const response = await request(app).get('/business');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(pages);
    });
  });

  describe('GET /business/:id', () => {
    it('should return a single business page', async () => {
      const page = { id: 1, name: 'Test Business' };
      (db.query as jest.Mock).mockResolvedValue({ rows: [page] });

      const response = await request(app).get('/business/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(page);
    });
  });

  describe('POST /business', () => {
    it('should create a new business page', async () => {
      const newPage = { name: 'New Business', description: 'This is a new business.' };
      (db.query as jest.Mock).mockResolvedValue({ rows: [{ id: 2, ...newPage }] });

      const response = await request(app).post('/business').send(newPage);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });
  });

  describe('PUT /business/:id', () => {
    it('should update a business page', async () => {
        const page = { owner_id: 1 };
        (db.query as jest.Mock).mockResolvedValue({ rows: [page] });

        const response = await request(app)
            .put('/business/1')
            .send({ name: 'Updated Business', description: 'This is an updated business.' });

        expect(response.status).toBe(200);
        expect(response.text).toBe('Business page updated.');
    });
  });

    describe('DELETE /business/:id', () => {
        it('should delete a business page', async () => {
            const page = { owner_id: 1 };
            (db.query as jest.Mock).mockResolvedValue({ rows: [page] });

            const response = await request(app).delete('/business/1');
            expect(response.status).toBe(200);
            expect(response.text).toBe('Business page deleted.');
        });
    });
});
