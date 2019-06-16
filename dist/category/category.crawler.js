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
const serviceAccountKey_json_1 = __importDefault(require("../serviceAccountKey.json"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccountKey_json_1.default),
    databaseURL: "https://doanlthtvdk.firebaseio.com"
});
const ref = firebase_admin_1.default.database().ref('comic_app');
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
                const readPromises = ['images', 'last_fetch'].map(path => ref.child(path).once('value').then(snapshot => snapshot.val()));
                let images;
                let lastFetch;
                [images, lastFetch] = yield Promise.all(readPromises);
                console.log({ images, lastFetch });
                const links = categories.map(c => c.link);
                const haveNotImages = !images || links.some(link => !images[util_1.encode(link)]);
                util_1.log({ haveNotImages, time: lastFetch ? Date.now() - lastFetch : undefined });
                if (haveNotImages || !lastFetch || Date.now() - lastFetch >= Crawler.TIMEOUT) {
                    try {
                        util_1.log('Start fetch');
                        for (const link of links) {
                            util_1.log(`Fetch ${link}`);
                            const data = yield this.getFirstImage(link);
                            images = Object.assign({}, images, data);
                        }
                        const encodedImages = Object.keys(images).reduce((acc, k) => (Object.assign({}, acc, { [util_1.encode(k)]: images[k] })), {});
                        yield Promise.all([
                            ref.child('images').set(encodedImages),
                            ref.child('last_fetch').set(Date.now()),
                        ]);
                        util_1.log('Fetch done');
                    }
                    catch (e) {
                        util_1.log(`Fetch error=${{ e }}`);
                        reject(e);
                        return;
                    }
                }
                else {
                    images = Object.keys(images).reduce((acc, k) => (Object.assign({}, acc, { [util_1.decode(k)]: images[k] })), {});
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