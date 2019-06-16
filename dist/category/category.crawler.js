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
const lowdb_1 = __importDefault(require("lowdb"));
const FileSync_1 = __importDefault(require("lowdb/adapters/FileSync"));
const util_1 = require("../util");
const adapter = new FileSync_1.default('../../db.json');
const db = lowdb_1.default(adapter);
// Set some defaults (required if your JSON file is empty)
db.defaults({ images: {}, last_fetch: undefined }).write();
class Crawler {
    allCategories() {
        return new Promise((resolve, reject) => {
            request_1.default.get('http://www.nettruyen.com/', (error, _response, body) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    reject(error);
                    return;
                }
                const $ = cheerio_1.default.load(body);
                const categories = $('nav.main-nav ul.dropdown-menu.megamenu div.col-sm-3 ul.nav li a')
                    .toArray()
                    .map(element => {
                    const $element = $(element);
                    return {
                        link: $element.attr('href'),
                        name: $element.attr('title') || $element.find('strong').text(),
                        description: $element.attr('data-title'),
                    };
                });
                let images = db.get('images').value();
                const lastFetch = db.get('last_fetch').value();
                console.log({ images, lastFetch });
                const links = categories.map(c => c.link);
                const haveNotImages = !images || links.some(link => !images[link]);
                util_1.log({ haveNotImages, time: lastFetch ? Date.now() - lastFetch : undefined });
                if (haveNotImages || !lastFetch || Date.now() - lastFetch >= Crawler.TIMEOUT) {
                    try {
                        util_1.log('Start fetch');
                        for (const link of links) {
                            util_1.log(`Fetch ${link}`);
                            const data = yield this.getFirstImage(link);
                            images = Object.assign({}, images, data);
                        }
                        db.set('images', images).write();
                        db.set('last_fetch', Date.now()).write();
                        util_1.log('Fetch done');
                    }
                    catch (e) {
                        util_1.log(`Fetch ${{ e }}`);
                        reject(e);
                        return;
                    }
                }
                resolve(categories.map((c) => (Object.assign({}, c, { thumbnail: images[c.link] }))));
            }));
        });
    }
    getFirstImage(categoryLink) {
        return new Promise((resolve, reject) => {
            request_1.default.get(categoryLink, (error, _response, body) => {
                if (error) {
                    reject(error);
                    return;
                }
                const $ = cheerio_1.default.load(body);
                const $e = $($('div#ctl00_divCenter').find('div.row div.item')[0]);
                const thumbnail = $e.children('figure').first().find('div > a > img').attr('data-original');
                resolve({ [categoryLink]: thumbnail });
            });
        });
    }
}
Crawler.TIMEOUT = 24 * 60 * 60 * 1000; // 1 day
exports.Crawler = Crawler;
//# sourceMappingURL=category.crawler.js.map