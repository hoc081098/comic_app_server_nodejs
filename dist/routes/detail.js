"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const detail_controller_1 = require("../controllers/detail.controller");
const detail_crawler_1 = require("../crawler/detail.crawler");
const crawler = new detail_crawler_1.Crawler();
const controller = new detail_controller_1.Controller(crawler);
const router = express_1.default.Router();
router.get('/', controller.getComic);
exports.default = router;
//# sourceMappingURL=detail.js.map