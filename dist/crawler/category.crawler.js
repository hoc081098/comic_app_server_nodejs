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
class Crawler {
    theLoai() {
        return __awaiter(this, void 0, void 0, function* () {
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
                            desciption: $element.attr('data-title'),
                        };
                    });
                    resolve(categories);
                });
            });
        });
    }
}
exports.Crawler = Crawler;
//# sourceMappingURL=category.crawler.js.map