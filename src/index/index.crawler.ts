import { bodyToComicListNew, GET } from "../util";
import { Comic } from "../models/comic.interface";

export class Crawler {
  static async newestComics(page: number): Promise<Comic[]> {
    const body = await GET(`https://ww.mangakakalot.tv/manga_list/?type=newest&category=all&state=all&page=${page}`);
    return bodyToComicListNew(body);
  }

  static async updatedComics(page: number): Promise<Comic[]> {
    const body = await GET(`https://manganato.com/genre-all/${page}`);
    return bodyToComicListNew(body);
  }

  static async mostViewedComics(page: number): Promise<Comic[]> {
    const body = await GET(`https://manganato.com/genre-all/${page}?type=topview`);
    return bodyToComicListNew(body);
  }
}