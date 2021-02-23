
import request from '@/utils/request'

/**
 * 获取组织架构的数据
 * **/
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

/**
 * 删除组织架构的数据
 * **/
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
/**
 * 增加组织架构的数据
 * **/
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}
/**
 * 获取部门详情
 * **/
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}
