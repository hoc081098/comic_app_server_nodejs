import { RequestHandler } from "express";
import { Error } from "../models/error";

import debug from 'debug';
import { Crawler } from "../crawler/detail.crawler";
import { Comic } from "../models/comic";
import { isValidURL } from "../util";
const log = debug('comic-app-server:server');

export class Controller {
  constructor(
    private readonly crawler: Crawler
  ) { }

  getComic: RequestHandler = async (req, res, _next) => {
    try {
      const { link } = req.query;
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
      if (typeof link !== 'string' || !isValidURL(link)) {
        return res
          .status(422)
          .json(<Error>{
            message: "Invalid 'comic link' to get comic detail",
            status_code: 500
          });
      }

      const comic: Comic = await this.crawler.chiTietTruyen(link);
      res.status(200).json(comic);
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