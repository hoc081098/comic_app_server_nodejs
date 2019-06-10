import { Router } from 'express';
import { Controller } from '../controllers/category.controller';
import { Crawler } from '../crawler/category.crawler';

const crawler = new Crawler();
const controller = new Controller(crawler);
const router = Router();

router.get('/', controller.getAllCategories);

export default router;