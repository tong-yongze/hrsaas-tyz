// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import { Message } from 'element-ui'
const service = axios.create({
  // 当执行 npm run dev => .evn.development => /api => 跨域代理
  // 设置axios请求的基础的基础地址
  baseURL: process.env.VUE.APP_BASE_API, // npm run dev => /api npm run bulid => /prod-api
  timeout: 5000 // 设置超时时间
}) // 创建一个axios的实例
service.interceptors.request.use() // 请求拦截器

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
  Message.error(error.message) // 提示错误信息
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接接入catch
})

export default service // 导出axios 实例
