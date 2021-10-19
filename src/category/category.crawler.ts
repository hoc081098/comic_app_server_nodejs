import cheerio from 'cheerio';
import { Category } from "./category.interface";
import { bodyToComicList, decode, encode, GET, isValidURL, log } from "../util";
import admin from "firebase-admin";
import descriptions from './category_descriptions';

export class Crawler {
  private static TIMEOUT = 24 * 60 * 60 * 1000; // 24 hour
  private readonly ref: admin.database.Reference;

  constructor() { this.ref = admin.database().ref('comic_app'); }

  async allCategories(): Promise<Category[]> {
    const body = await GET('https://ww2.mangafox.online/');
    const categories = this.getCategories(body);

    const images = await this.fetchImagesIfNeeded(categories.map(c => c.link));

    return categories.map((c): Category => {
      const link = c.link;
      return {
        ...c,
        thumbnail: images[link],
        description: descriptions[link]
      };
    });
  }

  private getCategories(body: string) {
    const $ = cheerio.load(body);
    const categories = $('div.content_right > div.danhmuc > table > tbody > tr > td')
      .toArray()
      .map(td => {
        const $td = $(td);
        return {
          link: $td.find('a').attr('href'),
          name: $td.find('a').text().trim(),
        };
      });
    return categories.slice(0, categories.length - 1);
  }

  private async fetchImagesIfNeeded(links: string[]): Promise<{ [p: string]: string }> {
    // get data from firebase

    const promises = ['images', 'last_fetch'].map(path => this.ref
      .child(path)
      .once('value')
      .then(snapshot => snapshot.val())) as [Promise<{ [key: string]: string } | undefined | null>, Promise<number | undefined | null>];

    const [imagesNullable, lastFetch] = await Promise.all(promises);
    const images: { [p: string]: any } = Object.keys(imagesNullable ?? {})
      .reduce(
        (acc, k) => ({ ...acc, [decode(k)]: imagesNullable?.[k] }),
        {}
      );
    log({ images, lastFetch });

    const haveNotImages = links.some(link => {
      const url = images[link];
      return !url || !isValidURL(url);
    });
    log({ haveNotImages, time: lastFetch ? Date.now() - lastFetch : undefined });

    if (haveNotImages || !lastFetch) {
      // first time or invalid data, need await
      return await this.getAndSaveImages(links);
    } else if (Date.now() - lastFetch >= Crawler.TIMEOUT) {
      // timeout
      // this is not the first time, not need await, data will be saved to firebase database for later
      // and current data is valid, just return
      // tslint:disable-next-line: no-floating-promises
      this.getAndSaveImages(links).then(v => log({ v })).catch(e => log({ e }));
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
  private static async getFirstImage(categoryLink: string): Promise<{ [p: string]: string }> {
    const body = await GET(categoryLink);
    const thumbnail = bodyToComicList(body)[0].thumbnail;
    log(`[END  ] fetch ${thumbnail}`);
    return { [categoryLink]: thumbnail };
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
      const data = await Crawler.getFirstImage(link);
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