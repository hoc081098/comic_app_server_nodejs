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
const cheerio_1 = __importDefault(require("cheerio"));
const util_1 = require("../util");
class Crawler {
    chapterDetail(link) {
        return __awaiter(this, void 0, void 0, function* () {
            const $ = cheerio_1.default.load(yield util_1.GET(link));
            const divCenter = $('div#ctl00_divCenter');
            const chapterName = divCenter.find('h1.txt-primary > span').text().replace(/[- ]+/, '').trim();
            let lastUpdated = divCenter.find('div.container > div.top > i').text();
            lastUpdated = lastUpdated.substring(lastUpdated.indexOf(':') + 1, lastUpdated.length - 1).trim();
            const detail = divCenter.find('.reading-detail.box_doc');
            const images = detail.children('.page-chapter')
                .toArray()
                .map(page => $(page).children('img').attr('data-original'));
            let htmlContent;
            if (images.length === 0) {
                htmlContent = detail.find('.content-words').html();
                if (htmlContent)
                    htmlContent = util_1.escapeHTML(htmlContent);
            }
            if (htmlContent === null)
                htmlContent = undefined;
            const chapterId = (() => {
                const array = link.split('/');
                return +array[array.length - 1];
            })();
            const body = yield util_1.GET(`http://www.nettruyen.com/Comic/Services/ComicService.asmx/ProcessChapterLoader?chapterId=${chapterId}&commentId=0`);
            const allChapters = JSON.parse(body)
                .chapters
                .map((c) => {
                return Object.assign({}, c, { url: `http://www.nettruyen.com${c.url}` });
            });
            const indexOfCurrentChapter = allChapters.findIndex(c => c.chapterId === chapterId);
            const prevChapterLink = (() => {
                const prevChapter = allChapters[indexOfCurrentChapter + 1];
                return prevChapter ? prevChapter.url : undefined;
            })();
            const nextChapterLink = (() => {
                const nextChapter = allChapters[indexOfCurrentChapter - 1];
                return nextChapter ? nextChapter.url : undefined;
            })();
            const chapterDetail = {
                chapter_link: link,
                chapter_name: chapterName,
                images: images.map(image => {
                    if (image.startsWith('//proxy.truyen.cloud')) {
                        const url = image.substring(image.indexOf('?') + 1).split('&')[0];
                        return url.substring(url.indexOf('=') + 1);
                    }
                    else {
                        return image;
                    }
                }),
                html_content: htmlContent,
                time: lastUpdated,
                prev_chapter_link: prevChapterLink,
                next_chapter_link: nextChapterLink,
                chapters: allChapters.map(c => {
                    return {
                        chapter_name: c.name,
                        chapter_link: c.url
                    };
                }),
            };
            return chapterDetail;
        });
    }
}
exports.Crawler = Crawler;
//# sourceMappingURL=chapter.crawler.js.map