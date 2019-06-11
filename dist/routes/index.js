"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_controller_1 = require("../controllers/index.controller");
const express_1 = __importDefault(require("express"));
const index_crawler_1 = require("../crawler/index.crawler");
const crawler = new index_crawler_1.Crawler();
const controller = new index_controller_1.Controller(crawler);
const router = express_1.default.Router();
router.get('/', (_req, res, _next) => res.status(200).send('<h1>Hello</h1>'));
router.get('/truyen_de_cu', controller.truyenDeCu);
router.get('/truyen_moi_cap_nhat', controller.truyenMoiCapNhat);
router.get('/top_thang', controller.topThang);
exports.default = router;
//# sourceMappingURL=index.js.map