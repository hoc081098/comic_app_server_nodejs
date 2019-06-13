import { RequestHandler } from "express";
import { Error } from '../models/error';
import { Crawler } from "./category.crawler";
import { log } from "../util";

export class Controller {
  constructor(
    private readonly crawler: Crawler
  ) { }

  getAllCategories: RequestHandler = async (_req, res) => {
    try {
      const categories = await this.crawler.allCategories();
      res.status(200).json(categories);
    } catch (e) {
      log(e);
      const error: Error = {
        message: 'Internal server error',
        status_code: 500
      };
      res.status(500).json(error);
    }
  };
}