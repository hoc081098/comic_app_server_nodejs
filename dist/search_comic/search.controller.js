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
const search_crawler_1 = require("./search.crawler");
const util_1 = require("../util");
class Controller {
    constructor() {
        this.searchComic = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { query } = req.query;
                util_1.log({ query });
                // check query is valid?
                if (query === undefined || query === null) {
                    return res
                        .status(422)
                        .json({
                        message: "Require 'query' to searchComic comic detail",
                        status_code: 500
                    });
                }
                if (typeof query !== 'string') {
                    return res
                        .status(422)
                        .json({
                        message: "Invalid 'query' to searchComic comic detail",
                        status_code: 500
                    });
                }
                const page = parseInt(req.query.page) || 1;
                const comics = yield search_crawler_1.Crawler.searchComic(query, page);
                res.status(200).json(comics);
            }
            catch (e) {
                util_1.log(e);
                res.status(500).json({
                    message: 'Internal server error',
                    status_code: 500
                });
            }
        });
    }
}
exports.Controller = Controller;
//# sourceMappingURL=search.controller.js.map