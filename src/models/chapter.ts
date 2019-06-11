export interface Chapter {
  readonly chapter_name: string;
  readonly chapter_link: string;
  readonly time?: string;
  readonly images?: string[];
  readonly htmlContent?: string;
  readonly view?: string;
}