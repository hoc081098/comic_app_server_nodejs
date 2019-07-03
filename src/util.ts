const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
console.log(`NODEJS running: env = '${env}'`);

if (env === 'development') {
  process.env['DEBUG'] = 'comic-app-server:server';
}

import debug from 'debug';
import request, { Response } from 'request';

const log = debug('comic-app-server:server');

function isValidURL(str: string): boolean {
  const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return pattern.test(str);
}

function escapeHTML(s: string) {
  return s.replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '');
}

/**
 * 
 */

const escapeRegExp = (str: string) => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
const chars = '.$[]#/%'.split('');
const charCodes = chars.map((c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
const charToCode: { [key: string]: string } = {};
const codeToChar: { [key: string]: string } = {};
chars.forEach((c, i) => {
  charToCode[c] = charCodes[i];
  codeToChar[charCodes[i]] = c;
});
const charsRegex = new RegExp(`[${escapeRegExp(chars.join(''))}]`, 'g');
const charCodesRegex = new RegExp(charCodes.join('|'), 'g');

const encode = (str: string) => str.replace(charsRegex, (match) => charToCode[match]);
const decode = (str: string) => str.replace(charCodesRegex, (match) => codeToChar[match]);

/**
 * GET body from url
 * @param url string
 * @returns a Promise resolve body response
 */
function GET(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    request.get(url, (error: any, _response: Response, body: any): void => {
      if (error) {
        reject(error);
        return;
      }
      resolve(body);
    });
  });
}

export { isValidURL, log, escapeHTML, encode, decode, GET };