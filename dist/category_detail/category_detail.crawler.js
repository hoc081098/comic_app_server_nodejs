"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crawler = void 0;
const util_1 = require("../util");
const cheerio_1 = __importDefault(require("cheerio"));
class Crawler {
    static async getComics(categoryLink, page) {
        const body = await util_1.GET(`${categoryLink}/page/${page}`);
        return util_1.bodyToComicList(body);
    }
    static async getPopularComics(categoryLink) {
        const body = await util_1.GET(categoryLink);
        const $ = cheerio_1.default.load(body);
        return $('div.manga_slide_container > div.fit_thumbnail')
            .toArray()
            .map((e) => {
            const $e = $(e);
            const a = $e.find('a');
            const img = $e.find('a > img');
            const span = $e.find('div.manga_slide_name > span > a');
            return {
                title: a.attr('title'),
                link: a.attr('href'),
                thumbnail: img.attr('src'),
                last_chapter: {
                    chapter_link: span.attr('href'),
                    chapter_name: span.attr('title')
                }
            };
        });
    }
}
exports.Crawler = Crawler;
//# sourceMappingURL=category_detail.crawler.js.map