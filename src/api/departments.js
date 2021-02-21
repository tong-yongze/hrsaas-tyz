
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
export function delDepartment(id) {
  return request({
    url: ` /company/department/${id}`,
    method: 'Delete'
  })
}
