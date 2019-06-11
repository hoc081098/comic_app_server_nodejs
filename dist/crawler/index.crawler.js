"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const cheerio_1 = __importDefault(require("cheerio"));
class Crawler {
    truyenDeCu() {
        return new Promise((resolve, reject) => {
            const comics = [];
            request_1.default.get('http://www.nettruyen.com/', (error, _response, body) => {
                if (error) {
                    reject(error);
                    return;
                }
                const $ = cheerio_1.default.load(body);
                $('div.top-comics').find('div.items-slide div.item').each((_i, e) => {
                    const $e = $(e);
                    const slideCaptionAnchor = $e.find('div.slide-caption > a');
                    const slideCaptionH3Anchor = $e.find('div.slide-caption > h3 > a');
                    comics.push({
                        thumbnail: $e.find('a > img.lazyOwl').first().attr('data-src'),
                        title: slideCaptionH3Anchor.text(),
                        chapters: [
                            {
                                chapter_name: slideCaptionAnchor.text(),
                                chapter_link: slideCaptionAnchor.attr('href'),
                                time: $e.find('div.slide-caption > span.time').text().trim(),
                            }
                        ],
                        link: slideCaptionH3Anchor.attr('href'),
                    });
                });
                resolve(comics);
            });
        });
    }
    truyenMoiCapNhat(page) {
        return new Promise((resolve, reject) => {
            const comics = [];
            request_1.default.get(`http://www.nettruyen.com/?page=${page}`, (error, _response, body) => {
                if (error) {
                    reject(error);
                    return;
                }
                const $ = cheerio_1.default.load(body);
                $('div#ctl00_divCenter').find('div.row div.item').each((_i, e) => {
                    const $e = $(e);
                    const figure = $e.children('figure').first();
                    const chapters = $e.find('figcaption > ul > li').toArray().map((li) => {
                        const $li = $(li);
                        const a = $li.children('a').first();
                        return {
                            chapter_name: a.text(),
                            chapter_link: a.attr('href'),
                            time: $li.children('i.time').first().text(),
                        };
                    });
                    const view = (function () {
                        let html = figure.find('div > div.view > span').html();
                        if (!html) {
                            return;
                        }
                        html = html.replace(/\s{2,}/g, ' ').trim();
                        return (/((\d{1,3})(\.)?)+/g.exec(html) || [undefined])[0];
                    })();
                    comics.push({
                        thumbnail: figure.find('div > a > img').attr('data-original'),
                        title: $e.find('figcaption > h3 > a').text(),
                        chapters: chapters,
                        link: figure.find('div > a').attr('href'),
                        view: view,
                    });
                });
                resolve(comics);
            });
        });
    }
    topThang() {
        return new Promise((resolve, reject) => {
            const comics = [];
            request_1.default.get(`http://www.nettruyen.com`, (error, _response, body) => {
                if (error) {
                    reject(error);
                    return;
                }
                const $ = cheerio_1.default.load(body);
                $('div#topMonth').find('li.clearfix').each((_i, e) => {
                    const $e = $(e);
                    const view = (function () {
                        let html = $e.find('div.t-item > p.chapter > span').html();
                        if (!html) {
                            return;
                        }
                        html = html.replace(/\s{2,}/g, ' ').trim();
                        return (/((\d{1,3})(\.)?)+/g.exec(html) || [undefined])[0];
                    })();
                    comics.push({
                        thumbnail: $e.find('div.t-item > a > img').attr('data-original'),
                        title: $e.find('div.t-item > h3 > a').text(),
                        chapters: [
                            {
                                chapter_name: $e.find('div.t-item > p.chapter > a').attr('title'),
                                chapter_link: $e.find('div.t-item > p.chapter > a').attr('href'),
                            }
                        ],
                        link: $e.find('div.t-item > a').attr('href'),
                        view: view,
                    });
                });
                resolve(comics);
            });
        });
    }
}
exports.Crawler = Crawler;
//# sourceMappingURL=index.crawler.js.map