import { Controller } from '../controllers/index.controller';
import express, { Router } from 'express';
import { Crawler } from '../crawler/index.crawler';

const crawler = new Crawler();
const controller = new Controller(crawler);
const router: Router = express.Router();

router.get('/', (_req, res, _next) => res.status(200).send('<h1>Hello</h1>'));

router.get('/truyen_de_cu', controller.truyenDeCu);

router.get('/truyen_moi_cap_nhat', controller.truyenMoiCapNhat);

router.get('/top_thang', controller.topThang);

export default router;
