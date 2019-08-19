import request, { Response } from 'request';
import cheerio from 'cheerio';
import { SuggestComic } from "./interface/suggest_comic.interface";
import { UpdatedComic } from "./interface/updated_comic.interface";
import { TopMonthComic } from "./interface/top_month_comic.interface";
import { GET } from "../util";

export class Crawler {

  suggestComics(): Promise<SuggestComic[]> {
    return new Promise((resolve, reject) => {
      request.get('http://www.nettruyen.com/', (error: any, _response: Response, body: any) => {
        if (error) {
          reject(error);
          return;
        }

        const $: CheerioStatic = cheerio.load(body);
        const comics = $('div.top-comics').find('div.items-slide div.item')
          .toArray()
          .map((e: CheerioElement): SuggestComic => {
            const $e: Cheerio = $(e);
            const slideCaptionAnchor = $e.find('div.slide-caption > a');
            const slideCaptionH3Anchor = $e.find('div.slide-caption > h3 > a');

            return {
              thumbnail: $e.find('a > img.lazyOwl').first().attr('data-src'),
              title: slideCaptionH3Anchor.text(),
              last_chapter: {
                chapter_name: slideCaptionAnchor.text(),
                chapter_link: slideCaptionAnchor.attr('href'),
                time: $e.find('div.slide-caption > span.time').text().trim(),
              },
              link: slideCaptionH3Anchor.attr('href'),
            };
          });

        resolve(comics);
      });
    });
  }

  async updatedComics(page: number): Promise<UpdatedComic[]> {
    const body = await GET(`https://ww2.mangafox.online/page/${page}`);

    const $ = cheerio.load(body);

    return $('div.content_left > div.content_grid > ul > li.content_grid_item')
      .toArray()
      .map((liComic): UpdatedComic => {
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

  topMonthComics(): Promise<TopMonthComic[]> {
    return new Promise((resolve, reject) => {
      request.get(`http://www.nettruyen.com`, (error: any, _response: Response, body: any) => {
        if (error) {
          reject(error);
          return;
        }

        const $: CheerioStatic = cheerio.load(body);

        const comics = $('div#topMonth')
          .find('li.clearfix')
          .toArray()
          .map((e: CheerioElement): TopMonthComic => {
            const $e: Cheerio = $(e);

            const view = ((): string | undefined => {
              let html = $e.find('div.t-item > p.chapter > span').html();
              if (!html) {
                return;
              }
              html = html.replace(/\s{2,}/g, ' ').trim();
              return (/((\d{1,3})(\.)?)+/g.exec(html) || [undefined])[0];
            })();

            return {
              thumbnail: $e.find('div.t-item > a > img').attr('data-original'),
              title: $e.find('div.t-item > h3 > a').text(),
              last_chapter: {
                chapter_name: $e.find('div.t-item > p.chapter > a').attr('title'),
                chapter_link: $e.find('div.t-item > p.chapter > a').attr('href'),
              },
              link: $e.find('div.t-item > a').attr('href'),
              view: view
            };
          });
        resolve(comics);
      });
    });
  }
}