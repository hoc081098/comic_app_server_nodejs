import express from 'express';
import { Controller } from './chapter.controller';
import { Crawler } from './chapter.crawler';

const crawler = new Crawler();
const controller = new Controller(crawler);
const router = express.Router();

router.get('/', controller.getChapterDetail);

export default router;