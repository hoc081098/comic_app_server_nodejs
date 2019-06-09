import express, { Router } from 'express';
import { Controller } from '../controllers/search.controller';

const router: Router = express.Router();

router.get('/', Controller.search);

export default router;