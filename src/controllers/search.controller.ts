import { Crawler } from "../crawler/search.crawler";
import { NextFunction, Request, Response } from "express";
import { Error } from "../models/error";

import debug from 'debug';
const log = debug('comic-app-server:server');

export class Controller {
  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const comics = await Crawler.timTruyen('');
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