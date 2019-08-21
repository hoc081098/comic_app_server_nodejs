import express from 'express';
import { Controller } from './search.controller';
import { Crawler } from './search.crawler';

const crawler = new Crawler();
const controller = new Controller();
const router = express.Router();

router.get('/', controller.searchComic);

export default router;