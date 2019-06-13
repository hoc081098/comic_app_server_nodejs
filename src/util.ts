const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
console.log(`NODEJS running: env = '${env}'`);

if (env === 'development') {
  process.env['DEBUG'] = 'comic-app-server:server';
}

import debug from 'debug';

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

export { isValidURL, log, escapeHTML };