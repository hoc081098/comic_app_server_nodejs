import { Crawler } from "./search.crawler";
import { Error } from "../models/error";
import { RequestHandler } from "express";
import { log } from "../util";

export class Controller {
  searchComic: RequestHandler = async (req, res, _next) => {
    try {
      const { query } = req.query;
      log({ query });

      // check query is valid?
      if (query === undefined || query === null) {
        return res
          .status(422)
          .json(<Error>{
            message: "Require 'query' to searchComic comic detail",
            status_code: 500
          });
      }
      if (typeof query !== 'string') {
        return res
          .status(422)
          .json(<Error>{
            message: "Invalid 'query' to searchComic comic detail",
            status_code: 500
          });
      }

      const page = parseInt(req.query.page) || 1;

      const comics = await Crawler.searchComic(query, page);
      res.status(200).json(comics);
    } catch (e) {
      log(e);
      res.status(500).json(<Error>{
        message: 'Internal server error',
        status_code: 500
      });
    }
  }
}