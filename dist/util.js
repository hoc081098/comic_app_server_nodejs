"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
console.log(`NODEJS running: env = '${env}'`);
if (env === 'development') {
    process.env['DEBUG'] = 'comic-app-server:server';
}
const debug_1 = __importDefault(require("debug"));
const log = debug_1.default('comic-app-server:server');
exports.log = log;
function isValidURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return pattern.test(str);
}
exports.isValidURL = isValidURL;
//# sourceMappingURL=util.js.map