import { Request, NextFunction, Response, RequestHandler } from "express";
import debug from "debug";
import { Error } from '../models/error';
import { Crawler } from "../crawler/category.crawler";

const log = debug('comic-app-server:server');

export class Controller {
  constructor(
    private readonly crawler: Crawler
  ) { }

  getAllCategories: RequestHandler = async (_req, res, _next) => {
    try {
      const categories = await this.crawler.theLoai();
      res.status(200).json(categories);
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