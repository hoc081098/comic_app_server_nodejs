import cheerio from 'cheerio';
import { ComicDetail } from "./comic_detail.interface";
import { bodyToComicList, GET } from "../util";

export class Crawler {

  async comicDetailNew(link: string): Promise<ComicDetail> {
    const body = await GET(link);
    const $ = cheerio.load(body);

    const content_left = $('div.container-main-left');
    const panel_story_info = content_left.find('div.panel-story-info');
    const story_info_left = panel_story_info.find('div.story-info-left');
    const story_info_right = panel_story_info.find('div.story-info-right');

    const thumbnail = story_info_left.find('img').attr('src');
    const title = story_info_right.find('h1').first().text().trim();

    let authors: {
      readonly name: string;
      readonly link: string
    }[] | null = null;

    let categories: {
      readonly name: string;
      readonly link: string
    }[] | null = null;

    let status: string | null = null;
    let alternative: string | null = null;

    story_info_right.find('table.variations-tableInfo > tbody > tr').toArray().forEach((tr: CheerioElement) => {
      const $tr = $(tr);
      const table_value = $tr.find('td.table-value');

      switch ($tr.find('td.table-label').text()) {
        case 'Alternative :':
          alternative = table_value.find('h2').text();
          break;
        case 'Author(s) :':
          authors = table_value.find('a').toArray().map((a: CheerioElement) => {
            const $a = $(a);
            return {
              name: $a.text(),
              link: $a.attr('href'),
            };
          });
          break;
        case 'Status :':
          status = table_value.text();
          break;
        case 'Genres :':
          categories = table_value.find('a').toArray().map((a: CheerioElement) => {
            const $a = $(a);
            return {
              name: $a.text(),
              link: $a.attr('href'),
            };
          });
      }
    });

    let last_updated: string | null = null;
    let view: string | null = null;

    story_info_right.find('div.story-info-right-extent > p').toArray().forEach((p: CheerioElement) => {
      const $p = $(p);
      const stre_value = $p.find('span.stre-value');

      switch ($p.find('span.stre-label').text()) {
        case 'Updated :':
          last_updated = stre_value.text();
          break;
        case 'View :':
          view = stre_value.text();
          break;
      }
    });

    const panel_story_info_description = panel_story_info.find('div.panel-story-info-description').text();
    const shortened_content = panel_story_info_description.substring(panel_story_info_description.indexOf(":") + 2);

    const chapters = content_left.find('div.panel-story-chapter-list > ul.row-content-chapter > li')
      .toArray()
      .map((li: CheerioElement) => {
        const $li = $(li);
        const a = $li.find('a');
        return {
          chapter_name: a.text().trim(),
          chapter_link: a.attr('href'),
          view: $li.find('span.chapter-view').text().trim(),
          time: $li.find('span.chapter-time').text().trim(),
        };
      });

    return {
      authors: authors ?? [],
      categories: categories ?? [],
      last_updated: last_updated ?? '',
      chapters,
      related_comics: [],
      link,
      shortened_content,
      thumbnail,
      title,
      view: view ?? '',
      status,
      alternative,
    };
  }

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
      alternative: null,
      status: null,
    };
  }
}