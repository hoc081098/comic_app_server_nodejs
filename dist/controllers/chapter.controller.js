"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const util_1 = require("../util");
const log = debug_1.default('comic-app-server:server');
class Controller {
    constructor(crawler) {
        this.crawler = crawler;
        this.getChapterDetail = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { link } = req.query;
                log({ link });
                // check link is valid?
                if (!link) {
                    return res
                        .status(422)
                        .json({
                        message: "Require 'chapter link' to get chapter detail",
                        status_code: 500
                    });
                }
                if (typeof link !== 'string' || !util_1.isValidURL(link)) {
                    return res
                        .status(422)
                        .json({
                        message: "Invalid 'chapter link' to get chapter detail",
                        status_code: 500
                    });
                }
                const chapter = yield this.crawler.chapterDetail(link);
                res.status(200).json(chapter);
            }
            catch (e) {
                log(e);
                res.status(500)
                    .json({
                    message: 'Internal server error',
                    status_code: 500
                });
            }
        });
    }
}
exports.Controller = Controller;
//# sourceMappingURL=chapter.controller.js.map