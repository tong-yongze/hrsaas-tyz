import store from '@/store'
// 做一个混入对象
export default {
  // 混入对象是组件的选项对象
  methods: {
    // 检查权限
    checkPermission(key) {
      // store.state.user.userInfo.roles.points
      const { userInfo } = store.state.user
      if (userInfo.roles.points && userInfo.roles) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false // 如果没有进去 说明没有权限
    }
  }
}
