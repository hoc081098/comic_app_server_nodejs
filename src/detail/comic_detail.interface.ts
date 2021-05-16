import { Comic } from "../models/comic.interface";

type _ComicDetail = {
  thumbnail: string;
  view: string;
  last_updated: string;
  shortened_content: string;
  chapters: Readonly<{
    view: string;
    chapter_name: string;
    time: string;
    chapter_link: string
  }>[];
  authors: {
    readonly name: string;
    readonly link: string
  }[];
  link: string;
  categories: {
    readonly link: string;
    readonly name: string
  }[];
  title: string;
  related_comics: Comic[],
  alternative: string | null,
  status: string | null,
};

export type ComicDetail = Readonly<_ComicDetail>;