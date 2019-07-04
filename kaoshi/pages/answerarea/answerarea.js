// pages/answerarea/answerarea.js
const app = getApp()
const userApi = require('../../libraries/user.js')
var px2rpx = 2, windowWidth = 375;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cmtImages:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/qalist", {}, function (res) {
      if (res.data.code == 200) {
        for (var i = 0; i < res.data.data.length;i++){
          if (res.data.data[i].like_type){
            res.data.data[i].likeimg = 'http://imgs.52jiaoshi.com/1559804927.png'
          }else{
            res.data.data[i].likeimg = 'http://imgs.52jiaoshi.com/1559636218.png'
          }
          if (res.data.data[i].pics){
            var imgarr = res.data.data[i].pics.split(',');
            res.data.data[i].imgarr = imgarr;
          }
        }
        that.setData({
          datas: res.data.data
        })
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
    let that = this;
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/qalist", {}, function (res) {
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
  putquestion:function(){
    if (app.globalData.avatar == '' || app.globalData.nickname == '') {
      wx.navigateTo({
        url: '../getuserinfo/getuserinfo',
      })
    }else{
      wx.navigateTo({
        url: '../putquestion/putquestion',
      })
    }
    
  },
  redirectToReplay: function () {
    var that = this;
    wx.redirectTo({
      url: '../putquestion/putquestion',
    })
  },
  //点赞
  like:function(e){
    console.log(e);
    let that = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let _likenum = e.currentTarget.dataset.likenum;
    let likestr = 'datas[' + index +'].likeimg';
    let likesnum = 'datas[' + index + '].likenum';
    let liketype = 'datas[' + index + '].like_type'
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/qalike", {id:id}, function (res) {
      that.setData({
        [likestr]:'http://imgs.52jiaoshi.com/1559804927.png',
        [likesnum]: ++_likenum,
        [liketype]:1
      })
      console.log(that.data.datas)
    });
  },
  todetail:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../answerdetail/answerdetail?id='+id,
    })
  },
  myquestion:function(){
    wx.navigateTo({
      url: '../myquestion/myquestion',
    })
  },
  cmtImageLoad: function (e) {
    var cmtImages = this.data.cmtImages;
    if (!cmtImages[e.currentTarget.dataset.pid]) {
      cmtImages[e.currentTarget.dataset.pid] = [];
    }
    cmtImages[e.currentTarget.dataset.pid].unshift(e.currentTarget.dataset.ori);
    this.setData({
      cmtImages: cmtImages
    })
  },
  clickCmtImage: function (e) {
    var that = this;
    var images = that.data.cmtImages[e.currentTarget.dataset.pid];
    var current = e.currentTarget.dataset.ori;
    wx.previewImage({
      current: current,
      urls: images,//内部的地址为绝对路径
      fail: function () {
      },
      complete: function () {
      },
    })
  }
})