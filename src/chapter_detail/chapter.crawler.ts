import request, { Response } from 'request';
import cheerio from 'cheerio';
import { ChapterDetail } from "./chapter_detail.interface";
import { escapeHTML } from "../util";

export class Crawler {
  chapterDetail(link: string): Promise<ChapterDetail> {
    return new Promise((resolve, reject) => {
      request.get(link, (error: any, _response: Response, body: any): void => {
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
        const images: string[] = detail.children('.page-chapter')
          .toArray()
          .map(page => $(page).children('img').attr('data-original'));

        let htmlContent: string | null | undefined;
        if (images.length === 0) {
          htmlContent = detail.find('.content-words').html();
          if (htmlContent) htmlContent = escapeHTML(htmlContent);
        }
        if (htmlContent === null) htmlContent = undefined;

        const chapterDetail: ChapterDetail = {
          chapter_link: link,
          chapter_name: chapterName,
          images: images,
          htmlContent: htmlContent,
          time: lastUpdated,
        };
        resolve(chapterDetail);
      });
    });
  }
}
