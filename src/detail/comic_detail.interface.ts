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
  author: string;
  link: string;
  other_name: string | undefined;
  categories: {
    readonly link: string;
    readonly  name: string
  }[];
  title: string;
  status: string;
};

export type ComicDetail = Readonly<_ComicDetail>;