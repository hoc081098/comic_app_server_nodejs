"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("./category.controller");
const category_crawler_1 = require("./category.crawler");
const crawler = new category_crawler_1.Crawler();
const controller = new category_controller_1.Controller(crawler);
const router = express_1.Router();
router.get('/', controller.getAllCategories);
exports.default = router;
//# sourceMappingURL=index.js.map