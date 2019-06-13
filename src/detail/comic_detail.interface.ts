export interface ComicDetail {
  thumbnail: string;
  view: string;
  last_updated: string;
  shortened_content: string;
  chapters: {
    view: string;
    chapter_name: string;
    time: string;
    chapter_link: string
  }[];
  author: string;
  link: string;
  other_name: string | undefined;
  categories: {
    link: string;
    name: string
  }[];
  title: string;
  status: string;
}