"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const search_crawler_1 = require("./search.crawler");
const util_1 = require("../util");
class Controller {
    constructor() {
        this.searchComic = async (req, res, _next) => {
            try {
                const { query } = req.query;
                util_1.log({ query });
                // check query is valid?
                if (query === undefined || query === null) {
                    return res
                        .status(422)
                        .json({
                        message: "Require 'query' to searchComic comic detail",
                        status_code: 422
                    });
                }
                if (typeof query !== 'string') {
                    return res
                        .status(422)
                        .json({
                        message: "Invalid 'query' to searchComic comic detail",
                        status_code: 422
                    });
                }
                const page = parseInt(req.query.page) || 1;
                const comics = await search_crawler_1.Crawler.searchComic(query, page);
                res.status(200).json(comics);
            }
            catch (e) {
                util_1.log(e);
                res.status(500).json({
                    message: 'Internal server error',
                    status_code: 500
                });
            }
        };
    }
}
exports.Controller = Controller;
//# sourceMappingURL=search.controller.js.map