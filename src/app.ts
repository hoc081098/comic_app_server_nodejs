import { log } from "./util";

const createError = require('http-errors');
import express, { NextFunction } from 'express';
import path from 'path';

const cookieParser = require('cookie-parser');
import logger from 'morgan';

/**
 * Import routes
 */
import indexRouter from './index';
import detailRouter from './detail';
import chapterDetailRouter from './chapter_detail';
import searchComicRouter from './search_comic';
import categoryRouter from './category';
import categoryDetailRouter from './category_detail';

import { Error } from './models/error';
// tslint:disable-next-line: no-implicit-dependencies
import { ErrorRequestHandler, Request, Response } from 'express-serve-static-core';

const app = express();

/**
 * Basic setup
 */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Use routes
 */
const routers: [string, express.Router][] = [
  ['/', indexRouter],
  ['/comic_detail', detailRouter],
  ['/chapter_detail', chapterDetailRouter],
  ['/search_comic', searchComicRouter],
  ['/category', categoryRouter],
  ['/category_detail', categoryDetailRouter],
];
routers.forEach(([p, r]) => {
  app.use(p, r);
  log(`Use route ${p}`);
});

// catch 404 and forward to error handler
app.use(function (req: any, res: any, next: any) {
  next(createError(404));
});

// error handler
const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction): any => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send the error response
  const statusCode = err.status || 500;
  const error: Error = {
    message: `An error occurred: '${err}'`,
    status_code: statusCode,
  };
  log({ err });
  res.status(statusCode).json(error);
};
app.use(errorHandler);

export default app;
