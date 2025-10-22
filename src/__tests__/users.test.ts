import request from 'supertest';
import express from 'express';
import usersRouter from '../users';
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
app.use('/users', usersRouter);

describe('Users API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /users', () => {
    it('should return a list of users', async () => {
      const users = [{ id: 2, username: 'testuser2' }];
      (db.query as jest.Mock).mockResolvedValue({ rows: users });

      const response = await request(app).get('/users');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(users);
    });
  });
});
