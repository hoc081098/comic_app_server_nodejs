import request, { Response } from 'request';
import cheerio from 'cheerio';
import { Category } from "./category.interface";

export class Crawler {
  allCategories(): Promise<Category[]> {
    return new Promise((resolve, reject) => {
      request.get('http://www.nettruyen.com/', (error: any, _response: Response, body: any) => {
        if (error) {
          reject(error);
          return;
        }

        const $: CheerioStatic = cheerio.load(body);
        const categories: Category[] = $('nav.main-nav ul.dropdown-menu.megamenu div.col-sm-3 ul.nav li a')
          .toArray()
          .map((element): Category => {
            const $element = $(element);
            return {
              link: $element.attr('href'),
              name: $element.attr('title') || $element.find('strong').text(),
              description: $element.attr('data-title'),
            };
          });
        resolve(categories);
      });
    });
  }
}