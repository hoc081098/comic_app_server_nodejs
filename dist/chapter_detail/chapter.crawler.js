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
const cheerio_1 = __importDefault(require("cheerio"));
const util_1 = require("../util");
class Crawler {
    chapterDetail(link) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = yield util_1.GET(link);
            const $ = cheerio_1.default.load(body);
            const content_left = $('div.content_left');
            const images = content_left.find('div.list_img > img')
                .toArray()
                .map(img => $(img).attr('src'));
            const chapters = content_left.find('div.next_prev_chapter > div.next_prev > select#list_chapters1 > option')
                .toArray()
                .map(option => {
                const $option = $(option);
                return {
                    chapter_name: $option.text(),
                    chapter_link: $option.attr('value'),
                };
            });
            const currentIndex = chapters.findIndex(chapter => chapter.chapter_link === link);
            const prev_chapter_link = (() => {
                const prev = chapters[currentIndex + 1];
                return prev ? prev.chapter_link : undefined;
            })();
            const next_chapter_link = (() => {
                const next = chapters[currentIndex - 1];
                return next ? next.chapter_link : undefined;
            })();
            const chapter_name = $('section#breadcrumb_custom li:last-child').text().trim();
            const comic_name = $($('section#breadcrumb_custom li').toArray()[2]).text().trim();
            return {
                images,
                prev_chapter_link,
                next_chapter_link,
                chapters,
                chapter_link: link,
                chapter_name,
                comic_name
            };
        });
    }
}
exports.Crawler = Crawler;
//# sourceMappingURL=chapter.crawler.js.map