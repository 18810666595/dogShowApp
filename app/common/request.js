import queryString from 'query-string';
import _ from 'lodash';

import config from './config';

/**
 * 用 class 的静态方法暴露 request 的 get 和 post 方法
 */
export default class request {
  static async get(url, params) {
    if (params) {
      let pm = queryString.stringify(params);
      url = `${url}?${pm}`;
    }
    console.log('url', url);
    try {
      let response = await fetch(url);
      let result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async post(url, body) {
    let options = _.extend(config.header, {
      body: JSON.stringify(body)
    });
    try {
      let response = await fetch(url, options);
      console.log(response);
      let result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

/**
 * 用 object 的静态方法暴露 request 的 get 和 post 方法
 */
// export default  {
//   async get(url, params) {
//     if (params) {
//       let pm = queryString.stringify(params);
//       url = `${url}?${pm}`;
//     }
//     console.log('url', url);
//     try {
//       let response = await fetch(url);
//       let result = await response.json();
//       console.log(result);
//       return result;
//     } catch (error) {
//       throw error;
//     }
//   },
//   async post(url, body) {
//     let options = _.extend(config.header, {
//       body: JSON.stringify(body)
//     });
//     try {
//       let response = await fetch(url, options);
//       console.log(response);
//       let result = await response.json();
//       console.log(result);
//       return result;
//     } catch (error) {
//       throw error;
//     }
//   }
// }