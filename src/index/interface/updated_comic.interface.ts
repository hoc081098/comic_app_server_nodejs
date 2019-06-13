export interface UpdatedComic {
  thumbnail: string;
  view?: string;
  link: string;
  last_chapters: {
    chapter_name: string;
    time: string;
    chapter_link: string
  }[];
  title: string;
}
