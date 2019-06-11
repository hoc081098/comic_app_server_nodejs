import { Crawler } from "../crawler/search.crawler";
import { Error } from "../models/error";

import debug from 'debug';
import { Comic } from "../models/comic";
import { RequestHandler } from "express";
const log = debug('comic-app-server:server');

export class Controller {
  constructor(
    private readonly crawler: Crawler
  ) { }

  search: RequestHandler = async (req, res, _next) => {
    try {
      const { query } = req.query;
      log({ query });

      // check query is valid?
      if (query === undefined || query === null) {
        return res
          .status(422)
          .json(<Error>{
            message: "Require 'query' to search comic detail",
            status_code: 500
          });
      }
      if (typeof query !== 'string') {
        return res
          .status(422)
          .json(<Error>{
            message: "Invalid 'query' to search comic detail",
            status_code: 500
          });
      }

      const comics: Comic[] = await this.crawler.timTruyen(query);
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