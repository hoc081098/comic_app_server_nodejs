import express, { Router } from 'express';
import { Controller } from '../controllers/chapter.controller';

const router: Router = express.Router();

router.get('/', Controller.getChapterDetail);

export default router;