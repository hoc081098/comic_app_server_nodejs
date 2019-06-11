"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const cheerio_1 = __importDefault(require("cheerio"));
class Crawler {
    static timTruyen(query) {
        const link = `http://www.nettruyen.com/Comic/Services/SuggestSearch.ashx?q=${query}`;
        return new Promise((resolve, reject) => {
            request_1.default.get(link, (error, _response, body) => {
                if (error) {
                    reject(error);
                    return;
                }
                const $ = cheerio_1.default.load(body);
                const comics = $('li').toArray().map((li) => {
                    const $li = $(li);
                    return {
                        title: $li.find('h3').text(),
                        thumbnail: $li.find('img').attr('src'),
                        link: $li.find('a').attr('href'),
                        chapters: [
                            {
                                chapter_name: $li.find('h4 > i').first().text(),
                                chapter_link: '',
                            },
                        ],
                    };
                });
                resolve(comics);
            });
        });
    }
}
exports.Crawler = Crawler;
//# sourceMappingURL=search.crawler.js.map