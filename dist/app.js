"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const createError = require('http-errors');
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookieParser = require('cookie-parser');
const morgan_1 = __importDefault(require("morgan"));
/**
 * Import routes
 */
const index_1 = __importDefault(require("./index"));
const detail_1 = __importDefault(require("./detail"));
const chapter_detail_1 = __importDefault(require("./chapter_detail"));
const search_comic_1 = __importDefault(require("./search_comic"));
const category_1 = __importDefault(require("./category"));
const app = express_1.default();
/**
 * Basic setup
 */
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
/**
 * Use routes
 */
app.use('/', index_1.default);
app.use('/comic_detail', detail_1.default);
app.use('/chapter_detail', chapter_detail_1.default);
app.use('/search_comic', search_comic_1.default);
app.use('/category', category_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
const errorHandler = (err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // send the error response
    const statusCode = err.status || 500;
    const error = {
        message: `An error occurred: '${err}'`,
        status_code: statusCode,
    };
    util_1.log({ err });
    res.status(statusCode).json(error);
};
app.use(errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map