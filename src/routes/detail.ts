import express, { Router } from 'express';
import { Controller } from '../controllers/detail.controller';
import { Crawler } from '../crawler/detail.crawler';

const crawler = new Crawler();
const controller = new Controller(crawler);
const router: Router = express.Router();

router.get('/', controller.getComic);

export default router;