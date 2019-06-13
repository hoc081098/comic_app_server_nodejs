import { RequestHandler } from "express";
import { Error } from "../models/error";
import { Crawler } from "./chapter.crawler";
import { isValidURL, log } from "../util";

export class Controller {
  constructor(
    private readonly crawler: Crawler
  ) { }

  getChapterDetail: RequestHandler = async (req, res) => {
    try {
      const { link } = req.query;
      log({ link });

      // check link is valid?
      if (!link) {
        return res
          .status(422)
          .json(<Error>{
            message: "Require 'chapter link' to get chapter detail",
            status_code: 500
          });
      }
      if (typeof link !== 'string' || !isValidURL(link)) {
        return res
          .status(422)
          .json(<Error>{
            message: "Invalid 'chapter link' to get chapter detail",
            status_code: 500
          });
      }

      const chapter = await this.crawler.chapterDetail(link);
      res.status(200).json(chapter);
    } catch (e) {
      log(e);
      res.status(500)
        .json(<Error>{
          message: 'Internal server error',
          status_code: 500
        });
    }
  };
}