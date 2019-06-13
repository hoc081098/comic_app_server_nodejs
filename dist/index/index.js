"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_controller_1 = require("./index.controller");
const express_1 = __importDefault(require("express"));
const index_crawler_1 = require("./index.crawler");
const crawler = new index_crawler_1.Crawler();
const controller = new index_controller_1.Controller(crawler);
const router = express_1.default.Router();
router.get('/', (_req, res) => res.status(200).send("<h1>It's working</h1>"));
router.get('/suggest_comics', controller.suggestComics);
router.get('/updated_comics', controller.updatedComics);
router.get('/top_month_comics', controller.topMonthComics);
exports.default = router;
//# sourceMappingURL=index.js.map