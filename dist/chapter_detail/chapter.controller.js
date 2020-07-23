"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const util_1 = require("../util");
class Controller {
    constructor(crawler) {
        this.crawler = crawler;
        this.getChapterDetail = async (req, res) => {
            try {
                const { link } = req.query;
                util_1.log({ link });
                // check link is valid?
                if (!link) {
                    return res
                        .status(422)
                        .json({
                        message: "Require 'chapter link' to get chapter detail",
                        status_code: 422
                    });
                }
                if (typeof link !== 'string' || !util_1.isValidURL(link)) {
                    return res
                        .status(422)
                        .json({
                        message: "Invalid 'chapter link' to get chapter detail",
                        status_code: 422
                    });
                }
                const chapter = await this.crawler.chapterDetail(link);
                res.status(200).json(chapter);
            }
            catch (e) {
                util_1.log(e);
                res.status(500)
                    .json({
                    message: 'Internal server error',
                    status_code: 500
                });
            }
        };
    }
}
exports.Controller = Controller;
//# sourceMappingURL=chapter.controller.js.map