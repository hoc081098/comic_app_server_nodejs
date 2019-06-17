"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("./category.controller");
const category_crawler_1 = require("./category.crawler");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const serviceAccountKey_json_1 = __importDefault(require("../serviceAccountKey.json"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccountKey_json_1.default),
    databaseURL: "https://doanlthtvdk.firebaseio.com"
});
const crawler = new category_crawler_1.Crawler();
const controller = new category_controller_1.Controller(crawler);
const router = express_1.Router();
router.get('/', controller.getAllCategories);
exports.default = router;
//# sourceMappingURL=index.js.map