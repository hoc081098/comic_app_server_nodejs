const createError = require('http-errors');
import express, { NextFunction } from 'express';
import path from 'path';
const cookieParser = require('cookie-parser');
import logger from 'morgan';

import indexRouter from './routes/index';
import detailRouter from './routes/detail';
import chapterRouter from './routes/chapter';
import searchRouter from './routes/search';
import categoriesRouter from './routes/categories';
import { Error } from './models/error';
// tslint:disable-next-line: no-implicit-dependencies
import { ErrorRequestHandler, Request, Response } from 'express-serve-static-core';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/comic_detail', detailRouter);
app.use('/chapter_detail', chapterRouter);
app.use('/search_comic', searchRouter);
app.use('/categories', categoriesRouter);

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
  res.status(statusCode).json(error);
};
app.use(errorHandler);

export default app;
