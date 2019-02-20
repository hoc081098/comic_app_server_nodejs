const createError = require('http-errors');
import express from 'express';
import path from 'path';
const cookieParser = require('cookie-parser');
import logger from 'morgan';

import indexRouter from './routes/index';
import { Error } from './models/error';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req: any, res: any, next: any) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: any, res: any, next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send the error response
  let statusCode = err.status || 500;
  res
    .status(statusCode)
    .json(<Error>{
      message: `An error occurred: '${err}'`,
      status_code: statusCode
    });
});

export default app;
