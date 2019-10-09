import { GET, bodyToComicList } from "../util";

export class Crawler {
  static async getComics(categoryLink: string) {
    const body = await GET(categoryLink);
    return bodyToComicList(body);
  }
}