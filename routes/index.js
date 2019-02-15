const express = require('express');
const router = express.Router();
const debug = require('debug')('comic-app-server');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.status(200).send('<h3>Hello</h3>')
});

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

let cheerio = require('cheerio');
let request = require('request');

router.get('/truyen_de_cu', async (req, res) => {
  try {
    let comics = await truyenDeCu();
    res.status(200).json(comics);
  } catch (e) {
    debug(e);
    res.status(500).json({
      message: 'Internal error',
      statusCode: 500
    });
  }
});

router.get('/truyen_moi_cap_nhat', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  try {
    let comics = await truyenMoiCapNhat(page);
    res.status(200).json(comics);
  } catch (e) {
    debug(e);
    res.status(500).json({
      message: 'Internal error',
      statusCode: 500
    });
  }
});

router.get('/top_thang', async (req, res) => {
  try {
    let comics = await topThang();
    res.status(200).json(comics);
  } catch (e) {
    debug(e);
    res.status(500).json({
      message: 'Internal error',
      statusCode: 500
    });
  }
});

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

function truyenDeCu() {
  return new Promise((resolve, reject) => {
    let comics = [];

    request.get('http://www.nettruyen.com/', (error, response, body) => {
      if (error) return reject(error);

      let $ = cheerio.load(body);
      $('div.top-comics').find('div.items-slide div.item').each((i, e) => {
        const $e = $(e);
        let slideCaptionAnchor = $e.find('div.slide-caption > a');
        let slideCaptionH3Anchor = $e.find('div.slide-caption > h3 > a');

        comics.push({
          thumbnails: $e.find('a > img.lazyOwl').first().attr('data-src'),
          title: slideCaptionH3Anchor.text(),
          chapters: [
            {
              chapter_name: slideCaptionAnchor.text(),
              chapter_link: slideCaptionAnchor.attr('href'),
              time: $e.find('div.slide-caption > span.time').text().trim(),
            }
          ],
          link: slideCaptionH3Anchor.attr('href'),
        });
      });

      resolve(comics);
    });
  });
}

function truyenMoiCapNhat(page) {
  return new Promise((resolve, reject) => {
    let comics = [];

    request.get(`http://www.nettruyen.com/?page=${page}`, (error, response, body) => {
      if (error) return reject(error);

      let $ = cheerio.load(body);
      $('div#ctl00_divCenter').find('div.row div.item').each((i, e) => {
        const $e = $(e);
        const figure = $e.children('figure').first()

        let chapters = $e.find('figcaption > ul > li').toArray().map(li => {
          let $li = $(li);
          let a = $li.children('a').first()

          return {
            chapter_name: a.text(),
            chapter_link: a.attr('href'),
            time: $li.children('i.time').first().text(),
          }
        });

        let view = (() => {
          let html = figure.find('div > div.view > span').html();
          html = html.replace(/\s{2,}/g, ' ').trim();
          return /((\d{1,3})(\.)?)+/g.exec(html)[0]
        })();

        comics.push({
          thumbnails: figure.find('div > a > img').attr('data-original'),
          title: $e.find('figcaption > h3 > a').text(),
          chapters: chapters,
          link: figure.find('div > a').attr('href'),
          view: view,
        });
      });

      resolve(comics);
    });
  });
}

function topThang(page) {
  return new Promise((resolve, reject) => {
    let comics = [];

    request.get(`http://www.nettruyen.com/?page=${page}`, (error, response, body) => {
      if (error) return reject(error);

      let $ = cheerio.load(body);
      $('div#topMonth').find('li.clearfix').each((i, e) => {
        let $e = $(e);

        let view = (() => {
          let html = $e.find('div.t-item > p.chapter > span').html();
          html = html.replace(/\s{2,}/g, ' ').trim();
          return /((\d{1,3})(\.)?)+/g.exec(html)[0]
        })();

        comics.push({
          thumbnails: $e.find('div.t-item > a > img').attr('data-original'),
          title: $e.find('div.t-item > h3 > a').text(),
          chapters: [
            {
              chapter_link: $e.find('div.t-item > p.chapter > a').attr('title'),
              chapter_name: $e.find('div.t-item > p.chapter > a').attr('href'),
            }
          ],
          link: $e.find('div.t-item > a').attr('href'),
          view: view,
        });
      });
      resolve(comics);
    });
  });
}

module.exports = router;
