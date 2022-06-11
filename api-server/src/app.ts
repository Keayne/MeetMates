/* Autor: Valentin Lieberknecht */

import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import http from 'http';
import https from 'https';
import mates from './routes/mate.js';
import profile from './routes/profile.js';
import meets from './routes/meets.js';
import meet from './routes/meet.js';
import activity from './routes/activity.js';
import reports from './routes/reports.js';
import path from 'path';
import { fileURLToPath } from 'url';
import startDB from './db.js';
import { corsService } from './services/cors.service.js';
import fs from 'fs';
import { pathToFileURL } from 'url';
import { startWebSocketServer } from './ws-server.js';
import chat from './routes/chat.js';
import rating from './routes/rating.js';

const config = JSON.parse(fs.readFileSync(new URL('../config.json', import.meta.url), 'utf-8'));

function configureApp(app: Express) {
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(cookieParser());
  app.use(corsService.corsMiddleware);
  app.use((req, res, next) => {
    res.set('Content-Security-Policy', "frame-ancestors 'none'");
    res.set('X-Frame-Options', 'DENY');
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-XSS-Protection', '1');
    res.set('Referrer-Policy', 'no-referrer');
    res.set('Cross-Origin-Resource-Policy', 'same-origin');
    res.set('Permissions-Policy', 'none');
    res.set('Content-Security-Policy-Report-Only', "script-src 'self'; report-uri /reports");
    next();
  });

  app.use('/api', mates);
  app.use('/api/profile', profile);
  app.use('/api/meets', meets);
  app.use('/api/meet', meet);
  app.use('/api/activity', activity);
  app.use('/api/chat', chat);
  app.use('/reports', reports);
  app.use('/api/rating', rating);
}

export async function start() {
  const app = express();

  configureApp(app);
  const stopDB = await startDB(app);
  const stopHttpServer = await startHttpServer(app, config.server.port);

  if (process.env.MEETMATES_MODE === 'TESTING') app.locals.testing = true;

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
