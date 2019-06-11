import express, { Router } from 'express';
import { Controller } from '../controllers/search.controller';
import { Crawler } from '../crawler/search.crawler';

const crawler = new Crawler();
const controller = new Controller(crawler);
const router: Router = express.Router();

router.get('/', controller.search);

export default router;