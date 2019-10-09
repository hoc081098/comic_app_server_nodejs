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
app.use('/', indexRouter);
app.use('/comic_detail', detailRouter);
app.use('/chapter_detail', chapterDetailRouter);
app.use('/search_comic', searchComicRouter);
app.use('/category', categoryRouter);
app.use('/category_detail', categoryDetailRouter);

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
