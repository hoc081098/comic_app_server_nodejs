import cheerio from 'cheerio';
import { ComicDetail } from "./comic_detail.interface";
import { bodyToComicList, GET } from "../util";

export class Crawler {

  async comicDetail(link: string): Promise<ComicDetail> {
    const body = await GET(link);
    const $ = cheerio.load(body);

    const content_left = $('div.content_left');
    const manga_info = content_left.find('div.manga_info');

    const thumbnail = manga_info.find('div.manga_info_left > div.manga_info_img > img').attr('src');

    const manga_info_right = manga_info.find('div.manga_info_right');
    const title = manga_info_right.find('div.manga_name > h1').text().trim();

    let view = '0';
    let authors: { link: string; name: string }[] = [];
    let categories: { readonly link: string; readonly  name: string }[] = [];
    manga_info_right.find('div.manga_des > ul > li').toArray().forEach(li => {
      const $li = $(li);
      const spanText = $li.find('span').text().trim();
      switch (spanText) {
        case 'Views:':
          const text = $li.text();
          view = text.substring('Views:'.length + 1).trim();
          break;
        case 'Authors:':
          authors = $li.find('a').toArray().map(a => {
            const $a = $(a);
            return {
              name: $a.attr('title'),
              link: $a.attr('href'),
            };
          });
          break;
        case 'Categories:':
          categories = $li.find('a').toArray().map(a => {
            const $a = $(a);
            return {
              name: $a.attr('title'),
              link: $a.attr('href'),
            };
          });
          break;
      }
    });

    const shortened_content = content_left.find('div.manga_description > div.manga_des_content > p').text().trim();

    const chapters = content_left.find('div.manga_chapter > div.manga_chapter_list > ul > li')
      .toArray()
      .map(li => {
        const $li = $(li);

        return {
          view: $li.find('div.chapter_time').text().trim(),
          chapter_name: $li.find('div.chapter_number > a').text().trim(),
          time: $li.find('div.chapter_view').text().trim(),
          chapter_link: $li.find('div.chapter_number > a').attr('href'),
        };
      });

    const related_comics = bodyToComicList(body);

    return {
      title,
      thumbnail,
      view,
      authors,
      categories,
      shortened_content,
      chapters,
      link,
      last_updated: chapters[0].time,
      related_comics,
    };
  }
}