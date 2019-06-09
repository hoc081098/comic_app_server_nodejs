import { Chapter } from "./chapter";
import { Category } from "./category";

export interface Comic {
  thumbnail: string;
  title: string;
  chapters: Chapter[];
  link: string;
  view?: string;

  // get full comic detail
  more_detail?: MoreDetail;
}
export interface MoreDetail {
  last_updated: string;
  author: string;
  status: string;
  categories: Category[];
  othername?: string;
  shortened_content: string;
}