"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crawler = void 0;
const util_1 = require("../util");
class Crawler {
    static async newestComics(page) {
        const body = await util_1.GET(`https://manganato.com/genre-all/${page}?type=newest`);
        return util_1.bodyToComicListNew(body);
    }
    static async updatedComics(page) {
        const body = await util_1.GET(`https://manganato.com/genre-all/${page}`);
        return util_1.bodyToComicListNew(body);
    }
    static async mostViewedComics(page) {
        const body = await util_1.GET(`https://manganato.com/genre-all/${page}?type=topview`);
        return util_1.bodyToComicListNew(body);
    }
}
exports.Crawler = Crawler;
//# sourceMappingURL=index.crawler.js.map