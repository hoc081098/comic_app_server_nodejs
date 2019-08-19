import { Crawler } from "./index.crawler";
import { RequestHandler } from "express";
import { Error } from "../models/error";
import { log } from "../util";

export class Controller {
  newestComics: RequestHandler = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const comics = await Crawler.newestComics(page);
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
    try {
      const page = parseInt(req.query.page) || 1;
      const comics = await Crawler.updatedComics(page);
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

  mostViewedComics: RequestHandler = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const comics = await Crawler.mostViewedComics(page);
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