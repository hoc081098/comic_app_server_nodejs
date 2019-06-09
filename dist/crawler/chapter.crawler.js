"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const cheerio_1 = __importDefault(require("cheerio"));
class Crawler {
    static chiTietChuong(link) {
        return new Promise((resolve, reject) => {
            request_1.default.get(link, (error, response, body) => {
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
                let pageChaptersOrHtml = detail.children('.page-chapter')
                    .toArray()
                    .map(page => $(page).children('img').attr('data-original'));
                if (pageChaptersOrHtml.length === 0) {
                    pageChaptersOrHtml = detail.find('.content-words').html();
                    pageChaptersOrHtml = pageChaptersOrHtml === null ? null : escapeHTML(pageChaptersOrHtml);
                }
                if (!pageChaptersOrHtml) {
                    pageChaptersOrHtml = undefined;
                }
                resolve({
                    chapter_link: link,
                    chapter_name: chapterName,
                    content: pageChaptersOrHtml,
                    time: lastUpdated,
                });
            });
        });
    }
}
exports.Crawler = Crawler;
function escapeHTML(s) {
    return s.replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '');
}
//# sourceMappingURL=chapter.crawler.js.map