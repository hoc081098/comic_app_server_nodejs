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
        this.suggestComics = (_req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const comics = yield this.crawler.suggestComics();
                res.status(200).json(comics);
            }
            catch (e) {
                util_1.log(e);
                const error = {
                    message: 'Internal server error',
                    status_code: 500
                };
                res.status(500).json(error);
            }
        });
        this.updatedComics = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(req.query.page) || 1;
            try {
                const comics = yield this.crawler.updatedComics(page);
                res.status(200).json(comics);
            }
            catch (e) {
                util_1.log(e);
                const error = {
                    message: 'Internal server error',
                    status_code: 500
                };
                res.status(500).json(error);
            }
        });
        this.topMonthComics = (_req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const comics = yield this.crawler.topMonthComics();
                res.status(200).json(comics);
            }
            catch (e) {
                util_1.log(e);
                const error = {
                    message: 'Internal server error',
                    status_code: 500,
                };
                res.status(500).json(error);
            }
        });
    }
}
exports.Controller = Controller;
//# sourceMappingURL=index.controller.js.map