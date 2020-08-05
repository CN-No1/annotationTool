import { RouteConfig } from 'vue-router';

const Import = (file: string) => (resolve: any) =>
  require([`@/views/${file}.vue`], resolve);

const routes: Array<RouteConfig> = [
  {
    name: '',
    path: '/',
    redirect: '/reSqeAnnotation',
  },
  {
    name: '首页',
    path: '/home',
    component: Import('index'),
  },
  {
    name: '重复序列标注',
    path: '/reSqeAnnotation',
    component: Import('reSqeAnnotation/index'),
  },
];

export default routes;
