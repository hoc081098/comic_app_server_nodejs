import { Crawler } from "../crawler/index.crawler";
import { NextFunction, Request, Response } from "express";
import { Error } from "../models/error";

import debug from 'debug';
const log = debug('comic-app-server:server');

export class Controller {
  static async truyenDeCu(req: Request, res: Response, next: NextFunction) {
    try {
      const comics = await Crawler.truyenDeCu();
      res.status(200).json(comics);
    } catch (e) {
      log(e);
      res.status(500).json(<Error>{
        message: 'Internal server error',
        status_code: 500
      });
    }
  }

  static async truyenMoiCapNhat(req: Request, res: Response, next: NextFunction) {
    const page: number = parseInt(req.query.page) || 1;
    try {
      const comics = await Crawler.truyenMoiCapNhat(page);
      res.status(200).json(comics);
    } catch (e) {
      log(e);
      res.status(500).json(<Error>{
        message: 'Internal server error',
        status_code: 500
      });
    }
  }

  static async topThang(req: Request, res: Response, next: NextFunction) {
    try {
      const comics = await Crawler.topThang();
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