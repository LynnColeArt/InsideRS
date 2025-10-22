import request from 'supertest';
import express from 'express';
import postsRouter from '../posts';
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
app.use('/posts', postsRouter);

describe('Posts API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /posts', () => {
    it('should return a list of posts', async () => {
      const posts = [{ id: 1, content: 'Test Post' }];
      (db.query as jest.Mock).mockResolvedValue({ rows: posts });

      const response = await request(app).get('/posts');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(posts);
    });
  });

  describe('POST /posts', () => {
    it('should create a new post', async () => {
      const newPost = { content: 'This is a new post.' };
      (db.query as jest.Mock).mockResolvedValue({ rows: [{ id: 2, ...newPost }] });

      const response = await request(app).post('/posts').send(newPost);
      expect(response.status).toBe(201);
      expect(response.text).toMatch(/Post created with ID/);
    });
  });

  describe('POST /posts/:id/like', () => {
    it('should like a post', async () => {
        (db.query as jest.Mock).mockResolvedValue({ rows: [] });

        const response = await request(app).post('/posts/1/like');
        expect(response.status).toBe(201);
        expect(response.text).toBe('Post liked.');
    });
    });

    describe('POST /posts/:id/share', () => {
        it('should share a post', async () => {
            (db.query as jest.Mock).mockResolvedValue({ rows: [] });

            const response = await request(app).post('/posts/1/share');
            expect(response.status).toBe(201);
            expect(response.text).toBe('Post shared.');
        });
    });
});
