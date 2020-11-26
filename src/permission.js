import 'nprogress/nprogress.css';

import NProgress from 'nprogress';

import router from './router';
import { storage } from './utils';

NProgress.configure({ showSpinner: false })
const whiteList = ['/login', '/getpwd', '/register']
router.beforeEach((to, form ,next) => {
  NProgress.start()
  if (storage.get('openid') || storage.get('auth')) {
    if (to.name === 'Auth' || to.name === 'Login') {
      next('/')
    } else {
      next()
    }
    
    NProgress.done()
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      if (to.name === 'Auth') {
        next()
      } else {
        next('Auth')
      }
    }
    
    NProgress.done()
  }
})

router.afterEach(() => {
  NProgress.done()
})
