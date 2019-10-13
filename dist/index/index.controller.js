"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_crawler_1 = require("./index.crawler");
const util_1 = require("../util");
class Controller {
    constructor() {
        this.newestComics = async (req, res) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const comics = await index_crawler_1.Crawler.newestComics(page);
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
        this.updatedComics = async (req, res) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const comics = await index_crawler_1.Crawler.updatedComics(page);
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
        this.mostViewedComics = async (req, res) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const comics = await index_crawler_1.Crawler.mostViewedComics(page);
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
        };
    }
}
exports.Controller = Controller;
//# sourceMappingURL=index.controller.js.map