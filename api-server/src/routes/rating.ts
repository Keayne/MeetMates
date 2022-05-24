import express from 'express';
import { Rating } from '../models/rating.js';
import { UniversalDAO } from '../models/universal.dao.js';
import { authService } from '../services/auth.service.js';

const router = express.Router();

router.get('/findOne/:id', authService.authenticationMiddleware, async (req, res) => {
  const mateId = res.locals.user.id;
  const ratingDAO: UniversalDAO<Rating> = req.app.locals.ratingDAO;
  const filter: Partial<Rating> = { activityid: req.params.id, userid: mateId };
  const rating = await ratingDAO.findOne(filter);
  if (rating) {
    res.status(200).json({ results: rating.rating });
  } else {
    res.status(200).json({ results: 0 });
  }
});

router.get('/findAverageRating/:id', authService.authenticationMiddleware, async (req, res) => {
  const mateId = res.locals.user.id;
  const ratingDAO: UniversalDAO<Rating> = req.app.locals.ratingDAO;
  const filter: Partial<Rating> = { activityid: req.params.id };
  const ratings = await ratingDAO.findAll(filter);
  //calculate average value

  let sum: number = 0;
  let counter: number = 0;
  ratings.forEach(element => {
    console.log(element.rating);
    sum = sum + element.rating;
    counter++;
  });
  let avgRating = sum / counter;

  res.status(200).json({ results: avgRating });
});

export default router;
