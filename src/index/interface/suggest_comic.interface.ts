type _SuggestComic = {
  thumbnail: string;
  link: string;
  title: string;
  last_chapter: Readonly<{
    chapter_name: string;
    time: string;
    chapter_link: string
  }>;
};

export type SuggestComic = Readonly<_SuggestComic>;