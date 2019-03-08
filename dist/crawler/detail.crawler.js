"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const cheerio_1 = __importDefault(require("cheerio"));
class Crawler {
    static chiTietTruyen(link) {
        return new Promise((resolve, reject) => {
            request_1.default.get(link, (error, response, body) => {
                if (error)
                    return reject(error);
                let $ = cheerio_1.default.load(body);
                // TODO
                let itemDetail = $('div#ctl00_divCenter #item-detail');
                let detailInfo = $('div.detail-info');
                let title = itemDetail.find('.title-detail').text();
                let updatedAt = itemDetail.find('time.small').text();
                updatedAt = updatedAt.substring(updatedAt.indexOf(':') + 1, updatedAt.lastIndexOf(']')).trim();
                let listInfo = itemDetail.find('ul.list-info');
                let authorLi = listInfo.children('li.author');
                let statusLi = listInfo.children('li.status');
                let kindLi = listInfo.children('li.kind');
                let viewLi = listInfo.children('li:last-child');
                let othernameLi = listInfo.children('li.othername');
                let categories = kindLi.find('p > a')
                    .toArray()
                    .map((e) => {
                    let $e = $(e);
                    return {
                        link: $e.attr('href'),
                        name: $e.text(),
                    };
                });
                let othername = othernameLi.children('h2').text();
                if (othername.length === 0)
                    othername = undefined;
                let detailContent = $('div.detail-content');
                let shortened = detailContent.find('p').first();
                let listChapters = $('div#nt_listchapter > nav > ul > li');
                let chapters = listChapters.toArray().map((e) => {
                    let $e = $(e);
                    let a = $e.find('a');
                    return {
                        chapter_link: a.attr('href'),
                        chapter_name: a.text(),
                        time: $e.find('div.col-xs-4').text(),
                        view: $e.find('div.col-xs-3').text()
                    };
                }).slice(1);
                resolve({
                    thumbnail: detailInfo.find('img').attr('src'),
                    title: title,
                    chapters: chapters,
                    link: link,
                    view: viewLi.children('p').last().text(),
                    more_detail: {
                        last_updated: updatedAt,
                        author: authorLi.children('p').last().text(),
                        status: statusLi.children('p').last().text(),
                        categories: categories,
                        othername: othername,
                        shortened_content: shortened.text(),
                    }
                });
            });
        });
    }
}
exports.Crawler = Crawler;
//# sourceMappingURL=detail.crawler.js.map