import { Comic } from "../models/comic";
import request, { Response } from 'request';
import cheerio from 'cheerio';

export class Crawler {

  static timTruyen(query: string): Promise<Comic> {
    let link = '';
    
    return new Promise((resolve, reject) => {
      request.get(link, (error: any, response: Response, body: any) => {
        if (error) {
          reject(error);
          return;
        }


        // TODO
        
      });
    });
  }
}