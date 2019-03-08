import express, { Router } from 'express';
import { Controller } from '../controllers/detail.controller';

const router: Router = express.Router();

router.get('/', Controller.getComic);

export default router;