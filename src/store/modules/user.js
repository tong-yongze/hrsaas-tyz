import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
// 状态
const state = {
  token: getToken() // 设置token 为共享状态 初始化vuex 的时候 就先从缓存中读取
}
const mumations = {
  setToken(state, token) {
    state.token = token // 将数据设置给vuex
    // 一旦token发生变化 就同步给缓存
    setToken(token)
  },
  removeToken(state) {
    state.token = null // 将 vuex 的数据置空
    removeToken() // 一旦vuex 置空 同步到缓存
  }
}
const actions = {
  async login(context, data) {
    // 调用 api 接口
    const result = await login(data)

    context.commit('setToken', result)
  }
}

export default {
  namespaced: true,
  state,
  mumations,
  actions
}
