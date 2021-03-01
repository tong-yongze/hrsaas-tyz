<template>
  <div>
    <!-- action给个#防止报错 -->
    <!-- file-list 是上传的文件列表 可以绑定到上传组件上 让上传组件来显示 -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :file-list="fileList"
      :class="{disabled :fileComputed}"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imgUrl" alt="" style="width: 100%">
    </el-dialog>
  </div>

</template>

<script>
export default {
  data() {
    return {
      fileList: [{ url: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1382922441,1620330777&fm=26&gp=0.jpg' }],
      showDialog: false,
      imgUrl: ''
    }
  },
  computed: {
    // 如果它为true 表示就不应该显示 + 号上传了
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
      console.log(file)
      this.imgUrl = file.url
      this.showDialog = true
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card{
  display: none;
}
</style>
