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

/** *
 *
 * 根据用户id 获取用户详情
 * **/
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
    // axios 默认请求类型是get  可以省略不写
  })
}

export function logout() {

}
