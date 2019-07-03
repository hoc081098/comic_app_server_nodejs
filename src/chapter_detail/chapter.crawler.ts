import cheerio from 'cheerio';
import { ChapterDetail } from "./chapter_detail.interface";
import { escapeHTML, GET } from "../util";

export class Crawler {
  async chapterDetail(link: string): Promise<ChapterDetail> {
    const $: CheerioStatic = cheerio.load(await GET(link));

    const divCenter = $('div#ctl00_divCenter');
    const chapterName = divCenter.find('h1.txt-primary > span').text().replace(/[- ]+/, '').trim();
    let lastUpdated = divCenter.find('div.container > div.top > i').text();
    lastUpdated = lastUpdated.substring(lastUpdated.indexOf(':') + 1, lastUpdated.length - 1).trim();

    const detail = divCenter.find('.reading-detail.box_doc');
    const images: string[] = detail.children('.page-chapter')
      .toArray()
      .map(page => $(page).children('img').attr('data-original'));

    let htmlContent: string | null | undefined;
    if (images.length === 0) {
      htmlContent = detail.find('.content-words').html();
      if (htmlContent) htmlContent = escapeHTML(htmlContent);
    }
    if (htmlContent === null) htmlContent = undefined;

    const chapterId: number = (() => {
      const array = link.split('/');
      return +array[array.length - 1];
    })();
    const body = await GET(`http://www.nettruyen.com/Comic/Services/ComicService.asmx/ProcessChapterLoader?chapterId=${chapterId}&commentId=0`);
    const allChapters: {
      chapterId: number;
      name: string;
      url: string;
    }[] = JSON.parse(body).chapters;

    const indexOfCurrentChapter = allChapters.findIndex(c => c.chapterId === chapterId);
    const prevChapterLink: string | undefined = (() => {
      const prevChapter = allChapters[indexOfCurrentChapter + 1];
      return prevChapter ? prevChapter.url : undefined;
    })();
    const nextChapterLink: string | undefined = (() => {
      const nextChapter = allChapters[indexOfCurrentChapter - 1];
      return nextChapter ? nextChapter.url : undefined;
    })();

    const chapterDetail: ChapterDetail = {
      chapter_link: link,
      chapter_name: chapterName,
      images: images,
      html_content: htmlContent,
      time: lastUpdated,
      prev_chapter_link: prevChapterLink,
      next_chapter_link: nextChapterLink,
      chapters: allChapters.map(c => {
        return {
          chapter_name: c.name,
          chapter_link: c.url
        };
      }),
    };
    return chapterDetail;
  }
}
