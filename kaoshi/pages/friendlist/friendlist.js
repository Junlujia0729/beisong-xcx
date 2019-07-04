// pages/friend/friend.js

const app = getApp()
const userApi = require('../../libraries/user.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas:[],
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    var id = 0;
    if (options.id) {
      id = options.id;
      that.setData({
        id: options.id
      });
    }
    userApi.requestAppApi_POST(app.globalData.mainDomain + "ZpXcxApi/grade_list", {
      id:id
    }, function (res) {
      console.log(res.data.data.data);
      if (res.data.code == 200){
        that.setData({
          datas:res.data.data.data
        });
      }
      
    });
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
    wx.stopPullDownRefresh();
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

  }
})