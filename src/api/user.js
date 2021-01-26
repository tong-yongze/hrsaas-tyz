import request from '@/utils/request'

/**
 * 登录接口封装
 * **/
export function login(data) {
  // 返回一个 promise 对象
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

/**
 *  获取用户的基本资料
 *
 * **/
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

export function logout() {

}
