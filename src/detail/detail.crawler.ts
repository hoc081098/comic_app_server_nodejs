import request, { Response } from 'request';
import cheerio from 'cheerio';
import { ComicDetail } from "./comic_detail.interface";

export class Crawler {

  comicDetail(link: string): Promise<ComicDetail> {
    return new Promise((resolve, reject) => {
      request.get(link, (error: any, _response: Response, body: any) => {
        if (error) {
          reject(error);
          return;
        }

        const $: CheerioStatic = cheerio.load(body);

        const itemDetail = $('div#ctl00_divCenter #item-detail');
        const detailInfo = $('div.detail-info');
        const title = itemDetail.find('.title-detail').text();
        let updatedAt = itemDetail.find('time.small').text();
        updatedAt = updatedAt.substring(updatedAt.indexOf(':') + 1, updatedAt.lastIndexOf(']')).trim();

        const listInfo = itemDetail.find('ul.list-info');
        const authorLi = listInfo.children('li.author');
        const statusLi = listInfo.children('li.status');
        const kindLi = listInfo.children('li.kind');
        const viewLi = listInfo.children('li:last-child');
        const otherNameLi = listInfo.children('li.othername');

        const categories = kindLi.find('p > a')
          .toArray()
          .map((e: CheerioElement) => {
            const $e = $(e);
            return {
              link: $e.attr('href'),
              name: $e.text(),
            };
          });
        let otherName: string | undefined = otherNameLi.children('h2').text();
        if (otherName.length === 0) otherName = undefined;

        const detailContent = $('div.detail-content');
        const shortened = detailContent.find('p').first();

        const listChapters = $('div#nt_listchapter > nav > ul > li');
        const chapters = listChapters.toArray()
          .map((e: CheerioElement) => {
            const $e = $(e);
            const a = $e.find('a');
            return {
              chapter_link: a.attr('href'),
              chapter_name: a.text(),
              time: $e.find('div.col-xs-4').text(),
              view: $e.find('div.col-xs-3').text()
            };
          })
          .slice(1);

        const comicDetail: ComicDetail = {
          thumbnail: detailInfo.find('img').attr('src'),
          title: title,
          chapters: chapters,
          link: link,
          view: viewLi.children('p').last().text(),
          last_updated: updatedAt,
          author: authorLi.children('p').last().text(),
          status: statusLi.children('p').last().text(),
          categories: categories,
          other_name: otherName,
          shortened_content: shortened.text(),
        };

        resolve(comicDetail);
      });
    });
  }
}