import { Crawler } from "./index.crawler";
import { RequestHandler } from "express";
import { Error } from "../models/error";
import { log } from "../util";

export class Controller {
  constructor(
    private readonly crawler: Crawler
  ) { }

  suggestComics: RequestHandler = async (_req, res) => {
    try {
      const comics = await this.crawler.suggestComics();
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

  updatedComics: RequestHandler = async (req, res) => {
    const page: number = parseInt(req.query.page) || 1;
    try {
      const comics = await this.crawler.updatedComics(page);
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

  topMonthComics: RequestHandler = async (_req, res) => {
    try {
      const comics = await this.crawler.topMonthComics();
      res.status(200).json(comics);
    } catch (e) {
      log(e);
      const error: Error = {
        message: 'Internal server error',
        status_code: 500,
      };
      res.status(500).json(error);
    }
  }
}