// pages/favlist/favlist.js
const app = getApp()
const userApi = require('../../libraries/user.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/fav_knowleage_list ", {}, function (res) {
      that.setData({
        lists:res.data.data
      })
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
    var that = this;
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/fav_knowleage_list ", {}, function (res) {
      that.setData({
        lists: res.data.data
      })
    });
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

  },
  toknowledge:function(e){
    let that = this;
    wx.navigateTo({
      url: '../knowledge/knowledge?id=' + e.currentTarget.dataset.id,
    })
  }
})