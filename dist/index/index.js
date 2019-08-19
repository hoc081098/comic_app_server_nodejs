"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_controller_1 = require("./index.controller");
const express_1 = __importDefault(require("express"));
const controller = new index_controller_1.Controller();
const router = express_1.default.Router();
router.get('/', (_req, res) => res.status(200).send("<h1>It's working</h1>"));
router.get('/newest_comics', controller.newestComics);
router.get('/updated_comics', controller.updatedComics);
router.get('/most_viewed_comics', controller.mostViewedComics);
exports.default = router;
//# sourceMappingURL=index.js.map