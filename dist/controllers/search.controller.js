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
const search_crawler_1 = require("../crawler/search.crawler");
const debug_1 = __importDefault(require("debug"));
const log = debug_1.default('comic-app-server:server');
class Controller {
    static search(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query } = req.query;
                log({ query });
                // check query is valid?
                if (query === undefined || query === null) {
                    return res
                        .status(422)
                        .json({
                        message: "Require 'query' to search comic detail",
                        status_code: 500
                    });
                }
                if (typeof query !== 'string') {
                    return res
                        .status(422)
                        .json({
                        message: "Invalid 'query' to search comic detail",
                        status_code: 500
                    });
                }
                const comics = yield search_crawler_1.Crawler.timTruyen(query);
                res.status(200).json(comics);
            }
            catch (e) {
                log(e);
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