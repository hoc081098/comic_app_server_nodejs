import express, { Router } from 'express';
import { Controller } from '../controllers/chapter.controller';
import { Crawler } from '../crawler/chapter.crawler';

const crawler = new Crawler();
const controller = new Controller(crawler);
const router: Router = express.Router();

router.get('/', controller.getChapterDetail);

export default router;