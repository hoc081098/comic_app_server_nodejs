import { Chapter } from "../models/chapter";
import request, { Response } from 'request';
import cheerio from 'cheerio';

export class Crawler {
  static chiTietChuong(link: string): Promise<Chapter> {
    return new Promise((resolve, reject) => {
      request.get(link, (error: any, response: Response, body: any): void => {
        if (error) {
          reject(error);
          return;
        }

        const $: CheerioStatic = cheerio.load(body);

        const divCenter = $('div#ctl00_divCenter');
        const chapterName = divCenter.find('h1.txt-primary > span').text().replace(/[- ]+/, '').trim();
        let lastUpdated = divCenter.find('div.container > div.top > i').text();
        lastUpdated = lastUpdated.substring(lastUpdated.indexOf(':') + 1, lastUpdated.length - 1).trim();

        const detail = divCenter.find('.reading-detail.box_doc');
        let pageChaptersOrHtml: string | string[] | undefined | null = detail.children('.page-chapter')
          .toArray()
          .map(page => $(page).children('img').attr('data-original'));

        if (pageChaptersOrHtml.length === 0) {
          pageChaptersOrHtml = detail.find('.content-words').html();
          pageChaptersOrHtml = pageChaptersOrHtml === null ? null : escapeHTML(pageChaptersOrHtml);
        }
        if (!pageChaptersOrHtml) {
          pageChaptersOrHtml = undefined;
        }

        resolve({
          chapter_link: link,
          chapter_name: chapterName,
          content: pageChaptersOrHtml,
          time: lastUpdated,
        });
      });
    });
  }
}

function escapeHTML(s: string) {
  return s.replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '');
}