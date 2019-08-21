import { bodyToComicList, GET } from "../util";
import { Comic } from "../models/comic.interface";

export class Crawler {

  static async searchComic(query: string, page: number): Promise<Comic[]> {
    const body = await GET(`https://ww2.mangafox.online/search/${query}/page/${page}`);
    return bodyToComicList(body);
  }
}