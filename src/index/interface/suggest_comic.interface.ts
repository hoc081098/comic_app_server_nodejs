export interface SuggestComic {
  thumbnail: string;
  link: string;
  title: string;
  last_chapter: {
    chapter_name: string;
    time: string;
    chapter_link: string
  };
}