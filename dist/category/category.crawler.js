"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(require("cheerio"));
const util_1 = require("../util");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const category_descriptions_1 = __importDefault(require("./category_descriptions"));
class Crawler {
    constructor() { this.ref = firebase_admin_1.default.database().ref('comic_app'); }
    async allCategories() {
        const body = await util_1.GET('https://ww2.mangafox.online/');
        const categories = this.getCategories(body);
        const images = await this.fetchImagesIfNeeded(categories.map(c => c.link));
        return categories.map((c) => {
            const link = c.link;
            return Object.assign({}, c, { thumbnail: images[link], description: category_descriptions_1.default[link] });
        });
    }
    getCategories(body) {
        const $ = cheerio_1.default.load(body);
        const categories = $('div.content_right > div.danhmuc > table > tbody > tr > td')
            .toArray()
            .map(td => {
            const $td = $(td);
            return {
                link: $td.find('a').attr('href'),
                name: $td.find('a').text().trim(),
            };
        });
        return categories.slice(0, categories.length - 1);
    }
    async fetchImagesIfNeeded(links) {
        // get data from firebase
        let images;
        let lastFetch;
        [images, lastFetch] = await Promise.all(['images', 'last_fetch']
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
            return await this.getAndSaveImages(links);
        }
        else if (Date.now() - lastFetch >= Crawler.TIMEOUT) {
            // timeout
            // this is not the first time, not need await, data will be saved to firebase database for later
            // and current data is valid, just return
            // tslint:disable-next-line: no-floating-promises
            // noinspection JSIgnoredPromiseFromCall
            // tslint:disable-next-line: no-floating-promises
            this.getAndSaveImages(links);
            return images;
        }
        else {
            // have valid data, just return
            return images;
        }
    }
    /**
     *
     * @param categoryLink category url
     */
    static async getFirstImage(categoryLink) {
        const body = await util_1.GET(categoryLink);
        const thumbnail = util_1.bodyToComicList(body)[0].thumbnail;
        util_1.log(`[END  ] fetch ${thumbnail}`);
        return { [categoryLink]: thumbnail };
    }
    /**
     *
     * @param links category urls
     */
    async getAndSaveImages(links) {
        // get
        let images = {};
        for (const link of links) {
            util_1.log(`[START] fetch ${link}`);
            const data = await Crawler.getFirstImage(link);
            images = Object.assign({}, images, data);
        }
        // save
        const encodedImages = Object.keys(images).reduce((acc, k) => (Object.assign({}, acc, { [util_1.encode(k)]: images[k] })), {});
        await Promise.all([
            this.ref.child('images').set(encodedImages),
            this.ref.child('last_fetch').set(Date.now()),
        ]);
        util_1.log('[DONE] fetch');
        return images;
    }
}
Crawler.TIMEOUT = 60 * 60 * 1000; // 1 hour
exports.Crawler = Crawler;
//# sourceMappingURL=category.crawler.js.map