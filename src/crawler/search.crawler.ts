import { Comic } from "../models/comic";
import request, { Response } from 'request';
import cheerio from 'cheerio';

export class Crawler {

  static timTruyen(query: string): Promise<Comic[]> {
    const link = `http://www.nettruyen.com/Comic/Services/SuggestSearch.ashx?q=${query}`;

    return new Promise((resolve, reject) => {
      request.get(link, (error: any, response: Response, body: any) => {
        if (error) {
          reject(error);
          return;
        }

        const $: CheerioStatic = cheerio.load(body);
        const comics: Comic[] = $('li').toArray().map((li: CheerioElement): Comic => {
          const $li = $(li);
          return {
            title: $li.find('h3').text(),
            thumbnail: $li.find('img').attr('src'),
            link: $li.find('a').attr('href'),
            chapters: [
              {
                chapter_name: $li.find('h4 > i').first().text(),
                chapter_link: '',
              },
            ],
          };
        });
        resolve(comics);
      });
    });
  }
}