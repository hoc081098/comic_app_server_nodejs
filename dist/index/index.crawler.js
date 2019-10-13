"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
class Crawler {
    static async newestComics(page) {
        const body = await util_1.GET(`https://ww2.mangafox.online/newmanga/page/${page}`);
        return util_1.bodyToComicList(body);
    }
    static async updatedComics(page) {
        const body = await util_1.GET(`https://ww2.mangafox.online/page/${page}`);
        return util_1.bodyToComicList(body);
    }
    static async mostViewedComics(page) {
        const body = await util_1.GET(`https://ww2.mangafox.online/topmanga/page/${page}`);
        return util_1.bodyToComicList(body);
    }
}
exports.Crawler = Crawler;
//# sourceMappingURL=index.crawler.js.map