import { Comic } from "../models/comic";
import { Chapter } from "../models/chapter";
let request = require('request');
let cheerio = require('cheerio');

export class Crawler {

    static truyenDeCu(): Promise<Comic[]> {
        return new Promise((resolve, reject) => {
            let comics: Comic[] = [];

            request.get('http://www.nettruyen.com/', (error: any, response: any, body: any) => {
                if (error) return reject(error);

                let $ = cheerio.load(body);
                $('div.top-comics').find('div.items-slide div.item').each((i: number, e: any) => {
                    const $e = $(e);
                    let slideCaptionAnchor = $e.find('div.slide-caption > a');
                    let slideCaptionH3Anchor = $e.find('div.slide-caption > h3 > a');

                    comics.push({
                        thumbnails: $e.find('a > img.lazyOwl').first().attr('data-src'),
                        title: slideCaptionH3Anchor.text(),
                        chapters: [
                            {
                                chapter_name: slideCaptionAnchor.text(),
                                chapter_link: slideCaptionAnchor.attr('href'),
                                time: $e.find('div.slide-caption > span.time').text().trim(),
                            }
                        ],
                        link: slideCaptionH3Anchor.attr('href'),
                    });
                });

                resolve(comics);
            });
        });
    }

    static truyenMoiCapNhat(page: number): Promise<Comic[]> {
        return new Promise((resolve, reject) => {
            let comics: Comic[] = [];

            request.get(`http://www.nettruyen.com/?page=${page}`, (error: any, response: any, body: any) => {
                if (error) return reject(error);

                let $ = cheerio.load(body);
                $('div#ctl00_divCenter').find('div.row div.item').each((i: number, e: any) => {
                    const $e = $(e);
                    const figure = $e.children('figure').first()

                    let chapters: Chapter[] = $e.find('figcaption > ul > li').toArray().map((li: any) => {
                        let $li = $(li);
                        let a = $li.children('a').first()

                        return <Chapter>{
                            chapter_name: a.text(),
                            chapter_link: a.attr('href'),
                            time: $li.children('i.time').first().text(),
                        }
                    });

                    let view = (() => {
                        let html = figure.find('div > div.view > span').html();
                        html = html.replace(/\s{2,}/g, ' ').trim();
                        return (/((\d{1,3})(\.)?)+/g.exec(html) || [undefined])[0]
                    })();

                    comics.push({
                        thumbnails: figure.find('div > a > img').attr('data-original'),
                        title: $e.find('figcaption > h3 > a').text(),
                        chapters: chapters,
                        link: figure.find('div > a').attr('href'),
                        view: view,
                    });
                });

                resolve(comics);
            });
        });
    }

    static topThang(): Promise<Comic[]> {
        return new Promise((resolve, reject) => {
            let comics: Comic[] = [];

            request.get(`http://www.nettruyen.com`, (error: any, response: any, body: any) => {
                if (error) return reject(error);

                let $ = cheerio.load(body);
                $('div#topMonth').find('li.clearfix').each((i: number, e: any) => {
                    let $e = $(e);

                    let view = (() => {
                        let html = $e.find('div.t-item > p.chapter > span').html();
                        html = html.replace(/\s{2,}/g, ' ').trim();
                        return (/((\d{1,3})(\.)?)+/g.exec(html) || [undefined])[0]
                    })();

                    comics.push({
                        thumbnails: $e.find('div.t-item > a > img').attr('data-original'),
                        title: $e.find('div.t-item > h3 > a').text(),
                        chapters: [
                            {
                                chapter_link: $e.find('div.t-item > p.chapter > a').attr('title'),
                                chapter_name: $e.find('div.t-item > p.chapter > a').attr('href'),
                            }
                        ],
                        link: $e.find('div.t-item > a').attr('href'),
                        view: view,
                    });
                });
                resolve(comics);
            });
        });
    }
}