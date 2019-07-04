// pages/chapter/chapter.js
const app = getApp()
const userApi = require('../../libraries/user.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas:[],
    master_num:'',
    master_Percentage:'',
    total:'',
    master_no:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // let chapter_id = 4107;
    let chapter_id = '';
    if (options.id){
      chapter_id = options.id;
    }
    if (options.title) {
      wx.setNavigationBarTitle({
        title: options.title
      })  
    }
    var last_allid ={}; 
    var _total = '';
    wx.showLoading({
      title: '正在加载',
    })
    wx.getStorage({
      key: 'last_allid',
      success(res) {
        last_allid = res.data;
        console.log(res.data)
        userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/practice_chapter", { id: chapter_id }, function (res) {
          if (res.data.code == 200) {
            var _list = res.data.data.list.data;
            for (var i = 0; i < _list.length;i++){
              if (last_allid.chapterid && last_allid.chapterid == _list[i].id ){
                _list[i].lastpractice = 1;
              }else{
                _list[i].lastpractice = 0;
              } 
            }
            that.setData({
              datas: res.data.data.list.data,
              total: res.data.data.list.dot_count
            },function(){
              wx.hideLoading({
                title: '正在加载',
              })
            })
            _total = res.data.data.list.dot_count;
            wx.getStorage({
              key: 'chapterdatasArr',
              success(res) {
                console.log(res);
                var chapterdatasArr = res.data;
                var master_num = 0;
                for (let i = 0; i < chapterdatasArr.length; i++) {
                  if (chapter_id == chapterdatasArr[i].id) {
                    if (chapterdatasArr[i].knowledgeNum) {
                      master_num = chapterdatasArr[i].knowledgeNum;
                    }
                  }
                }
                var _total = that.data.total;
                var _Percentage = parseInt(master_num / _total * 100);
                var _master_no = parseInt(_total - master_num);
                that.setData({
                  master_num: master_num,
                  master_Percentage: _Percentage,
                  master_no: _master_no
                }, function () {

                })
              },
              fail: function (e) {

              }
            })
          }
        });
      },
      fail: function (e) {
        
      }
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

  gotolist: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    var lock = e.currentTarget.dataset.lock;
    if (lock == 1) {
      wx.navigateTo({
        url: '../vip/vip',
      })
      return;
    }
    wx.getStorage({
      key: 'last_allid',
      success(res) {
        var last_allid = res.data;
        last_allid.chapterid = id;
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
      url: '../examlist/examlist?id=' + id + '&title=' + name,
    })
  }
})