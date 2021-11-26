import { BASE_URL, bodyToComicListNew, GET, log } from "../util";
import { Comic } from "../models/comic.interface";

export class Crawler {
  static buildUrl(type: string, page: number): string {
    const url = `${BASE_URL}/manga_list/?type=${type}&category=all&state=all&page=${page}`;
    log(`GET ${url}`);
    return url;
  }

  static async newestComics(page: number): Promise<Comic[]> {
    const body = await GET(Crawler.buildUrl('newest', page));
    return bodyToComicListNew(body);
  }

  static async updatedComics(page: number): Promise<Comic[]> {
    const body = await GET(Crawler.buildUrl('latest', page));
    return bodyToComicListNew(body);
  }

  static async mostViewedComics(page: number): Promise<Comic[]> {
    const body = await GET(Crawler.buildUrl('topview', page));
    return bodyToComicListNew(body);
  }
}