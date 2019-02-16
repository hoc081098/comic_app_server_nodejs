import { Crawler } from "../crawler/index.crawler";

const debug = require('debug')('comic-app-server');

export class Controller {
    static async truyenDeCu(req: any, res: any) {
        try {
            let comics = await Crawler.truyenDeCu();
            res.status(200).json(comics);
        } catch (e) {
            debug(e);
            res.status(500).json({
                message: 'Internal error',
                statusCode: 500
            });
        }
    };

    static async truyenMoiCapNhat(req: any, res: any) {
        const page: number = parseInt(req.query.page) || 1;
        try {
            let comics = await Crawler.truyenMoiCapNhat(page);
            res.status(200).json(comics);
        } catch (e) {
            debug(e);
            res.status(500).json({
                message: 'Internal error',
                statusCode: 500
            });
        }
    }

    static async topThang(req: any, res: any) {
        try {
            let comics = await Crawler.topThang();
            res.status(200).json(comics);
        } catch (e) {
            debug(e);
            res.status(500).json({
                message: 'Internal error',
                statusCode: 500
            });
        }
    }
}