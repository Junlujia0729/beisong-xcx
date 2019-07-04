const app = getApp()
const userApi = require('../../libraries/user.js')

Page({
  data: {
    currentTab: 0,
    tab_items:[],
    post_id:2,
    articledata2:[],
    clientHeight: 0
  },
  onLoad(params) {
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/province_regulation", {
    }, function (res) {
      let _citylist = res.data.data.area;
      for (let i = 0; i < _citylist.length; i++) {
        if (i == 0) {
          _citylist[i].active = 1;
        } else {
          _citylist[i].active = 0;
        }
      }
      that.setData({
        citylist: _citylist
      })
      userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/regulation_list", {
        id: _citylist[0].id
      }, function (res) {
        that.setData({
          datas: res.data.data.result,
          active_cityid: _citylist[0].id
        })
      });
    });

    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/find_list", {}, function (res) {
      console.log(res.data);
      that.setData({
        articledata: res.data.data
      });
    });

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    const that = this;
    wx.stopPullDownRefresh();
  },

  onShow: function () {
    const that = this
    
  },
  swiperTab: function(e) {
    var that = this;
  },
  //点击切换
  clickTab:function(e) {
    var that =this;
    let toTab = e.target.dataset.current;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })  
    }
  },

  // 查看详情
  Todetail:function(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../articledetail/articledetail?id='+id,
    })
  },
  //简章详情
  gotoDetail:function(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../regudetail/regudetail?id=' + id,
    })
    
  },
  chooceCity: function (e) {
    let that = this;
    let _index = e.currentTarget.dataset.index;
    let _cityid = e.currentTarget.dataset.cityid;
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/regulation_list", {
      id: _cityid
    }, function (res) {
      let _citylist = that.data.citylist;
      for (let i = 0; i < _citylist.length; i++) {
        if (i == _index) {
          _citylist[i].active = 1;
        } else {
          _citylist[i].active = 0;
        }
      }
      //let citylist_str = 'citylist[' + _index + '].active';
      that.setData({
        citylist: _citylist,
        datas: res.data.data.result,
        active_cityid: _cityid
      })
    });
  },
  
})





