import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
// 状态
const state = {
  token: getToken(), // 设置token 为共享状态 初始化vuex 的时候 就先从缓存中读取
  userInfo: {} // 定义一个空对象
}
const mutations = {
  setToken(state, token) {
    state.token = token // 将数据设置给vuex
    // 一旦token发生变化 就同步给缓存
    setToken(token)
  },
  removeToken(state) {
    state.token = null // 将 vuex 的数据置空
    removeToken() // 一旦vuex 置空 同步到缓存
  },
  setUserInfo(state, result) {
    // 更新一个对象
    state.userInfo = result // 这样是响应式
    // state.userInfo = {...result} // 是响应式  属于浅拷贝
    // state.userInfo = ['username'] = result // 不是响应式
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  async login(context, data) {
    // 调用api接口
    const result = await login(data) // 拿到token
    context.commit('setToken', result) // 设置token
    // 拿到token说明登录成功
    setTimeStamp()
    // 设置当前的时间戳
  },
  // 获取用户资料action
  async getUserInfo(context) {
    // 用户的基本资料
    const result = await getUserInfo() // 获取返回值
    // 获取用户详情  用户的详情数据
    const baseInfo = await getUserDetailById(result.userId)
    context.commit('setUserInfo', { ...result, ...baseInfo }) // 提交到 mutations
    return result // 这里为什么要返回 为后期做权限留下伏笔
  },
  // 登出的action
  logout(context) {
    // 删除token
    context.commit('removeToken') // 不仅仅删除了vuex中的 还删除了缓存中的
    // 删除用户资料
    context.commit('removeUserInfo') // 删除用户信息
    // 重置路由
    resetRouter()
    // 还有一步  vuex中的数据是不是还在
    // 要清空permission模块下的state数据
    // vuex中 user子模块  permission子模块
    // 子模块调用子模块的action  默认情况下 子模块的context是子模块的
    // 父模块 调用 子模块的action
    context.commit('permission/setRoutes', [], { root: true })
    // 子模块调用子模块的action 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
