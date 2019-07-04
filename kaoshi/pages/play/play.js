const app = getApp()
const userApi = require('../../libraries/user.js')
// 创建一个页面对象用于控制页面的逻辑
Page({
  data: {
    url:"",
    type:0
  },
  onLoad(params) {
    console.log(params);
    const that = this;
    if (params.roomtype == 99){
      that.setData({
        type:1
      })
    }
    console.log(params.type)
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/ke_play", { id: params.id }, function (res) {
      that.setData({
        url: res.data.data.url
      });
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("show" + this.data.url);
    // if (this.data.oldurl != ""){
    //   this.setData({
    //     url: this.data.oldurl,
    //   });
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //wx.stopVoice();
    // const innerAudioContext = wx.createInnerAudioContext();
    // console.log(innerAudioContext);
    // innerAudioContext.stop();
    // this.setData({
    //   url: this.data.oldurl + "&" + Math.random()
    // });
    //console.log("hide" + this.data.url);
    // wx.navigateBack({
    //   delta:1
    // })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //console.log("unload");
  }
})