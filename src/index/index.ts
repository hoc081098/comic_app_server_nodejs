import { Controller } from './index.controller';
import express, { Router } from 'express';
import { Crawler } from './index.crawler';

const crawler = new Crawler();
const controller = new Controller(crawler);
const router: Router = express.Router();

router.get('/', (_req, res) => res.status(200).send("<h1>It's working</h1>"));

router.get('/suggest_comics', controller.suggestComics);

router.get('/updated_comics', controller.updatedComics);

router.get('/top_month_comics', controller.topMonthComics);

export default router;
