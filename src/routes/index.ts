import { Controller } from '../controllers/index.controller';

import express, { Router } from 'express';
const router: Router = express.Router();

router.get('/', (req, res, next) => res.status(200).send('<h3>Hello</h3>'));

router.get('/truyen_de_cu', Controller.truyenDeCu);

router.get('/truyen_moi_cap_nhat', Controller.truyenMoiCapNhat);

router.get('/top_thang', Controller.topThang);

export default router;
