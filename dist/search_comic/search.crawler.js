"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crawler = void 0;
const util_1 = require("../util");
class Crawler {
    static async searchComic(query, page) {
        const body = await util_1.GET(`https://ww2.mangafox.online/search/${query}/page/${page}`);
        return util_1.bodyToComicList(body);
    }
}
exports.Crawler = Crawler;
//# sourceMappingURL=search.crawler.js.map