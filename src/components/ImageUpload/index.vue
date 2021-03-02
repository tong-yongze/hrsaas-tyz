<template>
  <div>
    <!-- action给个#防止报错 -->
    <!-- file-list 是上传的文件列表 可以绑定到上传组件上 让上传组件来显示 -->
    <!-- upload 显示的是 fileList的内容 -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :file-list="fileList"
      :class="{disabled : fileComputed}"
      :on-remove="handleRemove"
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
      fileList: [{ url: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1091405991,859863778&fm=26&gp=0.jpg' }],
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
    // 点击预览事件
    preview(file) {
      console.log(file)
      this.imgUrl = file.url
      this.showDialog = true
    },
    // file 是要删除的文件
    // fileList 是删过之后的文件
    handleRemove(file, fileList) {
      // console.log(file)
      // console.log(fileList)
      // console.log(this.fileList)
      // this.fileList = fileList
      // 将当前删除的文件排除在外
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      // 这里
    },
    // 不能用push 这个钩子会执行多次
    changeFile(file, fileList) {
      // file 是当前的文件 fileList 是当前的最新数组 this.fileList
      console.log(123)
      //   console.log(file)
      //   console.log(fileList)
      // 如果当前fileList 没有该文件的话
      this.fileList = fileList.map(item => item)
      // 这里为何暂时不成功呢 ？  因为现在还没有上传所以第二次进来的数据  一定是个空的
      // 如果完成上传动作了 第一次进入和第二次进去的fileList 的长度应该是1 应该都有数据
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card{
  display: none;
}
</style>
