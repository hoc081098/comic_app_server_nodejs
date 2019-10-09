"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
class Controller {
    constructor(crawler) {
        this.crawler = crawler;
        this.getComicDetail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { link } = req.query;
                util_1.log({ link });
                // check link is valid?
                if (!link) {
                    return res
                        .status(422)
                        .json({
                        message: "Require 'comic link' to get comic detail",
                        status_code: 542200
                    });
                }
                if (typeof link !== 'string' || !util_1.isValidURL(link)) {
                    return res
                        .status(422)
                        .json({
                        message: "Invalid 'comic link' to get comic detail",
                        status_code: 422
                    });
                }
                const comic = yield this.crawler.comicDetail(link);
                res.status(200).json(comic);
            }
            catch (e) {
                util_1.log(e);
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
//# sourceMappingURL=detail.controller.js.map