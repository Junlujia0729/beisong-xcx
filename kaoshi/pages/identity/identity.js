// pages/home/home.js
const app = getApp()
const userApi = require('../../libraries/user.js')

Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    select_level:0,
    select_subject: 0,
    subjects:[],
    levels:[],
    ischoose:0,
    provincelist:[],
    provinceid:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    var storageIdentily = {};
    
    wx.getStorage({
      key: 'identity',
      success(res) {
        storageIdentily = JSON.parse(res.data);
        that.initdatas(storageIdentily);
      },
      fail:function(e){
        storageIdentily.province = 0;
        storageIdentily.level = 0;
        storageIdentily.subject = 0;
        that.initdatas(storageIdentily);
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
    //未设置电话号码
    // if (app.globalData.mobile == "") {
    //   wx.navigateTo({
    //     url: '../getphone/getphone',
    //   })
    // }
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
    const id = e.currentTarget.dataset.id;
    that.setData({
      select_level: e.currentTarget.dataset.id
    });
    var _subjects = that.data.subjects;
    if (id == 1){
      for (var item in _subjects) {
        _subjects[item].type =2;
      }
      that.setData({
        ischoose: 1,
        select_subject:0
      })
    } else if (id == 2) {
      for (var item in _subjects) {
        _subjects[item].type = 0;
      }
      if (!that.data.select_level || !that.data.select_subject || !that.data.provinceid){
        that.setData({
          ischoose: 0
        })
      }
    }else if (id == 3){
      for (var item in _subjects) {
        _subjects[item].type = 0;
        if (_subjects[item].name == '体育'){
          _subjects[item].type = 2;
        }
      }
      if (!that.data.select_level || !that.data.select_subject || !that.data.provinceid) {
        that.setData({
          ischoose: 0
        })
      }
    } else if (id == 4) {
      for (var item in _subjects) {
        if (_subjects[item].name == '体育' || _subjects[item].name == '数学') {
          _subjects[item].type = 2;
        }else{
          _subjects[item].type = 0;
        }
      }
      if (!that.data.select_level || !that.data.select_subject || !that.data.provinceid) {
        that.setData({
          ischoose: 0
        })
      }
    }
    that.setData({
      subjects: _subjects
    })
  },
  // 选择学科
  chooseSubject: function (e) {
    let that = this;
    let select_subject = e.currentTarget.dataset.id;
    var _subjects = that.data.subjects;
    for (var item in _subjects) {
      _subjects[item].type = 0;
    }
    that.setData({
      select_subject: e.currentTarget.dataset.id,
      subjects: _subjects
    });
    if (that.data.select_level && that.data.select_subject && that.data.provinceid){
      that.setData({
        ischoose: 1
      })
    }
  },
  // 选择城市
  chooseProvince:function(e){
    let that = this;
    const id = e.currentTarget.dataset.id;
    that.setData({
      provinceid: e.currentTarget.dataset.id
    });
    if (that.data.select_level && that.data.select_subject && that.data.provinceid) {
      that.setData({
        ischoose: 1
      })
    }
  },
  choose:function(){
    var that =this;
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/recite_identify", {
      province: that.data.provinceid, level: that.data.select_level, subject: that.data.select_subject
    }, function (res) {
      var identity = {};
      identity.province = that.data.provinceid;
      identity.level = that.data.select_level;
      identity.subject = that.data.select_subject;

      var _identity = JSON.stringify(identity);
      console.log(_identity);
      
      wx.setStorage({
        key: 'identity',
        data: _identity,
        success:function(){
          console.log('存储成功')
          wx.switchTab({
            url: '../index/index'
          })
        }
      })
      
    }); 
    
  },

  // 初始化数据
  initdatas: function (storageIdentily){
    console.log(storageIdentily);

    var that = this;
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/recite_params", {

    }, function (res) {
      var level = [];
      for (var i in res.data.data.level) {
        var item = {};
        item.id = i;
        item.name = res.data.data.level[i];
        level.push(item);
      }
      var subject = [];
      for (var i in res.data.data.subject) {
        var item = {};
        item.id = i;
        item.name = res.data.data.subject[i];
        if (storageIdentily.subject == i) {
          item.type = 1
        } else {
          item.type = 0;
        }
        subject.push(item);
      }
      var province = [];
      for (var i in res.data.data.province) {
        var item = {};
        item.id = i;
        item.name = res.data.data.province[i];
        province.push(item);
      }
      that.setData({
        levels: level,
        subjects: subject,
        provincelist: province,
        select_level: storageIdentily.level,
        select_subject: storageIdentily.subject,
        provinceid: storageIdentily.province
      })
      if (storageIdentily.level && storageIdentily.subject && storageIdentily.province) {
        that.setData({
          ischoose: 1
        });
      }
    });
  }
})