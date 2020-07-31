module.exports = {
  Interfaces: {},
  Proxy: {
    dev: ['annotation'],
    domain: {
      annotation: {
        development: 'http://192.168.11.88:7888/api/v2/admin/', // 本地
        release: 'http://192.168.11.24:7888/api/v2/admin/',
        production: 'http://140.0.189.205/',
      },
    },
  },
  ProjectName: 'Annotation',
  Code: {
    SUCCESS: 200,
    NO_LIMIT: 401,
    AUTH_FAIL: 2002,
    AUTH_OUT_TIME: 2004,
  }, // 接口请求错误码
};
