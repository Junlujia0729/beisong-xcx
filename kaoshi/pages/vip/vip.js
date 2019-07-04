// pages/vip/vip.js
const app = getApp()
const userApi = require('../../libraries/user.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    step: 0,
    timestart: '',
    timeend: '',
    appload: '',
    imgurl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var _imgurl = 'https://api.52jiaoshi.com/Public/images/app_new.png';
    that.imageDown(_imgurl);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  openvip:function(){
    let that = this;
    if (app.globalData.mobile) {
      wx.showToast({
        title: '请下载app购买',
        icon: 'none',
        duration: 600,
        success: function () {
          setTimeout(function () {
            that.appload();
          }, 800)
        }
      })
    } else {
      wx.showToast({
        title: '请到【我的】-- 绑定账号绑定手机号',
        icon: 'none',
        duration: 1000
      })
    }
  },
  stepshow: function () {
    var that = this;
    if (that.data.step) {
      that.setData({
        step: 0,
        height: '100%'
      })
    } else {
      that.setData({
        step: 1,
        height: '2100rpx'
      })
    }
  },
  maskhide: function () {
    var that = this;
    that.setData({
      appload: 0,
    })
  },
  appload: function () {
    var that = this;
    that.setData({
      appload: 1,
    })
  },
  timestart: function (e) {
    var _this = this;
    _this.setData({ timestart: e.timeStamp });
    console.log(e.timeStamp);
  },
  //点击结束的时间
  timeend: function (e) {
    var _this = this;
    _this.setData({ timeend: e.timeStamp });
    console.log(e.timeStamp);
  },
  saveimg: function (e) {
    let that = this;
    let fileimg = that.data.imgurl
    var times = that.data.timeend - that.data.timestart;
    console.log(times);
    if (times > 300) {
      console.log("长按");
      wx.getSetting({
        success(ss) {
          console.log(ss);
          if (!ss.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                wx.saveImageToPhotosAlbum({
                  filePath: fileimg,
                  success(ires) {
                    wx.showModal({
                      title: '提示',
                      content: '保存成功，赶快扫码下载APP吧！',
                      showCancel: false
                    })
                  }
                })
              }
            })
          } else {
            wx.saveImageToPhotosAlbum({
              filePath: fileimg,
              success(ires) {
                wx.showModal({
                  title: '提示',
                  content: '保存成功，赶快扫码下载APP吧！',
                  showCancel: false
                })
              }
            })
          }
        }
      })
    }

  },
  imageDown: function (url) {
    var that = this;
    var fileimg = '';
    wx.downloadFile({
      url: url, //仅为示例，并非真实的资源
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        fileimg = res.tempFilePath;
        that.setData({
          imgurl: fileimg
        })

      }, fail: function () {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '下载图片失败',
        })
      }
    })
  },
})