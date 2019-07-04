// components/comment/comment.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cindex:{
      type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: 0, // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    comment: { // 属性名
      type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: [], // 属性初始值（可选），如果未指定则会根据类型选择一个
      //observer: function (newVal, oldVal) { } // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    cmtImageLoad: function (e) {
      //单位rpx
      var originWidth = e.detail.width * px2rpx,
        originHeight = e.detail.height * px2rpx,
        ratio = originWidth / originHeight;
      var viewWidth = 710, viewHeight; //设定一个初始宽度
      //当它的宽度大于初始宽度时，实际效果跟mode=widthFix一致
      if (originWidth >= viewWidth) {
        //宽度等于viewWidth,只需要求出高度就能实现自适应
        viewHeight = viewWidth / ratio;
      } else {
        //如果宽度小于初始值，这时就不要缩放了
        viewWidth = originWidth;
        viewHeight = originHeight;
      }
    },
    onCmtImageClick: function (e) {
      var that = this;
      var images = that.data.comment.images;
      var current = e.currentTarget.dataset.src;
      wx.previewImage({
        current: current,
        urls: images,//内部的地址为绝对路径
        fail: function () {
        },
        complete: function () {
        },
      })
    },
    onDianzanClick: function (e) {
      var myEventDetail = e.currentTarget.dataset; // detail对象，提供给事件监听函数
      myEventDetail.cindex = this.data.cindex;
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('dianzanevent', myEventDetail, myEventOption)
    },
    onReplyClick: function (e) {
      var myEventDetail = e.currentTarget.dataset; // detail对象，提供给事件监听函数
      myEventDetail.cindex = this.data.cindex;
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('replyevent', myEventDetail, myEventOption)
    }
  }
})
