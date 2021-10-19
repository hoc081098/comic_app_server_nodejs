"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crawler = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const util_1 = require("../util");
class Crawler {
    async comicDetailNew(link) {
        const body = await util_1.GET(link);
        const $ = cheerio_1.default.load(body);
        const content_left = $('div.container-main-left');
        const panel_story_info = content_left.find('div.panel-story-info');
        const story_info_left = panel_story_info.find('div.story-info-left');
        const story_info_right = panel_story_info.find('div.story-info-right');
        const thumbnail = story_info_left.find('img').attr('src');
        const title = story_info_right.find('h1').first().text().trim();
        let authors = null;
        let categories = null;
        let status = null;
        let alternative = null;
        story_info_right.find('table.variations-tableInfo > tbody > tr').toArray().forEach((tr) => {
            const $tr = $(tr);
            const table_value = $tr.find('td.table-value');
            switch ($tr.find('td.table-label').text()) {
                case 'Alternative :':
                    alternative = table_value.find('h2').text();
                    break;
                case 'Author(s) :':
                    authors = table_value.find('a').toArray().map((a) => {
                        const $a = $(a);
                        return {
                            name: $a.text(),
                            link: $a.attr('href'),
                        };
                    });
                    break;
                case 'Status :':
                    status = table_value.text();
                    break;
                case 'Genres :':
                    categories = table_value.find('a').toArray().map((a) => {
                        const $a = $(a);
                        return {
                            name: $a.text(),
                            link: $a.attr('href'),
                        };
                    });
            }
        });
        let last_updated = null;
        let view = null;
        story_info_right.find('div.story-info-right-extent > p').toArray().forEach((p) => {
            const $p = $(p);
            const stre_value = $p.find('span.stre-value');
            switch ($p.find('span.stre-label').text()) {
                case 'Updated :':
                    last_updated = stre_value.text();
                    break;
                case 'View :':
                    view = stre_value.text();
                    break;
            }
        });
        const panel_story_info_description = panel_story_info.find('div.panel-story-info-description').text();
        const shortened_content = panel_story_info_description.substring(panel_story_info_description.indexOf(":") + 2);
        const chapters = content_left.find('div.panel-story-chapter-list > ul.row-content-chapter > li')
            .toArray()
            .map((li) => {
            const $li = $(li);
            const a = $li.find('a');
            return {
                chapter_name: a.text().trim(),
                chapter_link: a.attr('href'),
                view: $li.find('span.chapter-view').text().trim(),
                time: $li.find('span.chapter-time').text().trim(),
            };
        });
        return {
            authors: authors !== null && authors !== void 0 ? authors : [],
            categories: categories !== null && categories !== void 0 ? categories : [],
            last_updated: last_updated !== null && last_updated !== void 0 ? last_updated : '',
            chapters,
            related_comics: [],
            link,
            shortened_content,
            thumbnail,
            title,
            view: view !== null && view !== void 0 ? view : '',
            status,
            alternative,
        };
    }
}
exports.Crawler = Crawler;
//# sourceMappingURL=detail.crawler.js.map