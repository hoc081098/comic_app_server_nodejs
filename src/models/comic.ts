import { Chapter } from "./chapter";
import { Category } from "./category";

export interface Comic {
  readonly thumbnail: string;
  readonly title: string;
  readonly chapters: Chapter[];
  readonly link: string;
  readonly view?: string;

  // get full comic detail
  readonly more_detail?: MoreDetail;
}
export interface MoreDetail {
  readonly last_updated: string;
  readonly author: string;
  readonly status: string;
  readonly categories: Category[];
  readonly othername?: string;
  readonly shortened_content: string;
}