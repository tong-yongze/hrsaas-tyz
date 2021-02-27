<template>
  <!-- 公共导入组件 -->
  <upload-excel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employees'

export default {
  methods: {
    async success({ header, results }) {
      // header  results 都是中文数据
      // 新增的员工的属性是一致的
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // var arr = []
      // results.forEach(item => {
      //   var userInfo = {}
      //   Object.keys(item).forEach(key => {
      //     // 现在key是中文
      //     userInfo[userRelations[key]] = item[key] // 将原来中文对应的值 赋值给原来英文对应的值
      //   })
      //   arr.push(userInfo)
      // })
      var newArr = results.map(item => {
        var userInfo = {}
        Object.keys(item).forEach(key => {
          userInfo[userRelations[key]] = item[key]
        })
        return userInfo
      })
      await importEmployee(newArr) // 接收一个数组
      this.$message.success('导入excel成功')
      this.$router.back() // 回到上一个页面
    }
  }
}
</script>

<style>

</style>
