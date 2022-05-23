/* Autor: Jonathan Hüls */

import express from 'express';
import { GenericDAO } from '../models/generic.dao.js';
import { Report } from '../models/report.js';

const router = express.Router();
const reports: string[] = [];

router.post('/', (req, res) => {
  /*
  const reportDAO: GenericDAO<Report> = req.app.locals.reportDAO;
  reportDAO.create({ })
  */
  reports.push(req.body);
  // Report steht in req.body
});

export default router;
