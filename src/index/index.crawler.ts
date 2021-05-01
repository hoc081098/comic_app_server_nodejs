import { bodyToComicList, bodyToComicListNew, GET } from "../util";
import { Comic } from "../models/comic.interface";

export class Crawler {
  static async newestComics(page: number): Promise<Comic[]> {
    const body = await GET(`https://manganelo.com/genre-all/${page}?type=newest`);
    return bodyToComicListNew(body);
  }

  static async updatedComics(page: number): Promise<Comic[]> {
    const body = await GET(`https://manganelo.com/genre-all/${page}`);
    return bodyToComicListNew(body);
  }

  static async mostViewedComics(page: number): Promise<Comic[]> {
    const body = await GET(`https://manganelo.com/genre-all/${page}?type=topview`);
    return bodyToComicListNew(body);
  }
}