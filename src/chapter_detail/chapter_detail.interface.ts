type _ChapterDetail = {
  images: string[];
  chapter_name: string;
  comic_name: string;
  chapter_link: string;
  prev_chapter_link?: string;
  next_chapter_link?: string;
  chapters: Readonly<{
    chapter_name: string;
    chapter_link: string;
  }>[];
};

export type ChapterDetail = Readonly<_ChapterDetail>;