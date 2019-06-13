type _TopMonthComic = {
  last_chapter: {
    readonly chapter_name: string;
    readonly chapter_link: string
  };
  thumbnail: string;
  view?: string;
  link: string;
  title: string;
};

export type TopMonthComic = Readonly<_TopMonthComic>;