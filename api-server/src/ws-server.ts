/* Autor: Valentin Lieberknecht */

import { IncomingMessage, Server } from 'http';
import cookie from 'cookie';
import WebSocket from 'ws';
import { authService } from './services/auth.service.js';
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
  public async onMessage(ws: WebSocketExt, data: string) {
    this.wss.clients.forEach(client => {
      client.send('reload');
      // if (client !== ws && ws.room === data) {
      //   client.send('reload');
      // }
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
    ws.on('message', (data: string) => this.onMessage(ws, data));
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
