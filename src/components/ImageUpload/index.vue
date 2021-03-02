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
      :before-upload="beforeUpload"
      :file-list="fileList"
      :http-request="upload"
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
import COS from 'cos-js-sdk-v5' // 引入腾讯云的包
// 实例化COS 对象
const cos = new COS({
  SecretId: 'AKIDfFfqlfu9bu2vZw6gW7RkocAUWbbMGAvK', // 身份识别 ID
  SecretKey: 'Yt9CzB7e1KRZjolYTEnoY7V19Wnuszzp' // 身份密钥
})
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
      // 上传成功 =>  数据才能进来 => 腾讯云cos
    },
    beforeUpload(file) {
      console.log(file)
      // 先检查文件类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        // 如果不存在
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false // 上传终止
      }
      // 检查文件大小  5M
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        //   超过了限制的文件大小
        this.$message.error('上传的图片大小不能大于5M')
        return false
      }
      return true // 最后一定要return  true
    },
    // 进行上传操作
    upload(params) {
      // console.log(params.file)
      if (params.file) {
        // 执行上传操作
        cos.putObject({
          Bucket: 'hrsaas-1305102544', // 存储桶
          Region: 'ap-nanjing', // 地域
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          SorageClass: 'STANDARD' // 上传的模式类型 直接默认 标准模式
          // 上传到腾旭云 =》 哪个存储桶  哪个地域地存储桶
        }, function(err, data) {
          // data 返回数据之后  应该如何处理
          console.log(err || data)
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card{
  display: none;
}
</style>
