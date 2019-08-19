import { bodyToComicList, GET } from "../util";
import { Comic } from "../models/comic.interface";

export class Crawler {
  static async newestComics(page: number): Promise<Comic[]> {
    const body = await GET(`https://ww2.mangafox.online/newmanga/page/${page}`);
    return bodyToComicList(body);
  }

  static async updatedComics(page: number): Promise<Comic[]> {
    const body = await GET(`https://ww2.mangafox.online/page/${page}`);
    return bodyToComicList(body);
  }

  static async mostViewedComics(page: number): Promise<Comic[]> {
    const body = await GET(`https://ww2.mangafox.online/topmanga/page/${page}`);
    return bodyToComicList(body);
  }
}