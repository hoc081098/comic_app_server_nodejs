import { Comic } from "../models/comic";
import { Chapter } from "../models/chapter";
import request, { Response } from 'request';
import cheerio from 'cheerio';
import { Category } from "../models/category";

export class Crawler {

  static chiTietTruyen(link: string): Promise<Comic> {
    return new Promise((resolve, reject) => {
      request.get(link, (error: any, response: Response, body: any) => {
        if (error) return reject(error);

        let $: CheerioStatic = cheerio.load(body);

        // TODO
        let itemDetail = $('div#ctl00_divCenter #item-detail');
        let detailInfo = $('div.detail-info');
        let title = itemDetail.find('.title-detail').text();
        let updatedAt = itemDetail.find('time.small').text();
        updatedAt = updatedAt.substring(updatedAt.indexOf(':') + 1, updatedAt.lastIndexOf(']')).trim();

        let listInfo = itemDetail.find('ul.list-info');
        let authorLi = listInfo.children('li.author');
        let statusLi = listInfo.children('li.status');
        let kindLi = listInfo.children('li.kind');
        let viewLi = listInfo.children('li:last-child');
        let othernameLi = listInfo.children('li.othername');

        let categories = kindLi.find('p > a')
          .toArray()
          .map((e: CheerioElement): Category => {
            let $e = $(e);
            return {
              link: $e.attr('href'),
              name: $e.text(),
            };
          });
        let othername: string | undefined = othernameLi.children('h2').text();
        if (othername.length === 0) othername = undefined;

        let detailContent = $('div.detail-content');
        let shortened = detailContent.find('p').first();

        let listChapters = $('div#nt_listchapter > nav > ul > li');
        let chapters = listChapters.toArray().map((e: CheerioElement): Chapter => {
          let $e = $(e);
          let a = $e.find('a');
          return {
            chapter_link: a.attr('href'),
            chapter_name: a.text(),
            time: $e.find('div.col-xs-4').text(),
            view: $e.find('div.col-xs-3').text()
          }
        }).slice(1);

        resolve({
          thumbnail: detailInfo.find('img').attr('src'),
          title: title,
          chapters: chapters,
          link: link,
          view: viewLi.children('p').last().text(),
          more_detail: {
            last_updated: updatedAt,
            author: authorLi.children('p').last().text(),
            status: statusLi.children('p').last().text(),
            categories: categories,
            othername: othername,
            shortened_content: shortened.text(),
          }
        });
      });
    });
  }
}