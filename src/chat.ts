import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import jwt from 'jsonwebtoken';
import { URLSearchParams } from 'url';

interface ExtendedWebSocket extends WebSocket {
  isAlive?: boolean;
  userId?: number;
}

const clients = new Map<number, ExtendedWebSocket>();

export const createWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: ExtendedWebSocket, req) => {
    const token = new URLSearchParams(req.url?.split('?')[1]).get('token');
    if (!token) {
      ws.close(1011, 'Missing token');
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as { id: number };
      ws.userId = decoded.id;
      clients.set(ws.userId, ws);
    } catch (err) {
      ws.close(1011, 'Invalid token');
      return;
    }

    ws.isAlive = true;
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('message', (message: string) => {
        try {
            const parsedMessage = JSON.parse(message);
            const { recipientId, content } = parsedMessage;

            if (recipientId && content) {
                const recipientSocket = clients.get(recipientId);
                if (recipientSocket && recipientSocket.readyState === WebSocket.OPEN) {
                    recipientSocket.send(JSON.stringify({ senderId: ws.userId, content }));
                }
            }
        } catch (error) {
            console.error('Failed to parse message or send:', error)
        }
    });

    ws.on('close', () => {
      if(ws.userId) {
        clients.delete(ws.userId);
      }
      console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
  });

  const interval = setInterval(() => {
    wss.clients.forEach((client) => {
      const ws = client as ExtendedWebSocket;
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping(() => {});
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });

  console.log('WebSocket server is running');
};
