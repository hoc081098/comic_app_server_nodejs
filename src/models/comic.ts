import { Chapter } from "./chapter";

export interface Comic {
  thumbnail: string,
  title: string,
  chapters: Chapter[],
  link: string,
  view?: string
}