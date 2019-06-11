import { Crawler } from "../crawler/index.crawler";
import { RequestHandler } from "express";
import { Error } from "../models/error";

import debug from 'debug';
const log = debug('comic-app-server:server');

export class Controller {
  constructor(
    private readonly crawler: Crawler
  ) { }

  truyenDeCu: RequestHandler = async (_req, res, _next) => {
    try {
      const comics = await this.crawler.truyenDeCu();
      res.status(200).json(comics);
    } catch (e) {
      log(e);
      res.status(500).json(<Error>{
        message: 'Internal server error',
        status_code: 500
      });
    }
  }

  truyenMoiCapNhat: RequestHandler = async (req, res, _next) => {
    const page: number = parseInt(req.query.page) || 1;
    try {
      const comics = await this.crawler.truyenMoiCapNhat(page);
      res.status(200).json(comics);
    } catch (e) {
      log(e);
      res.status(500).json(<Error>{
        message: 'Internal server error',
        status_code: 500
      });
    }
  }

  topThang: RequestHandler = async (_req, res, _next) => {
    try {
      const comics = await this.crawler.topThang();
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