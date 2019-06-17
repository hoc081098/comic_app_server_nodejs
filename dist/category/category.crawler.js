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
const firebase_admin_1 = __importDefault(require("firebase-admin"));
class Crawler {
    constructor() {
        this.ref = firebase_admin_1.default.database().ref('comic_app');
    }
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
                const images = yield this.fetchImagesIfNeeded(categories.map(c => c.link));
                resolve(categories.map((c) => (Object.assign({}, c, { thumbnail: images[c.link] }))));
            }));
        });
    }
    fetchImagesIfNeeded(links) {
        return __awaiter(this, void 0, void 0, function* () {
            // get data from firebase
            let images;
            let lastFetch;
            [images, lastFetch] = yield Promise.all(['images', 'last_fetch']
                .map(path => this.ref
                .child(path)
                .once('value')
                .then(snapshot => snapshot.val())));
            images = Object.keys(images).reduce((acc, k) => (Object.assign({}, acc, { [util_1.decode(k)]: images[k] })), {});
            util_1.log({ images, lastFetch });
            const haveNotImages = !images || links.some(link => !images[link] || !util_1.isValidURL(images[link]));
            util_1.log({ haveNotImages, time: lastFetch ? Date.now() - lastFetch : undefined });
            if (haveNotImages || !lastFetch) {
                // first time or invalid data, need await
                return yield this.getAndSaveImages(links);
            }
            else if (Date.now() - lastFetch >= Crawler.TIMEOUT) {
                // timeout
                // this is not the first time, not need await, data will be saved to firebase database for later
                // and current data is valid, just return
                this.getAndSaveImages(links);
                return images;
            }
            else {
                // have valid data, just return
                return images;
            }
        });
    }
    /**
     *
     * @param categoryLink category url
     */
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
    /**
    *
    * @param links category urls
    */
    getAndSaveImages(links) {
        return __awaiter(this, void 0, void 0, function* () {
            // get
            let images = {};
            for (const link of links) {
                util_1.log(`[START] fetch ${link}`);
                const data = yield this.getFirstImage(link);
                images = Object.assign({}, images, data);
            }
            // save
            const encodedImages = Object.keys(images).reduce((acc, k) => (Object.assign({}, acc, { [util_1.encode(k)]: images[k] })), {});
            yield Promise.all([
                this.ref.child('images').set(encodedImages),
                this.ref.child('last_fetch').set(Date.now()),
            ]);
            util_1.log('[DONE] fetch');
            return images;
        });
    }
}
Crawler.TIMEOUT = 60 * 60 * 1000; // 1 hour
exports.Crawler = Crawler;
//# sourceMappingURL=category.crawler.js.map