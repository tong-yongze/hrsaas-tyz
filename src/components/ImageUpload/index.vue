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
      :on-change="changeFile"
      :http-request="upload"
      :class="{disabled: fileComputed }"
      :on-remove="handleRemove"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" :percentage="percent" style="width: 180px" />
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
      fileList: [], // 图片地址设置为数组
      showDialog: false, // 控制图片的显示或者隐藏
      imgUrl: '',
      currentFileUid: null, // 记录当前正在上传的Uid
      percent: 0, // 记录当前的百分比
      showPercent: false // 默认不显示进度条
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
      // console.log(file)
      this.imgUrl = file.url
      this.showDialog = true
    },
    // file 是要删除的文件
    // fileList 是删过之后的文件
    handleRemove(file) {
      // console.log(file)
      // console.log(fileList)
      // console.log(this.fileList)
      // this.fileList = fileList
      // 将当前删除的文件排除在外
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    // 不能用push 这个钩子会执行多次
    changeFile(file, fileList) {
      // file 是当前的文件 fileList 是当前的最新数组 this.fileList 中 fileList =》 upload组件 就会根据fileList 的变化而去渲染
      // console.log(123)
      //   console.log(file)
      //   console.log(fileList)
      // 如果当前fileList 没有该文件的话
      this.fileList = fileList.map(item => item)
      // 这里为何暂时不成功呢 ？  因为现在还没有上传所以第二次进来的数据  一定是个空的
      // 如果完成上传动作了 第一次进入和第二次进去的fileList 的长度应该是1 应该都有数据
      // 上传成功 =>  数据才能进来 => 腾讯云cos
    },
    beforeUpload(file) {
      // console.log(file)
      // 先检查文件类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        // 如果不存在
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false // 上传终止
      }
      // 检查文件大小  5M
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        //   超过了限制的文件大小
        this.$message.error('上传的图片大小不能大于5M')
        return false
      }
      // 已经确定当前上传的就是当前的这个file了
      // console.log(file)
      this.currentFileUid = file.uid
      this.showPercent = true
      return true // 最后一定要return  true
    },
    // 进行上传操作
    upload(params) {
      // console.log(params.file)
      if (params.file) {
        // 执行上传操作
        cos.putObject({
          // 配置
          Bucket: 'hrsaas-1305102544', // 存储桶
          Region: 'ap-nanjing', // 地域
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式
          onProgress: (params) => {
            console.log(params)
            this.percent = params.percent * 100
          }
          // 上传到腾旭云 =》 哪个存储桶  哪个地域地存储桶
        }, (err, data) => {
          // data 返回数据之后  应该如何处理
          // console.log(err || data)
          // data 中有个 statusCode === 200 的时候说明上传成功
          if (!err && data.statusCode === 200) {
            // 此时说明文件上传成功  要获取成功的返回地址
            // fileList 才能显示到上传组件上 此时我们要将fileList 中的数据的url地址变成 现在上传成功的地址
            // fileList 是一个数组
            // 需要知道当前上传成功的是哪一张图片
            this.fileList = this.fileList.map(item => {
              // 取找谁的 uid 等于刚刚记录下来的 id
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值给 原来地 url 属性
                return { url: 'http://' + data.Location, upload: true }
                // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                // 保存 =》 图片有大有小 =》 上传速度有快又慢
              }
              return item
            })
            // 关闭进度条  重置百分比
            setTimeout(() => {
              this.showPercent = false
              this.percent = 0
            }, 1000)
            // 将上传成功的地址  回写到了fileList 中  fileList 变化 =》upload组件 就会根据fileList的变化而去渲染视图
          }
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
