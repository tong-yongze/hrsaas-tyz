<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 放置 一个 el-card -->
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置内容 -->
            <el-form ref="userForm" :model="userInfo" :rules="rules" label-width="120px">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="userInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码" prop="password2">
                <el-input v-model="userInfo.password2" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- 放置内容 -->
            <!-- <user-info /> -->
            <!-- vuejs中 内置了一个组件 component  可以是任何组件-->
            <component :is="UserComponent" />
            <!-- 动态组件  可以切换组件  is必须是变量-->
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位信息">
                <router-link :to="`/employees/print/${userId}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- 放置内容 -->
            <component :is="JobComponent" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import UserInfo from './components/user-info'
import JobInfo from './components/job-info'
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'

export default {
  components: {
    UserInfo, JobInfo
  },
  data() {
    return {
      UserComponent: 'UserInfo',
      JobComponent: 'JobInfo',
      userId: this.$route.params.id, // 直接将路由中的参数赋值给 data中的属性
      userInfo: {
        userInfo: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    async saveUser() {
      try {
        // 调用方法时 应该校验
        await this.$refs.userForm.validate()
        // 调用保存信息的接口 将新密码的值替换给原密码的值
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
        this.$message.success('修改用户信息成功')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>

</style>
