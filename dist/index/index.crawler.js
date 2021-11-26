"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crawler = void 0;
const util_1 = require("../util");
class Crawler {
    static buildUrl(type, page) {
        const url = `${util_1.BASE_URL}/manga_list/?type=${type}&category=all&state=all&page=${page}`;
        util_1.log(`GET ${url}`);
        return url;
    }
    static async newestComics(page) {
        const body = await util_1.GET(Crawler.buildUrl('newest', page));
        return util_1.bodyToComicListNew(body);
    }
    static async updatedComics(page) {
        const body = await util_1.GET(Crawler.buildUrl('latest', page));
        return util_1.bodyToComicListNew(body);
    }
    static async mostViewedComics(page) {
        const body = await util_1.GET(Crawler.buildUrl('topview', page));
        return util_1.bodyToComicListNew(body);
    }
}
exports.Crawler = Crawler;
//# sourceMappingURL=index.crawler.js.map