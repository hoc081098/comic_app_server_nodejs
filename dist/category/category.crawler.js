"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const cheerio_1 = __importDefault(require("cheerio"));
class Crawler {
    allCategories() {
        return new Promise((resolve, reject) => {
            request_1.default.get('http://www.nettruyen.com/', (error, _response, body) => {
                if (error) {
                    reject(error);
                    return;
                }
                const $ = cheerio_1.default.load(body);
                const categories = $('nav.main-nav ul.dropdown-menu.megamenu div.col-sm-3 ul.nav li a')
                    .toArray()
                    .map((element) => {
                    const $element = $(element);
                    return {
                        link: $element.attr('href'),
                        name: $element.attr('title') || $element.find('strong').text(),
                        description: $element.attr('data-title'),
                    };
                });
                resolve(categories);
            });
        });
    }
}
exports.Crawler = Crawler;
//# sourceMappingURL=category.crawler.js.map