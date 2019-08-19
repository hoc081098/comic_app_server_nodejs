import { Controller } from './index.controller';
import express from 'express';

const controller = new Controller();
const router = express.Router();

router.get('/', (_req, res) => res.status(200).send("<h1>It's working</h1>"));

router.get('/newest_comics', controller.newestComics);

router.get('/updated_comics', controller.updatedComics);

router.get('/most_viewed_comics', controller.mostViewedComics);

export default router;
