import request from 'supertest';
import express from 'express';
import blogRouter from '../blog';
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
app.use('/blog', blogRouter);

describe('Blog API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /blog', () => {
    it('should return a list of blog posts', async () => {
      const posts = [{ id: 1, title: 'Test Post' }];
      (db.query as jest.Mock).mockResolvedValue({ rows: posts });

      const response = await request(app).get('/blog');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(posts);
    });
  });

  describe('GET /blog/:id', () => {
    it('should return a single blog post', async () => {
      const post = { id: 1, title: 'Test Post' };
      (db.query as jest.Mock).mockResolvedValue({ rows: [post] });

      const response = await request(app).get('/blog/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(post);
    });
  });

  describe('POST /blog', () => {
    it('should create a new blog post', async () => {
      const newPost = { title: 'New Post', content: 'This is a new post.' };
      (db.query as jest.Mock).mockResolvedValue({ rows: [{ id: 2, ...newPost }] });

      const response = await request(app).post('/blog').send(newPost);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });
  });

  describe('PUT /blog/:id', () => {
    it('should update a blog post', async () => {
        const post = { author_id: 1 };
        (db.query as jest.Mock).mockResolvedValue({ rows: [post] });

        const response = await request(app)
            .put('/blog/1')
            .send({ title: 'Updated Post', content: 'This is an updated post.' });

        expect(response.status).toBe(200);
        expect(response.text).toBe('Blog post updated.');
    });
  });

    describe('DELETE /blog/:id', () => {
        it('should delete a blog post', async () => {
            const post = { author_id: 1 };
            (db.query as jest.Mock).mockResolvedValue({ rows: [post] });

            const response = await request(app).delete('/blog/1');
            expect(response.status).toBe(200);
            expect(response.text).toBe('Blog post deleted.');
        });
    });
});
