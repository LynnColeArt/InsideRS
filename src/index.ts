import express from 'express';
import { createServer } from 'http';
import { createWebSocketServer } from './chat';
import authRouter from './auth';
import blogRouter from './blog';
import businessRouter from './business';
import friendsRouter from './friends';
import marketRouter from './market';
import postsRouter from './posts';
import usersRouter from './users';

const app = express();
const server = createServer(app);
const port = 3000;

app.use(express.json());
app.use('/auth', authRouter);
app.use('/blog', blogRouter);
app.use('/business', businessRouter);
app.use('/friends', friendsRouter);
app.use('/market', marketRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

createWebSocketServer(server);

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
