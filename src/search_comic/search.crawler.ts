import request, { Response } from 'request';
import cheerio from 'cheerio';
import { SearchComic } from "./search_comic.interface";

export class Crawler {

  searchComic(query: string): Promise<any[]> {
    const link = `http://www.nettruyen.com/Comic/Services/SuggestSearch.ashx?q=${query}`;

    return new Promise((resolve, reject) => {
      request.get(link, (error: any, _response: Response, body: any) => {
        if (error) {
          reject(error);
          return;
        }

        const $: CheerioStatic = cheerio.load(body);
        const comics: SearchComic[] = $('li')
          .toArray()
          .map((li: CheerioElement): SearchComic => {
            const $li = $(li);
            return {
              title: $li.find('h3').text(),
              thumbnail: $li.find('img').attr('src'),
              link: $li.find('a').attr('href'),
              last_chapter_name: $li.find('h4 > i').first().text(),
              category_names: $li.find('h4 > i')
                .last()
                .text()
                .split(/, +/g)
                .map((name) => name.trim())
            };
          });
        resolve(comics);
      });
    });
  }
}