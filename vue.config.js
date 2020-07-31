/**
 * @Author : ChangJun
 * @Date : 2019/10/21
 * @Version : 1.0
 * @Content : 架构配置文件
 */

// const CompressionWebpackPlugin = require('compression-webpack-plugin');
const project_config = require('./src/config');
const ENV = process.env.VUE_APP_CURRENTMODE;
const isBuild = process.env.VUE_APP_CURRENTMODE !== 'development';
// 需要gzip压缩的文件后缀
const productionGzipExtensions = ['js', 'css'];
// proxy接口代理对象
let proxyObj = {};
project_config.Proxy.dev.forEach((v) => {
  proxyObj[v] = {
    target: project_config.Proxy.domain[v][ENV],
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      [`^/${v}`]: '',
    },
  };
});
module.exports = {
  publicPath: '/',
  assetsDir: 'static',
  productionSourceMap: false,
  configureWebpack: (config) => {},
  css: {},
  // webPack-dev-server的所有选项
  devServer: {
    host: '',
    port: '8989',
    https: false,
    open: true, // 自动启动浏览器
    proxy: proxyObj,
    before: (app) => {},
  },
};
