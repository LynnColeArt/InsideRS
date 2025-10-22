import request from 'supertest';
import express from 'express';
import friendsRouter from '../friends';
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
app.use('/friends', friendsRouter);

describe('Friends API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /friends', () => {
    it('should return a list of friends', async () => {
      const friends = [{ id: 2, username: 'friend1' }];
      (db.query as jest.Mock).mockResolvedValue({ rows: friends });

      const response = await request(app).get('/friends');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(friends);
    });
  });

  describe('GET /friends/requests', () => {
    it('should return a list of friend requests', async () => {
      const requests = [{ id: 3, username: 'friend2' }];
      (db.query as jest.Mock).mockResolvedValue({ rows: requests });

      const response = await request(app).get('/friends/requests');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(requests);
    });
  });

  describe('POST /friends/request/:id', () => {
    it('should send a friend request', async () => {
      (db.query as jest.Mock).mockResolvedValue({ rows: [] });

      const response = await request(app).post('/friends/request/2');
      expect(response.status).toBe(201);
      expect(response.text).toBe('Friend request sent.');
    });
  });

  describe('POST /friends/accept/:id', () => {
    it('should accept a friend request', async () => {
      (db.query as jest.Mock).mockResolvedValue({ rowCount: 1 });

      const response = await request(app).post('/friends/accept/2');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Friend request accepted.');
    });
  });

    describe('DELETE /friends/:id', () => {
        it('should remove a friend', async () => {
            (db.query as jest.Mock).mockResolvedValue({ rowCount: 1 });

            const response = await request(app).delete('/friends/2');
            expect(response.status).toBe(200);
            expect(response.text).toBe('Friend removed.');
        });
    });
});
