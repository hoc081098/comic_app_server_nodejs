"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyToComicListNew = exports.bodyToComicList = exports.GET = exports.decode = exports.encode = exports.escapeHTML = exports.log = exports.isValidURL = void 0;
const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
console.log(`NODEJS running: env = '${env}'`);
if (env === 'development') {
    process.env['DEBUG'] = 'comic-app-server:server';
}
const debug_1 = __importDefault(require("debug"));
const request_1 = __importDefault(require("request"));
const cheerio_1 = __importDefault(require("cheerio"));
const log = debug_1.default('comic-app-server:server');
exports.log = log;
/**
 *
 */
function isValidURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return pattern.test(str);
}
exports.isValidURL = isValidURL;
function escapeHTML(s) {
    return s.replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '');
}
exports.escapeHTML = escapeHTML;
/**
 *
 */
const escapeRegExp = (str) => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
const chars = '.$[]#/%'.split('');
const charCodes = chars.map((c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
const charToCode = {};
const codeToChar = {};
chars.forEach((c, i) => {
    charToCode[c] = charCodes[i];
    codeToChar[charCodes[i]] = c;
});
const charsRegex = new RegExp(`[${escapeRegExp(chars.join(''))}]`, 'g');
const charCodesRegex = new RegExp(charCodes.join('|'), 'g');
const encode = (str) => str.replace(charsRegex, (match) => charToCode[match]);
exports.encode = encode;
const decode = (str) => str.replace(charCodesRegex, (match) => codeToChar[match]);
exports.decode = decode;
/**
 * GET body from url
 * @param url string
 * @returns a Promise resolve body response
 */
function GET(url) {
    return new Promise((resolve, reject) => {
        request_1.default.get(url, { timeout: 15000 }, (error, _response, body) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(body);
        });
    });
}
exports.GET = GET;
/**
 * Parse body to list of comics
 * @param body string
 * @return a list of comics
 * @deprecated
 */
function bodyToComicList(body) {
    const $ = cheerio_1.default.load(body);
    return $('div.content_left div.content_grid > ul > li.content_grid_item')
        .toArray()
        .map((liComic) => {
        const $liComic = $(liComic);
        const title = $liComic.find('div.content_grid_item_name > a').text();
        const contentGridItemImg = $liComic.find('div.content_grid_item_img');
        const view = contentGridItemImg.find('div.view').text().trim();
        const link = contentGridItemImg.find('a').attr('href');
        const thumbnail = contentGridItemImg.find('a > img').first().attr('src');
        const last_chapters = $liComic.find('div.content_grid_item_chapter > ul > li')
            .toArray()
            .map(liChapter => {
            const $liChapter = $(liChapter);
            const chapter_name = $liChapter.find('a').text();
            const chapter_link = $liChapter.find('a').attr('href');
            const time = $liChapter.find('i').text();
            return {
                chapter_name,
                chapter_link,
                time,
            };
        });
        return {
            title,
            view,
            link,
            thumbnail,
            last_chapters,
        };
    });
}
exports.bodyToComicList = bodyToComicList;
function bodyToComicListNew(body) {
    const $ = cheerio_1.default.load(body);
    return $('div.panel-content-genres > div.content-genres-item')
        .toArray()
        .map((divComic) => {
        const $divComic = $(divComic);
        const $genres_item_info = $divComic.find('div.genres-item-info');
        const a = $genres_item_info.find('h3 > a');
        const $genres_item_chap = $genres_item_info.find('a.genres-item-chap');
        const chapter_link = $genres_item_chap.attr('href');
        const chapter_name = $genres_item_chap.text();
        return {
            last_chapters: chapter_link && chapter_name
                ? [
                    {
                        chapter_name,
                        chapter_link,
                        time: $genres_item_info.find('span.genres-item-time').text(),
                    },
                ]
                : [],
            link: a.attr('href'),
            thumbnail: $divComic.find('img').attr('src'),
            title: a.text(),
            view: $genres_item_info.find('span.genres-item-view').text(),
        };
    });
}
exports.bodyToComicListNew = bodyToComicListNew;
//# sourceMappingURL=util.js.map