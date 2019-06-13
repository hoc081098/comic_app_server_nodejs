"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const search_controller_1 = require("./search.controller");
const search_crawler_1 = require("./search.crawler");
const crawler = new search_crawler_1.Crawler();
const controller = new search_controller_1.Controller(crawler);
const router = express_1.default.Router();
router.get('/', controller.searchComic);
exports.default = router;
//# sourceMappingURL=index.js.map