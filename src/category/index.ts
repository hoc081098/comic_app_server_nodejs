import { Router } from 'express';
import { Controller } from './category.controller';
import { Crawler } from './category.crawler';

const crawler = new Crawler();
const controller = new Controller(crawler);
const router = Router();

router.get('/', controller.getAllCategories);

export default router;