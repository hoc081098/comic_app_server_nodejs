"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chapter_controller_1 = require("../controllers/chapter.controller");
const router = express_1.default.Router();
router.get('/', chapter_controller_1.Controller.getChapterDetail);
exports.default = router;
//# sourceMappingURL=chapter.js.map