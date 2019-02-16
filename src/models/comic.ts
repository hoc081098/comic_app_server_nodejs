import { Chapter } from "./chapter";

export interface Comic {
    thumbnails: string,
    title: string,
    chapters: Chapter[],
    link: string,
    view?: string
}