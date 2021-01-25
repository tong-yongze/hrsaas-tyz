// 权限拦截在路由跳转 导航守卫

import router from '@/router'
import store from '@/store' // 引入 store 实例 和组件中的this.$store 是一回事
import nProgress from 'nprogress'// 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
// 不需要导出  因为只需要让代码执行即可
// 前置守卫
// next  是前置守卫必须执行的钩子 next必须执行  如果不执行  页面就死了
// next() 放过
// next(false) 跳转终止
// next(地址) 跳转到某个地址
const whiteList = ['/login', '/404'] // 定义白名单
router.beforeEach((to, from, next) => {
  nProgress.start() // 开启进度条
  //  如果有token
  if (store.getters.token) {
    if (to.path === '/login') {
      // 如果要访问的是 登录页
      next('/') // 跳到主页
    } else {
      next()
    }
  } else {
    // 如果木有token 情况下
    if (whiteList.indexOf(to.path) > -1) {
      // 表示要去的地址在白名单
      next()
    } else {
      next('/login')
    }
  }
  nProgress.done() // 解决手动切换地址时 进度条不关闭的问题
})
// 后置守卫
router.afterEach(() => {
  nProgress.done() // 关闭进度条
})
