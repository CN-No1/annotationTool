import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';
import routes from './routes';
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to: Route, from: Route, next: any) => {
  next();
});

router.afterEach((to: Route, from: Route) => {});

export default router;
