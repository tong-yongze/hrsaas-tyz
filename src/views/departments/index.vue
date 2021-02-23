<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容 - 头部 -->
      <el-card class="tree-card">
        <tree-tools :tree-node="company" :is-toot="true" @addDepts="addDepts" />
        <!-- 放置一个el-tree  -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <tree-tools slot-scope="{ data }" :tree-node="data" @addDepts="addDepts" @editDepts="editDepts" @delDepts="getDepartments" />
        </el-tree>
      </el-card>
    </div>
    <!-- 放置弹出层 -->
    <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import AddDept from './components/add-dept'

import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        label: 'name' // 表示从这个属性显示内容
        // children: 'children' // 从这个属性去找子节点
      },
      showDialog: false, // 默认不显示
      node: null, // 记录当前点击的node节点
      loading: false // 当前的控制显示弹层
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      this.loading = true
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(result.depts, '') // 需要将其转化成树形结构
      console.log(result)
      this.loading = false
    },
    // 控制tree-tools 点击添加子部门的事件
    addDepts(node) {
      this.showDialog = true
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.node = node
    },
    editDepts(node) {
      this.showDialog = true
      this.node = node
      // console.log(this.$refs.addDept)
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

<style scoped>
  .tree-card {
    padding: 30px 140px;
    font-size: 14px;
  }
</style>
