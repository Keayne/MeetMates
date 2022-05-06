/* Autor: Valentin Lieberknecht */

import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import http from 'http';
import https from 'https';
import mates from './routes/mates.js';
import profile from './routes/profile.js';
import path from 'path';
import { fileURLToPath } from 'url';
import startDB from './db.js';
import { corsService } from './services/cors.service.js';
import fs from 'fs';
import { pathToFileURL } from 'url';
import { startWebSocketServer } from './ws-server.js';

const config = JSON.parse(fs.readFileSync(new URL('../config.json', import.meta.url), 'utf-8'));

function configureApp(app: Express) {
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(cookieParser());
  app.use(corsService.corsMiddleware);

  app.use('/api/mates', mates);
  app.use('/api/profile', profile);
}

export async function start() {
  const app = express();

  configureApp(app);
  const stopDB = await startDB(app);
  const stopHttpServer = await startHttpServer(app, config.server.port);
  return async () => {
    await stopHttpServer();
    await stopDB();
  };
}

async function startHttpServer(app: Express, port: number) {
  const createOptions = () => {
    const basedir = fileURLToPath(path.dirname(import.meta.url));
    const certDir = path.join(basedir, 'certs');
    return {
      key: fs.readFileSync(path.join(certDir, 'server.key.pem')),
      cert: fs.readFileSync(path.join(certDir, 'server.cert.pem')),
      ca: fs.readFileSync(path.join(certDir, 'intermediate-ca.cert.pem'))
    };
  };
  const httpServer = config.server.https ? https.createServer(createOptions(), app) : http.createServer(app);
  await new Promise<void>(resolve => {
    httpServer.listen(port, () => {
      console.log(`Server running at http${config.server.https ? 's' : ''}://localhost:${port}`);
      resolve();
    });
    startWebSocketServer(httpServer);
  });
  return async () => await new Promise<void>(resolve => httpServer.close(() => resolve()));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  start();
}
