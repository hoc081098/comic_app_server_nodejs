import { RequestHandler } from "express";
import { Crawler } from "./category_detail.crawler";
import { Error } from "../models/error";
import { log, isValidURL } from "../util";


export class Controller {
  getCategoryDetail: RequestHandler = async (req, res) => {
    try {
      const { link } = req.query;
      log({ link });

      // check link is valid?
      if (!link) {
        return res
          .status(422)
          .json({
            message: "Require 'category link' to get category detail",
            status_code: 422
          } as Error);
      }
      if (typeof link !== 'string' || !isValidURL(link)) {
        return res
          .status(422)
          .json({
            message: "Invalid 'category link' to get category detail",
            status_code: 422
          } as Error);
      }

      const page = parseInt(req.query.page) || 1;
      const comics = await Crawler.getComics(link, page);
      res.status(200).json(comics);
    } catch (e) {
      log(e);
      const error: Error = {
        message: 'Internal server error',
        status_code: 500
      };
      res.status(500).json(error);
    }
  }
}