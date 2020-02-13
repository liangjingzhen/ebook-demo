import Vue from 'vue'
import Router from 'vue-router'
// noinspection NpmUsedModulesInstalled
import EBook from '@/Ebook'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/ebook'
    },
    {
      path: '/ebook',
      component: EBook
    }
  ]
})
