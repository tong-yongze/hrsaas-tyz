// 负责管理所有地自定义指令

export const imagerror = {
  // 指令对象 会在当前dom元素插入到节点之后执行
  inserted(dom, options) {
    // options 是 指令中的变量的解释 其中有一个树形叫做 value
    // dom 表示当前指令作用的dom对象
    // dom 认为此时就是图片
    dom.src = dom.src || options.value // 初始化的时候 如果有值  则赋值 如果没有值 则需要默认值赋值
    // 当图片有地址  但是地址没有加载成功的时候  会报错 会触发图片的一个事件 => onerror
    dom.onerror = function() {
      // 当图片出现异常的时候 会将指令配置度的默认图片设置为改图片的内容
      // dom 可以注册error 事件
      dom.src = options.value // 这里不能写死
    }
  },
  //
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value
  }
}

