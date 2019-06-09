import { NextFunction, Request, Response } from "express";
import { Error } from "../models/error";

import debug from 'debug';
import { Crawler } from "../crawler/chapter.crawler";
import { Chapter } from "../models/chapter";
import { isValidURL } from "../util";
const log = debug('comic-app-server:server');

export class Controller {
  static async getChapterDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { link }: { link: any | undefined | null } = req.query;
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

      const chapter: Chapter = await Crawler.chiTietChuong(link);
      res.status(200).json(chapter);
    } catch (e) {
      log(e);
      res.status(500)
        .json(<Error>{
          message: 'Internal server error',
          status_code: 500
        });
    }
  }
}