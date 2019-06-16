import request, { Response } from 'request';
import cheerio from 'cheerio';
import { Category } from "./category.interface";
import { log, encode, decode } from "../util";

import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  databaseURL: "https://doanlthtvdk.firebaseio.com"
});

const ref = admin.database().ref('comic_app');

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

        const readPromises = ['images', 'last_fetch'].map(path => ref.child(path).once('value').then(snapshot => snapshot.val()));
        let images: { [key: string]: string };
        let lastFetch: number | undefined;
        [images, lastFetch] = await Promise.all(readPromises);
        console.log({ images, lastFetch });

        const links = categories.map(c => c.link);
        const haveNotImages = !images || links.some(link => !images[encode(link)]);
        log({ haveNotImages, time: lastFetch ? Date.now() - lastFetch : undefined });

        if (haveNotImages || !lastFetch || Date.now() - lastFetch >= Crawler.TIMEOUT) {
          try {
            log('Start fetch');

            for (const link of links) {
              log(`Fetch ${link}`);
              const data = await this.getFirstImage(link);
              images = { ...images, ...data };
            }

            const encodedImages = Object.keys(images).reduce((acc, k) => ({ ...acc, [encode(k)]: images[k] }), {});
            await Promise.all([
              ref.child('images').set(encodedImages),
              ref.child('last_fetch').set(Date.now()),
            ]);
            log('Fetch done');
          } catch (e) {
            log(`Fetch error=${{ e }}`);
            reject(e);
            return;
          }
        } else {
          images = Object.keys(images).reduce((acc, k) => ({ ...acc, [decode(k)]: images[k] }), {});
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