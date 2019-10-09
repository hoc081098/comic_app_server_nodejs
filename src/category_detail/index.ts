import express from 'express';
import { Controller } from './category_detail.controller';
import { Crawler } from './category_detail.crawler';

const controller = new Controller();
const router = express.Router();

router.get('/', controller.getCategoryDetail);

router.get('/popular', controller.getPopulars);

export default router;
