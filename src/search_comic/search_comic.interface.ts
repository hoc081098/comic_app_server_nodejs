type _SearchComic = {
  thumbnail: string;
  last_chapter_name: string;
  link: string;
  title: string;
  category_names: string[];
};

export type SearchComic = Readonly<_SearchComic>;