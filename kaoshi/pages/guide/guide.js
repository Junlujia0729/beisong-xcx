// pages/home/home.js
const app = getApp()
const userApi = require('../../libraries/user.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    guide1:0,
    guide2:0,
    select_level:0,
    select_subject: 0,
    level_word:'',
    subject_word: '',
    items:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.setData({
      select_level: app.globalData.level,
      select_subject: app.globalData.subject,
    });
    userApi.xcx_login_new(function (){
      userApi.requestAppApi_POST(app.globalData.mainDomain + "ZpXcxApi/recite_params", {}, function (res) {
        that.setData({
          items: res.data.data.identify
        })
      }); 
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
    if (app.globalData.mobile == "") {
      //未设置电话号码
      // wx.navigateTo({
      //   url: '../getphone/getphone',
      // })
    }
  },
  gotoClass: function (e) {
    
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
    const that = this;
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
    return {
      title: '资格证考试宝典',
      path: '/pages/home/home',
      success: function (res1) {
        var scene = 10007;
        if (res1.shareTickets != undefined) {
          scene = 10044;
        }
        
        // 转发成功,通过res1.shareTickets[0]获取转发ticket
        //console.log(res1.shareTickets[0]);
      },
      fail: function (res1) {
        // 转发失败
        //console.log(res1);
      }
    }
  },
  // 选择学段
  chooseType: function (e) {
    let that = this;
    that.setData({
      select_level: e.currentTarget.dataset.level,
      level_word : e.currentTarget.dataset.words
    });
    setTimeout(function(){
      that.setData({
        guide1: e.currentTarget.dataset.level,
        guide2: 1
      }); 
    },200)
  },
  //重新选择
  chooseAgain:function(e){
    let that = this;
    that.setData({
      guide1:0,
      guide2:0
    }); 
  },
  // 选择学科
  chooseSubject: function (e) {
    let that = this;
    let select_subject = e.currentTarget.dataset.type;
    app.globalData.level = that.data.select_level;
    app.globalData.subject = e.currentTarget.dataset.type;
    that.setData({
      select_subject: select_subject,
    });
    setTimeout(function () {
      that.setData({
        guide2: 0
      });
      userApi.requestAppApi_POST(app.globalData.mainDomain + "ZpXcxApi/recite_identify", { level: that.data.select_level, subject: select_subject }, function (res) {
        if (res.data.code == 200) {
          wx.navigateBack({
            
          });
          console.log('设置成功')
        }
      });
      
    }, 200)
  }
  
})