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
const request_1 = __importDefault(require("request"));
const cheerio_1 = __importDefault(require("cheerio"));
const util_1 = require("../util");
class Crawler {
    suggestComics() {
        return new Promise((resolve, reject) => {
            request_1.default.get('http://www.nettruyen.com/', (error, _response, body) => {
                if (error) {
                    reject(error);
                    return;
                }
                const $ = cheerio_1.default.load(body);
                const comics = $('div.top-comics').find('div.items-slide div.item')
                    .toArray()
                    .map((e) => {
                    const $e = $(e);
                    const slideCaptionAnchor = $e.find('div.slide-caption > a');
                    const slideCaptionH3Anchor = $e.find('div.slide-caption > h3 > a');
                    return {
                        thumbnail: $e.find('a > img.lazyOwl').first().attr('data-src'),
                        title: slideCaptionH3Anchor.text(),
                        last_chapter: {
                            chapter_name: slideCaptionAnchor.text(),
                            chapter_link: slideCaptionAnchor.attr('href'),
                            time: $e.find('div.slide-caption > span.time').text().trim(),
                        },
                        link: slideCaptionH3Anchor.attr('href'),
                    };
                });
                resolve(comics);
            });
        });
    }
    updatedComics(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = yield util_1.GET(`https://ww2.mangafox.online/page/${page}`);
            const $ = cheerio_1.default.load(body);
            return $('div.content_left > div.content_grid > ul > li.content_grid_item')
                .toArray()
                .map((liComic) => {
                const $liComic = $(liComic);
                const title = $liComic.find('div.content_grid_item_name > a').text();
                const contentGridItemImg = $liComic.find('div.content_grid_item_img');
                const view = contentGridItemImg.find('div.view').text().trim();
                const link = contentGridItemImg.find('a').attr('href');
                const thumbnail = contentGridItemImg.find('a > img').first().attr('src');
                const last_chapters = $liComic.find('div.content_grid_item_chapter > ul > li')
                    .toArray()
                    .map(liChapter => {
                    const $liChapter = $(liChapter);
                    const chapter_name = $liChapter.find('a').text();
                    const chapter_link = $liChapter.find('a').attr('href');
                    const time = $liChapter.find('i').text();
                    return {
                        chapter_name,
                        chapter_link,
                        time,
                    };
                });
                return {
                    title,
                    view,
                    link,
                    thumbnail,
                    last_chapters,
                };
            });
        });
    }
    topMonthComics() {
        return new Promise((resolve, reject) => {
            request_1.default.get(`http://www.nettruyen.com`, (error, _response, body) => {
                if (error) {
                    reject(error);
                    return;
                }
                const $ = cheerio_1.default.load(body);
                const comics = $('div#topMonth')
                    .find('li.clearfix')
                    .toArray()
                    .map((e) => {
                    const $e = $(e);
                    const view = (() => {
                        let html = $e.find('div.t-item > p.chapter > span').html();
                        if (!html) {
                            return;
                        }
                        html = html.replace(/\s{2,}/g, ' ').trim();
                        return (/((\d{1,3})(\.)?)+/g.exec(html) || [undefined])[0];
                    })();
                    return {
                        thumbnail: $e.find('div.t-item > a > img').attr('data-original'),
                        title: $e.find('div.t-item > h3 > a').text(),
                        last_chapter: {
                            chapter_name: $e.find('div.t-item > p.chapter > a').attr('title'),
                            chapter_link: $e.find('div.t-item > p.chapter > a').attr('href'),
                        },
                        link: $e.find('div.t-item > a').attr('href'),
                        view: view
                    };
                });
                resolve(comics);
            });
        });
    }
}
exports.Crawler = Crawler;
//# sourceMappingURL=index.crawler.js.map