/* Autor: Valentin Lieberknecht */

import { IncomingMessage, Server } from 'http';
import WebSocket from 'ws';
import { Mate } from './models/mate.js';

interface WebSocketExt extends WebSocket {
  isAlive: boolean;
  claimsSet: Partial<Mate>;
  room: string;
}

class WebSocketServer {
  private wss!: WebSocket.Server;

  public init(httpServer: Server) {
    this.wss = new WebSocket.Server({ server: httpServer });
    this.setupHeartBeat();

    this.wss.on('connection', (ws: WebSocketExt, req) => this.onConnection(ws, req));
  }
  public async onMessage(req: IncomingMessage, ws: WebSocketExt, data: string) {
    this.wss.clients.forEach(client => {
      if (client !== ws && ws.room === data) {
        client.send('reload');
      }
    });
  }

  public sendMessage(userId: string, message: object) {
    const messageString = JSON.stringify(message);
    this.wss.clients.forEach(client => {
      const ws = client as WebSocketExt;
      if (ws.claimsSet.id === userId) {
        ws.send(messageString);
      }
    });
  }

  private async onConnection(ws: WebSocketExt, req: IncomingMessage) {
    if (req.url) {
      ws.room = req.url.substring(1);
      ws.on('message', (data: string) => this.onMessage(req, ws, data));
    }
    ws.isAlive = true;
    ws.on('pong', () => {
      ws.isAlive = true;
    });
  }

  private setupHeartBeat() {
    setInterval(() => {
      this.wss.clients.forEach(client => {
        const ws = client as WebSocketExt;
        if (!ws.isAlive) {
          return ws.terminate();
        }
        ws.isAlive = false;
        client.send('heartbeat');
        ws.ping(() => {
          /* noop */
        });
      });
    }, 30000);
  }
}

export const wsServer = new WebSocketServer();

export function startWebSocketServer(httpServer: Server) {
  wsServer.init(httpServer);
}
