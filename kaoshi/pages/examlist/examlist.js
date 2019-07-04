// pages/chapter/chapter.js
const app = getApp()
const userApi = require('../../libraries/user.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas:[],
    chapter_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // let chapter_id = 4394;
    let chapter_id = '';
    if (options.id){
      chapter_id = options.id;
      that.setData({
        chapter_id: chapter_id
      })
    }
    if (options.title) {
      wx.setNavigationBarTitle({
        title: options.title
      })  
    }
    that.initdata(chapter_id);
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
    that.initdata(that.data.chapter_id);
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

  // 展开
  slideup:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    
    var datas = that.data.datas;
    for (var i = 0; i < datas.length; i++) {
      if (i == index) {
        datas[i].show = 0;
      }
    }
    that.setData({
      datas: datas
    });
  },

  // 收起
  slidedown: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var lock = e.currentTarget.dataset.lock;
    if (lock == 1) {
      wx.navigateTo({
        url: '../vip/vip',
      })
      return;
    }
    var datas = that.data.datas;
    for (var i = 0; i < datas.length; i++) {
      if (i == index) {
        datas[i].show = 1;
      }
    }
    that.setData({
      datas: datas
    });
  },

  gotoknowledge: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    var listid = e.currentTarget.dataset.listid;
    wx.getStorage({
      key: 'last_allid',
      success(res) {
        var last_allid = res.data;
        last_allid.knowledgeid = id;
        last_allid.knowledgeListid = listid;
        wx.setStorage({
          key: 'last_allid',
          data: last_allid,
          success: function () {
          }
        })
      },
      fail: function (e) {

      }
    })
    wx.navigateTo({
      url: '../knowledge/knowledge?id=' + id + '&title=' + name,
    })
  },

  initdata:function(id){
    var that = this;
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/chapter_knowleage", { id: id }, function (res) {
      var list = res.data.data.list;
      if (res.data.code == 200) {
        var last_allid = {};
        wx.getStorage({
          key: 'last_allid',
          success(res) {
            last_allid = res.data
            console.log(last_allid);
            for (var i = 0; i < list.length; i++) {
              if (i == 0) {
                list[i].show = 1;
              } else {
                list[i].show = 0;
              }
              if (last_allid.knowledgeListid == list[i].id) {
                list[i].lastpractice = 1;
              } else {
                list[i].lastpractice = 0;
              }
              for (var j = 0; j < list[i].dots.length; j++) {
                if (last_allid.knowledgeid == list[i].dots[j].id) {
                  list[i].dots[j].lastpractice = 1;
                } else {
                  list[i].dots[j].lastpractice = 0;
                }
              }
              list[i].total = list[i].dots.length;
              list[i].num = 0;
            }
            console.log(list);
            that.setData({
              datas: list
            })
          },
          fail: function (e) {

          }
        })
        // 存储掌握知识点
        wx.getStorage({
          key: 'masterjson',
          success(res) {
            var masterArr = res.data;
            for (var i = 0; i < masterArr.length; i++) {
              for (var j = 0; j < list.length; j++) {
                if (masterArr[i].id == list[j].id) {
                  list[j].num = masterArr[i].num
                }
              }
            }
            that.setData({
              datas: list
            })
            console.log(masterArr);
            console.log(that.data.datas);
          },
          fail: function (e) {
            var masterArr = [];
            console.log(list);
            for (var i = 0; i < list.length; i++) {
              var masterjson = {};
              masterjson.id = list[i].id;
              masterjson.ids = [];
              for (var j = 0; j < list[i].dots.length; j++) {
                masterjson.ids.push(list[i].dots[j].id)
              }
              masterjson.num = 0;
              masterArr.push(masterjson)
            }
            wx.setStorage({
              key: 'masterjson',
              data: masterArr,
            })
          }
        })

      }
    }); 
  }
})