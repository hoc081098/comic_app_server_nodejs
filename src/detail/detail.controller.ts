import { RequestHandler } from "express";
import { Error } from "../models/error";
import { Crawler } from "./detail.crawler";
import { isValidURL, log } from "../util";

export class Controller {
  constructor(
    private readonly crawler: Crawler
  ) { }

  getComicDetail: RequestHandler = async (req, res) => {
    try {
      const {link} = req.query;
      log({link});

      // check link is valid?
      if (!link) {
        return res
          .status(422)
          .json({
            message: "Require 'comic link' to get comic detail",
            status_code: 500
          } as Error);
      }
      if (typeof link !== 'string' || !isValidURL(link)) {
        return res
          .status(422)
          .json({
            message: "Invalid 'comic link' to get comic detail",
            status_code: 500
          } as Error);
      }

      const comic = await this.crawler.comicDetail(link);
      res.status(200).json(comic);
    } catch (e) {
      log(e);
      res.status(500)
        .json({
          message: 'Internal server error',
          status_code: 500
        } as Error);
    }
  };
}