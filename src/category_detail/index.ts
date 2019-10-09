import express from 'express';
import { Controller } from './category_detail.controller';

const controller = new Controller();
const router = express.Router();

router.get('/', controller.getCategoryDetail);

export default router;
