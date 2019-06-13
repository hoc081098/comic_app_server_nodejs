type _UpdatedComic = {
  thumbnail: string;
  view?: string;
  link: string;
  last_chapters: Readonly<{
    chapter_name: string;
    time: string;
    chapter_link: string
  }>[];
  title: string;
};

export type UpdatedComic = Readonly<_UpdatedComic>;