// pages/moreques.js
const app = getApp()
const userApi = require('../../libraries/user.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    levelid:'',
    tasks_list:[],
    title:'',
    gol_task: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    var _levelid = 0;
    if (options.levelid){
      _levelid = options.levelid;
    }
    

    userApi.requestAppApi_GET(app.globalData.mainDomain + "ZpXcxApi/recite_tasks", { level: app.globalData.level > 0 ? app.globalData.level : 1, subject: app.globalData.subject > 0 ? app.globalData.subject : 11 }, function (res) {
      let tasks = res.data.data.tasks;
      console.log(tasks);
      for(var i in tasks){
        if (tasks[i].levelid == _levelid) {

          that.setData({
            tasks_list: tasks[i].list,
            title: tasks[i].name
          });
        }
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

  submitformid: function (e) {
    var that = this;
    userApi.requestAppApi_POST(app.globalData.mainDomain + "ZpXcxApi/matrix_formid", {
      formid: e.detail.formId
    }, function (res) {
      console.log(e);
      that.gotoTaskDetail(e.detail.value.task);
    });
  },

  gotoTaskDetail: function (task) {
    let that = this;
    let _gol_task = task;
    that.setData({
      gol_task: _gol_task
    })
    if (app.globalData.mobile == "") {
      //未设置电话号码
      wx.navigateTo({
        url: '../getphone/getphone',
      })
    } else {
      wx.navigateTo({
        url: '../detail/detail?id=' + task
      })
    }
  },
  redirectToDetail: function () {
    let task = this.data.gol_task;
    wx.redirectTo({
      url: '../detail/detail?id=' + task,
    });
  },
})