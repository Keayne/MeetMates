/* Autor: Prof. Dr. Norman Lahme-Hütig (FH Münster) */

import { start as startServer } from '../../src/app.js';

let stopServer: () => Promise<void>;

export const mochaHooks = {
  async beforeAll() {
    process.env.MEETMATES_MODE = 'TESTING';
    stopServer = await startServer();
  },
  async afterAll() {
    await stopServer();
  }
};
