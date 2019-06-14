type  _ChapterDetail = {
  images: string[];
  chapter_name: string;
  time: string;
  chapter_link: string;
  html_content?: string;
};

export type ChapterDetail = Readonly<_ChapterDetail>;