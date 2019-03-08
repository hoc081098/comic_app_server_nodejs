import { Controller } from '../controllers/index.controller';

import express, { Router } from 'express';
const router: Router = express.Router();

router.get('/', (_req, res, _next) => res.status(200).send('<h1>Hello</h1>'));

router.get('/truyen_de_cu', Controller.truyenDeCu);

router.get('/truyen_moi_cap_nhat', Controller.truyenMoiCapNhat);

router.get('/top_thang', Controller.topThang);

export default router;
