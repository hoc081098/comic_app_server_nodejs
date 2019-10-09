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
const util_1 = require("../util");
const cheerio_1 = __importDefault(require("cheerio"));
class Crawler {
    static getComics(categoryLink, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = yield util_1.GET(`${categoryLink}/page/${page}`);
            return util_1.bodyToComicList(body);
        });
    }
    static getPopularComics(categoryLink) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = yield util_1.GET(categoryLink);
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
        });
    }
}
exports.Crawler = Crawler;
//# sourceMappingURL=category_detail.crawler.js.map