/* Autor: Valentin Lieberknecht */

import { IncomingMessage, Server } from 'http';
import cookie from 'cookie';
import WebSocket from 'ws';
import { authService } from './services/auth.service.js';
import { Mate } from './models/mate.js';

interface WebSocketExt extends WebSocket {
  isAlive: boolean;
  claimsSet: Partial<Mate>;
}

class WebSocketServer {
  private wss!: WebSocket.Server;

  public init(httpServer: Server) {
    this.wss = new WebSocket.Server({ server: httpServer });
    this.setupHeartBeat();

    this.wss.on('connection', (ws: WebSocketExt, req) => this.onConnection(ws, req));
  }
  public async onMessage(ws: WebSocketExt, data: any) {
    this.wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
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
    ws.on('message', (data: any) => this.onMessage(ws, data));
    // const valid = await this.validateConnection(ws, req);
    // if (valid) {
    //   ws.isAlive = true;
    //   ws.on('pong', () => {
    //     ws.isAlive = true;
    //   });
    // } else {
    //   ws.close();
    // }
  }

  private async validateConnection(ws: WebSocketExt, req: IncomingMessage) {
    const token = cookie.parse(req.headers.cookie as string)['jwt-token'];
    try {
      ws.claimsSet = authService.verifyToken(token) as Partial<Mate>;
      return true;
    } catch (error) {
      return false;
    }
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
