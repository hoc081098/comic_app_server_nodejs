import { NextFunction, Request, Response } from "express";
import { Error } from "../models/error";

import debug from 'debug';
import { Crawler } from "../crawler/detail.crawler";
import { Comic } from "../models/comic";
const log = debug('comic-app-server:server');

export class Controller {
  private static isValidURL(str: string): boolean {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return pattern.test(str);
  }

  static async getComic(req: Request, res: Response, next: NextFunction) {
    try {
      let { link }: { link: any | undefined | null } = req.query;
      log({ link });

      // check link is valid?
      if (!link) {
        return res
          .status(422)
          .json(<Error>{
            message: "Require 'comic link' to get comic detail",
            status_code: 500
          });
      }
      if (typeof link !== 'string' || !Controller.isValidURL(link)) {
        return res
          .status(422)
          .json(<Error>{
            message: "Invalid 'comic link' to get comic detail",
            status_code: 500
          });
      }

      let comic: Comic = await Crawler.chiTietTruyen(link);
      res.status(200).json(comic);
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