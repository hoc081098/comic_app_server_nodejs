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
function escapeHTML(s) {
    return s.replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '');
}
exports.escapeHTML = escapeHTML;
/**
 *
 */
const escapeRegExp = (str) => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
const chars = '.$[]#/%'.split('');
const charCodes = chars.map((c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
const charToCode = {};
const codeToChar = {};
chars.forEach((c, i) => {
    charToCode[c] = charCodes[i];
    codeToChar[charCodes[i]] = c;
});
const charsRegex = new RegExp(`[${escapeRegExp(chars.join(''))}]`, 'g');
const charCodesRegex = new RegExp(charCodes.join('|'), 'g');
const encode = (str) => str.replace(charsRegex, (match) => charToCode[match]);
exports.encode = encode;
const decode = (str) => str.replace(charCodesRegex, (match) => codeToChar[match]);
exports.decode = decode;
//# sourceMappingURL=util.js.map