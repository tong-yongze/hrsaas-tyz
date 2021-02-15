// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'

const TimeOut = 3600 // 定义超时时间

const service = axios.create({
  // 当执行 npm run dev => .evn.development => /api => 跨域代理
  // 设置axios请求的基础的基础地址
  baseURL: process.env.VUE_APP_BASE_API, // npm run dev => /api npm run bulid => /prod-api
  timeout: 5000 // 设置超时时间
}) // 创建一个axios的实例
service.interceptors.request.use(config => {
  // config 是请求的配置信息
  // 注入token
  // 如果这个里面的token存在  就让这里面的属性存值
  if (store.getters.token) {
    // 只有在有 token 情况下 才有必要去检查时间戳是否超时
    if (IsCheckTimeOut()) {
      // 如果它为 true 表示过期了
      // token 没用了 因为超时了
      store.dispatch('user/logout') // 登出操作
      // 跳转到登录页
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须要返回的
}, error => {
  return Promise.reject(error)
}) // 请求拦截器

// 响应拦截器
service.interceptors.response.use(response => {
  // axios 默认加了一层data
  const { success, message, data } = response.data
  // 要根据 success 的成功与否决定下面的操作
  if (success) {
    return data
  } else {
    // 业务已经错误了 不能进then了 应该进catch
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
  }
}, error => {
  // error 信息 里面 response 的对象
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当等于10002的时候 后端告诉我token超时了
    store.dispatch('user/logout') // 登出action  删除 token
    router.push('/login')
  } else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接接入catch
})
// 是否超时
//  超时逻辑 （当前时间 减去 缓存中的事件） 是否大于时间差
function IsCheckTimeOut() {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service // 导出axios 实例
