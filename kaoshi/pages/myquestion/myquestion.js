// pages/myquestion/myquestion.js
const app = getApp()
const userApi = require('../../libraries/user.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/myqa", {}, function (res) {
      if (res.data.code == 200) {
        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].like_type) {
            res.data.data[i].likeimg = 'http://imgs.52jiaoshi.com/1559804927.png'
          } else {
            res.data.data[i].likeimg = 'http://imgs.52jiaoshi.com/1559636218.png'
          }

        }
        that.setData({
          datas: res.data.data
        })
      }
    });
    wx.setNavigationBarTitle({
      title: '我的提问'
    })
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

    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/myqa", {}, function (res) {
      if (res.data.code == 200) {
        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].like_type) {
            res.data.data[i].likeimg = 'http://imgs.52jiaoshi.com/1559804927.png'
          } else {
            res.data.data[i].likeimg = 'http://imgs.52jiaoshi.com/1559636218.png'
          }

        }
        that.setData({
          datas: res.data.data
        })
      }
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

  //点赞
  like: function (e) {
    console.log(e);
    let that = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let _likenum = e.currentTarget.dataset.likenum;
    let likestr = 'datas[' + index + '].likeimg';
    let likesnum = 'datas[' + index + '].likenum';
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/qalike", { id: id }, function (res) {
      that.setData({
        [likestr]: 'http://imgs.52jiaoshi.com/1559804927.png',
        [likesnum]: ++_likenum
      })
      console.log(that.data.datas)
    });
  },
  todetail: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../answerdetail/answerdetail?id=' + id,
    })
  },
})