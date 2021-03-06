// 专门处理权限路由的模块
import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  // 一开始 肯定拥有静态路由的权限
  routes: constantRoutes// 路由表 表示当前所拥有的所有路由的数组
}
const mutations = {
  // 定义修改routes的mutations
  // payload 认为是我们登录成功需要添加的新路由
  setRoutes(state, newRoutes) {
    // 每次都是在静态路由的基础上去加新的路由
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  // 筛选权限路由
  // 第二个参数为当前用户的所拥有的菜单权限
  // asyncRoutes 是所有的动态路由
  // asyncRoutes 是数组 里面是对象 [{path: 'setting',name: 'setting'},{}]
  filterRoutes(context, menus) {
    const routes = []
    // 筛选出 动态路由中和menus中能够对上的路由
    menus.forEach(key => {
      // key 是标识
      // asyncRoutes 找有没有对象中的name 属性等于 key的  如果找不到就没有权限  如果找到了就筛选出来
      routes.push(...asyncRoutes.filter(item => item.name === key)) // 得到一个数组  有可能有元素 也有可能是空数组
    })
    // 得到的 routes 是所有模块中满足权限要求的路由数组
    // routes 就是当前用户所拥有的 动态路由的权限
    context.commit('setRoutes', routes) // 将动态路由提交给 mutations
    return routes // 这里的return  state数据 是用来显示左侧菜单用的 return 是给路由 addRoutes用的
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
