<template>
  <el-dialog title="分配角色" :visible="showRoleDialog">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleIds">
      <!-- 选项 -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small"@click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      // 用户 id  当前要处理得哪个用户
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [], // 负责存储当前 所有角色id
      roleIds: [] // 这个数组负责存储  当前用户所拥有得角色id
    }
  },
  created() {
    // 获取所有的角色
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 }) // 默认值取10条数据  角色数量不会太多
      // rows 是要循环得记录
      this.list = rows
    },
    // 这个方法是什么时候调用？ props 传值是异步的  所以这里不用this.userId
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id) // 将用户所拥有的角色赋值给当前用户的对象
      this.roleIds = roleIds
    },
    async btnOK() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      // 关闭弹层
      this.$emit('update:showRoleDialog', false)
    },
    btnCancel() {}
  }
}
</script>
