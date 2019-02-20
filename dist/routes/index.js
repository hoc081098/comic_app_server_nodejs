"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_controller_1 = require("../controllers/index.controller");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/', (req, res, next) => res.status(200).send('<h3>Hello</h3>'));
router.get('/truyen_de_cu', index_controller_1.Controller.truyenDeCu);
router.get('/truyen_moi_cap_nhat', index_controller_1.Controller.truyenMoiCapNhat);
router.get('/top_thang', index_controller_1.Controller.topThang);
exports.default = router;
//# sourceMappingURL=index.js.map