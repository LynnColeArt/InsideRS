import request from 'supertest';
import express from 'express';
import authRouter from '../auth';
import db from '../database';
import bcrypt from 'bcrypt';

// Mock dependencies
jest.mock('../database', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Auth API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/signup', () => {
    it('should create a new user successfully', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      (db.query as jest.Mock).mockResolvedValue({ rows: [{ id: 1 }] });

      const response = await request(app)
        .post('/auth/signup')
        .send({ username: 'testuser', email: 'test@test.com', password: 'password' });

      expect(response.status).toBe(201);
      expect(response.text).toBe('User created with ID: 1');
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(db.query).toHaveBeenCalled();
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({ username: 'testuser' });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Please provide all required fields.');
    });

    it('should return 500 if database query fails', async () => {
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
        (db.query as jest.Mock).mockRejectedValue(new Error('DB error'));

        const response = await request(app)
            .post('/auth/signup')
            .send({ username: 'testuser', email: 'test@test.com', password: 'password' });

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error creating user.');
    });
  });

  describe('POST /auth/login', () => {
    it('should log in a user and return a token', async () => {
      const user = { id: 1, password_hash: 'hashedpassword' };
      (db.query as jest.Mock).mockResolvedValue({ rows: [user] });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'password' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials (user not found)', async () => {
      (db.query as jest.Mock).mockResolvedValue({ rows: [] });

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'wrong@test.com', password: 'password' });

      expect(response.status).toBe(401);
      expect(response.text).toBe('Invalid email or password.');
    });

    it('should return 401 for invalid credentials (wrong password)', async () => {
      const user = { id: 1, password_hash: 'hashedpassword' };
      (db.query as jest.Mock).mockResolvedValue({ rows: [user] });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.text).toBe('Invalid email or password.');
    });

    it('should return 500 if database query fails', async () => {
        (db.query as jest.Mock).mockRejectedValue(new Error('DB error'));

        const response = await request(app)
            .post('/auth/login')
            .send({ email: 'test@test.com', password: 'password' });

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error logging in.');
    });
  });
});
