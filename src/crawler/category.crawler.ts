import { Category } from "../models/category";
import request, { Response } from 'request';
import cheerio from 'cheerio';

export class Crawler {
  async theLoai(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      request.get('http://www.nettruyen.com/', (error: any, response: Response, body: any) => {
        if (error) {
          reject(error);
          return;
        }

        const $: CheerioStatic = cheerio.load(body);

        let dropdown = $('ul.dropdown-menu.megamenu');
        let titles = dropdown.find('div.col-sm-3 > li > a').toArray().map(e => $(e).attr('title'));
        resolve(titles);
      });
    });
  }
}