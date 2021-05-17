import { Comic } from "./models/comic.interface";

const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
console.log(`NODEJS running: env = '${env}'`);

if (env === 'development') {
  process.env['DEBUG'] = 'comic-app-server:server';
}

import debug from 'debug';
import request, { Response } from 'request';
import cheerio from "cheerio";

const log = debug('comic-app-server:server');

/**
 *
 */

function isValidURL(str: string): boolean {
  const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return pattern.test(str);
}

function escapeHTML(s: string) {
  return s.replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '');
}

/**
 *
 */

const escapeRegExp = (str: string) => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
const chars = '.$[]#/%'.split('');
const charCodes = chars.map((c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
const charToCode: { [key: string]: string } = {};
const codeToChar: { [key: string]: string } = {};
chars.forEach((c, i) => {
  charToCode[c] = charCodes[i];
  codeToChar[charCodes[i]] = c;
});
const charsRegex = new RegExp(`[${escapeRegExp(chars.join(''))}]`, 'g');
const charCodesRegex = new RegExp(charCodes.join('|'), 'g');

const encode = (str: string) => str.replace(charsRegex, (match) => charToCode[match]);
const decode = (str: string) => str.replace(charCodesRegex, (match) => codeToChar[match]);

/**
 * GET body from url
 * @param url string
 * @returns a Promise resolve body response
 */
function GET(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    request.get(
      url,
      { timeout: 15_000 },
      (error: any, _response: Response, body: any): void => {
        if (error) {
          reject(error);
          return;
        }
        resolve(body);
      },
    );
  });
}

/**
 * Parse body to list of comics
 * @param body string
 * @return a list of comics
 */
function bodyToComicList(body: string): Comic[] {
  const $ = cheerio.load(body);

  return $('div.content_left div.content_grid > ul > li.content_grid_item')
    .toArray()
    .map((liComic): Comic => {
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

function bodyToComicListNew(body: string): any[] {
  const $: CheerioStatic = cheerio.load(body);

  return $('div.panel-content-genres > div.content-genres-item')
    .toArray()
    .map((divComic: CheerioElement): Comic => {
      const $divComic: Cheerio = $(divComic);
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

export { isValidURL, log, escapeHTML, encode, decode, GET, bodyToComicList, bodyToComicListNew };