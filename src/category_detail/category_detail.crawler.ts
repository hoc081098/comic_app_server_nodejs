import { GET, bodyToComicList } from "../util";

export class Crawler {
  static async getComics(categoryLink: string, page: number) {
    const body = await GET(`${categoryLink}/page/${page}`);
    return bodyToComicList(body);
  }
}