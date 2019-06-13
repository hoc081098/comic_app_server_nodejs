"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chapter_controller_1 = require("./chapter.controller");
const chapter_crawler_1 = require("./chapter.crawler");
const crawler = new chapter_crawler_1.Crawler();
const controller = new chapter_controller_1.Controller(crawler);
const router = express_1.default.Router();
router.get('/', controller.getChapterDetail);
exports.default = router;
//# sourceMappingURL=index.js.map