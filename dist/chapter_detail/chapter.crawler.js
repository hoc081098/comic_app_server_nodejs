"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const cheerio_1 = __importDefault(require("cheerio"));
const util_1 = require("../util");
class Crawler {
    chapterDetail(link) {
        return new Promise((resolve, reject) => {
            request_1.default.get(link, (error, _response, body) => {
                if (error) {
                    reject(error);
                    return;
                }
                const $ = cheerio_1.default.load(body);
                const divCenter = $('div#ctl00_divCenter');
                const chapterName = divCenter.find('h1.txt-primary > span').text().replace(/[- ]+/, '').trim();
                let lastUpdated = divCenter.find('div.container > div.top > i').text();
                lastUpdated = lastUpdated.substring(lastUpdated.indexOf(':') + 1, lastUpdated.length - 1).trim();
                const detail = divCenter.find('.reading-detail.box_doc');
                const images = detail.children('.page-chapter')
                    .toArray()
                    .map(page => $(page).children('img').attr('data-original'));
                let htmlContent;
                if (images.length === 0) {
                    htmlContent = detail.find('.content-words').html();
                    if (htmlContent)
                        htmlContent = util_1.escapeHTML(htmlContent);
                }
                if (htmlContent === null)
                    htmlContent = undefined;
                const chapterDetail = {
                    chapter_link: link,
                    chapter_name: chapterName,
                    images: images,
                    html_content: htmlContent,
                    time: lastUpdated,
                };
                resolve(chapterDetail);
            });
        });
    }
}
exports.Crawler = Crawler;
//# sourceMappingURL=chapter.crawler.js.map