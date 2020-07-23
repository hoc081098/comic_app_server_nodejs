"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const category_detail_crawler_1 = require("./category_detail.crawler");
const util_1 = require("../util");
class Controller {
    constructor() {
        this.getCategoryDetail = async (req, res) => {
            try {
                const { link } = req.query;
                util_1.log({ link });
                // check link is valid?
                if (!link) {
                    return res
                        .status(422)
                        .json({
                        message: "Require 'category link' to get category detail",
                        status_code: 422
                    });
                }
                if (typeof link !== 'string' || !util_1.isValidURL(link)) {
                    return res
                        .status(422)
                        .json({
                        message: "Invalid 'category link' to get category detail",
                        status_code: 422
                    });
                }
                const page = parseInt(req.query.page) || 1;
                const comics = await category_detail_crawler_1.Crawler.getComics(link, page);
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
        };
        this.getPopulars = async (req, res) => {
            try {
                const { link } = req.query;
                util_1.log({ link });
                // check link is valid?
                if (!link) {
                    return res
                        .status(422)
                        .json({
                        message: "Require 'category link' to get category detail",
                        status_code: 422
                    });
                }
                if (typeof link !== 'string' || !util_1.isValidURL(link)) {
                    return res
                        .status(422)
                        .json({
                        message: "Invalid 'category link' to get category detail",
                        status_code: 422
                    });
                }
                const comics = await category_detail_crawler_1.Crawler.getPopularComics(link);
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
        };
    }
}
exports.Controller = Controller;
//# sourceMappingURL=category_detail.controller.js.map