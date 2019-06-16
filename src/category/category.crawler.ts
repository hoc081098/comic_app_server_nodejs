import request, { Response } from 'request';
import cheerio from 'cheerio';

import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { Category } from "./category.interface";
import { log } from "../util";

const adapter = new FileSync('../../db.json');
const db = low(adapter);

// Set some defaults (required if your JSON file is empty)
db.defaults({ images: {}, last_fetch: undefined }).write();

export class Crawler {
  private static TIMEOUT = 24 * 60 * 60 * 1000; // 1 day

  allCategories(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      request.get('http://www.nettruyen.com/', async (error: any, _response: Response, body: any) => {
        if (error) {
          reject(error);
          return;
        }

        const $: CheerioStatic = cheerio.load(body);
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

        let images: { [key: string]: string } = db.get('images').value();
        const lastFetch: number | undefined = db.get('last_fetch').value();
        console.log({ images, lastFetch });

        const links = categories.map(c => c.link);
        const haveNotImages = !images || links.some(link => !images[link]);
        log({ haveNotImages, time: lastFetch ? Date.now() - lastFetch : undefined });

        if (haveNotImages || !lastFetch || Date.now() - lastFetch >= Crawler.TIMEOUT) {
          try {
            log('Start fetch');
            for (const link of links) {
              log(`Fetch ${link}`);
              const data = await this.getFirstImage(link);
              images = { ...images, ...data };
            }
            db.set('images', images).write();
            db.set('last_fetch', Date.now()).write();
            log('Fetch done');
          } catch (e) {
            log(`Fetch ${{ e }}`);
            reject(e);
            return;
          }
        }

        resolve(categories.map((c): Category => ({ ...c, thumbnail: images[c.link] })));
      });
    });
  }

  private getFirstImage(categoryLink: string): Promise<{ [p: string]: string }> {
    return new Promise((resolve, reject) => {
      request.get(categoryLink, (error: any, _response: Response, body: any) => {
        if (error) {
          reject(error);
          return;
        }
        const $ = cheerio.load(body);
        const $e: Cheerio = $($('div#ctl00_divCenter').find('div.row div.item')[0]);
        const thumbnail = $e.children('figure').first().find('div > a > img').attr('data-original');
        resolve({ [categoryLink]: thumbnail });
      });
    });
  }
}