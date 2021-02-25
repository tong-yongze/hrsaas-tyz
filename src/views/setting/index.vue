<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 放置内容 -->
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- 左侧的内容 -->
            <el-row style="height: 60px">
              <el-button type="primary" icon="el-icon-plus" size="small" @click="showDiglog=true">新增角色</el-button>
            </el-row>
            <el-table border="" :data="list">
              <el-table-column type="index" align="center" label="序号" width="120px" />
              <el-table-column prop="name" align="center" label="名称" width="240px" />
              <el-table-column prop="description" align="center" label="描述" />
              <el-table-column align="center" label="操作">
                <template slot-scope="{ row }">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 放置分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <el-pagination
                :current-page="page.page"
                :total="page.total"
                :page-size="page.pagesize"
                layout="prev, pager, next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert :closable="false" :show-icon="true" type="info" title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改" />
            <!-- 右边内容 -->
            <!-- 并不是所有的表单都需要 model rules -->
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="formData.companyPhone" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <!-- 放置一个弹层组件 -->
    <el-dialog title="编辑部门" :visible="showDiglog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>

      <!-- 放置footer插槽 -->
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      list: [], // 承接数组
      page: {
        // 放置页码等数据
        page: 1,
        pagesize: 10,
        total: 0
      },
      formData: {
        // 公司信息
        name: '',
        companyAddress: '',
        companyPhone: '',
        mailbox: '',
        remarks: ''
      },
      showDiglog: false, // 控制弹层显示
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空!', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList() // 获取角色列表
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
      console.log(this.formData)
    },
    async deleteRole(id) {
      //  提示
      try {
        await this.$confirm('确认删除该角色吗')
        // 只有点击了确定 才能进入到下方
        await deleteRole(id) // 调用删除接口
        this.getRoleList() // 重新加载数据
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 编辑按钮
    async editRole(id) {
      this.roleForm = await getRoleDetail(id)
      this.showDiglog = true
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    async btnOK() {
      try {
        await this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
        } else {
          // 新增业务
          await addRole(this.roleForm)
        }
        // 重新拉取数据
        this.getRoleList()
        this.$message.success('操作成功！')
        this.showDiglog = false
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      console.log('触发了')
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验
      this.$refs.roleForm.resetFields()
      this.showDiglog = false
    }
  }
}
</script>

<style>

</style>
