type  _ChapterDetail = {
  images: string[];
  chapter_name: string;
  time: string;
  chapter_link: string;
  htmlContent?: string;
};

export type ChapterDetail = Readonly<_ChapterDetail>;