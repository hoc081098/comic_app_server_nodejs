import { Comic } from "../models/comic";
import { Chapter } from "../models/chapter";
import request, { Response } from 'request';
import cheerio from 'cheerio';
export class Crawler {

  static truyenDeCu(): Promise<Comic[]> {
    return new Promise((resolve, reject) => {
      const comics: Comic[] = [];

      request.get('http://www.nettruyen.com/', (error: any, _response: Response, body: any) => {
        if (error) {
          reject(error);
          return;
        }

        const $: CheerioStatic = cheerio.load(body);
        $('div.top-comics').find('div.items-slide div.item').each((_i: number, e: CheerioElement) => {
          const $e: Cheerio = $(e);
          const slideCaptionAnchor = $e.find('div.slide-caption > a');
          const slideCaptionH3Anchor = $e.find('div.slide-caption > h3 > a');

          comics.push({
            thumbnail: $e.find('a > img.lazyOwl').first().attr('data-src'),
            title: slideCaptionH3Anchor.text(),
            chapters: [
              {
                chapter_name: slideCaptionAnchor.text(),
                chapter_link: slideCaptionAnchor.attr('href'),
                time: $e.find('div.slide-caption > span.time').text().trim(),
              }
            ],
            link: slideCaptionH3Anchor.attr('href'),
          });
        });

        resolve(comics);
      });
    });
  }

  static truyenMoiCapNhat(page: number): Promise<Comic[]> {
    return new Promise((resolve, reject) => {
      const comics: Comic[] = [];

      request.get(`http://www.nettruyen.com/?page=${page}`, (error: any, _response: Response, body: any) => {
        if (error) {
          reject(error);
          return;
        }

        const $: CheerioStatic = cheerio.load(body);
        $('div#ctl00_divCenter').find('div.row div.item').each((_i: number, e: CheerioElement) => {
          const $e: Cheerio = $(e);
          const figure = $e.children('figure').first();

          const chapters: Chapter[] = $e.find('figcaption > ul > li').toArray().map((li: CheerioElement) => {
            const $li: Cheerio = $(li);
            const a: Cheerio = $li.children('a').first();

            return <Chapter>{
              chapter_name: a.text(),
              chapter_link: a.attr('href'),
              time: $li.children('i.time').first().text(),
            };
          });

          const view = (function (): string | undefined {
            let html = figure.find('div > div.view > span').html();
            if (!html) {
              return;
            }
            html = html.replace(/\s{2,}/g, ' ').trim();
            return (/((\d{1,3})(\.)?)+/g.exec(html) || [undefined])[0];
          })();

          comics.push({
            thumbnail: figure.find('div > a > img').attr('data-original'),
            title: $e.find('figcaption > h3 > a').text(),
            chapters: chapters,
            link: figure.find('div > a').attr('href'),
            view: view,
          });
        });

        resolve(comics);
      });
    });
  }

  static topThang(): Promise<Comic[]> {
    return new Promise((resolve, reject) => {
      const comics: Comic[] = [];

      request.get(`http://www.nettruyen.com`, (error: any, _response: Response, body: any) => {
        if (error) {
          reject(error);
          return;
        }

        const $: CheerioStatic = cheerio.load(body);
        $('div#topMonth').find('li.clearfix').each((_i: number, e: CheerioElement) => {
          const $e: Cheerio = $(e);

          const view = (function (): string | undefined {
            let html = $e.find('div.t-item > p.chapter > span').html();
            if (!html) {
              return;
            }
            html = html.replace(/\s{2,}/g, ' ').trim();
            return (/((\d{1,3})(\.)?)+/g.exec(html) || [undefined])[0];
          })();

          comics.push({
            thumbnail: $e.find('div.t-item > a > img').attr('data-original'),
            title: $e.find('div.t-item > h3 > a').text(),
            chapters: [
              {
                chapter_name: $e.find('div.t-item > p.chapter > a').attr('title'),
                chapter_link: $e.find('div.t-item > p.chapter > a').attr('href'),
              }
            ],
            link: $e.find('div.t-item > a').attr('href'),
            view: view,
          });
        });
        resolve(comics);
      });
    });
  }
}