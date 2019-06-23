import request, { Response } from 'request';
import cheerio from 'cheerio';
import { Category } from "./category.interface";
import { log, encode, decode, isValidURL } from "../util";
import admin from "firebase-admin";

export class Crawler {
  private static TIMEOUT = 60 * 60 * 1000; // 1 hour
  private readonly ref: admin.database.Reference;

  constructor() {
    this.ref = admin.database().ref('comic_app');
  }

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
        const images = await this.fetchImagesIfNeeded(categories.map(c => c.link));
        resolve(categories.map((c): Category => ({ ...c, thumbnail: images[c.link] })));
      });
    });
  }


  private async fetchImagesIfNeeded(links: string[]): Promise<{ [p: string]: string }> {
    // get data from firebase
    let images: { [key: string]: string };
    let lastFetch: number | undefined;
    [images, lastFetch] = await Promise.all(
      ['images', 'last_fetch']
        .map(path => this.ref
          .child(path)
          .once('value')
          .then(snapshot => snapshot.val())
        )
    );
    images = Object.keys(images).reduce((acc, k) => ({ ...acc, [decode(k)]: images[k] }), {});
    log({ images, lastFetch });

    const haveNotImages = !images || links.some(link => !images[link] || !isValidURL(images[link]));
    log({ haveNotImages, time: lastFetch ? Date.now() - lastFetch : undefined });
    if (haveNotImages || !lastFetch) {
      // first time or invalid data, need await
      return await this.getAndSaveImages(links);
    } else if (Date.now() - lastFetch >= Crawler.TIMEOUT) {
      // timeout
      // this is not the first time, not need await, data will be saved to firebase database for later
      // and current data is valid, just return
      // tslint:disable-next-line: no-floating-promises
      this.getAndSaveImages(links);
      return images;
    } else {
      // have valid data, just return
      return images;
    }
  }

  /**
   * 
   * @param categoryLink category url
   */
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

  /**
  * 
  * @param links category urls
  */
  private async getAndSaveImages(links: string[]): Promise<{ [p: string]: string }> {
    // get
    let images: { [p: string]: string } = {};
    for (const link of links) {
      log(`[START] fetch ${link}`);
      const data = await this.getFirstImage(link);
      images = { ...images, ...data };
    }

    // save
    const encodedImages = Object.keys(images).reduce((acc, k) => ({ ...acc, [encode(k)]: images[k] }), {});
    await Promise.all([
      this.ref.child('images').set(encodedImages),
      this.ref.child('last_fetch').set(Date.now()),
    ]);

    log('[DONE] fetch');
    return images;
  }
}