"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
class Crawler {
    static searchComic(query, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = yield util_1.GET(`https://ww2.mangafox.online/search/${query}/page/${page}`);
            return util_1.bodyToComicList(body);
        });
    }
}
exports.Crawler = Crawler;
//# sourceMappingURL=search.crawler.js.map