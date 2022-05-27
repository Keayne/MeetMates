/* Autor: Arne Schaper */
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
    res.status(200).json({ results: rating });
  } else {
    res.status(200).json({ results: 0 });
  }
});

router.get('/findAverageRating/:id', authService.authenticationMiddleware, async (req, res) => {
  const ratingDAO: UniversalDAO<Rating> = req.app.locals.ratingDAO;
  const filter: Partial<Rating> = { activityid: req.params.id };
  const ratings = await ratingDAO.findAll(filter);
  //calculate average value

  let sum = 0;
  let counter = 0;
  ratings.forEach(element => {
    sum = sum + element.rating;
    counter++;
  });
  const avgRating = sum / counter;

  res.status(200).json({ results: avgRating || 0 });
});

router.patch('/:id', authService.authenticationMiddleware, async (req, res) => {
  const ratingDAO: UniversalDAO<Rating> = req.app.locals.ratingDAO;
  const rating = await ratingDAO.findOne({ activityid: req.body.activityid, userid: res.locals.user.id });
  if (rating) {
    await ratingDAO.update(
      {
        activityid: req.body.activityid,
        userid: res.locals.user.id,
        rating: req.body.rating
      },
      [
        { key: 'activityid', value: req.body.activityid },
        { key: 'userid', value: res.locals.user.id }
      ]
    );
  } else {
    await ratingDAO.create({
      activityid: req.body.activityid,
      userid: res.locals.user.id,
      rating: req.body.rating
    });
  }

  res.status(200).end();
});

router.delete('/:id', authService.authenticationMiddleware, async (req, res) => {
  const mateId = res.locals.user.id;
});

router.post('/:id', authService.authenticationMiddleware, async (req, res) => {
  const mateId = res.locals.user.id;
});

export default router;
