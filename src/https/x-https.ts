/**
 * @Author : ChangJun
 * @Date : 2019/2/13
 * @Version : 1.0
 * @Content : 接口请求通用封装
 */
// @ts-ignore
import qs from 'qs';
import {Notification} from 'element-ui';
import axios from 'axios';
import store from '@/store';
import router from '@/router';

const config = require('../config/index.js');

// 多种类型接口处理(根据各自项目进行修改)
const DEF = [
  {
    fail_handling: (res: { code: number, errmsg: any, }) => {
      if (res.code === 205) {
        Notification.warning({title: '警告', message: res.errmsg || '系统问题，请稍后再试！'});
      } else {
        Notification.error({title: '错误', message: res.errmsg || '系统问题，请稍后再试！'});
      }
    }
  }
];

/**
 * 成功处理
 * @param res
 * @param load
 * @param defEx
 * @param defData
 */
function successParse (res: { data: { code: number, data: object, errmsg: any } }, load: boolean, defEx: boolean, defData: boolean) {
  return new Promise((resolve) => {
    try {
      const obj = res.data;
      if (obj.code === config.Code.SUCCESS) {
        if (defData) {
          resolve(obj.data);
        } else {
          resolve(obj);
        }
      } else {
        // 通用业务失败处理
        if (defEx) {
          DEF[0].fail_handling(obj);
        } else {
          resolve(obj || {});
        }
      }
    } catch (ex) {
      if (defEx) {
        DEF[0].fail_handling({code: -1, errmsg: ''});
      } else {
        resolve({});
      }
    }
  });
}

/**
 * 失败处理
 * @param ex
 * @param load
 * @param defFail
 * @param arg
 * @returns {Promise.<*>|Promise<R>}
 */
function errorParse (ex: { headers: any, status: number, data: { code: number, data: object, errmsg: any } }, load: boolean, defFail: boolean, arg: any) {
  let resData = null;
  return new Promise((resolve, reject) => {
    const obj = ex ? ex.data : {errmsg: ''};

    if (ex.status === 401) {
      // token 失效
      // 判断header中是否有token
      if (ex.headers && ex.headers.authorization) {
        // console.log(ex.headers.authorization);
        // console.log('old:', store.getters.token);
        store.commit('SET_TOKEN', ex.headers.authorization);
        // console.log('new:', store.getters.token);
        const sendList: any = Array.prototype.slice.apply(arg);
        const [url, method, body, options, load, loadMsg, defFail, defEx, defData] = sendList;
        // console.log(url, method, body, options, load, loadMsg, defFail, defEx, defData);
        resolve(send(url, method, body, options, load, loadMsg, defFail, defEx, defData));
      } else {
        DEF[0].fail_handling({code: ex.status || -1, errmsg: obj.errmsg});
        router.push('/login');
      }
    } else if (defFail) {
      DEF[0].fail_handling({code: ex.status || -1, errmsg: obj.errmsg});
    } else {
      resData = {
        code: ex.status,
        errmsg: obj.errmsg
      };
      reject(resData);
    }
  });
}

/**
 * Ajax请求方法
 * @param url 接口地址
 * @param method 请求方式
 * @param body 请求参数
 * @param options header参数
 * @param load 是否显示请求loading
 * @param loadMsg loading的提示
 * @param isForm content-type方式是否为 multipart/form-data
 * @param defFail 统一处理错误
 * @param defEx 统一逻辑错误处理
 * @param defData 统一数据处理
 * @param vailDator Api 校验规则
 * @returns {Promise<U>|*|Promise|Promise.<T>}
 */
function send (url: string, method: string, body: object, options: any, load: boolean, loadMsg: string, defFail: boolean, defEx: boolean, defData: boolean) {
  // 生成请求的url
  // url = !url.startsWith('http') ? `${DOMAIN}${url}` : url
  const opts = {
    ...options
  };
  // console.log(store.getters.token);

  opts.headers = {
    'Accept': 'application/json',
    'Content-Type': options && options.isForm ? 'application/x-www-form-urlencoded' : 'application/json',
    // 'Authorization': 'JWT ' + window.$globalHub.$store.state.auth.token,
    ...opts.headers
  };
  // post form-data请求将参数序列化成 form 参数
  if (options && options.isForm) {
    body = qs.stringify(body);
  }
  if ((body && method === 'get') || (body && method === 'delete')) {
    opts.params = body;
  }
  const arg: any = arguments;
  switch (method) {
    case 'get':
      return axios.get(url, opts)
        .then((res: any) => successParse(res, load, defEx, defData))
        .catch((ex: any) => errorParse(ex && ex.response, load, defFail, arg));
    case 'post':
      return axios.post(url, body, opts)
        .then((res: any) => successParse(res, load, defEx, defData))
        .catch((ex: any) => errorParse(ex.response, load, defFail, arg));
    case 'put':
      return axios.put(url, body, opts)
        .then((res: any) => successParse(res, load, defEx, defData))
        .catch((ex: any) => errorParse(ex.response, load, defFail, arg));
    case 'delete':
      return axios.delete(url, opts)
        .then((res: any) => successParse(res, load, defEx, defData))
        .catch((ex: any) => errorParse(ex.response, load, defFail, arg));
  }
}

export default {
  /**
   * Get / delete
   * @param url 请求链接
   * @param body 入参
   * @param options header 头信息
   * @param load loading
   * @param loadMsg loading信息
   * @param defFail 是否需要统一处理接口错误
   * @param defEx 是否统一处理业务逻辑错误
   * @param defData 是否只返回出参 data 内容
   * @returns {Promise<U>|*|Promise|Promise<T>}
   */
  get (url: string, body: object = {}, options: object = {}, {load = true, loadMsg = '加载中...', defFail = true, defEx = true, defData = true} = {}) {
    return send(url, 'get', body, options, load, loadMsg, defFail, defEx, defData);
  },
  delete (url: string, body: object = {}, options: object = {}, {load = true, loadMsg = '加载中...', defFail = true, defEx = true, defData = true} = {}) {
    return send(url, 'delete', body, options, load, loadMsg, defFail, defEx, defData);
  },
  /**
   * Post / Put
   * @param url 请求链接
   * @param body 入参
   * @param options header 头信息
   * @param load loading
   * @param loadMsg loading信息
   * @param defFail 是否需要统一处理接口错误
   * @param defEx 是否统一处理业务逻辑错误
   * @param defData 是否只返回出参 data 内容
   * @returns {Promise<U>|*|Promise|Promise<T>}
   */
  post (url: string, body: object = {}, options: object = {}, {load = true, loadMsg = '加载中...', defFail = true, defEx = true, defData = true} = {}) {
    return send(url, 'post', body, options, load, loadMsg, defFail, defEx, defData);
  },
  put (url: string, body: object = {}, options: object = {}, {load = true, loadMsg = '加载中...', defFail = true, defEx = true, defData = true} = {}) {
    return send(url, 'put', body, options, load, loadMsg, defFail, defEx, defData);
  },
  // 合并多次请求
  all (list: []) {
    return axios.all(list).then(axios.spread((...args: any) => {
      return args;
    }));
  }
};
