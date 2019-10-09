"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_detail_controller_1 = require("./category_detail.controller");
const controller = new category_detail_controller_1.Controller();
const router = express_1.default.Router();
router.get('/', controller.getCategoryDetail);
router.get('/popular', controller.getPopulars);
exports.default = router;
//# sourceMappingURL=index.js.map