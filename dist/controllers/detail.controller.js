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
const detail_crawler_1 = require("../crawler/detail.crawler");
const log = debug_1.default('comic-app-server:server');
class Controller {
    static isValidURL(str) {
        const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return pattern.test(str);
    }
    static getComic(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { link } = req.query;
                log({ link });
                // check link is valid?
                if (!link) {
                    return res
                        .status(422)
                        .json({
                        message: "Require 'comic link' to get comic detail",
                        status_code: 500
                    });
                }
                if (typeof link !== 'string' || !Controller.isValidURL(link)) {
                    return res
                        .status(422)
                        .json({
                        message: "Invalid 'comic link' to get comic detail",
                        status_code: 500
                    });
                }
                let comic = yield detail_crawler_1.Crawler.chiTietTruyen(link);
                res.status(200).json(comic);
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
    ;
}
exports.Controller = Controller;
//# sourceMappingURL=detail.controller.js.map