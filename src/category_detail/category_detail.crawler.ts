import { GET, bodyToComicList } from "../util";
import cheerio from 'cheerio';

export class Crawler {
  static async getComics(categoryLink: string, page: number) {
    const body = await GET(`${categoryLink}/page/${page}`);
    return bodyToComicList(body);
  }

  static async getPopularComics(categoryLink: string): Promise<PopularComic[]> {
    const body = await GET(categoryLink);
    const $ = cheerio.load(body);
    return $('div.manga_slide_container > div.fit_thumbnail')
      .toArray()
      .map((e): PopularComic => {
        const $e = $(e);
        const a = $e.find('a');
        const img = $e.find('a > img');
        const span = $e.find('div.manga_slide_name > span > a');

        return {
          title: a.attr('title'),
          link: a.attr('href'),
          thumbnail: img.attr('src'),
          last_chapter: {
            chapter_link: span.attr('href'),
            chapter_name: span.attr('title')
          }
        };
      });
  }
}

export interface PopularComic {
  thumbnail: string;
  link: string;
  last_chapter: Readonly<{
    chapter_name: string;
    chapter_link: string
  }>;
  title: string;
} 