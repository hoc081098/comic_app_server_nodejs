import express, { Router } from 'express';
import { Controller } from './detail.controller';
import { Crawler } from './detail.crawler';

const crawler = new Crawler();
const controller = new Controller(crawler);
const router = express.Router();

router.get('/', controller.getComicDetail);

export default router;